import sys
import os
from decimal import Decimal
from datetime import datetime, timezone
from typing import Optional, List

from fastapi import APIRouter, Depends, Query, HTTPException, status
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
    Proveedor, Articulo, OrdenCompra, OrdenCompraItem,
    PedidoCotizacion, PedidoCotizacionItem, Cotizacion, CotizacionItem,
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


def _prov_nombres(db, ids):
    if not ids:
        return {}
    return {p.id: {"id": p.id, "codigo": p.codigo, "nombre": p.nombre}
            for p in db.query(Proveedor).filter(Proveedor.id.in_(list(ids))).all()}


licitaciones_router = APIRouter(prefix="/pedidos-cotizacion", tags=["Circuito licitatorio"])


# ── Schemas ──────────────────────────────────────────────────────────
class PedCotItemIn(BaseModel):
    id_articulo: int
    cantidad: Decimal


class PedCotIn(BaseModel):
    anio: int
    concepto: Optional[str] = None
    items: List[PedCotItemIn]


class CotItemIn(BaseModel):
    id_articulo: int
    precio: Decimal
    cantidad: Optional[Decimal] = None   # si falta, toma la cantidad del pedido


class CotizacionIn(BaseModel):
    id_proveedor: int
    observaciones: Optional[str] = None
    items: List[CotItemIn]


class AdjudicacionLinea(BaseModel):
    id_articulo: int
    id_proveedor: int
    precio: Optional[Decimal] = None   # si falta, toma el precio cotizado por ese proveedor


class AdjudicarIn(BaseModel):
    lineas: List[AdjudicacionLinea]


# ── Serializadores ───────────────────────────────────────────────────
def _ser_pedcot(p: PedidoCotizacion, db, con_cotizaciones=False):
    items = db.query(PedidoCotizacionItem).filter(
        PedidoCotizacionItem.id_pedido_cotizacion == p.id).all()
    nombres = _art_nombres(db, {i.id_articulo for i in items})
    cots = db.query(Cotizacion).filter(
        Cotizacion.id_pedido_cotizacion == p.id, Cotizacion.activo == True).all()  # noqa: E712
    out = {
        "id": p.id, "anio": p.anio, "numero": p.numero,
        "pedido_cotizacion": f"COT-{p.anio}-{p.numero:04d}",
        "concepto": p.concepto, "estado": p.estado, "fecha_apertura": p.fecha_apertura,
        "creado_por": p.creado_por, "created_at": p.created_at,
        "cant_cotizaciones": len(cots),
        "items": [{"id": i.id, "id_articulo": i.id_articulo,
                   "articulo": nombres.get(i.id_articulo, {}), "cantidad": float(i.cantidad)} for i in items],
    }
    if con_cotizaciones:
        out["cotizaciones"] = [_ser_cotizacion(c, db) for c in cots]
    return out


def _ser_cotizacion(c: Cotizacion, db):
    items = db.query(CotizacionItem).filter(CotizacionItem.id_cotizacion == c.id).all()
    nombres = _art_nombres(db, {i.id_articulo for i in items})
    provs = _prov_nombres(db, {c.id_proveedor})
    return {
        "id": c.id, "id_pedido_cotizacion": c.id_pedido_cotizacion,
        "id_proveedor": c.id_proveedor, "proveedor": provs.get(c.id_proveedor, {}),
        "fecha": c.fecha, "observaciones": c.observaciones, "total": float(c.total),
        "items": [{"id": i.id, "id_articulo": i.id_articulo, "articulo": nombres.get(i.id_articulo, {}),
                   "precio": float(i.precio), "cantidad": float(i.cantidad),
                   "subtotal": float(Decimal(str(i.precio)) * Decimal(str(i.cantidad)))} for i in items],
    }


# ── Endpoints: pedido de cotización ──────────────────────────────────
@licitaciones_router.get("")
def listar_pedcot(request: Request, anio: int = Query(None), estado: str = Query(None),
                  skip: int = Query(0, ge=0), limit: int = Query(50, ge=1, le=200),
                  db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "compras_read")
    q = db.query(PedidoCotizacion).filter(PedidoCotizacion.activo == True)  # noqa: E712
    if anio:
        q = q.filter(PedidoCotizacion.anio == anio)
    if estado:
        q = q.filter(PedidoCotizacion.estado == estado)
    q = filtered_query(q, PedidoCotizacion, dict(request.query_params),
                       exclude={"skip", "limit", "anio", "estado"}, default_sort="id", default_dir="desc")
    return [_ser_pedcot(p, db) for p in q.offset(skip).limit(limit).all()]


