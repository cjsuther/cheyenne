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
from services.inmueble_valuacion_service import InmuebleValuacionService
from models.inmueble_valuacion import InmuebleValuacion
from schemas.inmueble_valuacion import (
    InmuebleValuacionCreate,
    InmuebleValuacionUpdate,
    InmuebleValuacionResponse,
)

settings = get_settings()
get_current_user = create_auth_dependency(settings.seguridad_url)

router = APIRouter(prefix="/inmueble-valuaciones", tags=["Inmueble - Valuaciones"])


@router.get("", response_model=List[InmuebleValuacionResponse])
def list_valuaciones(
    request: Request,
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    query = db.query(InmuebleValuacion)
    query = filtered_query(query, InmuebleValuacion, dict(request.query_params), exclude={"skip", "limit"})
    return query.offset(skip).limit(limit).all()


@router.get("/{id}", response_model=InmuebleValuacionResponse)
def get_valuacion(id: int, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    return InmuebleValuacionService(db).find_by_id(id)


@router.get("/by-inmueble/{id_inmueble}", response_model=List[InmuebleValuacionResponse])
def list_valuaciones_by_inmueble(
    id_inmueble: int, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)
):
    return InmuebleValuacionService(db).list_by_inmueble(id_inmueble)


@router.post("", response_model=InmuebleValuacionResponse, status_code=201)
def create_valuacion(
    data: InmuebleValuacionCreate, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)
):
    return InmuebleValuacionService(db).add(data.model_dump())


@router.put("/{id}", response_model=InmuebleValuacionResponse)
def update_valuacion(
    id: int, data: InmuebleValuacionUpdate, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)
):
    return InmuebleValuacionService(db).modify(id, data.model_dump(exclude_unset=True))


@router.delete("/{id}")
def delete_valuacion(id: int, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    InmuebleValuacionService(db).remove(id)
    return {"message": f"Valuacion {id} dada de baja"}
