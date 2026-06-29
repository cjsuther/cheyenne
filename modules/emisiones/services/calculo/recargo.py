"""Motor de recargos por mora — port del régimen *default* de `CCalculoRecargo` (VB6).

Calcula, sobre una deuda vencida, los accesorios por pago tardío: **recargo** /
**interés resarcitorio**, **multa por omisión**, **ordenanza** y (si hay juicio)
**gastos / aporte / tasa y sobretasa de justicia**.

Sólo se porta el régimen **default** (Lomas/Lanús/Tigre); las ramas FV/LC/MORENO del
legacy son de otros municipios y quedan fuera.

Datos reales usados (ver `legacy/analisis/Anexo-Datos-Reales-Motor-Calculo.md`):
- curva `RecargosTasas` tasa 99999 (serie temporal de tasa de recargo/interés);
- coeficientes `Coeficientes` (RESLE, GASTO, APABO, TASJU, STAJU, ORD90…).

Semántica del documento de fórmulas, §3:
- acumulación por tramos de la curva (días × tasa del tramo); antes de 1997 se cuenta en
  **meses**, después en **días**;
- corte **recargo ↔ interés resarcitorio** el 30/11/2000;
- redondeo: acumulación con `Round(...,4)` bancario; importes finales con `Format(...,"0.00")`
  = half-up.
"""

from __future__ import annotations

from dataclasses import dataclass, field
from datetime import date
from decimal import Decimal, ROUND_HALF_EVEN, ROUND_HALF_UP
from typing import List, Optional

_FECHA_CORTE_INTERES = date(2000, 11, 30)   # <= corte: recargo ; > : interés resarcitorio
_FECHA_LEGALES = date(2000, 12, 1)          # desde acá aplica coef. legal si hay juicio
_FECHA_CERT_LEGALES = date(2006, 11, 27)    # certificado posterior => coef. legal
_FECHA_DIAS = date(1997, 1, 1)              # antes: meses ; desde: días
_FECHA_MULTA_1998 = date(1998, 12, 31)
_FECHA_MULTA_2000 = date(2000, 11, 30)

_Q4 = Decimal("0.0001")
_Q2 = Decimal("0.01")


def _r4(v: Decimal) -> Decimal:
    return v.quantize(_Q4, rounding=ROUND_HALF_EVEN)


def _fmt2(v: Decimal) -> Decimal:
    return v.quantize(_Q2, rounding=ROUND_HALF_UP)


def _dias(a: date, b: date) -> int:
    return (b - a).days


def _meses(a: date, b: date) -> int:
    return (b.year - a.year) * 12 + (b.month - a.month)


def _add_mes(d: date, n: int = 1) -> date:
    m = d.month - 1 + n
    y = d.year + m // 12
    m = m % 12 + 1
    # último día válido del mes destino
    import calendar
    day = min(d.day, calendar.monthrange(y, m)[1])
    return date(y, m, day)


# ---------------------------------------------------------------------------- entradas
@dataclass(frozen=True)
class Tramo:
    fecha: date
    valor: Decimal


@dataclass
class Coeficientes:
    """Valores reales (Lanús) — ver anexo. Porcentajes salvo RESLE (tasa diaria)."""
    resle: Decimal = Decimal("0.066")            # interés resarcitorio legales (tasa diaria)
    gastos_causidicos: Decimal = Decimal("5")    # %
    aporte_abogado: Decimal = Decimal("10")      # %
    tasa_justicia: Decimal = Decimal("2.2")      # %
    sobretasa_justicia: Decimal = Decimal("10")  # %
    ordenanza: Decimal = Decimal("10")           # % (ORD90)


