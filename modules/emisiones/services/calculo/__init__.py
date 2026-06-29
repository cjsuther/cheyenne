"""Motor de cálculo de Rentas (port del intérprete de fórmulas legacy).

Expone el intérprete de fórmulas `FormulaTasa` (port de las clases VB6
`CCalcFormula` + `CCalcEvaluador` del sistema legacy Compubeccar).
"""

from .interprete import (
    Contexto,
    ErrorFormula,
    evaluar,
    evaluar_logica,
    parsear,
    FUNCIONES,
)
from .recargo import (
    MotorRecargo,
    Coeficientes,
    Tramo,
    ResultadoRecargo,
    CURVA_LANUS,
)
from .liquidador import (
    Liquidador,
    LiquidacionFormula,
    CuotaVencimiento,
)

__all__ = [
    # intérprete de fórmulas
    "Contexto",
    "ErrorFormula",
    "evaluar",
    "evaluar_logica",
    "parsear",
    "FUNCIONES",
    # motor de recargos
    "MotorRecargo",
    "Coeficientes",
    "Tramo",
    "ResultadoRecargo",
    "CURVA_LANUS",
    # liquidador
    "Liquidador",
    "LiquidacionFormula",
    "CuotaVencimiento",
]
