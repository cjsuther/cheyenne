"""Tests del LEDGER de saldos de partidas (services/saldos.py).

Regla central (§5.3 del diseño / DD-01):
    vigente     = inicial + ajuste + modificacion
    disponible  = vigente - preventivo - comprometido

Los saldos NUNCA se almacenan: se derivan sumando el ledger (Movimiento) por tipo.
Las liberaciones se asientan como importe NEGATIVO del MISMO tipo.
"""
from decimal import Decimal

from models.partida import Partida, Movimiento
from services.saldos import saldos_de_partidas


def D(x):
    return Decimal(str(x))


def _partida(db, anio=2027, credito="1000.00", objeto_gasto=1):
    p = Partida(
        anio=anio, id_jurisdiccion=1, id_estructura=1, id_objeto_gasto=objeto_gasto,
        id_fuente=1, credito_inicial=D(credito), activo=True,
    )
    db.add(p)
    db.flush()
    return p


def _mov(db, id_partida, tipo, importe, activo=True):
    m = Movimiento(id_partida=id_partida, tipo=tipo, importe=D(importe), activo=activo)
    db.add(m)
    db.flush()
    return m


# ------------------------------------------------------------------ base

def test_lista_vacia_devuelve_dict_vacio(db):
    assert saldos_de_partidas(db, []) == {}


def test_partida_sin_movimientos_todo_en_cero(db):
    p = _partida(db)
    s = saldos_de_partidas(db, [p.id])[p.id]
    assert s["vigente"] == D("0")
    assert s["disponible"] == D("0")
    assert s["preventivo"] == D("0")


def test_credito_inicial_es_vigente_y_disponible(db):
    p = _partida(db)
    _mov(db, p.id, "inicial", "1000.00")
    s = saldos_de_partidas(db, [p.id])[p.id]
    assert s["inicial"] == D("1000")
    assert s["vigente"] == D("1000")
    assert s["disponible"] == D("1000")


def test_ajuste_suma_al_inicial(db):
    p = _partida(db)
    _mov(db, p.id, "inicial", "1000.00")
    _mov(db, p.id, "ajuste", "250.00")
    s = saldos_de_partidas(db, [p.id])[p.id]
    assert s["inicial"] == D("1250")
    assert s["vigente"] == D("1250")


# ------------------------------------------------------------------ etapas del gasto

def test_preventivo_reduce_disponible_no_vigente(db):
    p = _partida(db)
    _mov(db, p.id, "inicial", "1000.00")
    _mov(db, p.id, "preventivo", "300.00")
    s = saldos_de_partidas(db, [p.id])[p.id]
    assert s["vigente"] == D("1000")
    assert s["preventivo"] == D("300")
    assert s["disponible"] == D("700")  # 1000 - 300 - 0


def test_compromiso_tambien_reduce_disponible(db):
    p = _partida(db)
    _mov(db, p.id, "inicial", "1000.00")
    _mov(db, p.id, "compromiso", "400.00")
    s = saldos_de_partidas(db, [p.id])[p.id]
    assert s["comprometido"] == D("400")
    assert s["disponible"] == D("600")  # 1000 - 0 - 400


def test_preventivo_y_compromiso_acumulan(db):
    p = _partida(db)
    _mov(db, p.id, "inicial", "1000.00")
    _mov(db, p.id, "preventivo", "300.00")
    _mov(db, p.id, "compromiso", "200.00")
    s = saldos_de_partidas(db, [p.id])[p.id]
    assert s["disponible"] == D("500")  # 1000 - 300 - 200


def test_devengado_y_pagado_no_afectan_disponible(db):
    """Devengar/pagar encadena tras el compromiso: el crédito ya estaba tomado."""
    p = _partida(db)
    _mov(db, p.id, "inicial", "1000.00")
    _mov(db, p.id, "compromiso", "400.00")
    _mov(db, p.id, "devengado", "400.00")
    _mov(db, p.id, "pagado", "400.00")
    s = saldos_de_partidas(db, [p.id])[p.id]
    assert s["devengado"] == D("400")
    assert s["pagado"] == D("400")
    # disponible sólo mira preventivo + comprometido
    assert s["disponible"] == D("600")


# ------------------------------------------------------------------ liberación (RN-11)

def test_liberar_preventivo_restaura_disponible(db):
    """Liberar = contra-movimiento negativo del mismo tipo -> neto vuelve a subir."""
    p = _partida(db)
    _mov(db, p.id, "inicial", "1000.00")
    _mov(db, p.id, "preventivo", "300.00")
    # liberación: mismo tipo, importe negativo
    _mov(db, p.id, "preventivo", "-300.00")
    s = saldos_de_partidas(db, [p.id])[p.id]
    assert s["preventivo"] == D("0")
    assert s["disponible"] == D("1000")


