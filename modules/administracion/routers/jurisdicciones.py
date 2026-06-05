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
from models.jurisdiccion import Jurisdiccion
from services.jurisdiccion_service import JurisdiccionService
from schemas.jurisdiccion import JurisdiccionCreate, JurisdiccionUpdate, JurisdiccionResponse

settings = get_settings()
get_current_user = create_auth_dependency(settings.seguridad_url)

router = APIRouter(prefix="/jurisdicciones", tags=["Jurisdicciones"])


@router.get("", response_model=List[JurisdiccionResponse])
def list_jurisdicciones(
    request: Request,
    ejercicio: Optional[int] = Query(None),
    tipo: Optional[str] = Query(None),
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    query = db.query(Jurisdiccion)
    if ejercicio is not None:
        query = query.filter(Jurisdiccion.ejercicio == ejercicio)
    if tipo:
        query = query.filter(Jurisdiccion.tipo == tipo)
    query = filtered_query(query, Jurisdiccion, dict(request.query_params), exclude={'skip', 'limit', 'ejercicio', 'tipo'})
    return query.offset(skip).limit(limit).all()


@router.get("/{id}", response_model=JurisdiccionResponse)
def get_jurisdiccion(
    id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    service = JurisdiccionService(db)
    return service.find_by_id(id)


@router.post("", response_model=JurisdiccionResponse, status_code=201)
def create_jurisdiccion(
    data: JurisdiccionCreate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    service = JurisdiccionService(db)
    return service.add(data.model_dump())


@router.put("/{id}", response_model=JurisdiccionResponse)
def update_jurisdiccion(
    id: int,
    data: JurisdiccionUpdate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    service = JurisdiccionService(db)
    return service.modify(id, data.model_dump(exclude_unset=True))


@router.delete("/{id}")
def delete_jurisdiccion(
    id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    service = JurisdiccionService(db)
    service.remove(id)
    return {"message": f"Jurisdicción {id} eliminada"}
