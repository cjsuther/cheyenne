import sys
import os
from typing import List

from fastapi import APIRouter, Depends, Query, HTTPException, status
from fastapi.responses import Response
from sqlalchemy.orm import Session

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", ".."))
from shared.base_module import create_auth_dependency

from database import get_db
from config import get_settings
from services.boleta_service import BoletaService
from schemas.boleta import BoletaCreate, BoletaResponse

settings = get_settings()
get_current_user = create_auth_dependency(settings.seguridad_url)


def _requiere(cu, permiso):
    if cu.get("superuser"):
        return
    if permiso not in [p["codigo"] for p in cu.get("permisos", [])]:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=f"No tiene el permiso '{permiso}'")


router = APIRouter(prefix="/boletas", tags=["Boletas"])


@router.get("", response_model=List[BoletaResponse])
def list_boletas(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=200),
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    _requiere(current_user, "interface_read")
    service = BoletaService(db)
    return service.list(skip=skip, limit=limit)


@router.get("/by-cuenta/{numero}", response_model=List[BoletaResponse])
def get_boletas_by_cuenta(
    numero: str,
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=200),
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    _requiere(current_user, "interface_read")
    service = BoletaService(db)
    return service.find_by_cuenta(numero, skip=skip, limit=limit)


@router.get("/{id}/pdf")
def get_boleta_pdf(
    id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    _requiere(current_user, "interface_read")
    service = BoletaService(db)
    boleta = service.find_by_id(id)
    pdf = service.build_pdf(boleta)
    return Response(
        content=pdf,
        media_type="application/pdf",
        headers={"Content-Disposition": f'inline; filename="boleta_{id}.pdf"'},
    )


@router.get("/{id}", response_model=BoletaResponse)
def get_boleta(
    id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    _requiere(current_user, "interface_read")
    service = BoletaService(db)
    return service.find_by_id(id)


@router.post("", response_model=BoletaResponse, status_code=201)
def generate_boleta(
    data: BoletaCreate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    _requiere(current_user, "interface_write")
    service = BoletaService(db)
    return service.generate_boleta(data.model_dump())
