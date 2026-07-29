import sys
import os
from typing import List

from fastapi import APIRouter, Depends, Query, HTTPException, status
from sqlalchemy.orm import Session

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", ".."))
from shared.base_module import create_auth_dependency

from database import get_db
from config import get_settings
from services.consulta_service import ConsultaService
from schemas.consulta import ConsultaCreate, ConsultaResponse

settings = get_settings()
get_current_user = create_auth_dependency(settings.seguridad_url)


def _requiere(cu, permiso):
    if cu.get("superuser"):
        return
    if permiso not in [p["codigo"] for p in cu.get("permisos", [])]:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=f"No tiene el permiso '{permiso}'")


router = APIRouter(prefix="/consultas", tags=["Consultas"])


@router.get("", response_model=List[ConsultaResponse])
def list_consultas(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=200),
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    _requiere(current_user, "interface_read")
    service = ConsultaService(db)
    return service.list(skip=skip, limit=limit)


@router.post("", response_model=ConsultaResponse, status_code=201)
def create_consulta(
    data: ConsultaCreate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    _requiere(current_user, "interface_write")
    service = ConsultaService(db)
    return service.create(data.model_dump())
