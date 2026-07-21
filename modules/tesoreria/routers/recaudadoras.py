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
from models.recaudadora import Recaudadora
from schemas.recaudadora import RecaudadoraCreate, RecaudadoraUpdate, RecaudadoraResponse

settings = get_settings()
get_current_user = create_auth_dependency(settings.seguridad_url)

router = APIRouter(prefix="/recaudadoras", tags=["Recaudadoras"])


@router.get("", response_model=List[RecaudadoraResponse])
def list_recaudadoras(
    request: Request,
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    query = db.query(Recaudadora)
    query = filtered_query(query, Recaudadora, dict(request.query_params), exclude={'skip', 'limit'}, default_sort='orden')
    return query.offset(skip).limit(limit).all()


@router.get("/{id}", response_model=RecaudadoraResponse)
def get_recaudadora(
    id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    item = db.query(Recaudadora).filter(Recaudadora.id == id).first()
    if not item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Recaudadora {id} no encontrada")
    return item


@router.post("", response_model=RecaudadoraResponse, status_code=201)
def create_recaudadora(
    data: RecaudadoraCreate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    item = Recaudadora(**data.model_dump())
    db.add(item)
    db.commit()
    db.refresh(item)
    return item


@router.put("/{id}", response_model=RecaudadoraResponse)
def update_recaudadora(
    id: int,
    data: RecaudadoraUpdate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    item = db.query(Recaudadora).filter(Recaudadora.id == id).first()
    if not item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Recaudadora {id} no encontrada")
    for key, value in data.model_dump(exclude_unset=True).items():
        if value is not None:
            setattr(item, key, value)
    db.commit()
    db.refresh(item)
    return item


@router.delete("/{id}")
def delete_recaudadora(
    id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    item = db.query(Recaudadora).filter(Recaudadora.id == id).first()
    if not item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Recaudadora {id} no encontrada")
    db.delete(item)
    db.commit()
    return {"message": f"Recaudadora {id} eliminada"}
