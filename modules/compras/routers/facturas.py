import sys
import os
from decimal import Decimal
from typing import Optional, List

from fastapi import APIRouter, Depends, Query, HTTPException, status
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
    FacturaProveedor, FacturaItem,
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
    return {a.id: {"id": a.id, "codigo": a.codigo, "nombre": a.nombre, "unidad": a.unidad}
            for a in db.query(Articulo).filter(Articulo.id.in_(list(ids))).all()}


facturas_router = APIRouter(prefix="/facturas", tags=["Facturas de proveedor"])


class FacturaItemIn(BaseModel):
    id_articulo: int
    cantidad: Decimal
    precio: Decimal


class FacturaIn(BaseModel):
    id_proveedor: int
    id_orden_compra: Optional[int] = None
    numero: str
    total: Optional[Decimal] = None    # si trae items, se recalcula
    items: Optional[List[FacturaItemIn]] = None


def _ser_factura(f: FacturaProveedor, db, con_items=True):
    prov = db.query(Proveedor).filter(Proveedor.id == f.id_proveedor).first()
    oc = db.query(OrdenCompra).filter(OrdenCompra.id == f.id_orden_compra).first() if f.id_orden_compra else None
    out = {
        "id": f.id, "id_proveedor": f.id_proveedor,
        "proveedor": {"id": prov.id, "codigo": prov.codigo, "nombre": prov.nombre} if prov else None,
        "id_orden_compra": f.id_orden_compra,
        "orden_compra": f"OC-{oc.anio}-{oc.numero:04d}" if oc else None,
        "numero": f.numero, "fecha": f.fecha, "total": float(f.total),
        "estado": f.estado, "conformada_por": f.conformada_por, "creado_por": f.creado_por,
        "created_at": f.created_at,
    }
    if con_items:
        items = db.query(FacturaItem).filter(FacturaItem.id_factura == f.id).all()
        nombres = _art_nombres(db, {i.id_articulo for i in items})
        out["items"] = [{"id": i.id, "id_articulo": i.id_articulo, "articulo": nombres.get(i.id_articulo, {}),
                         "cantidad": float(i.cantidad), "precio": float(i.precio),
                         "subtotal": float(Decimal(str(i.cantidad)) * Decimal(str(i.precio)))} for i in items]
    return out


@facturas_router.get("")
def listar_facturas(request: Request, id_proveedor: int = Query(None), id_orden_compra: int = Query(None),
                    estado: str = Query(None), skip: int = Query(0, ge=0), limit: int = Query(50, ge=1, le=200),
                    db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "compras_read")
    q = db.query(FacturaProveedor).filter(FacturaProveedor.activo == True)  # noqa: E712
    if id_proveedor:
        q = q.filter(FacturaProveedor.id_proveedor == id_proveedor)
    if id_orden_compra:
        q = q.filter(FacturaProveedor.id_orden_compra == id_orden_compra)
    if estado:
        q = q.filter(FacturaProveedor.estado == estado)
    q = filtered_query(q, FacturaProveedor, dict(request.query_params),
                       exclude={"skip", "limit", "id_proveedor", "id_orden_compra", "estado"},
                       default_sort="id", default_dir="desc")
    return [_ser_factura(f, db, con_items=False) for f in q.offset(skip).limit(limit).all()]


@facturas_router.get("/{id}")
def obtener_factura(id: int, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "compras_read")
    f = db.query(FacturaProveedor).filter(FacturaProveedor.id == id, FacturaProveedor.activo == True).first()  # noqa: E712
    if not f:
        raise HTTPException(status_code=404, detail="Factura inexistente")
    return _ser_factura(f, db)


