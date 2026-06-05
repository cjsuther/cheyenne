import sys
import os
from typing import List

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", ".."))
from shared.base_module import create_auth_dependency

from database import get_db
from config import get_settings
from services.importador_service import ImportadorService
from schemas.importacion import (
    ImportacionLoteCreate,
    ImportacionLoteResponse,
    ImportacionDetalleResponse,
)

settings = get_settings()
get_current_user = create_auth_dependency(settings.seguridad_url)

router = APIRouter(prefix="/lotes", tags=["Importaciones"])


@router.get("", response_model=List[ImportacionLoteResponse])
def list_lotes(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    service = ImportadorService(db)
    return service.list_lotes(skip=skip, limit=limit)


@router.get("/{id}", response_model=ImportacionLoteResponse)
def get_lote(
    id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    service = ImportadorService(db)
    return service.find_lote_by_id(id)


@router.post("", response_model=ImportacionLoteResponse, status_code=201)
def create_lote(
    data: ImportacionLoteCreate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    service = ImportadorService(db)
    return service.create_lote(data.model_dump())


@router.get("/{id}/detalles", response_model=List[ImportacionDetalleResponse])
def list_detalles(
    id: int,
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    service = ImportadorService(db)
    return service.list_detalles_by_lote(id, skip=skip, limit=limit)
