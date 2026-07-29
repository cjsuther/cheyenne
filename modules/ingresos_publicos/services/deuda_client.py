"""Cliente HTTP de deuda contra el módulo `emisiones` (cuenta corriente).

Regla de arquitectura: ingresos_publicos NUNCA lee la BD de emisiones; consulta la deuda
por HTTP reenviando el token del usuario. Best-effort en cuanto a red, pero acá el error
SÍ importa (no se puede emitir un libre-deuda si no se pudo verificar la deuda), así que se
propaga como HTTPException 502.
"""
from decimal import Decimal
from typing import List, Optional

import httpx
from fastapi import HTTPException

from config import get_settings

settings = get_settings()


def _num(v) -> Decimal:
    try:
        return Decimal(str(v)) if v is not None else Decimal("0")
    except Exception:
        return Decimal("0")


def deuda_por_contribuyente(id_contribuyente: int, token: Optional[str]) -> List[dict]:
    """Consulta a emisiones la cuenta corriente con saldo (>0) del contribuyente.

    Devuelve la lista de conceptos de deuda (dicts). Lanza 502 si emisiones no responde.
    """
    headers = {"Authorization": token} if token else {}
    url = f"{settings.emisiones_url}/emisiones/cuenta-corriente/by-contribuyente/{id_contribuyente}"
    try:
        with httpx.Client(timeout=15) as client:
            resp = client.get(url, headers=headers, params={"solo_deuda": True})
    except Exception as e:  # red caída, timeout, DNS
        raise HTTPException(status_code=502, detail=f"No se pudo consultar la deuda en emisiones: {e}")
    if resp.status_code == 404:
        return []
    if resp.status_code >= 400:
        raise HTTPException(status_code=502,
                            detail=f"emisiones devolvió HTTP {resp.status_code} al consultar la deuda")
    try:
        return resp.json() or []
    except Exception:
        return []


def resumen_deuda(items: List[dict]) -> dict:
    """Suma la deuda pendiente (usa total_a_pagar si viene con recargo, si no el saldo)."""
    total = Decimal("0")
    detalle = []
    for it in items:
        pendiente = _num(it.get("total_a_pagar")) or _num(it.get("saldo"))
        if pendiente <= 0:
            continue
        total += pendiente
        detalle.append({
            "concepto": it.get("concepto"),
            "tipo_tributo": it.get("tipo_tributo"),
            "periodo": it.get("periodo"),
            "cuota": it.get("cuota"),
            "saldo": float(_num(it.get("saldo"))),
            "recargo": float(_num(it.get("recargo"))),
            "total_a_pagar": float(pendiente),
        })
    return {"total_deuda": float(total), "cantidad_conceptos": len(detalle), "detalle": detalle}
