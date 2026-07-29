"""Recibo/certificado PDF para el contribuyente por un pago hecho por autogestión.
Genera el PDF localmente con reportlab. También expone (best-effort) los recibos
PDF que emisiones ya haya generado para el contribuyente."""
import sys
import os
import logging

from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import Response
from sqlalchemy.orm import Session
from starlette.requests import Request
import httpx

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", ".."))
from shared.base_module import create_auth_dependency

from database import get_db
from config import get_settings
from services.pago_service import PagoService
from services.cuenta_service import CuentaService
from services.recibo_pdf_service import generar_recibo_pdf

settings = get_settings()
get_current_user = create_auth_dependency(settings.seguridad_url)

router = APIRouter(prefix="/recibos", tags=["Recibos"])
logger = logging.getLogger("wav.recibos")


@router.get("/pago-contado/{id_pago}/pdf")
def recibo_pago_contado_pdf(
    id_pago: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    """Genera y devuelve el recibo PDF de un pago de contado hecho por autogestión."""
    from models.pago_contado import PagoContado
    pago = db.query(PagoContado).filter(PagoContado.id == id_pago).first()
    if not pago:
        raise HTTPException(status_code=404, detail="Pago no encontrado")
    cuenta = None
    if pago.id_cuenta:
        try:
            cuenta = CuentaService(db).find_by_id(pago.id_cuenta)
        except Exception:
            cuenta = None
    pdf = generar_recibo_pdf(pago, cuenta)
    return Response(
        content=pdf,
        media_type="application/pdf",
        headers={"Content-Disposition": f'inline; filename="recibo-wav-{id_pago:08d}.pdf"'},
    )


@router.get("/emisiones/by-contribuyente/{id_contribuyente}")
def recibos_emisiones_por_contribuyente(
    id_contribuyente: int,
    request: Request,
    current_user: dict = Depends(get_current_user),
):
    """Best-effort: lista los recibos PDF que emisiones ya generó para el
    contribuyente (para descargar los recibos oficiales de deuda pagada)."""
    token = request.headers.get("authorization")
    headers = {"Authorization": token} if token else {}
    try:
        with httpx.Client(timeout=15) as client:
            resp = client.get(
                f"{settings.emisiones_url}/emisiones/recibos-pdf/by-contribuyente/{id_contribuyente}",
                headers=headers,
            )
        if resp.status_code >= 400:
            logger.warning("emisiones recibos-pdf HTTP %s", resp.status_code)
            return []
        return resp.json()
    except Exception as e:
        logger.warning("no se pudieron listar recibos de emisiones: %s", e)
        return []
