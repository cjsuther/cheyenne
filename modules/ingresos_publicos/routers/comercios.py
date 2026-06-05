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
from services.comercio_service import ComercioService
from models.comercio import Comercio
from schemas.comercio import ComercioCreate, ComercioUpdate, ComercioResponse

settings = get_settings()
get_current_user = create_auth_dependency(settings.seguridad_url)

router = APIRouter(prefix="/comercios", tags=["Comercios"])


@router.get("", response_model=List[ComercioResponse])
def list_comercios(
    request: Request,
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    query = db.query(Comercio)
    query = filtered_query(query, Comercio, dict(request.query_params), exclude={'skip', 'limit'})
    return query.offset(skip).limit(limit).all()


@router.get("/{id}", response_model=ComercioResponse)
def get_comercio(
    id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    service = ComercioService(db)
    return service.find_by_id(id)


@router.get("/by-cuenta/{id_cuenta}", response_model=List[ComercioResponse])
def list_comercios_by_cuenta(
    id_cuenta: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    service = ComercioService(db)
    return service.list_by_cuenta(id_cuenta)


@router.post("", response_model=ComercioResponse, status_code=201)
def create_comercio(
    data: ComercioCreate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    service = ComercioService(db)
    return service.add(data.model_dump())


@router.put("/{id}", response_model=ComercioResponse)
def update_comercio(
    id: int,
    data: ComercioUpdate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    service = ComercioService(db)
    return service.modify(id, data.model_dump(exclude_unset=True))


@router.delete("/{id}")
def delete_comercio(
    id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    service = ComercioService(db)
    service.remove(id)
    return {"message": f"Comercio {id} dado de baja"}
