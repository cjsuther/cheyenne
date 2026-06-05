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
from models.direccion import Direccion
from schemas.direccion import DireccionCreate, DireccionUpdate, DireccionResponse

settings = get_settings()
get_current_user = create_auth_dependency(settings.seguridad_url)

router = APIRouter(prefix="/direcciones", tags=["Direcciones"])


@router.get("", response_model=List[DireccionResponse])
def list_direcciones(
    request: Request,
    entidad: Optional[str] = Query(None),
    id_entidad: Optional[int] = Query(None),
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    query = db.query(Direccion)
    if entidad:
        query = query.filter(Direccion.entidad == entidad)
    if id_entidad is not None:
        query = query.filter(Direccion.id_entidad == id_entidad)
    query = filtered_query(query, Direccion, dict(request.query_params), exclude={'skip', 'limit', 'entidad', 'id_entidad'})
    return query.offset(skip).limit(limit).all()


@router.get("/{id}", response_model=DireccionResponse)
def get_direccion(
    id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    direccion = db.query(Direccion).filter(Direccion.id == id).first()
    if not direccion:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Dirección {id} no encontrada",
        )
    return direccion


@router.post("", response_model=DireccionResponse, status_code=201)
def create_direccion(
    data: DireccionCreate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    direccion = Direccion(**data.model_dump())
    db.add(direccion)
    db.commit()
    db.refresh(direccion)
    return direccion


@router.put("/{id}", response_model=DireccionResponse)
def update_direccion(
    id: int,
    data: DireccionUpdate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    direccion = db.query(Direccion).filter(Direccion.id == id).first()
    if not direccion:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Dirección {id} no encontrada",
        )
    for key, value in data.model_dump(exclude_unset=True).items():
        if value is not None:
            setattr(direccion, key, value)
    db.commit()
    db.refresh(direccion)
    return direccion


@router.delete("/{id}")
def delete_direccion(
    id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    direccion = db.query(Direccion).filter(Direccion.id == id).first()
    if not direccion:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Dirección {id} no encontrada",
        )
    db.delete(direccion)
    db.commit()
    return {"message": f"Dirección {id} eliminada"}
