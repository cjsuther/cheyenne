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
from models.mensaje import Mensaje
from services.mensaje_service import MensajeService
from schemas.mensaje import MensajeCreate, MensajeUpdate, MensajeResponse

settings = get_settings()
get_current_user = create_auth_dependency(settings.seguridad_url)

router = APIRouter(prefix="/mensajes", tags=["Mensajes"])


@router.get("", response_model=List[MensajeResponse])
def list_mensajes(
    request: Request,
    id_tipo_mensaje: Optional[int] = Query(None),
    id_estado_mensaje: Optional[int] = Query(None),
    id_canal: Optional[int] = Query(None),
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    query = db.query(Mensaje)
    if id_tipo_mensaje is not None:
        query = query.filter(Mensaje.id_tipo_mensaje == id_tipo_mensaje)
    if id_estado_mensaje is not None:
        query = query.filter(Mensaje.id_estado_mensaje == id_estado_mensaje)
    if id_canal is not None:
        query = query.filter(Mensaje.id_canal == id_canal)
    query = filtered_query(query, Mensaje, dict(request.query_params), exclude={'skip', 'limit', 'id_tipo_mensaje', 'id_estado_mensaje', 'id_canal'}, default_sort='id', default_dir='desc')
    return query.offset(skip).limit(limit).all()


@router.get("/{id}", response_model=MensajeResponse)
def get_mensaje(
    id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    service = MensajeService(db)
    return service.find_by_id(id)


@router.post("", response_model=MensajeResponse, status_code=201)
def create_mensaje(
    data: MensajeCreate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    service = MensajeService(db)
    return service.add(data.model_dump())


@router.put("/{id}", response_model=MensajeResponse)
def update_mensaje(
    id: int,
    data: MensajeUpdate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    service = MensajeService(db)
    return service.modify(id, data.model_dump(exclude_unset=True))


@router.delete("/{id}")
def delete_mensaje(
    id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    service = MensajeService(db)
    service.remove(id)
    return {"message": f"Mensaje {id} eliminado"}
