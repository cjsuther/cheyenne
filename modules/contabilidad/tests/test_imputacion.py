"""Tests del motor de imputacion contable y del constructor de asientos.

Las funciones bajo prueba reciben una `Session` de SQLAlchemy (fixture `db`, SQLite
en memoria), asi que sembramos datos con los modelos ORM y afirmamos resultados,
sin pasar por HTTP/FastAPI/auth.
"""
import json
from datetime import date
from decimal import Decimal

from conftest import imputar, _crear_asiento

from models.contabilidad import PlanCuenta, EjercicioContable, Asiento, AsientoItem
from models.transacciones import (
    Transaccion, ReglaImputacion, ReglaLinea, MapeoCuenta,
)


# ── helpers de siembra ──────────────────────────────────────────────────
def _cuenta(db, codigo, nombre="c", tipo="gasto", imputable=True):
    c = PlanCuenta(codigo=codigo, nombre=nombre, tipo=tipo, imputable=imputable, nivel=3, activo=True)
    db.add(c)
    db.flush()
    return c


def _ejercicio(db, anio, estado="abierto"):
    e = EjercicioContable(anio=anio, estado=estado)
    db.add(e)
    db.flush()
    return e


def _regla(db, tipo, descripcion="r"):
    r = ReglaImputacion(tipo=tipo, descripcion=descripcion, activo=True)
    db.add(r)
    db.flush()
    return r


def _linea(db, id_regla, orden, lado, cuenta_codigo=None, origen_cuenta="fija",
           dimension=None, importe_campo="importe", detalle=None):
    ln = ReglaLinea(
        id_regla=id_regla, orden=orden, lado=lado, origen_cuenta=origen_cuenta,
        cuenta_codigo=cuenta_codigo, dimension=dimension, importe_campo=importe_campo,
        detalle=detalle,
    )
    db.add(ln)
    db.flush()
    return ln


def _mapeo(db, dimension, clave, cuenta_codigo, activo=True):
    m = MapeoCuenta(dimension=dimension, clave=clave, cuenta_codigo=cuenta_codigo, activo=activo)
    db.add(m)
    db.flush()
    return m


def _tx(db, tipo, importe, contexto=None, fecha=date(2026, 6, 1),
        origen_modulo="tesoreria", origen_ref="ref-1", concepto="pago"):
    t = Transaccion(
        origen_modulo=origen_modulo, origen_ref=origen_ref, tipo=tipo, fecha=fecha,
        importe=Decimal(str(importe)), concepto=concepto,
        contexto=json.dumps(contexto) if contexto is not None else None,
        estado="sin_regla", creado_por="tester",
    )
    db.add(t)
    db.flush()
    return t


def _regla_fija_balanceada(db, tipo):
    """Regla de 2 lineas fijas: debe cta 5.1.01 / haber cta 1.1.01, ambas por 'importe'."""
    _cuenta(db, "5.1.01", "Gasto", "gasto")
    _cuenta(db, "1.1.01", "Caja", "activo")
    r = _regla(db, tipo)
    _linea(db, r.id, 1, "debe", cuenta_codigo="5.1.01")
    _linea(db, r.id, 2, "haber", cuenta_codigo="1.1.01")
    return r


# ═══ imputar() ═══════════════════════════════════════════════════════════
def test_a_regla_fija_imputa_y_balancea(db):
    _ejercicio(db, 2026)
    _regla_fija_balanceada(db, "gasto.pagado")
    tx = _tx(db, "gasto.pagado", 1000)

    imputar(db, tx, "tester")

    assert tx.estado == "imputada"
    assert tx.motivo is None
    assert tx.id_asiento is not None

    a = db.query(Asiento).filter(Asiento.id == tx.id_asiento).first()
    assert a is not None
    assert a.estado == "confirmado"
    assert a.tipo == "automatico"
    assert a.anio == 2026
    assert a.total_debe == Decimal("1000.00")
    assert a.total_haber == Decimal("1000.00")

    items = db.query(AsientoItem).filter(AsientoItem.id_asiento == a.id).order_by(AsientoItem.id).all()
    assert len(items) == 2
    total_debe = sum(i.debe for i in items)
    total_haber = sum(i.haber for i in items)
    assert total_debe == total_haber == Decimal("1000.00")
    # la cuenta del debe es la del gasto (5.1.01)
    cta_debe = db.query(PlanCuenta).filter(PlanCuenta.id == items[0].id_cuenta).first()
    assert cta_debe.codigo == "5.1.01"


