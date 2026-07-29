import sys
import os
import json
from decimal import Decimal
from datetime import date
from typing import Optional, List

from fastapi import APIRouter, Depends, Query, HTTPException
from starlette.requests import Request
from sqlalchemy.orm import Session
from pydantic import BaseModel

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", ".."))
from shared.filters import filtered_query

from database import get_db
from models.contabilidad import Asiento, AsientoItem, EjercicioContable
from models.transacciones import Transaccion, ReglaImputacion, ReglaLinea, MapeoCuenta
from ._common import get_current_user, _requiere, _quien, _dec, _crear_asiento, _ser_asiento

transacciones_router = APIRouter(prefix="/transacciones", tags=["Transacciones económicas"])


# ═══ Motor de imputación ═════════════════════════════════════════════
def imputar(db: Session, tx: Transaccion, creado_por: str):
    """Convierte la transacción en un asiento balanceado según la regla de su tipo.
    Muta tx.estado/motivo/id_asiento. NO commitea (lo hace el caller)."""
    regla = db.query(ReglaImputacion).filter(
        ReglaImputacion.tipo == tx.tipo, ReglaImputacion.activo == True).first()
    if not regla:
        tx.estado = "sin_regla"; tx.id_asiento = None
        tx.motivo = f"No hay regla de imputación definida para el tipo '{tx.tipo}'"
        return
    lineas_def = db.query(ReglaLinea).filter(
        ReglaLinea.id_regla == regla.id).order_by(ReglaLinea.orden).all()
    if not lineas_def:
        tx.estado = "error"; tx.motivo = "La regla no tiene líneas definidas"; return

    ctx = {}
    if tx.contexto:
        try:
            ctx = json.loads(tx.contexto)
        except Exception:
            ctx = {}

    lineas_cod = []
    for ld in lineas_def:
        # importe de la línea
        if ld.importe_campo and ld.importe_campo != "importe":
            v = ctx.get(ld.importe_campo)
            if v is None:
                tx.estado = "error"; tx.id_asiento = None
                tx.motivo = f"Falta el campo de importe '{ld.importe_campo}' en el contexto"
                return
            imp = _dec(v)
        else:
            imp = _dec(tx.importe)
        # cuenta (fija o derivada por mapeo)
        if ld.origen_cuenta == "derivada":
            clave = ctx.get(ld.dimension)
            if clave is None:
                tx.estado = "error"; tx.id_asiento = None
                tx.motivo = f"Falta la dimensión '{ld.dimension}' en el contexto para derivar la cuenta"
                return
            mp = db.query(MapeoCuenta).filter(
                MapeoCuenta.dimension == ld.dimension, MapeoCuenta.clave == str(clave),
                MapeoCuenta.activo == True).first()
            if not mp:
                tx.estado = "error"; tx.id_asiento = None
                tx.motivo = f"Falta mapeo de cuenta para dimensión '{ld.dimension}' = '{clave}'"
                return
            codigo = mp.cuenta_codigo
        else:
            codigo = ld.cuenta_codigo
            if not codigo:
                tx.estado = "error"; tx.id_asiento = None
                tx.motivo = "Línea fija sin cuenta_codigo"; return
        lineas_cod.append({
            "cuenta_codigo": codigo,
            "debe": imp if ld.lado == "debe" else 0,
            "haber": imp if ld.lado == "haber" else 0,
            "detalle": ld.detalle,
        })

    fecha = tx.fecha or date.today()
    anio = fecha.year
    ej = db.query(EjercicioContable).filter(EjercicioContable.anio == anio).first()
    if ej and ej.estado == "cerrado":
        tx.estado = "error"; tx.id_asiento = None
        tx.motivo = f"El ejercicio {anio} está cerrado"; return

    asiento, err = _crear_asiento(
        db, anio, fecha, tx.concepto or f"{tx.tipo} · {tx.origen_ref}", "automatico",
        tx.origen_modulo, f"tx-{tx.id}", lineas_cod, creado_por)
    if err:
        tx.estado = "error"; tx.id_asiento = None; tx.motivo = err; return
    tx.estado = "imputada"; tx.motivo = None; tx.id_asiento = asiento.id


def _ser_tx(tx: Transaccion, db, con_asiento=False):
    ctx = {}
    if tx.contexto:
        try:
            ctx = json.loads(tx.contexto)
        except Exception:
            ctx = {}
    out = {
        "id": tx.id, "origen_modulo": tx.origen_modulo, "origen_ref": tx.origen_ref,
        "tipo": tx.tipo, "fecha": tx.fecha, "importe": float(tx.importe), "concepto": tx.concepto,
        "contexto": ctx, "estado": tx.estado, "motivo": tx.motivo, "id_asiento": tx.id_asiento,
        "creado_por": tx.creado_por, "created_at": tx.created_at,
    }
    if con_asiento and tx.id_asiento:
        a = db.query(Asiento).filter(Asiento.id == tx.id_asiento).first()
        out["asiento"] = _ser_asiento(a, db) if a else None
    return out


