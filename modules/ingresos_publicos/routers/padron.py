import sys
import os
from typing import List

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", ".."))
from shared.base_module import create_auth_dependency

from database import get_db
from config import get_settings
from services.padron_service import PadronService
from schemas.padron import PadronCalculoItem

settings = get_settings()
get_current_user = create_auth_dependency(settings.seguridad_url)

router = APIRouter(prefix="/padron", tags=["Padrón de cálculo"])


@router.get("/inmuebles", response_model=List[PadronCalculoItem])
def padron_inmuebles(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    """Padrón de cálculo de inmuebles: cada inmueble con su `datos_calculo` (base imponible).

    Lo consume el paso 2 (cargar padrón) del módulo de emisiones para liquidar.
    """
    return PadronService(db).build_padron_inmuebles(skip=skip, limit=limit)


@router.get("/comercios", response_model=List[PadronCalculoItem])
def padron_comercios(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    """Padrón de cálculo de comercios: ingresos declarados (DD.JJ.) + rubros por comercio."""
    return PadronService(db).build_padron_comercios(skip=skip, limit=limit)


@router.get("/vehiculos", response_model=List[PadronCalculoItem])
def padron_vehiculos(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=1000),
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    """Padrón de cálculo de vehículos: valuación DNRPA por dominio."""
    return PadronService(db).build_padron_vehiculos(skip=skip, limit=limit)
