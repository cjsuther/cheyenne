"""Tests del motor de planes de pago (`services.plan_calculo`) — sistema francés."""
import importlib.util
import os
import sys
from decimal import Decimal

import pytest

IP_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
_spec = importlib.util.spec_from_file_location(
    "plan_calculo", os.path.join(IP_DIR, "services", "plan_calculo.py"))
_pc = importlib.util.module_from_spec(_spec)
sys.modules["plan_calculo"] = _pc
_spec.loader.exec_module(_pc)

calcular_plan = _pc.calcular_plan
aplicar_descuentos_moratoria = _pc.aplicar_descuentos_moratoria
calcular_anticipo = _pc.calcular_anticipo


def D(x):
    return Decimal(str(x))


# ------------------------------------------------------------------ sistema francés
def test_amortizacion_francesa_3_cuotas_5pct():
    r = calcular_plan(monto_total=D(1000), cantidad_cuotas=3, tasa_interes_pct=D(5))
    assert r.monto_financiado == D("1000.00")
    assert len(r.cuotas) == 3

    c1, c2, c3 = r.cuotas
    assert (c1.interes, c1.capital, c1.importe, c1.saldo) == (D("50.00"), D("317.21"), D("367.21"), D("682.79"))
    assert (c2.interes, c2.capital, c2.saldo) == (D("34.14"), D("333.07"), D("349.72"))
    # la última cuota absorbe el residuo: capital = saldo previo, saldo final = 0
    assert (c3.interes, c3.capital, c3.saldo) == (D("17.49"), D("349.72"), D("0.00"))

    assert sum(c.capital for c in r.cuotas) == D("1000.00")   # capital amortiza todo
    assert r.total_intereses == D("101.63")
    assert r.total_a_pagar == D("1101.63")


def test_sin_interes_cuota_es_monto_sobre_n():
    r = calcular_plan(monto_total=D(1200), cantidad_cuotas=3, tasa_interes_pct=D(0))
    assert [c.importe for c in r.cuotas] == [D("400.00"), D("400.00"), D("400.00")]
    assert r.total_intereses == D("0.00")
    assert r.cuotas[-1].saldo == D("0.00")


def test_sin_interes_residuo_en_ultima_cuota():
    # 1000 / 3 = 333.33 ; la última absorbe el centavo restante
    r = calcular_plan(monto_total=D(1000), cantidad_cuotas=3, tasa_interes_pct=D(0))
    assert r.cuotas[0].importe == D("333.33")
    assert r.cuotas[2].capital == D("333.34")
    assert sum(c.capital for c in r.cuotas) == D("1000.00")


# ---------------------------------------------------------------------- anticipo
def test_plan_con_anticipo():
    r = calcular_plan(monto_total=D(1100), cantidad_cuotas=3, tasa_interes_pct=D(5), anticipo=D(100))
    assert r.anticipo == D("100")
    assert r.monto_financiado == D("1000.00")
    assert r.cuotas[0].importe == D("367.21")
    assert r.total_a_pagar == D("1201.63")   # 100 + 1101.63


def test_anticipo_no_supera_monto():
    with pytest.raises(ValueError):
        calcular_plan(monto_total=D(100), cantidad_cuotas=3, anticipo=D(200))


def test_calcular_anticipo():
    assert calcular_anticipo(D(1000), 9, porcentaje=D(10)) == D("100.00")
    assert calcular_anticipo(D(1000), 9) == D("100.00")               # default monto/(n+1)
    assert calcular_anticipo(D(1000), 3, porcentaje=D(5), importe_minimo=D(100)) == D("100.00")  # piso


# --------------------------------------------------------- descuentos de moratoria
def test_descuentos_por_componente():
    # original 1000 (-10%) + actualización 200 (-20%) + recargo 300 (-50%)
    neto = aplicar_descuentos_moratoria(D(1000), D(200), D(300),
                                        desc_original_pct=D(10), desc_actualizacion_pct=D(20),
                                        desc_recargo_pct=D(50))
    assert neto == D("1210.00")   # 900 + 160 + 150


def test_moratoria_completa_descuentos_mas_plan():
    neto = aplicar_descuentos_moratoria(D(1000), D(0), D(0), desc_original_pct=D(0))
    r = calcular_plan(monto_total=neto, cantidad_cuotas=3, tasa_interes_pct=D(5))
    assert r.total_a_pagar == D("1101.63")
