"""Tests del motor cross-fórmula: #SUMA_ACUMU, #SUMA_FORMU y auto-referencia @K_ACANCELAR.

Verifica que el liquidador evalúa todas las fórmulas de la cuenta en un contexto compartido
y que las funciones de referencia cruzada resuelven valores ya calculados (ej. tasa 18 -> tasa 1).
"""
import os
import sys
from decimal import Decimal

EMISIONES_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
_SERVICES = os.path.join(EMISIONES_DIR, "services")
if _SERVICES not in sys.path:
    sys.path.insert(0, _SERVICES)

from calculo.interprete import Contexto  # noqa: E402
from calculo.liquidador import Liquidador  # noqa: E402


def _formula(tasa, sub, fort, orden, **kw):
    base = {
        "ttas_Tasa": tasa, "ttas_SubTasa": sub, "fort_Numero": fort, "fort_orden": orden,
        "fort_Condicion": "", "acumuladores": [],
        "fort_aCancelar1": "", "fort_aPagar1": "",
    }
    base.update(kw)
    return base


def _por_clave(res):
    return {(r.tasa, r.subtasa, r.formula): r for r in res}


def test_suma_acumu_y_suma_formu_cross_tasa():
    # Fórmula A (tasa 1): acumulador 32 = base*2; aCancelar1 = @K_ACUMULA32
    fa = _formula(1, 0, 1, 1,
                  acumuladores=[{"ftac_Numero": 32, "ftac_Importe": "@I_BASE * 2"}],
                  fort_aCancelar1="@K_ACUMULA32")
    # Fórmula B (tasa 18): aPagar1 = SUMA_ACUMU(acum 1-0-1-32) + SUMA_FORMU(vto1 de 1-0-1)
    fb = _formula(18, 0, 1, 1,
                  fort_aPagar1='#SUMA_ACUMU("1-0-1-32") + #SUMA_FORMU(1, "1-0-1")')

    ctx = Contexto(periodo=2026, mes=6, variables={"I_BASE": Decimal("100")})
    res = _por_clave(Liquidador().liquidar([fb, fa], ctx))  # desordenadas a propósito

    a = res[(1, 0, 1)]
    b = res[(18, 0, 1)]
    # A: aCancelar1 = base*2 = 200
    assert a.cuotas[0].a_cancelar == Decimal("200.00")
    # acumulador quedó en el store global
    assert ctx.acumuladores_calculados["1-0-1-32"] == Decimal("200")
    # B: SUMA_ACUMU(200) + SUMA_FORMU(aCancelar1 de A = 200) = 400
    assert b.cuotas[0].a_pagar == Decimal("400.00")


def test_autoreferencia_k_acancelar():
    # aPagar1 referencia el aCancelar1 recién calculado (@K_ACANCELAR1)
    f = _formula(2, 0, 1, 1, fort_aCancelar1="100", fort_aPagar1="@K_ACANCELAR1 * 0.5")
    ctx = Contexto(periodo=2026, mes=6)
    res = Liquidador().liquidar([f], ctx)[0]
    assert res.cuotas[0].a_cancelar == Decimal("100.00")
    assert res.cuotas[0].a_pagar == Decimal("50.00")


def test_suma_acumu_inexistente_da_cero():
    # Si la clave no fue calculada, #SUMA_ACUMU devuelve 0 (no rompe)
    f = _formula(5, 0, 1, 1, fort_aCancelar1='#SUMA_ACUMU("9-9-9-9")')
    ctx = Contexto(periodo=2026, mes=6)
    res = Liquidador().liquidar([f], ctx)[0]
    assert res.cuotas[0].a_cancelar == Decimal("0.00")
