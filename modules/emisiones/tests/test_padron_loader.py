"""Tests del cargador de padrón (consumidor HTTP de ingresos_publicos)."""
import importlib.util
import os
import sys

import httpx

# carga por path: padron_loader sólo usa httpx (evita services/__init__.py -> FastAPI)
EMISIONES_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
_spec = importlib.util.spec_from_file_location(
    "padron_loader", os.path.join(EMISIONES_DIR, "services", "padron_loader.py")
)
_pl = importlib.util.module_from_spec(_spec)
sys.modules["padron_loader"] = _pl
_spec.loader.exec_module(_pl)
fetch_padron = _pl.fetch_padron
items_a_contribuyentes = _pl.items_a_contribuyentes


def test_items_a_contribuyentes_mapea():
    items = [
        {"id_inmueble": 5, "id_contribuyente": 77, "numero_cuenta": "INM-1",
         "datos_calculo": {"variables": {}, "valuaciones": []}},
        {"id_inmueble": 6, "id_contribuyente": None, "numero_cuenta": "INM-2",
         "datos_calculo": {}},
    ]
    filas = items_a_contribuyentes(99, items)
    assert filas[0]["id_padron"] == 99
    assert filas[0]["id_objeto_imponible"] == 5
    assert filas[0]["partida"] == "INM-1"
    assert filas[0]["datos_calculo"]["valuaciones"] == []
    # sin contribuyente -> 0 (la columna es NOT NULL)
    assert filas[1]["id_contribuyente"] == 0


def test_fetch_padron_pagina_y_forwarda_token():
    recibidos = {"auth": None, "skips": []}

    def handler(request: httpx.Request) -> httpx.Response:
        recibidos["auth"] = request.headers.get("authorization")
        skip = int(dict(request.url.params)["skip"])
        recibidos["skips"].append(skip)
        # limit=2: página 1 (skip 0) llena con 2 items; página 2 (skip 2) parcial con 1 -> corta
        if skip == 0:
            data = [{"id_inmueble": 1}, {"id_inmueble": 2}]
        else:
            data = [{"id_inmueble": 3}]
        return httpx.Response(200, json=data)

    items = fetch_padron("http://ingresos_publicos:8000", "inmuebles",
                         token="Bearer xyz", limit=2, transport=httpx.MockTransport(handler))

    assert [it["id_inmueble"] for it in items] == [1, 2, 3]
    assert recibidos["auth"] == "Bearer xyz"        # token reenviado
    assert recibidos["skips"] == [0, 2]             # paginó


def test_fetch_padron_tributo_sin_endpoint():
    import pytest
    with pytest.raises(ValueError):
        fetch_padron("http://x", "cementerio", token=None)
