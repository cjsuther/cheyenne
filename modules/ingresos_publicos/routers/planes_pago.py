import sys
import os
from typing import List, Optional
from datetime import date
from decimal import Decimal

from pydantic import BaseModel
from fastapi import APIRouter, Depends, Query, HTTPException, status
from sqlalchemy.orm import Session
from starlette.requests import Request

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", ".."))
from shared.base_module import create_auth_dependency
from shared.filters import filtered_query

from database import get_db
from config import get_settings
from services.plan_pago_service import PlanPagoService
from models.plan_pago import PlanPago
from models.plan_pago_definicion import PlanPagoDefinicion
from schemas.plan_pago import (
    PlanPagoCreate, PlanPagoUpdate, PlanPagoResponse,
    PlanPagoDefinicionCreate, PlanPagoDefinicionUpdate, PlanPagoDefinicionResponse,
)
from schemas.plan_pago_cuota import (
    SimularPlanRequest, SimularPlanResponse, PlanPagoCuotaResponse,
)

settings = get_settings()
get_current_user = create_auth_dependency(settings.seguridad_url)

router = APIRouter(prefix="/planes-pago", tags=["Planes de Pago"])


def _requiere(cu, permiso):
    if cu.get("superuser"):
        return
    if permiso not in [p["codigo"] for p in cu.get("permisos", [])]:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=f"No tiene el permiso '{permiso}'")


class SimularMoratoriaRequest(BaseModel):
    id_regimen: int
    deuda_capital: Decimal
    deuda_intereses: Decimal = Decimal("0")
    cantidad_cuotas: Optional[int] = None


class GenerarMoratoriaRequest(SimularMoratoriaRequest):
    id_cuenta: Optional[int] = None
    id_contribuyente: Optional[int] = None
    id_plan_pago_definicion: Optional[int] = None
    primer_vencimiento: Optional[date] = None
    periodicidad_meses: int = 1


# ── Moratoria (motor de cuota + régimen) — ANTES de /{id} ────────────

@router.post("/simular-moratoria")
def simular_moratoria(
    data: SimularMoratoriaRequest,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    """Simula un plan bajo un régimen de moratoria (quita de intereses + anticipo + francés)."""
    return PlanPagoService(db).simular_moratoria(
        id_regimen=data.id_regimen, deuda_capital=data.deuda_capital,
        deuda_intereses=data.deuda_intereses, cantidad_cuotas=data.cantidad_cuotas,
    )


@router.post("/generar", status_code=201)
def generar_plan_moratoria(
    data: GenerarMoratoriaRequest,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    """Consolida la deuda en un plan bajo el régimen: crea el PlanPago y persiste sus cuotas."""
    _requiere(current_user, "ingresos_planes")
    return PlanPagoService(db).generar_desde_deuda(
        id_regimen=data.id_regimen, deuda_capital=data.deuda_capital,
        deuda_intereses=data.deuda_intereses, cantidad_cuotas=data.cantidad_cuotas,
        id_cuenta=data.id_cuenta, id_contribuyente=data.id_contribuyente,
        id_plan_pago_definicion=data.id_plan_pago_definicion,
        primer_vencimiento=data.primer_vencimiento, periodicidad_meses=data.periodicidad_meses,
    )


# ── Cálculo de plan (ANTES de /{id}) ─────────────────────────────────

@router.post("/simular", response_model=SimularPlanResponse)
def simular_plan(
    data: SimularPlanRequest,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    """Simula un plan (amortización francesa) sin persistirlo — preview para el contribuyente."""
    return PlanPagoService(db).simular(
        monto_total=data.monto_total, cantidad_cuotas=data.cantidad_cuotas,
        tasa_interes_pct=data.tasa_interes_pct, anticipo=data.anticipo,
    )


@router.post("/{id}/generar-cuotas")
def generar_cuotas(id: int, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    """Calcula y persiste las cuotas de un plan (sistema francés, según su definición)."""
    return PlanPagoService(db).generar_cuotas(id)


@router.get("/{id}/cuotas", response_model=List[PlanPagoCuotaResponse])
def list_cuotas(id: int, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    return PlanPagoService(db).list_cuotas(id)


# ── Definiciones (ANTES de /{id}) ────────────────────────────────────

@router.get("/definiciones", response_model=List[PlanPagoDefinicionResponse])
def list_plan_pago_definiciones(
    request: Request,
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    activo: Optional[bool] = Query(None),
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    query = db.query(PlanPagoDefinicion)
    if activo is not None:
        query = query.filter(PlanPagoDefinicion.activo == activo)
    query = filtered_query(query, PlanPagoDefinicion, dict(request.query_params), exclude={'skip', 'limit', 'activo'})
    return query.offset(skip).limit(limit).all()


@router.get("/definiciones/{id}", response_model=PlanPagoDefinicionResponse)
def get_plan_pago_definicion(
    id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    service = PlanPagoService(db)
    return service.find_definicion_by_id(id)


@router.post("/definiciones", response_model=PlanPagoDefinicionResponse, status_code=201)
def create_plan_pago_definicion(
    data: PlanPagoDefinicionCreate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    service = PlanPagoService(db)
    return service.add_definicion(data.model_dump())


@router.put("/definiciones/{id}", response_model=PlanPagoDefinicionResponse)
def update_plan_pago_definicion(
    id: int,
    data: PlanPagoDefinicionUpdate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    service = PlanPagoService(db)
    return service.modify_definicion(id, data.model_dump(exclude_unset=True))


@router.delete("/definiciones/{id}")
def delete_plan_pago_definicion(
    id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    service = PlanPagoService(db)
    service.remove_definicion(id)
    return {"message": f"Definicion de plan de pago {id} desactivada"}


# ── Rutas con prefijo fijo (ANTES de /{id}) ──────────────────────────

@router.get("/by-cuenta/{id_cuenta}", response_model=List[PlanPagoResponse])
def list_planes_by_cuenta(
    id_cuenta: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    service = PlanPagoService(db)
    return service.list_by_cuenta(id_cuenta)


@router.get("/by-contribuyente/{id_contribuyente}", response_model=List[PlanPagoResponse])
def list_planes_by_contribuyente(
    id_contribuyente: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    service = PlanPagoService(db)
    return service.list_by_contribuyente(id_contribuyente)


# ── Planes de Pago CRUD ─────────────────────────────────────────────

@router.get("", response_model=List[PlanPagoResponse])
def list_planes_pago(
    request: Request,
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    query = db.query(PlanPago)
    query = filtered_query(query, PlanPago, dict(request.query_params), exclude={'skip', 'limit'})
    return query.offset(skip).limit(limit).all()


@router.get("/{id}", response_model=PlanPagoResponse)
def get_plan_pago(
    id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    service = PlanPagoService(db)
    return service.find_by_id(id)


@router.post("", response_model=PlanPagoResponse, status_code=201)
def create_plan_pago(
    data: PlanPagoCreate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    service = PlanPagoService(db)
    return service.add(data.model_dump())


@router.put("/{id}", response_model=PlanPagoResponse)
def update_plan_pago(
    id: int,
    data: PlanPagoUpdate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    service = PlanPagoService(db)
    return service.modify(id, data.model_dump(exclude_unset=True))


@router.delete("/{id}")
def cancel_plan_pago(
    id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    service = PlanPagoService(db)
    service.remove(id)
    return {"message": f"Plan de pago {id} cancelado"}
