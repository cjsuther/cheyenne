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
from models.pago_rendicion_lote import PagoRendicionLote
from models.pago_rendicion import PagoRendicion
from schemas.pago_rendicion_lote import (
    PagoRendicionLoteCreate,
    PagoRendicionLoteUpdate,
    PagoRendicionLoteResponse,
)
from schemas.pago_rendicion import (
    PagoRendicionCreate,
    PagoRendicionUpdate,
    PagoRendicionResponse,
)

settings = get_settings()
get_current_user = create_auth_dependency(settings.seguridad_url)

router = APIRouter(prefix="/pago-rendicion-lotes", tags=["Pago Rendicion Lotes"])


@router.get("", response_model=List[PagoRendicionLoteResponse])
def list_lotes(
    request: Request,
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    query = db.query(PagoRendicionLote)
    query = filtered_query(query, PagoRendicionLote, dict(request.query_params), exclude={'skip', 'limit'})
    return query.offset(skip).limit(limit).all()


@router.get("/{id}", response_model=PagoRendicionLoteResponse)
def get_lote(
    id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    service = ReciboService(db)
    return service.find_pago_rendicion_lote_by_id(id)


@router.post("", response_model=PagoRendicionLoteResponse, status_code=201)
def create_lote(
    data: PagoRendicionLoteCreate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    service = ReciboService(db)
    return service.add_pago_rendicion_lote(data.model_dump())


@router.put("/{id}", response_model=PagoRendicionLoteResponse)
def update_lote(
    id: int,
    data: PagoRendicionLoteUpdate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    service = ReciboService(db)
    return service.modify_pago_rendicion_lote(id, data.model_dump(exclude_unset=True))


@router.delete("/{id}")
def delete_lote(
    id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    service = ReciboService(db)
    service.remove_pago_rendicion_lote(id)
    return {"message": f"PagoRendicionLote {id} eliminado"}


@router.get("/{id_lote}/rendiciones", response_model=List[PagoRendicionResponse])
def list_rendiciones(
    request: Request,
    id_lote: int,
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    query = db.query(PagoRendicion).filter(PagoRendicion.id_pago_rendicion_lote == id_lote)
    query = filtered_query(query, PagoRendicion, dict(request.query_params), exclude={'skip', 'limit', 'id_lote'})
    return query.offset(skip).limit(limit).all()


@router.post("/{id_lote}/rendiciones", response_model=PagoRendicionResponse, status_code=201)
def create_rendicion(
    id_lote: int,
    data: PagoRendicionCreate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    service = ReciboService(db)
    rendicion_data = data.model_dump()
    rendicion_data["id_pago_rendicion_lote"] = id_lote
    return service.add_pago_rendicion(rendicion_data)


@router.put("/rendiciones/{id}", response_model=PagoRendicionResponse)
def update_rendicion(
    id: int,
    data: PagoRendicionUpdate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    service = ReciboService(db)
    return service.modify_pago_rendicion(id, data.model_dump(exclude_unset=True))


@router.delete("/rendiciones/{id}")
def delete_rendicion(
    id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    service = ReciboService(db)
    service.remove_pago_rendicion(id)
    return {"message": f"PagoRendicion {id} eliminada"}
