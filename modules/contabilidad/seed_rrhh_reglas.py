"""Seed de reglas de imputación para el devengado de haberes de RRHH.

Crea la regla `rrhh.devengado` en el libro patrimonial (asiento de sueldos) y en el
libro presupuestario (ejecución del crédito). A diferencia de las reglas base, cada
línea toma su importe de una clave del CONTEXTO de la transacción (haberes/neto/
retenciones/aportes_patronales), por eso no se usa el helper de seed.py.

Asiento patrimonial del devengado (importe tx = costo laboral = haberes + aportes):
    DEBE  5.1.02 Gastos en personal            = importe (costo total)
    HABER 2.1.02 Sueldos a pagar               = neto
    HABER 2.1.03 Retenciones a depositar       = retenciones
    HABER 2.1.04 Contribuciones patronales     = aportes_patronales
(balancea: neto + retenciones = haberes; + aportes = costo = importe)

Idempotente: no recrea una (tipo, libro) ya existente.

    docker compose exec contabilidad python seed_rrhh_reglas.py
"""
import sys
import os

sys.path.insert(0, os.path.dirname(__file__))
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from database import SessionLocal, engine
from shared.database import Base
from models.contabilidad import PlanCuenta
from models.transacciones import ReglaImputacion, ReglaLinea

# (tipo, libro, descripción, [(orden, lado, origen_cuenta, cuenta_codigo, importe_campo)])
REGLAS = [
    ("rrhh.devengado", "patrimonial",
     "Devengado de haberes: Gastos en personal a Sueldos/Retenciones/Contribuciones a pagar", [
         (1, "debe",  "fija", "5.1.02", "importe"),
         (2, "haber", "fija", "2.1.02", "neto"),
         (3, "haber", "fija", "2.1.03", "retenciones"),
         (4, "haber", "fija", "2.1.04", "aportes_patronales"),
     ]),
    ("rrhh.devengado", "presupuestaria",
     "Ejecución del crédito (haberes devengados): Devengado a Crédito", [
         (1, "debe",  "fija", "0.1.03", "importe"),
         (2, "haber", "fija", "0.1.01", "importe"),
     ]),
    # Pago de haberes (si RRHH llegara a postear 'rrhh.pagado'): Sueldos a pagar a Banco.
    ("rrhh.pagado", "patrimonial",
     "Pago de haberes: Sueldos a pagar a Banco", [
         (1, "debe",  "fija", "2.1.02", "importe"),
         (2, "haber", "fija", "1.1.01", "importe"),
     ]),
]


def run():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        # Verificar que existan las cuentas usadas (si falta el plan, avisar).
        codigos = {c for _, _, _, lineas in REGLAS for (_, _, _, c, _) in lineas}
        faltan = [c for c in sorted(codigos)
                  if not db.query(PlanCuenta).filter(PlanCuenta.codigo == c).first()]
        if faltan:
            print(f"seed rrhh reglas: FALTAN cuentas en el plan: {faltan}. "
                  f"Corré primero 'python seed.py' en contabilidad.")
            return

        creadas = 0
        for tipo, libro, desc, lineas in REGLAS:
            if db.query(ReglaImputacion).filter(
                    ReglaImputacion.tipo == tipo, ReglaImputacion.libro == libro).first():
                continue
            r = ReglaImputacion(tipo=tipo, libro=libro, descripcion=desc, activo=True)
            db.add(r); db.flush()
            for orden, lado, origen, codigo, campo in lineas:
                db.add(ReglaLinea(id_regla=r.id, orden=orden, lado=lado, origen_cuenta=origen,
                                  cuenta_codigo=codigo, importe_campo=campo))
            creadas += 1
        db.commit()
        print(f"seed rrhh reglas: +{creadas} reglas de imputación (rrhh.devengado/rrhh.pagado)")
    finally:
        db.close()


if __name__ == "__main__":
    run()
