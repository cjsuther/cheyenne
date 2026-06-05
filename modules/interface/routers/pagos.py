import sys
import os
from typing import List

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", ".."))
from shared.base_module import create_auth_dependency

from database import get_db
from config import get_settings
from services.pago_service import PagoService
from schemas.pago import PagoNotificacionCreate, PagoNotificacionResponse

settings = get_settings()
get_current_user = create_auth_dependency(settings.seguridad_url)

router = APIRouter(prefix="/pagos", tags=["Pagos"])


@router.get("/notificaciones", response_model=List[PagoNotificacionResponse])
def list_notificaciones(
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    service = PagoService(db)
    return service.list_notificaciones(skip=skip, limit=limit)


@router.post("/notificaciones", response_model=PagoNotificacionResponse, status_code=201)
def create_notificacion(
    data: PagoNotificacionCreate,
    db: Session = Depends(get_db),
):
    """Webhook endpoint for payment gateway notifications. No auth required."""
    service = PagoService(db)
    return service.create_notificacion(data.model_dump())
