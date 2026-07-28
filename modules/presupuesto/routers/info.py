import sys
import os

from fastapi import APIRouter, Depends

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", ".."))
from shared.base_module import create_auth_dependency

from config import get_settings

settings = get_settings()
get_current_user = create_auth_dependency(settings.seguridad_url)

router = APIRouter(prefix="/info", tags=["Info"])


@router.get("/permisos")
def mis_permisos(current_user: dict = Depends(get_current_user)):
    """Permisos de presupuesto del usuario autenticado (verifica la integración con seguridad)."""
    permisos = [p["codigo"] for p in current_user.get("permisos", []) if p["codigo"].startswith("presupuesto_")]
    return {
        "usuario": current_user.get("codigo"),
        "superuser": bool(current_user.get("superuser")),
        "permisos_presupuesto": sorted(permisos),
    }
