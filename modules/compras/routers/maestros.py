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
from models.compras import Proveedor, Articulo

settings = get_settings()
get_current_user = create_auth_dependency(settings.seguridad_url)


def _requiere(cu, permiso):
    if cu.get("superuser"):
        return
    if permiso not in [p["codigo"] for p in cu.get("permisos", [])]:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=f"No tiene el permiso '{permiso}'")


# ── Proveedores ──────────────────────────────────────────────────────
proveedores_router = APIRouter(prefix="/proveedores", tags=["Proveedores"])
_P = ["id", "codigo", "nombre", "cuit", "rubro", "activo"]


class ProveedorIn(BaseModel):
    codigo: str
    nombre: str
    cuit: Optional[str] = None
    rubro: Optional[str] = None
    activo: bool = True


@proveedores_router.get("")
def listar_prov(request: Request, skip: int = Query(0, ge=0), limit: int = Query(50, ge=1, le=200),
                db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "compras_read")
    q = filtered_query(db.query(Proveedor), Proveedor, dict(request.query_params),
                       exclude={"skip", "limit"}, default_sort="codigo")
    return [{c: getattr(x, c) for c in _P} for x in q.offset(skip).limit(limit).all()]


@proveedores_router.post("", status_code=201)
def crear_prov(data: ProveedorIn, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "compras_write")
    if db.query(Proveedor).filter(Proveedor.codigo == data.codigo.strip()).first():
        raise HTTPException(status_code=409, detail=f"Ya existe el proveedor {data.codigo}")
    x = Proveedor(**data.model_dump()); db.add(x); db.commit(); db.refresh(x)
    return {c: getattr(x, c) for c in _P}


@proveedores_router.put("/{id}")
def edit_prov(id: int, data: ProveedorIn, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "compras_write")
    x = db.query(Proveedor).filter(Proveedor.id == id).first()
    if not x:
        raise HTTPException(status_code=404, detail="Proveedor inexistente")
    for k, v in data.model_dump().items():
        setattr(x, k, v)
    db.commit()
    return {c: getattr(x, c) for c in _P}


@proveedores_router.delete("/{id}")
def del_prov(id: int, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "compras_delete")
    x = db.query(Proveedor).filter(Proveedor.id == id).first()
    if not x:
        raise HTTPException(status_code=404, detail="Proveedor inexistente")
    x.activo = False; db.commit()
    return {"message": "dado de baja"}


# ── Artículos ────────────────────────────────────────────────────────
articulos_router = APIRouter(prefix="/articulos", tags=["Artículos"])
_A = ["id", "codigo", "nombre", "unidad", "precio_referencia", "activo"]


class ArticuloIn(BaseModel):
    codigo: str
    nombre: str
    unidad: Optional[str] = None
    precio_referencia: Decimal = Decimal("0")
    activo: bool = True


@articulos_router.get("")
def listar_art(request: Request, skip: int = Query(0, ge=0), limit: int = Query(50, ge=1, le=200),
               db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "compras_read")
    q = filtered_query(db.query(Articulo), Articulo, dict(request.query_params),
                       exclude={"skip", "limit"}, default_sort="codigo")
    return [{c: getattr(x, c) for c in _A} for x in q.offset(skip).limit(limit).all()]


@articulos_router.post("", status_code=201)
def crear_art(data: ArticuloIn, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "compras_write")
    if db.query(Articulo).filter(Articulo.codigo == data.codigo.strip()).first():
        raise HTTPException(status_code=409, detail=f"Ya existe el artículo {data.codigo}")
    x = Articulo(**data.model_dump()); db.add(x); db.commit(); db.refresh(x)
    return {c: getattr(x, c) for c in _A}


@articulos_router.put("/{id}")
def edit_art(id: int, data: ArticuloIn, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "compras_write")
    x = db.query(Articulo).filter(Articulo.id == id).first()
    if not x:
        raise HTTPException(status_code=404, detail="Artículo inexistente")
    for k, v in data.model_dump().items():
        setattr(x, k, v)
    db.commit()
    return {c: getattr(x, c) for c in _A}


@articulos_router.delete("/{id}")
def del_art(id: int, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "compras_delete")
    x = db.query(Articulo).filter(Articulo.id == id).first()
    if not x:
        raise HTTPException(status_code=404, detail="Artículo inexistente")
    x.activo = False; db.commit()
    return {"message": "dado de baja"}
