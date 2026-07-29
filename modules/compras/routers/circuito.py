import sys
import os
from decimal import Decimal
from typing import Optional, List

from fastapi import APIRouter, Depends, Query, HTTPException, status, Body
from sqlalchemy import func
from sqlalchemy.orm import Session
from starlette.requests import Request
from pydantic import BaseModel

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", ".."))
from shared.base_module import create_auth_dependency
from shared.filters import filtered_query

from database import get_db
from config import get_settings
from models.compras import (
    Proveedor, Articulo, Pedido, PedidoItem, OrdenCompra, OrdenCompraItem,
    Recepcion, RecepcionItem, Stock,
)

settings = get_settings()
get_current_user = create_auth_dependency(settings.seguridad_url)

CERO = Decimal("0.00")


def _requiere(cu, permiso):
    if cu.get("superuser"):
        return
    if permiso not in [p["codigo"] for p in cu.get("permisos", [])]:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=f"No tiene el permiso '{permiso}'")


def _quien(cu):
    return cu.get("nombre_apellido") or cu.get("codigo") or "?"


def _art_nombres(db, ids):
    if not ids:
        return {}
    return {a.id: {"id": a.id, "codigo": a.codigo, "nombre": a.nombre, "unidad": a.unidad,
                   "precio_referencia": float(a.precio_referencia)}
            for a in db.query(Articulo).filter(Articulo.id.in_(list(ids))).all()}


# ═══ Pedidos ═════════════════════════════════════════════════════════
pedidos_router = APIRouter(prefix="/pedidos", tags=["Pedidos de área"])


class PedidoItemIn(BaseModel):
    id_articulo: int
    cantidad: Decimal


class PedidoIn(BaseModel):
    anio: int
    area: str
    descripcion: Optional[str] = None
    items: List[PedidoItemIn]


def _ser_pedido(p: Pedido, db):
    items = db.query(PedidoItem).filter(PedidoItem.id_pedido == p.id).all()
    nombres = _art_nombres(db, {i.id_articulo for i in items})
    return {
        "id": p.id, "anio": p.anio, "numero": p.numero,
        "pedido": f"PED-{p.anio}-{p.numero:04d}", "area": p.area,
        "descripcion": p.descripcion, "estado": p.estado, "creado_por": p.creado_por,
        "items": [{"id": i.id, "id_articulo": i.id_articulo,
                   "articulo": nombres.get(i.id_articulo, {}), "cantidad": float(i.cantidad)} for i in items],
    }


@pedidos_router.get("")
def listar_ped(request: Request, anio: int = Query(None), skip: int = Query(0, ge=0),
               limit: int = Query(50, ge=1, le=200), db: Session = Depends(get_db),
               current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "compras_read")
    q = db.query(Pedido).filter(Pedido.activo == True)
    if anio:
        q = q.filter(Pedido.anio == anio)
    q = filtered_query(q, Pedido, dict(request.query_params), exclude={"skip", "limit", "anio"},
                       default_sort="id", default_dir="desc")
    return [_ser_pedido(p, db) for p in q.offset(skip).limit(limit).all()]


@pedidos_router.post("", status_code=201)
def crear_ped(data: PedidoIn, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "compras_write")
    if not data.items:
        raise HTTPException(status_code=400, detail="El pedido debe tener al menos un ítem")
    for it in data.items:
        if it.cantidad <= 0:
            raise HTTPException(status_code=400, detail="Cantidades deben ser mayores a cero")
        if not db.query(Articulo).filter(Articulo.id == it.id_articulo, Articulo.activo == True).first():
            raise HTTPException(status_code=400, detail=f"Artículo {it.id_articulo} inexistente")
    ultimo = db.query(func.max(Pedido.numero)).filter(Pedido.anio == data.anio).scalar() or 0
    p = Pedido(anio=data.anio, numero=ultimo + 1, area=data.area, descripcion=data.descripcion,
               estado="solicitado", creado_por=_quien(current_user))
    db.add(p); db.flush()
    for it in data.items:
        db.add(PedidoItem(id_pedido=p.id, id_articulo=it.id_articulo, cantidad=it.cantidad))
    db.commit(); db.refresh(p)
    return _ser_pedido(p, db)


@pedidos_router.delete("/{id}")
def anular_ped(id: int, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "compras_write")
    p = db.query(Pedido).filter(Pedido.id == id, Pedido.activo == True).first()
    if not p:
        raise HTTPException(status_code=404, detail="Pedido inexistente")
    if p.estado == "con_oc":
        raise HTTPException(status_code=409, detail="El pedido ya tiene una orden de compra")
    p.estado = "anulado"; db.commit()
    return {"message": "pedido anulado"}


# ═══ Órdenes de compra ═══════════════════════════════════════════════
oc_router = APIRouter(prefix="/ordenes-compra", tags=["Órdenes de compra"])


class OCItemIn(BaseModel):
    id_articulo: int
    cantidad: Decimal
    precio: Decimal


