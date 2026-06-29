"""Carga del padrón de cálculo desde `ingresos_publicos` (consumidor del contrato).

`fetch_padron` hace la llamada HTTP (no testeable en unidad); `items_a_contribuyentes` mapea
los items a filas `ContribuyentePadron` (puro, testeable).
"""
from typing import Any, Dict, List, Optional

import httpx

# tributo -> endpoint del padrón en ingresos_publicos
_ENDPOINTS = {
    "inmuebles": "/padron/inmuebles",
    "comercios": "/padron/comercios",
    "vehiculos": "/padron/vehiculos",
}


def fetch_padron(base_url: str, tipo_tributo: str, token: Optional[str],
                 limit: int = 1000, transport=None) -> List[Dict[str, Any]]:
    """Trae el padrón de cálculo de un tributo desde ingresos_publicos (paginado).

    `transport` es un hook para tests (httpx.MockTransport); en producción es None.
    """
    path = _ENDPOINTS.get(tipo_tributo)
    if path is None:
        raise ValueError(f"No hay endpoint de padrón para el tributo '{tipo_tributo}'")
    headers = {"Authorization": token} if token else {}
    items: List[Dict[str, Any]] = []
    skip = 0
    with httpx.Client(timeout=60, transport=transport) as client:
        while True:
            resp = client.get(f"{base_url.rstrip('/')}{path}",
                              params={"skip": skip, "limit": limit}, headers=headers)
            resp.raise_for_status()
            batch = resp.json()
            items.extend(batch)
            if len(batch) < limit:
                break
            skip += limit
    return items


def items_a_contribuyentes(id_padron: int, items: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    """Mapea los items del padrón a kwargs de `ContribuyentePadron` (puro)."""
    filas = []
    for it in items:
        filas.append({
            "id_padron": id_padron,
            "id_contribuyente": it.get("id_contribuyente") or 0,
            "id_objeto_imponible": it.get("id_inmueble") or it.get("id_objeto_imponible"),
            "partida": it.get("numero_cuenta"),
            "datos_calculo": it.get("datos_calculo"),
            "estado": "cargado",
        })
    return filas
