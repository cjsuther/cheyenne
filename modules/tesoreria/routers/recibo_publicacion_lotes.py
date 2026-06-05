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
from services.recibo_service import ReciboService
from models.recibo_publicacion_lote import ReciboPublicacionLote
from models.recibo_publicacion import ReciboPublicacion
from schemas.recibo_publicacion_lote import (
    ReciboPublicacionLoteCreate,
    ReciboPublicacionLoteUpdate,
    ReciboPublicacionLoteResponse,
)
from schemas.recibo_publicacion import (
    ReciboPublicacionCreate,
    ReciboPublicacionUpdate,
    ReciboPublicacionResponse,
)

settings = get_settings()
get_current_user = create_auth_dependency(settings.seguridad_url)

router = APIRouter(prefix="/recibo-publicacion-lotes", tags=["Recibo Publicacion Lotes"])


@router.get("", response_model=List[ReciboPublicacionLoteResponse])
def list_lotes(
    request: Request,
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    query = db.query(ReciboPublicacionLote)
    query = filtered_query(query, ReciboPublicacionLote, dict(request.query_params), exclude={'skip', 'limit'})
    return query.offset(skip).limit(limit).all()


@router.get("/{id}", response_model=ReciboPublicacionLoteResponse)
def get_lote(
    id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    service = ReciboService(db)
    return service.find_publicacion_lote_by_id(id)


@router.post("", response_model=ReciboPublicacionLoteResponse, status_code=201)
def create_lote(
    data: ReciboPublicacionLoteCreate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    service = ReciboService(db)
    return service.add_publicacion_lote(data.model_dump())


@router.put("/{id}", response_model=ReciboPublicacionLoteResponse)
def update_lote(
    id: int,
    data: ReciboPublicacionLoteUpdate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    service = ReciboService(db)
    return service.modify_publicacion_lote(id, data.model_dump(exclude_unset=True))


@router.delete("/{id}")
def delete_lote(
    id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    service = ReciboService(db)
    service.remove_publicacion_lote(id)
    return {"message": f"ReciboPublicacionLote {id} eliminado"}


@router.get("/{id_lote}/publicaciones", response_model=List[ReciboPublicacionResponse])
def list_publicaciones(
    request: Request,
    id_lote: int,
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    query = db.query(ReciboPublicacion).filter(ReciboPublicacion.id_recibo_publicacion_lote == id_lote)
    query = filtered_query(query, ReciboPublicacion, dict(request.query_params), exclude={'skip', 'limit', 'id_lote'})
    return query.offset(skip).limit(limit).all()


@router.post("/{id_lote}/publicaciones", response_model=ReciboPublicacionResponse, status_code=201)
def create_publicacion(
    id_lote: int,
    data: ReciboPublicacionCreate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    service = ReciboService(db)
    pub_data = data.model_dump()
    pub_data["id_recibo_publicacion_lote"] = id_lote
    return service.add_publicacion(pub_data)


@router.put("/publicaciones/{id}", response_model=ReciboPublicacionResponse)
def update_publicacion(
    id: int,
    data: ReciboPublicacionUpdate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    service = ReciboService(db)
    return service.modify_publicacion(id, data.model_dump(exclude_unset=True))


@router.delete("/publicaciones/{id}")
def delete_publicacion(
    id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    service = ReciboService(db)
    service.remove_publicacion(id)
    return {"message": f"ReciboPublicacion {id} eliminada"}
