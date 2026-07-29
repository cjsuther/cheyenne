import sys
import os
from decimal import Decimal
from datetime import date
from typing import Optional

from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy import func
from sqlalchemy.orm import Session
from starlette.requests import Request
from pydantic import BaseModel

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", ".."))
from shared.filters import filtered_query

from database import get_db
from models.contabilidad import EjercicioContable, Asiento, AsientoItem, PlanCuenta
from ._common import get_current_user, _requiere, _quien, _proximo_numero, CERO, _dec

ejercicios_router = APIRouter(prefix="/ejercicios", tags=["Ejercicios contables"])

# Códigos de cuentas técnicas usadas por cierre/apertura
COD_RESULTADO = "3.9.99"   # Resultado del ejercicio (patrimonio)
NOM_RESULTADO = "Resultado del ejercicio"


def _ser(e: EjercicioContable):
    return {"id": e.id, "anio": e.anio, "estado": e.estado,
            "fecha_apertura": e.fecha_apertura, "fecha_cierre": e.fecha_cierre}


class EjercicioIn(BaseModel):
    anio: int
    estado: str = "abierto"
    fecha_apertura: Optional[date] = None
    fecha_cierre: Optional[date] = None


def _get_o_crea_cuenta(db, codigo, nombre, tipo, imputable=True):
    c = db.query(PlanCuenta).filter(PlanCuenta.codigo == codigo).first()
    if not c:
        c = PlanCuenta(codigo=codigo, nombre=nombre, tipo=tipo, imputable=imputable, nivel=3, activo=True)
        db.add(c); db.flush()
    return c


def _saldo_cuenta(db, id_cuenta):
    """Saldo (debe - haber) de asientos confirmados para una cuenta."""
    r = db.query(func.coalesce(func.sum(AsientoItem.debe), 0),
                 func.coalesce(func.sum(AsientoItem.haber), 0)) \
        .join(Asiento, Asiento.id == AsientoItem.id_asiento) \
        .filter(AsientoItem.id_cuenta == id_cuenta, Asiento.estado == "confirmado").first()
    return _dec(r[0]) - _dec(r[1])


@ejercicios_router.get("")
def listar(request: Request, skip: int = Query(0, ge=0), limit: int = Query(100, ge=1, le=200),
           db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "contabilidad_read")
    q = filtered_query(db.query(EjercicioContable), EjercicioContable, dict(request.query_params),
                       exclude={"skip", "limit"}, default_sort="anio", default_dir="desc")
    return [_ser(x) for x in q.offset(skip).limit(limit).all()]


@ejercicios_router.post("", status_code=201)
def crear(data: EjercicioIn, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "contabilidad_write")
    if data.estado not in ("abierto", "cerrado"):
        raise HTTPException(status_code=400, detail="Estado inválido")
    if db.query(EjercicioContable).filter(EjercicioContable.anio == data.anio).first():
        raise HTTPException(status_code=409, detail=f"Ya existe el ejercicio {data.anio}")
    x = EjercicioContable(anio=data.anio, estado=data.estado,
                          fecha_apertura=data.fecha_apertura or date(data.anio, 1, 1),
                          fecha_cierre=data.fecha_cierre)
    db.add(x); db.commit(); db.refresh(x)
    return _ser(x)


@ejercicios_router.put("/{anio}")
def editar(anio: int, data: EjercicioIn, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "contabilidad_write")
    x = db.query(EjercicioContable).filter(EjercicioContable.anio == anio).first()
    if not x:
        raise HTTPException(status_code=404, detail="Ejercicio inexistente")
    x.fecha_apertura = data.fecha_apertura or x.fecha_apertura
    x.fecha_cierre = data.fecha_cierre
    db.commit()
    return _ser(x)


