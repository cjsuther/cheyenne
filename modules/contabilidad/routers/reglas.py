import sys
import os
from typing import Optional, List

from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", ".."))

from database import get_db
from models.transacciones import Transaccion, ReglaImputacion, ReglaLinea, MapeoCuenta
from ._common import get_current_user, _requiere, _quien
from .transacciones import imputar

reglas_router = APIRouter(prefix="/reglas-imputacion", tags=["Reglas de imputación"])
mapeo_router = APIRouter(prefix="/mapeo-cuentas", tags=["Mapeo de cuentas"])


# ═══ Reglas de imputación ════════════════════════════════════════════
class LineaReglaIn(BaseModel):
    orden: int = 1
    lado: str                                   # debe / haber
    origen_cuenta: str = "fija"                  # fija / derivada
    cuenta_codigo: Optional[str] = None
    dimension: Optional[str] = None
    importe_campo: str = "importe"
    detalle: Optional[str] = None


class ReglaIn(BaseModel):
    tipo: str
    descripcion: Optional[str] = None
    activo: bool = True
    lineas: List[LineaReglaIn] = []


def _ser_regla(r: ReglaImputacion, db):
    lineas = db.query(ReglaLinea).filter(ReglaLinea.id_regla == r.id).order_by(ReglaLinea.orden).all()
    return {
        "id": r.id, "tipo": r.tipo, "descripcion": r.descripcion, "activo": r.activo,
        "lineas": [{"id": l.id, "orden": l.orden, "lado": l.lado, "origen_cuenta": l.origen_cuenta,
                    "cuenta_codigo": l.cuenta_codigo, "dimension": l.dimension,
                    "importe_campo": l.importe_campo, "detalle": l.detalle} for l in lineas],
    }


def _validar_lineas(lineas):
    if not lineas:
        raise HTTPException(status_code=400, detail="La regla debe tener al menos una línea")
    for l in lineas:
        if l.lado not in ("debe", "haber"):
            raise HTTPException(status_code=400, detail="lado debe ser 'debe' o 'haber'")
        if l.origen_cuenta == "fija" and not l.cuenta_codigo:
            raise HTTPException(status_code=400, detail="Una línea fija requiere cuenta_codigo")
        if l.origen_cuenta == "derivada" and not l.dimension:
            raise HTTPException(status_code=400, detail="Una línea derivada requiere dimensión")


@reglas_router.get("")
def listar_reglas(db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "contabilidad_read")
    return [_ser_regla(r, db) for r in db.query(ReglaImputacion).order_by(ReglaImputacion.tipo).all()]


@reglas_router.post("", status_code=201)
def crear_regla(data: ReglaIn, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "contabilidad_reglas")
    _validar_lineas(data.lineas)
    if db.query(ReglaImputacion).filter(ReglaImputacion.tipo == data.tipo.strip()).first():
        raise HTTPException(status_code=409, detail=f"Ya existe una regla para el tipo '{data.tipo}'")
    r = ReglaImputacion(tipo=data.tipo.strip(), descripcion=data.descripcion, activo=data.activo)
    db.add(r); db.flush()
    for l in data.lineas:
        db.add(ReglaLinea(id_regla=r.id, orden=l.orden, lado=l.lado, origen_cuenta=l.origen_cuenta,
                          cuenta_codigo=l.cuenta_codigo, dimension=l.dimension,
                          importe_campo=l.importe_campo, detalle=l.detalle))
    db.commit(); db.refresh(r)
    return _ser_regla(r, db)


@reglas_router.put("/{id}")
def editar_regla(id: int, data: ReglaIn, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "contabilidad_reglas")
    r = db.query(ReglaImputacion).filter(ReglaImputacion.id == id).first()
    if not r:
        raise HTTPException(status_code=404, detail="Regla inexistente")
    _validar_lineas(data.lineas)
    r.tipo = data.tipo.strip(); r.descripcion = data.descripcion; r.activo = data.activo
    db.query(ReglaLinea).filter(ReglaLinea.id_regla == r.id).delete(synchronize_session=False)
    for l in data.lineas:
        db.add(ReglaLinea(id_regla=r.id, orden=l.orden, lado=l.lado, origen_cuenta=l.origen_cuenta,
                          cuenta_codigo=l.cuenta_codigo, dimension=l.dimension,
                          importe_campo=l.importe_campo, detalle=l.detalle))
    db.commit(); db.refresh(r)
    return _ser_regla(r, db)