class OCIn(BaseModel):
    anio: int
    id_proveedor: int
    id_pedido: Optional[int] = None
    concepto: Optional[str] = None
    items: List[OCItemIn]


def _ser_oc(oc: OrdenCompra, db, con_items=True):
    prov = db.query(Proveedor).filter(Proveedor.id == oc.id_proveedor).first()
    out = {
        "id": oc.id, "anio": oc.anio, "numero": oc.numero,
        "orden_compra": f"OC-{oc.anio}-{oc.numero:04d}",
        "id_proveedor": oc.id_proveedor,
        "proveedor": {"id": prov.id, "codigo": prov.codigo, "nombre": prov.nombre} if prov else None,
        "id_pedido": oc.id_pedido, "total": float(oc.total), "concepto": oc.concepto,
        "estado": oc.estado, "comprometida": oc.comprometida, "creado_por": oc.creado_por,
        "created_at": oc.created_at,
    }
    if con_items:
        items = db.query(OrdenCompraItem).filter(OrdenCompraItem.id_orden_compra == oc.id).all()
        nombres = _art_nombres(db, {i.id_articulo for i in items})
        out["items"] = [{
            "id": i.id, "id_articulo": i.id_articulo, "articulo": nombres.get(i.id_articulo, {}),
            "cantidad": float(i.cantidad), "precio": float(i.precio),
            "subtotal": float(Decimal(str(i.cantidad)) * Decimal(str(i.precio))),
            "cantidad_recibida": float(i.cantidad_recibida),
            "pendiente": float(Decimal(str(i.cantidad)) - Decimal(str(i.cantidad_recibida))),
        } for i in items]
    return out


@oc_router.get("")
def listar_oc(request: Request, anio: int = Query(None), estado: str = Query(None),
              solo_comprometibles: bool = Query(False),
              skip: int = Query(0, ge=0), limit: int = Query(50, ge=1, le=200),
              db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "compras_read")
    q = db.query(OrdenCompra).filter(OrdenCompra.activo == True)
    if anio:
        q = q.filter(OrdenCompra.anio == anio)
    if estado:
        q = q.filter(OrdenCompra.estado == estado)
    if solo_comprometibles:  # para Contaduría: OC emitidas no anuladas
        q = q.filter(OrdenCompra.estado != "anulada")
    q = filtered_query(q, OrdenCompra, dict(request.query_params),
                       exclude={"skip", "limit", "anio", "estado", "solo_comprometibles"},
                       default_sort="id", default_dir="desc")
    return [_ser_oc(oc, db, con_items=False) for oc in q.offset(skip).limit(limit).all()]


@oc_router.get("/{id}")
def obtener_oc(id: int, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "compras_read")
    oc = db.query(OrdenCompra).filter(OrdenCompra.id == id, OrdenCompra.activo == True).first()
    if not oc:
        raise HTTPException(status_code=404, detail="OC inexistente")
    return _ser_oc(oc, db)


@oc_router.post("", status_code=201)
def crear_oc(data: OCIn, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "compras_ordenar")
    if not data.items:
        raise HTTPException(status_code=400, detail="La OC debe tener al menos un ítem")
    prov = db.query(Proveedor).filter(Proveedor.id == data.id_proveedor, Proveedor.activo == True).first()
    if not prov:
        raise HTTPException(status_code=400, detail="Proveedor inexistente")
    pedido = None
    if data.id_pedido:
        pedido = db.query(Pedido).filter(Pedido.id == data.id_pedido, Pedido.activo == True).first()
        if not pedido:
            raise HTTPException(status_code=400, detail="Pedido inexistente")
        if pedido.estado == "con_oc":
            raise HTTPException(status_code=409, detail="El pedido ya tiene una OC")
    total = CERO
    for it in data.items:
        if it.cantidad <= 0 or it.precio < 0:
            raise HTTPException(status_code=400, detail="Cantidad/precio inválidos")
        if not db.query(Articulo).filter(Articulo.id == it.id_articulo, Articulo.activo == True).first():
            raise HTTPException(status_code=400, detail=f"Artículo {it.id_articulo} inexistente")
        total += Decimal(str(it.cantidad)) * Decimal(str(it.precio))
    ultimo = db.query(func.max(OrdenCompra.numero)).filter(OrdenCompra.anio == data.anio).scalar() or 0
    oc = OrdenCompra(anio=data.anio, numero=ultimo + 1, id_pedido=data.id_pedido,
                     id_proveedor=prov.id, proveedor_nombre=prov.nombre, total=total,
                     concepto=data.concepto, estado="emitida", creado_por=_quien(current_user))
    db.add(oc); db.flush()
    for it in data.items:
        db.add(OrdenCompraItem(id_orden_compra=oc.id, id_articulo=it.id_articulo,
                               cantidad=it.cantidad, precio=it.precio))
    if pedido:
        pedido.estado = "con_oc"
    db.commit(); db.refresh(oc)
    return _ser_oc(oc, db)


