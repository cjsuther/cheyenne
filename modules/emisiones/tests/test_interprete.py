"""Tests del intérprete de fórmulas (`services.calculo.interprete`).

Incluye un smoke test que parsea las 985 fórmulas de acumuladores REALES extraídas del
legacy (`legacy/ScriptsSQL/Tasas/FormulaTasaAcumuladores 1.csv`).
"""
import importlib.util
import os
import sys
from decimal import Decimal

import pytest

# Cargamos el intérprete DIRECTO por path: es Python puro (stdlib) y así evitamos
# disparar services/__init__.py, que importa FastAPI (no necesario para estos tests).
EMISIONES_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
_INTERP_PATH = os.path.join(EMISIONES_DIR, "services", "calculo", "interprete.py")
_spec = importlib.util.spec_from_file_location("interprete_calc", _INTERP_PATH)
_interp = importlib.util.module_from_spec(_spec)
sys.modules[_spec.name] = _interp   # necesario para que @dataclass resuelva anotaciones
_spec.loader.exec_module(_interp)

Contexto = _interp.Contexto
ErrorFormula = _interp.ErrorFormula
evaluar = _interp.evaluar
evaluar_logica = _interp.evaluar_logica
parsear = _interp.parsear


def D(x):
    return Decimal(str(x))


# --------------------------------------------------------------------- aritmética básica
def test_suma_y_resta():
    assert evaluar("2 + 3") == D(5)
    assert evaluar("10 - 4 - 1") == D(5)


def test_precedencia_mul_sobre_suma():
    assert evaluar("2 + 3 * 4") == D(14)
    assert evaluar("(2 + 3) * 4") == D(20)


def test_division_y_unario():
    assert evaluar("10 / 4") == D("2.5")
    assert evaluar("-5 + 2") == D(-3)
    assert evaluar("-(3 * 2)") == D(-6)


def test_division_por_cero():
    with pytest.raises(ErrorFormula):
        evaluar("5 / 0")


def test_redondeo_a_8_decimales():
    # 1/3 redondeado a 8 decimales (half-even)
    assert evaluar("1 / 3") == D("0.33333333")


# --------------------------------------------------------------------------- variables
def test_variable_numerica():
    ctx = Contexto(variables={"K_BASE": D(1000)})
    assert evaluar("@K_BASE * 0.05", ctx) == D(50)


def test_variable_inexistente():
    with pytest.raises(ErrorFormula):
        evaluar("@NO_EXISTE + 1", Contexto())


def test_case_insensitive_y_espacios():
    ctx = Contexto(variables={"K_X": D(2)})
    assert evaluar("  @k_x  *  3 ", ctx) == D(6)


# ----------------------------------------------------------------------------- lógica
def test_comparadores():
    assert evaluar_logica("3 >= 3") is True
    assert evaluar_logica("3 > 3") is False
    assert evaluar_logica("2 <> 3") is True
    assert evaluar_logica("2 = 2") is True


def test_operadores_logicos_descriptivos():
    assert evaluar_logica("(1 > 0) .Y. (2 > 1)") is True
    assert evaluar_logica("(1 > 5) .O. (2 > 1)") is True
    assert evaluar_logica(".NO. (1 > 5)") is True


def test_condicion_vacia_es_true():
    assert evaluar_logica("") is True
    assert evaluar_logica(None) is True


def test_comparacion_de_strings():
    ctx = Contexto(variables={"I_ZONA": "2"})
    assert evaluar_logica('@I_ZONA = "2"', ctx) is True
    assert evaluar_logica('@I_ZONA = "3"', ctx) is False


# --------------------------------------------------------------------------- funciones #
def test_si_numerico():
    assert evaluar("#SI(1 > 0, 5, 9)") == D(5)
    assert evaluar("#SI(1 > 5, 5, 9)") == D(9)


def test_si_anidado():
    ctx = Contexto(variables={"I_ZONATARI": "2"})
    # ZON-W simplificado: mapea zona -> coeficiente
    f = '#SI(@I_ZONATARI="0", 1, #SI(@I_ZONATARI="1", 2, #SI(@I_ZONATARI="2", 3, 4)))'
    assert evaluar(f, ctx) == D(3)


def test_redondeo():
    assert evaluar("#REDONDEO(3.14159, 2)") == D("3.14")
    assert evaluar("#REDONDEO(3.14159, -1)") == D("3.14159")  # d<0 => sin redondear
    # half-even (bancario): 2.5 -> 2 ; 3.5 -> 4
    assert evaluar("#REDONDEO(2.5, 0)") == D(2)
    assert evaluar("#REDONDEO(3.5, 0)") == D(4)


def test_entero_trunca_hacia_menos_infinito():
    assert evaluar("#ENTERO(3.9)") == D(3)
    assert evaluar("#ENTERO(-1.2)") == D(-2)


def test_listas():
    assert evaluar_logica('#CAD_EN_LISTA("AB", "XXABYY")') is True
    assert evaluar_logica('#NRO_EN_LISTA(3, "1/2/3/4")') is True
    assert evaluar_logica('#NRO_EN_LISTA(9, "1/2/3/4")') is False


