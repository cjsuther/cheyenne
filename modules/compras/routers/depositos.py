import sys
import os
from decimal import Decimal
from typing import Optional

from fastapi import APIRouter, Depends, Query, HTTPException, status
from sqlalchemy.orm import Session
from starlette.requests import Request
from pydantic import BaseModel

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", ".."))
from shared.base_module import create_auth_dependency
from shared.filters import filtered_query

from database import get_db
from config import get_settings
from models.compras import Deposito, StockPorDeposito, MovimientoStock, Articulo

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


def deposito_central(db: Session) -> Deposito:
    """Devuelve (creándolo si hace falta) el depósito central por defecto."""
    dep = db.query(Deposito).filter(Deposito.es_central == True).first()  # noqa: E712
    if not dep:
        dep = db.query(Deposito).filter(Deposito.codigo == "CENTRAL").first()
    if not dep:
        dep = Deposito(codigo="CENTRAL", nombre="Depósito Central", es_central=True, activo=True)
        db.add(dep)
        db.flush()
    return dep


def sumar_stock(db: Session, id_articulo: int, id_deposito: int, cantidad: Decimal):
    """Suma (o resta si negativo) al stock de un depósito. No hace commit."""
    fila = db.query(StockPorDeposito).filter(
        StockPorDeposito.id_articulo == id_articulo,
        StockPorDeposito.id_deposito == id_deposito).first()
    if fila:
        fila.cantidad = Decimal(str(fila.cantidad)) + Decimal(str(cantidad))
    else:
        fila = StockPorDeposito(id_articulo=id_articulo, id_deposito=id_deposito,
                                cantidad=Decimal(str(cantidad)))
        db.add(fila)
    return fila


def _saldo(db: Session, id_articulo: int, id_deposito: int) -> Decimal:
    fila = db.query(StockPorDeposito).filter(
        StockPorDeposito.id_articulo == id_articulo,
        StockPorDeposito.id_deposito == id_deposito).first()
    return Decimal(str(fila.cantidad)) if fila else CERO


def _art_nombres(db, ids):
    if not ids:
        return {}
    return {a.id: {"id": a.id, "codigo": a.codigo, "nombre": a.nombre, "unidad": a.unidad}
            for a in db.query(Articulo).filter(Articulo.id.in_(list(ids))).all()}


# ═══ Depósitos (maestro) ═════════════════════════════════════════════
depositos_router = APIRouter(prefix="/depositos", tags=["Depósitos"])
_D = ["id", "codigo", "nombre", "es_central", "activo"]


class DepositoIn(BaseModel):
    codigo: str
    nombre: str
    es_central: bool = False
    activo: bool = True


@depositos_router.get("")
def listar_dep(request: Request, skip: int = Query(0, ge=0), limit: int = Query(50, ge=1, le=200),
               db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "compras_read")
    deposito_central(db); db.commit()  # asegura que exista el central
    q = filtered_query(db.query(Deposito), Deposito, dict(request.query_params),
                       exclude={"skip", "limit"}, default_sort="codigo")
    return [{c: getattr(x, c) for c in _D} for x in q.offset(skip).limit(limit).all()]


@depositos_router.post("", status_code=201)
def crear_dep(data: DepositoIn, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "compras_deposito")
    if db.query(Deposito).filter(Deposito.codigo == data.codigo.strip()).first():
        raise HTTPException(status_code=409, detail=f"Ya existe el depósito {data.codigo}")
    if data.es_central:
        for d in db.query(Deposito).filter(Deposito.es_central == True).all():  # noqa: E712
            d.es_central = False
    x = Deposito(**data.model_dump()); db.add(x); db.commit(); db.refresh(x)
    return {c: getattr(x, c) for c in _D}


@depositos_router.put("/{id}")
def edit_dep(id: int, data: DepositoIn, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "compras_deposito")
    x = db.query(Deposito).filter(Deposito.id == id).first()
    if not x:
        raise HTTPException(status_code=404, detail="Depósito inexistente")
    if data.es_central and not x.es_central:
        for d in db.query(Deposito).filter(Deposito.es_central == True).all():  # noqa: E712
            d.es_central = False
    for k, v in data.model_dump().items():
        setattr(x, k, v)
    db.commit()
    return {c: getattr(x, c) for c in _D}


@depositos_router.delete("/{id}")
def del_dep(id: int, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "compras_deposito")
    x = db.query(Deposito).filter(Deposito.id == id).first()
    if not x:
        raise HTTPException(status_code=404, detail="Depósito inexistente")
    if x.es_central:
        raise HTTPException(status_code=409, detail="No se puede dar de baja el depósito central")
    x.activo = False; db.commit()
    return {"message": "dado de baja"}


# ═══ Stock por depósito ══════════════════════════════════════════════
@depositos_router.get("/stock")
def stock_por_deposito(id_deposito: Optional[int] = Query(None), id_articulo: Optional[int] = Query(None),
                       db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "compras_read")
    q = db.query(StockPorDeposito)
    if id_deposito:
        q = q.filter(StockPorDeposito.id_deposito == id_deposito)
    if id_articulo:
        q = q.filter(StockPorDeposito.id_articulo == id_articulo)
    filas = q.all()
    nombres = _art_nombres(db, {s.id_articulo for s in filas})
    deps = {d.id: {"id": d.id, "codigo": d.codigo, "nombre": d.nombre}
            for d in db.query(Deposito).all()}
    return [{"id_articulo": s.id_articulo, "articulo": nombres.get(s.id_articulo, {}),
             "id_deposito": s.id_deposito, "deposito": deps.get(s.id_deposito, {}),
             "cantidad": float(s.cantidad)}
            for s in filas if s.cantidad and float(s.cantidad) != 0]