@oc_router.post("/{id}/anular")
def anular_oc(id: int, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "compras_ordenar")
    oc = db.query(OrdenCompra).filter(OrdenCompra.id == id, OrdenCompra.activo == True).first()
    if not oc:
        raise HTTPException(status_code=404, detail="OC inexistente")
    if oc.estado in ("recibida", "recibida_parcial"):
        raise HTTPException(status_code=409, detail="No se anula una OC con recepciones")
    if oc.comprometida:
        raise HTTPException(status_code=409, detail="La OC ya fue comprometida en Contaduría")
    oc.estado = "anulada"
    if oc.id_pedido:
        ped = db.query(Pedido).filter(Pedido.id == oc.id_pedido).first()
        if ped:
            ped.estado = "solicitado"
    db.commit()
    return _ser_oc(oc, db)


@oc_router.post("/{id}/marcar-comprometida")
def marcar_comprometida(id: int, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    """Lo llama Contaduría (por HTTP) cuando registra el compromiso sobre esta OC."""
    _requiere(current_user, "compras_read")  # Contaduría solo necesita leer/marcar
    oc = db.query(OrdenCompra).filter(OrdenCompra.id == id, OrdenCompra.activo == True).first()
    if not oc:
        raise HTTPException(status_code=404, detail="OC inexistente")
    oc.comprometida = True
    db.commit()
    return {"ok": True, "orden_compra": f"OC-{oc.anio}-{oc.numero:04d}"}


# ═══ Recepciones → Stock ═════════════════════════════════════════════
class RecepItemIn(BaseModel):
    id_oc_item: int
    cantidad: Decimal


class RecepIn(BaseModel):
    remito: Optional[str] = None
    items: List[RecepItemIn]


@oc_router.post("/{id}/recepciones", status_code=201)
def recibir(id: int, data: RecepIn, db: Session = Depends(get_db),
            current_user: dict = Depends(get_current_user)):
    """Recibe mercadería de la OC: descuenta pendientes y suma al stock."""
    _requiere(current_user, "compras_recibir")
    oc = db.query(OrdenCompra).filter(OrdenCompra.id == id, OrdenCompra.activo == True).first()
    if not oc:
        raise HTTPException(status_code=404, detail="OC inexistente")
    if oc.estado not in ("emitida", "recibida_parcial"):
        raise HTTPException(status_code=409, detail=f"La OC está '{oc.estado}'")
    if not data.items:
        raise HTTPException(status_code=400, detail="Debe recibir al menos un ítem")
    rec = Recepcion(id_orden_compra=oc.id, remito=data.remito, usuario_nombre=_quien(current_user))
    db.add(rec); db.flush()
    for it in data.items:
        oci = db.query(OrdenCompraItem).filter(
            OrdenCompraItem.id == it.id_oc_item, OrdenCompraItem.id_orden_compra == oc.id).first()
        if not oci:
            raise HTTPException(status_code=400, detail=f"Ítem {it.id_oc_item} no pertenece a la OC")
        pendiente = Decimal(str(oci.cantidad)) - Decimal(str(oci.cantidad_recibida))
        if it.cantidad <= 0:
            raise HTTPException(status_code=400, detail="Cantidad inválida")
        if it.cantidad > pendiente:
            raise HTTPException(status_code=409, detail=f"El ítem {oci.id} solo tiene {pendiente} pendiente")
        oci.cantidad_recibida = Decimal(str(oci.cantidad_recibida)) + it.cantidad
        db.add(RecepcionItem(id_recepcion=rec.id, id_oc_item=oci.id,
                             id_articulo=oci.id_articulo, cantidad=it.cantidad))
        st = db.query(Stock).filter(Stock.id_articulo == oci.id_articulo).first()
        if st:
            st.cantidad = Decimal(str(st.cantidad)) + it.cantidad
        else:
            db.add(Stock(id_articulo=oci.id_articulo, cantidad=it.cantidad))
    # estado de la OC según pendientes
    items = db.query(OrdenCompraItem).filter(OrdenCompraItem.id_orden_compra == oc.id).all()
    total_pend = sum((Decimal(str(i.cantidad)) - Decimal(str(i.cantidad_recibida)) for i in items), CERO)
    oc.estado = "recibida" if total_pend <= 0 else "recibida_parcial"
    if oc.id_pedido and oc.estado == "recibida":
        ped = db.query(Pedido).filter(Pedido.id == oc.id_pedido).first()
        if ped:
            ped.estado = "recibido"
    db.commit(); db.refresh(oc)
    return _ser_oc(oc, db)


# ═══ Stock ═══════════════════════════════════════════════════════════
stock_router = APIRouter(prefix="/stock", tags=["Stock"])


@stock_router.get("")
def listar_stock(db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "compras_read")
    filas = db.query(Stock).all()
    nombres = _art_nombres(db, {s.id_articulo for s in filas})
    return [{"id_articulo": s.id_articulo, "articulo": nombres.get(s.id_articulo, {}),
             "cantidad": float(s.cantidad)} for s in filas if s.cantidad and float(s.cantidad) != 0]
