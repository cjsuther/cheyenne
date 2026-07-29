import sys
import os
from decimal import Decimal
from datetime import date
from typing import Optional

from fastapi import APIRouter, Depends, Query, HTTPException
from sqlalchemy import func
from sqlalchemy.orm import Session

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", ".."))

from database import get_db
from models.contabilidad import Asiento, AsientoItem, PlanCuenta
from ._common import get_current_user, _requiere, _dec, CERO, _cuentas_map

libros_router = APIRouter(prefix="/libros", tags=["Libros contables"])


@libros_router.get("/libro-diario")
def libro_diario(desde: Optional[date] = Query(None), hasta: Optional[date] = Query(None),
                 anio: Optional[int] = Query(None),
                 db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    """Asientos confirmados en el rango de fechas, con sus items."""
    _requiere(current_user, "contabilidad_read")
    q = db.query(Asiento).filter(Asiento.estado == "confirmado")
    if anio:
        q = q.filter(Asiento.anio == anio)
    if desde:
        q = q.filter(Asiento.fecha >= desde)
    if hasta:
        q = q.filter(Asiento.fecha <= hasta)
    asientos = q.order_by(Asiento.fecha, Asiento.numero).all()
    ids = [a.id for a in asientos]
    items = db.query(AsientoItem).filter(AsientoItem.id_asiento.in_(ids)).order_by(AsientoItem.id).all() if ids else []
    cuentas = _cuentas_map(db, {i.id_cuenta for i in items})
    por_asiento = {}
    for i in items:
        c = cuentas.get(i.id_cuenta)
        por_asiento.setdefault(i.id_asiento, []).append({
            "id_cuenta": i.id_cuenta,
            "cuenta_codigo": c.codigo if c else None, "cuenta_nombre": c.nombre if c else None,
            "debe": float(i.debe), "haber": float(i.haber), "detalle": i.detalle,
        })
    return [{
        "id": a.id, "asiento": f"AS-{a.anio}-{a.numero:05d}", "anio": a.anio, "numero": a.numero,
        "fecha": a.fecha, "tipo": a.tipo, "concepto": a.concepto,
        "total_debe": float(a.total_debe), "total_haber": float(a.total_haber),
        "items": por_asiento.get(a.id, []),
    } for a in asientos]


@libros_router.get("/libro-mayor")
def libro_mayor(id_cuenta: Optional[int] = Query(None), cuenta_codigo: Optional[str] = Query(None),
                anio: Optional[int] = Query(None), desde: Optional[date] = Query(None), hasta: Optional[date] = Query(None),
                db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    """Movimientos de una cuenta (asientos confirmados) ordenados con saldo acumulado (debe - haber)."""
    _requiere(current_user, "contabilidad_read")
    if not id_cuenta and not cuenta_codigo:
        raise HTTPException(status_code=400, detail="Indicá id_cuenta o cuenta_codigo")
    cuenta = None
    if id_cuenta:
        cuenta = db.query(PlanCuenta).filter(PlanCuenta.id == id_cuenta).first()
    else:
        cuenta = db.query(PlanCuenta).filter(PlanCuenta.codigo == cuenta_codigo.strip()).first()
    if not cuenta:
        raise HTTPException(status_code=404, detail="Cuenta inexistente")

    q = db.query(AsientoItem, Asiento).join(Asiento, Asiento.id == AsientoItem.id_asiento) \
        .filter(AsientoItem.id_cuenta == cuenta.id, Asiento.estado == "confirmado")
    if anio:
        q = q.filter(Asiento.anio == anio)
    if desde:
        q = q.filter(Asiento.fecha >= desde)
    if hasta:
        q = q.filter(Asiento.fecha <= hasta)
    filas = q.order_by(Asiento.fecha, Asiento.numero, AsientoItem.id).all()

    movimientos = []
    saldo = CERO
    suma_debe = suma_haber = CERO
    for item, a in filas:
        d, h = _dec(item.debe), _dec(item.haber)
        saldo += d - h
        suma_debe += d; suma_haber += h
        movimientos.append({
            "id_asiento": a.id, "asiento": f"AS-{a.anio}-{a.numero:05d}",
            "fecha": a.fecha, "concepto": a.concepto, "detalle": item.detalle,
            "debe": float(d), "haber": float(h), "saldo": float(saldo),
        })
    return {
        "cuenta": {"id": cuenta.id, "codigo": cuenta.codigo, "nombre": cuenta.nombre, "tipo": cuenta.tipo},
        "suma_debe": float(suma_debe), "suma_haber": float(suma_haber), "saldo": float(saldo),
        "movimientos": movimientos,
    }


@libros_router.get("/balance")
def balance(anio: int = Query(...), db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    """Balance de sumas y saldos por cuenta imputable, sobre asientos confirmados del año."""
    _requiere(current_user, "contabilidad_read")
    filas = db.query(
        AsientoItem.id_cuenta,
        func.coalesce(func.sum(AsientoItem.debe), 0),
        func.coalesce(func.sum(AsientoItem.haber), 0),
    ).join(Asiento, Asiento.id == AsientoItem.id_asiento) \
        .filter(Asiento.estado == "confirmado", Asiento.anio == anio) \
        .group_by(AsientoItem.id_cuenta).all()

    cuentas = _cuentas_map(db, {r[0] for r in filas})
    out = []
    tot_debe = tot_haber = tot_deudor = tot_acreedor = CERO
    for id_cuenta, sd, sh in filas:
        c = cuentas.get(id_cuenta)
        if not c or not c.imputable:
            continue
        sd, sh = _dec(sd), _dec(sh)
        saldo = sd - sh
        deudor = saldo if saldo > 0 else CERO
        acreedor = -saldo if saldo < 0 else CERO
        tot_debe += sd; tot_haber += sh; tot_deudor += deudor; tot_acreedor += acreedor
        out.append({
            "id_cuenta": id_cuenta, "codigo": c.codigo, "nombre": c.nombre, "tipo": c.tipo,
            "suma_debe": float(sd), "suma_haber": float(sh),
            "saldo_deudor": float(deudor), "saldo_acreedor": float(acreedor),
        })
    out.sort(key=lambda x: x["codigo"])
    return {
        "anio": anio,
        "totales": {"suma_debe": float(tot_debe), "suma_haber": float(tot_haber),
                    "saldo_deudor": float(tot_deudor), "saldo_acreedor": float(tot_acreedor)},
        "cuentas": out,
    }