@reglas_router.delete("/{id}")
def borrar_regla(id: int, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "contabilidad_reglas")
    r = db.query(ReglaImputacion).filter(ReglaImputacion.id == id).first()
    if not r:
        raise HTTPException(status_code=404, detail="Regla inexistente")
    r.activo = False; db.commit()
    return {"message": "regla desactivada"}


@reglas_router.post("/{id}/reprocesar-pendientes")
def reprocesar_pendientes(id: int, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    """Tras definir/activar la regla, reintenta imputar todas las transacciones pendientes de ese tipo."""
    _requiere(current_user, "contabilidad_asentar")
    r = db.query(ReglaImputacion).filter(ReglaImputacion.id == id).first()
    if not r:
        raise HTTPException(status_code=404, detail="Regla inexistente")
    pendientes = db.query(Transaccion).filter(
        Transaccion.tipo == r.tipo, Transaccion.estado.in_(["sin_regla", "error"])).all()
    ok = err = 0
    for tx in pendientes:
        imputar(db, tx, _quien(current_user))
        if tx.estado == "imputada":
            ok += 1
        else:
            err += 1
    db.commit()
    return {"tipo": r.tipo, "reprocesadas": len(pendientes), "imputadas": ok, "siguen_pendientes": err}


# ═══ Mapeo de cuentas (derivación) ═══════════════════════════════════
class MapeoIn(BaseModel):
    dimension: str
    clave: str
    cuenta_codigo: str
    activo: bool = True


def _ser_mapeo(m: MapeoCuenta):
    return {"id": m.id, "dimension": m.dimension, "clave": m.clave,
            "cuenta_codigo": m.cuenta_codigo, "activo": m.activo}


@mapeo_router.get("")
def listar_mapeo(dimension: str = Query(None), db: Session = Depends(get_db),
                 current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "contabilidad_read")
    q = db.query(MapeoCuenta)
    if dimension:
        q = q.filter(MapeoCuenta.dimension == dimension)
    return [_ser_mapeo(m) for m in q.order_by(MapeoCuenta.dimension, MapeoCuenta.clave).all()]


@mapeo_router.post("", status_code=201)
def crear_mapeo(data: MapeoIn, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "contabilidad_reglas")
    ex = db.query(MapeoCuenta).filter(
        MapeoCuenta.dimension == data.dimension.strip(), MapeoCuenta.clave == data.clave.strip()).first()
    if ex:
        ex.cuenta_codigo = data.cuenta_codigo.strip(); ex.activo = data.activo; db.commit()
        return _ser_mapeo(ex)
    m = MapeoCuenta(dimension=data.dimension.strip(), clave=data.clave.strip(),
                    cuenta_codigo=data.cuenta_codigo.strip(), activo=data.activo)
    db.add(m); db.commit(); db.refresh(m)
    return _ser_mapeo(m)


@mapeo_router.put("/{id}")
def editar_mapeo(id: int, data: MapeoIn, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "contabilidad_reglas")
    m = db.query(MapeoCuenta).filter(MapeoCuenta.id == id).first()
    if not m:
        raise HTTPException(status_code=404, detail="Mapeo inexistente")
    m.dimension = data.dimension.strip(); m.clave = data.clave.strip()
    m.cuenta_codigo = data.cuenta_codigo.strip(); m.activo = data.activo
    db.commit()
    return _ser_mapeo(m)


@mapeo_router.delete("/{id}")
def borrar_mapeo(id: int, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "contabilidad_reglas")
    m = db.query(MapeoCuenta).filter(MapeoCuenta.id == id).first()
    if not m:
        raise HTTPException(status_code=404, detail="Mapeo inexistente")
    db.delete(m); db.commit()
    return {"message": "mapeo eliminado"}
