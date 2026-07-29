import sys
import os
from typing import List

from fastapi import APIRouter, Depends, Query, HTTPException, status, Header
from starlette.requests import Request
from sqlalchemy.orm import Session

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", ".."))
from shared.base_module import create_auth_dependency

from database import get_db
from config import get_settings
from services.pago_service import PagoService
from schemas.pago import PagoNotificacionCreate, PagoNotificacionResponse

settings = get_settings()
get_current_user = create_auth_dependency(settings.seguridad_url)


def _requiere(cu, permiso):
    if cu.get("superuser"):
        return
    if permiso not in [p["codigo"] for p in cu.get("permisos", [])]:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=f"No tiene el permiso '{permiso}'")


router = APIRouter(prefix="/pagos", tags=["Pagos"])


@router.get("/notificaciones", response_model=List[PagoNotificacionResponse])
def list_notificaciones(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=200),
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    _requiere(current_user, "interface_read")
    service = PagoService(db)
    return service.list_notificaciones(skip=skip, limit=limit)


@router.post("/notificaciones", response_model=PagoNotificacionResponse, status_code=201)
async def create_notificacion(
    request: Request,
    x_signature: str = Header(None, alias="X-Signature"),
    db: Session = Depends(get_db),
):
    """Webhook de pasarela de pago. NO usa auth de usuario: se valida por firma
    HMAC-SHA256 del body crudo contra webhook_secret. Idempotente por id de
    transacción del proveedor. Al aceptar un pago aprobado impacta la deuda en Emisiones."""
    raw = await request.body()
    service = PagoService(db)
    if not service.verify_signature(raw, x_signature):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Firma HMAC inválida")
    try:
        data = PagoNotificacionCreate.model_validate_json(raw)
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail=f"Body inválido: {e}")
    # Un webhook no lleva token de usuario; el impacto en emisiones va sin Authorization.
    return service.process_webhook(data.model_dump())
