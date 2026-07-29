"""Validacion por fila segun el tipo de importacion.

Cada validador recibe el dict de la fila (ya con el mapeo aplicado a campos
destino) y devuelve None si esta OK, o un string con el detalle del error.
"""
import re
from decimal import Decimal, InvalidOperation

_CUIT_RE = re.compile(r"^\d{2}-?\d{8}-?\d$")


def _num(v):
    if v is None:
        raise InvalidOperation()
    s = str(v).strip().replace(".", "").replace(",", ".") if "," in str(v) else str(v).strip()
    return Decimal(s)


def validar_contribuyentes(fila: dict):
    doc = (fila.get("documento") or fila.get("cuit") or "").strip()
    nombre = (fila.get("nombre") or fila.get("razon_social") or "").strip()
    if not doc:
        return "Falta documento/CUIT"
    if not nombre:
        return "Falta nombre/razon social"
    if "cuit" in fila and fila.get("cuit") and not _CUIT_RE.match(str(fila["cuit"]).strip()):
        return f"CUIT invalido: {fila['cuit']}"
    return None


def validar_recaudacion(fila: dict):
    doc = (fila.get("documento") or fila.get("cuit") or "").strip()
    if not doc:
        return "Falta documento del contribuyente"
    monto_raw = fila.get("monto") or fila.get("importe")
    if monto_raw is None or str(monto_raw).strip() == "":
        return "Falta monto/importe"
    try:
        monto = _num(monto_raw)
    except (InvalidOperation, ValueError):
        return f"Monto no numerico: {monto_raw}"
    if monto <= 0:
        return "El monto debe ser mayor a cero"
    return None


def validar_generico(fila: dict):
    # generico: al menos una celda con contenido
    if not any((str(v).strip() for v in fila.values() if v is not None)):
        return "Fila vacia"
    return None


VALIDADORES = {
    "contribuyentes": validar_contribuyentes,
    "recaudacion": validar_recaudacion,
    "generico": validar_generico,
}

TIPOS_VALIDOS = list(VALIDADORES.keys())


def validar(tipo: str, fila: dict):
    fn = VALIDADORES.get(tipo, validar_generico)
    try:
        return fn(fila)
    except Exception as e:  # ningun error de validador debe abortar el lote
        return f"Error validando fila: {e}"