def test_fecha_y_componentes():
    assert evaluar("#FECHA(15, 3, 2006)") == D(20060315)
    assert evaluar("#FECHA(31, 2, 2020)") == D(20200229)  # recorta al último día
    assert evaluar("#ANIO(20060315)") == D(2006)
    assert evaluar("#MES(20060315)") == D(3)
    assert evaluar("#DIA(20060315)") == D(15)


def test_entrefechas_ejemplo_documentado():
    # 01/01/2006 -> 16/04/2007 = 1 año, 3 meses, 16 dias = 1.0316
    assert evaluar("#ENTREFECHAS(20060101, 20070416)") == D("1.0316")
    assert evaluar("#ENTREFECHAS(20060101, 20060101)") == D(0)


def test_entrefechas_rango_invalido():
    with pytest.raises(ErrorFormula):
        evaluar("#ENTREFECHAS(20070101, 20060101)")


def test_suma_dias():
    assert evaluar("#SUMA_DIAS(20060228, 1)") == D(20060301)


def test_hoy():
    ctx = Contexto(fecha_servidor=20260629)
    assert evaluar("#HOY()", ctx) == D(20260629)


def test_i_valuacion():
    ctx = Contexto(valuaciones=[
        {"tval_Codigo": 1, "valu_Valor": D(1000)},
        {"tval_Codigo": 2, "valu_Valor": D(500)},
    ])
    assert evaluar("#I_VALUACION(1)", ctx) == D(1000)
    assert evaluar("#I_VALUACION(0)", ctx) == D(1500)  # 0 = todas


# ---------------------------------------------------- caso compuesto tipo aPagar real
def test_recargo_mismo_mes_no_aplica():
    # Quirk del legacy: #ENTREFECHAS devuelve 0 si ambas fechas caen en el MISMO mes,
    # por eso una deuda vencida dentro del mes en curso no genera recargo.
    ctx = Contexto(variables={"K_BASE": D(1000), "VTO": D(20240101), "HOY": D(20240131)})
    f = '#REDONDEO(@K_BASE * (1 + #ENTREFECHAS(@VTO, @HOY) * 0.05), 2)'
    assert evaluar(f, ctx) == D("1000.00")


def test_recargo_cruzando_mes_si_aplica():
    # de 01/12/2023 a 31/01/2024 -> 0 años, 1 mes, 31 días = 0.0131
    assert evaluar("#ENTREFECHAS(20231201, 20240131)") == D("0.0131")
    ctx = Contexto(variables={"K_BASE": D(1000), "VTO": D(20231201), "HOY": D(20240131)})
    f = '#REDONDEO(@K_BASE * (1 + #ENTREFECHAS(@VTO, @HOY) * 0.05), 2)'
    assert evaluar(f, ctx) > D(1000)   # hay recargo


# ----------------------------------------------------------- SMOKE TEST: 985 reales
def _cargar_acumuladores_reales():
    root = os.path.abspath(os.path.join(EMISIONES_DIR, "..", ".."))
    path = os.path.join(root, "legacy", "ScriptsSQL", "Tasas", "FormulaTasaAcumuladores 1.csv")
    if not os.path.exists(path):
        return None
    raw = open(path, encoding="latin-1").read().replace("\r", "")
    lines = raw.split("\n")
    ncols = lines[0].count("|") + 1
    formulas, buf = [], ""
    for ln in lines[2:]:
        buf = ln if buf == "" else buf + "\n" + ln
        if buf.count("|") >= ncols - 1:
            if "rows affected" not in buf:
                campos = buf.split("|")
                if len(campos) >= 6:
                    formulas.append(campos[5].strip())  # ftac_Importe = la fórmula
            buf = ""
    return formulas


def _es_completa(f: str) -> bool:
    """Heurística: una fórmula está completa si tiene paréntesis y comillas balanceados.
    Las truncadas por el export de SSMS (límite de ~256 chars por columna) no lo están."""
    return bool(f) and f.count("(") == f.count(")") and f.count('"') % 2 == 0


def test_smoke_parseo_acumuladores_reales():
    """El parser debe entender TODA fórmula real completa. Las truncadas por el export
    (límite de 256 chars de SSMS 'Results to Text') se reportan como dato de calidad,
    no como fallo del parser."""
    formulas = _cargar_acumuladores_reales()
    if formulas is None:
        pytest.skip("CSV de acumuladores reales no disponible")
    formulas = [f for f in formulas if f]
    completas = [f for f in formulas if _es_completa(f)]
    truncadas = [f for f in formulas if not _es_completa(f)]

    ok, bugs = 0, []
    for f in completas:
        try:
            parsear(f)
            ok += 1
        except Exception as e:  # noqa: BLE001
            bugs.append((f, str(e)))

    print(f"\n[smoke] acumuladores reales: {len(formulas)} | completas: {len(completas)} "
          f"| truncadas por export: {len(truncadas)}")
    print(f"[smoke] completas que parsean: {ok}/{len(completas)} | bugs de parser: {len(bugs)}")
    for f, e in bugs[:10]:
        print(f"  BUG: {e[:50]} | {f[:80]!r}")

    assert len(completas) > 400, f"se esperaban >400 fórmulas completas, hubo {len(completas)}"
    assert len(bugs) == 0, f"el parser falló en {len(bugs)} fórmulas COMPLETAS (bugs reales)"
