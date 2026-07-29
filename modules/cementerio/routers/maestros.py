import sys
import os
from datetime import date, datetime, timezone
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
from models.cementerio import (
    Sepultura, Concesion, Difunto,
    TIPOS_SEPULTURA, ESTADOS_SEPULTURA, ESTADOS_CONCESION,
)

settings = get_settings()
get_current_user = create_auth_dependency(settings.seguridad_url)


def _requiere(cu, permiso):
    if cu.get("superuser"):
        return
    if permiso not in [p["codigo"] for p in cu.get("permisos", [])]:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=f"No tiene el permiso '{permiso}'")


# ── Sepulturas ───────────────────────────────────────────────────────
sepulturas_router = APIRouter(prefix="/sepulturas", tags=["Sepulturas"])
_S = ["id", "tipo", "seccion", "fila", "numero", "estado", "observaciones", "activo"]


class SepulturaIn(BaseModel):
    tipo: str
    seccion: Optional[str] = None
    fila: Optional[str] = None
    numero: str
    estado: str = "libre"
    observaciones: Optional[str] = None
    activo: bool = True


def _valida_sepultura(data: SepulturaIn):
    if data.tipo not in TIPOS_SEPULTURA:
        raise HTTPException(status_code=400, detail=f"Tipo inválido: {data.tipo}")
    if data.estado not in ESTADOS_SEPULTURA:
        raise HTTPException(status_code=400, detail=f"Estado inválido: {data.estado}")


@sepulturas_router.get("")
def listar_sepulturas(request: Request, skip: int = Query(0, ge=0), limit: int = Query(50, ge=1, le=200),
                      db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "cementerio_read")
    q = filtered_query(db.query(Sepultura), Sepultura, dict(request.query_params),
                       exclude={"skip", "limit"}, default_sort="numero")
    return [{c: getattr(x, c) for c in _S} for x in q.offset(skip).limit(limit).all()]


@sepulturas_router.post("", status_code=201)
def crear_sepultura(data: SepulturaIn, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "cementerio_write")
    _valida_sepultura(data)
    x = Sepultura(**data.model_dump()); db.add(x); db.commit(); db.refresh(x)
    return {c: getattr(x, c) for c in _S}


@sepulturas_router.put("/{id}")
def editar_sepultura(id: int, data: SepulturaIn, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "cementerio_write")
    _valida_sepultura(data)
    x = db.query(Sepultura).filter(Sepultura.id == id).first()
    if not x:
        raise HTTPException(status_code=404, detail="Sepultura inexistente")
    for k, v in data.model_dump().items():
        setattr(x, k, v)
    db.commit()
    return {c: getattr(x, c) for c in _S}


@sepulturas_router.delete("/{id}")
def baja_sepultura(id: int, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "cementerio_delete")
    x = db.query(Sepultura).filter(Sepultura.id == id).first()
    if not x:
        raise HTTPException(status_code=404, detail="Sepultura inexistente")
    x.activo = False; db.commit()
    return {"message": "dada de baja"}


# ── Concesiones ──────────────────────────────────────────────────────
concesiones_router = APIRouter(prefix="/concesiones", tags=["Concesiones"])
_C = ["id", "id_sepultura", "id_contribuyente", "titular_nombre", "titular_documento",
      "fecha_desde", "fecha_hasta", "anios", "estado", "acto", "observaciones", "activo"]


class ConcesionIn(BaseModel):
    id_sepultura: int
    id_contribuyente: Optional[int] = None
    titular_nombre: str
    titular_documento: Optional[str] = None
    fecha_desde: Optional[date] = None
    fecha_hasta: Optional[date] = None
    anios: Optional[int] = None
    estado: str = "vigente"
    acto: Optional[str] = None
    observaciones: Optional[str] = None
    activo: bool = True


def _ser_concesion(c: Concesion, db):
    d = {col: getattr(c, col) for col in _C}
    sep = db.query(Sepultura).filter(Sepultura.id == c.id_sepultura).first()
    d["sepultura"] = {"id": sep.id, "tipo": sep.tipo, "seccion": sep.seccion,
                      "fila": sep.fila, "numero": sep.numero, "estado": sep.estado} if sep else None
    return d


@concesiones_router.get("")
def listar_concesiones(request: Request, skip: int = Query(0, ge=0), limit: int = Query(50, ge=1, le=200),
                       db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "cementerio_read")
    q = filtered_query(db.query(Concesion), Concesion, dict(request.query_params),
                       exclude={"skip", "limit"}, default_sort="id")
    return [_ser_concesion(x, db) for x in q.offset(skip).limit(limit).all()]


