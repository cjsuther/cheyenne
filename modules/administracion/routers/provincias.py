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
from models.provincia import Provincia
from services.provincia_service import ProvinciaService
from schemas.provincia import ProvinciaCreate, ProvinciaUpdate, ProvinciaResponse

settings = get_settings()
get_current_user = create_auth_dependency(settings.seguridad_url)

router = APIRouter(prefix="/provincias", tags=["Provincias"])


@router.get("", response_model=List[ProvinciaResponse])
def list_provincias(
    request: Request,
    id_pais: Optional[int] = Query(None),
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    query = db.query(Provincia)
    if id_pais is not None:
        query = query.filter(Provincia.id_pais == id_pais)
    query = filtered_query(query, Provincia, dict(request.query_params), exclude={'skip', 'limit', 'id_pais'})
    return query.offset(skip).limit(limit).all()


@router.get("/{id}", response_model=ProvinciaResponse)
def get_provincia(
    id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    service = ProvinciaService(db)
    return service.find_by_id(id)


@router.post("", response_model=ProvinciaResponse, status_code=201)
def create_provincia(
    data: ProvinciaCreate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    service = ProvinciaService(db)
    return service.add(data.model_dump())


@router.put("/{id}", response_model=ProvinciaResponse)
def update_provincia(
    id: int,
    data: ProvinciaUpdate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    service = ProvinciaService(db)
    return service.modify(id, data.model_dump(exclude_unset=True))


@router.delete("/{id}")
def delete_provincia(
    id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    service = ProvinciaService(db)
    service.remove(id)
    return {"message": f"Provincia {id} eliminada"}
