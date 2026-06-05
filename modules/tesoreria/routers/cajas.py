import sys
import os
from typing import List

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from starlette.requests import Request

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", ".."))
from shared.base_module import create_auth_dependency
from shared.filters import filtered_query

from database import get_db
from config import get_settings
from services.caja_service import CajaService
from models.caja import Caja
from models.caja_asignacion import CajaAsignacion
from schemas.caja import CajaCreate, CajaUpdate, CajaResponse
from schemas.caja_asignacion import CajaAsignacionCreate, CajaAsignacionUpdate, CajaAsignacionResponse

settings = get_settings()
get_current_user = create_auth_dependency(settings.seguridad_url)

router = APIRouter(prefix="/cajas", tags=["Cajas"])


@router.get("", response_model=List[CajaResponse])
def list_cajas(
    request: Request,
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    query = db.query(Caja)
    query = filtered_query(query, Caja, dict(request.query_params), exclude={'skip', 'limit'})
    return query.offset(skip).limit(limit).all()


@router.get("/{id}", response_model=CajaResponse)
def get_caja(
    id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    service = CajaService(db)
    return service.find_by_id(id)


@router.post("", response_model=CajaResponse, status_code=201)
def create_caja(
    data: CajaCreate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    service = CajaService(db)
    return service.add(data.model_dump())


@router.put("/{id}", response_model=CajaResponse)
def update_caja(
    id: int,
    data: CajaUpdate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    service = CajaService(db)
    return service.modify(id, data.model_dump(exclude_unset=True))


@router.delete("/{id}")
def delete_caja(
    id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    service = CajaService(db)
    service.remove(id)
    return {"message": f"Caja {id} eliminada"}


@router.get("/{id_caja}/asignaciones", response_model=List[CajaAsignacionResponse])
def list_asignaciones(
    request: Request,
    id_caja: int,
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    query = db.query(CajaAsignacion).filter(CajaAsignacion.id_caja == id_caja)
    query = filtered_query(query, CajaAsignacion, dict(request.query_params), exclude={'skip', 'limit', 'id_caja'})
    return query.offset(skip).limit(limit).all()


@router.post("/{id_caja}/asignaciones", response_model=CajaAsignacionResponse, status_code=201)
def create_asignacion(
    id_caja: int,
    data: CajaAsignacionCreate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    service = CajaService(db)
    asignacion_data = data.model_dump()
    asignacion_data["id_caja"] = id_caja
    return service.add_asignacion(asignacion_data)


@router.put("/asignaciones/{id}", response_model=CajaAsignacionResponse)
def update_asignacion(
    id: int,
    data: CajaAsignacionUpdate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    service = CajaService(db)
    return service.modify_asignacion(id, data.model_dump(exclude_unset=True))


@router.delete("/asignaciones/{id}")
def delete_asignacion(
    id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    service = CajaService(db)
    service.remove_asignacion(id)
    return {"message": f"CajaAsignacion {id} eliminada"}
