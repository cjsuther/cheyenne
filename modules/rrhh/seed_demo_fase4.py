"""
Seed de datos DEMO para la FASE 4 del módulo RRHH: Impuesto a las Ganancias (4ta cat.)
y aguinaldo (SAC).

Puebla:
  - Deducciones personales anuales del año fiscal actual (mínimo no imponible, deducción
    especial, cónyuge, hijo, hijo incapacitado). Magnitudes escaladas a los sueldos DEMO
    para que la retención se dispare en los legajos de mayor haber.
  - Escala progresiva del art. 94 (9 tramos), coherente (fijo acumulado por tramo).
  - Conceptos de aguinaldo (aguinaldo=True): SAC = @SAC_BRUTO (mejor haber del semestre / 2)
    y sus aportes (jubilación, INSSJP, obra social).

Idempotente: usa códigos/pares (anio, concepto) y omite lo ya sembrado.
Opcional (SEED_LIQUIDAR=1): liquida ene..jun del año actual + un SAC de junio para que la
vista de Ganancias muestre acumulación y una retención real.

    docker compose exec rrhh python seed_demo_fase4.py
"""
import sys
import os
from datetime import datetime, timezone, date
from decimal import Decimal

sys.path.insert(0, os.path.dirname(__file__))
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from database import SessionLocal, engine
from shared.database import Base
from models.rrhh import (
    Concepto, GananciasDeduccion, GananciasEscala,
)
from services.liquidador import liquidar

ANIO = date.today().year

# ── Deducciones personales anuales ─────────────────────────────────────
#    NOTA DEMO: los sueldos de la demo corren con valor_modulo ≈ 850, por lo que la
#    remuneración neta gravada mensual es del orden de unos pocos miles. Para que la
#    retención de Ganancias sea observable, tanto las deducciones como la escala están
#    escaladas a esa magnitud (en producción se cargan los valores reales de AFIP/ARCA).
DEDUCCIONES = [
    ("minimo_no_imponible", "9000"),
    ("deduccion_especial", "6000"),
    ("conyuge", "5000"),
    ("hijo", "3000"),
    ("hijo_incapacitado", "6000"),
]

# ── Escala progresiva (tramo, desde, hasta, fijo, %, excedente_sobre) ──
#    hasta=None en el último tramo (sin tope). fijo acumulado y consistente.
ESCALA = [
    (1, "0",      "10000",  "0",     "5",  "0"),
    (2, "10000",  "20000",  "500",   "9",  "10000"),
    (3, "20000",  "35000",  "1400",  "12", "20000"),
    (4, "35000",  "55000",  "3200",  "15", "35000"),
    (5, "55000",  "80000",  "6200",  "19", "55000"),
    (6, "80000",  "120000", "10950", "23", "80000"),
    (7, "120000", "180000", "20150", "27", "120000"),
    (8, "180000", "260000", "36350", "31", "180000"),
    (9, "260000", None,     "61150", "35", "260000"),
]

# ── Conceptos de aguinaldo (aguinaldo=True) ────────────────────────────
#    (codigo, descripcion, tipo, orden, formula)
CONCEPTOS_SAC = [
    ("DEMO-SAC10",  "Aguinaldo (SAC)",            "H", "10",  "@SAC_BRUTO"),
    ("DEMO-SAC100", "Jubilación s/SAC (11%)",     "R", "100", "#REDONDEO(@TN_HABER * 0.11, 2)"),
    ("DEMO-SAC110", "Ley 19032 s/SAC (3%)",       "R", "110", "#REDONDEO(@TN_HABER * 0.03, 2)"),
    ("DEMO-SAC120", "Obra social s/SAC (4.5%)",   "R", "120", "#REDONDEO(@TN_HABER * 0.045, 2)"),
]


def seed():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        now = datetime.now(timezone.utc)

        n_ded = 0
        for concepto, importe in DEDUCCIONES:
            if db.query(GananciasDeduccion).filter(
                    GananciasDeduccion.anio == ANIO, GananciasDeduccion.concepto == concepto,
                    GananciasDeduccion.activo == True).first():
                continue
            db.add(GananciasDeduccion(anio=ANIO, concepto=concepto,
                                      importe_anual=Decimal(importe), created_at=now)); n_ded += 1

        n_esc = 0
        for (tramo, desde, hasta, fijo, porc, exc) in ESCALA:
            if db.query(GananciasEscala).filter(
                    GananciasEscala.anio == ANIO, GananciasEscala.tramo == tramo,
                    GananciasEscala.activo == True).first():
                continue
            db.add(GananciasEscala(
                anio=ANIO, tramo=tramo, desde=Decimal(desde),
                hasta=(Decimal(hasta) if hasta is not None else None),
                fijo=Decimal(fijo), porcentaje=Decimal(porc),
                excedente_sobre=Decimal(exc), created_at=now)); n_esc += 1

        n_con = 0
        for (cod, desc, tipo, orden, form) in CONCEPTOS_SAC:
            if db.query(Concepto).filter(Concepto.codigo == cod).first():
                continue
            db.add(Concepto(codigo=cod, descripcion=desc, tipo=tipo, orden=Decimal(orden),
                            formula=form, aguinaldo=True, created_at=now)); n_con += 1

        db.commit()
        print(f"seed rrhh fase4: +{n_ded} deducciones, +{n_esc} tramos escala, +{n_con} conceptos SAC (año {ANIO})")

        # Liquidación demo opcional: ene..jun mensual + SAC junio para acumular Ganancias.
        if os.getenv("SEED_LIQUIDAR", "0") == "1":
            vm = Decimal("850.50")
            for mes in range(1, 7):
                r = liquidar(db, ANIO, mes, "MEN", vm, quien="seed-f4")
                print(f"  liq {ANIO}-{mes:02d} MEN -> ret={r['total_retenciones']} neto={r['total_neto']}")
            rs = liquidar(db, ANIO, 6, "SAC", vm, quien="seed-f4")
            print(f"  liq {ANIO}-06 SAC -> ret={rs['total_retenciones']} neto={rs['total_neto']}")
    except Exception as ex:
        db.rollback()
        print(f"seed rrhh fase4: fallo: {ex}")
        raise
    finally:
        db.close()


if __name__ == "__main__":
    seed()
