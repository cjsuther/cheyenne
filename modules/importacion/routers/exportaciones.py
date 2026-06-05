import sys
import os
from typing import List

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", ".."))
from shared.base_module import create_auth_dependency

from database import get_db
from config import get_settings
from services.exportador_service import ExportadorService
from schemas.importacion import ExportacionLoteCreate, ExportacionLoteResponse

settings = get_settings()
get_current_user = create_auth_dependency(settings.seguridad_url)

router = APIRouter(prefix="/exportaciones", tags=["Exportaciones"])


@router.get("/lotes", response_model=List[ExportacionLoteResponse])
def list_lotes(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    service = ExportadorService(db)
    return service.list_lotes(skip=skip, limit=limit)


@router.get("/lotes/{id}", response_model=ExportacionLoteResponse)
def get_lote(
    id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    service = ExportadorService(db)
    return service.find_lote_by_id(id)


@router.post("/lotes", response_model=ExportacionLoteResponse, status_code=201)
def create_lote(
    data: ExportacionLoteCreate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    service = ExportadorService(db)
    return service.create_lote(data.model_dump())
