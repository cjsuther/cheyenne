"""Conversores entre las filas ORM de `FormulaTasa` y los dicts que consume el liquidador.

Puro: opera sobre cualquier objeto con los atributos esperados (ORM o stub), así que es
testeable sin base de datos.
"""

from __future__ import annotations

from typing import Any, Dict, List


def formula_a_dict(formula: Any, acumuladores: List[Any]) -> Dict[str, Any]:
    """Convierte una fila `FormulaTasa` + sus acumuladores al formato del liquidador."""
    return {
        "ttas_Tasa": formula.ttas_tasa,
        "ttas_SubTasa": formula.ttas_subtasa,
        "fort_Numero": formula.fort_numero,
        "fort_orden": formula.fort_orden,
        "fort_Condicion": formula.fort_condicion,
        "fort_aCancelar1": formula.fort_a_cancelar_1,
        "fort_aPagar1": formula.fort_a_pagar_1,
        "fort_aCancelar2": formula.fort_a_cancelar_2,
        "fort_aPagar2": formula.fort_a_pagar_2,
        "fort_aCancelar3": formula.fort_a_cancelar_3,
        "fort_aPagar3": formula.fort_a_pagar_3,
        "fort_aCancelar4": formula.fort_a_cancelar_4,
        "fort_aPagar4": formula.fort_a_pagar_4,
        "acumuladores": [
            {"ftac_Numero": a.ftac_numero, "ftac_Importe": a.ftac_importe}
            for a in sorted(acumuladores, key=lambda x: x.ftac_numero)
        ],
    }
