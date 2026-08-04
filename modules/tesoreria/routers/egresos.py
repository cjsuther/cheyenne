import sys
import os
from datetime import datetime, timezone, date
from decimal import Decimal
from typing import Optional

from fastapi import APIRouter, Depends, Query, HTTPException, status, Body
from sqlalchemy import func
from sqlalchemy.orm import Session
from starlette.requests import Request
from pydantic import BaseModel

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", ".."))
from shared.base_module import create_auth_dependency
from shared.filters import filtered_query

from database import get_db
from config import get_settings
from models.egresos import (
    Beneficiario, CuentaBancaria, OrdenPago, Egreso, DepositoBancario, ESTADOS_OP, MEDIOS_PAGO,
)
from models.recaudacion_lote import RecaudacionLote


def _saldo_cuenta(db, id_cuenta, saldo_inicial):
    """Saldo real de la cuenta: saldo_inicial + depósitos (créditos) - egresos (débitos)."""
    egresado = db.query(func.sum(Egreso.importe)).filter(
        Egreso.id_cuenta_bancaria == id_cuenta, Egreso.activo == True).scalar() or 0
    depositado = db.query(func.sum(DepositoBancario.importe)).filter(
        DepositoBancario.id_cuenta_bancaria == id_cuenta, DepositoBancario.activo == True).scalar() or 0
    return Decimal(str(saldo_inicial)) + Decimal(str(depositado)) - Decimal(str(egresado))

settings = get_settings()
get_current_user = create_auth_dependency(settings.seguridad_url)


def _requiere(cu: dict, permiso: str):
    if cu.get("superuser"):
        return
    if permiso not in [p["codigo"] for p in cu.get("permisos", [])]:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=f"No tiene el permiso '{permiso}'")


def _quien(cu: dict) -> str:
    return cu.get("nombre_apellido") or cu.get("codigo") or "?"


def _numero_central(clave, anio, minimo, prefijo, padding, token):
    """Número centralizado seguro (best-effort). Devuelve el número o `minimo` si Administración no responde."""
    import httpx
    try:
        with httpx.Client(timeout=5) as c:
            r = c.post(f"{settings.administracion_url}/numeradores/{clave}-{anio}/siguiente-seguro",
                       json={"minimo": minimo, "prefijo": prefijo, "padding": padding, "anio": anio},
                       headers={"Authorization": token} if token else {})
        if r.status_code < 400:
            return int(r.json()["numero"])
    except Exception:
        pass
    return minimo


# ── Beneficiarios ────────────────────────────────────────────────────
beneficiarios_router = APIRouter(prefix="/beneficiarios", tags=["Beneficiarios de pago"])
_B = ["id", "codigo", "nombre", "cuit", "cbu", "activo"]


class BeneficiarioIn(BaseModel):
    codigo: str
    nombre: str
    cuit: Optional[str] = None
    cbu: Optional[str] = None
    activo: bool = True


@beneficiarios_router.get("")
def listar_benef(request: Request, skip: int = Query(0, ge=0), limit: int = Query(50, ge=1, le=200),
                 db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "tesoreria_read")
    q = filtered_query(db.query(Beneficiario), Beneficiario, dict(request.query_params),
                       exclude={"skip", "limit"}, default_sort="codigo")
    return [{c: getattr(b, c) for c in _B} for b in q.offset(skip).limit(limit).all()]


@beneficiarios_router.post("", status_code=201)
def crear_benef(data: BeneficiarioIn, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "tesoreria_write")
    if db.query(Beneficiario).filter(Beneficiario.codigo == data.codigo.strip()).first():
        raise HTTPException(status_code=409, detail=f"Ya existe el beneficiario {data.codigo}")
    b = Beneficiario(**data.model_dump()); db.add(b); db.commit(); db.refresh(b)
    return {c: getattr(b, c) for c in _B}


@beneficiarios_router.put("/{id}")
def edit_benef(id: int, data: BeneficiarioIn, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "tesoreria_write")
    b = db.query(Beneficiario).filter(Beneficiario.id == id).first()
    if not b:
        raise HTTPException(status_code=404, detail="Beneficiario inexistente")
    for k, v in data.model_dump().items():
        setattr(b, k, v)
    db.commit()
    return {c: getattr(b, c) for c in _B}


