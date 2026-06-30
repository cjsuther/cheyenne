"""Liquidador — orquesta el cálculo de una cuenta a partir de sus `FormulaTasa`.

Es el port de `CCalculo.Calcular` (VB6): por cada fórmula de tasa vigente

  1. resetea los 20 acumuladores `@K_ACUMULA01..20`;
  2. evalúa los **acumuladores** de la fórmula (`FormulaTasaAcumuladores`) y los inyecta como
     variables `@K_ACUMULA{nn}`;
  3. evalúa la **condición** (`fort_Condicion`; vacía = siempre aplica);
  4. si aplica, evalúa para los **4 vencimientos** `fort_aCancelar{n}` (deuda que se imputa a la
     cuenta corriente) y `fort_aPagar{n}` (importe efectivo del recibo).

No accede a la base: recibe las fórmulas como `dict` (las cargará la capa de datos cuando
esté el dump de `FormulaTasa`) y el `Contexto` ya armado con la base imponible
(valuaciones/superficies) y las variables de la cuenta.
"""

from __future__ import annotations

from dataclasses import dataclass, field
from decimal import Decimal, ROUND_HALF_UP
from typing import Any, Dict, List

from .interprete import Contexto, evaluar, evaluar_logica

_ACUM_VARS = [f"K_ACUMULA{n:02d}" for n in range(1, 51)]
_Q2 = Decimal("0.01")


def _fmt2(v: Decimal) -> Decimal:
    return Decimal(v).quantize(_Q2, rounding=ROUND_HALF_UP)


@dataclass
class CuotaVencimiento:
    numero: int          # 1..4
    a_cancelar: Decimal
    a_pagar: Decimal


@dataclass
class LiquidacionFormula:
    tasa: int
    subtasa: int
    formula: int
    aplica: bool
    cuotas: List[CuotaVencimiento] = field(default_factory=list)

    @property
    def total_a_pagar(self) -> Decimal:
        return sum((c.a_pagar for c in self.cuotas), Decimal("0.00"))


class Liquidador:
    """Calcula las líneas de liquidación de una cuenta para un conjunto de fórmulas."""

    def liquidar(self, formulas: List[Dict[str, Any]], ctx: Contexto) -> List[LiquidacionFormula]:
        resultado: List[LiquidacionFormula] = []
        for f in sorted(formulas, key=lambda x: x.get("fort_orden", 0)):
            resultado.append(self._liquidar_formula(f, ctx))
        return resultado

    def _liquidar_formula(self, f: Dict[str, Any], ctx: Contexto) -> LiquidacionFormula:
        # 1. resetear acumuladores
        for v in _ACUM_VARS:
            ctx.variables[v] = Decimal("0")

        # 2. evaluar acumuladores y guardarlos como @K_ACUMULA{nn}
        for ac in f.get("acumuladores", []):
            numero = int(ac["ftac_Numero"])
            valor = evaluar(ac["ftac_Importe"], ctx)
            ctx.variables[f"K_ACUMULA{numero:02d}"] = valor

        # 3. condición (vacía => aplica)
        aplica = evaluar_logica(f.get("fort_Condicion", "") or "", ctx)

        cuotas: List[CuotaVencimiento] = []
        if aplica:
            for n in range(1, 5):
                ac_txt = (f.get(f"fort_aCancelar{n}") or "").strip()
                ap_txt = (f.get(f"fort_aPagar{n}") or "").strip()
                if not ac_txt and not ap_txt:
                    continue
                a_cancelar = _fmt2(evaluar(ac_txt, ctx)) if ac_txt else Decimal("0.00")
                a_pagar = _fmt2(evaluar(ap_txt, ctx)) if ap_txt else Decimal("0.00")
                cuotas.append(CuotaVencimiento(numero=n, a_cancelar=a_cancelar, a_pagar=a_pagar))

        return LiquidacionFormula(
            tasa=int(f.get("ttas_Tasa", 0)),
            subtasa=int(f.get("ttas_SubTasa", 0)),
            formula=int(f.get("fort_Numero", 0)),
            aplica=aplica,
            cuotas=cuotas,
        )
