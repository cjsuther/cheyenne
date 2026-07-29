"""Tests del circuito de compras (routers.circuito).

Cubre la logica de negocio real, invocando las funciones-endpoint pasando la
sesion `db` a mano (sin HTTP ni auth): crear pedido, crear OC (calculo de total,
autonumeracion), recepcion parcial->total con suma al stock y transicion de
estados emitida->recibida_parcial->recibida, y el arrastre del estado del pedido.
"""
from decimal import Decimal

import pytest
from fastapi import HTTPException

from models.compras import (
    Proveedor, Articulo, Pedido, OrdenCompra, OrdenCompraItem, Stock,
    StockPorDeposito, MovimientoStock, Recepcion,
)
from routers.circuito import (
    crear_ped, PedidoIn, PedidoItemIn,
    crear_oc, OCIn, OCItemIn, anular_oc,
    recibir, RecepIn, RecepItemIn,
)
from conftest import FakeRequest


# ── Siembra ──────────────────────────────────────────────────────────────────

def _proveedor(db, codigo="P001", nombre="ACME SA", estado="activo", activo=True):
    p = Proveedor(codigo=codigo, nombre=nombre, estado=estado, activo=activo)
    db.add(p)
    db.commit()
    return p


def _articulo(db, codigo="A001", nombre="Resma A4", precio="100.00", activo=True):
    a = Articulo(codigo=codigo, nombre=nombre, unidad="unidad",
                 precio_referencia=Decimal(precio), activo=activo)
    db.add(a)
    db.commit()
    return a


def _oc_item(db, id_oc, id_articulo):
    return db.query(OrdenCompraItem).filter(
        OrdenCompraItem.id_orden_compra == id_oc,
        OrdenCompraItem.id_articulo == id_articulo).first()


# ── Pedidos ──────────────────────────────────────────────────────────────────

def test_crear_pedido_ok(db, cu):
    a = _articulo(db)
    out = crear_ped(PedidoIn(anio=2026, area="Sistemas", descripcion="insumos",
                             items=[PedidoItemIn(id_articulo=a.id, cantidad=Decimal("5"))]),
                    db=db, current_user=cu)
    assert out["estado"] == "solicitado"
    assert out["numero"] == 1
    assert out["pedido"] == "PED-2026-0001"
    assert out["items"][0]["cantidad"] == 5.0


def test_pedido_autonumera_por_anio(db, cu):
    a = _articulo(db)
    p1 = crear_ped(PedidoIn(anio=2026, area="A", items=[PedidoItemIn(id_articulo=a.id, cantidad=Decimal("1"))]),
                   db=db, current_user=cu)
    p2 = crear_ped(PedidoIn(anio=2026, area="B", items=[PedidoItemIn(id_articulo=a.id, cantidad=Decimal("1"))]),
                   db=db, current_user=cu)
    p_otro = crear_ped(PedidoIn(anio=2027, area="C", items=[PedidoItemIn(id_articulo=a.id, cantidad=Decimal("1"))]),
                       db=db, current_user=cu)
    assert (p1["numero"], p2["numero"]) == (1, 2)
    assert p_otro["numero"] == 1  # reinicia el contador por anio


def test_pedido_sin_items_falla(db, cu):
    with pytest.raises(HTTPException) as e:
        crear_ped(PedidoIn(anio=2026, area="A", items=[]), db=db, current_user=cu)
    assert e.value.status_code == 400


def test_pedido_cantidad_cero_falla(db, cu):
    a = _articulo(db)
    with pytest.raises(HTTPException) as e:
        crear_ped(PedidoIn(anio=2026, area="A", items=[PedidoItemIn(id_articulo=a.id, cantidad=Decimal("0"))]),
                  db=db, current_user=cu)
    assert e.value.status_code == 400


def test_pedido_articulo_inexistente_falla(db, cu):
    with pytest.raises(HTTPException) as e:
        crear_ped(PedidoIn(anio=2026, area="A", items=[PedidoItemIn(id_articulo=999, cantidad=Decimal("1"))]),
                  db=db, current_user=cu)
    assert e.value.status_code == 400


# ── Orden de compra ──────────────────────────────────────────────────────────

def test_crear_oc_calcula_total_y_numera(db, cu):
    prov = _proveedor(db)
    a1 = _articulo(db, codigo="A1")
    a2 = _articulo(db, codigo="A2")
    out = crear_oc(
        OCIn(anio=2026, id_proveedor=prov.id, concepto="test", items=[
            OCItemIn(id_articulo=a1.id, cantidad=Decimal("3"), precio=Decimal("100.50")),
            OCItemIn(id_articulo=a2.id, cantidad=Decimal("2"), precio=Decimal("50.00")),
        ]),
        request=FakeRequest(), db=db, current_user=cu)
    # 3*100.50 + 2*50.00 = 301.50 + 100.00 = 401.50
    assert out["total"] == 401.50
    assert out["estado"] == "emitida"
    assert out["numero"] == 1  # Administracion no responde -> cae al minimo (ultimo+1)
    assert out["orden_compra"] == "OC-2026-0001"


