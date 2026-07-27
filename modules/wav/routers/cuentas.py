import sys
import os
from typing import List

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", ".."))
from shared.base_module import create_auth_dependency

from database import get_db
from config import get_settings
from services.cuenta_service import CuentaService
from schemas.cuenta import CuentaCreate, CuentaResponse

settings = get_settings()
get_current_user = create_auth_dependency(settings.seguridad_url)

router = APIRouter(prefix="/cuentas", tags=["Cuentas"])


@router.get("", response_model=List[CuentaResponse])
def list_cuentas(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    service = CuentaService(db)
    return service.list(skip=skip, limit=limit)


@router.get("/by-numero/{numero}", response_model=CuentaResponse)
def get_cuenta_by_numero(
    numero: str,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    service = CuentaService(db)
    return service.find_by_numero(numero)


@router.get("/by-contribuyente/{id}", response_model=List[CuentaResponse])
def list_cuentas_by_contribuyente(
    id: int,
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    service = CuentaService(db)
    return service.list_by_contribuyente(id, skip=skip, limit=limit)


@router.get("/{id}", response_model=CuentaResponse)
def get_cuenta(
    id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    service = CuentaService(db)
    return service.find_by_id(id)


@router.post("", response_model=CuentaResponse, status_code=201)
def create_cuenta(
    data: CuentaCreate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    service = CuentaService(db)
    return service.create(data.model_dump())
