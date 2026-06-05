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
from models.expediente import Expediente
from services.expediente_service import ExpedienteService
from schemas.expediente import ExpedienteCreate, ExpedienteUpdate, ExpedienteResponse

settings = get_settings()
get_current_user = create_auth_dependency(settings.seguridad_url)

router = APIRouter(prefix="/expedientes", tags=["Expedientes"])


@router.get("", response_model=List[ExpedienteResponse])
def list_expedientes(
    request: Request,
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    ejercicio: Optional[int] = Query(None),
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    query = db.query(Expediente)
    if ejercicio is not None:
        query = query.filter(Expediente.ejercicio == ejercicio)
    query = filtered_query(query, Expediente, dict(request.query_params), exclude={'skip', 'limit', 'ejercicio'})
    return query.offset(skip).limit(limit).all()


@router.get("/{id}", response_model=ExpedienteResponse)
def get_expediente(
    id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    service = ExpedienteService(db)
    return service.find_by_id(id)


@router.post("", response_model=ExpedienteResponse, status_code=201)
def create_expediente(
    data: ExpedienteCreate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    service = ExpedienteService(db)
    return service.add(data.model_dump())


@router.put("/{id}", response_model=ExpedienteResponse)
def update_expediente(
    id: int,
    data: ExpedienteUpdate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    service = ExpedienteService(db)
    return service.modify(id, data.model_dump(exclude_unset=True))


@router.delete("/{id}")
def delete_expediente(
    id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    service = ExpedienteService(db)
    service.remove(id)
    return {"message": f"Expediente {id} eliminado"}
