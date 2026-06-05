import sys
import os
from typing import List, Optional

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from starlette.requests import Request

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", ".."))
from shared.base_module import create_auth_dependency
from shared.filters import filtered_query

from database import get_db
from config import get_settings
from models.medio_pago import MedioPago
from services.medio_pago_service import MedioPagoService
from schemas.medio_pago import MedioPagoCreate, MedioPagoUpdate, MedioPagoResponse

settings = get_settings()
get_current_user = create_auth_dependency(settings.seguridad_url)

router = APIRouter(prefix="/medios-pago", tags=["Medios de Pago"])


@router.get("", response_model=List[MedioPagoResponse])
def list_medios_pago(
    request: Request,
    id_persona: Optional[int] = Query(None),
    id_tipo_persona: Optional[int] = Query(None),
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    query = db.query(MedioPago)
    if id_persona is not None:
        query = query.filter(MedioPago.id_persona == id_persona)
    if id_tipo_persona is not None:
        query = query.filter(MedioPago.id_tipo_persona == id_tipo_persona)
    query = filtered_query(query, MedioPago, dict(request.query_params), exclude={'skip', 'limit', 'id_persona', 'id_tipo_persona'})
    return query.offset(skip).limit(limit).all()


@router.get("/{id}", response_model=MedioPagoResponse)
def get_medio_pago(
    id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    service = MedioPagoService(db)
    return service.find_by_id(id)


@router.post("", response_model=MedioPagoResponse, status_code=201)
def create_medio_pago(
    data: MedioPagoCreate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    service = MedioPagoService(db)
    return service.add(data.model_dump())


@router.put("/{id}", response_model=MedioPagoResponse)
def update_medio_pago(
    id: int,
    data: MedioPagoUpdate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    service = MedioPagoService(db)
    return service.modify(id, data.model_dump(exclude_unset=True))


@router.delete("/{id}")
def delete_medio_pago(
    id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    service = MedioPagoService(db)
    service.remove(id)
    return {"message": f"Medio de pago {id} eliminado"}
