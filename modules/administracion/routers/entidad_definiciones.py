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
from models.entidad_definicion import EntidadDefinicion
from services.entidad_definicion_service import EntidadDefinicionService
from schemas.entidad_definicion import EntidadDefinicionCreate, EntidadDefinicionUpdate, EntidadDefinicionResponse

settings = get_settings()
get_current_user = create_auth_dependency(settings.seguridad_url)

router = APIRouter(prefix="/entidad-definiciones", tags=["Definiciones de Entidad"])


@router.get("", response_model=List[EntidadDefinicionResponse])
def list_entidad_definiciones(
    request: Request,
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    query = db.query(EntidadDefinicion)
    query = filtered_query(query, EntidadDefinicion, dict(request.query_params), exclude={'skip', 'limit'})
    return query.offset(skip).limit(limit).all()


@router.get("/{id}", response_model=EntidadDefinicionResponse)
def get_entidad_definicion(
    id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    service = EntidadDefinicionService(db)
    return service.find_by_id(id)


@router.post("", response_model=EntidadDefinicionResponse, status_code=201)
def create_entidad_definicion(
    data: EntidadDefinicionCreate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    service = EntidadDefinicionService(db)
    return service.add(data.model_dump())


@router.put("/{id}", response_model=EntidadDefinicionResponse)
def update_entidad_definicion(
    id: int,
    data: EntidadDefinicionUpdate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    service = EntidadDefinicionService(db)
    return service.modify(id, data.model_dump(exclude_unset=True))


@router.delete("/{id}")
def delete_entidad_definicion(
    id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    service = EntidadDefinicionService(db)
    service.remove(id)
    return {"message": f"Definición de entidad {id} eliminada"}
