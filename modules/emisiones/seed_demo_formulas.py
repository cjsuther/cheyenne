"""Fórmulas de tasa demo para que las emisiones de vehículos y comercios calculen.
Inmuebles ya tiene la tasa 999 (ABL). Idempotente.
Ejecutar: docker compose exec emisiones python seed_demo_formulas.py
"""
import sys
import os

sys.path.insert(0, os.path.dirname(__file__))
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from database import SessionLocal, engine
from shared.database import Base
from models.formula_tasa import FormulaTasa

FORMULAS = [
    # Patente automotor: 3% de la valuación DNRPA; 10% de descuento por pago al día.
    dict(tipo_tributo="vehiculos", ttas_tasa=300, ttas_subtasa=0, fort_numero=1, fort_orden=0,
         fort_descripcion="PATENTE AUTOMOTOR (demo)",
         fort_condicion="@V_VALUACION > 0",
         fort_a_cancelar_1="#REDONDEO(@V_VALUACION * 0.03, 2)",
         fort_a_pagar_1="#REDONDEO(@V_VALUACION * 0.03 * 0.9, 2)"),
    # Seguridad e Higiene / IIBB: 1.1% sobre ingresos declarados; 5% de descuento por pago al día.
    dict(tipo_tributo="comercios", ttas_tasa=400, ttas_subtasa=0, fort_numero=1, fort_orden=0,
         fort_descripcion="SEG. E HIGIENE / IIBB (demo)",
         fort_condicion="@C_INGRESOS > 0",
         fort_a_cancelar_1="#REDONDEO(@C_INGRESOS * 0.011, 2)",
         fort_a_pagar_1="#REDONDEO(@C_INGRESOS * 0.011 * 0.95, 2)"),
]


def seed():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    n = 0
    for f in FORMULAS:
        ya = db.query(FormulaTasa).filter(
            FormulaTasa.ttas_tasa == f["ttas_tasa"],
            FormulaTasa.ttas_subtasa == f["ttas_subtasa"],
            FormulaTasa.fort_numero == f["fort_numero"],
        ).first()
        if not ya:
            db.add(FormulaTasa(activo=True, **f))
            n += 1
    db.commit()
    print(f"seed_demo_formulas: +{n} formulas (vehiculos 300, comercios 400)")
    db.close()


if __name__ == "__main__":
    seed()
