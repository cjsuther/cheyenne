"""Siembra idempotente del plan de cuentas base y el ejercicio 2026 abierto."""
import sys, os
from datetime import date

sys.path.insert(0, os.path.dirname(__file__))
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from shared.database import Base
from database import engine, SessionLocal
from models.contabilidad import PlanCuenta, EjercicioContable
from models.transacciones import ReglaImputacion, ReglaLinea
import models  # noqa: F401


# (codigo, nombre, tipo, imputable, codigo_padre, nivel)
PLAN = [
    # Rubros de agrupación (no imputables)
    ("1",      "Activo",                         "activo",      False, None,  1),
    ("1.1",    "Activo corriente",               "activo",      False, "1",   2),
    ("2",      "Pasivo",                         "pasivo",      False, None,  1),
    ("2.1",    "Pasivo corriente",               "pasivo",      False, "2",   2),
    ("2.2",    "Fondos de terceros",             "pasivo",      False, "2",   2),
    ("3",      "Patrimonio",                     "patrimonio",  False, None,  1),
    ("3.9",    "Resultados",                     "patrimonio",  False, "3",   2),
    ("4",      "Recursos",                       "recurso",     False, None,  1),
    ("4.1",    "Recursos corrientes",            "recurso",     False, "4",   2),
    ("5",      "Gastos",                         "gasto",       False, None,  1),
    ("5.1",    "Gastos corrientes",              "gasto",       False, "5",   2),
    # Cuentas imputables (contrato del asiento automático)
    ("1.1.01", "Banco",                          "activo",      True,  "1.1", 3),
    ("1.1.02", "Caja",                           "activo",      True,  "1.1", 3),
    ("1.1.03", "Recaudación a depositar",        "activo",      True,  "1.1", 3),
    ("1.1.20", "Deudores por tributos",          "activo",      True,  "1.1", 3),
    ("2.1.01", "Proveedores / Deuda a pagar",    "pasivo",      True,  "2.1", 3),
    ("2.2.01", "Fondos de terceros",             "pasivo",      True,  "2.2", 3),
    ("3.9.99", "Resultado del ejercicio",        "patrimonio",  True,  "3.9", 3),
    ("4.1.01", "Recursos tributarios",           "recurso",     True,  "4.1", 3),
    ("5.1.01", "Gastos de funcionamiento",       "gasto",       True,  "5.1", 3),
]


# Reglas de imputación base: tipo -> (descripción, [(orden, lado, cuenta_codigo, importe_campo)])
# El importe usa el campo 'importe' de la transacción; las cuentas son fijas (se pueden
# cambiar a 'derivada' + mapeo desde la UI cuando se quiera imputar por objeto de gasto/tributo).
REGLAS = [
    ("gasto.devengado", "Devengado del gasto: Gasto a Proveedores", [
        (1, "debe",  "5.1.01"), (2, "haber", "2.1.01")]),
    ("gasto.pagado", "Pago del gasto: Proveedores a Banco", [
        (1, "debe",  "2.1.01"), (2, "haber", "1.1.01")]),
    ("recurso.emitido", "Emisión de deuda tributaria: Deudores a Recursos", [
        (1, "debe",  "1.1.20"), (2, "haber", "4.1.01")]),
    ("recurso.cobrado", "Cobro de tributo: Recaudación a depositar a Deudores", [
        (1, "debe",  "1.1.03"), (2, "haber", "1.1.20")]),
    ("retencion.practicada", "Retención practicada: Proveedores a Fondos de terceros", [
        (1, "debe",  "2.1.01"), (2, "haber", "2.2.01")]),
]


def _seed_reglas(db):
    for tipo, desc, lineas in REGLAS:
        if db.query(ReglaImputacion).filter(ReglaImputacion.tipo == tipo).first():
            continue
        r = ReglaImputacion(tipo=tipo, descripcion=desc, activo=True)
        db.add(r); db.flush()
        for orden, lado, codigo in lineas:
            db.add(ReglaLinea(id_regla=r.id, orden=orden, lado=lado, origen_cuenta="fija",
                              cuenta_codigo=codigo, importe_campo="importe"))


def run():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        codigo_a_id = {}
        # Primera pasada: crear/obtener; resolvemos padres por código
        # Iteramos en orden (padres antes que hijos por el orden de PLAN)
        for codigo, nombre, tipo, imputable, cod_padre, nivel in PLAN:
            c = db.query(PlanCuenta).filter(PlanCuenta.codigo == codigo).first()
            id_padre = codigo_a_id.get(cod_padre) if cod_padre else None
            if not c:
                c = PlanCuenta(codigo=codigo, nombre=nombre, tipo=tipo, imputable=imputable,
                               id_padre=id_padre, nivel=nivel, activo=True)
                db.add(c); db.flush()
            else:
                # mantener jerarquía coherente sin pisar datos manuales
                if c.id_padre is None and id_padre is not None:
                    c.id_padre = id_padre
            codigo_a_id[codigo] = c.id

        # Ejercicio 2026 abierto
        if not db.query(EjercicioContable).filter(EjercicioContable.anio == 2026).first():
            db.add(EjercicioContable(anio=2026, estado="abierto", fecha_apertura=date(2026, 1, 1)))

        _seed_reglas(db)
        db.commit()
        print("Seed contabilidad OK: plan de cuentas + ejercicio 2026 + reglas de imputación base")
    finally:
        db.close()


if __name__ == "__main__":
    run()
