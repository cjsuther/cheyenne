"""Tests del matcheo de facturas contra OC/recepcion (routers.facturas).

Regla: si la factura viene contra una OC, el total no puede superar el saldo
facturable (tope = monto recibido si hubo recepciones, si no el ordenado),
descontando lo ya facturado (facturas no anuladas) contra esa misma OC.
"""
from decimal import Decimal

import pytest
from fastapi import HTTPException

from models.compras import Proveedor, Articulo, OrdenCompra, OrdenCompraItem, FacturaProveedor
from routers.facturas import registrar_factura, FacturaIn, FacturaItemIn, anular_factura
from routers.circuito import crear_oc, OCIn, OCItemIn, recibir, RecepIn, RecepItemIn
from conftest import FakeRequest


def _proveedor(db, codigo="P001", nombre="ACME"):
    p = Proveedor(codigo=codigo, nombre=nombre, estado="activo", activo=True)
    db.add(p)
    db.commit()
    return p


def _articulo(db, codigo="A001", precio="100.00"):
    a = Articulo(codigo=codigo, nombre="art", unidad="u", precio_referencia=Decimal(precio), activo=True)
    db.add(a)
    db.commit()
    return a


def _oc(db, cu, prov, a, cantidad="5", precio="20"):
    return crear_oc(OCIn(anio=2026, id_proveedor=prov.id,
                         items=[OCItemIn(id_articulo=a.id, cantidad=Decimal(cantidad), precio=Decimal(precio))]),
                    request=FakeRequest(), db=db, current_user=cu)


# ── Factura suelta (sin OC) ──────────────────────────────────────────────────

def test_factura_suelta_por_total(db, cu):
    prov = _proveedor(db)
    out = registrar_factura(FacturaIn(id_proveedor=prov.id, numero="A-1", total=Decimal("500")),
                            db=db, current_user=cu)
    assert out["estado"] == "registrada"
    assert out["total"] == 500.0


def test_factura_recalcula_total_por_items(db, cu):
    prov = _proveedor(db)
    a = _articulo(db)
    out = registrar_factura(
        FacturaIn(id_proveedor=prov.id, numero="A-2", total=Decimal("1"),  # se ignora
                  items=[FacturaItemIn(id_articulo=a.id, cantidad=Decimal("3"), precio=Decimal("150"))]),
        db=db, current_user=cu)
    assert out["total"] == 450.0


def test_factura_sin_total_ni_items_falla(db, cu):
    prov = _proveedor(db)
    with pytest.raises(HTTPException) as e:
        registrar_factura(FacturaIn(id_proveedor=prov.id, numero="A-3"), db=db, current_user=cu)
    assert e.value.status_code == 400


def test_factura_total_cero_falla(db, cu):
    prov = _proveedor(db)
    with pytest.raises(HTTPException) as e:
        registrar_factura(FacturaIn(id_proveedor=prov.id, numero="A-4", total=Decimal("0")),
                          db=db, current_user=cu)
    assert e.value.status_code == 400


def test_factura_sin_numero_falla(db, cu):
    prov = _proveedor(db)
    with pytest.raises(HTTPException) as e:
        registrar_factura(FacturaIn(id_proveedor=prov.id, numero="   ", total=Decimal("10")),
                          db=db, current_user=cu)
    assert e.value.status_code == 400


# ── Matcheo contra OC ────────────────────────────────────────────────────────

def test_factura_contra_oc_dentro_del_tope_ordenado(db, cu):
    prov = _proveedor(db)
    a = _articulo(db)
    oc = _oc(db, cu, prov, a)  # 5*20 = 100 ordenado, sin recepciones
    out = registrar_factura(FacturaIn(id_proveedor=prov.id, id_orden_compra=oc["id"],
                                      numero="F-1", total=Decimal("100")),
                            db=db, current_user=cu)
    assert out["total"] == 100.0
    assert out["id_orden_compra"] == oc["id"]


def test_factura_supera_ordenado_falla(db, cu):
    prov = _proveedor(db)
    a = _articulo(db)
    oc = _oc(db, cu, prov, a)  # tope 100
    with pytest.raises(HTTPException) as e:
        registrar_factura(FacturaIn(id_proveedor=prov.id, id_orden_compra=oc["id"],
                                    numero="F-2", total=Decimal("100.01")),
                          db=db, current_user=cu)
    assert e.value.status_code == 409


