"""Motor de cálculo de planes de pago / moratoria — port de `CalcPlanes`/`CondPlanes` (legacy).

Calcula la financiación de una deuda en cuotas por **sistema francés** (cuota fija):

    i = tasa_interes_mensual / 100
    C = K · i · (1+i)^n / ((1+i)^n − 1)          (K = monto financiado, n = cuotas)
    por cuota j:  interés_j = round(saldo · i, 2) ; capital_j = C − interés_j
    la última cuota absorbe el residuo de redondeo (saldo → 0).

Incluye los **descuentos de moratoria** por componente (deuda original / actualización /
recargo) y el cálculo del **anticipo**. Es puro (sin BD), por eso testeable.
"""

from __future__ import annotations

import calendar
from dataclasses import dataclass, field
from datetime import date
from decimal import Decimal, ROUND_HALF_UP
from typing import Any, Dict, List, Optional

_Q2 = Decimal("0.01")


def _r2(v: Decimal) -> Decimal:
    return Decimal(v).quantize(_Q2, rounding=ROUND_HALF_UP)


# ----------------------------------------------------------------------- descuentos
def aplicar_descuentos_moratoria(
    deuda_original: Decimal,
    actualizacion: Decimal = Decimal("0"),
    recargo: Decimal = Decimal("0"),
    desc_original_pct: Decimal = Decimal("0"),
    desc_actualizacion_pct: Decimal = Decimal("0"),
    desc_recargo_pct: Decimal = Decimal("0"),
) -> Decimal:
    """Monto a financiar tras aplicar los descuentos de moratoria por componente (§4.2 legacy)."""
    o = Decimal(deuda_original) * (1 - Decimal(desc_original_pct) / 100)
    a = Decimal(actualizacion) * (1 - Decimal(desc_actualizacion_pct) / 100)
    r = Decimal(recargo) * (1 - Decimal(desc_recargo_pct) / 100)
    return _r2(o + a + r)


# ------------------------------------------------------------------------ anticipo
def calcular_anticipo(
    monto: Decimal,
    cantidad_cuotas: int,
    porcentaje: Optional[Decimal] = None,
    importe_minimo: Optional[Decimal] = None,
) -> Decimal:
    """Anticipo del plan: por porcentaje, o por defecto `monto/(cuotas+1)` (legacy)."""
    monto = Decimal(monto)
    if porcentaje is not None:
        anticipo = monto * Decimal(porcentaje) / 100
    else:
        anticipo = monto / (cantidad_cuotas + 1)
    if importe_minimo is not None and anticipo < Decimal(importe_minimo):
        anticipo = Decimal(importe_minimo)
    return _r2(anticipo)


# ------------------------------------------------------------------------ resultado
@dataclass
class CuotaPlan:
    numero: int
    capital: Decimal
    interes: Decimal
    importe: Decimal     # capital + interés
    saldo: Decimal       # capital pendiente luego de esta cuota


@dataclass
class ResultadoPlan:
    monto_total: Decimal
    anticipo: Decimal
    monto_financiado: Decimal
    cantidad_cuotas: int
    tasa_interes_pct: Decimal
    cuotas: List[CuotaPlan] = field(default_factory=list)

    @property
    def total_intereses(self) -> Decimal:
        return sum((c.interes for c in self.cuotas), Decimal("0.00"))

    @property
    def total_cuotas(self) -> Decimal:
        return sum((c.importe for c in self.cuotas), Decimal("0.00"))

    @property
    def total_a_pagar(self) -> Decimal:
        return _r2(self.anticipo + self.total_cuotas)


# -------------------------------------------------------------------- sistema francés
def calcular_plan(
    *,
    monto_total: Decimal,
    cantidad_cuotas: int,
    tasa_interes_pct: Decimal = Decimal("0"),
    anticipo: Decimal = Decimal("0"),
) -> ResultadoPlan:
    """Calcula el plan (anticipo + cuotas por sistema francés).

    `monto_total`: deuda a financiar (ya neta de descuentos de moratoria).
    `tasa_interes_pct`: interés mensual en porcentaje (0 = sin interés, cuota = K/n).
    """
    monto_total = Decimal(monto_total)
    anticipo = Decimal(anticipo)
    if cantidad_cuotas < 1:
        raise ValueError("cantidad_cuotas debe ser >= 1")

    financiado = _r2(monto_total - anticipo)
    if financiado < 0:
        raise ValueError("El anticipo no puede superar el monto total")

    i = Decimal(tasa_interes_pct) / 100
    n = cantidad_cuotas

    if i == 0:
        cuota_fija = _r2(financiado / n)
    else:
        factor = (1 + i) ** n
        cuota_fija = _r2(financiado * i * factor / (factor - 1))

    cuotas: List[CuotaPlan] = []
    saldo = financiado
    for j in range(1, n + 1):
        interes = _r2(saldo * i)
        if j < n:
            capital = cuota_fija - interes
        else:
            capital = saldo                    # la última cuota absorbe el residuo
        importe = _r2(capital + interes)
        saldo = _r2(saldo - capital)
        cuotas.append(CuotaPlan(numero=j, capital=_r2(capital), interes=interes,
                                importe=importe, saldo=saldo))

    return ResultadoPlan(
        monto_total=monto_total, anticipo=anticipo, monto_financiado=financiado,
        cantidad_cuotas=n, tasa_interes_pct=Decimal(tasa_interes_pct), cuotas=cuotas,
    )


def _add_meses(d: date, n: int) -> date:
    m = d.month - 1 + n
    y = d.year + m // 12
    m = m % 12 + 1
    return date(y, m, min(d.day, calendar.monthrange(y, m)[1]))


def resultado_a_cuotas(
    id_plan: int,
    resultado: ResultadoPlan,
    primer_vencimiento: Optional[date] = None,
    periodicidad_meses: int = 1,
) -> List[Dict[str, Any]]:
    """Mapea las cuotas calculadas a kwargs de `PlanPagoCuota` (con vencimientos). Puro."""
    filas: List[Dict[str, Any]] = []
    for c in resultado.cuotas:
        vto = None
        if primer_vencimiento is not None:
            vto = _add_meses(primer_vencimiento, (c.numero - 1) * periodicidad_meses)
        filas.append({
            "id_plan_pago": id_plan,
            "numero_cuota": c.numero,
            "capital": c.capital,
            "interes": c.interes,
            "importe": c.importe,
            "fecha_vencimiento": vto,
        })
    return filas
