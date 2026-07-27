import sys
import os
from typing import List

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", ".."))
from shared.base_module import create_auth_dependency

from database import get_db
from config import get_settings
import logging
import httpx
from starlette.requests import Request

from services.pago_service import PagoService
from services.cuenta_service import CuentaService
from schemas.pago import (
    PagoContadoCreate,
    PagoContadoResponse,
    PlanPagoCreate,
    PlanPagoResponse,
)

settings = get_settings()
get_current_user = create_auth_dependency(settings.seguridad_url)

router = APIRouter(prefix="/pagos", tags=["Pagos"])

logger = logging.getLogger("wav.pagos")


def _registrar_en_tesoreria(pago, cuenta, token: str) -> None:
    """Best-effort: el pago de autogestión se registra como recaudación en Tesorería."""
    try:
        payload = {
            "origen": "wav",
            "importe": float(pago.importe),
            "numero_cuenta": getattr(cuenta, "numero_cuenta", None),
            "codigo_tipo_tributo": str(getattr(cuenta, "id_tipo_tributo", "") or ""),
        }
        headers = {"Authorization": token} if token else {}
        with httpx.Client(timeout=10) as client:
            resp = client.post(f"{settings.tesoreria_url}/recaudacion-lotes/cobro-externo",
                               json=payload, headers=headers)
        if resp.status_code >= 400:
            logger.warning("tesoreria rechazó el cobro WAV: HTTP %s %s", resp.status_code, resp.text[:200])
    except Exception as e:
        logger.warning("no se pudo registrar el pago WAV en tesoreria: %s", e)


@router.post("/contado", response_model=PagoContadoResponse, status_code=201)
def create_pago_contado(
    data: PagoContadoCreate,
    request: Request,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    service = PagoService(db)
    pago = service.create_pago_contado(data.model_dump())
    cuenta = None
    if pago.id_cuenta:
        try:
            cuenta = CuentaService(db).find_by_id(pago.id_cuenta)
        except Exception:
            cuenta = None
    _registrar_en_tesoreria(pago, cuenta, request.headers.get("authorization"))
    return pago


@router.post("/plan-pago", response_model=PlanPagoResponse, status_code=201)
def create_plan_pago(
    data: PlanPagoCreate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    service = PagoService(db)
    return service.create_plan_pago(data.model_dump())


@router.get("/by-cuenta/{id}")
def list_pagos_by_cuenta(
    id: int,
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    service = PagoService(db)
    return service.list_pagos_by_cuenta(id, skip=skip, limit=limit)
