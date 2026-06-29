"""Tests del liquidador (`services.calculo.liquidador`).

Orquesta acumuladores + condición + 4 vencimientos aCancelar/aPagar sobre un Contexto con
base imponible. Usa fórmulas sintéticas pero con la misma estructura que las reales (ABL).
"""
import os
import sys
from decimal import Decimal

# importamos el paquete `calculo` (puro) sin disparar services/__init__.py (FastAPI)
EMISIONES_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
_SERVICES = os.path.join(EMISIONES_DIR, "services")
if _SERVICES not in sys.path:
    sys.path.insert(0, _SERVICES)

from calculo.interprete import Contexto  # noqa: E402
from calculo.liquidador import Liquidador  # noqa: E402


def D(x):
    return Decimal(str(x))


def _ctx():
    """Cuenta de inmueble: valuación total 350.000, zona tarifaria '1', cuota no anual."""
    return Contexto(
        periodo=2026, mes=6,
        variables={"I_ZONATARI": "1", "I_CUOTA_ANUAL": "N"},
        valuaciones=[
            {"tval_Codigo": 1, "valu_Valor": D(100000)},
            {"tval_Codigo": 2, "valu_Valor": D(250000)},
        ],
    )


# fórmula ABL sintética: acum01 = coef de zona, acum05 = valuación total
def _formulas():
    return [
        {
            "ttas_Tasa": 1, "ttas_SubTasa": 0, "fort_Numero": 1, "fort_orden": 1,
            "fort_Condicion": '@I_CUOTA_ANUAL="N"',
            "acumuladores": [
                {"ftac_Numero": 1, "ftac_Importe": '#SI(@I_ZONATARI="1", 2, 1)'},
                {"ftac_Numero": 5, "ftac_Importe": "#I_VALUACION(0)"},
            ],
            # base = valuación * alícuota(0.012) * coef_zona
            "fort_aCancelar1": "#REDONDEO(@K_ACUMULA05 * 0.012 * @K_ACUMULA01, 2)",
            "fort_aPagar1": "#REDONDEO(@K_ACUMULA05 * 0.012 * @K_ACUMULA01 * 0.90, 2)",  # 10% desc 1er vto
            "fort_aCancelar2": "#REDONDEO(@K_ACUMULA05 * 0.012 * @K_ACUMULA01, 2)",
            "fort_aPagar2": "#REDONDEO(@K_ACUMULA05 * 0.012 * @K_ACUMULA01, 2)",          # sin desc 2do vto
        },
        {   # esta fórmula NO aplica (cuota anual): debe quedar sin cuotas
            "ttas_Tasa": 1, "ttas_SubTasa": 0, "fort_Numero": 2, "fort_orden": 2,
            "fort_Condicion": '@I_CUOTA_ANUAL="S"',
            "fort_aCancelar1": "999999",
            "fort_aPagar1": "999999",
        },
    ]


def test_liquida_cuatro_vencimientos_y_descuento():
    res = Liquidador().liquidar(_formulas(), _ctx())
    f1 = res[0]
    assert f1.aplica is True
    assert len(f1.cuotas) == 2  # solo vto 1 y 2 tienen fórmula
    v1, v2 = f1.cuotas
    # base = 350000 * 0.012 * 2 = 8400
    assert v1.a_cancelar == D("8400.00")
    assert v1.a_pagar == D("7560.00")   # 8400 * 0.90
    assert v2.a_cancelar == D("8400.00")
    assert v2.a_pagar == D("8400.00")


def test_condicion_falsa_no_genera_cuotas():
    res = Liquidador().liquidar(_formulas(), _ctx())
    f2 = res[1]
    assert f2.aplica is False
    assert f2.cuotas == []


def test_total_a_pagar():
    res = Liquidador().liquidar(_formulas(), _ctx())
    assert res[0].total_a_pagar == D("15960.00")   # 7560 + 8400


def test_acumuladores_se_resetean_entre_formulas():
    # fórmula A setea acum01=5 y lo usa; fórmula B no define acum01 -> debe ser 0
    ctx = Contexto(variables={})
    formulas = [
        {"ttas_Tasa": 9, "ttas_SubTasa": 0, "fort_Numero": 1, "fort_orden": 1,
         "acumuladores": [{"ftac_Numero": 1, "ftac_Importe": "5"}],
         "fort_aCancelar1": "@K_ACUMULA01 * 10"},   # 5*10 = 50
        {"ttas_Tasa": 9, "ttas_SubTasa": 0, "fort_Numero": 2, "fort_orden": 2,
         "fort_aCancelar1": "@K_ACUMULA01 + 1"},     # acum01 reseteado a 0 -> 1
    ]
    res = Liquidador().liquidar(formulas, ctx)
    assert res[0].cuotas[0].a_cancelar == D("50.00")
    assert res[1].cuotas[0].a_cancelar == D("1.00")


def test_respeta_orden_fort_orden():
    ctx = Contexto(variables={})
    formulas = [
        {"ttas_Tasa": 1, "fort_Numero": 2, "fort_orden": 20, "fort_aCancelar1": "2"},
        {"ttas_Tasa": 1, "fort_Numero": 1, "fort_orden": 10, "fort_aCancelar1": "1"},
    ]
    res = Liquidador().liquidar(formulas, ctx)
    assert [r.formula for r in res] == [1, 2]   # ordenado por fort_orden
