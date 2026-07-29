"""Genera el recibo/certificado PDF de un pago de autogestión (WAV) con reportlab.
Incluye un código de barras (code128) para presentar en caja/pasarela."""
import io

from reportlab.lib.pagesizes import A5
from reportlab.lib.units import mm
from reportlab.pdfgen import canvas
from reportlab.graphics.barcode import code128


def _num(v) -> str:
    try:
        return f"$ {float(v or 0):,.2f}"
    except Exception:
        return str(v)


def generar_recibo_pdf(pago, cuenta=None) -> bytes:
    """pago: PagoContado ORM. cuenta: Cuenta ORM (opcional). Devuelve los bytes del PDF."""
    buf = io.BytesIO()
    cv = canvas.Canvas(buf, pagesize=A5)
    w, h = A5
    x = 18 * mm
    y = h - 20 * mm

    cv.setFont("Helvetica-Bold", 15)
    cv.drawString(x, y, "Recibo de pago — Autogestión")
    y -= 6 * mm
    cv.setFont("Helvetica", 8)
    cv.setFillGray(0.4)
    numero = f"WAV-{pago.id:08d}"
    cv.drawString(x, y, f"{numero}   ·   Portal del contribuyente")
    cv.setFillGray(0)
    y -= 10 * mm

    fecha = ""
    try:
        fecha = pago.fecha_pago.strftime("%d/%m/%Y %H:%M") if pago.fecha_pago else ""
    except Exception:
        fecha = str(pago.fecha_pago or "")

    filas = [
        ("Cuenta", getattr(cuenta, "numero_cuenta", None) or f"#{pago.id_cuenta or '-'}"),
        ("Tipo de tributo", str(pago.id_tipo_tributo or getattr(cuenta, "id_tipo_tributo", "") or "-")),
        ("Declaración jurada", f"#{pago.id_declaracion_jurada}" if pago.id_declaracion_jurada else "-"),
        ("Fecha de pago", fecha),
        ("Transacción externa", pago.id_transaccion_externa or "-"),
    ]
    cv.setFont("Helvetica", 10)
    for etiqueta, valor in filas:
        cv.setFillGray(0.4); cv.drawString(x, y, etiqueta)
        cv.setFillGray(0); cv.drawRightString(w - 18 * mm, y, str(valor))
        y -= 6 * mm

    y -= 3 * mm
    cv.setLineWidth(0.5); cv.line(x, y, w - 18 * mm, y); y -= 8 * mm
    cv.setFont("Helvetica-Bold", 13)
    cv.drawString(x, y, "Importe pagado")
    cv.drawRightString(w - 18 * mm, y, _num(pago.importe))
    y -= 14 * mm

    # Código de barras (usa el guardado en el pago o el número de recibo)
    codigo = pago.codigo_barras or numero
    try:
        barcode = code128.Code128(codigo, barHeight=14 * mm, barWidth=0.4 * mm)
        barcode.drawOn(cv, x, y - 14 * mm)
        cv.setFont("Helvetica", 7)
        cv.setFillGray(0.4)
        cv.drawString(x, y - 19 * mm, codigo)
        cv.setFillGray(0)
    except Exception:
        cv.setFont("Helvetica", 8)
        cv.drawString(x, y, f"Código: {codigo}")

    cv.setFont("Helvetica-Oblique", 7)
    cv.setFillGray(0.5)
    cv.drawString(x, 12 * mm, "Comprobante generado por el portal de autogestión WAV.")
    cv.showPage()
    cv.save()
    buf.seek(0)
    return buf.read()