@facturas_router.post("", status_code=201)
def registrar_factura(data: FacturaIn, db: Session = Depends(get_db),
                      current_user: dict = Depends(get_current_user)):
    """Registra una factura de proveedor, opcionalmente contra una OC.
    Si viene contra una OC valida que el total no supere lo ordenado y lo ya facturado."""
    _requiere(current_user, "compras_facturar")
    prov = db.query(Proveedor).filter(Proveedor.id == data.id_proveedor, Proveedor.activo == True).first()  # noqa: E712
    if not prov:
        raise HTTPException(status_code=400, detail="Proveedor inexistente")
    if not (data.numero or "").strip():
        raise HTTPException(status_code=400, detail="La factura requiere número")

    # total (por items si vienen, o campo total)
    items = data.items or []
    for it in items:
        if it.cantidad <= 0 or it.precio < 0:
            raise HTTPException(status_code=400, detail="Cantidad/precio inválidos")
    total = sum((Decimal(str(it.cantidad)) * Decimal(str(it.precio)) for it in items), CERO) if items \
        else (Decimal(str(data.total)) if data.total is not None else None)
    if total is None:
        raise HTTPException(status_code=400, detail="Indique el total o los ítems de la factura")
    if total <= 0:
        raise HTTPException(status_code=400, detail="El total de la factura debe ser mayor a cero")

    oc = None
    if data.id_orden_compra:
        oc = db.query(OrdenCompra).filter(OrdenCompra.id == data.id_orden_compra, OrdenCompra.activo == True).first()  # noqa: E712
        if not oc:
            raise HTTPException(status_code=400, detail="OC inexistente")
        if oc.estado == "anulada":
            raise HTTPException(status_code=409, detail="La OC está anulada")
        if oc.id_proveedor != prov.id:
            raise HTTPException(status_code=409, detail="La OC pertenece a otro proveedor")
        # tope: monto recibido si hubo recepciones, si no el ordenado
        oc_items = db.query(OrdenCompraItem).filter(OrdenCompraItem.id_orden_compra == oc.id).all()
        recibido = sum((Decimal(str(i.cantidad_recibida)) * Decimal(str(i.precio)) for i in oc_items), CERO)
        ordenado = Decimal(str(oc.total))
        tope = recibido if recibido > 0 else ordenado
        # lo ya facturado (no anulado) contra esta OC
        ya_facturado = CERO
        for fx in db.query(FacturaProveedor).filter(
                FacturaProveedor.id_orden_compra == oc.id,
                FacturaProveedor.activo == True,  # noqa: E712
                FacturaProveedor.estado != "anulada").all():
            ya_facturado += Decimal(str(fx.total))
        if total + ya_facturado > tope:
            disponible = tope - ya_facturado
            raise HTTPException(status_code=409,
                                detail=f"La factura ({total}) supera el saldo facturable de la OC "
                                       f"(tope {tope}, ya facturado {ya_facturado}, disponible {disponible})")

    f = FacturaProveedor(id_proveedor=prov.id, id_orden_compra=(oc.id if oc else None),
                         numero=data.numero.strip(), total=total, estado="registrada",
                         creado_por=_quien(current_user))
    db.add(f); db.flush()
    for it in items:
        db.add(FacturaItem(id_factura=f.id, id_articulo=it.id_articulo,
                           cantidad=it.cantidad, precio=it.precio))
    db.commit(); db.refresh(f)
    return _ser_factura(f, db)


@facturas_router.post("/{id}/conformar")
def conformar_factura(id: int, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    """Conforma la factura (apta para que Contaduría la tome como respaldo del devengado)."""
    _requiere(current_user, "compras_facturar")
    f = db.query(FacturaProveedor).filter(FacturaProveedor.id == id, FacturaProveedor.activo == True).first()  # noqa: E712
    if not f:
        raise HTTPException(status_code=404, detail="Factura inexistente")
    if f.estado != "registrada":
        raise HTTPException(status_code=409, detail=f"La factura está '{f.estado}'")
    f.estado = "conformada"
    f.conformada_por = _quien(current_user)
    db.commit(); db.refresh(f)
    return _ser_factura(f, db)


@facturas_router.post("/{id}/anular")
def anular_factura(id: int, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "compras_facturar")
    f = db.query(FacturaProveedor).filter(FacturaProveedor.id == id, FacturaProveedor.activo == True).first()  # noqa: E712
    if not f:
        raise HTTPException(status_code=404, detail="Factura inexistente")
    if f.estado == "conformada":
        raise HTTPException(status_code=409, detail="No se anula una factura ya conformada")
    f.estado = "anulada"
    db.commit(); db.refresh(f)
    return _ser_factura(f, db)
