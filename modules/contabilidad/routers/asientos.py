import sys
import os
from decimal import Decimal
from datetime import date
from typing import Optional, List

from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy.orm import Session
from starlette.requests import Request
from pydantic import BaseModel

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", ".."))
from shared.filters import filtered_query

from database import get_db
from models.contabilidad import Asiento, AsientoItem, PlanCuenta, EjercicioContable
from ._common import (
    get_current_user, _requiere, _quien, _proximo_numero, _ser_asiento, CERO, _dec,
)

asientos_router = APIRouter(prefix="/asientos", tags=["Asientos"])


class LineaIn(BaseModel):
    id_cuenta: int
    debe: Decimal = Decimal("0")
    haber: Decimal = Decimal("0")
    detalle: Optional[str] = None


class AsientoIn(BaseModel):
    anio: Optional[int] = None
    fecha: Optional[date] = None
    concepto: str
    lineas: List[LineaIn]


class LineaAutoIn(BaseModel):
    cuenta_codigo: str
    debe: Decimal = Decimal("0")
    haber: Decimal = Decimal("0")
    detalle: Optional[str] = None


class AutoIn(BaseModel):
    fecha: Optional[date] = None
    concepto: str
    origen_modulo: str
    origen_ref: str
    lineas: List[LineaAutoIn]


def _ejercicio_abierto_o_error(db, anio):
    ej = db.query(EjercicioContable).filter(EjercicioContable.anio == anio).first()
    if ej and ej.estado == "cerrado":
        raise HTTPException(status_code=409, detail=f"El ejercicio {anio} está cerrado")


@asientos_router.get("")
def listar(request: Request, anio: int = Query(None), tipo: str = Query(None), estado: str = Query(None),
           skip: int = Query(0, ge=0), limit: int = Query(50, ge=1, le=200),
           db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "contabilidad_read")
    q = db.query(Asiento)
    if anio:
        q = q.filter(Asiento.anio == anio)
    if tipo:
        q = q.filter(Asiento.tipo == tipo)
    if estado:
        q = q.filter(Asiento.estado == estado)
    q = filtered_query(q, Asiento, dict(request.query_params),
                       exclude={"skip", "limit", "anio", "tipo", "estado"},
                       default_sort="id", default_dir="desc")
    return [_ser_asiento(a, db, con_items=False) for a in q.offset(skip).limit(limit).all()]


@asientos_router.get("/{id}")
def obtener(id: int, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "contabilidad_read")
    a = db.query(Asiento).filter(Asiento.id == id).first()
    if not a:
        raise HTTPException(status_code=404, detail="Asiento inexistente")
    return _ser_asiento(a, db)


@asientos_router.post("", status_code=201)
def crear_manual(data: AsientoIn, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "contabilidad_asentar")
    if not data.lineas or len(data.lineas) < 2:
        raise HTTPException(status_code=400, detail="El asiento debe tener al menos dos líneas")
    fecha = data.fecha or date.today()
    anio = data.anio or fecha.year
    _ejercicio_abierto_o_error(db, anio)
    td = th = CERO
    for ln in data.lineas:
        d, h = _dec(ln.debe), _dec(ln.haber)
        if d < 0 or h < 0:
            raise HTTPException(status_code=400, detail="Debe/haber no pueden ser negativos")
        if (d > 0 and h > 0) or (d == 0 and h == 0):
            raise HTTPException(status_code=400, detail="Cada línea debe tener debe O haber (uno solo, > 0)")
        c = db.query(PlanCuenta).filter(PlanCuenta.id == ln.id_cuenta, PlanCuenta.activo == True).first()
        if not c:
            raise HTTPException(status_code=400, detail=f"Cuenta {ln.id_cuenta} inexistente")
        if not c.imputable:
            raise HTTPException(status_code=400, detail=f"La cuenta {c.codigo} no es imputable")
        td += d; th += h
    if td != th:
        raise HTTPException(status_code=400, detail=f"El asiento no balancea: debe {td} ≠ haber {th}")
    numero = _proximo_numero(db, anio)
    a = Asiento(anio=anio, numero=numero, fecha=fecha, tipo="manual", concepto=data.concepto,
                estado="borrador", total_debe=td, total_haber=th, creado_por=_quien(current_user))
    db.add(a); db.flush()
    for ln in data.lineas:
        db.add(AsientoItem(id_asiento=a.id, id_cuenta=ln.id_cuenta,
                           debe=_dec(ln.debe), haber=_dec(ln.haber), detalle=ln.detalle))
    db.commit(); db.refresh(a)
    return _ser_asiento(a, db)


