"""Tests para routers.egresos._saldo_cuenta.

Regla de negocio: saldo = saldo_inicial + depositos(activos) - egresos(activos),
filtrando por cuenta bancaria y respetando el soft-delete (activo == True).
"""
from decimal import Decimal

from models.egresos import CuentaBancaria, Egreso, DepositoBancario
from routers.egresos import _saldo_cuenta


def _cuenta(db, saldo_inicial="1000.00"):
    c = CuentaBancaria(banco="Nacion", numero="123", saldo_inicial=Decimal(saldo_inicial), activo=True)
    db.add(c)
    db.commit()
    return c


def _egreso(db, id_cuenta, importe, activo=True):
    e = Egreso(id_orden_pago=1, medio="transferencia", id_cuenta_bancaria=id_cuenta,
               importe=Decimal(str(importe)), activo=activo)
    db.add(e)
    db.commit()
    return e


def _deposito(db, id_cuenta, importe, activo=True):
    d = DepositoBancario(id_cuenta_bancaria=id_cuenta, importe=Decimal(str(importe)), activo=activo)
    db.add(d)
    db.commit()
    return d


def test_saldo_solo_inicial(db):
    c = _cuenta(db, "500.00")
    assert _saldo_cuenta(db, c.id, c.saldo_inicial) == Decimal("500.00")


def test_saldo_con_depositos_y_egresos(db):
    c = _cuenta(db, "1000.00")
    _deposito(db, c.id, "300.00")
    _deposito(db, c.id, "200.50")
    _egreso(db, c.id, "150.50")
    # 1000 + 300 + 200.50 - 150.50 = 1350.00
    assert _saldo_cuenta(db, c.id, c.saldo_inicial) == Decimal("1350.00")


def test_saldo_ignora_egresos_inactivos(db):
    c = _cuenta(db, "1000.00")
    _egreso(db, c.id, "100.00", activo=True)
    _egreso(db, c.id, "999.00", activo=False)   # soft-deleted: no cuenta
    assert _saldo_cuenta(db, c.id, c.saldo_inicial) == Decimal("900.00")


def test_saldo_ignora_depositos_inactivos(db):
    c = _cuenta(db, "1000.00")
    _deposito(db, c.id, "50.00", activo=True)
    _deposito(db, c.id, "777.00", activo=False)  # soft-deleted: no cuenta
    assert _saldo_cuenta(db, c.id, c.saldo_inicial) == Decimal("1050.00")


def test_saldo_aisla_por_cuenta(db):
    c1 = _cuenta(db, "1000.00")
    c2 = _cuenta(db, "2000.00")
    _egreso(db, c1.id, "100.00")
    _deposito(db, c2.id, "500.00")
    # movimientos de c2 no afectan a c1 y viceversa
    assert _saldo_cuenta(db, c1.id, c1.saldo_inicial) == Decimal("900.00")
    assert _saldo_cuenta(db, c2.id, c2.saldo_inicial) == Decimal("2500.00")


def test_saldo_negativo_posible(db):
    c = _cuenta(db, "100.00")
    _egreso(db, c.id, "250.00")
    assert _saldo_cuenta(db, c.id, c.saldo_inicial) == Decimal("-150.00")
