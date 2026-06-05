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
from services.recaudacion_service import RecaudacionService
from models.recaudacion_lote import RecaudacionLote
from models.recaudacion import Recaudacion
from schemas.recaudacion_lote import RecaudacionLoteCreate, RecaudacionLoteUpdate, RecaudacionLoteResponse
from schemas.recaudacion import RecaudacionCreate, RecaudacionUpdate, RecaudacionResponse

settings = get_settings()
get_current_user = create_auth_dependency(settings.seguridad_url)

router = APIRouter(prefix="/recaudacion-lotes", tags=["Recaudacion Lotes"])


@router.get("", response_model=List[RecaudacionLoteResponse])
def list_lotes(
    request: Request,
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    query = db.query(RecaudacionLote)
    query = filtered_query(query, RecaudacionLote, dict(request.query_params), exclude={'skip', 'limit'})
    return query.offset(skip).limit(limit).all()


@router.get("/{id}", response_model=RecaudacionLoteResponse)
def get_lote(
    id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    service = RecaudacionService(db)
    return service.find_lote_by_id(id)


@router.post("", response_model=RecaudacionLoteResponse, status_code=201)
def create_lote(
    data: RecaudacionLoteCreate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    service = RecaudacionService(db)
    return service.add_lote(data.model_dump())


@router.put("/{id}", response_model=RecaudacionLoteResponse)
def update_lote(
    id: int,
    data: RecaudacionLoteUpdate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    service = RecaudacionService(db)
    return service.modify_lote(id, data.model_dump(exclude_unset=True))


@router.delete("/{id}")
def delete_lote(
    id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    service = RecaudacionService(db)
    service.remove_lote(id)
    return {"message": f"RecaudacionLote {id} eliminado"}


@router.get("/{id_lote}/recaudaciones", response_model=List[RecaudacionResponse])
def list_recaudaciones(
    request: Request,
    id_lote: int,
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    query = db.query(Recaudacion).filter(Recaudacion.id_recaudacion_lote == id_lote)
    query = filtered_query(query, Recaudacion, dict(request.query_params), exclude={'skip', 'limit', 'id_lote'})
    return query.offset(skip).limit(limit).all()


@router.post("/{id_lote}/recaudaciones", response_model=RecaudacionResponse, status_code=201)
def create_recaudacion(
    id_lote: int,
    data: RecaudacionCreate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    service = RecaudacionService(db)
    recaudacion_data = data.model_dump()
    recaudacion_data["id_recaudacion_lote"] = id_lote
    return service.add_recaudacion(recaudacion_data)


@router.put("/recaudaciones/{id}", response_model=RecaudacionResponse)
def update_recaudacion(
    id: int,
    data: RecaudacionUpdate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    service = RecaudacionService(db)
    return service.modify_recaudacion(id, data.model_dump(exclude_unset=True))


@router.delete("/recaudaciones/{id}")
def delete_recaudacion(
    id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    service = RecaudacionService(db)
    service.remove_recaudacion(id)
    return {"message": f"Recaudacion {id} eliminada"}
