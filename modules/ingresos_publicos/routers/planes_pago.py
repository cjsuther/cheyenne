import sys
import os
from typing import List, Optional

from fastapi import APIRouter, Depends, Query
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

settings = get_settings()
get_current_user = create_auth_dependency(settings.seguridad_url)

router = APIRouter(prefix="/planes-pago", tags=["Planes de Pago"])


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