@licitaciones_router.get("/{id}")
def obtener_pedcot(id: int, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "compras_read")
    p = db.query(PedidoCotizacion).filter(PedidoCotizacion.id == id, PedidoCotizacion.activo == True).first()  # noqa: E712
    if not p:
        raise HTTPException(status_code=404, detail="Pedido de cotización inexistente")
    return _ser_pedcot(p, db, con_cotizaciones=True)


@licitaciones_router.post("", status_code=201)
def crear_pedcot(data: PedCotIn, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "compras_licitar")
    if not data.items:
        raise HTTPException(status_code=400, detail="El pedido de cotización debe tener al menos un ítem")
    for it in data.items:
        if it.cantidad <= 0:
            raise HTTPException(status_code=400, detail="Cantidades deben ser mayores a cero")
        if not db.query(Articulo).filter(Articulo.id == it.id_articulo, Articulo.activo == True).first():  # noqa: E712
            raise HTTPException(status_code=400, detail=f"Artículo {it.id_articulo} inexistente")
    ultimo = db.query(func.max(PedidoCotizacion.numero)).filter(PedidoCotizacion.anio == data.anio).scalar() or 0
    p = PedidoCotizacion(anio=data.anio, numero=ultimo + 1, concepto=data.concepto,
                         estado="abierto", creado_por=_quien(current_user))
    db.add(p); db.flush()
    for it in data.items:
        db.add(PedidoCotizacionItem(id_pedido_cotizacion=p.id, id_articulo=it.id_articulo, cantidad=it.cantidad))
    db.commit(); db.refresh(p)
    return _ser_pedcot(p, db, con_cotizaciones=True)


@licitaciones_router.delete("/{id}")
def anular_pedcot(id: int, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "compras_licitar")
    p = db.query(PedidoCotizacion).filter(PedidoCotizacion.id == id, PedidoCotizacion.activo == True).first()  # noqa: E712
    if not p:
        raise HTTPException(status_code=404, detail="Pedido de cotización inexistente")
    if p.estado == "adjudicado":
        raise HTTPException(status_code=409, detail="No se anula un pedido de cotización ya adjudicado")
    p.activo = False; db.commit()
    return {"message": "pedido de cotización anulado"}


# ── Registrar cotización de un proveedor ─────────────────────────────
@licitaciones_router.post("/{id}/cotizaciones", status_code=201)
def registrar_cotizacion(id: int, data: CotizacionIn, db: Session = Depends(get_db),
                         current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "compras_licitar")
    p = db.query(PedidoCotizacion).filter(PedidoCotizacion.id == id, PedidoCotizacion.activo == True).first()  # noqa: E712
    if not p:
        raise HTTPException(status_code=404, detail="Pedido de cotización inexistente")
    if p.estado != "abierto":
        raise HTTPException(status_code=409, detail=f"El pedido está '{p.estado}'; no admite nuevas cotizaciones")
    prov = db.query(Proveedor).filter(Proveedor.id == data.id_proveedor, Proveedor.activo == True).first()  # noqa: E712
    if not prov:
        raise HTTPException(status_code=400, detail="Proveedor inexistente")
    if prov.estado == "suspendido":
        raise HTTPException(status_code=409, detail="El proveedor está suspendido")
    if db.query(Cotizacion).filter(Cotizacion.id_pedido_cotizacion == p.id,
                                   Cotizacion.id_proveedor == prov.id,
                                   Cotizacion.activo == True).first():  # noqa: E712
        raise HTTPException(status_code=409, detail="El proveedor ya cotizó este pedido")
    if not data.items:
        raise HTTPException(status_code=400, detail="La cotización debe tener al menos un ítem")
    # cantidades pedidas por artículo (default para ítems sin cantidad)
    ped_items = {i.id_articulo: Decimal(str(i.cantidad)) for i in
                 db.query(PedidoCotizacionItem).filter(PedidoCotizacionItem.id_pedido_cotizacion == p.id).all()}
    cot = Cotizacion(id_pedido_cotizacion=p.id, id_proveedor=prov.id,
                     observaciones=data.observaciones, total=CERO)
    db.add(cot); db.flush()
    total = CERO
    for it in data.items:
        if it.id_articulo not in ped_items:
            raise HTTPException(status_code=400, detail=f"Artículo {it.id_articulo} no pertenece al pedido")
        if it.precio < 0:
            raise HTTPException(status_code=400, detail="Precio inválido")
        cant = Decimal(str(it.cantidad)) if it.cantidad is not None else ped_items[it.id_articulo]
        db.add(CotizacionItem(id_cotizacion=cot.id, id_articulo=it.id_articulo,
                              precio=it.precio, cantidad=cant))
        total += Decimal(str(it.precio)) * cant
    cot.total = total
    db.commit(); db.refresh(cot)
    return _ser_cotizacion(cot, db)


