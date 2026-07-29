"""Tests del cálculo de retenciones (routers/retenciones.py::aplicar_retenciones).

Regla: importe_retenido = base * (alícuota / 100), redondeado a 2 decimales (HALF_UP).
Si el tipo tiene mínimo no imponible y base < mínimo ⇒ no retiene (importe = 0).
Solo se retiene sobre gastos devengados o pagados.

Se prueban las funciones pasando `db` a mano (sin FastAPI/HTTP/auth). No hay httpx en
esta ruta, así que se ejercita la lógica pura de cálculo/persistencia.
"""
from decimal import Decimal

import pytest
from fastapi import HTTPException

from conftest import retenciones as R
from models.gasto import GastoExpediente
from models.retencion import TipoRetencion, RetencionAplicada


SUPER = {"superuser": True, "nombre_apellido": "Tester", "permisos": []}


# ── helpers de siembra ───────────────────────────────────────────────────
def _gasto(db, importe="10000.00", estado="devengado", numero=1):
    g = GastoExpediente(
        anio=2026, numero=numero, descripcion="Servicios", proveedor="ACME SA",
        id_partida=5, importe=Decimal(importe), estado=estado,
        factura_numero="FC-A-0001-000123", historial=[], activo=True,
    )
    db.add(g); db.commit(); db.refresh(g)
    return g


def _tipo(db, codigo="RG830", alicuota="3", base="neto", minimo=None, regimen="ganancias"):
    t = TipoRetencion(
        codigo=codigo, nombre=f"Retención {codigo}", regimen=regimen,
        alicuota=Decimal(str(alicuota)), base=base,
        minimo_no_imponible=Decimal(str(minimo)) if minimo is not None else None,
        activo=True,
    )
    db.add(t); db.commit(); db.refresh(t)
    return t


def _data(tipos, base=None, periodo=None, simular=False, comprobante=None, cuit=None):
    """Construye el RetencionesGastoIn. `tipos` = lista de (id_tipo, base_explicita|None)."""
    items = [R.RetencionCalcItem(id_tipo_retencion=tid, base_calculo=b) for tid, b in tipos]
    return R.RetencionesGastoIn(
        retenciones=items, periodo=periodo, simular=simular,
        comprobante=comprobante, cuit_beneficiario=cuit,
    )


def _aplicar(db, g, data):
    return R.aplicar_retenciones(g.id, data, db, SUPER)


# ═══ cálculo base * alícuota ══════════════════════════════════════════════
def test_calculo_simple_base_por_alicuota(db):
    g = _gasto(db, "10000.00")
    t = _tipo(db, "IIBB", alicuota="3", regimen="iibb")   # 3% de 10.000 = 300
    out = _aplicar(db, g, _data([(t.id, None)]))
    assert out["total_retenido"] == 300.0
    r = out["retenciones"][0]
    assert r["base_calculo"] == 10000.0
    assert r["alicuota"] == 3.0
    assert r["importe"] == 300.0


def test_usa_importe_del_gasto_como_base_por_defecto(db):
    g = _gasto(db, "2500.00")
    t = _tipo(db, "T2", alicuota="10")     # 10% de 2500 = 250
    out = _aplicar(db, g, _data([(t.id, None)]))
    assert out["retenciones"][0]["base_calculo"] == 2500.0
    assert out["retenciones"][0]["importe"] == 250.0


def test_base_explicita_override(db):
    g = _gasto(db, "10000.00")
    t = _tipo(db, "T3", alicuota="5")      # 5% sobre base explícita 4000 = 200 (no sobre 10.000)
    out = _aplicar(db, g, _data([(t.id, Decimal("4000"))]))
    assert out["retenciones"][0]["base_calculo"] == 4000.0
    assert out["retenciones"][0]["importe"] == 200.0


def test_redondeo_half_up_dos_decimales(db):
    g = _gasto(db, "1000.00")
    t = _tipo(db, "T4", alicuota="3.333")  # 33.33 exacto? 1000*3.333/100 = 33.33
    out = _aplicar(db, g, _data([(t.id, None)]))
    assert out["retenciones"][0]["importe"] == 33.33

    # caso con redondeo hacia arriba: 1000 * 1.2555% = 12.555 -> 12.56 (HALF_UP)
    g2 = _gasto(db, "1000.00", numero=2)
    t2 = _tipo(db, "T4B", alicuota="1.2555")  # 12.555 -> 12.56 (HALF_UP)
    out2 = _aplicar(db, g2, _data([(t2.id, None)]))
    assert out2["retenciones"][0]["importe"] == 12.56


# ═══ mínimo no imponible ══════════════════════════════════════════════════
def test_minimo_no_imponible_base_debajo_no_retiene(db):
    g = _gasto(db, "5000.00")
    t = _tipo(db, "GAN", alicuota="2", minimo="8000")   # base 5000 < 8000 -> 0
    out = _aplicar(db, g, _data([(t.id, None)]))
    assert out["retenciones"][0]["importe"] == 0.0
    assert out["total_retenido"] == 0.0


