import sys
import os
from typing import List, Optional

from fastapi import APIRouter, Depends, Query, HTTPException, status
from sqlalchemy.orm import Session
from starlette.requests import Request

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", ".."))
from shared.base_module import create_auth_dependency
from shared.filters import filtered_query

from database import get_db
from config import get_settings
from services.cuenta_service import CuentaService
from models.cuenta import Cuenta
from schemas.cuenta import CuentaCreate, CuentaUpdate, CuentaResponse

settings = get_settings()
get_current_user = create_auth_dependency(settings.seguridad_url)

router = APIRouter(prefix="/cuentas", tags=["Cuentas"])


@router.get("", response_model=List[CuentaResponse])
def list_cuentas(
    request: Request,
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    q: Optional[str] = Query(None, min_length=3, description="Buscar por numero de cuenta o delegacion"),
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    query = db.query(Cuenta)
    if q:
        term = f"%{q}%"
        from sqlalchemy import or_
        query = query.filter(
            or_(
                Cuenta.numero_cuenta.ilike(term),
                Cuenta.codigo_delegacion.ilike(term),
            )
        )
    query = filtered_query(query, Cuenta, dict(request.query_params), exclude={'skip', 'limit', 'q'})
    return query.offset(skip).limit(limit).all()


@router.get("/by-numero/{numero}", response_model=CuentaResponse)
def get_cuenta_by_numero(
    numero: str,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    service = CuentaService(db)
    cuenta = service.find_by_numero(numero)
    if not cuenta:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Cuenta con numero {numero} no encontrada",
        )
    return cuenta


@router.get("/by-contribuyente/{id}", response_model=List[CuentaResponse])
def list_cuentas_by_contribuyente(
    id: int,
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
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
    return service.add(data.model_dump())


@router.put("/{id}", response_model=CuentaResponse)
def update_cuenta(
    id: int,
    data: CuentaUpdate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    service = CuentaService(db)
    return service.modify(id, data.model_dump(exclude_unset=True))


@router.delete("/{id}")
def delete_cuenta(
    id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    service = CuentaService(db)
    cuenta = service.find_by_id(id)
    cuenta.activo = False
    from datetime import datetime, timezone
    cuenta.fecha_baja = datetime.now(timezone.utc)
    db.commit()
    return {"message": f"Cuenta {id} dada de baja"}