@beneficiarios_router.delete("/{id}")
def del_benef(id: int, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "tesoreria_delete")
    b = db.query(Beneficiario).filter(Beneficiario.id == id).first()
    if not b:
        raise HTTPException(status_code=404, detail="Beneficiario inexistente")
    b.activo = False; db.commit()
    return {"message": "dado de baja"}


# ── Cuentas bancarias ────────────────────────────────────────────────
cuentas_router = APIRouter(prefix="/cuentas-bancarias", tags=["Cuentas bancarias"])
_C = ["id", "banco", "numero", "tipo", "descripcion", "saldo_inicial", "activo"]


class CuentaIn(BaseModel):
    banco: str
    numero: str
    tipo: Optional[str] = None
    descripcion: Optional[str] = None
    saldo_inicial: Decimal = Decimal("0")
    activo: bool = True


@cuentas_router.get("")
def listar_ctas(request: Request, skip: int = Query(0, ge=0), limit: int = Query(50, ge=1, le=200),
                db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "tesoreria_read")
    q = filtered_query(db.query(CuentaBancaria), CuentaBancaria, dict(request.query_params),
                       exclude={"skip", "limit"}, default_sort="banco")
    out = []
    for c in q.offset(skip).limit(limit).all():
        row = {k: getattr(c, k) for k in _C}
        row["saldo_actual"] = float(_saldo_cuenta(db, c.id, c.saldo_inicial))
        out.append(row)
    return out


@cuentas_router.post("", status_code=201)
def crear_cta(data: CuentaIn, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "tesoreria_write")
    c = CuentaBancaria(**data.model_dump()); db.add(c); db.commit(); db.refresh(c)
    return {k: getattr(c, k) for k in _C}


@cuentas_router.put("/{id}")
def edit_cta(id: int, data: CuentaIn, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "tesoreria_write")
    c = db.query(CuentaBancaria).filter(CuentaBancaria.id == id).first()
    if not c:
        raise HTTPException(status_code=404, detail="Cuenta inexistente")
    for k, v in data.model_dump().items():
        setattr(c, k, v)
    db.commit()
    return {k: getattr(c, k) for k in _C}


@cuentas_router.delete("/{id}")
def del_cta(id: int, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "tesoreria_delete")
    c = db.query(CuentaBancaria).filter(CuentaBancaria.id == id).first()
    if not c:
        raise HTTPException(status_code=404, detail="Cuenta inexistente")
    c.activo = False; db.commit()
    return {"message": "dada de baja"}


# ── Depósitos bancarios (créditos) ───────────────────────────────────
class DepositoIn(BaseModel):
    importe: Decimal
    concepto: Optional[str] = None
    origen: str = "manual"
    referencia: Optional[str] = None


def _ser_dep(d: DepositoBancario):
    return {"id": d.id, "id_cuenta_bancaria": d.id_cuenta_bancaria, "importe": float(d.importe),
            "concepto": d.concepto, "origen": d.origen, "referencia": d.referencia,
            "fecha": d.fecha, "usuario": d.usuario_nombre}


@cuentas_router.get("/{id}/depositos")
def listar_depositos(id: int, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "tesoreria_read")
    q = db.query(DepositoBancario).filter(
        DepositoBancario.id_cuenta_bancaria == id, DepositoBancario.activo == True).order_by(DepositoBancario.id.desc())
    return [_ser_dep(d) for d in q.limit(200).all()]


