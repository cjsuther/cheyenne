"""Deuda / cuenta corriente del contribuyente para autoconsulta y pago de deuda
existente (no sólo DDJJ nueva). Toda la deuda se consulta por HTTP a emisiones;
WAV nunca lee la base de emisiones directamente."""
import sys
import os
import logging

from fastapi import APIRouter, Depends, Query, HTTPException, Body
from starlette.requests import Request
import httpx

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", ".."))
from shared.base_module import create_auth_dependency

from config import get_settings

settings = get_settings()
get_current_user = create_auth_dependency(settings.seguridad_url)

router = APIRouter(prefix="/deuda", tags=["Deuda"])
logger = logging.getLogger("wav.deuda")


def _emisiones_get(path: str, token: str, params: dict = None):
    headers = {"Authorization": token} if token else {}
    with httpx.Client(timeout=15) as client:
        resp = client.get(f"{settings.emisiones_url}/emisiones{path}", headers=headers, params=params or {})
    if resp.status_code >= 400:
        raise HTTPException(status_code=resp.status_code,
                            detail=f"emisiones respondió {resp.status_code}: {resp.text[:200]}")
    return resp.json()


def _emisiones_post(path: str, token: str, payload: dict):
    headers = {"Authorization": token} if token else {}
    with httpx.Client(timeout=15) as client:
        resp = client.post(f"{settings.emisiones_url}/emisiones{path}", headers=headers, json=payload)
    if resp.status_code >= 400:
        raise HTTPException(status_code=resp.status_code,
                            detail=f"emisiones respondió {resp.status_code}: {resp.text[:200]}")
    return resp.json()


@router.get("/by-contribuyente/{id_contribuyente}")
def deuda_por_contribuyente(
    id_contribuyente: int,
    request: Request,
    solo_deuda: bool = Query(True, description="Si es True, sólo conceptos con saldo > 0"),
    current_user: dict = Depends(get_current_user),
):
    """Cuenta corriente / deuda del contribuyente (con recargo por mora calculado a hoy).
    Consume el endpoint de cuenta-corriente de emisiones reenviando el token."""
    token = request.headers.get("authorization")
    return _emisiones_get(
        f"/cuenta-corriente/by-contribuyente/{id_contribuyente}",
        token,
        params={"solo_deuda": solo_deuda},
    )


@router.get("/pagos/by-contribuyente/{id_contribuyente}")
def pagos_por_contribuyente(
    id_contribuyente: int,
    request: Request,
    current_user: dict = Depends(get_current_user),
):
    """Recibos/pagos ya registrados del contribuyente en emisiones (historial)."""
    token = request.headers.get("authorization")
    return _emisiones_get(f"/pagos/by-contribuyente/{id_contribuyente}", token)


@router.post("/pagar/{id_cc}")
def pagar_deuda(
    id_cc: int,
    request: Request,
    data: dict = Body(...),
    current_user: dict = Depends(get_current_user),
):
    """Paga un concepto de deuda existente de la cuenta corriente del contribuyente.
    Baja el saldo en emisiones (id_cc = id de la cuenta corriente). data: {importe, fecha_pago?}."""
    importe = data.get("importe")
    if importe is None:
        raise HTTPException(status_code=400, detail="importe es obligatorio")
    token = request.headers.get("authorization")
    payload = {"importe": importe}
    if data.get("fecha_pago"):
        payload["fecha_pago"] = data["fecha_pago"]
    return _emisiones_post(f"/cuenta-corriente/{id_cc}/pagar", token, payload)
