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
from services.inmueble_frente_service import InmuebleFrenteService
from models.inmueble_frente import InmuebleFrente
from schemas.inmueble_frente import (
    InmuebleFrenteCreate,
    InmuebleFrenteUpdate,
    InmuebleFrenteResponse,
)

settings = get_settings()
get_current_user = create_auth_dependency(settings.seguridad_url)

router = APIRouter(prefix="/inmueble-frentes", tags=["Inmueble - Frentes"])


@router.get("", response_model=List[InmuebleFrenteResponse])
def list_frentes(
    request: Request,
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    query = db.query(InmuebleFrente)
    query = filtered_query(query, InmuebleFrente, dict(request.query_params), exclude={"skip", "limit"})
    return query.offset(skip).limit(limit).all()


@router.get("/{id}", response_model=InmuebleFrenteResponse)
def get_frente(id: int, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    return InmuebleFrenteService(db).find_by_id(id)


@router.get("/by-inmueble/{id_inmueble}", response_model=List[InmuebleFrenteResponse])
def list_frentes_by_inmueble(
    id_inmueble: int, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)
):
    return InmuebleFrenteService(db).list_by_inmueble(id_inmueble)


@router.post("", response_model=InmuebleFrenteResponse, status_code=201)
def create_frente(
    data: InmuebleFrenteCreate, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)
):
    return InmuebleFrenteService(db).add(data.model_dump())


@router.put("/{id}", response_model=InmuebleFrenteResponse)
def update_frente(
    id: int, data: InmuebleFrenteUpdate, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)
):
    return InmuebleFrenteService(db).modify(id, data.model_dump(exclude_unset=True))


@router.delete("/{id}")
def delete_frente(id: int, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    InmuebleFrenteService(db).remove(id)
    return {"message": f"Frente {id} dado de baja"}
