"""FASE 5 — Exportadores de archivos de la liquidación.

  sicoss_txt(db, proc)          Declaración jurada F.931 / SICOSS (una línea fija por CUIL).
  banco_txt(db, proc, formato)  Archivo de acreditación bancaria (Header/Detalle/Trailer,
                                importes en centavos), formato CBU/Cámara Compensadora.

NOTA: el layout SICOSS aquí es una versión REPRESENTATIVA y documentada de los campos
principales del registro (CUIL, revista, remuneraciones imponibles, SAC, obra social).
El aplicativo real de AFIP usa un registro fijo más extenso; en producción se completan
los campos faltantes. Los importes van en centavos, sin separador, con relleno a la
derecha con ceros.
"""
import sys
import os
from decimal import Decimal, ROUND_HALF_EVEN

sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))
from models.rrhh import LiquidacionProceso, TotalesLiquidacion, Legajo


def _dec(v):
    if v is None:
        return Decimal(0)
    return v if isinstance(v, Decimal) else Decimal(str(v))


def _cent(v, width):
    """Importe en centavos, relleno a la derecha con ceros (ancho fijo)."""
    c = int((_dec(v) * 100).quantize(Decimal("1"), rounding=ROUND_HALF_EVEN))
    if c < 0:
        c = 0
    return str(c).rjust(width, "0")[-width:]


def _txt(s, width):
    """Texto ASCII en mayúsculas, alineado a la izquierda, ancho fijo (trunca/rellena)."""
    s = (s or "")
    s = s.encode("ascii", "ignore").decode("ascii").upper()
    return s.ljust(width)[:width]


def _n(s, width):
    """Numérico como cadena, relleno a la izquierda con ceros."""
    s = "".join(ch for ch in str(s or "") if ch.isdigit())
    return s.rjust(width, "0")[-width:]


def _legajos_por_id(db, proc):
    ids = [t.id_legajo for t in db.query(TotalesLiquidacion.id_legajo)
           .filter(TotalesLiquidacion.id_proceso == proc.id).all()]
    if not ids:
        return {}
    return {l.id: l for l in db.query(Legajo).filter(Legajo.id.in_(ids)).all()}


# ─── SICOSS / F.931 ───────────────────────────────────────────────────
def sicoss_txt(db, proc):
    """Genera el TXT SICOSS (una línea fija por legajo). Devuelve (texto, nombre_archivo)."""
    legs = _legajos_por_id(db, proc)
    filas = (db.query(TotalesLiquidacion)
             .filter(TotalesLiquidacion.id_proceso == proc.id)
             .order_by(TotalesLiquidacion.id).all())
    lineas = []
    for t in filas:
        leg = legs.get(t.id_legajo)
        cuil = _n(getattr(leg, "cuil", "") if leg else "", 11)
        nombre = _txt(t.apellido_nombre or (leg.apellido_nombre if leg else ""), 30)
        rem_total = _dec(t.haberes) + _dec(t.asig_familiar) + _dec(t.exentos)
        rem_imponible = _dec(t.haberes)  # base imponible (haberes remunerativos)
        # Campos fijos representativos
        linea = (
            cuil                       # 1-11   CUIL
            + nombre                   # 12-41  Apellido y Nombre
            + "0"                      # 42     Cónyuge (0/1)
            + _n(0, 2)                 # 43-44  Cantidad de hijos
            + "01"                     # 45-46  Código de situación (01=activo)
            + "01"                     # 47-48  Código de condición
            + _n(0, 3)                 # 49-51  Código de actividad
            + _n(0, 2)                 # 52-53  Código de zona
            + "008"                    # 54-56  Modalidad de contratación (008=tiempo indet.)
            + _n(0, 6)                 # 57-62  Código de obra social
            + _n(0, 2)                 # 63-64  Cantidad de adherentes
            + _cent(rem_total, 15)     # 65-79  Remuneración total
            + _cent(rem_imponible, 15) # 80-94  Remuneración imponible 1
            + _cent(t.asig_familiar, 15)  # 95-109  Asignaciones familiares
            + _cent(rem_imponible, 15) # 110-124 Rem. imponible 4 (SIPA)
            + _cent(t.retenciones, 15) # 125-139 Aportes SIPA + INSSJP retenidos
            + _cent(t.aportes_patronales, 15)  # 140-154 Contribuciones patronales
        )
        lineas.append(linea)
    texto = "\r\n".join(lineas) + ("\r\n" if lineas else "")
    nombre_archivo = f"SICOSS_{proc.anio}{proc.mes:02d}_{proc.tipo_liq or 'MEN'}.txt"
    return texto, nombre_archivo


# ─── Acreditación bancaria (CBU / Cámara Compensadora) ────────────────
def banco_txt(db, proc, formato="cbu"):
    """Genera el archivo de acreditación bancaria. Devuelve (texto, nombre_archivo, omitidos).
    `omitidos` = legajos sin CBU que no pudieron incluirse."""
    legs = _legajos_por_id(db, proc)
    filas = (db.query(TotalesLiquidacion)
             .filter(TotalesLiquidacion.id_proceso == proc.id)
             .order_by(TotalesLiquidacion.id).all())
    detalle = []
    total = Decimal(0)
    omitidos = []
    for t in filas:
        leg = legs.get(t.id_legajo)
        cbu = "".join(ch for ch in (getattr(leg, "cbu", "") or "") if ch.isdigit()) if leg else ""
        if len(cbu) != 22:
            omitidos.append(t.apellido_nombre or str(t.id_legajo))
            continue
        neto = _dec(t.neto)
        total += neto
        detalle.append(
            "1"                        # Tipo de registro: Detalle
            + cbu                      # CBU (22)
            + _n(getattr(leg, "cuil", ""), 11)  # CUIL (11)
            + _txt(t.apellido_nombre or "", 30)  # Titular (30)
            + _cent(neto, 15)          # Importe a acreditar (centavos)
        )
    fecha = f"{proc.anio}{proc.mes:02d}01"
    header = ("0" + fecha + _txt("HABERES", 20) + _txt(f"{proc.anio}{proc.mes:02d}", 6)
              + _cent(total, 15) + _n(len(detalle), 6))
    trailer = "9" + _n(len(detalle), 6) + _cent(total, 15)
    texto = "\r\n".join([header] + detalle + [trailer]) + "\r\n"
    nombre_archivo = f"BANCO_{formato.upper()}_{proc.anio}{proc.mes:02d}_{proc.tipo_liq or 'MEN'}.txt"
    return texto, nombre_archivo, omitidos
