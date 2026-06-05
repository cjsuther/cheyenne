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
from models.observacion import Observacion
from schemas.observacion import ObservacionCreate, ObservacionUpdate, ObservacionResponse

settings = get_settings()
get_current_user = create_auth_dependency(settings.seguridad_url)

router = APIRouter(prefix="/observaciones", tags=["Observaciones"])


@router.get("", response_model=List[ObservacionResponse])
def list_observaciones(
    request: Request,
    entidad: Optional[str] = Query(None),
    id_entidad: Optional[int] = Query(None),
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    query = db.query(Observacion)
    if entidad:
        query = query.filter(Observacion.entidad == entidad)
    if id_entidad is not None:
        query = query.filter(Observacion.id_entidad == id_entidad)
    query = filtered_query(query, Observacion, dict(request.query_params), exclude={'skip', 'limit', 'entidad', 'id_entidad'})
    return query.order_by(Observacion.fecha.desc()).offset(skip).limit(limit).all()


@router.get("/{id}", response_model=ObservacionResponse)
def get_observacion(
    id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    observacion = db.query(Observacion).filter(Observacion.id == id).first()
    if not observacion:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Observación {id} no encontrada",
        )
    return observacion


@router.post("", response_model=ObservacionResponse, status_code=201)
def create_observacion(
    data: ObservacionCreate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    observacion = Observacion(
        **data.model_dump(),
        id_usuario=current_user.get("id"),
    )
    db.add(observacion)
    db.commit()
    db.refresh(observacion)
    return observacion


@router.put("/{id}", response_model=ObservacionResponse)
def update_observacion(
    id: int,
    data: ObservacionUpdate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    observacion = db.query(Observacion).filter(Observacion.id == id).first()
    if not observacion:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Observación {id} no encontrada",
        )
    for key, value in data.model_dump(exclude_unset=True).items():
        if value is not None:
            setattr(observacion, key, value)
    db.commit()
    db.refresh(observacion)
    return observacion


@router.delete("/{id}")
def delete_observacion(
    id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    observacion = db.query(Observacion).filter(Observacion.id == id).first()
    if not observacion:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Observación {id} no encontrada",
        )
    db.delete(observacion)
    db.commit()
    return {"message": f"Observación {id} eliminada"}
