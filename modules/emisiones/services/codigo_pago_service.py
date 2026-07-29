"""Generación del código de pago interoperable de un comprobante.

Produce dos artefactos a partir de un comprobante emitido:

  (a) Código de barras **Interleaved 2 of 5 (ITF)** con dígito verificador mod-10
      (esquema típico de los entes recaudadores tipo Red Link / Pago Fácil).
  (b) Código **QR** con un payload estructurado: código de pago + importe + vencimiento.

TRANSPARENCIA: el layout EXACTO interoperable de cada red (posiciones, longitudes,
separadores) debe validarse contra el ente recaudador antes de producción. Acá se
produce un código correcto (numérico, con verificador mod-10) y adaptable: la
construcción del "código de pago" está aislada en ``construir_codigo_pago`` para
poder ajustarla al spec del ente sin tocar el resto.
"""

from decimal import Decimal, ROUND_HALF_UP
from datetime import datetime, date
from typing import Dict, Any, Optional
import io
import json


def _q2(v) -> Decimal:
    return Decimal(str(v or 0)).quantize(Decimal("0.01"), rounding=ROUND_HALF_UP)


def digito_verificador_mod10(numero: str) -> int:
    """Dígito verificador mod-10 (Luhn-like con pesos 2/1 desde la derecha).

    Es el esquema de verificación más difundido en los cupones de pago numéricos.
    """
    total = 0
    for i, ch in enumerate(reversed(numero)):
        d = int(ch)
        peso = 2 if i % 2 == 0 else 1
        p = d * peso
        if p > 9:
            p -= 9
        total += p
    return (10 - (total % 10)) % 10


def _fecha_yyyymmdd(v) -> str:
    if not v:
        return "00000000"
    if isinstance(v, str):
        try:
            v = datetime.fromisoformat(v[:19])
        except ValueError:
            return "00000000"
    if isinstance(v, (datetime, date)):
        return v.strftime("%Y%m%d")
    return "00000000"


def construir_codigo_pago(comprobante, vencimiento=None) -> str:
    """Arma el código de pago NUMÉRICO base (sin dígito verificador).

    Layout (adaptable al ente): emision(6) + contribuyente(8) + importe_centavos(12)
    + vencimiento AAAAMMDD(8) = 34 dígitos. El ITF requiere longitud PAR: como acá
    ya es par, no se rellena; ``codigo_barras_itf`` agrega el verificador (queda impar
    y se rellena con un 0 a la izquierda para volver a par).
    """
    imp = comprobante.importe_total if comprobante.importe_total is not None else comprobante.importe_a_cancelar
    centavos = int(_q2(imp) * 100)
    venc = _fecha_yyyymmdd(vencimiento)
    base = f"{int(comprobante.id_emision or 0):06d}" \
           f"{int(comprobante.id_contribuyente or 0):08d}" \
           f"{centavos:012d}" \
           f"{venc}"
    return base


def codigo_barras_itf(codigo_numerico: str) -> Dict[str, str]:
    """Agrega el dígito verificador mod-10 y normaliza a longitud PAR (requisito de ITF).

    Devuelve el string listo para representar como Interleaved 2 of 5.
    """
    solo_digitos = "".join(c for c in codigo_numerico if c.isdigit())
    dv = digito_verificador_mod10(solo_digitos)
    con_dv = f"{solo_digitos}{dv}"
    if len(con_dv) % 2 != 0:  # ITF codifica pares de dígitos
        con_dv = "0" + con_dv
    return {"codigo": con_dv, "digito_verificador": str(dv)}


def render_barcode_png(codigo_itf: str) -> bytes:
    """Renderiza el Interleaved 2 of 5 a PNG usando reportlab."""
    from reportlab.graphics.barcode import createBarcodeDrawing
    drawing = createBarcodeDrawing(
        "I2of5", value=codigo_itf, barHeight=60, barWidth=1.2,
        checksum=0,  # el DV mod-10 ya está incorporado en el valor
    )
    return drawing.asString("png")


def construir_payload_qr(comprobante, codigo_pago: str, vencimiento=None) -> Dict[str, Any]:
    imp = comprobante.importe_total if comprobante.importe_total is not None else comprobante.importe_a_cancelar
    return {
        "v": 1,
        "ente": "municipio",
        "codigo_pago": codigo_pago,
        "comprobante": comprobante.numero_comprobante,
        "tributo": comprobante.tipo_tributo,
        "periodo": comprobante.periodo,
        "importe": float(_q2(imp)),
        "vencimiento": _fecha_yyyymmdd(vencimiento),
    }


def render_qr_png(payload: Dict[str, Any]) -> bytes:
    import qrcode
    img = qrcode.make(json.dumps(payload, separators=(",", ":"), ensure_ascii=False))
    buf = io.BytesIO()
    img.save(buf, format="PNG")
    return buf.getvalue()


def datos_codigo_pago(comprobante, vencimiento=None) -> Dict[str, Any]:
    """Estructura completa (sin binarios) del código de pago de un comprobante."""
    base = construir_codigo_pago(comprobante, vencimiento)
    itf = codigo_barras_itf(base)
    payload = construir_payload_qr(comprobante, itf["codigo"], vencimiento)
    imp = comprobante.importe_total if comprobante.importe_total is not None else comprobante.importe_a_cancelar
    return {
        "numero_comprobante": comprobante.numero_comprobante,
        "codigo_pago": itf["codigo"],
        "codigo_base": base,
        "digito_verificador": itf["digito_verificador"],
        "formato_barcode": "Interleaved 2 of 5 (ITF) + verificador mod-10",
        "importe": float(_q2(imp)),
        "vencimiento": _fecha_yyyymmdd(vencimiento),
        "qr_payload": payload,
        "nota": "Layout adaptable; validar longitudes/separadores contra el ente recaudador (Red Link / Pago Fácil).",
    }