# ═══ Movimientos de stock ════════════════════════════════════════════
movimientos_router = APIRouter(prefix="/movimientos-stock", tags=["Movimientos de stock"])


class TransferIn(BaseModel):
    id_articulo: int
    id_deposito_origen: int
    id_deposito_destino: int
    cantidad: Decimal
    motivo: Optional[str] = None


class AjusteIn(BaseModel):
    id_articulo: int
    id_deposito: int
    cantidad: Decimal   # + suma, - resta
    motivo: str


class SalidaIn(BaseModel):
    id_articulo: int
    id_deposito: int
    cantidad: Decimal   # positivo, se descuenta
    motivo: Optional[str] = None


def _ser_mov(m: MovimientoStock):
    return {"id": m.id, "tipo": m.tipo, "id_articulo": m.id_articulo,
            "id_deposito_origen": m.id_deposito_origen, "id_deposito_destino": m.id_deposito_destino,
            "cantidad": float(m.cantidad), "motivo": m.motivo,
            "usuario_nombre": m.usuario_nombre, "created_at": m.created_at}


@movimientos_router.get("")
def listar_mov(request: Request, id_articulo: Optional[int] = Query(None),
               skip: int = Query(0, ge=0), limit: int = Query(50, ge=1, le=200),
               db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "compras_read")
    q = db.query(MovimientoStock)
    if id_articulo:
        q = q.filter(MovimientoStock.id_articulo == id_articulo)
    q = filtered_query(q, MovimientoStock, dict(request.query_params),
                       exclude={"skip", "limit", "id_articulo"}, default_sort="id", default_dir="desc")
    return [_ser_mov(m) for m in q.offset(skip).limit(limit).all()]


def _validar_art_dep(db, id_articulo, *dep_ids):
    if not db.query(Articulo).filter(Articulo.id == id_articulo, Articulo.activo == True).first():  # noqa: E712
        raise HTTPException(status_code=400, detail=f"Artículo {id_articulo} inexistente")
    for did in dep_ids:
        if did is None:
            continue
        if not db.query(Deposito).filter(Deposito.id == did, Deposito.activo == True).first():  # noqa: E712
            raise HTTPException(status_code=400, detail=f"Depósito {did} inexistente")


@movimientos_router.post("/transferencia", status_code=201)
def transferir(data: TransferIn, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "compras_deposito")
    if data.cantidad <= 0:
        raise HTTPException(status_code=400, detail="Cantidad debe ser mayor a cero")
    if data.id_deposito_origen == data.id_deposito_destino:
        raise HTTPException(status_code=400, detail="Origen y destino deben ser distintos")
    _validar_art_dep(db, data.id_articulo, data.id_deposito_origen, data.id_deposito_destino)
    saldo = _saldo(db, data.id_articulo, data.id_deposito_origen)
    if data.cantidad > saldo:
        raise HTTPException(status_code=409, detail=f"Saldo insuficiente en origen (disponible {saldo})")
    sumar_stock(db, data.id_articulo, data.id_deposito_origen, -data.cantidad)
    sumar_stock(db, data.id_articulo, data.id_deposito_destino, data.cantidad)
    m = MovimientoStock(tipo="transferencia", id_articulo=data.id_articulo,
                        id_deposito_origen=data.id_deposito_origen,
                        id_deposito_destino=data.id_deposito_destino,
                        cantidad=data.cantidad, motivo=data.motivo, usuario_nombre=_quien(current_user))
    db.add(m); db.commit(); db.refresh(m)
    return _ser_mov(m)


@movimientos_router.post("/ajuste", status_code=201)
def ajustar(data: AjusteIn, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "compras_deposito")
    if data.cantidad == 0:
        raise HTTPException(status_code=400, detail="El ajuste no puede ser cero")
    if not (data.motivo or "").strip():
        raise HTTPException(status_code=400, detail="El ajuste requiere un motivo")
    _validar_art_dep(db, data.id_articulo, data.id_deposito)
    if data.cantidad < 0:
        saldo = _saldo(db, data.id_articulo, data.id_deposito)
        if -data.cantidad > saldo:
            raise HTTPException(status_code=409, detail=f"No se puede ajustar por debajo de cero (saldo {saldo})")
    sumar_stock(db, data.id_articulo, data.id_deposito, data.cantidad)
    m = MovimientoStock(tipo="ajuste", id_articulo=data.id_articulo,
                        id_deposito_destino=data.id_deposito if data.cantidad > 0 else None,
                        id_deposito_origen=data.id_deposito if data.cantidad < 0 else None,
                        cantidad=abs(data.cantidad), motivo=data.motivo, usuario_nombre=_quien(current_user))
    db.add(m); db.commit(); db.refresh(m)
    return _ser_mov(m)


@movimientos_router.post("/salida", status_code=201)
def salida(data: SalidaIn, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "compras_deposito")
    if data.cantidad <= 0:
        raise HTTPException(status_code=400, detail="Cantidad debe ser mayor a cero")
    _validar_art_dep(db, data.id_articulo, data.id_deposito)
    saldo = _saldo(db, data.id_articulo, data.id_deposito)
    if data.cantidad > saldo:
        raise HTTPException(status_code=409, detail=f"Saldo insuficiente (disponible {saldo})")
    sumar_stock(db, data.id_articulo, data.id_deposito, -data.cantidad)
    m = MovimientoStock(tipo="salida", id_articulo=data.id_articulo,
                        id_deposito_origen=data.id_deposito, cantidad=data.cantidad,
                        motivo=data.motivo, usuario_nombre=_quien(current_user))
    db.add(m); db.commit(); db.refresh(m)
    return _ser_mov(m)
