"""Intérprete de fórmulas de tasa — port de `CCalcFormula` + `CCalcEvaluador` (VB6, Compubeccar).

Las tasas del sistema no tienen alícuotas/intereses hardcodeados: tienen **fórmulas
de texto** (campos `fort_aCancelar1..4` / `fort_aPagar1..4` y la condición `fort_Condicion`
de la tabla `FormulaTasa`) que este intérprete evalúa sustituyendo variables `@NOMBRE` y
resolviendo funciones `#FUNCION(...)`.

Semántica replicada del legacy (ver `legacy/analisis/Motor-de-Calculo-Desglose-Formulas.md`):

- Operadores aritméticos `+ - * /` con precedencia `+/-` (más floja) < `*//`. Cada operación
  se redondea a 8 decimales (igual que `CalculoMatematico = Round(..., 8)`).
- Operadores lógicos descriptivos `.NO.` (NOT), `.Y.` (AND), `.O.` (OR) y comparadores
  `>= <= <> > < =`.
- Variables `@NOMBRE` (case-insensitive; los espacios son irrelevantes).
- Fechas como entero `AAAAMMDD`. `#ENTREFECHAS` devuelve `AA.MMDD` con meses de 30 días e
  inclusivo (+1 día), tal cual el legacy.
- `#REDONDEO` usa redondeo bancario (half-to-even), igual que `Round` de VB6.

Las funciones `#I_VALUACION`, `#I_SUPERFICIE`, `#I_RECARGDESCU` y `#SUMA_FORMU` dependen de
datos de la cuenta: se resuelven contra el objeto `Contexto`.
"""

from __future__ import annotations

import math
from dataclasses import dataclass, field
from datetime import date, timedelta
from decimal import Decimal, ROUND_HALF_EVEN, InvalidOperation
from typing import Any, Dict, List, Optional

PREC = 8  # decimales de redondeo intermedio (Round(...,8) del legacy)
_Q8 = Decimal(1).scaleb(-PREC)  # 1e-8


class ErrorFormula(Exception):
    """Error de evaluación/parseo de una fórmula."""


# ----------------------------------------------------------------------------- contexto
@dataclass
class Contexto:
    """Datos de entrada para evaluar una fórmula de una cuenta/período."""

    variables: Dict[str, Any] = field(default_factory=dict)
    periodo: int = 0
    mes: int = 0
    fecha_servidor: Optional[int] = None  # AAAAMMDD para #HOY
    # filas para las funciones #I_*  (claves como en el legacy)
    valuaciones: List[Dict[str, Any]] = field(default_factory=list)
    superficies: List[Dict[str, Any]] = field(default_factory=list)
    recargos_desc: List[Dict[str, Any]] = field(default_factory=list)
    # para #SUMA_FORMU: clave "tasa-subtasa-fort" -> {1..8: valor}
    formulas_calculadas: Dict[str, Dict[int, Decimal]] = field(default_factory=dict)
    # para #SUMA_ACUMU: clave "tasa-subtasa-fort-acum" -> valor
    acumuladores_calculados: Dict[str, Decimal] = field(default_factory=dict)

    def var(self, nombre: str) -> Any:
        key = nombre.upper()
        if key not in self.variables:
            raise ErrorFormula(f"No existe la variable: '@{key}'")
        return self.variables[key]


# ----------------------------------------------------------------------------- tokenizer
_COMP = (">=", "<=", "<>", ">", "<", "=")
_LOG = {".NO.": "NOT", ".Y.": "AND", ".O.": "OR"}


@dataclass
class Tok:
    tipo: str   # NUM STR VAR FUNC OP COMP LOG LPAR RPAR COMMA
    val: Any