def test_crear_oc_desde_pedido_marca_pedido(db, cu):
    prov = _proveedor(db)
    a = _articulo(db)
    ped = crear_ped(PedidoIn(anio=2026, area="A", items=[PedidoItemIn(id_articulo=a.id, cantidad=Decimal("4"))]),
                    db=db, current_user=cu)
    crear_oc(OCIn(anio=2026, id_proveedor=prov.id, id_pedido=ped["id"],
                  items=[OCItemIn(id_articulo=a.id, cantidad=Decimal("4"), precio=Decimal("10"))]),
             request=FakeRequest(), db=db, current_user=cu)
    assert db.get(Pedido, ped["id"]).estado == "con_oc"


def test_oc_pedido_ya_con_oc_falla(db, cu):
    prov = _proveedor(db)
    a = _articulo(db)
    ped = crear_ped(PedidoIn(anio=2026, area="A", items=[PedidoItemIn(id_articulo=a.id, cantidad=Decimal("1"))]),
                    db=db, current_user=cu)
    crear_oc(OCIn(anio=2026, id_proveedor=prov.id, id_pedido=ped["id"],
                  items=[OCItemIn(id_articulo=a.id, cantidad=Decimal("1"), precio=Decimal("10"))]),
             request=FakeRequest(), db=db, current_user=cu)
    with pytest.raises(HTTPException) as e:
        crear_oc(OCIn(anio=2026, id_proveedor=prov.id, id_pedido=ped["id"],
                      items=[OCItemIn(id_articulo=a.id, cantidad=Decimal("1"), precio=Decimal("10"))]),
                 request=FakeRequest(), db=db, current_user=cu)
    assert e.value.status_code == 409


def test_oc_proveedor_inexistente_falla(db, cu):
    a = _articulo(db)
    with pytest.raises(HTTPException) as e:
        crear_oc(OCIn(anio=2026, id_proveedor=999,
                      items=[OCItemIn(id_articulo=a.id, cantidad=Decimal("1"), precio=Decimal("1"))]),
                 request=FakeRequest(), db=db, current_user=cu)
    assert e.value.status_code == 400


def test_oc_cantidad_invalida_falla(db, cu):
    prov = _proveedor(db)
    a = _articulo(db)
    with pytest.raises(HTTPException) as e:
        crear_oc(OCIn(anio=2026, id_proveedor=prov.id,
                      items=[OCItemIn(id_articulo=a.id, cantidad=Decimal("0"), precio=Decimal("1"))]),
                 request=FakeRequest(), db=db, current_user=cu)
    assert e.value.status_code == 400


def test_anular_oc_libera_pedido(db, cu):
    prov = _proveedor(db)
    a = _articulo(db)
    ped = crear_ped(PedidoIn(anio=2026, area="A", items=[PedidoItemIn(id_articulo=a.id, cantidad=Decimal("1"))]),
                    db=db, current_user=cu)
    oc = crear_oc(OCIn(anio=2026, id_proveedor=prov.id, id_pedido=ped["id"],
                       items=[OCItemIn(id_articulo=a.id, cantidad=Decimal("1"), precio=Decimal("10"))]),
                  request=FakeRequest(), db=db, current_user=cu)
    out = anular_oc(oc["id"], db=db, current_user=cu)
    assert out["estado"] == "anulada"
    assert db.get(Pedido, ped["id"]).estado == "solicitado"


def test_anular_oc_comprometida_falla(db, cu):
    prov = _proveedor(db)
    a = _articulo(db)
    oc = crear_oc(OCIn(anio=2026, id_proveedor=prov.id,
                       items=[OCItemIn(id_articulo=a.id, cantidad=Decimal("1"), precio=Decimal("10"))]),
                  request=FakeRequest(), db=db, current_user=cu)
    db.get(OrdenCompra, oc["id"]).comprometida = True
    db.commit()
    with pytest.raises(HTTPException) as e:
        anular_oc(oc["id"], db=db, current_user=cu)
    assert e.value.status_code == 409


# ── Recepcion parcial -> total: stock y estados ─────────────────────────────

def _oc_de_5(db, cu):
    prov = _proveedor(db)
    a = _articulo(db)
    oc = crear_oc(OCIn(anio=2026, id_proveedor=prov.id,
                       items=[OCItemIn(id_articulo=a.id, cantidad=Decimal("5"), precio=Decimal("20"))]),
                  request=FakeRequest(), db=db, current_user=cu)
    return oc, a