def test_minimo_no_imponible_base_igual_retiene(db):
    g = _gasto(db, "8000.00")
    t = _tipo(db, "GAN2", alicuota="2", minimo="8000")  # base == mínimo -> sí retiene: 160
    out = _aplicar(db, g, _data([(t.id, None)]))
    assert out["retenciones"][0]["importe"] == 160.0


def test_minimo_no_imponible_base_encima_retiene(db):
    g = _gasto(db, "12000.00")
    t = _tipo(db, "GAN3", alicuota="2", minimo="8000")  # 12000 > 8000 -> 240
    out = _aplicar(db, g, _data([(t.id, None)]))
    assert out["retenciones"][0]["importe"] == 240.0


def test_sin_minimo_siempre_retiene(db):
    g = _gasto(db, "100.00")
    t = _tipo(db, "T5", alicuota="1", minimo=None)      # sin mínimo: 1
    out = _aplicar(db, g, _data([(t.id, None)]))
    assert out["retenciones"][0]["importe"] == 1.0


# ═══ múltiples retenciones y total ════════════════════════════════════════
def test_varias_retenciones_suman_total(db):
    g = _gasto(db, "10000.00")
    t1 = _tipo(db, "A", alicuota="3", regimen="iibb")       # 300
    t2 = _tipo(db, "B", alicuota="2", regimen="ganancias")  # 200
    out = _aplicar(db, g, _data([(t1.id, None), (t2.id, None)]))
    assert out["total_retenido"] == 500.0
    assert len(out["retenciones"]) == 2


# ═══ persistencia vs simulación ═══════════════════════════════════════════
def test_persiste_en_db(db):
    g = _gasto(db, "10000.00")
    t = _tipo(db, "P1", alicuota="3")
    _aplicar(db, g, _data([(t.id, None)]))
    filas = db.query(RetencionAplicada).filter(RetencionAplicada.id_gasto == g.id).all()
    assert len(filas) == 1
    assert filas[0].importe == Decimal("300.00")
    assert filas[0].tipo_codigo == "P1"
    assert filas[0].beneficiario == "ACME SA"


def test_simular_no_persiste(db):
    g = _gasto(db, "10000.00")
    t = _tipo(db, "S1", alicuota="3")
    out = _aplicar(db, g, _data([(t.id, None)], simular=True))
    assert out["simulado"] is True
    assert out["total_retenido"] == 300.0
    # nada quedó en la base
    assert db.query(RetencionAplicada).filter(RetencionAplicada.id_gasto == g.id).count() == 0


def test_periodo_por_defecto_es_aaaamm(db):
    g = _gasto(db, "1000.00")
    t = _tipo(db, "PER", alicuota="1")
    out = _aplicar(db, g, _data([(t.id, None)]))
    assert len(out["periodo"]) == 6 and out["periodo"].isdigit()


def test_periodo_explicito_se_respeta(db):
    g = _gasto(db, "1000.00")
    t = _tipo(db, "PER2", alicuota="1")
    out = _aplicar(db, g, _data([(t.id, None)], periodo="202606"))
    assert out["periodo"] == "202606"


# ═══ validaciones ═════════════════════════════════════════════════════════
def test_solo_devengado_o_pagado(db):
    g = _gasto(db, "1000.00", estado="preventivado")
    t = _tipo(db, "V1", alicuota="1")
    with pytest.raises(HTTPException) as exc:
        _aplicar(db, g, _data([(t.id, None)]))
    assert exc.value.status_code == 409


def test_gasto_pagado_permite_retener(db):
    g = _gasto(db, "1000.00", estado="pagado")
    t = _tipo(db, "V2", alicuota="1")
    out = _aplicar(db, g, _data([(t.id, None)]))
    assert out["total_retenido"] == 10.0


def test_lista_retenciones_vacia_400(db):
    g = _gasto(db, "1000.00")
    data = R.RetencionesGastoIn(retenciones=[])
    with pytest.raises(HTTPException) as exc:
        _aplicar(db, g, data)
    assert exc.value.status_code == 400


def test_tipo_inexistente_404(db):
    g = _gasto(db, "1000.00")
    with pytest.raises(HTTPException) as exc:
        _aplicar(db, g, _data([(99999, None)]))
    assert exc.value.status_code == 404


def test_base_no_positiva_400(db):
    g = _gasto(db, "1000.00")
    t = _tipo(db, "V3", alicuota="1")
    with pytest.raises(HTTPException) as exc:
        _aplicar(db, g, _data([(t.id, Decimal("0"))]))
    assert exc.value.status_code == 400


def test_gasto_inexistente_404(db):
    t = _tipo(db, "V4", alicuota="1")
    with pytest.raises(HTTPException) as exc:
        R.aplicar_retenciones(999999, _data([(t.id, None)]), db, SUPER)
    assert exc.value.status_code == 404
