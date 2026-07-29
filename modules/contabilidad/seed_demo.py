"""Siembra de DEMO (ejercicio 2026) para el módulo Contabilidad.

Genera ~25 transacciones económicas realistas de una municipalidad y las imputa
usando EXACTAMENTE el mismo motor que el router (reglas_imputacion + plan_cuentas
existentes), produciendo asientos BALANCEADOS en los 4 libros RAFAM
(patrimonial / presupuestaria / financiera / orden). Deja algunas transacciones de
tipo desconocido en estado 'sin_regla' para poblar la worklist "definir asiento".

Idempotente: se detecta por el prefijo 'DEMO-' en Transaccion.origen_ref.
Ejecutar: docker compose exec contabilidad python seed_demo.py
"""
import sys, os
from datetime import date
from decimal import Decimal

sys.path.insert(0, os.path.dirname(__file__))
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from shared.database import Base
from database import engine, SessionLocal
from models.contabilidad import PlanCuenta, EjercicioContable, Asiento, AsientoItem
from models.transacciones import Transaccion, ReglaImputacion, ReglaLinea, MapeoCuenta
import models  # noqa: F401

# Reutilizamos el motor de imputación TAL CUAL lo usa el endpoint, para que los
# asientos de la demo se armen igual que en producción.
from routers.transacciones import imputar

PREFIJO = "DEMO-"
CREADO_POR = "seed_demo"


def _dec(v):
    return Decimal(str(v)).quantize(Decimal("0.01"))


# ── Transacciones con REGLA (tipos que ya existen en reglas_imputacion) ──────
# (origen_modulo, tipo, dia, importe, concepto, contexto)
# Los tipos coinciden con las REGLAS base sembradas en seed.py; todas las líneas
# de esas reglas son de cuenta FIJA, así que no requieren contexto.
TX_CON_REGLA = [
    ("tesoreria",         "gasto.devengado",       3,  1_450_000.00, "Devengado OP combustibles flota municipal"),
    ("tesoreria",         "gasto.devengado",      12,   890_500.50, "Devengado OP insumos de limpieza"),
    ("tesoreria",         "gasto.devengado",      21, 3_200_000.00, "Devengado OP servicio de recolección"),
    ("tesoreria",         "gasto.devengado",      28,   475_800.00, "Devengado OP papelería y librería"),
    ("tesoreria",         "gasto.pagado",          8,  1_450_000.00, "Pago OP combustibles flota municipal"),
    ("tesoreria",         "gasto.pagado",         18,   890_500.50, "Pago OP insumos de limpieza"),
    ("tesoreria",         "gasto.pagado",         25, 3_200_000.00, "Pago OP servicio de recolección"),
    ("ingresos_publicos", "recurso.emitido",       2, 12_800_000.00, "Emisión anual Tasa General TSG cuota 04"),
    ("ingresos_publicos", "recurso.emitido",       2,  4_600_000.00, "Emisión Tasa Seguridad e Higiene TSH"),
    ("ingresos_publicos", "recurso.emitido",       5,  2_350_000.00, "Emisión Patente Automotor cuota 04"),
    ("tesoreria",         "recurso.cobrado",       9,  6_420_000.00, "Recaudación tributaria del día - caja"),
    ("tesoreria",         "recurso.cobrado",      16,  3_180_500.00, "Recaudación tributaria del día - caja"),
    ("tesoreria",         "recurso.cobrado",      23,  5_940_000.00, "Recaudación tributaria del día - caja"),
    ("tesoreria",         "retencion.practicada",  8,   217_500.00, "Retención Ganancias s/ pago proveedor"),
    ("tesoreria",         "retencion.practicada", 18,   133_575.00, "Retención IIBB s/ pago proveedor"),
    ("ingresos_publicos", "cementerio.liquidada",  4,   680_000.00, "Liquidación tasas de cementerio periodo 04"),
    ("tesoreria",         "cementerio.cobrada",   14,   420_000.00, "Cobro tasas de cementerio"),
    ("ingresos_publicos", "apremios.iniciado",     6, 1_950_000.00, "Inicio de apremio judicial deudores TSG"),
    ("tesoreria",         "apremios.cobrado",     20,   780_000.00, "Cobro judicial por apremio"),
    ("administracion",    "patrimonio.alta",       7, 8_500_000.00, "Alta patrimonial: retroexcavadora municipal"),
    ("administracion",    "patrimonio.alta",      15, 1_320_000.00, "Alta patrimonial: equipamiento informático"),
    ("administracion",    "patrimonio.amortizacion", 30, 425_000.00, "Amortización mensual bienes de uso"),
    ("tesoreria",         "credito.desembolso",   10, 25_000_000.00, "Desembolso empréstito obra pavimentación"),
    ("tesoreria",         "credito.pago_capital",  24, 1_250_000.00, "Amortización cuota empréstito"),
    ("tesoreria",         "credito.pago_interes",  24,   680_000.00, "Pago intereses empréstito"),
]

