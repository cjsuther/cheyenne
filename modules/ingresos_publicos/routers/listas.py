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
from services.lista_service import ListaService
from models.lista import Lista
from schemas.lista import ListaCreate, ListaUpdate, ListaResponse

settings = get_settings()
get_current_user = create_auth_dependency(settings.seguridad_url)

router = APIRouter(prefix="/listas", tags=["Listas"])


@router.get("", response_model=List[ListaResponse])
def list_listas(
    request: Request,
    tipo: Optional[str] = Query(None),
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    db: Session = Depends(get_db),
):
    query = db.query(Lista)
    if tipo is not None:
        query = query.filter(Lista.tipo == tipo)
    query = filtered_query(query, Lista, dict(request.query_params), exclude={'skip', 'limit', 'tipo'})
    return query.offset(skip).limit(limit).all()


@router.get("/{id}", response_model=ListaResponse)
def get_lista(
    id: int,
    db: Session = Depends(get_db),
):
    service = ListaService(db)
    return service.find_by_id(id)


@router.post("", response_model=ListaResponse, status_code=201)
def create_lista(
    data: ListaCreate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    service = ListaService(db)
    return service.add(data.model_dump())


@router.put("/{id}", response_model=ListaResponse)
def update_lista(
    id: int,
    data: ListaUpdate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    service = ListaService(db)
    return service.modify(id, data.model_dump(exclude_unset=True))


@router.delete("/{id}")
def delete_lista(
    id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    service = ListaService(db)
    service.remove(id)
    return {"message": f"Lista {id} eliminada"}
