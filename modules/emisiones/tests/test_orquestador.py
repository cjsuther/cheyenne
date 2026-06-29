"""Tests del orquestador (`services.calculo.orquestador`) — base imponible + fórmulas -> líneas."""
import os
import sys
from decimal import Decimal

EMISIONES_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
_SERVICES = os.path.join(EMISIONES_DIR, "services")
if _SERVICES not in sys.path:
    sys.path.insert(0, _SERVICES)

from calculo.orquestador import contexto_desde_datos, liquidar_padron  # noqa: E402
from calculo.interprete import evaluar  # noqa: E402


def D(x):
    return Decimal(str(x))


FORMULA_ABL = {
    "ttas_Tasa": 1, "ttas_SubTasa": 0, "fort_Numero": 1, "fort_orden": 1,
    "fort_Condicion": '@I_CUOTA_ANUAL="N"',
    "acumuladores": [
        {"ftac_Numero": 1, "ftac_Importe": '#SI(@I_ZONATARI="1", 2, 1)'},
        {"ftac_Numero": 5, "ftac_Importe": "#I_VALUACION(0)"},
    ],
    "fort_aCancelar1": "#REDONDEO(@K_ACUMULA05 * 0.012 * @K_ACUMULA01, 2)",
    "fort_aPagar1": "#REDONDEO(@K_ACUMULA05 * 0.012 * @K_ACUMULA01 * 0.90, 2)",
}


def _datos(valor_tierra, valor_edif, zona="1"):
    return {
        "variables": {"I_ZONATARI": zona, "I_CUOTA_ANUAL": "N"},
        "valuaciones": [
            {"tval_Codigo": 1, "valu_Valor": valor_tierra},
            {"tval_Codigo": 2, "valu_Valor": valor_edif},
        ],
    }


def test_contexto_tipa_variables_y_numeros():
    ctx = contexto_desde_datos(_datos(100000, 250000), 2026, 6)
    # número JSON -> Decimal ; código de zona string -> str
    assert ctx.variables["I_ZONATARI"] == "1"
    assert evaluar("#I_VALUACION(0)", ctx) == D(350000)


def test_liquida_un_contribuyente():
    entrada = [{"id_contribuyente": 1, "id_objeto_imponible": 10, "datos": _datos(100000, 250000)}]
    out = liquidar_padron([FORMULA_ABL], entrada, 2026, 6)
    assert len(out) == 1
    r = out[0]
    assert r["id_contribuyente"] == 1
    assert len(r["lineas"]) == 1
    linea = r["lineas"][0]
    # base = 350000 * 0.012 * 2 = 8400 ; aPagar 1er vto = 7560
    assert linea["a_cancelar"] == D("8400.00")
    assert linea["a_pagar"] == D("7560.00")
    assert r["monto_a_pagar"] == D("7560.00")


def test_liquida_varios_contribuyentes_distintos_montos():
    entrada = [
        {"id_contribuyente": 1, "id_objeto_imponible": 10, "datos": _datos(100000, 250000)},  # 350k
        {"id_contribuyente": 2, "id_objeto_imponible": 20, "datos": _datos(100000, 100000)},  # 200k
    ]
    out = liquidar_padron([FORMULA_ABL], entrada, 2026, 6)
    assert out[0]["lineas"][0]["a_cancelar"] == D("8400.00")   # 350k*0.012*2
    assert out[1]["lineas"][0]["a_cancelar"] == D("4800.00")   # 200k*0.012*2


def test_padron_vacio_devuelve_lista_vacia():
    assert liquidar_padron([FORMULA_ABL], [], 2026, 6) == []
