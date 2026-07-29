import sys
import os
import json

from fastapi import APIRouter, Depends, Query, HTTPException, status
from starlette.requests import Request
from sqlalchemy.orm import Session

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", ".."))
from shared.base_module import create_auth_dependency

from database import get_db
from config import get_settings
from services.afip_service import AfipService, TIPO_CONSULTA_CONSTANCIA
from services.consulta_service import ConsultaService

settings = get_settings()
get_current_user = create_auth_dependency(settings.seguridad_url)


def _requiere(cu, permiso):
    if cu.get("superuser"):
        return
    if permiso not in [p["codigo"] for p in cu.get("permisos", [])]:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=f"No tiene el permiso '{permiso}'")


router = APIRouter(prefix="/afip", tags=["AFIP"])


@router.get("/constancia")
def constancia(
    request: Request,
    cuit: str = Query(..., description="CUIT a consultar (11 dígitos)"),
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    _requiere(current_user, "interface_read")
    resultado = AfipService().consultar_constancia(cuit)

    # Guarda la consulta en la tabla Consulta (auditoría de padrón)
    try:
        ConsultaService(db).create({
            "id_tipo_consulta": TIPO_CONSULTA_CONSTANCIA,
            "identificador": resultado.get("cuit", cuit),
            "datos_consulta": json.dumps({"cuit": cuit}),
            "datos_respuesta": json.dumps(resultado, ensure_ascii=False),
            "id_estado_consulta": 20 if resultado.get("ok") else 90,
            "ip_origen": request.client.host if request.client else None,
        })
    except Exception:
        pass  # best-effort: no romper la respuesta por el registro de auditoría

    return resultado
