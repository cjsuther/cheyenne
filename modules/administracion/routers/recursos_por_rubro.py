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
from models.recurso_por_rubro import RecursoPorRubro
from services.recurso_por_rubro_service import RecursoPorRubroService
from schemas.recurso_por_rubro import RecursoPorRubroCreate, RecursoPorRubroUpdate, RecursoPorRubroResponse

settings = get_settings()
get_current_user = create_auth_dependency(settings.seguridad_url)

router = APIRouter(prefix="/recursos-por-rubro", tags=["Recursos por Rubro"])


@router.get("", response_model=List[RecursoPorRubroResponse])
def list_recursos_por_rubro(
    request: Request,
    agrupamiento: Optional[str] = Query(None),
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    query = db.query(RecursoPorRubro)
    if agrupamiento:
        query = query.filter(RecursoPorRubro.agrupamiento == agrupamiento)
    query = filtered_query(query, RecursoPorRubro, dict(request.query_params), exclude={'skip', 'limit', 'agrupamiento'})
    return query.offset(skip).limit(limit).all()


@router.get("/{id}", response_model=RecursoPorRubroResponse)
def get_recurso_por_rubro(
    id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    service = RecursoPorRubroService(db)
    return service.find_by_id(id)


@router.post("", response_model=RecursoPorRubroResponse, status_code=201)
def create_recurso_por_rubro(
    data: RecursoPorRubroCreate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    service = RecursoPorRubroService(db)
    return service.add(data.model_dump())


@router.put("/{id}", response_model=RecursoPorRubroResponse)
def update_recurso_por_rubro(
    id: int,
    data: RecursoPorRubroUpdate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    service = RecursoPorRubroService(db)
    return service.modify(id, data.model_dump(exclude_unset=True))


@router.delete("/{id}")
def delete_recurso_por_rubro(
    id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    service = RecursoPorRubroService(db)
    service.remove(id)
    return {"message": f"Recurso por rubro {id} eliminado"}