def tokenizar(s: str) -> List[Tok]:
    toks: List[Tok] = []
    i, n = 0, len(s)
    up = s
    while i < n:
        c = up[i]
        if c in " \t\r\n":
            i += 1
            continue
        if c == '"':                       # string
            j = up.find('"', i + 1)
            if j < 0:
                raise ErrorFormula("Comillas desbalanceadas")
            toks.append(Tok("STR", up[i + 1:j]))
            i = j + 1
            continue
        if c == "@":                       # variable
            j = i + 1
            while j < n and (up[j].isalnum() or up[j] == "_"):
                j += 1
            toks.append(Tok("VAR", up[i + 1:j].upper()))
            i = j
            continue
        if c == "#":                       # función
            j = i + 1
            while j < n and (up[j].isalnum() or up[j] == "_"):
                j += 1
            toks.append(Tok("FUNC", "#" + up[i + 1:j].upper()))
            i = j
            continue
        if c == ".":                       # operador lógico .Y. .O. .NO.  (o número .5)
            m = up[i:i + 4].upper()
            if m[:4] in _LOG:
                toks.append(Tok("LOG", _LOG[m])); i += 4; continue
            m3 = up[i:i + 3].upper()
            if m3 in _LOG:
                toks.append(Tok("LOG", _LOG[m3])); i += 3; continue
            # si no, podría ser un número .5
            if i + 1 < n and up[i + 1].isdigit():
                j = i + 1
                while j < n and (up[j].isdigit() or up[j] == "."):
                    j += 1
                toks.append(Tok("NUM", Decimal(up[i:j]))); i = j; continue
            raise ErrorFormula(f"Token inesperado en pos {i}: '{up[i:i+4]}'")
        if c.isdigit():                    # número
            j = i
            while j < n and (up[j].isdigit() or up[j] == "."):
                j += 1
            try:
                toks.append(Tok("NUM", Decimal(up[i:j])))
            except InvalidOperation:
                raise ErrorFormula(f"Número inválido: '{up[i:j]}'")
            i = j
            continue
        two = up[i:i + 2]
        if two in ("<=", ">=", "<>"):
            toks.append(Tok("COMP", two)); i += 2; continue
        if c in "<>=":
            toks.append(Tok("COMP", c)); i += 1; continue
        if c in "+-*/":
            toks.append(Tok("OP", c)); i += 1; continue
        if c == "(":
            toks.append(Tok("LPAR", c)); i += 1; continue
        if c == ")":
            toks.append(Tok("RPAR", c)); i += 1; continue
        if c == ",":
            toks.append(Tok("COMMA", c)); i += 1; continue
        raise ErrorFormula(f"Carácter inesperado: '{c}' (pos {i})")
    return toks


# ----------------------------------------------------------------------------- parser (AST)
# AST como tuplas: ('num',d) ('str',s) ('var',name) ('neg',a) ('not',a)
#   ('bin',op,a,b) ('cmp',op,a,b) ('and',a,b) ('or',a,b) ('func',name,[args])

class _P:
    def __init__(self, toks: List[Tok]):
        self.t = toks
        self.i = 0

    def peek(self) -> Optional[Tok]:
        return self.t[self.i] if self.i < len(self.t) else None

    def next(self) -> Tok:
        tok = self.t[self.i]; self.i += 1; return tok

    def expect(self, tipo: str) -> Tok:
        tok = self.peek()
        if not tok or tok.tipo != tipo:
            raise ErrorFormula(f"Se esperaba {tipo}, se encontró {tok}")
        return self.next()

    # precedencia: or < and < not < cmp < add < mul < unary < primary
    def parse(self):
        node = self.p_or()
        if self.peek() is not None:
            raise ErrorFormula(f"Tokens sobrantes: {self.peek()}")
        return node

    def p_or(self):
        a = self.p_and()
        while self.peek() and self.peek().tipo == "LOG" and self.peek().val == "OR":
            self.next(); a = ("or", a, self.p_and())
        return a

    def p_and(self):
        a = self.p_not()
        while self.peek() and self.peek().tipo == "LOG" and self.peek().val == "AND":
            self.next(); a = ("and", a, self.p_not())
        return a

    def p_not(self):
        if self.peek() and self.peek().tipo == "LOG" and self.peek().val == "NOT":
            self.next(); return ("not", self.p_not())
        return self.p_cmp()

    def p_cmp(self):
        a = self.p_add()
        if self.peek() and self.peek().tipo == "COMP":
            op = self.next().val; b = self.p_add(); return ("cmp", op, a, b)
        return a

    def p_add(self):
        a = self.p_mul()
        while self.peek() and self.peek().tipo == "OP" and self.peek().val in "+-":
            op = self.next().val; a = ("bin", op, a, self.p_mul())
        return a

    def p_mul(self):
        a = self.p_unary()
        while self.peek() and self.peek().tipo == "OP" and self.peek().val in "*/":
            op = self.next().val; a = ("bin", op, a, self.p_unary())
        return a

    def p_unary(self):
        if self.peek() and self.peek().tipo == "OP" and self.peek().val == "-":
            self.next(); return ("neg", self.p_unary())
        if self.peek() and self.peek().tipo == "OP" and self.peek().val == "+":
            self.next(); return self.p_unary()
        return self.p_primary()

    def p_primary(self):
        tok = self.peek()
        if tok is None:
            raise ErrorFormula("Fin de fórmula inesperado")
        if tok.tipo == "NUM":
            self.next(); return ("num", tok.val)
        if tok.tipo == "STR":
            self.next(); return ("str", tok.val)
        if tok.tipo == "VAR":
            self.next(); return ("var", tok.val)
        if tok.tipo == "LPAR":
            self.next(); node = self.p_or(); self.expect("RPAR"); return node
        if tok.tipo == "FUNC":
            self.next(); self.expect("LPAR")
            args = []
            if self.peek() and self.peek().tipo != "RPAR":
                args.append(self.p_or())
                while self.peek() and self.peek().tipo == "COMMA":
                    self.next(); args.append(self.p_or())
            self.expect("RPAR")
            return ("func", tok.val, args)
        raise ErrorFormula(f"Token inesperado: {tok}")


