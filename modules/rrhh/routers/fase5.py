"""FASE 5 — Integración de la liquidación: devengado (contabilidad), orden de pago
(tesorería), recibos a firma y exportadores AFIP/banco.

Endpoints (bajo el prefijo /liquidacion-procesos, reenvían el token del usuario):
  GET  /{id}/integracion            estado de las integraciones del proceso
  POST /{id}/devengar               postea el devengado a contabilidad
  POST /{id}/generar-op             genera la orden de pago en tesorería
  POST /{id}/enviar-recibos-firma   registra un recibo por legajo en el módulo de firma
  GET  /{id}/sicoss                 descarga el TXT SICOSS / F.931
  GET  /{id}/banco                  descarga el TXT de acreditación bancaria
"""
import sys
import os
from decimal import Decimal

from fastapi import APIRouter, Depends, Body, HTTPException, status
from fastapi.responses import PlainTextResponse
from sqlalchemy.orm import Session
from starlette.requests import Request

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", ".."))
from shared.base_module import create_auth_dependency

from database import get_db
from config import get_settings
from models.rrhh import LiquidacionProceso, IntegracionProceso
from services import integracion as integ_svc
from services import exportadores

settings = get_settings()
get_current_user = create_auth_dependency(settings.seguridad_url)

integracion_router = APIRouter(prefix="/liquidacion-procesos", tags=["Integración (Fase 5)"])

_INTEG = ["id", "id_proceso",
          "devengado_estado", "devengado_ref", "devengado_transaccion_id", "devengado_importe",
          "devengado_detalle", "devengado_fecha",
          "op_estado", "op_ref", "op_id", "op_numero", "op_importe", "op_detalle", "op_fecha",
          "firma_estado", "firma_cantidad", "firma_detalle", "firma_fecha"]


def _requiere(cu, permiso):
    if cu.get("superuser"):
        return
    if permiso not in [p["codigo"] for p in cu.get("permisos", [])]:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=f"No tiene el permiso '{permiso}'")


def _ser(x, cols):
    out = {}
    for c in cols:
        v = getattr(x, c)
        if isinstance(v, Decimal):
            v = float(v)
        elif hasattr(v, "isoformat"):
            v = v.isoformat()
        out[c] = v
    return out


def _proc_o_404(db, id):
    proc = db.query(LiquidacionProceso).filter(
        LiquidacionProceso.id == id, LiquidacionProceso.activo == True).first()
    if not proc:
        raise HTTPException(status_code=404, detail="Proceso inexistente")
    return proc


def _estado_dict(db, proc):
    integ = db.query(IntegracionProceso).filter(
        IntegracionProceso.id_proceso == proc.id).first()
    return _ser(integ, _INTEG) if integ else {
        "id_proceso": proc.id, "devengado_estado": "pendiente",
        "op_estado": "pendiente", "firma_estado": "pendiente"}


@integracion_router.get("/{id}/integracion")
def estado_integracion(id: int, db: Session = Depends(get_db),
                       current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "rrhh_read")
    proc = _proc_o_404(db, id)
    return _estado_dict(db, proc)


@integracion_router.post("/{id}/devengar")
def devengar(id: int, request: Request, db: Session = Depends(get_db),
             current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "rrhh_write")
    proc = _proc_o_404(db, id)
    token = request.headers.get("authorization")
    integ = integ_svc.devengar(db, proc, token)
    if integ.devengado_estado == "error":
        raise HTTPException(status_code=502, detail=integ.devengado_detalle or "Error al devengar")
    return _ser(integ, _INTEG)


@integracion_router.post("/{id}/generar-op")
def generar_op(id: int, request: Request, db: Session = Depends(get_db),
               current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "rrhh_write")
    proc = _proc_o_404(db, id)
    token = request.headers.get("authorization")
    integ = integ_svc.generar_op(db, proc, token)
    if integ.op_estado == "error":
        raise HTTPException(status_code=502, detail=integ.op_detalle or "Error al generar la OP")
    return _ser(integ, _INTEG)


@integracion_router.post("/{id}/enviar-recibos-firma")
def enviar_recibos_firma(id: int, request: Request, data: dict = Body(default={}),
                         db: Session = Depends(get_db),
                         current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "rrhh_write")
    proc = _proc_o_404(db, id)
    token = request.headers.get("authorization")
    cantidad_firmas = int(data.get("cantidad_firmas") or 1)
    integ = integ_svc.enviar_recibos_firma(db, proc, token, cantidad_firmas=cantidad_firmas)
    if integ.firma_estado == "error":
        raise HTTPException(status_code=502, detail=integ.firma_detalle or "Error al enviar a firma")
    return _ser(integ, _INTEG)


@integracion_router.get("/{id}/sicoss")
def descargar_sicoss(id: int, db: Session = Depends(get_db),
                     current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "rrhh_read")
    proc = _proc_o_404(db, id)
    texto, nombre = exportadores.sicoss_txt(db, proc)
    return PlainTextResponse(texto, media_type="text/plain; charset=utf-8",
                             headers={"Content-Disposition": f'attachment; filename="{nombre}"'})


@integracion_router.get("/{id}/banco")
def descargar_banco(id: int, formato: str = "cbu", db: Session = Depends(get_db),
                    current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "rrhh_read")
    proc = _proc_o_404(db, id)
    texto, nombre, omitidos = exportadores.banco_txt(db, proc, formato=formato)
    headers = {"Content-Disposition": f'attachment; filename="{nombre}"'}
    if omitidos:
        headers["X-Omitidos"] = str(len(omitidos))  # legajos sin CBU válido
    return PlainTextResponse(texto, media_type="text/plain; charset=utf-8", headers=headers)