# curva real RecargosTasas 99999 subtasa 0 (anexo) — tasa por día (post-1997) / por mes (pre-1997)
CURVA_LANUS: List[Tramo] = [
    Tramo(date(1983, 2, 28), Decimal("0.7500")),
    Tramo(date(1991, 4, 1), Decimal("1.7100")),
    Tramo(date(1994, 1, 1), Decimal("3.0000")),
    Tramo(date(1997, 1, 1), Decimal("0.0700")),
    Tramo(date(2000, 12, 1), Decimal("0.0500")),
    Tramo(date(2012, 1, 1), Decimal("0.0670")),
    Tramo(date(2024, 3, 31), Decimal("0.2670")),
    Tramo(date(2024, 12, 31), Decimal("0.1167")),
]


# --------------------------------------------------------------------------- resultado
@dataclass
class ResultadoRecargo:
    recargo: Decimal = Decimal("0.00")
    interes_resarcitorio: Decimal = Decimal("0.00")
    multa_omision: Decimal = Decimal("0.00")
    interes_multa_omision: Decimal = Decimal("0.00")
    ordenanza: Decimal = Decimal("0.00")
    gastos: Decimal = Decimal("0.00")
    aporte_abogado: Decimal = Decimal("0.00")
    tasa_justicia: Decimal = Decimal("0.00")
    sobretasa_justicia: Decimal = Decimal("0.00")
    honorarios: Decimal = Decimal("0.00")
    porcentaje_recargo: Decimal = Decimal("0")   # dblRecargo acumulado (informativo)

    @property
    def total_accesorios(self) -> Decimal:
        return (self.recargo + self.interes_resarcitorio + self.multa_omision +
                self.interes_multa_omision + self.ordenanza + self.gastos +
                self.aporte_abogado + self.tasa_justicia + self.sobretasa_justicia +
                self.honorarios)