def parsear(formula: str):
    """Tokeniza y parsea una fórmula a su AST (sin evaluar). Útil para validación."""
    return _P(tokenizar(formula or "")).parse()


# ----------------------------------------------------------------------------- helpers
def _r8(v: Decimal) -> Decimal:
    return v.quantize(_Q8, rounding=ROUND_HALF_EVEN)


def _num(v: Any) -> Decimal:
    if isinstance(v, Decimal):
        return v
    if isinstance(v, bool):
        return Decimal(-1) if v else Decimal(0)   # VB CDbl(True) = -1
    if isinstance(v, int):
        return Decimal(v)
    if isinstance(v, float):
        return Decimal(str(v))   # vía str para no arrastrar ruido binario del float
    if isinstance(v, str):
        try:
            return Decimal(v)
        except InvalidOperation:
            raise ErrorFormula(f"No es un número válido: '{v}'")
    raise ErrorFormula(f"No es numérico: {v!r}")


def _bool(v: Any) -> bool:
    if isinstance(v, bool):
        return v
    if isinstance(v, Decimal):
        return v != 0
    raise ErrorFormula(f"No es lógico: {v!r}")


def _split_fecha(aaaammdd: Decimal) -> tuple[int, int, int]:
    s = str(int(aaaammdd)).rjust(8, "0")
    return int(s[:4]), int(s[4:6]), int(s[6:8])


def _ultimo_dia(anio: int, mes: int) -> int:
    if mes == 12:
        return 31
    return (date(anio, mes + 1, 1) - timedelta(days=1)).day


# ----------------------------------------------------------------------------- funciones #
def _f_si(args, ctx):
    return _eval(args[1], ctx) if _bool(_eval(args[0], ctx)) else _eval(args[2], ctx)


def _f_si_alfa(args, ctx):
    return str(_eval(args[1], ctx)) if _bool(_eval(args[0], ctx)) else str(_eval(args[2], ctx))


def _f_redondeo(args, ctx):
    v = _num(_eval(args[0], ctx)); d = int(_num(_eval(args[1], ctx)))
    if d < 0:
        return v
    q = Decimal(1).scaleb(-d)
    return v.quantize(q, rounding=ROUND_HALF_EVEN)


def _f_redondeo_especial(args, ctx):
    # ASUNCIÓN: el componente COM del evaluador legacy no está en el código fuente, así que
    # se asume redondeo a 2 decimales (la regla "especial" exacta queda por confirmar).
    v = _num(_eval(args[0], ctx))
    return v.quantize(Decimal("0.01"), rounding=ROUND_HALF_EVEN)


def _f_entero(args, ctx):
    return Decimal(math.floor(_num(_eval(args[0], ctx))))   # Int() de VB trunca hacia -inf


def _f_valor(args, ctx):
    return _num(str(_eval(args[0], ctx)))


def _f_cad_en_lista(args, ctx):
    s = str(_eval(args[0], ctx)); lista = str(_eval(args[1], ctx))
    return s in lista


def _f_nro_en_lista(args, ctx):
    n = _num(_eval(args[0], ctx)); lista = str(_eval(args[1], ctx))
    return any(_num(x) == n for x in lista.split("/") if x.strip() != "")


def _f_anio(args, ctx):
    return Decimal(_split_fecha(_num(_eval(args[0], ctx)))[0])


def _f_mes(args, ctx):
    return Decimal(_split_fecha(_num(_eval(args[0], ctx)))[1])