# ── Transacciones de tipo DESCONOCIDO -> quedan en 'sin_regla' (worklist) ────
TX_SIN_REGLA = [
    ("rrhh",           "nomina.liquidada",        27, 18_400_000.00, "Liquidación de haberes personal municipal 04/2026"),
    ("compras",        "orden_compra.emitida",    11,  2_900_000.00, "Orden de compra maquinaria vial"),
    ("obras_publicas", "certificado.obra",        19,  7_150_000.00, "Certificado de obra Nº3 pavimentación"),
    ("legales",        "sentencia.judicial",      22,  1_680_000.00, "Provisión por sentencia judicial en contra"),
]


def _ya_sembrado(db):
    return db.query(Transaccion).filter(
        Transaccion.origen_ref.like(f"{PREFIJO}%")).count() > 0


def seed():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    if _ya_sembrado(db):
        print("seed_demo contabilidad: ya sembrado, omito")
        db.close()
        return

    # Anchor: ejercicio 2026 abierto (debería existir por seed.py). Si falta, lo creo.
    ej = db.query(EjercicioContable).filter(EjercicioContable.anio == 2026).first()
    if not ej:
        db.add(EjercicioContable(anio=2026, estado="abierto", fecha_apertura=date(2026, 1, 1)))
        db.commit()
        print("seed_demo contabilidad: ejercicio 2026 no existía, creado")

    n_reglas = db.query(ReglaImputacion).filter(ReglaImputacion.activo == True).count()
    n_plan = db.query(PlanCuenta).count()
    print(f"seed_demo contabilidad: anchors -> {n_reglas} reglas activas, {n_plan} cuentas en el plan")

    n_tx_imputadas = n_tx_sin_regla = n_tx_error = 0
    n_asientos = n_items = 0

    def _contar_asientos(tx):
        nonlocal n_asientos, n_items
        if not tx.id_asiento:
            return
        asientos = db.query(Asiento).filter(
            Asiento.origen_modulo == tx.origen_modulo,
            Asiento.origen_ref.like(f"tx-{tx.id}-%")).all()
        n_asientos += len(asientos)
        for a in asientos:
            n_items += db.query(AsientoItem).filter(AsientoItem.id_asiento == a.id).count()

    # ── Transacciones CON regla: se imputan y generan asientos balanceados ──
    for i, (mod, tipo, dia, importe, concepto) in enumerate(TX_CON_REGLA, start=1):
        origen_ref = f"{PREFIJO}{tipo}-{i:03d}"
        try:
            if db.query(Transaccion).filter(
                    Transaccion.origen_modulo == mod,
                    Transaccion.origen_ref == origen_ref).first():
                continue
            tx = Transaccion(
                origen_modulo=mod, origen_ref=origen_ref, tipo=tipo,
                fecha=date(2026, 4, dia), importe=_dec(importe), concepto=concepto,
                contexto="{}", creado_por=CREADO_POR)
            db.add(tx)
            db.flush()
            imputar(db, tx, CREADO_POR)   # motor real: arma asientos por libro
            db.flush()
            if tx.estado == "imputada":
                n_tx_imputadas += 1
                _contar_asientos(tx)
            elif tx.estado == "sin_regla":
                n_tx_sin_regla += 1
            else:
                n_tx_error += 1
                print(f"  aviso: tx {origen_ref} quedó en '{tx.estado}': {tx.motivo}")
            db.commit()
        except Exception as e:
            db.rollback()
            print(f"  ERROR imputando {origen_ref}: {e}")

    # ── Transacciones SIN regla: quedan en la worklist "definir asiento" ────
    for i, (mod, tipo, dia, importe, concepto) in enumerate(TX_SIN_REGLA, start=1):
        origen_ref = f"{PREFIJO}{tipo}-{i:03d}"
        try:
            if db.query(Transaccion).filter(
                    Transaccion.origen_modulo == mod,
                    Transaccion.origen_ref == origen_ref).first():
                continue
            tx = Transaccion(
                origen_modulo=mod, origen_ref=origen_ref, tipo=tipo,
                fecha=date(2026, 4, dia), importe=_dec(importe), concepto=concepto,
                contexto="{}", creado_por=CREADO_POR)
            db.add(tx)
            db.flush()
            imputar(db, tx, CREADO_POR)   # sin regla -> tx.estado = 'sin_regla'
            db.flush()
            if tx.estado == "sin_regla":
                n_tx_sin_regla += 1
            elif tx.estado == "imputada":
                n_tx_imputadas += 1
                _contar_asientos(tx)
            else:
                n_tx_error += 1
            db.commit()
        except Exception as e:
            db.rollback()
            print(f"  ERROR sembrando {origen_ref}: {e}")

    db.close()
    print(
        f"seed_demo contabilidad: +{n_tx_imputadas} tx imputadas, "
        f"+{n_tx_sin_regla} tx sin_regla (worklist), +{n_tx_error} tx en error, "
        f"+{n_asientos} asientos, +{n_items} asiento_items"
    )


if __name__ == "__main__":
    seed()