@ejercicios_router.post("/{anio}/abrir")
def abrir(anio: int, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    """Crea (o reabre) el ejercicio del año. Si el anterior está cerrado, genera el
    asiento de apertura arrastrando saldos de cuentas patrimoniales (activo/pasivo/patrimonio)."""
    _requiere(current_user, "contabilidad_cerrar")
    ej = db.query(EjercicioContable).filter(EjercicioContable.anio == anio).first()
    if ej and ej.estado == "abierto":
        raise HTTPException(status_code=409, detail=f"El ejercicio {anio} ya está abierto")
    if not ej:
        ej = EjercicioContable(anio=anio, estado="abierto", fecha_apertura=date(anio, 1, 1))
        db.add(ej); db.flush()
    else:
        ej.estado = "abierto"; ej.fecha_cierre = None

    anterior = db.query(EjercicioContable).filter(
        EjercicioContable.anio == anio - 1, EjercicioContable.estado == "cerrado").first()
    asiento_out = None
    if anterior:
        # Saldos patrimoniales del ejercicio anterior
        cuentas = db.query(PlanCuenta).filter(
            PlanCuenta.imputable == True, PlanCuenta.activo == True,
            PlanCuenta.tipo.in_(("activo", "pasivo", "patrimonio"))).all()
        lineas = []
        td = th = CERO
        for c in cuentas:
            saldo = _saldo_cuenta(db, c.id)
            if saldo == CERO:
                continue
            if saldo > 0:  # saldo deudor → va al debe en la apertura
                lineas.append((c.id, saldo, CERO)); td += saldo
            else:
                lineas.append((c.id, CERO, -saldo)); th += -saldo
        if lineas:
            # Equilibrar por diferencia (redondeo/resultados no distribuidos) en cuenta resultado
            dif = td - th
            if dif != CERO:
                res = _get_o_crea_cuenta(db, COD_RESULTADO, NOM_RESULTADO, "patrimonio")
                if dif > 0:
                    lineas.append((res.id, CERO, dif)); th += dif
                else:
                    lineas.append((res.id, -dif, CERO)); td += -dif
            numero = _proximo_numero(db, anio)
            a = Asiento(anio=anio, numero=numero, fecha=date(anio, 1, 1), tipo="apertura",
                        concepto=f"Asiento de apertura ejercicio {anio}", estado="confirmado",
                        total_debe=td, total_haber=th, creado_por=_quien(current_user))
            db.add(a); db.flush()
            for id_cuenta, debe, haber in lineas:
                db.add(AsientoItem(id_asiento=a.id, id_cuenta=id_cuenta, debe=debe, haber=haber,
                                   detalle="Apertura"))
            asiento_out = f"AS-{anio}-{numero:05d}"
    db.commit(); db.refresh(ej)
    return {**_ser(ej), "asiento_apertura": asiento_out}


@ejercicios_router.post("/{anio}/cerrar")
def cerrar(anio: int, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    """Marca el ejercicio como cerrado y genera un asiento de cierre que salda las cuentas
    de resultado (recurso/gasto) contra la cuenta 'Resultado del ejercicio'."""
    _requiere(current_user, "contabilidad_cerrar")
    ej = db.query(EjercicioContable).filter(EjercicioContable.anio == anio).first()
    if not ej:
        raise HTTPException(status_code=404, detail=f"Ejercicio {anio} inexistente")
    if ej.estado == "cerrado":
        raise HTTPException(status_code=409, detail=f"El ejercicio {anio} ya está cerrado")

    cuentas = db.query(PlanCuenta).filter(
        PlanCuenta.imputable == True, PlanCuenta.activo == True,
        PlanCuenta.tipo.in_(("recurso", "gasto"))).all()
    lineas = []
    td = th = CERO
    for c in cuentas:
        saldo = _saldo_cuenta(db, c.id)   # debe - haber
        if saldo == CERO:
            continue
        if saldo > 0:  # saldo deudor (típico de gasto) → se cancela por el haber
            lineas.append((c.id, CERO, saldo)); th += saldo
        else:          # saldo acreedor (típico de recurso) → se cancela por el debe
            lineas.append((c.id, -saldo, CERO)); td += -saldo
    asiento_out = None
    if lineas:
        res = _get_o_crea_cuenta(db, COD_RESULTADO, NOM_RESULTADO, "patrimonio")
        dif = td - th   # resultado a imputar a la cuenta patrimonial
        if dif > 0:
            lineas.append((res.id, CERO, dif)); th += dif
        elif dif < 0:
            lineas.append((res.id, -dif, CERO)); td += -dif
        numero = _proximo_numero(db, anio)
        a = Asiento(anio=anio, numero=numero, fecha=date(anio, 12, 31), tipo="cierre",
                    concepto=f"Asiento de cierre ejercicio {anio}", estado="confirmado",
                    total_debe=td, total_haber=th, creado_por=_quien(current_user))
        db.add(a); db.flush()
        for id_cuenta, debe, haber in lineas:
            db.add(AsientoItem(id_asiento=a.id, id_cuenta=id_cuenta, debe=debe, haber=haber,
                               detalle="Cierre de resultados"))
        asiento_out = f"AS-{anio}-{numero:05d}"

    ej.estado = "cerrado"; ej.fecha_cierre = date(anio, 12, 31)
    db.commit(); db.refresh(ej)
    return {**_ser(ej), "asiento_cierre": asiento_out}