def _f_dia(args, ctx):
    return Decimal(_split_fecha(_num(_eval(args[0], ctx)))[2])


def _f_fecha(args, ctx):
    d = int(_num(_eval(args[0], ctx))); m = int(_num(_eval(args[1], ctx))); a = int(_num(_eval(args[2], ctx)))
    if not (1 <= m <= 12):
        raise ErrorFormula(f"#FECHA: mes inválido {m}")
    if d > _ultimo_dia(a, m):
        d = _ultimo_dia(a, m)
    return Decimal(a * 10000 + m * 100 + d)


def _f_hoy(args, ctx):
    if ctx.fecha_servidor is None:
        raise ErrorFormula("#HOY: no se definió fecha_servidor en el Contexto")
    return Decimal(ctx.fecha_servidor)


def _f_entrefechas(args, ctx):
    f1 = int(_num(_eval(args[0], ctx))); f2 = int(_num(_eval(args[1], ctx)))
    if f1 > f2:
        raise ErrorFormula("#ENTREFECHAS: rango de fechas inválido")
    if f1 == f2:
        return Decimal(0)
    a, m, d = _split_fecha(Decimal(f1)); a2, m2, d2 = _split_fecha(Decimal(f2))
    if d > d2:
        if m >= 12:
            m = 1; a += 1
        else:
            m += 1
        dif = 30 - (d - d2) + 1
    else:
        dif = d2 - d + 1
    if (a > a2) or (a == a2 and m >= m2):
        return Decimal(0)
    if m <= m2:
        return Decimal(a2 - a) + Decimal(m2 - m) / 100 + Decimal(dif) / 10000
    a += 1
    aux = 12 - m + m2
    return Decimal(a2 - a) + Decimal(aux) / 100 + Decimal(dif) / 10000


def _f_suma_aamm(args, ctx):
    v = _num(_eval(args[0], ctx)) + _num(_eval(args[1], ctx))
    anio = int(v)
    meses = int((v - anio) * 100)
    dias = int(round(float((v * 100) - int(v * 100)) * 100))
    if dias >= 30:
        meses += dias // 30; dias = dias % 30
    if meses >= 12:
        anio += meses // 12; meses = meses % 12
    return Decimal(anio) + Decimal(meses) / 100 + Decimal(dias) / 10000


def _f_suma_dias(args, ctx):
    a, m, d = _split_fecha(_num(_eval(args[0], ctx)))
    nd = int(_num(_eval(args[1], ctx)))
    dd = date(a, m, d) + timedelta(days=nd)
    return Decimal(dd.year * 10000 + dd.month * 100 + dd.day)


def _f_i_valuacion(args, ctx):
    tipo = int(_num(_eval(args[0], ctx)))
    tot = Decimal(0)
    for r in ctx.valuaciones:
        if tipo == 0 or tipo == int(r.get("tval_Codigo", 0)):
            tot += _num(r.get("valu_Valor", 0))
    return tot


def _f_i_superficie(args, ctx):
    tipo = int(_num(_eval(args[0], ctx))); clase = int(_num(_eval(args[1], ctx)))
    tope = ctx.periodo * 10000 + ctx.mes * 100 + 31
    tot = Decimal(0)
    for r in ctx.superficies:
        if (tipo == 0 or tipo == int(r.get("tips_Codigo", 0))) and \
           (clase == 0 or clase == int(r.get("tips_Clase", 0))) and \
           int(r.get("supe_FechaVigencia", 0)) <= tope:
            tot += _num(r.get("supe_Superficie", 0))
    return tot


def _f_i_recargdescu(args, ctx):
    cod = int(_num(_eval(args[0], ctx))); tipo = str(_eval(args[1], ctx)).strip().upper()
    tasa = int(_num(_eval(args[2], ctx))); subtasa = int(_num(_eval(args[3], ctx)))
    desde = ctx.periodo * 10000 + ctx.mes * 100 + 1
    hasta = ctx.periodo * 10000 + ctx.mes * 100 + 31
    tot = Decimal(0)
    for r in ctx.recargos_desc:
        if cod == int(r.get("trde_Codigo", 0)) and \
           (tasa == 0 or tasa == int(r.get("ttas_Tasa", 0))) and \
           (subtasa == 0 or subtasa == int(r.get("ttas_SubTasa", 0))) and \
           int(r.get("recd_FechaDesde", 0)) <= hasta and \
           int(r.get("recd_FechaHasta", 0)) >= desde:
            tot += _num(r.get("recd_Porcentaje" if tipo == "P" else "recd_Importe", 0))
    return tot