@asientos_router.post("/{id}/confirmar")
def confirmar(id: int, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "contabilidad_asentar")
    a = db.query(Asiento).filter(Asiento.id == id).first()
    if not a:
        raise HTTPException(status_code=404, detail="Asiento inexistente")
    if a.estado != "borrador":
        raise HTTPException(status_code=409, detail=f"El asiento está '{a.estado}'")
    if _dec(a.total_debe) != _dec(a.total_haber):
        raise HTTPException(status_code=409, detail="El asiento no balancea")
    _ejercicio_abierto_o_error(db, a.anio)
    a.estado = "confirmado"; db.commit(); db.refresh(a)
    return _ser_asiento(a, db)


@asientos_router.post("/{id}/anular")
def anular(id: int, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "contabilidad_asentar")
    a = db.query(Asiento).filter(Asiento.id == id).first()
    if not a:
        raise HTTPException(status_code=404, detail="Asiento inexistente")
    if a.estado == "anulado":
        raise HTTPException(status_code=409, detail="El asiento ya está anulado")
    if a.tipo in ("cierre", "apertura"):
        raise HTTPException(status_code=409, detail="No se anulan asientos de cierre/apertura")
    _ejercicio_abierto_o_error(db, a.anio)
    a.estado = "anulado"; db.commit(); db.refresh(a)
    return _ser_asiento(a, db)


@asientos_router.post("/automatico", status_code=201)
def automatico(data: AutoIn, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    """Contrato de integración: crea (idempotente por origen_modulo+origen_ref) un asiento
    confirmado a partir de códigos de cuenta. Si un código no existe, lo crea imputable placeholder."""
    _requiere(current_user, "contabilidad_asentar")
    # Idempotencia
    existente = db.query(Asiento).filter(
        Asiento.origen_modulo == data.origen_modulo, Asiento.origen_ref == data.origen_ref).first()
    if existente:
        return _ser_asiento(existente, db)
    if not data.lineas:
        raise HTTPException(status_code=400, detail="El asiento debe tener líneas")
    fecha = data.fecha or date.today()
    anio = fecha.year
    _ejercicio_abierto_o_error(db, anio)
    td = th = CERO
    resueltas = []
    for ln in data.lineas:
        d, h = _dec(ln.debe), _dec(ln.haber)
        if d < 0 or h < 0:
            raise HTTPException(status_code=400, detail="Debe/haber no pueden ser negativos")
        c = db.query(PlanCuenta).filter(PlanCuenta.codigo == ln.cuenta_codigo.strip()).first()
        if not c:
            c = PlanCuenta(codigo=ln.cuenta_codigo.strip(), nombre=f"(auto) {ln.cuenta_codigo.strip()}",
                           tipo="orden", imputable=True, nivel=3, activo=True)
            db.add(c); db.flush()
        resueltas.append((c.id, d, h, ln.detalle))
        td += d; th += h
    if td != th:
        raise HTTPException(status_code=400, detail=f"El asiento no balancea: debe {td} ≠ haber {th}")
    numero = _proximo_numero(db, anio)
    a = Asiento(anio=anio, numero=numero, fecha=fecha, tipo="automatico", concepto=data.concepto,
                origen_modulo=data.origen_modulo, origen_ref=data.origen_ref, estado="confirmado",
                total_debe=td, total_haber=th, creado_por=_quien(current_user))
    db.add(a); db.flush()
    for id_cuenta, d, h, det in resueltas:
        db.add(AsientoItem(id_asiento=a.id, id_cuenta=id_cuenta, debe=d, haber=h, detalle=det))
    db.commit(); db.refresh(a)
    return _ser_asiento(a, db)
