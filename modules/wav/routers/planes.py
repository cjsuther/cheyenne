"""Simulación y adhesión de plan de pago desde el portal, y ABM básico de débito
automático. La simulación reusa el simulador de ingresos_publicos por HTTP."""
import sys
import os
import logging
from typing import List, Optional

from fastapi import APIRouter, Depends, Query, HTTPException, status, Body
from sqlalchemy.orm import Session
from starlette.requests import Request
from pydantic import BaseModel
import httpx

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", ".."))
from shared.base_module import create_auth_dependency
from shared.filters import filtered_query

from database import get_db
from config import get_settings
from models.adhesion_debito import AdhesionDebito

settings = get_settings()
get_current_user = create_auth_dependency(settings.seguridad_url)

router = APIRouter(prefix="/planes", tags=["Planes / Débito"])
logger = logging.getLogger("wav.planes")

MEDIOS = ("tarjeta", "cbu")


def _requiere(cu, permiso):
    if cu.get("superuser"):
        return
    if permiso not in [p["codigo"] for p in cu.get("permisos", [])]:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=f"No tiene el permiso '{permiso}'")


# ── Simulación de plan (reusa ingresos_publicos por HTTP) ────────────

class SimularPlanRequest(BaseModel):
    monto_total: float
    cantidad_cuotas: int
    tasa_interes_pct: float = 0
    anticipo: float = 0


@router.post("/simular")
def simular_plan(
    data: SimularPlanRequest,
    request: Request,
    current_user: dict = Depends(get_current_user),
):
    """Simula un plan de pago para el contribuyente reusando el simulador de
    ingresos_publicos (amortización francesa). Best-effort con fallback local."""
    token = request.headers.get("authorization")
    payload = data.model_dump()
    try:
        headers = {"Authorization": token} if token else {}
        with httpx.Client(timeout=15) as client:
            resp = client.post(
                f"{settings.ingresos_publicos_url}/planes-pago/simular",
                headers=headers, json=payload,
            )
        if resp.status_code < 400:
            return resp.json()
        logger.warning("ingresos_publicos simular HTTP %s", resp.status_code)
    except Exception as e:
        logger.warning("no se pudo simular en ingresos_publicos: %s", e)

    # Fallback local: cuota fija simple sobre el saldo financiado
    monto_financiado = max(float(data.monto_total) - float(data.anticipo), 0.0)
    n = max(int(data.cantidad_cuotas), 1)
    interes = monto_financiado * float(data.tasa_interes_pct) / 100.0
    total = monto_financiado + interes
    cuota = round(total / n, 2)
    cuotas = [
        {"numero": i + 1, "capital": round(monto_financiado / n, 2),
         "interes": round(interes / n, 2), "importe": cuota,
         "saldo": round(total - cuota * (i + 1), 2)}
        for i in range(n)
    ]
    return {
        "monto_total": float(data.monto_total),
        "anticipo": float(data.anticipo),
        "monto_financiado": monto_financiado,
        "cantidad_cuotas": n,
        "total_intereses": round(interes, 2),
        "total_a_pagar": round(total + float(data.anticipo), 2),
        "cuotas": cuotas,
        "origen": "wav-fallback",
    }


# ── Adhesión a débito automático (ABM básico) ───────────────────────

class AdhesionDebitoIn(BaseModel):
    id_cuenta: int
    medio: str
    datos: Optional[str] = None
    titular: Optional[str] = None
    activo: bool = True


class AdhesionDebitoResponse(BaseModel):
    id: int
    id_cuenta: int
    medio: str
    datos: Optional[str] = None
    titular: Optional[str] = None
    activo: bool

    class Config:
        from_attributes = True


def _validar_medio(medio: str):
    if medio not in MEDIOS:
        raise HTTPException(status_code=422, detail=f"medio debe ser uno de {MEDIOS}")


@router.get("/adhesiones-debito", response_model=List[AdhesionDebitoResponse])
def list_adhesiones(
    request: Request,
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=200),
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    q = db.query(AdhesionDebito)
    q = filtered_query(
        q, AdhesionDebito, dict(request.query_params),
        exclude={"skip", "limit"}, default_sort="-id",
    )
    return q.offset(skip).limit(limit).all()


@router.get("/adhesiones-debito/by-cuenta/{id_cuenta}", response_model=List[AdhesionDebitoResponse])
def list_adhesiones_by_cuenta(
    id_cuenta: int,
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=200),
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    return (
        db.query(AdhesionDebito)
        .filter(AdhesionDebito.id_cuenta == id_cuenta, AdhesionDebito.activo == True)
        .order_by(AdhesionDebito.id.desc())
        .offset(skip).limit(limit).all()
    )


@router.post("/adhesiones-debito", response_model=AdhesionDebitoResponse, status_code=201)
def create_adhesion(
    data: AdhesionDebitoIn,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    _validar_medio(data.medio)
    adh = AdhesionDebito(**data.model_dump())
    db.add(adh)
    db.commit()
    db.refresh(adh)
    return adh


@router.put("/adhesiones-debito/{id}", response_model=AdhesionDebitoResponse)
def update_adhesion(
    id: int,
    data: AdhesionDebitoIn,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    _validar_medio(data.medio)
    adh = db.query(AdhesionDebito).filter(AdhesionDebito.id == id).first()
    if not adh:
        raise HTTPException(status_code=404, detail="Adhesión no encontrada")
    for k, v in data.model_dump().items():
        setattr(adh, k, v)
    db.commit()
    db.refresh(adh)
    return adh


@router.delete("/adhesiones-debito/{id}")
def delete_adhesion(
    id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    """Baja lógica de la adhesión (soft-delete)."""
    adh = db.query(AdhesionDebito).filter(AdhesionDebito.id == id).first()
    if not adh:
        raise HTTPException(status_code=404, detail="Adhesión no encontrada")
    adh.activo = False
    db.commit()
    return {"ok": True, "id": id}