def test_tope_es_lo_recibido_cuando_hubo_recepcion(db, cu):
    prov = _proveedor(db)
    a = _articulo(db)
    oc = _oc(db, cu, prov, a)  # ordenado 100 (5u * 20)
    item = db.query(OrdenCompraItem).filter(OrdenCompraItem.id_orden_compra == oc["id"]).first()
    recibir(oc["id"], RecepIn(items=[RecepItemIn(id_oc_item=item.id, cantidad=Decimal("2"))]),
            db=db, current_user=cu)  # recibido 2*20 = 40 -> tope pasa a 40
    # 40 entra
    registrar_factura(FacturaIn(id_proveedor=prov.id, id_orden_compra=oc["id"], numero="F-3", total=Decimal("40")),
                      db=db, current_user=cu)
    # cualquier centavo mas supera el saldo (tope 40, ya facturado 40)
    with pytest.raises(HTTPException) as e:
        registrar_factura(FacturaIn(id_proveedor=prov.id, id_orden_compra=oc["id"], numero="F-4", total=Decimal("0.01")),
                          db=db, current_user=cu)
    assert e.value.status_code == 409


def test_facturas_acumulan_contra_la_oc(db, cu):
    prov = _proveedor(db)
    a = _articulo(db)
    oc = _oc(db, cu, prov, a)  # tope 100
    registrar_factura(FacturaIn(id_proveedor=prov.id, id_orden_compra=oc["id"], numero="F-5", total=Decimal("60")),
                      db=db, current_user=cu)
    # segunda de 40 completa el tope
    registrar_factura(FacturaIn(id_proveedor=prov.id, id_orden_compra=oc["id"], numero="F-6", total=Decimal("40")),
                      db=db, current_user=cu)
    # una tercera ya no entra
    with pytest.raises(HTTPException) as e:
        registrar_factura(FacturaIn(id_proveedor=prov.id, id_orden_compra=oc["id"], numero="F-7", total=Decimal("1")),
                          db=db, current_user=cu)
    assert e.value.status_code == 409


def test_factura_anulada_libera_saldo(db, cu):
    prov = _proveedor(db)
    a = _articulo(db)
    oc = _oc(db, cu, prov, a)  # tope 100
    f = registrar_factura(FacturaIn(id_proveedor=prov.id, id_orden_compra=oc["id"], numero="F-8", total=Decimal("100")),
                          db=db, current_user=cu)
    anular_factura(f["id"], db=db, current_user=cu)
    # como la anterior esta anulada, no cuenta: entra otra de 100
    out = registrar_factura(FacturaIn(id_proveedor=prov.id, id_orden_compra=oc["id"], numero="F-9", total=Decimal("100")),
                            db=db, current_user=cu)
    assert out["total"] == 100.0


def test_factura_oc_de_otro_proveedor_falla(db, cu):
    prov1 = _proveedor(db, codigo="P1", nombre="Uno")
    prov2 = _proveedor(db, codigo="P2", nombre="Dos")
    a = _articulo(db)
    oc = _oc(db, cu, prov1, a)
    with pytest.raises(HTTPException) as e:
        registrar_factura(FacturaIn(id_proveedor=prov2.id, id_orden_compra=oc["id"], numero="F-10", total=Decimal("10")),
                          db=db, current_user=cu)
    assert e.value.status_code == 409


def test_factura_contra_oc_anulada_falla(db, cu):
    prov = _proveedor(db)
    a = _articulo(db)
    oc = _oc(db, cu, prov, a)
    db.get(OrdenCompra, oc["id"]).estado = "anulada"
    db.commit()
    with pytest.raises(HTTPException) as e:
        registrar_factura(FacturaIn(id_proveedor=prov.id, id_orden_compra=oc["id"], numero="F-11", total=Decimal("10")),
                          db=db, current_user=cu)
    assert e.value.status_code == 409


def test_no_anular_factura_conformada(db, cu):
    from routers.facturas import conformar_factura
    prov = _proveedor(db)
    f = registrar_factura(FacturaIn(id_proveedor=prov.id, numero="F-12", total=Decimal("10")),
                          db=db, current_user=cu)
    conformar_factura(f["id"], db=db, current_user=cu)
    with pytest.raises(HTTPException) as e:
        anular_factura(f["id"], db=db, current_user=cu)
    assert e.value.status_code == 409
