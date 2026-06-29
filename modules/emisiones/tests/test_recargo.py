"""Tests del motor de recargos (`services.calculo.recargo`), con la curva y coeficientes
REALES de Lanús (anexo). Casos calculados a mano contra la semántica del legacy."""
import importlib.util
import os
import sys
from datetime import date
from decimal import Decimal

# carga directa por path (módulo puro, evita services/__init__.py -> FastAPI)
EMISIONES_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
_path = os.path.join(EMISIONES_DIR, "services", "calculo", "recargo.py")
_spec = importlib.util.spec_from_file_location("recargo_calc", _path)
_rec = importlib.util.module_from_spec(_spec)
sys.modules[_spec.name] = _rec
_spec.loader.exec_module(_rec)

MotorRecargo = _rec.MotorRecargo
Coeficientes = _rec.Coeficientes


def D(x):
    return Decimal(str(x))


def motor():
    return MotorRecargo()  # usa CURVA_LANUS + Coeficientes() reales


# --------------------------------------------------------- recargo / interés resarcitorio
def test_interes_resarcitorio_un_tramo_diario():
    # vto 2012-06-01, calc 2012-07-01 -> 30 días al 0,067/día = 2,01% ; importe 1000 -> 20,10
    # vto > 30/11/2000 => va a INTERÉS RESARCITORIO (no recargo)
    r = motor().calcular(importe=D(1000), fecha_vencimiento=date(2012, 6, 1),
                         fecha_calculo=date(2012, 7, 1), dtri=1, coef_ordenanza=D(0))
    assert r.porcentaje_recargo == D("2.01")
    assert r.interes_resarcitorio == D("20.10")
    assert r.recargo == D("0.00")


def test_corte_2000_va_a_recargo():
    # vto 2000-06-01 (<= 30/11/2000) -> RECARGO, no interés. 92 días al 0,07 = 6,44% -> 64,40
    r = motor().calcular(importe=D(1000), fecha_vencimiento=date(2000, 6, 1),
                         fecha_calculo=date(2000, 9, 1), dtri=1, coef_ordenanza=D(0))
    assert r.porcentaje_recargo == D("6.44")
    assert r.recargo == D("64.40")
    assert r.interes_resarcitorio == D("0.00")
    assert r.interes_multa_omision == D("64.40")   # espejo del recargo (pre-2000)


# ------------------------------------------------------------------- multa por omisión
def test_multa_omision_inmuebles_1998():
    # vto <= 31/12/1998 con multa_1998 = 50% -> multa = 500
    r = motor().calcular(importe=D(1000), fecha_vencimiento=date(1998, 6, 1),
                         fecha_calculo=date(1998, 9, 1), dtri=1,
                         multa_1998=D(50), coef_ordenanza=D(0))
    assert r.multa_omision == D("500.00")


# ----------------------------------------------------------------------------- ordenanza
def test_ordenanza_default_10pct():
    # mismo caso del interés (20,10); total = 1020,10 ; ordenanza 10% = 102,01
    r = motor().calcular(importe=D(1000), fecha_vencimiento=date(2012, 6, 1),
                         fecha_calculo=date(2012, 7, 1), dtri=1)  # coef ordenanza default = 10
    assert r.interes_resarcitorio == D("20.10")
    assert r.ordenanza == D("102.01")


def test_ordenanza_exenta_comercio_mismo_mes():
    # dtri=2 con vto en el mismo mes/año que el cálculo -> ordenanza 0
    r = motor().calcular(importe=D(1000), fecha_vencimiento=date(2026, 6, 15),
                         fecha_calculo=date(2026, 6, 20), dtri=2)
    assert r.ordenanza == D("0.00")


def test_deuda_no_vencida_todo_cero():
    r = motor().calcular(importe=D(1000), fecha_vencimiento=date(2026, 12, 31),
                         fecha_calculo=date(2026, 6, 1), dtri=1)
    assert r.recargo == D("0.00")
    assert r.interes_resarcitorio == D("0.00")
    assert r.ordenanza == D("0.00")


# ---------------------------------------------------- coeficiente legal + accesorios juicio
def test_coef_legal_y_accesorios_de_juicio():
    # deuda en juicio con certificado posterior al 27/11/2006 -> usa RESLE = 0,066/día
    # vto 2010-06-01, calc 2010-07-01 -> 30 días * 0,066 = 1,98% -> interés 19,80
    r = motor().calcular(
        importe=D(1000), fecha_vencimiento=date(2010, 6, 1), fecha_calculo=date(2010, 7, 1),
        dtri=1, coef_ordenanza=D(0),
        juce_numero=5, fecha_certificado=date(2008, 1, 1),
        honorarios=D(100), hay_demanda=True,
    )
    assert r.porcentaje_recargo == D("1.98")
    assert r.interes_resarcitorio == D("19.80")
    # base = 1000 + 19,80 = 1019,80
    assert r.honorarios == D("100.00")
    assert r.gastos == D("50.99")            # 1019,80 * 5%
    assert r.aporte_abogado == D("10.00")    # 100 * 10%
    assert r.tasa_justicia == D("22.44")     # 1019,80 * 2,2%
    assert r.sobretasa_justicia == D("2.24")  # 22,44 * 10%


def test_total_accesorios():
    r = motor().calcular(importe=D(1000), fecha_vencimiento=date(2012, 6, 1),
                         fecha_calculo=date(2012, 7, 1), dtri=1)
    # interés 20,10 + ordenanza 102,01
    assert r.total_accesorios == D("122.11")


# --------------------------------------------------------- curva desde filas reales (dump)
def test_construye_curva_desde_datos_reales():
    """La curva por defecto coincide con los valores del dump RecargosTasas 99999."""
    m = motor()
    valores = {(t.fecha.year): t.valor for t in m.curva}
    assert valores[1997] == D("0.0700")
    assert valores[2012] == D("0.0670")
    assert len(m.curva) == 8
