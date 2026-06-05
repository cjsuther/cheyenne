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
from services.inmueble_service import InmuebleService
from models.inmueble import Inmueble
from schemas.inmueble import InmuebleCreate, InmuebleUpdate, InmuebleResponse

settings = get_settings()
get_current_user = create_auth_dependency(settings.seguridad_url)

router = APIRouter(prefix="/inmuebles", tags=["Inmuebles"])


@router.get("", response_model=List[InmuebleResponse])
def list_inmuebles(
    request: Request,
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    query = db.query(Inmueble)
    query = filtered_query(query, Inmueble, dict(request.query_params), exclude={'skip', 'limit'})
    return query.offset(skip).limit(limit).all()


@router.get("/{id}", response_model=InmuebleResponse)
def get_inmueble(
    id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    service = InmuebleService(db)
    return service.find_by_id(id)


@router.get("/by-cuenta/{id_cuenta}", response_model=List[InmuebleResponse])
def list_inmuebles_by_cuenta(
    id_cuenta: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    service = InmuebleService(db)
    return service.list_by_cuenta(id_cuenta)


@router.post("", response_model=InmuebleResponse, status_code=201)
def create_inmueble(
    data: InmuebleCreate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    service = InmuebleService(db)
    return service.add(data.model_dump())


@router.put("/{id}", response_model=InmuebleResponse)
def update_inmueble(
    id: int,
    data: InmuebleUpdate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    service = InmuebleService(db)
    return service.modify(id, data.model_dump(exclude_unset=True))


@router.delete("/{id}")
def delete_inmueble(
    id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    service = InmuebleService(db)
    service.remove(id)
    return {"message": f"Inmueble {id} dado de baja"}
