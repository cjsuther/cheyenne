import sys
import os
from typing import List, Optional
from decimal import Decimal
from datetime import date

from fastapi import APIRouter, Depends, Query, HTTPException, status, Body
from sqlalchemy.orm import Session
from starlette.requests import Request
from pydantic import BaseModel

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", ".."))
from shared.base_module import create_auth_dependency
from shared.filters import filtered_query

from database import get_db
from config import get_settings
from models.coeficiente import Coeficiente
from models.comprobante import Comprobante
from models.vencimiento_comprobante import VencimientoComprobante
from services.coeficiente_service import CoeficienteService
from services.cuenta_corriente_service import CuentaCorrienteService

settings = get_settings()
get_current_user = create_auth_dependency(settings.seguridad_url)

router = APIRouter(prefix="/emisiones", tags=["Emisiones · Coeficientes"])


def _requiere(cu, permiso):
    if cu.get("superuser"):
        return
    if permiso not in [p["codigo"] for p in cu.get("permisos", [])]:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=f"No tiene el permiso '{permiso}'")


# ── Coeficientes (curva temporal de recargos) ────────────────────────────
class CoeficienteIn(BaseModel):
    tipo_tributo: Optional[str] = None
    fecha_desde: date
    fecha_hasta: Optional[date] = None
    tipo: str = "mensual"  # mensual | diario
    valor: Decimal
    descripcion: Optional[str] = None


class CoeficienteUpdate(BaseModel):
    tipo_tributo: Optional[str] = None
    fecha_desde: Optional[date] = None
    fecha_hasta: Optional[date] = None
    tipo: Optional[str] = None
    valor: Optional[Decimal] = None
    descripcion: Optional[str] = None
    activo: Optional[bool] = None


@router.get("/coeficientes")
def list_coeficientes(
    request: Request,
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=200),
    tipo_tributo: Optional[str] = Query(None),
    activo: Optional[bool] = Query(True),
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    query = db.query(Coeficiente)
    if activo is not None:
        query = query.filter(Coeficiente.activo == activo)
    if tipo_tributo is not None:
        query = query.filter(Coeficiente.tipo_tributo == tipo_tributo)
    query = filtered_query(
        query, Coeficiente, dict(request.query_params),
        exclude={"skip", "limit", "activo", "tipo_tributo"},
        default_sort="fecha_desde",
    )
    return query.offset(skip).limit(limit).all()