# ── Acta de apertura: cierra la recepción de ofertas ─────────────────
@licitaciones_router.post("/{id}/apertura")
def apertura(id: int, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "compras_licitar")
    p = db.query(PedidoCotizacion).filter(PedidoCotizacion.id == id, PedidoCotizacion.activo == True).first()  # noqa: E712
    if not p:
        raise HTTPException(status_code=404, detail="Pedido de cotización inexistente")
    if p.estado != "abierto":
        raise HTTPException(status_code=409, detail=f"El pedido ya está '{p.estado}'")
    cots = db.query(Cotizacion).filter(Cotizacion.id_pedido_cotizacion == p.id, Cotizacion.activo == True).all()  # noqa: E712
    p.fecha_apertura = datetime.now(timezone.utc)
    p.estado = "cerrado" if cots else "desierto"
    db.commit(); db.refresh(p)
    return _ser_pedcot(p, db, con_cotizaciones=True)


# ── Cuadro comparativo ───────────────────────────────────────────────
@licitaciones_router.get("/{id}/comparativa")
def comparativa(id: int, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "compras_read")
    p = db.query(PedidoCotizacion).filter(PedidoCotizacion.id == id, PedidoCotizacion.activo == True).first()  # noqa: E712
    if not p:
        raise HTTPException(status_code=404, detail="Pedido de cotización inexistente")
    ped_items = db.query(PedidoCotizacionItem).filter(PedidoCotizacionItem.id_pedido_cotizacion == p.id).all()
    cots = db.query(Cotizacion).filter(Cotizacion.id_pedido_cotizacion == p.id, Cotizacion.activo == True).all()  # noqa: E712
    art_nombres = _art_nombres(db, {i.id_articulo for i in ped_items})
    prov_nombres = _prov_nombres(db, {c.id_proveedor for c in cots})
    # precios[id_articulo][id_proveedor] = precio
    precios = {}
    for c in cots:
        for ci in db.query(CotizacionItem).filter(CotizacionItem.id_cotizacion == c.id).all():
            precios.setdefault(ci.id_articulo, {})[c.id_proveedor] = Decimal(str(ci.precio))
    proveedores = [{"id_proveedor": c.id_proveedor, **prov_nombres.get(c.id_proveedor, {}),
                    "total": float(c.total)} for c in cots]
    filas = []
    for it in ped_items:
        por_prov = precios.get(it.id_articulo, {})
        mejor_prov, mejor_precio = None, None
        for pid, precio in por_prov.items():
            if mejor_precio is None or precio < mejor_precio:
                mejor_prov, mejor_precio = pid, precio
        filas.append({
            "id_articulo": it.id_articulo, "articulo": art_nombres.get(it.id_articulo, {}),
            "cantidad": float(it.cantidad),
            "precios": {str(pid): float(pr) for pid, pr in por_prov.items()},
            "mejor_id_proveedor": mejor_prov,
            "mejor_precio": float(mejor_precio) if mejor_precio is not None else None,
        })
    return {"id": p.id, "pedido_cotizacion": f"COT-{p.anio}-{p.numero:04d}", "estado": p.estado,
            "proveedores": proveedores, "filas": filas}