# ----------------------------------------------------------------------------- motor
class MotorRecargo:
    def __init__(self, curva: Optional[List[Tramo]] = None, coef: Optional[Coeficientes] = None):
        self.curva = sorted(curva or CURVA_LANUS, key=lambda t: t.fecha)
        self.coef = coef or Coeficientes()

    def _acumular_porcentaje(self, fecha_vto: date, fecha_calc: date,
                             coef_legal: Optional[Decimal]) -> Decimal:
        """Recorre la curva acumulando el porcentaje de recargo (§3.2 del documento)."""
        dbl = Decimal("0")
        desde = fecha_vto
        g = Decimal("0")        # tasa del tramo en curso (dblGValor); arranca en 0
        ultima = None
        for tr in self.curva:
            if tr.fecha > fecha_calc:
                d = _dias(desde, fecha_calc)
                tasa = coef_legal if (coef_legal is not None and desde >= _FECHA_LEGALES) else g
                dbl += _r4(Decimal(d) * tasa)
                return dbl
            if tr.fecha > fecha_vto:
                if desde < fecha_vto:
                    desde = fecha_vto
                if tr.fecha > _FECHA_DIAS:
                    cant = _dias(desde, tr.fecha)
                else:
                    if desde == fecha_vto:
                        desde = _add_mes(desde, 1)
                    cant = _meses(desde, tr.fecha)
                tasa = coef_legal if (coef_legal is not None and desde >= _FECHA_LEGALES) else g
                dbl += _r4(Decimal(cant) * tasa)
                desde = tr.fecha
            g = tr.valor
            ultima = tr.fecha
        if ultima is not None and ultima <= fecha_calc:
            d = _dias(desde, fecha_calc)
            tasa = coef_legal if (coef_legal is not None and desde >= _FECHA_LEGALES) else g
            dbl += _r4(Decimal(d) * tasa)
        return dbl

    def calcular(
        self, *,
        importe: Decimal,
        fecha_vencimiento: date,
        fecha_calculo: date,
        dtri: int,
        coef_ordenanza: Optional[Decimal] = None,
        multa_1998: Decimal = Decimal("0"),
        multa_2000: Decimal = Decimal("0"),
        mul_rec_2001: Decimal = Decimal("0"),
        mul_rec_2004: Decimal = Decimal("0"),
        periodo: int = 0,
        cuota: str = "",
        multa_inspeccion: Decimal = Decimal("0"),
        intimado: str = "S",
        categoria_catastral: int = 0,
        juce_numero: int = 0,
        honorarios: Decimal = Decimal("0"),
        hay_demanda: bool = False,
        es_legales: bool = False,
        fecha_certificado: Optional[date] = None,
    ) -> ResultadoRecargo:
        importe = Decimal(importe)
        r = ResultadoRecargo()
        coef_ord = self.coef.ordenanza if coef_ordenanza is None else Decimal(coef_ordenanza)

        # deuda aún no vencida -> sólo ordenanza
        if fecha_vencimiento >= fecha_calculo:
            r.ordenanza = self._ordenanza(importe, coef_ord, fecha_vencimiento, fecha_calculo,
                                          dtri, categoria_catastral, intimado)
            return r
        if importe <= 0:
            return r

        # ¿aplica coeficiente legal? (deuda en juicio con certificado posterior, o forzado)
        coef_legal = None
        if (juce_numero > 0 and fecha_certificado is not None
                and fecha_certificado > _FECHA_CERT_LEGALES) or es_legales:
            coef_legal = self.coef.resle

        dbl = self._acumular_porcentaje(fecha_vencimiento, fecha_calculo, coef_legal)
        r.porcentaje_recargo = dbl

        # multa por omisión
        if dtri == 1:
            if fecha_vencimiento <= _FECHA_MULTA_1998:
                r.multa_omision = _fmt2(importe * multa_1998 / 100)
            elif fecha_vencimiento <= _FECHA_MULTA_2000:
                r.multa_omision = _fmt2(importe * multa_2000 / 100)
        elif dtri == 2 and multa_inspeccion == 0:
            if periodo < 2004 or (periodo == 2004 and cuota < "0003"):
                if periodo < 2001:
                    r.multa_omision = _fmt2(importe * mul_rec_2001)   # factor directo
                elif periodo <= 2004:
                    r.multa_omision = _fmt2(importe * mul_rec_2004)

        # recargo vs interés resarcitorio (corte 30/11/2000)
        monto = _fmt2(importe * dbl / 100)
        if fecha_vencimiento <= _FECHA_CORTE_INTERES:
            r.recargo = monto
            if r.recargo > 0:
                r.interes_multa_omision = r.recargo
        else:
            r.interes_resarcitorio = monto

        # ordenanza sobre el total con accesorios
        total = (importe + r.recargo + r.interes_resarcitorio + r.multa_omision +
                 r.interes_multa_omision + multa_inspeccion)
        r.ordenanza = self._ordenanza(total, coef_ord, fecha_vencimiento, fecha_calculo,
                                      dtri, categoria_catastral, intimado)

        # accesorios de juicio
        if juce_numero != 0:
            r.honorarios = _fmt2(honorarios)
            base = (importe + r.recargo + r.interes_resarcitorio + r.multa_omision +
                    r.interes_multa_omision + r.ordenanza)
            r.gastos = _fmt2((base + multa_inspeccion) * self.coef.gastos_causidicos / 100)
            if hay_demanda:
                r.aporte_abogado = _fmt2(r.honorarios * self.coef.aporte_abogado / 100)
                r.tasa_justicia = _fmt2(base * self.coef.tasa_justicia / 100)
                r.sobretasa_justicia = _fmt2(r.tasa_justicia * self.coef.sobretasa_justicia / 100)

        return r

    def _ordenanza(self, total: Decimal, coef: Decimal, fecha_vto: date, fecha_calc: date,
                   dtri: int, categoria: int, intimado: str) -> Decimal:
        # exenciones (§3.6)
        if categoria == 4 and intimado == "N":
            return Decimal("0.00")
        if dtri == 2 and fecha_vto.year == fecha_calc.year and fecha_vto.month == fecha_calc.month:
            return Decimal("0.00")
        if total <= 0:
            return Decimal("0.00")
        if fecha_vto >= fecha_calc:
            return Decimal("0.00")
        return _fmt2(total * coef / 100)