@concesiones_router.get("/{id}")
def ver_concesion(id: int, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "cementerio_read")
    c = db.query(Concesion).filter(Concesion.id == id).first()
    if not c:
        raise HTTPException(status_code=404, detail="Concesión inexistente")
    return _ser_concesion(c, db)


@concesiones_router.post("", status_code=201)
def crear_concesion(data: ConcesionIn, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "cementerio_write")
    if data.estado not in ESTADOS_CONCESION:
        raise HTTPException(status_code=400, detail=f"Estado inválido: {data.estado}")
    sep = db.query(Sepultura).filter(Sepultura.id == data.id_sepultura, Sepultura.activo == True).first()
    if not sep:
        raise HTTPException(status_code=404, detail="Sepultura inexistente")
    # Verificación de sepultura libre: no debe estar ocupada ni tener otra concesión vigente
    if sep.estado == "ocupada":
        raise HTTPException(status_code=409, detail=f"La sepultura {sep.numero} está ocupada")
    existe = db.query(Concesion).filter(
        Concesion.id_sepultura == sep.id, Concesion.estado == "vigente", Concesion.activo == True
    ).first()
    if existe:
        raise HTTPException(status_code=409, detail=f"La sepultura {sep.numero} ya tiene una concesión vigente")
    x = Concesion(**data.model_dump())
    db.add(x)
    # Reserva la sepultura si estaba libre
    if sep.estado == "libre":
        sep.estado = "reservada"
    db.commit(); db.refresh(x)
    return _ser_concesion(x, db)


@concesiones_router.put("/{id}")
def editar_concesion(id: int, data: ConcesionIn, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "cementerio_write")
    if data.estado not in ESTADOS_CONCESION:
        raise HTTPException(status_code=400, detail=f"Estado inválido: {data.estado}")
    c = db.query(Concesion).filter(Concesion.id == id).first()
    if not c:
        raise HTTPException(status_code=404, detail="Concesión inexistente")
    for k, v in data.model_dump().items():
        setattr(c, k, v)
    db.commit()
    return _ser_concesion(c, db)


@concesiones_router.delete("/{id}")
def baja_concesion(id: int, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "cementerio_delete")
    c = db.query(Concesion).filter(Concesion.id == id).first()
    if not c:
        raise HTTPException(status_code=404, detail="Concesión inexistente")
    c.activo = False; c.estado = "caduca"; db.commit()
    return {"message": "dada de baja"}


# ── Difuntos ─────────────────────────────────────────────────────────
difuntos_router = APIRouter(prefix="/difuntos", tags=["Difuntos"])
_D = ["id", "nombre", "documento", "fecha_fallecimiento", "fecha_inhumacion",
      "id_sepultura", "observaciones", "activo"]


class DifuntoIn(BaseModel):
    nombre: str
    documento: Optional[str] = None
    fecha_fallecimiento: Optional[date] = None
    fecha_inhumacion: Optional[date] = None
    observaciones: Optional[str] = None
    activo: bool = True


def _ser_difunto(x: Difunto, db):
    d = {c: getattr(x, c) for c in _D}
    if x.id_sepultura:
        sep = db.query(Sepultura).filter(Sepultura.id == x.id_sepultura).first()
        d["sepultura"] = {"id": sep.id, "tipo": sep.tipo, "seccion": sep.seccion,
                          "fila": sep.fila, "numero": sep.numero} if sep else None
    else:
        d["sepultura"] = None
    return d


@difuntos_router.get("")
def listar_difuntos(request: Request, skip: int = Query(0, ge=0), limit: int = Query(50, ge=1, le=200),
                    db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "cementerio_read")
    q = filtered_query(db.query(Difunto), Difunto, dict(request.query_params),
                       exclude={"skip", "limit"}, default_sort="nombre")
    return [_ser_difunto(x, db) for x in q.offset(skip).limit(limit).all()]


@difuntos_router.post("", status_code=201)
def crear_difunto(data: DifuntoIn, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "cementerio_write")
    x = Difunto(**data.model_dump()); db.add(x); db.commit(); db.refresh(x)
    return _ser_difunto(x, db)


@difuntos_router.put("/{id}")
def editar_difunto(id: int, data: DifuntoIn, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "cementerio_write")
    x = db.query(Difunto).filter(Difunto.id == id).first()
    if not x:
        raise HTTPException(status_code=404, detail="Difunto inexistente")
    for k, v in data.model_dump().items():
        setattr(x, k, v)
    db.commit()
    return _ser_difunto(x, db)


@difuntos_router.delete("/{id}")
def baja_difunto(id: int, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "cementerio_delete")
    x = db.query(Difunto).filter(Difunto.id == id).first()
    if not x:
        raise HTTPException(status_code=404, detail="Difunto inexistente")
    x.activo = False; db.commit()
    return {"message": "dado de baja"}
