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
from services.tasa_service import TasaService
from models.tasa import Tasa
from schemas.tasa import TasaCreate, TasaUpdate, TasaResponse

settings = get_settings()
get_current_user = create_auth_dependency(settings.seguridad_url)

router = APIRouter(prefix="/tasas", tags=["Tasas"])


@router.get("", response_model=List[TasaResponse])
def list_tasas(
    request: Request,
    id_tipo_tributo: Optional[int] = Query(None),
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    query = db.query(Tasa)
    if id_tipo_tributo is not None:
        query = query.filter(Tasa.id_tipo_tributo == id_tipo_tributo)
    query = filtered_query(query, Tasa, dict(request.query_params), exclude={'skip', 'limit', 'id_tipo_tributo'})
    return query.offset(skip).limit(limit).all()


@router.get("/{id}", response_model=TasaResponse)
def get_tasa(
    id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    service = TasaService(db)
    return service.find_by_id(id)


@router.post("", response_model=TasaResponse, status_code=201)
def create_tasa(
    data: TasaCreate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    service = TasaService(db)
    return service.add(data.model_dump())


@router.put("/{id}", response_model=TasaResponse)
def update_tasa(
    id: int,
    data: TasaUpdate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    service = TasaService(db)
    return service.modify(id, data.model_dump(exclude_unset=True))


@router.delete("/{id}")
def delete_tasa(
    id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    service = TasaService(db)
    service.remove(id)
    return {"message": f"Tasa {id} eliminada"}