def test_recepcion_parcial_luego_total(db, cu):
    oc, a = _oc_de_5(db, cu)
    item = _oc_item(db, oc["id"], a.id)

    # Recepcion parcial: 2 de 5
    r1 = recibir(oc["id"], RecepIn(remito="R1", items=[RecepItemIn(id_oc_item=item.id, cantidad=Decimal("2"))]),
                 db=db, current_user=cu)
    assert r1["estado"] == "recibida_parcial"
    it = next(i for i in r1["items"] if i["id"] == item.id)
    assert it["cantidad_recibida"] == 2.0 and it["pendiente"] == 3.0

    # Stock global suma 2
    assert Decimal(str(db.query(Stock).filter(Stock.id_articulo == a.id).first().cantidad)) == Decimal("2")

    # Recepcion del resto: 3 -> queda recibida completa
    r2 = recibir(oc["id"], RecepIn(items=[RecepItemIn(id_oc_item=item.id, cantidad=Decimal("3"))]),
                 db=db, current_user=cu)
    assert r2["estado"] == "recibida"
    it = next(i for i in r2["items"] if i["id"] == item.id)
    assert it["cantidad_recibida"] == 5.0 and it["pendiente"] == 0.0
    assert Decimal(str(db.query(Stock).filter(Stock.id_articulo == a.id).first().cantidad)) == Decimal("5")


def test_recepcion_suma_stock_por_deposito_central(db, cu):
    oc, a = _oc_de_5(db, cu)
    item = _oc_item(db, oc["id"], a.id)
    recibir(oc["id"], RecepIn(items=[RecepItemIn(id_oc_item=item.id, cantidad=Decimal("4"))]),
            db=db, current_user=cu)
    # Sin id_deposito -> entra al central (lo crea deposito_central)
    filas = db.query(StockPorDeposito).filter(StockPorDeposito.id_articulo == a.id).all()
    assert len(filas) == 1
    assert Decimal(str(filas[0].cantidad)) == Decimal("4")
    # Genera un movimiento de ingreso
    mov = db.query(MovimientoStock).filter(MovimientoStock.id_articulo == a.id).first()
    assert mov is not None and mov.tipo == "ingreso"


def test_recepcion_excede_pendiente_falla(db, cu):
    oc, a = _oc_de_5(db, cu)
    item = _oc_item(db, oc["id"], a.id)
    with pytest.raises(HTTPException) as e:
        recibir(oc["id"], RecepIn(items=[RecepItemIn(id_oc_item=item.id, cantidad=Decimal("6"))]),
                db=db, current_user=cu)
    assert e.value.status_code == 409


def test_recepcion_sobre_oc_recibida_falla(db, cu):
    oc, a = _oc_de_5(db, cu)
    item = _oc_item(db, oc["id"], a.id)
    recibir(oc["id"], RecepIn(items=[RecepItemIn(id_oc_item=item.id, cantidad=Decimal("5"))]),
            db=db, current_user=cu)  # -> recibida
    with pytest.raises(HTTPException) as e:
        recibir(oc["id"], RecepIn(items=[RecepItemIn(id_oc_item=item.id, cantidad=Decimal("1"))]),
                db=db, current_user=cu)
    assert e.value.status_code == 409


def test_recepcion_item_ajeno_falla(db, cu):
    oc, a = _oc_de_5(db, cu)
    with pytest.raises(HTTPException) as e:
        recibir(oc["id"], RecepIn(items=[RecepItemIn(id_oc_item=99999, cantidad=Decimal("1"))]),
                db=db, current_user=cu)
    assert e.value.status_code == 400


def test_recepcion_total_arrastra_pedido_a_recibido(db, cu):
    prov = _proveedor(db)
    a = _articulo(db)
    ped = crear_ped(PedidoIn(anio=2026, area="A", items=[PedidoItemIn(id_articulo=a.id, cantidad=Decimal("2"))]),
                    db=db, current_user=cu)
    oc = crear_oc(OCIn(anio=2026, id_proveedor=prov.id, id_pedido=ped["id"],
                       items=[OCItemIn(id_articulo=a.id, cantidad=Decimal("2"), precio=Decimal("10"))]),
                  request=FakeRequest(), db=db, current_user=cu)
    item = _oc_item(db, oc["id"], a.id)
    recibir(oc["id"], RecepIn(items=[RecepItemIn(id_oc_item=item.id, cantidad=Decimal("2"))]),
            db=db, current_user=cu)
    assert db.get(Pedido, ped["id"]).estado == "recibido"


def test_recepcion_crea_registro_recepcion(db, cu):
    oc, a = _oc_de_5(db, cu)
    item = _oc_item(db, oc["id"], a.id)
    recibir(oc["id"], RecepIn(remito="REM-123", items=[RecepItemIn(id_oc_item=item.id, cantidad=Decimal("1"))]),
            db=db, current_user=cu)
    rec = db.query(Recepcion).filter(Recepcion.id_orden_compra == oc["id"]).first()
    assert rec is not None and rec.remito == "REM-123"
