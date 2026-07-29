"""Débito automático completo (autogestión).

Flujo:
1. POST /debito/generar-lote  -> arma un lote para un período y un medio (cbu/tarjeta)
   tomando las adhesiones activas y la deuda del período de cada cuenta.
   La deuda se consulta por HTTP a emisiones (best-effort: si emisiones no
   responde, la adhesión se incluye con importe 0 y no rompe el lote).
2. GET  /debito/lotes  y  GET /debito/lotes/{id}  -> listado y detalle.
3. GET  /debito/lotes/{id}/archivo -> archivo de texto formato CBU (cabecera +
   una línea por CBU e importe) como PlainTextResponse.
4. POST /debito/lotes/{id}/procesar-rechazos -> recibe items rechazados con
   motivo y actualiza estados (rechazado / debitado) y el estado del lote.

WAV nunca lee la base de emisiones: sólo la consulta por HTTP reenviando el token.
"""
import sys
import os
import logging
from decimal import Decimal
from datetime import datetime, timezone
from typing import List, Optional

from fastapi import APIRouter, Depends, Query, HTTPException, status, Body
from fastapi.responses import PlainTextResponse
from sqlalchemy.orm import Session
from starlette.requests import Request
from pydantic import BaseModel
import httpx

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", ".."))
from shared.base_module import create_auth_dependency
from shared.filters import filtered_query

from database import get_db
from config import get_settings
from models.adhesion_debito import AdhesionDebito
from models.cuenta import Cuenta
from models.lote_debito import LoteDebito
from models.debito_item import DebitoItem

settings = get_settings()
get_current_user = create_auth_dependency(settings.seguridad_url)

router = APIRouter(prefix="/debito", tags=["Débito automático"])
logger = logging.getLogger("wav.debito")

MEDIOS = ("cbu", "tarjeta")


def _requiere(cu, permiso):
    if cu.get("superuser"):
        return
    if permiso not in [p["codigo"] for p in cu.get("permisos", [])]:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=f"No tiene el permiso '{permiso}'")


def _deuda_contribuyente(id_contribuyente: int, token: str) -> list:
    """Consulta la deuda del contribuyente a emisiones. Best-effort: ante cualquier
    error devuelve lista vacía (el lote se genera igual con importe 0)."""
    if not id_contribuyente:
        return []
    try:
        headers = {"Authorization": token} if token else {}
        with httpx.Client(timeout=15) as client:
            resp = client.get(
                f"{settings.emisiones_url}/emisiones/cuenta-corriente/by-contribuyente/{id_contribuyente}",
                headers=headers, params={"solo_deuda": True},
            )
        if resp.status_code < 400:
            data = resp.json()
            return data if isinstance(data, list) else data.get("items", [])
        logger.warning("emisiones deuda HTTP %s para contribuyente %s", resp.status_code, id_contribuyente)
    except Exception as e:
        logger.warning("no se pudo consultar deuda en emisiones para %s: %s", id_contribuyente, e)
    return []


def _deuda_periodo(conceptos: list, periodo: str) -> Decimal:
    """Suma el 'a pagar' de los conceptos de deuda que correspondan al período.
    Si un concepto no trae período, se incluye igual (deuda vencida general)."""
    total = Decimal("0")
    for c in conceptos:
        cp = str(c.get("periodo") or "")
        if periodo and cp and cp != periodo:
            continue
        val = c.get("total_a_pagar")
        if val is None:
            val = c.get("saldo", 0)
        try:
            total += Decimal(str(val or 0))
        except Exception:
            continue
    return total


# ── Schemas ──────────────────────────────────────────────────────────

class GenerarLoteRequest(BaseModel):
    periodo: str                      # '2026-06'
    medio: str = "cbu"                # 'cbu' | 'tarjeta'


class RechazoItem(BaseModel):
    id_item: int
    motivo: Optional[str] = None


class ProcesarRechazosRequest(BaseModel):
    rechazos: List[RechazoItem] = []
    marcar_resto_debitado: bool = True   # los items no rechazados pasan a 'debitado'


