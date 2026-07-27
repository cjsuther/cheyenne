"""Generación de los PDF de recibos de una emisión, en un directorio."""
import os
from typing import Dict, Any, Optional

from sqlalchemy.orm import Session
from reportlab.lib.pagesizes import A5
from reportlab.lib.units import mm
from reportlab.pdfgen import canvas
from reportlab.graphics.barcode import code128

from models.comprobante import Comprobante

BASE_DIR = "/app/pdfs"  # volumen montado (persistente)


def _num(v) -> str:
    try:
        return f"$ {float(v or 0):,.2f}"
    except Exception:
        return str(v)


def _render_recibo(path: str, c: Comprobante, tipo_tributo: str, periodo: str):
    cv = canvas.Canvas(path, pagesize=A5)
    w, h = A5
    x = 18 * mm
    y = h - 20 * mm

    cv.setFont("Helvetica-Bold", 15)
    cv.drawString(x, y, "Recibo de pago"); y -= 6 * mm
    cv.setFont("Helvetica", 8)
    cv.setFillGray(0.4)
    cv.drawString(x, y, f"{c.numero_comprobante or ''}   ·   Emisión {tipo_tributo} {periodo}")
    cv.setFillGray(0); y -= 10 * mm

    cv.setFont("Helvetica", 10)
    for etiqueta, valor in [
        ("Contribuyente", f"#{c.id_contribuyente}"),
        ("Objeto imponible", f"#{c.id_objeto_imponible or '-'}"),
        ("Tributo / Período", f"{c.tipo_tributo or '-'} {c.periodo or ''}"),
        ("Líneas", c.cantidad_lineas),
        ("Importe a cancelar", _num(c.importe_a_cancelar)),
    ]:
        cv.setFillGray(0.4); cv.drawString(x, y, etiqueta)
        cv.setFillGray(0); cv.drawRightString(w - 18 * mm, y, str(valor))
        y -= 6 * mm

    y -= 3 * mm
    cv.setLineWidth(0.5); cv.line(x, y, w - 18 * mm, y); y -= 8 * mm
    cv.setFont("Helvetica-Bold", 13)
    cv.drawString(x, y, "TOTAL A PAGAR")
    cv.drawRightString(w - 18 * mm, y, _num(c.importe_total)); y -= 16 * mm

    if c.codigo_barras:
        bc = code128.Code128(str(c.codigo_barras), barHeight=16 * mm, barWidth=0.42 * mm)
        bc.drawOn(cv, x, y - 16 * mm)
        cv.setFont("Helvetica", 7)
        cv.drawString(x, y - 20 * mm, str(c.codigo_barras))

    cv.setFont("Helvetica", 7); cv.setFillGray(0.5)
    cv.drawString(x, 12 * mm, "Cheyenne · Ingresos Públicos")
    cv.showPage()
    cv.save()


def listar_recibos(id_emision: int) -> list:
    """Lista los PDF de recibos generados para la emisión."""
    base = os.path.join(BASE_DIR, f"emision_{id_emision}")
    out = []
    if os.path.isdir(base):
        for ambito in sorted(os.listdir(base)):
            d = os.path.join(base, ambito)
            if os.path.isdir(d):
                for f in sorted(os.listdir(d)):
                    if f.endswith(".pdf"):
                        out.append({"ambito": ambito, "archivo": f,
                                    "bytes": os.path.getsize(os.path.join(d, f))})
    return out


def recibos_de_contribuyente(db: Session, id_contribuyente: int) -> list:
    """Recibos PDF de un contribuyente en todas sus emisiones (para la Vista 360 y Tesorería).

    Cruza los comprobantes del contribuyente contra los PDF existentes en disco: el archivo
    se nombra con el numero_comprobante, y el comprobante tiene el id_contribuyente.
    """
    comps = (
        db.query(Comprobante)
        .filter(Comprobante.id_contribuyente == id_contribuyente, Comprobante.activo == True)
        .all()
    )
    if not comps:
        return []
    meta = {c.numero_comprobante: c for c in comps if c.numero_comprobante}
    out = []
    for eid in sorted({c.id_emision for c in comps}):
        for f in listar_recibos(eid):
            stem = f["archivo"][:-4] if f["archivo"].endswith(".pdf") else f["archivo"]
            c = meta.get(stem)
            if not c:
                continue  # recibo de otro contribuyente en la misma emisión
            out.append({
                "id_emision": eid,
                "numero_comprobante": c.numero_comprobante,
                "tipo_tributo": c.tipo_tributo,
                "periodo": c.periodo,
                "importe_total": float(c.importe_total or 0),
                "ambito": f["ambito"],
                "archivo": f["archivo"],
                "bytes": f["bytes"],
            })
    return out


def ruta_recibo(id_emision: int, ambito: str, archivo: str) -> str:
    # anti path-traversal
    ambito = os.path.basename(ambito)
    archivo = os.path.basename(archivo)
    return os.path.join(BASE_DIR, f"emision_{id_emision}", ambito, archivo)


def generar_recibos_pdf(db: Session, emision, ambito: str, directorio: Optional[str] = None) -> Dict[str, Any]:
    comps = (
        db.query(Comprobante)
        .filter(Comprobante.id_emision == emision.id, Comprobante.activo == True)
        .order_by(Comprobante.numero_comprobante)
        .all()
    )
    if not comps:
        raise ValueError("No hay comprobantes para imprimir")

    # directorio destino (siempre bajo el volumen montado, para que sea escribible/persistente)
    sub = (directorio or f"emision_{emision.id}/{ambito}").lstrip("/")
    dest = os.path.join(BASE_DIR, sub)
    os.makedirs(dest, exist_ok=True)

    for c in comps:
        nombre = f"{(c.numero_comprobante or ('REC-%08d' % c.id))}.pdf".replace("/", "-")
        _render_recibo(os.path.join(dest, nombre), c, emision.tipo_tributo, emision.periodo)

    return {"directorio": dest, "recibos": len(comps)}
