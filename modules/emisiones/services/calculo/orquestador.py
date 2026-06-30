"""Orquestador de liquidación de un padrón.

Pieza pura (sin BD) que conecta el padrón con el liquidador: arma el `Contexto` de cada
contribuyente a partir de un dict de datos (lo que la capa de datos extrae de
`ingresos_publicos`: variables de la cuenta + valuaciones + superficies) y devuelve las
líneas de liquidación listas para persistir.

La usa el `calculo_service` (capa de BD), que sólo se ocupa de leer/escribir filas.
"""

from __future__ import annotations

from decimal import Decimal
from typing import Any, Dict, List, Optional

from .interprete import Contexto
from .liquidador import Liquidador


def _to_var(v: Any) -> Any:
    """Convierte un valor del JSON a tipo apto para el intérprete.

    Los números (int/float) → Decimal; los strings se respetan (sirven para comparaciones
    de códigos, p.ej. zona `="1"`). El caller controla el tipo en el JSON.
    """
    if isinstance(v, bool):
        return v
    if isinstance(v, (int, float)):
        return Decimal(str(v))
    return v


def contexto_desde_datos(datos: Dict[str, Any], periodo: int, mes: int) -> Contexto:
    variables = {str(k).upper(): _to_var(v) for k, v in (datos.get("variables") or {}).items()}
    return Contexto(
        periodo=periodo,
        mes=mes,
        fecha_servidor=datos.get("fecha_servidor"),
        variables=variables,
        valuaciones=list(datos.get("valuaciones") or []),
        superficies=list(datos.get("superficies") or []),
        recargos_desc=list(datos.get("recargos_desc") or []),
    )


def liquidar_padron(
    formulas: List[Dict[str, Any]],
    contribuyentes: List[Dict[str, Any]],
    periodo: int,
    mes: int,
    tasas_emitir: Optional[set] = None,
) -> List[Dict[str, Any]]:
    """Liquida cada contribuyente del padrón.

    `contribuyentes`: lista de dicts con `id_contribuyente`, `id_objeto_imponible` y `datos`
    (el dict que consume `contexto_desde_datos`).

    Devuelve, por contribuyente, sus `lineas` de liquidación (una por tasa/subtasa/fórmula y
    vencimiento) con `a_cancelar` / `a_pagar`.
    """
    liq = Liquidador()
    salida: List[Dict[str, Any]] = []
    for c in contribuyentes:
        ctx = contexto_desde_datos(c.get("datos") or {}, periodo, mes)
        resultados = liq.liquidar(formulas, ctx)
        lineas: List[Dict[str, Any]] = []
        for r in resultados:
            # las tasas referenciadas (#SUMA_*) se calculan pero no se emiten como liquidación
            if tasas_emitir is not None and r.tasa not in tasas_emitir:
                continue
            for cuota in r.cuotas:
                lineas.append({
                    "tasa": r.tasa,
                    "subtasa": r.subtasa,
                    "formula": r.formula,
                    "vencimiento": cuota.numero,
                    "a_cancelar": cuota.a_cancelar,
                    "a_pagar": cuota.a_pagar,
                })
        errores = [f"{r.tasa}-{r.subtasa}-{r.formula}: {r.error}" for r in resultados if r.error]
        salida.append({
            "id_contribuyente": c.get("id_contribuyente"),
            "id_objeto_imponible": c.get("id_objeto_imponible"),
            "monto_a_pagar": sum((l["a_pagar"] for l in lineas), Decimal("0.00")),
            "lineas": lineas,
            "errores": errores,
        })
    return salida
