import sys
import os
from typing import Optional

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", ".."))
from shared.base_module import create_auth_dependency

from database import get_db
from config import get_settings
from services.contribuyente_service import ContribuyenteService

settings = get_settings()
get_current_user = create_auth_dependency(settings.seguridad_url)

router = APIRouter(prefix="/objetos", tags=["Objetos"])


@router.get("/buscar")
def buscar_objetos(
    q: str = Query(..., min_length=2, description="Dominio, nomenclatura, nombre de comercio, CUIT o número de cuenta"),
    tipo: Optional[str] = Query(None, description="vehiculos | inmuebles | comercios (vacío = todos)"),
    limit: int = Query(30, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    """Consulta inversa: encuentra un objeto imponible y devuelve su cuenta y titular(es)."""
    return ContribuyenteService(db).buscar_objetos(q, tipo, limit)