def _claves(lista: str) -> List[str]:
    # la lista puede traer una o varias claves separadas por coma/;
    return [c.strip() for c in str(lista).replace(";", ",").split(",") if c.strip()]


def _f_suma_formu(args, ctx):
    idx = int(_num(_eval(args[0], ctx)))
    tot = Decimal(0)
    for clave in _claves(_eval(args[1], ctx)):
        vals = ctx.formulas_calculadas.get(clave)
        if vals:
            tot += _num(vals.get(idx, 0))
    return tot


def _f_suma_acumu(args, ctx):
    """Suma el valor de los acumuladores indicados (clave "tasa-sub-fort-acum"),
    ya calculados durante la liquidación de la cuenta."""
    tot = Decimal(0)
    for clave in _claves(_eval(args[0], ctx)):
        tot += _num(ctx.acumuladores_calculados.get(clave, 0))
    return tot


FUNCIONES = {
    "#SI": _f_si, "#SI_ALFA": _f_si_alfa, "#REDONDEO": _f_redondeo,
    "#REDONDEOESPECIAL": _f_redondeo_especial, "#ENTERO": _f_entero,
    "#VALOR": _f_valor, "#CAD_EN_LISTA": _f_cad_en_lista, "#NRO_EN_LISTA": _f_nro_en_lista,
    "#ANIO": _f_anio, "#MES": _f_mes, "#DIA": _f_dia, "#FECHA": _f_fecha, "#HOY": _f_hoy,
    "#ENTREFECHAS": _f_entrefechas, "#SUMA_AAMM": _f_suma_aamm, "#SUMA_DIAS": _f_suma_dias,
    "#I_VALUACION": _f_i_valuacion, "#I_SUPERFICIE": _f_i_superficie,
    "#I_RECARGDESCU": _f_i_recargdescu, "#SUMA_FORMU": _f_suma_formu,
    "#SUMA_ACUMU": _f_suma_acumu,
}


# ----------------------------------------------------------------------------- evaluación
def _eval(node, ctx: Contexto):
    op = node[0]
    if op == "num":
        return node[1]
    if op == "str":
        return node[1]
    if op == "var":
        return ctx.var(node[1])
    if op == "neg":
        return _r8(-_num(_eval(node[1], ctx)))
    if op == "not":
        return not _bool(_eval(node[1], ctx))
    if op == "and":
        return _bool(_eval(node[1], ctx)) and _bool(_eval(node[2], ctx))
    if op == "or":
        return _bool(_eval(node[1], ctx)) or _bool(_eval(node[2], ctx))
    if op == "cmp":
        a = _eval(node[2], ctx); b = _eval(node[3], ctx)
        if isinstance(a, str) or isinstance(b, str):
            a, b = str(a), str(b)
        else:
            a, b = _num(a), _num(b)
        o = node[1]
        return {">=": a >= b, "<=": a <= b, "<>": a != b,
                ">": a > b, "<": a < b, "=": a == b}[o]
    if op == "bin":
        a = _num(_eval(node[2], ctx)); b = _num(_eval(node[3], ctx)); o = node[1]
        if o == "+":
            return _r8(a + b)
        if o == "-":
            return _r8(a - b)
        if o == "*":
            return _r8(a * b)
        if o == "/":
            if b == 0:
                raise ErrorFormula("División por cero")
            return _r8(a / b)
    if op == "func":
        fn = FUNCIONES.get(node[1])
        if fn is None:
            raise ErrorFormula(f"Función inexistente: '{node[1]}'")
        return fn(node[2], ctx)
    raise ErrorFormula(f"Nodo desconocido: {node!r}")


def evaluar(formula: str, ctx: Optional[Contexto] = None) -> Decimal:
    """Evalúa una fórmula aritmética (aCancelar/aPagar) → Decimal."""
    ctx = ctx or Contexto()
    res = _eval(parsear(formula), ctx)
    return _num(res)


def evaluar_logica(formula: str, ctx: Optional[Contexto] = None) -> bool:
    """Evalúa una fórmula lógica (fort_Condicion) → bool. Condición vacía = True."""
    if formula is None or formula.strip() == "":
        return True
    ctx = ctx or Contexto()
    return _bool(_eval(parsear(formula), ctx))
