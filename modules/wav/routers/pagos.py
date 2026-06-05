import sys
import os
from typing import List

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", ".."))
from shared.base_module import create_auth_dependency

from database import get_db
from config import get_settings
from services.pago_service import PagoService
from schemas.pago import (
    PagoContadoCreate,
    PagoContadoResponse,
    PlanPagoCreate,
    PlanPagoResponse,
)

settings = get_settings()
get_current_user = create_auth_dependency(settings.seguridad_url)

router = APIRouter(prefix="/pagos", tags=["Pagos"])


@router.post("/contado", response_model=PagoContadoResponse, status_code=201)
def create_pago_contado(
    data: PagoContadoCreate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    service = PagoService(db)
    return service.create_pago_contado(data.model_dump())


@router.post("/plan-pago", response_model=PlanPagoResponse, status_code=201)
def create_plan_pago(
    data: PlanPagoCreate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    service = PagoService(db)
    return service.create_plan_pago(data.model_dump())


@router.get("/by-cuenta/{id}")
def list_pagos_by_cuenta(
    id: int,
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    service = PagoService(db)
    return service.list_pagos_by_cuenta(id, skip=skip, limit=limit)
