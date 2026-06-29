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
from services.inmueble_superficie_service import InmuebleSuperficieService
from models.inmueble_superficie import InmuebleSuperficie
from schemas.inmueble_superficie import (
    InmuebleSuperficieCreate,
    InmuebleSuperficieUpdate,
    InmuebleSuperficieResponse,
)

settings = get_settings()
get_current_user = create_auth_dependency(settings.seguridad_url)

router = APIRouter(prefix="/inmueble-superficies", tags=["Inmueble - Superficies"])


@router.get("", response_model=List[InmuebleSuperficieResponse])
def list_superficies(
    request: Request,
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    query = db.query(InmuebleSuperficie)
    query = filtered_query(query, InmuebleSuperficie, dict(request.query_params), exclude={"skip", "limit"})
    return query.offset(skip).limit(limit).all()


@router.get("/{id}", response_model=InmuebleSuperficieResponse)
def get_superficie(id: int, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    return InmuebleSuperficieService(db).find_by_id(id)


@router.get("/by-inmueble/{id_inmueble}", response_model=List[InmuebleSuperficieResponse])
def list_superficies_by_inmueble(
    id_inmueble: int, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)
):
    return InmuebleSuperficieService(db).list_by_inmueble(id_inmueble)


@router.post("", response_model=InmuebleSuperficieResponse, status_code=201)
def create_superficie(
    data: InmuebleSuperficieCreate, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)
):
    return InmuebleSuperficieService(db).add(data.model_dump())


@router.put("/{id}", response_model=InmuebleSuperficieResponse)
def update_superficie(
    id: int, data: InmuebleSuperficieUpdate, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)
):
    return InmuebleSuperficieService(db).modify(id, data.model_dump(exclude_unset=True))


@router.delete("/{id}")
def delete_superficie(id: int, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    InmuebleSuperficieService(db).remove(id)
    return {"message": f"Superficie {id} dada de baja"}
