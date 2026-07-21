import sys
import os
from typing import List, Optional

from fastapi import APIRouter, Depends, Query, HTTPException, status
from sqlalchemy.orm import Session
from starlette.requests import Request

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", ".."))
from shared.base_module import create_auth_dependency
from shared.filters import filtered_query

from database import get_db
from config import get_settings
from models.entidad import Entidad
from schemas.entidad import EntidadCreate, EntidadUpdate, EntidadResponse

settings = get_settings()
get_current_user = create_auth_dependency(settings.seguridad_url)

router = APIRouter(prefix="/entidades", tags=["Entidades"])


@router.get("", response_model=List[EntidadResponse])
def list_entidades(
    request: Request,
    tipo: Optional[str] = Query(None),
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    query = db.query(Entidad)
    if tipo:
        query = query.filter(Entidad.tipo == tipo)
    query = filtered_query(query, Entidad, dict(request.query_params), exclude={'skip', 'limit', 'tipo'}, default_sort='orden')
    return query.offset(skip).limit(limit).all()


@router.get("/{id}", response_model=EntidadResponse)
def get_entidad(
    id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    entidad = db.query(Entidad).filter(Entidad.id == id).first()
    if not entidad:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Entidad {id} no encontrada",
        )
    return entidad


@router.post("", response_model=EntidadResponse, status_code=201)
def create_entidad(
    data: EntidadCreate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    entidad = Entidad(**data.model_dump())
    db.add(entidad)
    db.commit()
    db.refresh(entidad)
    return entidad


@router.put("/{id}", response_model=EntidadResponse)
def update_entidad(
    id: int,
    data: EntidadUpdate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    entidad = db.query(Entidad).filter(Entidad.id == id).first()
    if not entidad:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Entidad {id} no encontrada",
        )
    for key, value in data.model_dump(exclude_unset=True).items():
        if value is not None:
            setattr(entidad, key, value)
    db.commit()
    db.refresh(entidad)
    return entidad


@router.delete("/{id}")
def delete_entidad(
    id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    entidad = db.query(Entidad).filter(Entidad.id == id).first()
    if not entidad:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Entidad {id} no encontrada",
        )
    db.delete(entidad)
    db.commit()
    return {"message": f"Entidad {id} eliminada"}