def test_conversion_preventivo_a_compromiso_no_duplica_reserva(db):
    """Al convertir se libera el preventivo (-) y se toma el compromiso (+):
    el disponible neto refleja una sola reserva."""
    p = _partida(db)
    _mov(db, p.id, "inicial", "1000.00")
    _mov(db, p.id, "preventivo", "300.00")     # reserva preventiva
    _mov(db, p.id, "compromiso", "300.00")     # compromiso
    _mov(db, p.id, "preventivo", "-300.00")    # libera el preventivo convertido
    s = saldos_de_partidas(db, [p.id])[p.id]
    assert s["preventivo"] == D("0")
    assert s["comprometido"] == D("300")
    assert s["disponible"] == D("700")  # una sola reserva de 300


# ------------------------------------------------------------------ modificaciones

def test_ampliacion_sube_vigente_y_disponible(db):
    p = _partida(db)
    _mov(db, p.id, "inicial", "1000.00")
    _mov(db, p.id, "modificacion", "500.00")  # ampliación
    s = saldos_de_partidas(db, [p.id])[p.id]
    assert s["modificaciones"] == D("500")
    assert s["vigente"] == D("1500")
    assert s["disponible"] == D("1500")


def test_reduccion_baja_vigente(db):
    p = _partida(db)
    _mov(db, p.id, "inicial", "1000.00")
    _mov(db, p.id, "modificacion", "-400.00")  # reducción
    s = saldos_de_partidas(db, [p.id])[p.id]
    assert s["modificaciones"] == D("-400")
    assert s["vigente"] == D("600")


def test_anulacion_de_modificacion_revierte(db):
    p = _partida(db)
    _mov(db, p.id, "inicial", "1000.00")
    _mov(db, p.id, "modificacion", "500.00")
    _mov(db, p.id, "modificacion", "-500.00")  # anulación (contra-movimiento)
    s = saldos_de_partidas(db, [p.id])[p.id]
    assert s["modificaciones"] == D("0")
    assert s["vigente"] == D("1000")


# ------------------------------------------------------------------ activo / soft-delete

def test_movimiento_inactivo_no_cuenta(db):
    p = _partida(db)
    _mov(db, p.id, "inicial", "1000.00")
    _mov(db, p.id, "preventivo", "300.00", activo=False)  # soft-deleted
    s = saldos_de_partidas(db, [p.id])[p.id]
    assert s["preventivo"] == D("0")
    assert s["disponible"] == D("1000")


# ------------------------------------------------------------------ multi-partida

def test_varias_partidas_independientes(db):
    p1 = _partida(db, objeto_gasto=1)
    p2 = _partida(db, objeto_gasto=2)  # dims distintas para no violar el unique
    _mov(db, p1.id, "inicial", "1000.00")
    _mov(db, p1.id, "preventivo", "200.00")
    _mov(db, p2.id, "inicial", "500.00")
    s = saldos_de_partidas(db, [p1.id, p2.id])
    assert s[p1.id]["disponible"] == D("800")
    assert s[p2.id]["disponible"] == D("500")


def test_escenario_completo_ciclo_del_gasto(db):
    """Recorrido íntegro: inicial -> ampliación -> preventivo -> compromiso
    (con conversión) -> devengado -> pagado, verificando disponible en cada hito."""
    p = _partida(db)
    _mov(db, p.id, "inicial", "1000.00")
    assert saldos_de_partidas(db, [p.id])[p.id]["disponible"] == D("1000")

    _mov(db, p.id, "modificacion", "500.00")  # ampliación -> vigente 1500
    assert saldos_de_partidas(db, [p.id])[p.id]["disponible"] == D("1500")

    _mov(db, p.id, "preventivo", "600.00")
    assert saldos_de_partidas(db, [p.id])[p.id]["disponible"] == D("900")

    # conversión a compromiso
    _mov(db, p.id, "compromiso", "600.00")
    _mov(db, p.id, "preventivo", "-600.00")
    assert saldos_de_partidas(db, [p.id])[p.id]["disponible"] == D("900")

    _mov(db, p.id, "devengado", "600.00")
    _mov(db, p.id, "pagado", "600.00")
    s = saldos_de_partidas(db, [p.id])[p.id]
    assert s["disponible"] == D("900")
    assert s["vigente"] == D("1500")
    assert s["comprometido"] == D("600")
    assert s["pagado"] == D("600")
