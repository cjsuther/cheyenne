import sys
import os
from decimal import Decimal
from datetime import datetime, timezone
from typing import Optional

from fastapi import APIRouter, Depends, Query, HTTPException, status
from sqlalchemy.orm import Session
from starlette.requests import Request
from pydantic import BaseModel

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", ".."))
from shared.base_module import create_auth_dependency
from shared.filters import filtered_query

from database import get_db
from config import get_settings
from models.apremios import (
    Juicio, ActoProcesal, ESTADOS_JUICIO, TRANSICIONES,
)

settings = get_settings()
get_current_user = create_auth_dependency(settings.seguridad_url)


def _postear_contab(tipo, origen_ref, importe, concepto, contexto, token):
    """POST best-effort a Contabilidad del hecho económico. No rompe el flujo."""
    import httpx
    try:
        if not importe or float(importe) <= 0:
            return
        with httpx.Client(timeout=6) as c:
            c.post(f"{settings.contabilidad_url}/transacciones",
                   json={"origen_modulo": "apremios", "origen_ref": str(origen_ref), "tipo": tipo,
                         "fecha": None, "importe": float(importe), "concepto": concepto, "contexto": contexto or {}},
                   headers={"Authorization": token} if token else {})
    except Exception:
        pass


def _requiere(cu, permiso):
    if cu.get("superuser"):
        return
    if permiso not in [p["codigo"] for p in cu.get("permisos", [])]:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=f"No tiene el permiso '{permiso}'")


def _dec(v) -> Decimal:
    return Decimal(str(v or 0)).quantize(Decimal("0.01"))


def _consultar_deuda(id_contribuyente: int, token: str):
    """Best-effort HTTP a ingresos_publicos: obtiene la deuda del contribuyente.
    NUNCA rompe el flujo (try/except). Devuelve un Decimal o None."""
    if not id_contribuyente:
        return None
    import httpx
    try:
        headers = {"Authorization": token} if token else {}
        with httpx.Client(timeout=6) as client:
            resp = client.get(
                f"{settings.ingresos_publicos_url}/contribuyentes/{id_contribuyente}/objetos",
                headers=headers,
            )
        if resp.status_code >= 400:
            return None
        data = resp.json()
        # Intento tolerante: sumar deuda de cuentas si vienen, o campos directos.
        total = Decimal("0")
        if isinstance(data, dict):
            for key in ("deuda_total", "deuda", "saldo", "saldo_total"):
                if data.get(key) is not None:
                    return _dec(data[key])
            for cta in (data.get("cuentas") or []):
                for key in ("deuda", "saldo", "deuda_total", "saldo_total"):
                    if isinstance(cta, dict) and cta.get(key) is not None:
                        total += _dec(cta[key])
                        break
        return total if total > 0 else None
    except Exception:
        return None


juicios_router = APIRouter(prefix="/juicios", tags=["Juicios de Apremio"])

_J = ["id", "id_contribuyente", "contribuyente_nombre", "caratula", "juzgado",
      "deuda_capital", "deuda_actualizada", "estado", "fecha_inicio",
      "expediente_judicial", "created_at", "activo"]


class JuicioIn(BaseModel):
    id_contribuyente: Optional[int] = None
    contribuyente_nombre: Optional[str] = None
    caratula: str
    juzgado: Optional[str] = None
    deuda_capital: Decimal = Decimal("0")
    deuda_actualizada: Decimal = Decimal("0")
    fecha_inicio: Optional[datetime] = None
    expediente_judicial: Optional[str] = None
    activo: bool = True


class AvanzarIn(BaseModel):
    estado: str
    detalle: Optional[str] = None
    fecha: Optional[datetime] = None


def _serial(x):
    return {c: getattr(x, c) for c in _J}


@juicios_router.get("")
def listar_juicios(request: Request, estado: str = Query(None), juzgado: str = Query(None),
                   skip: int = Query(0, ge=0), limit: int = Query(50, ge=1, le=200),
                   db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "apremios_read")
    q = db.query(Juicio).filter(Juicio.activo == True)  # noqa: E712
    if estado:
        q = q.filter(Juicio.estado == estado)
    if juzgado:
        q = q.filter(Juicio.juzgado.ilike(f"%{juzgado}%"))
    q = filtered_query(q, Juicio, dict(request.query_params),
                       exclude={"skip", "limit", "estado", "juzgado"},
                       default_sort="created_at", default_dir="desc")
    return [_serial(x) for x in q.offset(skip).limit(limit).all()]


