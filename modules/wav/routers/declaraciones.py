import sys
import os
from typing import List

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", ".."))
from shared.base_module import create_auth_dependency

from database import get_db
from config import get_settings
from services.declaracion_service import DeclaracionService
from schemas.declaracion import DeclaracionJuradaCreate, DeclaracionJuradaResponse

settings = get_settings()
get_current_user = create_auth_dependency(settings.seguridad_url)

router = APIRouter(prefix="/declaraciones", tags=["Declaraciones Juradas"])


@router.get("", response_model=List[DeclaracionJuradaResponse])
def list_declaraciones(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    service = DeclaracionService(db)
    return service.list(skip=skip, limit=limit)


@router.get("/by-cuenta/{id}", response_model=List[DeclaracionJuradaResponse])
def list_declaraciones_by_cuenta(
    id: int,
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    service = DeclaracionService(db)
    return service.list_by_cuenta(id, skip=skip, limit=limit)


@router.get("/{id}", response_model=DeclaracionJuradaResponse)
def get_declaracion(
    id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    service = DeclaracionService(db)
    return service.find_by_id(id)


@router.post("", response_model=DeclaracionJuradaResponse, status_code=201)
def create_declaracion(
    data: DeclaracionJuradaCreate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    service = DeclaracionService(db)
    return service.create(data.model_dump())