@cuentas_router.post("/{id}/depositos", status_code=201)
def crear_deposito(id: int, data: DepositoIn, db: Session = Depends(get_db),
                   current_user: dict = Depends(get_current_user)):
    """Registra un crédito (depósito) en la cuenta: suma al saldo. Idempotente por (origen, referencia)."""
    _requiere(current_user, "tesoreria_write")
    if not db.query(CuentaBancaria).filter(CuentaBancaria.id == id, CuentaBancaria.activo == True).first():
        raise HTTPException(status_code=400, detail="Cuenta bancaria inexistente")
    if data.importe <= 0:
        raise HTTPException(status_code=400, detail="El importe debe ser mayor a cero")
    if data.referencia:
        ex = db.query(DepositoBancario).filter(
            DepositoBancario.origen == data.origen, DepositoBancario.referencia == data.referencia,
            DepositoBancario.activo == True).first()
        if ex:
            out = _ser_dep(ex); out["idempotente"] = True
            return out
    d = DepositoBancario(id_cuenta_bancaria=id, importe=data.importe, concepto=data.concepto,
                         origen=data.origen, referencia=data.referencia, usuario_nombre=_quien(current_user))
    db.add(d); db.commit(); db.refresh(d)
    return _ser_dep(d)


@cuentas_router.post("/{id}/acreditar-recaudacion")
def acreditar_recaudacion(id: int, data: dict = Body(...), db: Session = Depends(get_db),
                          current_user: dict = Depends(get_current_user)):
    """Acredita un lote de recaudación en la cuenta bancaria (recaudación -> banco).
    Crea el depósito por el importe neto del lote y marca la fecha de acreditación. Idempotente."""
    _requiere(current_user, "tesoreria_write")
    cta = db.query(CuentaBancaria).filter(CuentaBancaria.id == id, CuentaBancaria.activo == True).first()
    if not cta:
        raise HTTPException(status_code=400, detail="Cuenta bancaria inexistente")
    id_lote = data.get("id_lote")
    lote = db.query(RecaudacionLote).filter(RecaudacionLote.id == id_lote).first()
    if not lote:
        raise HTTPException(status_code=404, detail="Lote de recaudación inexistente")
    importe = Decimal(str(lote.importe_neto or lote.importe_total or 0))
    if importe <= 0:
        raise HTTPException(status_code=400, detail="El lote no tiene importe neto a acreditar")
    ref = f"lote-{lote.id}"
    ex = db.query(DepositoBancario).filter(
        DepositoBancario.origen == "recaudacion", DepositoBancario.referencia == ref,
        DepositoBancario.activo == True).first()
    if ex:
        return {**_ser_dep(ex), "idempotente": True}
    d = DepositoBancario(id_cuenta_bancaria=id, importe=importe,
                         concepto=f"Acreditación recaudación lote #{lote.id}",
                         origen="recaudacion", referencia=ref, usuario_nombre=_quien(current_user))
    db.add(d)
    from datetime import date as _date
    lote.fecha_acreditacion = _date.today()
    db.commit(); db.refresh(d)
    return _ser_dep(d)


# ── Órdenes de pago ──────────────────────────────────────────────────
op_router = APIRouter(prefix="/ordenes-pago", tags=["Órdenes de pago"])


class OrdenPagoIn(BaseModel):
    anio: int
    importe: Decimal
    concepto: Optional[str] = None
    id_beneficiario: Optional[int] = None
    beneficiario_nombre: Optional[str] = None
    origen: str = "manual"
    referencia_externa: Optional[str] = None
    retenciones_sugeridas: Optional[list] = None   # liquidadas por Contaduría, para pre-cargar al pagar


def _ser_op(op: OrdenPago, db: Session):
    egresos = db.query(Egreso).filter(Egreso.id_orden_pago == op.id, Egreso.activo == True).all()
    return {
        "id": op.id, "anio": op.anio, "numero": op.numero,
        "orden_pago": f"OP-{op.anio}-{op.numero:05d}",
        "id_beneficiario": op.id_beneficiario, "beneficiario": op.beneficiario_nombre,
        "importe": float(op.importe), "concepto": op.concepto, "estado": op.estado,
        "origen": op.origen, "referencia_externa": op.referencia_externa,
        "retenciones_sugeridas": (lambda v: __import__("json").loads(v) if v else [])(op.retenciones_sugeridas),
        "creado_por": op.creado_por, "created_at": op.created_at,
        "pagos": [{"id": e.id, "medio": e.medio, "numero_cheque": e.numero_cheque,
                   "importe": float(e.importe), "fecha": e.fecha, "usuario": e.usuario_nombre}
                  for e in egresos],
    }