def test_b_tipo_sin_regla(db):
    _ejercicio(db, 2026)
    tx = _tx(db, "tipo.inexistente", 500)

    imputar(db, tx, "tester")

    assert tx.estado == "sin_regla"
    assert tx.id_asiento is None
    assert "regla de imputaci" in tx.motivo.lower()


def test_c_derivada_sin_mapeo_error(db):
    _ejercicio(db, 2026)
    _cuenta(db, "1.1.01", "Caja", "activo")
    r = _regla(db, "gasto.devengado")
    # linea debe: cuenta derivada por dimension 'objeto_gasto', pero NO cargamos el mapeo
    _linea(db, r.id, 1, "debe", origen_cuenta="derivada", dimension="objeto_gasto")
    _linea(db, r.id, 2, "haber", cuenta_codigo="1.1.01")
    tx = _tx(db, "gasto.devengado", 800, contexto={"objeto_gasto": "3.4.2"})

    imputar(db, tx, "tester")

    assert tx.estado == "error"
    assert tx.id_asiento is None
    assert "mapeo" in tx.motivo.lower()


def test_d_derivada_con_mapeo_usa_cuenta_mapeada(db):
    _ejercicio(db, 2026)
    _cuenta(db, "1.1.01", "Caja", "activo")
    _cuenta(db, "5.1.04", "Servicios", "gasto")
    _mapeo(db, "objeto_gasto", "3.4.2", "5.1.04")
    r = _regla(db, "gasto.devengado")
    _linea(db, r.id, 1, "debe", origen_cuenta="derivada", dimension="objeto_gasto")
    _linea(db, r.id, 2, "haber", cuenta_codigo="1.1.01")
    tx = _tx(db, "gasto.devengado", 800, contexto={"objeto_gasto": "3.4.2"})

    imputar(db, tx, "tester")

    assert tx.estado == "imputada"
    assert tx.id_asiento is not None
    items = db.query(AsientoItem).filter(AsientoItem.id_asiento == tx.id_asiento).order_by(AsientoItem.id).all()
    cta_debe = db.query(PlanCuenta).filter(PlanCuenta.id == items[0].id_cuenta).first()
    # la linea del debe debe haber quedado imputada a la cuenta mapeada 5.1.04
    assert cta_debe.codigo == "5.1.04"
    assert items[0].debe == Decimal("800.00")


def test_derivada_falta_dimension_en_contexto(db):
    _ejercicio(db, 2026)
    _cuenta(db, "1.1.01", "Caja", "activo")
    r = _regla(db, "gasto.devengado")
    _linea(db, r.id, 1, "debe", origen_cuenta="derivada", dimension="objeto_gasto")
    _linea(db, r.id, 2, "haber", cuenta_codigo="1.1.01")
    # contexto vacio: falta 'objeto_gasto'
    tx = _tx(db, "gasto.devengado", 800, contexto={})

    imputar(db, tx, "tester")

    assert tx.estado == "error"
    assert tx.id_asiento is None
    assert "dimensi" in tx.motivo.lower()


def test_importe_campo_del_contexto(db):
    """Una linea con importe_campo distinto de 'importe' toma el valor del contexto."""
    _ejercicio(db, 2026)
    _cuenta(db, "5.1.01", "Gasto", "gasto")
    _cuenta(db, "1.1.01", "Caja", "activo")
    r = _regla(db, "gasto.iva")
    _linea(db, r.id, 1, "debe", cuenta_codigo="5.1.01", importe_campo="neto")
    _linea(db, r.id, 2, "haber", cuenta_codigo="1.1.01", importe_campo="neto")
    tx = _tx(db, "gasto.iva", 1000, contexto={"neto": 250})

    imputar(db, tx, "tester")

    assert tx.estado == "imputada"
    a = db.query(Asiento).filter(Asiento.id == tx.id_asiento).first()
    # toma 250 (del contexto), no 1000 (importe de la tx)
    assert a.total_debe == Decimal("250.00")
    assert a.total_haber == Decimal("250.00")


def test_importe_campo_faltante_error(db):
    _ejercicio(db, 2026)
    _cuenta(db, "5.1.01", "Gasto", "gasto")
    _cuenta(db, "1.1.01", "Caja", "activo")
    r = _regla(db, "gasto.iva")
    _linea(db, r.id, 1, "debe", cuenta_codigo="5.1.01", importe_campo="neto")
    _linea(db, r.id, 2, "haber", cuenta_codigo="1.1.01", importe_campo="neto")
    tx = _tx(db, "gasto.iva", 1000, contexto={})  # falta 'neto'

    imputar(db, tx, "tester")

    assert tx.estado == "error"
    assert tx.id_asiento is None
    assert "campo de importe" in tx.motivo.lower()


