"""Siembra idempotente del plan de cuentas base y el ejercicio 2026 abierto."""
import sys, os
from datetime import date

sys.path.insert(0, os.path.dirname(__file__))
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from shared.database import Base
from database import engine, SessionLocal
from models.contabilidad import PlanCuenta, EjercicioContable
from models.transacciones import ReglaImputacion, ReglaLinea, MapeoCuenta
import models  # noqa: F401


# (codigo, nombre, tipo, imputable, codigo_padre, nivel) — plan de cuentas municipal base
PLAN = [
    # ── ACTIVO ────────────────────────────────────────────────────────
    ("1",      "Activo",                         "activo",      False, None,  1),
    ("1.1",    "Activo corriente",               "activo",      False, "1",   2),
    ("1.1.01", "Banco cuenta corriente",         "activo",      True,  "1.1", 3),
    ("1.1.02", "Caja",                           "activo",      True,  "1.1", 3),
    ("1.1.03", "Recaudación a depositar",        "activo",      True,  "1.1", 3),
    ("1.1.04", "Fondos fijos",                   "activo",      True,  "1.1", 3),
    ("1.1.05", "Banco cuentas especiales",       "activo",      True,  "1.1", 3),
    ("1.1.06", "Inversiones / plazos fijos",     "activo",      True,  "1.1", 3),
    ("1.1.20", "Deudores por tributos",          "activo",      True,  "1.1", 3),
    ("1.1.21", "Deudores en gestión judicial",   "activo",      True,  "1.1", 3),
    ("1.1.22", "Deudores por planes de pago",    "activo",      True,  "1.1", 3),
    ("1.2",    "Activo no corriente",            "activo",      False, "1",   2),
    ("1.2.01", "Bienes de uso",                  "activo",      True,  "1.2", 3),
    ("1.2.02", "Bienes de dominio público",      "activo",      True,  "1.2", 3),
    # ── PASIVO ────────────────────────────────────────────────────────
    ("2",      "Pasivo",                         "pasivo",      False, None,  1),
    ("2.1",    "Pasivo corriente",               "pasivo",      False, "2",   2),
    ("2.1.01", "Proveedores / Deuda a pagar",    "pasivo",      True,  "2.1", 3),
    ("2.1.02", "Sueldos a pagar",                "pasivo",      True,  "2.1", 3),
    ("2.1.03", "Retenciones impositivas a depositar", "pasivo", True,  "2.1", 3),
    ("2.1.04", "Contribuciones patronales a pagar",   "pasivo", True,  "2.1", 3),
    ("2.1.05", "Deuda flotante",                 "pasivo",      True,  "2.1", 3),
    ("2.2",    "Fondos de terceros y garantías", "pasivo",      False, "2",   2),
    ("2.2.01", "Fondos de terceros",             "pasivo",      True,  "2.2", 3),
    ("2.2.02", "Garantías recibidas",            "pasivo",      True,  "2.2", 3),
    ("2.2.03", "Embargos retenidos",             "pasivo",      True,  "2.2", 3),
    ("2.3",    "Pasivo no corriente",            "pasivo",      False, "2",   2),
    ("2.3.01", "Deuda pública / empréstitos",    "pasivo",      True,  "2.3", 3),
    # ── PATRIMONIO ────────────────────────────────────────────────────
    ("3",      "Patrimonio",                     "patrimonio",  False, None,  1),
    ("3.1",    "Patrimonio municipal",           "patrimonio",  False, "3",   2),
    ("3.1.01", "Patrimonio municipal",           "patrimonio",  True,  "3.1", 3),
    ("3.9",    "Resultados",                     "patrimonio",  False, "3",   2),
    ("3.9.99", "Resultado del ejercicio",        "patrimonio",  True,  "3.9", 3),
    # ── RECURSOS ── (4.1.01 se mantiene genérico: lo usan las reglas base) ──
    ("4",      "Recursos",                       "recurso",     False, None,  1),
    ("4.1",    "Recursos corrientes",            "recurso",     False, "4",   2),
    ("4.1.01", "Recursos tributarios",           "recurso",     True,  "4.1", 3),
    ("4.1.02", "Tasa general (TSG)",             "recurso",     True,  "4.1", 3),
    ("4.1.03", "Tasa de seguridad e higiene",    "recurso",     True,  "4.1", 3),
    ("4.1.04", "Patente automotor",              "recurso",     True,  "4.1", 3),
    ("4.1.05", "Tasas de cementerio",            "recurso",     True,  "4.1", 3),
    ("4.1.06", "Contribución por mejoras",       "recurso",     True,  "4.1", 3),
    ("4.1.07", "Derechos de construcción",       "recurso",     True,  "4.1", 3),
    ("4.1.08", "Multas y recargos",              "recurso",     True,  "4.1", 3),
    ("4.1.09", "Otros recursos corrientes",      "recurso",     True,  "4.1", 3),
    ("4.2",    "Recursos de capital",            "recurso",     False, "4",   2),
    ("4.2.01", "Recursos de capital",            "recurso",     True,  "4.2", 3),
    ("4.3",    "Coparticipación y transferencias","recurso",    False, "4",   2),
    ("4.3.01", "Coparticipación provincial",     "recurso",     True,  "4.3", 3),
    # ── GASTOS ── (5.1.01 se mantiene genérico: lo usan las reglas base) ──
    ("5",      "Gastos",                         "gasto",       False, None,  1),
    ("5.1",    "Gastos corrientes",              "gasto",       False, "5",   2),
    ("5.1.01", "Gastos de funcionamiento",       "gasto",       True,  "5.1", 3),
    ("5.1.02", "Gastos en personal",             "gasto",       True,  "5.1", 3),
    ("5.1.03", "Bienes de consumo",              "gasto",       True,  "5.1", 3),
    ("5.1.04", "Servicios no personales",        "gasto",       True,  "5.1", 3),
    ("5.1.05", "Transferencias",                 "gasto",       True,  "5.1", 3),
    ("5.1.09", "Otros gastos de funcionamiento", "gasto",       True,  "5.1", 3),
    ("5.2",    "Gastos de capital",              "gasto",       False, "5",   2),
    ("5.2.01", "Bienes de capital / obras",      "gasto",       True,  "5.2", 3),
]

