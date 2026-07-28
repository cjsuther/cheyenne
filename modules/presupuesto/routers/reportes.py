import io
import sys
import os
from datetime import datetime, timezone

from fastapi import APIRouter, Depends, Query, HTTPException, status
from fastapi.responses import Response
from sqlalchemy.orm import Session

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", ".."))
from shared.base_module import create_auth_dependency

from database import get_db
from config import get_settings
from models.ejercicio import Ejercicio
from routers.tablero import resumen as calc_resumen

settings = get_settings()
get_current_user = create_auth_dependency(settings.seguridad_url)

router = APIRouter(prefix="/reportes", tags=["Reportes"])


def _requiere(cu, permiso):
    if cu.get("superuser"):
        return
    if permiso not in [p["codigo"] for p in cu.get("permisos", [])]:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=f"No tiene el permiso '{permiso}'")


@router.get("/presupuesto-pdf")
def presupuesto_pdf(
    anio: int = Query(...),
    por: str = Query("inciso", pattern="^(inciso|jurisdiccion|fuente)$"),
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    """Resumen del presupuesto en PDF (≡ F12 Resumen de Gastos del legacy, por dimensión)."""
    _requiere(current_user, "presupuesto_read")
    from reportlab.lib.pagesizes import A4, landscape
    from reportlab.lib.units import mm
    from reportlab.lib import colors
    from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer
    from reportlab.lib.styles import getSampleStyleSheet

    data = calc_resumen(anio=anio, por=por, db=db, current_user=current_user)
    e = db.query(Ejercicio).filter(Ejercicio.anio == anio, Ejercicio.activo == True).first()

    buf = io.BytesIO()
    doc = SimpleDocTemplate(buf, pagesize=landscape(A4),
                            leftMargin=14 * mm, rightMargin=14 * mm, topMargin=14 * mm, bottomMargin=12 * mm)
    styles = getSampleStyleSheet()
    fm = lambda v: f"{v:,.2f}".replace(",", "X").replace(".", ",").replace("X", ".")
    story = [
        Paragraph(f"<b>Presupuesto de Gastos — Ejercicio {anio}</b>", styles["Title"]),
        Paragraph(
            f"Resumen por {por} · Estado: {e.estado if e else '-'} · "
            f"{('Acto: ' + e.acto_administrativo) if e and e.acto_administrativo else ''} · "
            f"Emitido: {datetime.now(timezone.utc).strftime('%d/%m/%Y %H:%M')} UTC · "
            f"Ejecución: {data['porcentaje_ejecucion']}%", styles["Normal"]),
        Spacer(1, 6 * mm),
    ]
    cab = [por.capitalize(), "Inicial", "Modif.", "Vigente", "Preventivo", "Comprometido",
           "Devengado", "Pagado", "Disponible"]
    filas = [cab]
    for f in data["apertura"]["filas"]:
        filas.append([f["clave"][:48]] + [fm(f[k]) for k in
                     ("inicial", "modificaciones", "vigente", "preventivo", "comprometido",
                      "devengado", "pagado", "disponible")])
    t = data["totales"]
    filas.append(["TOTALES"] + [fm(t[k]) for k in
                 ("inicial", "modificaciones", "vigente", "preventivo", "comprometido",
                  "devengado", "pagado", "disponible")])
    tabla = Table(filas, repeatRows=1)
    tabla.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#1D4ED8")),
        ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
        ("FONTSIZE", (0, 0), (-1, -1), 7.5),
        ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
        ("FONTNAME", (0, -1), (-1, -1), "Helvetica-Bold"),
        ("BACKGROUND", (0, -1), (-1, -1), colors.HexColor("#E2E8F0")),
        ("ALIGN", (1, 0), (-1, -1), "RIGHT"),
        ("GRID", (0, 0), (-1, -1), 0.4, colors.HexColor("#CBD5E1")),
        ("ROWBACKGROUNDS", (0, 1), (-1, -2), [colors.white, colors.HexColor("#F8FAFC")]),
    ]))
    story.append(tabla)
    story.append(Spacer(1, 5 * mm))
    story.append(Paragraph(
        f"Recursos vigentes: {fm(data['recursos']['vigente'])} · Percibido: {fm(data['recursos']['percibido'])} · "
        f"Equilibrio recursos-gastos: {fm(data['equilibrio'])}", styles["Normal"]))
    story.append(Paragraph("Cheyenne · Módulo Presupuesto", styles["Italic"]))
    doc.build(story)
    return Response(buf.getvalue(), media_type="application/pdf",
                    headers={"Content-Disposition": f'inline; filename="presupuesto_{anio}_{por}.pdf"'})