def test_regla_sin_lineas_error(db):
    _ejercicio(db, 2026)
    _regla(db, "gasto.vacio")  # regla sin lineas
    tx = _tx(db, "gasto.vacio", 100)

    imputar(db, tx, "tester")

    assert tx.estado == "error"
    assert tx.id_asiento is None
    assert "líneas" in tx.motivo.lower() or "lineas" in tx.motivo.lower()


def test_no_balancea_marca_error(db):
    """Regla con debe != haber (dos lineas al debe): _crear_asiento rechaza -> tx.error."""
    _ejercicio(db, 2026)
    _cuenta(db, "5.1.01", "Gasto", "gasto")
    _cuenta(db, "5.1.02", "OtroGasto", "gasto")
    r = _regla(db, "gasto.desbalanceado")
    _linea(db, r.id, 1, "debe", cuenta_codigo="5.1.01")
    _linea(db, r.id, 2, "debe", cuenta_codigo="5.1.02")
    tx = _tx(db, "gasto.desbalanceado", 100)

    imputar(db, tx, "tester")

    assert tx.estado == "error"
    assert tx.id_asiento is None
    assert "balancea" in tx.motivo.lower()


def test_ejercicio_cerrado_bloquea(db):
    _ejercicio(db, 2026, estado="cerrado")
    _regla_fija_balanceada(db, "gasto.pagado")
    tx = _tx(db, "gasto.pagado", 1000)

    imputar(db, tx, "tester")

    assert tx.estado == "error"
    assert tx.id_asiento is None
    assert "cerrado" in tx.motivo.lower()


# ═══ _crear_asiento() ════════════════════════════════════════════════════
def test_crear_asiento_rechaza_desbalanceado(db):
    lineas = [
        {"cuenta_codigo": "5.1.01", "debe": 100, "haber": 0, "detalle": None},
        {"cuenta_codigo": "1.1.01", "debe": 0, "haber": 90, "detalle": None},
    ]
    asiento, err = _crear_asiento(
        db, 2026, date(2026, 6, 1), "test", "manual", "test", "ref", lineas, "tester")

    assert asiento is None
    assert err is not None
    assert "balancea" in err.lower()


def test_crear_asiento_crea_cuenta_placeholder(db):
    """Si un codigo no existe en el plan, _crear_asiento lo crea imputable placeholder."""
    assert db.query(PlanCuenta).filter(PlanCuenta.codigo == "9.9.99").first() is None
    lineas = [
        {"cuenta_codigo": "9.9.99", "debe": 500, "haber": 0, "detalle": "d"},
        {"cuenta_codigo": "8.8.88", "debe": 0, "haber": 500, "detalle": "h"},
    ]
    asiento, err = _crear_asiento(
        db, 2026, date(2026, 6, 1), "test", "manual", "test", "ref", lineas, "tester")

    assert err is None
    assert asiento is not None
    nueva = db.query(PlanCuenta).filter(PlanCuenta.codigo == "9.9.99").first()
    assert nueva is not None
    assert nueva.imputable is True
    assert nueva.nombre.startswith("(auto)")
    otra = db.query(PlanCuenta).filter(PlanCuenta.codigo == "8.8.88").first()
    assert otra is not None


def test_crear_asiento_balanceado_numera_correlativo(db):
    _cuenta(db, "5.1.01", "Gasto", "gasto")
    _cuenta(db, "1.1.01", "Caja", "activo")
    lineas = [
        {"cuenta_codigo": "5.1.01", "debe": 300, "haber": 0, "detalle": None},
        {"cuenta_codigo": "1.1.01", "debe": 0, "haber": 300, "detalle": None},
    ]
    a1, err1 = _crear_asiento(db, 2026, date(2026, 6, 1), "t1", "manual", "m", "r1", lineas, "tester")
    a2, err2 = _crear_asiento(db, 2026, date(2026, 6, 2), "t2", "manual", "m", "r2", lineas, "tester")

    assert err1 is None and err2 is None
    assert a1.numero == 1
    assert a2.numero == 2  # correlativo dentro del anio
    assert a1.total_debe == a1.total_haber == Decimal("300.00")


def test_crear_asiento_rechaza_negativos(db):
    lineas = [
        {"cuenta_codigo": "5.1.01", "debe": -100, "haber": 0, "detalle": None},
        {"cuenta_codigo": "1.1.01", "debe": 0, "haber": -100, "detalle": None},
    ]
    asiento, err = _crear_asiento(
        db, 2026, date(2026, 6, 1), "t", "manual", "m", "r", lineas, "tester")

    assert asiento is None
    assert err is not None
    assert "negativ" in err.lower()