@juicios_router.get("/{id}")
def obtener_juicio(id: int, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "apremios_read")
    x = db.query(Juicio).filter(Juicio.id == id).first()
    if not x:
        raise HTTPException(status_code=404, detail="Juicio inexistente")
    return _serial(x)


@juicios_router.post("", status_code=201)
def crear_juicio(data: JuicioIn, request: Request, db: Session = Depends(get_db),
                 current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "apremios_write")
    payload = data.model_dump()
    x = Juicio(**payload)
    x.estado = "iniciado"
    if not x.fecha_inicio:
        x.fecha_inicio = datetime.now(timezone.utc)
    # Consulta best-effort de la deuda del contribuyente a ingresos_publicos
    if data.id_contribuyente and (not data.deuda_capital or _dec(data.deuda_capital) == 0):
        deuda = _consultar_deuda(data.id_contribuyente, request.headers.get("authorization"))
        if deuda is not None:
            x.deuda_capital = deuda
            if not x.deuda_actualizada or _dec(x.deuda_actualizada) == 0:
                x.deuda_actualizada = deuda
    db.add(x); db.commit(); db.refresh(x)
    # Acto procesal de inicio del expediente
    db.add(ActoProcesal(id_juicio=x.id, tipo="inicio_demanda",
                        fecha=x.fecha_inicio, detalle="Inicio de juicio de apremio"))
    db.commit()
    # ledger: reclasifica la deuda a gestión judicial (Deudores judiciales a Deudores por tributos)
    _postear_contab("apremios.iniciado", f"juicio-{x.id}", x.deuda_capital,
                    f"Apremio {x.caratula or ''} #{x.id}",
                    {"id_juicio": x.id, "id_contribuyente": x.id_contribuyente},
                    request.headers.get("authorization"))
    return _serial(x)


@juicios_router.put("/{id}")
def editar_juicio(id: int, data: JuicioIn, db: Session = Depends(get_db),
                  current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "apremios_write")
    x = db.query(Juicio).filter(Juicio.id == id).first()
    if not x:
        raise HTTPException(status_code=404, detail="Juicio inexistente")
    for k, v in data.model_dump().items():
        # el estado se maneja sólo por el circuito, no por PUT
        if k == "activo":
            setattr(x, k, v)
        elif k != "estado":
            setattr(x, k, v)
    db.commit(); db.refresh(x)
    return _serial(x)


@juicios_router.post("/{id}/avanzar")
def avanzar_juicio(id: int, data: AvanzarIn, request: Request, db: Session = Depends(get_db),
                   current_user: dict = Depends(get_current_user)):
    """Avanza el juicio a un nuevo estado del circuito, registrando el ActoProcesal."""
    _requiere(current_user, "apremios_gestionar")
    x = db.query(Juicio).filter(Juicio.id == id).first()
    if not x:
        raise HTTPException(status_code=404, detail="Juicio inexistente")
    destino = (data.estado or "").strip()
    if destino not in ESTADOS_JUICIO:
        raise HTTPException(status_code=400, detail=f"Estado inválido: {destino}")
    permitidos = TRANSICIONES.get(x.estado, ())
    if destino not in permitidos:
        raise HTTPException(
            status_code=409,
            detail=f"Transición no permitida: de '{x.estado}' a '{destino}'. Permitidas: {list(permitidos)}",
        )
    anterior = x.estado
    x.estado = destino
    fecha = data.fecha or datetime.now(timezone.utc)
    detalle = data.detalle or f"Cambio de estado: {anterior} → {destino}"
    db.add(ActoProcesal(id_juicio=x.id, tipo=destino, fecha=fecha, detalle=detalle))
    db.commit(); db.refresh(x)
    # ledger: al cobrar el juicio, ingresa la recaudación (Recaudación a Deudores judiciales)
    if destino == "cobrado":
        _postear_contab("apremios.cobrado", f"juicio-cobro-{x.id}",
                        x.deuda_actualizada or x.deuda_capital,
                        f"Cobro apremio #{x.id}", {"id_juicio": x.id},
                        request.headers.get("authorization"))
    return _serial(x)


@juicios_router.delete("/{id}")
def baja_juicio(id: int, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "apremios_admin")
    x = db.query(Juicio).filter(Juicio.id == id).first()
    if not x:
        raise HTTPException(status_code=404, detail="Juicio inexistente")
    x.activo = False; db.commit()
    return {"message": "dado de baja"}