# Mapeo de derivación de cuentas: (dimensión, clave) -> código de cuenta.
# Permite que una regla "derivada" impute según el objeto del gasto / tributo.
MAPEOS = [
    ("objeto_gasto", "1", "5.1.02"),   # Personal
    ("objeto_gasto", "2", "5.1.03"),   # Bienes de consumo
    ("objeto_gasto", "3", "5.1.04"),   # Servicios no personales
    ("objeto_gasto", "4", "5.2.01"),   # Bienes de uso / capital
    ("objeto_gasto", "5", "5.1.05"),   # Transferencias
    ("tributo", "TSG", "4.1.02"),
    ("tributo", "TSH", "4.1.03"),
    ("tributo", "AUTO", "4.1.04"),
    ("tributo", "CEM", "4.1.05"),
    ("tributo", "CONST", "4.1.07"),
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
    ("cementerio.liquidada", "Tasa de cementerio liquidada: Deudores a Recurso cementerio", [
        (1, "debe",  "1.1.20"), (2, "haber", "4.1.05")]),
    ("cementerio.cobrada", "Cobro tasa de cementerio: Recaudación a Deudores", [
        (1, "debe",  "1.1.03"), (2, "haber", "1.1.20")]),
    ("apremios.iniciado", "Apremio iniciado: reclasifica a Deudores en gestión judicial", [
        (1, "debe",  "1.1.21"), (2, "haber", "1.1.20")]),
    ("apremios.cobrado", "Cobro judicial (apremio): Recaudación a Deudores judiciales", [
        (1, "debe",  "1.1.03"), (2, "haber", "1.1.21")]),
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
        for dimension, clave, codigo in MAPEOS:
            if not db.query(MapeoCuenta).filter(
                    MapeoCuenta.dimension == dimension, MapeoCuenta.clave == clave).first():
                db.add(MapeoCuenta(dimension=dimension, clave=clave, cuenta_codigo=codigo, activo=True))
        db.commit()
        print("Seed contabilidad OK: plan de cuentas municipal + ejercicio 2026 + reglas + mapeos")
    finally:
        db.close()


if __name__ == "__main__":
    run()
