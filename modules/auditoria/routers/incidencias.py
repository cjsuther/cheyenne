import sys
import os
from typing import List, Optional
from datetime import datetime

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from starlette.requests import Request

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", ".."))
from shared.base_module import create_auth_dependency
from shared.filters import filtered_query

from database import get_db
from config import get_settings
from services.incidencia_service import IncidenciaService
from models.incidencia import Incidencia
from schemas.incidencia import IncidenciaCreate, IncidenciaResponse

settings = get_settings()
get_current_user = create_auth_dependency(settings.seguridad_url)

router = APIRouter(prefix="/incidencias", tags=["Incidencias"])


@router.get("", response_model=List[IncidenciaResponse])
def list_incidencias(
    request: Request,
    id_tipo_incidencia: Optional[int] = Query(None),
    id_nivel_criticidad: Optional[int] = Query(None),
    fecha_desde: Optional[datetime] = Query(None),
    fecha_hasta: Optional[datetime] = Query(None),
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    query = db.query(Incidencia)
    if id_tipo_incidencia is not None:
        query = query.filter(Incidencia.id_tipo_incidencia == id_tipo_incidencia)
    if id_nivel_criticidad is not None:
        query = query.filter(Incidencia.id_nivel_criticidad == id_nivel_criticidad)
    if fecha_desde:
        query = query.filter(Incidencia.fecha >= fecha_desde)
    if fecha_hasta:
        query = query.filter(Incidencia.fecha <= fecha_hasta)
    query = filtered_query(query, Incidencia, dict(request.query_params), exclude={'skip', 'limit', 'id_tipo_incidencia', 'id_nivel_criticidad', 'fecha_desde', 'fecha_hasta'})
    return query.order_by(Incidencia.id.desc()).offset(skip).limit(limit).all()


@router.get("/{id}", response_model=IncidenciaResponse)
def get_incidencia(
    id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    service = IncidenciaService(db)
    return service.find_by_id(id)


@router.post("", response_model=IncidenciaResponse, status_code=201)
def create_incidencia(
    data: IncidenciaCreate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    service = IncidenciaService(db)
    return service.add(data.model_dump())
