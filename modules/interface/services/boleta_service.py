import io
import re
from typing import List

from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from models.boleta import Boleta


class BoletaService:
    def __init__(self, db: Session):
        self.db = db

    def list(self, skip: int = 0, limit: int = 20) -> List[Boleta]:
        return (
            self.db.query(Boleta)
            .order_by(Boleta.fecha_generacion.desc())
            .offset(skip)
            .limit(limit)
            .all()
        )

    def find_by_id(self, id: int) -> Boleta:
        boleta = self.db.query(Boleta).filter(Boleta.id == id).first()
        if not boleta:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Boleta {id} no encontrada",
            )
        return boleta

    def generate_boleta(self, boleta_data: dict) -> Boleta:
        boleta = Boleta(**boleta_data)
        self.db.add(boleta)
        self.db.commit()
        self.db.refresh(boleta)
        return boleta

    def find_by_cuenta(self, numero_cuenta: str, skip: int = 0, limit: int = 20) -> List[Boleta]:
        return (
            self.db.query(Boleta)
            .filter(Boleta.numero_cuenta == numero_cuenta)
            .order_by(Boleta.fecha_generacion.desc())
            .offset(skip)
            .limit(limit)
            .all()
        )

    # ── PDF con código de barras ─────────────────────────────────────
    def build_pdf(self, boleta: Boleta) -> bytes:
        from reportlab.lib.pagesizes import A4
        from reportlab.lib.units import mm
        from reportlab.lib import colors
        from reportlab.pdfgen import canvas
        from reportlab.graphics.barcode import code128, createBarcodeDrawing
        from reportlab.graphics.shapes import Drawing

        buf = io.BytesIO()
        c = canvas.Canvas(buf, pagesize=A4)
        w, h = A4

        codigo_pago = (boleta.codigo_barras or "").strip() or self._codigo_pago(boleta)

        # Encabezado
        c.setFillColor(colors.HexColor("#1e3a5f"))
        c.rect(0, h - 30 * mm, w, 30 * mm, fill=1, stroke=0)
        c.setFillColor(colors.white)
        c.setFont("Helvetica-Bold", 18)
        c.drawString(20 * mm, h - 18 * mm, "Municipalidad — Boleta de Pago")
        c.setFont("Helvetica", 10)
        c.drawString(20 * mm, h - 25 * mm, f"Boleta N° {boleta.id}")

        c.setFillColor(colors.black)
        y = h - 45 * mm

        def line(label, value):
            nonlocal y
            c.setFont("Helvetica-Bold", 10)
            c.drawString(20 * mm, y, f"{label}:")
            c.setFont("Helvetica", 10)
            c.drawString(70 * mm, y, str(value if value is not None else "—"))
            y -= 8 * mm

        line("Cuenta", boleta.numero_cuenta)
        line("Recibo", boleta.numero_recibo)
        line("Tipo de tributo", boleta.id_tipo_tributo)
        line("Fecha de generación", boleta.fecha_generacion.strftime("%d/%m/%Y") if boleta.fecha_generacion else "—")
        line("Vencimiento", boleta.fecha_vencimiento.strftime("%d/%m/%Y") if boleta.fecha_vencimiento else "—")

        # Importe destacado
        y -= 4 * mm
        c.setFillColor(colors.HexColor("#eef2f7"))
        c.rect(20 * mm, y - 4 * mm, w - 40 * mm, 14 * mm, fill=1, stroke=0)
        c.setFillColor(colors.black)
        c.setFont("Helvetica-Bold", 16)
        c.drawString(24 * mm, y + 1 * mm, f"Total a pagar:  $ {boleta.importe:,.2f}")

        # Código de barras
        y -= 30 * mm
        c.setFont("Helvetica-Bold", 10)
        c.drawString(20 * mm, y + 22 * mm, "Código de pago:")

        drawn = False
        digits = re.sub(r"\D", "", codigo_pago)
        if digits:
            if len(digits) % 2 != 0:
                digits = "0" + digits
            try:
                d = createBarcodeDrawing(
                    "I2of5",
                    value=digits,
                    barHeight=18 * mm,
                    humanReadable=True,
                    checksum=0,
                )
                d.drawOn(c, 20 * mm, y)
                drawn = True
            except Exception:
                drawn = False
        if not drawn:
            bc = code128.Code128(codigo_pago or str(boleta.id), barHeight=18 * mm)
            bc.drawOn(c, 20 * mm, y)
            c.setFont("Helvetica", 9)
            c.drawString(20 * mm, y - 5 * mm, codigo_pago or str(boleta.id))

        c.setFont("Helvetica-Oblique", 8)
        c.setFillColor(colors.grey)
        c.drawString(20 * mm, 15 * mm, "Documento generado por el portal Cheyenne. Válido para su pago en las bocas habilitadas.")

        c.showPage()
        c.save()
        buf.seek(0)
        return buf.getvalue()

    @staticmethod
    def _codigo_pago(boleta: Boleta) -> str:
        cuenta = re.sub(r"\D", "", boleta.numero_cuenta or "")
        importe = int(round(float(boleta.importe or 0) * 100))
        return f"{int(boleta.id):08d}{cuenta[:10]:0>10}{importe:012d}"
