"""Tests para routers.banca.auto_conciliar.

Regla de negocio: cada movimiento DEBITO del extracto (importe negativo) se casa
1 a 1 con un Egreso NO conciliado de la misma cuenta cuyo importe coincide en valor
absoluto y cuya fecha esta cercana (+-5 dias). Los creditos (importe >= 0) no casan.

Se invoca la funcion real del router pasando `db` y un usuario superuser
(esquiva la auth por permisos), evitando FastAPI/TestClient.
"""
from datetime import datetime, date, timezone
from decimal import Decimal

from models.egresos import CuentaBancaria, Egreso
from models.banca import ExtractoBancario, ExtractoMovimiento
from routers.banca import auto_conciliar

SUPER = {"superuser": True, "nombre_apellido": "tester"}


def _cuenta(db):
    c = CuentaBancaria(banco="Nacion", numero="1", saldo_inicial=Decimal("0"), activo=True)
    db.add(c)
    db.commit()
    return c


def _egreso(db, cuenta, importe, fecha):
    e = Egreso(id_orden_pago=1, medio="transferencia", id_cuenta_bancaria=cuenta.id,
               importe=Decimal(str(importe)),
               fecha=datetime(fecha.year, fecha.month, fecha.day, tzinfo=timezone.utc),
               activo=True)
    db.add(e)
    db.commit()
    return e


def _extracto(db, cuenta):
    ex = ExtractoBancario(id_cuenta_bancaria=cuenta.id, periodo="2026-06",
                          saldo_inicial=Decimal("0"), saldo_final=Decimal("0"), activo=True)
    db.add(ex)
    db.commit()
    return ex


def _mov(db, extracto, importe, fecha):
    m = ExtractoMovimiento(id_extracto=extracto.id, fecha=fecha,
                           importe=Decimal(str(importe)), conciliado=False, activo=True)
    db.add(m)
    db.commit()
    return m


def test_casa_debito_con_egreso_mismo_importe_y_fecha(db):
    c = _cuenta(db)
    ex = _extracto(db, c)
    e = _egreso(db, c, "500.00", date(2026, 6, 10))
    m = _mov(db, ex, "-500.00", date(2026, 6, 12))   # debito, 2 dias -> dentro de +-5
    res = auto_conciliar(ex.id, db=db, current_user=SUPER)
    assert res["conciliados"] == 1
    db.refresh(m)
    assert m.conciliado is True
    assert m.id_egreso == e.id


def test_no_casa_si_fecha_lejana(db):
    c = _cuenta(db)
    ex = _extracto(db, c)
    _egreso(db, c, "500.00", date(2026, 6, 1))
    m = _mov(db, ex, "-500.00", date(2026, 6, 20))   # 19 dias -> fuera de +-5
    res = auto_conciliar(ex.id, db=db, current_user=SUPER)
    assert res["conciliados"] == 0
    db.refresh(m)
    assert m.conciliado is False
    assert m.id_egreso is None


def test_no_casa_si_importe_difiere(db):
    c = _cuenta(db)
    ex = _extracto(db, c)
    _egreso(db, c, "500.00", date(2026, 6, 10))
    m = _mov(db, ex, "-499.99", date(2026, 6, 10))   # importe distinto
    res = auto_conciliar(ex.id, db=db, current_user=SUPER)
    assert res["conciliados"] == 0
    db.refresh(m)
    assert m.conciliado is False


def test_creditos_no_casan(db):
    c = _cuenta(db)
    ex = _extracto(db, c)
    _egreso(db, c, "500.00", date(2026, 6, 10))
    m = _mov(db, ex, "500.00", date(2026, 6, 10))    # credito (positivo)
    res = auto_conciliar(ex.id, db=db, current_user=SUPER)
    assert res["conciliados"] == 0
    db.refresh(m)
    assert m.conciliado is False


def test_matcheo_uno_a_uno_no_reutiliza_egreso(db):
    c = _cuenta(db)
    ex = _extracto(db, c)
    # un solo egreso de 500 para dos debitos de -500: solo uno debe casar
    _egreso(db, c, "500.00", date(2026, 6, 10))
    _mov(db, ex, "-500.00", date(2026, 6, 10))
    _mov(db, ex, "-500.00", date(2026, 6, 11))
    res = auto_conciliar(ex.id, db=db, current_user=SUPER)
    assert res["conciliados"] == 1
    assert res["movimientos_pendientes"] == 1
    assert res["egresos_sin_casar"] == 0


def test_egreso_ya_conciliado_no_se_reusa(db):
    c = _cuenta(db)
    ex = _extracto(db, c)
    e = _egreso(db, c, "500.00", date(2026, 6, 10))
    # un movimiento previo (de cualquier extracto de la cuenta) ya tomo ese egreso
    m_prev = ExtractoMovimiento(id_extracto=ex.id, fecha=date(2026, 6, 10),
                                importe=Decimal("-500.00"), conciliado=True,
                                id_egreso=e.id, activo=True)
    db.add(m_prev)
    db.commit()
    m_nuevo = _mov(db, ex, "-500.00", date(2026, 6, 10))
    res = auto_conciliar(ex.id, db=db, current_user=SUPER)
    assert res["conciliados"] == 0
    db.refresh(m_nuevo)
    assert m_nuevo.conciliado is False


def test_solo_egresos_de_la_cuenta_del_extracto(db):
    c1 = _cuenta(db)
    c2 = _cuenta(db)
    ex = _extracto(db, c1)
    _egreso(db, c2, "500.00", date(2026, 6, 10))   # egreso de OTRA cuenta
    m = _mov(db, ex, "-500.00", date(2026, 6, 10))
    res = auto_conciliar(ex.id, db=db, current_user=SUPER)
    assert res["conciliados"] == 0
    db.refresh(m)
    assert m.conciliado is False
