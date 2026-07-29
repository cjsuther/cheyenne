import sys
import os
from collections import defaultdict
from decimal import Decimal
from typing import Optional

import httpx
from fastapi import APIRouter, Depends, Query, HTTPException, status
from sqlalchemy.orm import Session
from starlette.requests import Request

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", ".."))
from shared.base_module import create_auth_dependency

from database import get_db
from config import get_settings
from models.gasto import GastoExpediente

settings = get_settings()
get_current_user = create_auth_dependency(settings.seguridad_url)


def _requiere(cu, permiso):
    if cu.get("superuser"):
        return
    if permiso not in [p["codigo"] for p in cu.get("permisos", [])]:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=f"No tiene el permiso '{permiso}'")


router = APIRouter(tags=["Reportes contables"])

# Estados que cuentan como ejecutados en cada etapa acumulada del ciclo del gasto
# (comprometido implica preventivado, devengado implica comprometido, etc.)
_ORDEN = ["preventivado", "comprometido", "devengado", "pagado"]


def _presu_partidas(anio: int, token: str):
    """Trae las partidas del ejercicio desde presupuesto (best-effort para enriquecer dimensiones)."""
    try:
        with httpx.Client(timeout=20) as client:
            r = client.get(f"{settings.presupuesto_url}/partidas",
                           params={"anio": anio, "limit": 200},
                           headers={"Authorization": token} if token else {})
        if r.status_code >= 400:
            return {}, f"Presupuesto respondió HTTP {r.status_code}"
        return {p["id"]: p for p in r.json()}, None
    except Exception as e:
        return {}, f"No se pudo consultar presupuesto: {e}"


@router.get("/rendicion")
def rendicion(request: Request, anio: int = Query(...), trimestre: Optional[int] = Query(None, ge=1, le=4),
              db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    """Rendición de cuentas RAFAM: ejecución del gasto por etapa / objeto / jurisdicción.
    Consulta las dimensiones de cada partida a Presupuesto por HTTP (best-effort).
    trimestre acota por el mes de creación del expediente (1=ene-mar, ...)."""
    _requiere(current_user, "contaduria_rendicion")
    token = request.headers.get("authorization")

    partidas, aviso = _presu_partidas(anio, token)

    q = db.query(GastoExpediente).filter(GastoExpediente.anio == anio, GastoExpediente.activo == True)
    gastos = q.all()

    def _en_trimestre(g):
        if not trimestre or not g.created_at:
            return True
        mes = g.created_at.month
        return (trimestre - 1) * 3 < mes <= trimestre * 3

    gastos = [g for g in gastos if _en_trimestre(g) and g.estado != "anulado"]

    # Acumuladores por dimensión y por etapa
    por_etapa = {e: Decimal("0") for e in _ORDEN}
    por_objeto = defaultdict(lambda: defaultdict(lambda: Decimal("0")))
    por_jurisdiccion = defaultdict(lambda: defaultdict(lambda: Decimal("0")))

    for g in gastos:
        idx = _ORDEN.index(g.estado) if g.estado in _ORDEN else -1
        importe = Decimal(str(g.importe))
        p = partidas.get(g.id_partida) or {}
        obj = p.get("objeto_gasto") or {}
        jur = p.get("jurisdiccion") or {}
        obj_key = f"{obj.get('codigo', '?')} - {obj.get('nombre', '')}".strip(" -") or f"partida {g.id_partida}"
        jur_key = f"{jur.get('codigo', '?')} - {jur.get('nombre', '')}".strip(" -") or "sin jurisdicción"
        # cada etapa <= estado actual se considera ejecutada por ese importe
        for i, etapa in enumerate(_ORDEN):
            if idx >= i:
                por_etapa[etapa] += importe
                por_objeto[obj_key][etapa] += importe
                por_jurisdiccion[jur_key][etapa] += importe

    def _fila(d):
        return {e: float(v) for e, v in d.items()}

    out = {
        "anio": anio, "trimestre": trimestre,
        "expedientes": len(gastos),
        "por_etapa": {e: float(v) for e, v in por_etapa.items()},
        "por_objeto_gasto": [{"objeto": k, **_fila(v)} for k, v in sorted(por_objeto.items())],
        "por_jurisdiccion": [{"jurisdiccion": k, **_fila(v)} for k, v in sorted(por_jurisdiccion.items())],
    }
    if aviso:
        out["aviso"] = aviso + " — se reporta por id de partida (sin nombres de dimensión)."
    return out


@router.get("/deuda-flotante")
def deuda_flotante(anio: int = Query(...), db: Session = Depends(get_db),
                   current_user: dict = Depends(get_current_user)):
    """Deuda flotante al cierre: gastos DEVENGADOS y no pagados (obligación asumida, aún impaga)."""
    _requiere(current_user, "contaduria_read")
    q = (db.query(GastoExpediente)
         .filter(GastoExpediente.anio == anio,
                 GastoExpediente.estado == "devengado",
                 GastoExpediente.activo == True)
         .order_by(GastoExpediente.numero))
    items = q.all()
    total = sum((Decimal(str(g.importe)) for g in items), Decimal("0"))
    return {
        "anio": anio, "cantidad": len(items), "total": float(total),
        "items": [{
            "id": g.id, "expediente": f"GEX-{g.anio}-{g.numero:04d}",
            "descripcion": g.descripcion, "proveedor": g.proveedor,
            "id_partida": g.id_partida, "partida": g.partida_etiqueta,
            "factura_numero": g.factura_numero, "importe": float(g.importe),
        } for g in items],
    }
