import sys
import os
from typing import List

from fastapi import APIRouter, Depends, Query, HTTPException, status
from sqlalchemy.orm import Session
from starlette.requests import Request

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", ".."))
from shared.base_module import create_auth_dependency
from shared.filters import filtered_query

from database import get_db
from config import get_settings
from models.dependencia import Dependencia
from schemas.dependencia import DependenciaCreate, DependenciaUpdate, DependenciaResponse

settings = get_settings()
get_current_user = create_auth_dependency(settings.seguridad_url)

router = APIRouter(prefix="/dependencias", tags=["Dependencias"])


@router.get("", response_model=List[DependenciaResponse])
def list_dependencias(
    request: Request,
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    query = db.query(Dependencia)
    query = filtered_query(query, Dependencia, dict(request.query_params), exclude={'skip', 'limit'})
    return query.order_by(Dependencia.orden).offset(skip).limit(limit).all()


@router.get("/{id}", response_model=DependenciaResponse)
def get_dependencia(
    id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    item = db.query(Dependencia).filter(Dependencia.id == id).first()
    if not item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Dependencia {id} no encontrada")
    return item


@router.post("", response_model=DependenciaResponse, status_code=201)
def create_dependencia(
    data: DependenciaCreate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    item = Dependencia(**data.model_dump())
    db.add(item)
    db.commit()
    db.refresh(item)
    return item


@router.put("/{id}", response_model=DependenciaResponse)
def update_dependencia(
    id: int,
    data: DependenciaUpdate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    item = db.query(Dependencia).filter(Dependencia.id == id).first()
    if not item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Dependencia {id} no encontrada")
    for key, value in data.model_dump(exclude_unset=True).items():
        if value is not None:
            setattr(item, key, value)
    db.commit()
    db.refresh(item)
    return item


@router.delete("/{id}")
def delete_dependencia(
    id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    item = db.query(Dependencia).filter(Dependencia.id == id).first()
    if not item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Dependencia {id} no encontrada")
    db.delete(item)
    db.commit()
    return {"message": f"Dependencia {id} eliminada"}