def _lote_dict(l: LoteDebito) -> dict:
    return {
        "id": l.id, "periodo": l.periodo, "medio": l.medio, "estado": l.estado,
        "total": float(l.total or 0), "cantidad": l.cantidad,
        "fecha": l.fecha.isoformat() if l.fecha else None,
    }


def _item_dict(it: DebitoItem) -> dict:
    return {
        "id": it.id, "id_lote": it.id_lote, "id_adhesion": it.id_adhesion,
        "id_cuenta": it.id_cuenta, "medio": it.medio, "datos": it.datos,
        "titular": it.titular, "importe": float(it.importe or 0),
        "estado": it.estado, "motivo_rechazo": it.motivo_rechazo,
    }


# ── Generar lote ─────────────────────────────────────────────────────

@router.post("/generar-lote", status_code=201)
def generar_lote(
    data: GenerarLoteRequest,
    request: Request,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    _requiere(current_user, "wav_debito")
    if data.medio not in MEDIOS:
        raise HTTPException(status_code=422, detail=f"medio debe ser uno de {MEDIOS}")

    token = request.headers.get("authorization")

    adhesiones = (
        db.query(AdhesionDebito)
        .filter(AdhesionDebito.activo == True, AdhesionDebito.medio == data.medio)
        .all()
    )

    lote = LoteDebito(
        periodo=data.periodo, medio=data.medio, estado="generado",
        total=Decimal("0"), cantidad=0,
        fecha=datetime.now(timezone.utc),
    )
    db.add(lote)
    db.flush()  # id disponible

    # cache de deuda por contribuyente para no repetir llamadas HTTP
    cuenta_cache: dict = {}
    deuda_cache: dict = {}
    total = Decimal("0")
    cantidad = 0

    for adh in adhesiones:
        cuenta = cuenta_cache.get(adh.id_cuenta)
        if cuenta is None:
            cuenta = db.query(Cuenta).filter(Cuenta.id == adh.id_cuenta).first()
            cuenta_cache[adh.id_cuenta] = cuenta
        id_contrib = getattr(cuenta, "id_contribuyente", None) if cuenta else None

        if id_contrib not in deuda_cache:
            deuda_cache[id_contrib] = _deuda_contribuyente(id_contrib, token)
        importe = _deuda_periodo(deuda_cache[id_contrib], data.periodo)

        if importe <= 0:
            # sin deuda del período: no se genera renglón de débito
            continue

        item = DebitoItem(
            id_lote=lote.id, id_adhesion=adh.id, id_cuenta=adh.id_cuenta,
            medio=adh.medio, datos=adh.datos, titular=adh.titular,
            importe=importe, estado="pendiente",
        )
        db.add(item)
        total += importe
        cantidad += 1

    lote.total = total
    lote.cantidad = cantidad
    db.commit()
    db.refresh(lote)
    return _lote_dict(lote)


# ── Listado y detalle ────────────────────────────────────────────────

@router.get("/lotes")
def listar_lotes(
    request: Request,
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=200),
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    _requiere(current_user, "wav_debito")
    q = db.query(LoteDebito).filter(LoteDebito.activo == True)
    q = filtered_query(
        q, LoteDebito, dict(request.query_params),
        exclude={"skip", "limit"}, default_sort="-id",
    )
    return [_lote_dict(l) for l in q.offset(skip).limit(limit).all()]


@router.get("/lotes/{id_lote}")
def detalle_lote(
    id_lote: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    _requiere(current_user, "wav_debito")
    lote = db.query(LoteDebito).filter(LoteDebito.id == id_lote).first()
    if not lote:
        raise HTTPException(status_code=404, detail="Lote no encontrado")
    items = (
        db.query(DebitoItem)
        .filter(DebitoItem.id_lote == id_lote)
        .order_by(DebitoItem.id.asc())
        .all()
    )
    out = _lote_dict(lote)
    out["items"] = [_item_dict(it) for it in items]
    return out


# ── Archivo de débito (formato CBU) ──────────────────────────────────

@router.get("/lotes/{id_lote}/archivo", response_class=PlainTextResponse)
def archivo_lote(
    id_lote: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    """Genera el archivo de texto de débito formato CBU: una cabecera con período,
    medio, fecha, cantidad y total; luego una línea por débito con CBU e importe.
    Importe en centavos, sin separadores, alineado a 15 posiciones (estándar de
    intercambio bancario simplificado)."""
    _requiere(current_user, "wav_debito")
    lote = db.query(LoteDebito).filter(LoteDebito.id == id_lote).first()
    if not lote:
        raise HTTPException(status_code=404, detail="Lote no encontrado")
    items = (
        db.query(DebitoItem)
        .filter(DebitoItem.id_lote == id_lote)
        .order_by(DebitoItem.id.asc())
        .all()
    )

    fecha_str = (lote.fecha or datetime.now(timezone.utc)).strftime("%Y%m%d")
    total_centavos = int((Decimal(str(lote.total or 0)) * 100).quantize(Decimal("1")))
    # Cabecera (tipo de registro 0)
    cabecera = "0{fecha}{medio:<8}{periodo:<8}{cant:0>6}{total:0>15}".format(
        fecha=fecha_str,
        medio=(lote.medio or "")[:8].upper(),
        periodo=(lote.periodo or "")[:8],
        cant=lote.cantidad or 0,
        total=total_centavos,
    )
    lineas = [cabecera]
    for it in items:
        cbu = "".join(ch for ch in (it.datos or "") if ch.isdigit())[:22]
        imp_centavos = int((Decimal(str(it.importe or 0)) * 100).quantize(Decimal("1")))
        # Detalle (tipo de registro 1): CBU(22) + importe(15) + titular(30)
        lineas.append("1{cbu:<22}{importe:0>15}{titular:<30}".format(
            cbu=cbu,
            importe=imp_centavos,
            titular=(it.titular or "")[:30],
        ))
    # Cierre (tipo de registro 9): cantidad + total
    lineas.append("9{cant:0>6}{total:0>15}".format(
        cant=lote.cantidad or 0, total=total_centavos,
    ))

    contenido = "\r\n".join(lineas) + "\r\n"
    filename = f"debito_{lote.medio}_{lote.periodo}_{lote.id}.txt"
    return PlainTextResponse(
        content=contenido,
        headers={"Content-Disposition": f'attachment; filename="{filename}"'},
    )


# ── Procesar rechazos ────────────────────────────────────────────────

@router.post("/lotes/{id_lote}/procesar-rechazos")
def procesar_rechazos(
    id_lote: int,
    data: ProcesarRechazosRequest,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    """Recibe la lista de items rechazados (id_item + motivo) y actualiza estados:
    los rechazados pasan a 'rechazado' con su motivo; el resto (si
    marcar_resto_debitado) pasa a 'debitado'. El lote pasa a 'procesado'."""
    _requiere(current_user, "wav_debito")
    lote = db.query(LoteDebito).filter(LoteDebito.id == id_lote).first()
    if not lote:
        raise HTTPException(status_code=404, detail="Lote no encontrado")

    items = db.query(DebitoItem).filter(DebitoItem.id_lote == id_lote).all()
    by_id = {it.id: it for it in items}

    rechazados_ids = set()
    for r in data.rechazos:
        it = by_id.get(r.id_item)
        if not it:
            continue
        it.estado = "rechazado"
        it.motivo_rechazo = (r.motivo or "Rechazado")[:250]
        rechazados_ids.add(it.id)

    debitados = 0
    if data.marcar_resto_debitado:
        for it in items:
            if it.id not in rechazados_ids and it.estado != "rechazado":
                it.estado = "debitado"
                it.motivo_rechazo = None
                debitados += 1

    lote.estado = "procesado"
    db.commit()
    db.refresh(lote)
    return {
        "ok": True,
        "lote": _lote_dict(lote),
        "rechazados": len(rechazados_ids),
        "debitados": debitados,
    }


# ── Marcar lote como enviado (paso opcional entre generado y procesado) ──

@router.post("/lotes/{id_lote}/enviar")
def marcar_enviado(
    id_lote: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    _requiere(current_user, "wav_debito")
    lote = db.query(LoteDebito).filter(LoteDebito.id == id_lote).first()
    if not lote:
        raise HTTPException(status_code=404, detail="Lote no encontrado")
    lote.estado = "enviado"
    db.commit()
    db.refresh(lote)
    return _lote_dict(lote)
