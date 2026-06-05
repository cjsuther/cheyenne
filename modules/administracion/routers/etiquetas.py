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
from models.etiqueta import Etiqueta
from services.etiqueta_service import EtiquetaService
from schemas.etiqueta import EtiquetaCreate, EtiquetaResponse

settings = get_settings()
get_current_user = create_auth_dependency(settings.seguridad_url)

router = APIRouter(prefix="/etiquetas", tags=["Etiquetas"])


@router.get("", response_model=List[EtiquetaResponse])
def list_etiquetas(
    request: Request,
    entidad: Optional[str] = Query(None),
    id_entidad: Optional[int] = Query(None),
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    query = db.query(Etiqueta)
    if entidad:
        query = query.filter(Etiqueta.entidad == entidad)
    if id_entidad is not None:
        query = query.filter(Etiqueta.id_entidad == id_entidad)
    query = filtered_query(query, Etiqueta, dict(request.query_params), exclude={'skip', 'limit', 'entidad', 'id_entidad'})
    return query.offset(skip).limit(limit).all()


@router.get("/{id}", response_model=EtiquetaResponse)
def get_etiqueta(
    id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    service = EtiquetaService(db)
    return service.find_by_id(id)


@router.post("", response_model=EtiquetaResponse, status_code=201)
def create_etiqueta(
    data: EtiquetaCreate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    service = EtiquetaService(db)
    return service.add(data.model_dump())


@router.delete("/{id}")
def delete_etiqueta(
    id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    service = EtiquetaService(db)
    service.remove(id)
    return {"message": f"Etiqueta {id} eliminada"}
