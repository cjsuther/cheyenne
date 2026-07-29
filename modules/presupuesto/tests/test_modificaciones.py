"""Tests de la VALIDACIÓN de modificaciones presupuestarias (RN-03 / RN-04).

Se prueba `_validar_items`, el corazón de reglas de:
  - compensación: la suma de ítems debe balancear en CERO (suma 0 entre partidas)
  - ampliación:   sólo importes positivos
  - reducción:    sólo importes negativos
  - ítem con importe 0 o sin detalle -> inválido
  - partida inexistente / de otro año -> inválido

Se carga el router por PATH (evita routers/__init__.py que arrastra todo el paquete).
"""
import importlib.util
import os
import sys

import pytest
from fastapi import HTTPException

from models.partida import Partida


def _load_router():
    MOD = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
    for p in (MOD, os.path.join(MOD, "..")):
        if p not in sys.path:
            sys.path.insert(0, p)
    path = os.path.join(MOD, "routers", "modificaciones.py")
    spec = importlib.util.spec_from_file_location("presu_mod_router", path)
    mod = importlib.util.module_from_spec(spec)
    sys.modules[spec.name] = mod
    spec.loader.exec_module(mod)
    return mod


_R = _load_router()
_validar_items = _R._validar_items
ModificacionIn = _R.ModificacionIn
ItemIn = _R.ItemIn


def _partida(db, anio=2027, objeto_gasto=1):
    p = Partida(
        anio=anio, id_jurisdiccion=1, id_estructura=1, id_objeto_gasto=objeto_gasto,
        id_fuente=1, credito_inicial=1000, activo=True,
    )
    db.add(p)
    db.flush()
    return p


def _in(anio, tipo, items):
    return ModificacionIn(
        anio=anio, tipo=tipo, acto_administrativo="Decreto 1/2027",
        items=[ItemIn(id_partida=pid, importe=imp, detalle="motivo") for pid, imp in items],
    )


# ------------------------------------------------------------------ compensación (suma 0)

def test_compensacion_balanceada_es_valida(db):
    p1 = _partida(db, objeto_gasto=1)
    p2 = _partida(db, objeto_gasto=2)
    data = _in(2027, "compensacion", [(p1.id, -300), (p2.id, 300)])
    items = _validar_items(db, data)  # no debe lanzar
    assert len(items) == 2


def test_compensacion_no_balanceada_falla(db):
    p1 = _partida(db, objeto_gasto=1)
    p2 = _partida(db, objeto_gasto=2)
    data = _in(2027, "compensacion", [(p1.id, -300), (p2.id, 250)])
    with pytest.raises(HTTPException) as exc:
        _validar_items(db, data)
    assert exc.value.status_code == 409
    assert "cero" in exc.value.detail.lower()


def test_compensacion_multiples_partidas_neto_cero(db):
    p1 = _partida(db, objeto_gasto=1)
    p2 = _partida(db, objeto_gasto=2)
    p3 = _partida(db, objeto_gasto=3)
    data = _in(2027, "compensacion", [(p1.id, -500), (p2.id, 200), (p3.id, 300)])
    items = _validar_items(db, data)
    assert len(items) == 3


# ------------------------------------------------------------------ ampliación / reducción (RN-04)

def test_ampliacion_positiva_valida(db):
    p = _partida(db)
    data = _in(2027, "ampliacion", [(p.id, 500)])
    assert len(_validar_items(db, data)) == 1


def test_ampliacion_con_negativo_falla(db):
    p = _partida(db)
    data = _in(2027, "ampliacion", [(p.id, -500)])
    with pytest.raises(HTTPException) as exc:
        _validar_items(db, data)
    assert exc.value.status_code == 400


def test_reduccion_negativa_valida(db):
    p = _partida(db)
    data = _in(2027, "reduccion", [(p.id, -400)])
    assert len(_validar_items(db, data)) == 1


def test_reduccion_con_positivo_falla(db):
    p = _partida(db)
    data = _in(2027, "reduccion", [(p.id, 400)])
    with pytest.raises(HTTPException) as exc:
        _validar_items(db, data)
    assert exc.value.status_code == 400


# ------------------------------------------------------------------ RN-03: ítems bien formados

def test_importe_cero_falla(db):
    p = _partida(db)
    data = _in(2027, "ampliacion", [(p.id, 0)])
    with pytest.raises(HTTPException) as exc:
        _validar_items(db, data)
    assert exc.value.status_code == 400


def test_detalle_vacio_falla(db):
    p = _partida(db)
    data = ModificacionIn(
        anio=2027, tipo="ampliacion", acto_administrativo="Decreto 1",
        items=[ItemIn(id_partida=p.id, importe=100, detalle="   ")],
    )
    with pytest.raises(HTTPException) as exc:
        _validar_items(db, data)
    assert exc.value.status_code == 400


def test_sin_items_falla(db):
    data = ModificacionIn(anio=2027, tipo="ampliacion", acto_administrativo="Dec", items=[])
    with pytest.raises(HTTPException) as exc:
        _validar_items(db, data)
    assert exc.value.status_code == 400


def test_acto_administrativo_obligatorio(db):
    p = _partida(db)
    data = ModificacionIn(
        anio=2027, tipo="ampliacion", acto_administrativo="   ",
        items=[ItemIn(id_partida=p.id, importe=100, detalle="x")],
    )
    with pytest.raises(HTTPException) as exc:
        _validar_items(db, data)
    assert exc.value.status_code == 400


def test_tipo_invalido_falla(db):
    p = _partida(db)
    data = _in(2027, "recorte_ilegal", [(p.id, 100)])
    with pytest.raises(HTTPException) as exc:
        _validar_items(db, data)
    assert exc.value.status_code == 400


def test_partida_inexistente_falla(db):
    data = _in(2027, "ampliacion", [(99999, 100)])
    with pytest.raises(HTTPException) as exc:
        _validar_items(db, data)
    assert exc.value.status_code == 400


def test_partida_de_otro_anio_falla(db):
    p = _partida(db, anio=2026)
    data = _in(2027, "ampliacion", [(p.id, 100)])
    with pytest.raises(HTTPException) as exc:
        _validar_items(db, data)
    assert exc.value.status_code == 400
