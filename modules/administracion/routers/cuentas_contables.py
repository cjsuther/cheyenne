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
from models.cuenta_contable import CuentaContable
from services.cuenta_contable_service import CuentaContableService
from schemas.cuenta_contable import CuentaContableCreate, CuentaContableUpdate, CuentaContableResponse

settings = get_settings()
get_current_user = create_auth_dependency(settings.seguridad_url)

router = APIRouter(prefix="/cuentas-contables", tags=["Cuentas Contables"])


@router.get("", response_model=List[CuentaContableResponse])
def list_cuentas_contables(
    request: Request,
    agrupamiento: Optional[str] = Query(None),
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    query = db.query(CuentaContable)
    if agrupamiento:
        query = query.filter(CuentaContable.agrupamiento == agrupamiento)
    query = filtered_query(query, CuentaContable, dict(request.query_params), exclude={'skip', 'limit', 'agrupamiento'})
    return query.offset(skip).limit(limit).all()


@router.get("/{id}", response_model=CuentaContableResponse)
def get_cuenta_contable(
    id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    service = CuentaContableService(db)
    return service.find_by_id(id)


@router.post("", response_model=CuentaContableResponse, status_code=201)
def create_cuenta_contable(
    data: CuentaContableCreate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    service = CuentaContableService(db)
    return service.add(data.model_dump())


@router.put("/{id}", response_model=CuentaContableResponse)
def update_cuenta_contable(
    id: int,
    data: CuentaContableUpdate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    service = CuentaContableService(db)
    return service.modify(id, data.model_dump(exclude_unset=True))


@router.delete("/{id}")
def delete_cuenta_contable(
    id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    service = CuentaContableService(db)
    service.remove(id)
    return {"message": f"Cuenta contable {id} eliminada"}
