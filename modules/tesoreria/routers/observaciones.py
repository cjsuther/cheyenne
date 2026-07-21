import sys
import os
from typing import List
from datetime import datetime

from fastapi import APIRouter, Depends, Query, HTTPException, status
from sqlalchemy.orm import Session
from starlette.requests import Request

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", ".."))
from shared.base_module import create_auth_dependency
from shared.filters import filtered_query

from database import get_db
from config import get_settings
from models.observacion import Observacion
from schemas.observacion import ObservacionCreate, ObservacionResponse

settings = get_settings()
get_current_user = create_auth_dependency(settings.seguridad_url)

router = APIRouter(prefix="/observaciones", tags=["Observaciones"])


@router.get("", response_model=List[ObservacionResponse])
def list_observaciones(
    request: Request,
    entidad: str = Query(...),
    id_entidad: int = Query(...),
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    query = (
        db.query(Observacion)
        .filter(Observacion.entidad == entidad, Observacion.id_entidad == id_entidad)
    )
    query = filtered_query(query, Observacion, dict(request.query_params), exclude={'skip', 'limit', 'entidad', 'id_entidad'}, default_sort='fecha', default_dir='desc')
    return query.offset(skip).limit(limit).all()


@router.post("", response_model=ObservacionResponse, status_code=201)
def create_observacion(
    data: ObservacionCreate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    item = Observacion(
        **data.model_dump(),
        id_usuario=current_user.get("id"),
        fecha=datetime.utcnow(),
    )
    db.add(item)
    db.commit()
    db.refresh(item)
    return item


@router.delete("/{id}")
def delete_observacion(
    id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    item = db.query(Observacion).filter(Observacion.id == id).first()
    if not item:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Observacion {id} no encontrada")
    db.delete(item)
    db.commit()
    return {"message": f"Observacion {id} eliminada"}