# ═══ Endpoints ═══════════════════════════════════════════════════════
class TransaccionIn(BaseModel):
    origen_modulo: str
    origen_ref: str
    tipo: str
    fecha: Optional[date] = None
    importe: Decimal
    concepto: Optional[str] = None
    contexto: Optional[dict] = None


@transacciones_router.post("", status_code=201)
def crear_transaccion(data: TransaccionIn, db: Session = Depends(get_db),
                      current_user: dict = Depends(get_current_user)):
    """Un módulo postea un hecho económico. El contable intenta imputarlo automáticamente.
    Si no hay regla para el tipo, queda en la bandeja 'sin_regla'. Idempotente por origen."""
    _requiere(current_user, "contabilidad_asentar")
    ex = db.query(Transaccion).filter(
        Transaccion.origen_modulo == data.origen_modulo,
        Transaccion.origen_ref == data.origen_ref).first()
    if ex:
        out = _ser_tx(ex, db, con_asiento=True); out["idempotente"] = True
        return out
    tx = Transaccion(
        origen_modulo=data.origen_modulo, origen_ref=data.origen_ref, tipo=data.tipo,
        fecha=data.fecha, importe=_dec(data.importe), concepto=data.concepto,
        contexto=json.dumps(data.contexto or {}), creado_por=_quien(current_user))
    db.add(tx); db.flush()
    imputar(db, tx, _quien(current_user))
    db.commit(); db.refresh(tx)
    return _ser_tx(tx, db, con_asiento=True)


@transacciones_router.get("")
def listar_transacciones(request: Request, estado: str = Query(None), tipo: str = Query(None),
                         origen_modulo: str = Query(None), skip: int = Query(0, ge=0),
                         limit: int = Query(50, ge=1, le=200),
                         db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "contabilidad_read")
    q = db.query(Transaccion)
    if estado:
        q = q.filter(Transaccion.estado == estado)
    if tipo:
        q = q.filter(Transaccion.tipo == tipo)
    if origen_modulo:
        q = q.filter(Transaccion.origen_modulo == origen_modulo)
    q = filtered_query(q, Transaccion, dict(request.query_params),
                       exclude={"skip", "limit", "estado", "tipo", "origen_modulo"},
                       default_sort="id", default_dir="desc")
    return [_ser_tx(t, db) for t in q.offset(skip).limit(limit).all()]


@transacciones_router.get("/pendientes")
def listar_pendientes(db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    """Bandeja de transacciones sin imputar: sin regla definida o con error de resolución."""
    _requiere(current_user, "contabilidad_read")
    q = db.query(Transaccion).filter(Transaccion.estado.in_(["sin_regla", "error"])).order_by(Transaccion.id.desc())
    filas = [_ser_tx(t, db) for t in q.limit(500).all()]
    # resumen por tipo para facilitar la definición de reglas
    por_tipo = {}
    for t in filas:
        por_tipo.setdefault(t["tipo"], {"tipo": t["tipo"], "cantidad": 0, "estado": t["estado"]})
        por_tipo[t["tipo"]]["cantidad"] += 1
    return {"total": len(filas), "por_tipo": list(por_tipo.values()), "transacciones": filas}


@transacciones_router.get("/{id}")
def obtener_transaccion(id: int, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "contabilidad_read")
    tx = db.query(Transaccion).filter(Transaccion.id == id).first()
    if not tx:
        raise HTTPException(status_code=404, detail="Transacción inexistente")
    return _ser_tx(tx, db, con_asiento=True)


@transacciones_router.post("/{id}/reprocesar")
def reprocesar_transaccion(id: int, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    """Reintenta imputar una transacción pendiente (tras definir su regla o cargar el mapeo)."""
    _requiere(current_user, "contabilidad_asentar")
    tx = db.query(Transaccion).filter(Transaccion.id == id).first()
    if not tx:
        raise HTTPException(status_code=404, detail="Transacción inexistente")
    if tx.estado == "imputada":
        return _ser_tx(tx, db, con_asiento=True)
    if tx.estado == "anulada":
        raise HTTPException(status_code=409, detail="La transacción está anulada")
    imputar(db, tx, _quien(current_user))
    db.commit(); db.refresh(tx)
    return _ser_tx(tx, db, con_asiento=True)


@transacciones_router.post("/{id}/anular")
def anular_transaccion(id: int, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "contabilidad_asentar")
    tx = db.query(Transaccion).filter(Transaccion.id == id).first()
    if not tx:
        raise HTTPException(status_code=404, detail="Transacción inexistente")
    if tx.id_asiento:
        a = db.query(Asiento).filter(Asiento.id == tx.id_asiento).first()
        if a and a.estado != "anulado" and a.tipo not in ("cierre", "apertura"):
            a.estado = "anulado"
    tx.estado = "anulada"; db.commit(); db.refresh(tx)
    return _ser_tx(tx, db)
