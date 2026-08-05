"""
Seed de datos DEMO para la FASE 2 del módulo RRHH: motor de conceptos + liquidación.
Puebla tipos de liquidación, ~9 conceptos reales con fórmulas y unas novedades demo.

Idempotente: usa códigos con prefijo DEMO- y omite lo ya sembrado.
Opcionalmente corre una liquidación demo del período actual (SEED_LIQUIDAR=1).

    docker compose exec rrhh python seed_demo_liquidacion.py
"""
import sys
import os
from datetime import datetime, timezone
from decimal import Decimal

sys.path.insert(0, os.path.dirname(__file__))
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from database import SessionLocal, engine
from shared.database import Base
from models.rrhh import Concepto, TipoLiquidacion, Novedad, Legajo
from services.liquidador import liquidar


# ── Tipos de liquidación ──────────────────────────────────────────────
TIPOS_LIQ = [
    ("MEN", "Mensual"),
    ("SAC", "Aguinaldo (SAC)"),
]

# ── Conceptos con fórmulas de texto (codigo, descripcion, tipo, orden,
#    condicion, cantidad, base, porcentaje, formula, aguinaldo) ─────────
# NOTA @BASICO_REF: no se materializa una variable @BASICO_REF (los acumuladores del
# motor son TN_*), por lo que el concepto TITULO usa @TN_HABER * 0.15 (haberes
# acumulados hasta ese punto), tal como autoriza el prompt.
CONCEPTOS = [
    ("DEMO-C10", "Sueldo básico", "H", "10", None, None, None, None,
     "@MODULOS * @VALOR_MODULO", False),
    ("DEMO-C20", "Antigüedad", "H", "20", "@ANIOS_ANTIG > 0", None, None, None,
     "#REDONDEO(@TN_HABER * @ANIOS_ANTIG * 0.02, 2)", False),
    ("DEMO-C30", "Presentismo", "H", "30", None, None, None, None,
     "#REDONDEO(@TN_HABER * 0.10, 2)", False),
    ("DEMO-C40", "Adicional por título", "H", "40", "@TIENE_TITULO > 0", None, None, None,
     "#REDONDEO(@TN_HABER * 0.15, 2)", False),
    ("DEMO-C100", "Jubilación (11%)", "R", "100", None, None, None, None,
     "#REDONDEO(@TN_HABER * 0.11, 2)", False),
    ("DEMO-C110", "Ley 19032 / INSSJP (3%)", "R", "110", None, None, None, None,
     "#REDONDEO(@TN_HABER * 0.03, 2)", False),
    ("DEMO-C120", "Obra social (4.5%)", "R", "120", None, None, None, None,
     "#REDONDEO(@TN_HABER * 0.045, 2)", False),
    ("DEMO-C130", "Aporte sindical (2%)", "D", "130", None, None, None, None,
     "#REDONDEO(@TN_HABER * 0.02, 2)", False),
    ("DEMO-C200", "Aporte patronal (16%)", "P", "200", None, None, None, None,
     "#REDONDEO(@TN_HABER * 0.16, 2)", False),
]


def seed():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        now = datetime.now(timezone.utc)

        n_tl = 0
        for codigo, desc in TIPOS_LIQ:
            if db.query(TipoLiquidacion).filter(TipoLiquidacion.codigo == codigo).first():
                continue
            db.add(TipoLiquidacion(codigo=codigo, descripcion=desc, created_at=now)); n_tl += 1

        n_con = 0
        for (cod, desc, tipo, orden, cond, cant, base, porc, form, agui) in CONCEPTOS:
            if db.query(Concepto).filter(Concepto.codigo == cod).first():
                continue
            db.add(Concepto(codigo=cod, descripcion=desc, tipo=tipo, orden=Decimal(orden),
                            condicion=cond, cantidad=cant, base=base, porcentaje=porc,
                            formula=form, aguinaldo=agui, created_at=now)); n_con += 1

        # Novedades demo: @TIENE_TITULO=1 para los primeros 3 legajos DEMO
        n_nov = 0
        legajos = db.query(Legajo).filter(Legajo.numero_legajo.like("DEMO-%")).order_by(Legajo.id).limit(3).all()
        for leg in legajos:
            if db.query(Novedad).filter(Novedad.id_legajo == leg.id,
                                        Novedad.variable == "@TIENE_TITULO").first():
                continue
            db.add(Novedad(id_legajo=leg.id, variable="@TIENE_TITULO", valor=Decimal("1"),
                           descripcion="Posee título habilitante (demo)", created_at=now)); n_nov += 1

        db.commit()
        print(f"seed rrhh fase2: +{n_con} conceptos, +{n_tl} tipos_liq, +{n_nov} novedades")

        # Liquidación demo opcional
        if os.getenv("SEED_LIQUIDAR", "0") == "1":
            from datetime import date
            hoy = date.today()
            res = liquidar(db, hoy.year, hoy.month, "MEN", Decimal("850.50"), quien="seed")
            print(f"seed rrhh fase2: liquidación demo {hoy.year}-{hoy.month:02d} MEN -> {res}")
    except Exception as ex:
        db.rollback()
        print(f"seed rrhh fase2: fallo: {ex}")
        raise
    finally:
        db.close()


if __name__ == "__main__":
    seed()
