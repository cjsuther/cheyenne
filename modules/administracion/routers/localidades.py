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
from models.localidad import Localidad
from services.localidad_service import LocalidadService
from schemas.localidad import LocalidadCreate, LocalidadUpdate, LocalidadResponse

settings = get_settings()
get_current_user = create_auth_dependency(settings.seguridad_url)

router = APIRouter(prefix="/localidades", tags=["Localidades"])


@router.get("", response_model=List[LocalidadResponse])
def list_localidades(
    request: Request,
    id_provincia: Optional[int] = Query(None),
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    query = db.query(Localidad)
    if id_provincia is not None:
        query = query.filter(Localidad.id_provincia == id_provincia)
    query = filtered_query(query, Localidad, dict(request.query_params), exclude={'skip', 'limit', 'id_provincia'})
    return query.offset(skip).limit(limit).all()


@router.get("/{id}", response_model=LocalidadResponse)
def get_localidad(
    id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    service = LocalidadService(db)
    return service.find_by_id(id)


@router.post("", response_model=LocalidadResponse, status_code=201)
def create_localidad(
    data: LocalidadCreate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    service = LocalidadService(db)
    return service.add(data.model_dump())


@router.put("/{id}", response_model=LocalidadResponse)
def update_localidad(
    id: int,
    data: LocalidadUpdate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    service = LocalidadService(db)
    return service.modify(id, data.model_dump(exclude_unset=True))


@router.delete("/{id}")
def delete_localidad(
    id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    service = LocalidadService(db)
    service.remove(id)
    return {"message": f"Localidad {id} eliminada"}