@op_router.get("")
def listar_op(request: Request, anio: int = Query(None), skip: int = Query(0, ge=0),
              limit: int = Query(50, ge=1, le=200), db: Session = Depends(get_db),
              current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "tesoreria_read")
    query = db.query(OrdenPago).filter(OrdenPago.activo == True)
    if anio:
        query = query.filter(OrdenPago.anio == anio)
    query = filtered_query(query, OrdenPago, dict(request.query_params),
                           exclude={"skip", "limit", "anio"}, default_sort="id", default_dir="desc")
    return [_ser_op(op, db) for op in query.offset(skip).limit(limit).all()]


@op_router.post("", status_code=201)
def crear_op(data: OrdenPagoIn, request: Request, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "tesoreria_write")
    if data.importe <= 0:
        raise HTTPException(status_code=400, detail="El importe debe ser mayor a cero")
    # idempotencia por (origen, referencia_externa) para la integración con Contaduría
    if data.referencia_externa:
        ex = db.query(OrdenPago).filter(
            OrdenPago.origen == data.origen, OrdenPago.referencia_externa == data.referencia_externa,
            OrdenPago.activo == True).first()
        if ex:
            out = _ser_op(ex, db); out["idempotente"] = True
            return out
    nombre = data.beneficiario_nombre
    if data.id_beneficiario and not nombre:
        b = db.query(Beneficiario).filter(Beneficiario.id == data.id_beneficiario).first()
        nombre = b.nombre if b else None
    ultimo = db.query(func.max(OrdenPago.numero)).filter(OrdenPago.anio == data.anio).scalar() or 0
    numero = _numero_central("op", data.anio, ultimo + 1, f"OP-{data.anio}-", 5, request.headers.get("authorization"))
    import json as _json
    op = OrdenPago(
        anio=data.anio, numero=numero, id_beneficiario=data.id_beneficiario,
        beneficiario_nombre=nombre, importe=data.importe, concepto=data.concepto,
        origen=data.origen, referencia_externa=data.referencia_externa,
        retenciones_sugeridas=_json.dumps(data.retenciones_sugeridas) if data.retenciones_sugeridas else None,
        creado_por=_quien(current_user))
    db.add(op); db.commit(); db.refresh(op)
    return _ser_op(op, db)


@op_router.post("/{id}/enviar-a-firma")
def enviar_a_firma(id: int, request: Request, data: dict = Body(default={}),
                   db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    """Registra la orden de pago en el módulo de Firma Digital (para su firma múltiple)."""
    _requiere(current_user, "tesoreria_write")
    op = db.query(OrdenPago).filter(OrdenPago.id == id, OrdenPago.activo == True).first()
    if not op:
        raise HTTPException(status_code=404, detail="Orden de pago inexistente")
    import httpx, hashlib
    numero_op = f"OP-{op.anio}-{op.numero:05d}"
    contenido = f"{numero_op}|{op.beneficiario_nombre or ''}|{op.importe}|{op.concepto or ''}"
    contenido_hash = hashlib.sha256(contenido.encode("utf-8")).hexdigest()
    payload = {
        "origen_modulo": "tesoreria", "origen_tipo": "orden_pago", "origen_ref": numero_op,
        "titulo": f"Orden de Pago {numero_op} — {op.beneficiario_nombre or 's/beneficiario'} (${float(op.importe):,.2f})",
        "descripcion": op.concepto, "contenido_hash": contenido_hash,
        "cantidad_firmas": int(data.get("cantidad_firmas") or 2),
    }
    token = request.headers.get("authorization")
    try:
        with httpx.Client(timeout=8) as c:
            r = c.post(f"{settings.firma_url}/documentos", json=payload,
                       headers={"Authorization": token} if token else {})
        if r.status_code >= 400:
            raise HTTPException(status_code=502, detail=f"El módulo de firma rechazó el envío: {r.text[:200]}")
        return {"enviado": True, "documento": r.json()}
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=502, detail=f"No se pudo conectar con el módulo de firma: {e}")


