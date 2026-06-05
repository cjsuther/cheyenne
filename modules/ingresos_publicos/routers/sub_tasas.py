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
from services.sub_tasa_service import SubTasaService
from models.sub_tasa import SubTasa
from schemas.sub_tasa import SubTasaCreate, SubTasaUpdate, SubTasaResponse

settings = get_settings()
get_current_user = create_auth_dependency(settings.seguridad_url)

router = APIRouter(prefix="/sub-tasas", tags=["Sub-Tasas"])


@router.get("", response_model=List[SubTasaResponse])
def list_sub_tasas(
    request: Request,
    id_tasa: Optional[int] = Query(None),
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    query = db.query(SubTasa)
    if id_tasa is not None:
        query = query.filter(SubTasa.id_tasa == id_tasa)
    query = filtered_query(query, SubTasa, dict(request.query_params), exclude={'skip', 'limit', 'id_tasa'})
    return query.offset(skip).limit(limit).all()


@router.get("/{id}", response_model=SubTasaResponse)
def get_sub_tasa(
    id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    service = SubTasaService(db)
    return service.find_by_id(id)


@router.post("", response_model=SubTasaResponse, status_code=201)
def create_sub_tasa(
    data: SubTasaCreate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    service = SubTasaService(db)
    return service.add(data.model_dump())


@router.put("/{id}", response_model=SubTasaResponse)
def update_sub_tasa(
    id: int,
    data: SubTasaUpdate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    service = SubTasaService(db)
    return service.modify(id, data.model_dump(exclude_unset=True))


@router.delete("/{id}")
def delete_sub_tasa(
    id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    service = SubTasaService(db)
    service.remove(id)
    return {"message": f"Sub-tasa {id} eliminada"}