@router.post("/coeficientes", status_code=201)
def crear_coeficiente(
    data: CoeficienteIn,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    _requiere(current_user, "emisiones_coeficientes")
    return CoeficienteService(db).crear(data.model_dump())


@router.put("/coeficientes/{id_coef}")
def actualizar_coeficiente(
    id_coef: int,
    data: CoeficienteUpdate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    _requiere(current_user, "emisiones_coeficientes")
    return CoeficienteService(db).actualizar(id_coef, data.model_dump(exclude_unset=True))


@router.delete("/coeficientes/{id_coef}")
def eliminar_coeficiente(
    id_coef: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    _requiere(current_user, "emisiones_coeficientes")
    CoeficienteService(db).eliminar(id_coef)
    return {"message": f"Coeficiente {id_coef} desactivado"}


@router.post("/coeficientes/recalcular-recargo")
def recalcular_recargo(
    data: dict = Body(...),
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    """Recalcula el recargo por mora de un saldo/comprobante a una fecha de corte,
    recorriendo la curva de coeficientes. Devuelve el desglose por tramos.

    Body: {saldo, fecha_vencimiento, fecha_corte?, tipo_tributo?}
    o bien {numero_comprobante, fecha_corte?} para tomar los saldos vigentes.
    """
    fecha_corte = data.get("fecha_corte")
    svc = CoeficienteService(db)
    numero = data.get("numero_comprobante")
    if numero:
        from models.cuenta_corriente import CuentaCorriente
        filas = (
            db.query(CuentaCorriente)
            .filter(CuentaCorriente.numero_comprobante == numero,
                    CuentaCorriente.activo == True,
                    CuentaCorriente.saldo > 0)
            .all()
        )
        if not filas:
            raise HTTPException(status_code=404, detail=f"Sin deuda vigente para {numero}")
        detalle = []
        total_recargo = 0.0
        total_a_pagar = 0.0
        for c in filas:
            r = svc.calcular_recargo(c.saldo, c.fecha_vencimiento, fecha_corte, c.tipo_tributo)
            total_recargo += float(r["recargo"])
            total_a_pagar += float(r["total_a_pagar"])
            detalle.append({"id_cuenta_corriente": c.id, "saldo": float(c.saldo or 0), **{
                "dias_mora": r["dias_mora"], "recargo": float(r["recargo"]),
                "total_a_pagar": float(r["total_a_pagar"]), "tramos": r["tramos"]}})
        return {"numero_comprobante": numero, "fecha_corte": fecha_corte,
                "recargo_total": round(total_recargo, 2),
                "total_a_pagar": round(total_a_pagar, 2), "detalle": detalle}
    saldo = data.get("saldo")
    fv = data.get("fecha_vencimiento")
    if saldo is None or not fv:
        raise HTTPException(status_code=400,
                            detail="Enviar {saldo, fecha_vencimiento} o {numero_comprobante}")
    r = svc.calcular_recargo(saldo, fv, fecha_corte, data.get("tipo_tributo"))
    return {"dias_mora": r["dias_mora"], "recargo": float(r["recargo"]),
            "total_a_pagar": float(r["total_a_pagar"]), "tramos": r["tramos"]}


# ── Vencimientos múltiples por comprobante ───────────────────────────────
class VencimientoIn(BaseModel):
    numero: int = 1
    fecha_vencimiento: Optional[date] = None
    importe: Decimal = Decimal("0")
    tipo: str = "aPagar"  # aCancelar | aPagar


@router.get("/comprobantes/{id_comprobante}/vencimientos")
def list_vencimientos(
    id_comprobante: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    return (
        db.query(VencimientoComprobante)
        .filter(VencimientoComprobante.id_comprobante == id_comprobante,
                VencimientoComprobante.activo == True)
        .order_by(VencimientoComprobante.numero)
        .all()
    )


@router.put("/comprobantes/{id_comprobante}/vencimientos")
def set_vencimientos(
    id_comprobante: int,
    vencimientos: List[VencimientoIn] = Body(...),
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    """Define hasta 4 vencimientos para un comprobante (reemplaza los existentes)."""
    _requiere(current_user, "emisiones_coeficientes")
    comp = db.query(Comprobante).filter(Comprobante.id == id_comprobante).first()
    if not comp:
        raise HTTPException(status_code=404, detail=f"Comprobante {id_comprobante} no encontrado")
    if len(vencimientos) > 4:
        raise HTTPException(status_code=400, detail="Máximo 4 vencimientos por comprobante")
    from datetime import datetime, timezone
    db.query(VencimientoComprobante).filter(
        VencimientoComprobante.id_comprobante == id_comprobante
    ).delete()
    creados = []
    for v in vencimientos:
        tipo = v.tipo if v.tipo in ("aCancelar", "aPagar") else "aPagar"
        fv = None
        if v.fecha_vencimiento:
            fv = datetime(v.fecha_vencimiento.year, v.fecha_vencimiento.month,
                          v.fecha_vencimiento.day, tzinfo=timezone.utc)
        row = VencimientoComprobante(
            id_comprobante=id_comprobante,
            id_emision=comp.id_emision,
            numero=v.numero,
            fecha_vencimiento=fv,
            importe=v.importe,
            tipo=tipo,
        )
        db.add(row)
        creados.append(row)
    db.commit()
    for r in creados:
        db.refresh(r)
    return {"id_comprobante": id_comprobante, "vencimientos": len(creados)}