# ── Adjudicar: elige proveedor(es) y GENERA la(s) OC ─────────────────
@licitaciones_router.post("/{id}/adjudicar")
def adjudicar(id: int, data: AdjudicarIn, db: Session = Depends(get_db),
              current_user: dict = Depends(get_current_user)):
    """Adjudica cada artículo a un proveedor y genera una Orden de Compra por proveedor."""
    _requiere(current_user, "compras_ordenar")  # generar OC exige el permiso de ordenar
    p = db.query(PedidoCotizacion).filter(PedidoCotizacion.id == id, PedidoCotizacion.activo == True).first()  # noqa: E712
    if not p:
        raise HTTPException(status_code=404, detail="Pedido de cotización inexistente")
    if p.estado not in ("abierto", "cerrado"):
        raise HTTPException(status_code=409, detail=f"El pedido está '{p.estado}'; no se puede adjudicar")
    if not data.lineas:
        raise HTTPException(status_code=400, detail="Debe adjudicar al menos un artículo")
    ped_items = {i.id_articulo: Decimal(str(i.cantidad)) for i in
                 db.query(PedidoCotizacionItem).filter(PedidoCotizacionItem.id_pedido_cotizacion == p.id).all()}
    cots = db.query(Cotizacion).filter(Cotizacion.id_pedido_cotizacion == p.id, Cotizacion.activo == True).all()  # noqa: E712
    cots_by_prov = {c.id_proveedor: c for c in cots}
    # precio cotizado por (proveedor, articulo)
    precio_cot = {}
    for c in cots:
        for ci in db.query(CotizacionItem).filter(CotizacionItem.id_cotizacion == c.id).all():
            precio_cot[(c.id_proveedor, ci.id_articulo)] = Decimal(str(ci.precio))

    # agrupar líneas por proveedor
    por_prov = {}
    vistos = set()
    for ln in data.lineas:
        if ln.id_articulo not in ped_items:
            raise HTTPException(status_code=400, detail=f"Artículo {ln.id_articulo} no pertenece al pedido")
        if ln.id_articulo in vistos:
            raise HTTPException(status_code=400, detail=f"Artículo {ln.id_articulo} adjudicado más de una vez")
        vistos.add(ln.id_articulo)
        if ln.id_proveedor not in cots_by_prov:
            raise HTTPException(status_code=400, detail=f"El proveedor {ln.id_proveedor} no cotizó este pedido")
        precio = ln.precio
        if precio is None:
            precio = precio_cot.get((ln.id_proveedor, ln.id_articulo))
            if precio is None:
                raise HTTPException(status_code=400,
                                    detail=f"El proveedor {ln.id_proveedor} no cotizó el artículo {ln.id_articulo}")
        if precio < 0:
            raise HTTPException(status_code=400, detail="Precio inválido")
        por_prov.setdefault(ln.id_proveedor, []).append(
            {"id_articulo": ln.id_articulo, "cantidad": ped_items[ln.id_articulo], "precio": Decimal(str(precio))})

    ocs_generadas = []
    for id_proveedor, items in por_prov.items():
        prov = db.query(Proveedor).filter(Proveedor.id == id_proveedor).first()
        total = sum((it["cantidad"] * it["precio"] for it in items), CERO)
        ultimo = db.query(func.max(OrdenCompra.numero)).filter(OrdenCompra.anio == p.anio).scalar() or 0
        oc = OrdenCompra(anio=p.anio, numero=ultimo + 1, id_pedido=None, id_proveedor=prov.id,
                         proveedor_nombre=prov.nombre, total=total,
                         concepto=f"Adjudicación COT-{p.anio}-{p.numero:04d}" + (f" — {p.concepto}" if p.concepto else ""),
                         estado="emitida", creado_por=_quien(current_user))
        db.add(oc); db.flush()
        for it in items:
            db.add(OrdenCompraItem(id_orden_compra=oc.id, id_articulo=it["id_articulo"],
                                   cantidad=it["cantidad"], precio=it["precio"]))
        ocs_generadas.append({"id": oc.id, "orden_compra": f"OC-{oc.anio}-{oc.numero:04d}",
                              "id_proveedor": prov.id, "proveedor": prov.nombre, "total": float(total)})
    p.estado = "adjudicado"
    if not p.fecha_apertura:
        p.fecha_apertura = datetime.now(timezone.utc)
    db.commit()
    return {"id": p.id, "pedido_cotizacion": f"COT-{p.anio}-{p.numero:04d}",
            "estado": p.estado, "ordenes_compra": ocs_generadas}