@op_router.post("/{id}/pagar")
def pagar_op(id: int, data: dict = Body(...), db: Session = Depends(get_db),
             current_user: dict = Depends(get_current_user)):
    """Ejecuta el pago de la OP: registra el egreso (parte diario) y la marca pagada."""
    _requiere(current_user, "tesoreria_pagar")
    op = db.query(OrdenPago).filter(OrdenPago.id == id, OrdenPago.activo == True).first()
    if not op:
        raise HTTPException(status_code=404, detail="OP inexistente")
    if op.estado != "pendiente":
        raise HTTPException(status_code=409, detail=f"La OP está '{op.estado}'")
    medio = data.get("medio")
    if medio not in MEDIOS_PAGO:
        raise HTTPException(status_code=400, detail=f"Medio inválido; use uno de {MEDIOS_PAGO}")
    id_cuenta = data.get("id_cuenta_bancaria")
    if medio in ("cheque", "transferencia", "orden_bancaria"):
        if not id_cuenta or not db.query(CuentaBancaria).filter(CuentaBancaria.id == id_cuenta, CuentaBancaria.activo == True).first():
            raise HTTPException(status_code=400, detail="Debe indicar una cuenta bancaria válida para ese medio")
    if medio == "cheque" and not (data.get("numero_cheque") or "").strip():
        raise HTTPException(status_code=400, detail="El cheque requiere número")
    e = Egreso(
        id_orden_pago=op.id, medio=medio, id_cuenta_bancaria=id_cuenta,
        numero_cheque=data.get("numero_cheque"), importe=op.importe,
        usuario_nombre=_quien(current_user), observaciones=data.get("observaciones"))
    db.add(e)
    op.estado = "pagada"
    db.commit(); db.refresh(op)
    return _ser_op(op, db)


@op_router.post("/{id}/anular")
def anular_op(id: int, data: dict = Body(default={}), db: Session = Depends(get_db),
              current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "tesoreria_anular_pago")
    op = db.query(OrdenPago).filter(OrdenPago.id == id, OrdenPago.activo == True).first()
    if not op:
        raise HTTPException(status_code=404, detail="OP inexistente")
    if op.estado == "pagada":
        # revertir el egreso
        db.query(Egreso).filter(Egreso.id_orden_pago == op.id).update({Egreso.activo: False}, synchronize_session=False)
    op.estado = "anulada"
    db.commit()
    return _ser_op(op, db)


# ── Egresos / parte diario ───────────────────────────────────────────
egresos_router = APIRouter(prefix="/egresos", tags=["Egresos"])


@egresos_router.get("/parte-diario")
def parte_diario(fecha: str = Query(None), db: Session = Depends(get_db),
                 current_user: dict = Depends(get_current_user)):
    """Egresos del día (o de hoy si no se indica fecha)."""
    _requiere(current_user, "tesoreria_read")
    dia = date.fromisoformat(fecha) if fecha else datetime.now(timezone.utc).date()
    inicio = datetime(dia.year, dia.month, dia.day, tzinfo=timezone.utc)
    fin = datetime(dia.year, dia.month, dia.day, 23, 59, 59, tzinfo=timezone.utc)
    egresos = (db.query(Egreso).filter(Egreso.activo == True,
               Egreso.fecha >= inicio, Egreso.fecha <= fin).order_by(Egreso.id).all())
    ops = {op.id: op for op in db.query(OrdenPago).filter(
        OrdenPago.id.in_([e.id_orden_pago for e in egresos] or [0])).all()}
    total = sum((Decimal(str(e.importe)) for e in egresos), Decimal("0"))
    por_medio = {}
    filas = []
    for e in egresos:
        op = ops.get(e.id_orden_pago)
        por_medio[e.medio] = por_medio.get(e.medio, Decimal("0")) + Decimal(str(e.importe))
        filas.append({
            "id": e.id, "orden_pago": f"OP-{op.anio}-{op.numero:05d}" if op else "-",
            "beneficiario": op.beneficiario_nombre if op else None,
            "medio": e.medio, "numero_cheque": e.numero_cheque, "importe": float(e.importe),
            "usuario": e.usuario_nombre, "fecha": e.fecha,
        })
    return {"fecha": dia.isoformat(), "total": float(total),
            "por_medio": {k: float(v) for k, v in por_medio.items()}, "egresos": filas}
