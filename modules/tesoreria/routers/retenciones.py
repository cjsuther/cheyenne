import sys
import os
from datetime import datetime, timezone, date
from decimal import Decimal
from typing import Optional, List

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
from models.egresos import Beneficiario, CuentaBancaria, OrdenPago, Egreso, MEDIOS_PAGO
from models.retenciones import (
    RetencionPago, ProgramacionCaja, EmbargoBeneficiario, Poder,
    TIPOS_PROG, TIPOS_EMBARGO,
)
from models.recaudacion import Recaudacion

settings = get_settings()
get_current_user = create_auth_dependency(settings.seguridad_url)

CERO = Decimal("0.00")


def _postear_contab(tipo, origen_ref, importe, concepto, contexto, token):
    """POST best-effort a Contabilidad del hecho económico. NUNCA rompe el flujo."""
    import httpx
    try:
        if not importe or float(importe) <= 0:
            return
        with httpx.Client(timeout=6) as client:
            client.post(
                f"{settings.contabilidad_url}/transacciones",
                json={"origen_modulo": "tesoreria", "origen_ref": str(origen_ref), "tipo": tipo,
                      "fecha": None, "importe": float(importe), "concepto": concepto,
                      "contexto": contexto or {}},
                headers={"Authorization": token} if token else {})
    except Exception:
        pass


def _requiere(cu: dict, permiso: str):
    if cu.get("superuser"):
        return
    if permiso not in [p["codigo"] for p in cu.get("permisos", [])]:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=f"No tiene el permiso '{permiso}'")


def _quien(cu: dict) -> str:
    return cu.get("nombre_apellido") or cu.get("codigo") or "?"


def _dec(v) -> Decimal:
    return Decimal(str(v or 0)).quantize(Decimal("0.01"))


# ═══════════════════════════════════════════════════════════════════════
# RETENCIONES
# ═══════════════════════════════════════════════════════════════════════
retenciones_router = APIRouter(prefix="/retenciones", tags=["Retenciones"])


class RetencionLinea(BaseModel):
    regimen: str
    base: Decimal = Decimal("0")
    alicuota: Decimal = Decimal("0")
    importe: Decimal
    comprobante: Optional[str] = None


class PagoConRetencionesIn(BaseModel):
    medio: str
    id_cuenta_bancaria: Optional[int] = None
    numero_cheque: Optional[str] = None
    observaciones: Optional[str] = None
    retenciones: List[RetencionLinea] = []


def _ser_ret(r: RetencionPago):
    return {
        "id": r.id, "id_orden_pago": r.id_orden_pago, "id_egreso": r.id_egreso,
        "regimen": r.regimen, "base": float(r.base), "alicuota": float(r.alicuota),
        "importe": float(r.importe), "comprobante": r.comprobante,
        "depositada": r.depositada, "fecha_deposito": r.fecha_deposito,
        "comprobante_deposito": r.comprobante_deposito,
        "creado_por": r.creado_por, "created_at": r.created_at,
    }


@retenciones_router.get("")
def listar_retenciones(request: Request, id_orden_pago: int = Query(None),
                       depositada: bool = Query(None), skip: int = Query(0, ge=0),
                       limit: int = Query(50, ge=1, le=200), db: Session = Depends(get_db),
                       current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "tesoreria_read")
    q = db.query(RetencionPago).filter(RetencionPago.activo == True)
    if id_orden_pago:
        q = q.filter(RetencionPago.id_orden_pago == id_orden_pago)
    if depositada is not None:
        q = q.filter(RetencionPago.depositada == depositada)
    q = filtered_query(q, RetencionPago, dict(request.query_params),
                       exclude={"skip", "limit", "id_orden_pago", "depositada"},
                       default_sort="id", default_dir="desc")
    return [_ser_ret(r) for r in q.offset(skip).limit(limit).all()]


@retenciones_router.get("/a-depositar")
def retenciones_a_depositar(db: Session = Depends(get_db),
                            current_user: dict = Depends(get_current_user)):
    """Retenciones pendientes de depósito agrupadas por régimen."""
    _requiere(current_user, "tesoreria_read")
    filas = (db.query(RetencionPago.regimen,
                      func.count(RetencionPago.id),
                      func.sum(RetencionPago.importe))
             .filter(RetencionPago.activo == True, RetencionPago.depositada == False)
             .group_by(RetencionPago.regimen).all())
    grupos = [{"regimen": r[0], "cantidad": int(r[1]), "importe": float(r[2] or 0)} for r in filas]
    total = float(sum((Decimal(str(g["importe"])) for g in grupos), CERO))
    return {"total": total, "por_regimen": grupos}


@retenciones_router.post("/depositar")
def marcar_depositadas(data: dict = Body(...), db: Session = Depends(get_db),
                       current_user: dict = Depends(get_current_user)):
    """Marca retenciones como depositadas. Acepta {ids:[...]} o {regimen:'IVA'}."""
    _requiere(current_user, "tesoreria_depositar_retenciones")
    q = db.query(RetencionPago).filter(RetencionPago.activo == True, RetencionPago.depositada == False)
    ids = data.get("ids")
    regimen = data.get("regimen")
    if ids:
        q = q.filter(RetencionPago.id.in_(ids))
    elif regimen:
        q = q.filter(RetencionPago.regimen == regimen)
    else:
        raise HTTPException(status_code=400, detail="Indique 'ids' o 'regimen'")
    comp = data.get("comprobante_deposito")
    ahora = datetime.now(timezone.utc)
    retenciones = q.all()
    if not retenciones:
        raise HTTPException(status_code=404, detail="No hay retenciones pendientes que coincidan")
    for r in retenciones:
        r.depositada = True
        r.fecha_deposito = ahora
        r.comprobante_deposito = comp
    db.commit()
    total = float(sum((Decimal(str(r.importe)) for r in retenciones), CERO))
    return {"depositadas": len(retenciones), "importe": total, "comprobante_deposito": comp}


# ── Pago de OP descontando retenciones (y embargos) ──────────────────
op_pago_router = APIRouter(prefix="/ordenes-pago", tags=["Pagos con retenciones"])


@op_pago_router.post("/{id}/pagar-con-retenciones")
def pagar_con_retenciones(id: int, data: PagoConRetencionesIn, request: Request,
                          db: Session = Depends(get_db),
                          current_user: dict = Depends(get_current_user)):
    """Paga una OP descontando retenciones y embargos judiciales.
    neto = importe OP - retenciones - embargos. Las retenciones quedan como pasivo a depositar.
    """
    _requiere(current_user, "tesoreria_pagar")
    op = db.query(OrdenPago).filter(OrdenPago.id == id, OrdenPago.activo == True).first()
    if not op:
        raise HTTPException(status_code=404, detail="OP inexistente")
    if op.estado != "pendiente":
        raise HTTPException(status_code=409, detail=f"La OP está '{op.estado}'")
    if data.medio not in MEDIOS_PAGO:
        raise HTTPException(status_code=400, detail=f"Medio inválido; use uno de {MEDIOS_PAGO}")
    if data.medio in ("cheque", "transferencia", "orden_bancaria"):
        if not data.id_cuenta_bancaria or not db.query(CuentaBancaria).filter(
                CuentaBancaria.id == data.id_cuenta_bancaria, CuentaBancaria.activo == True).first():
            raise HTTPException(status_code=400, detail="Debe indicar una cuenta bancaria válida para ese medio")
    if data.medio == "cheque" and not (data.numero_cheque or "").strip():
        raise HTTPException(status_code=400, detail="El cheque requiere número")

    importe_op = _dec(op.importe)
    total_ret = _dec(sum((Decimal(str(l.importe)) for l in data.retenciones), CERO))
    if total_ret < 0:
        raise HTTPException(status_code=400, detail="Retenciones inválidas")

    # Embargos judiciales activos sobre el beneficiario
    embargos_info = []
    total_embargo = CERO
    disponible_para_embargo = importe_op - total_ret
    if op.id_beneficiario:
        embargos = db.query(EmbargoBeneficiario).filter(
            EmbargoBeneficiario.id_beneficiario == op.id_beneficiario,
            EmbargoBeneficiario.activo == True).all()
        for emb in embargos:
            if disponible_para_embargo <= CERO:
                break
            if emb.tipo == "porcentaje":
                monto = _dec(disponible_para_embargo * (_dec(emb.importe_o_porcentaje) / Decimal("100")))
            else:
                monto = _dec(emb.importe_o_porcentaje)
            monto = min(monto, disponible_para_embargo)
            if monto <= CERO:
                continue
            emb.retenido_acumulado = _dec(_dec(emb.retenido_acumulado) + monto)
            total_embargo += monto
            disponible_para_embargo -= monto
            embargos_info.append({
                "id_embargo": emb.id, "caratula": emb.caratula, "juzgado": emb.juzgado,
                "tipo": emb.tipo, "retenido": float(monto),
            })

    neto = _dec(importe_op - total_ret - total_embargo)
    if neto < CERO:
        raise HTTPException(status_code=400, detail="Las retenciones superan el importe de la OP")

    e = Egreso(
        id_orden_pago=op.id, medio=data.medio, id_cuenta_bancaria=data.id_cuenta_bancaria,
        numero_cheque=data.numero_cheque, importe=neto,
        usuario_nombre=_quien(current_user), observaciones=data.observaciones)
    db.add(e)
    db.flush()  # obtener e.id

    rets_creadas = []
    for l in data.retenciones:
        r = RetencionPago(
            id_orden_pago=op.id, id_egreso=e.id, regimen=l.regimen.strip(),
            base=_dec(l.base), alicuota=_dec(l.alicuota), importe=_dec(l.importe),
            comprobante=l.comprobante, creado_por=_quien(current_user))
        db.add(r)
        rets_creadas.append(r)

    op.estado = "pagada"
    db.commit()
    db.refresh(op)

    # cierre contable: hecho económico "retencion.practicada" (Proveedores a Fondos de terceros)
    if total_ret > CERO:
        _postear_contab("retencion.practicada", f"ret-op-{op.id}", total_ret,
                        f"Retenciones OP-{op.anio}-{op.numero:05d}",
                        {"orden_pago": op.id, "regimenes": [l.regimen for l in data.retenciones]},
                        request.headers.get("authorization"))

    return {
        "id": op.id, "orden_pago": f"OP-{op.anio}-{op.numero:05d}",
        "estado": op.estado,
        "importe_op": float(importe_op),
        "total_retenciones": float(total_ret),
        "total_embargos": float(total_embargo),
        "neto_pagado": float(neto),
        "medio": data.medio,
        "retenciones": [_ser_ret(r) for r in rets_creadas],
        "embargos_aplicados": embargos_info,
    }


# ═══════════════════════════════════════════════════════════════════════
# PROGRAMACIÓN DE CAJA (F47 / F48)
# ═══════════════════════════════════════════════════════════════════════
prog_router = APIRouter(prefix="/programacion-caja", tags=["Programación de caja"])
_PG = ["id", "anio", "periodo", "concepto", "tipo", "importe", "activo"]


class ProgramacionIn(BaseModel):
    anio: int
    periodo: int
    concepto: str
    tipo: str
    importe: Decimal = Decimal("0")
    activo: bool = True


def _ser_prog(p: ProgramacionCaja):
    return {c: (float(getattr(p, c)) if c == "importe" else getattr(p, c)) for c in _PG}


@prog_router.get("")
def listar_prog(request: Request, anio: int = Query(None), skip: int = Query(0, ge=0),
                limit: int = Query(100, ge=1, le=200), db: Session = Depends(get_db),
                current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "tesoreria_read")
    q = db.query(ProgramacionCaja).filter(ProgramacionCaja.activo == True)
    if anio:
        q = q.filter(ProgramacionCaja.anio == anio)
    q = filtered_query(q, ProgramacionCaja, dict(request.query_params),
                       exclude={"skip", "limit", "anio"}, default_sort="periodo")
    return [_ser_prog(p) for p in q.offset(skip).limit(limit).all()]


@prog_router.post("", status_code=201)
def crear_prog(data: ProgramacionIn, db: Session = Depends(get_db),
               current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "tesoreria_programar_caja")
    if data.tipo not in TIPOS_PROG:
        raise HTTPException(status_code=400, detail=f"tipo inválido; use uno de {list(TIPOS_PROG)}")
    if not (1 <= data.periodo <= 12):
        raise HTTPException(status_code=400, detail="periodo debe estar entre 1 y 12")
    p = ProgramacionCaja(**data.model_dump(), creado_por=_quien(current_user))
    db.add(p); db.commit(); db.refresh(p)
    return _ser_prog(p)


@prog_router.put("/{pid}")
def edit_prog(pid: int, data: ProgramacionIn, db: Session = Depends(get_db),
              current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "tesoreria_programar_caja")
    p = db.query(ProgramacionCaja).filter(ProgramacionCaja.id == pid).first()
    if not p:
        raise HTTPException(status_code=404, detail="Programación inexistente")
    if data.tipo not in TIPOS_PROG:
        raise HTTPException(status_code=400, detail=f"tipo inválido; use uno de {list(TIPOS_PROG)}")
    for k, v in data.model_dump().items():
        setattr(p, k, v)
    db.commit()
    return _ser_prog(p)


@prog_router.delete("/{pid}")
def del_prog(pid: int, db: Session = Depends(get_db),
             current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "tesoreria_programar_caja")
    p = db.query(ProgramacionCaja).filter(ProgramacionCaja.id == pid).first()
    if not p:
        raise HTTPException(status_code=404, detail="Programación inexistente")
    p.activo = False; db.commit()
    return {"message": "dada de baja"}


@prog_router.get("/flujo")
def flujo_caja(anio: int = Query(...), db: Session = Depends(get_db),
               current_user: dict = Depends(get_current_user)):
    """Compara previsto (programación) vs real por período.
    Real: egresos efectivos (parte diario) y recaudación (ingresos).
    """
    _requiere(current_user, "tesoreria_read")

    # Previsto agrupado por periodo/tipo
    prev = (db.query(ProgramacionCaja.periodo, ProgramacionCaja.tipo,
                     func.sum(ProgramacionCaja.importe))
            .filter(ProgramacionCaja.activo == True, ProgramacionCaja.anio == anio)
            .group_by(ProgramacionCaja.periodo, ProgramacionCaja.tipo).all())
    ingreso_prev = {m: CERO for m in range(1, 13)}
    egreso_prev = {m: CERO for m in range(1, 13)}
    for periodo, tipo, imp in prev:
        if tipo == "ingreso_previsto":
            ingreso_prev[periodo] = _dec(imp)
        elif tipo == "egreso_previsto":
            egreso_prev[periodo] = _dec(imp)

    # Egresos reales por mes (parte diario)
    mes_eg = func.extract("month", Egreso.fecha)
    egr = (db.query(mes_eg, func.sum(Egreso.importe))
           .filter(Egreso.activo == True,
                   func.extract("year", Egreso.fecha) == anio)
           .group_by(mes_eg).all())
    egreso_real = {m: CERO for m in range(1, 13)}
    for mes, imp in egr:
        if mes:
            egreso_real[int(mes)] = _dec(imp)

    # Recaudación real por mes (ingresos)
    mes_re = func.extract("month", Recaudacion.fecha_cobro)
    rec = (db.query(mes_re, func.sum(Recaudacion.importe_cobro))
           .filter(func.extract("year", Recaudacion.fecha_cobro) == anio)
           .group_by(mes_re).all())
    ingreso_real = {m: CERO for m in range(1, 13)}
    for mes, imp in rec:
        if mes:
            ingreso_real[int(mes)] = _dec(imp)

    filas = []
    for m in range(1, 13):
        ip, ir = ingreso_prev[m], ingreso_real[m]
        ep, er = egreso_prev[m], egreso_real[m]
        filas.append({
            "periodo": m,
            "ingreso_previsto": float(ip), "ingreso_real": float(ir),
            "egreso_previsto": float(ep), "egreso_real": float(er),
            "flujo_previsto": float(ip - ep), "flujo_real": float(ir - er),
            "desvio": float((ir - er) - (ip - ep)),
        })
    tot = {
        "ingreso_previsto": float(sum(ingreso_prev.values(), CERO)),
        "ingreso_real": float(sum(ingreso_real.values(), CERO)),
        "egreso_previsto": float(sum(egreso_prev.values(), CERO)),
        "egreso_real": float(sum(egreso_real.values(), CERO)),
    }
    tot["flujo_previsto"] = tot["ingreso_previsto"] - tot["egreso_previsto"]
    tot["flujo_real"] = tot["ingreso_real"] - tot["egreso_real"]
    return {"anio": anio, "meses": filas, "total": tot}


# ═══════════════════════════════════════════════════════════════════════
# EMBARGOS JUDICIALES
# ═══════════════════════════════════════════════════════════════════════
embargos_router = APIRouter(prefix="/embargos", tags=["Embargos judiciales"])
_EM = ["id", "id_beneficiario", "caratula", "juzgado", "tipo",
       "importe_o_porcentaje", "retenido_acumulado", "activo"]


class EmbargoIn(BaseModel):
    id_beneficiario: int
    caratula: str
    juzgado: Optional[str] = None
    tipo: str = "importe"
    importe_o_porcentaje: Decimal = Decimal("0")
    activo: bool = True


def _ser_emb(e: EmbargoBeneficiario, db: Session):
    b = db.query(Beneficiario).filter(Beneficiario.id == e.id_beneficiario).first()
    row = {c: (float(getattr(e, c)) if c in ("importe_o_porcentaje", "retenido_acumulado")
               else getattr(e, c)) for c in _EM}
    row["beneficiario"] = b.nombre if b else None
    return row


@embargos_router.get("")
def listar_emb(request: Request, id_beneficiario: int = Query(None), skip: int = Query(0, ge=0),
               limit: int = Query(50, ge=1, le=200), db: Session = Depends(get_db),
               current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "tesoreria_read")
    q = db.query(EmbargoBeneficiario)
    if id_beneficiario:
        q = q.filter(EmbargoBeneficiario.id_beneficiario == id_beneficiario)
    q = filtered_query(q, EmbargoBeneficiario, dict(request.query_params),
                       exclude={"skip", "limit", "id_beneficiario"}, default_sort="id", default_dir="desc")
    return [_ser_emb(e, db) for e in q.offset(skip).limit(limit).all()]


@embargos_router.post("", status_code=201)
def crear_emb(data: EmbargoIn, db: Session = Depends(get_db),
              current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "tesoreria_embargos")
    if data.tipo not in TIPOS_EMBARGO:
        raise HTTPException(status_code=400, detail=f"tipo inválido; use uno de {list(TIPOS_EMBARGO)}")
    if not db.query(Beneficiario).filter(Beneficiario.id == data.id_beneficiario).first():
        raise HTTPException(status_code=400, detail="Beneficiario inexistente")
    e = EmbargoBeneficiario(**data.model_dump(), creado_por=_quien(current_user))
    db.add(e); db.commit(); db.refresh(e)
    return _ser_emb(e, db)


@embargos_router.put("/{eid}")
def edit_emb(eid: int, data: EmbargoIn, db: Session = Depends(get_db),
             current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "tesoreria_embargos")
    if data.tipo not in TIPOS_EMBARGO:
        raise HTTPException(status_code=400, detail=f"tipo inválido; use uno de {list(TIPOS_EMBARGO)}")
    e = db.query(EmbargoBeneficiario).filter(EmbargoBeneficiario.id == eid).first()
    if not e:
        raise HTTPException(status_code=404, detail="Embargo inexistente")
    for k, v in data.model_dump().items():
        setattr(e, k, v)
    db.commit()
    return _ser_emb(e, db)


@embargos_router.delete("/{eid}")
def del_emb(eid: int, db: Session = Depends(get_db),
            current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "tesoreria_embargos")
    e = db.query(EmbargoBeneficiario).filter(EmbargoBeneficiario.id == eid).first()
    if not e:
        raise HTTPException(status_code=404, detail="Embargo inexistente")
    e.activo = False; db.commit()
    return {"message": "levantado"}


# ═══════════════════════════════════════════════════════════════════════
# PODERES / APODERADOS
# ═══════════════════════════════════════════════════════════════════════
poderes_router = APIRouter(prefix="/poderes", tags=["Poderes / apoderados"])
_PO = ["id", "id_beneficiario", "apoderado_nombre", "apoderado_cuit",
       "vigencia_desde", "vigencia_hasta", "observaciones", "activo"]


class PoderIn(BaseModel):
    id_beneficiario: int
    apoderado_nombre: str
    apoderado_cuit: Optional[str] = None
    vigencia_desde: Optional[date] = None
    vigencia_hasta: Optional[date] = None
    observaciones: Optional[str] = None
    activo: bool = True


def _ser_pod(p: Poder, db: Session):
    b = db.query(Beneficiario).filter(Beneficiario.id == p.id_beneficiario).first()
    row = {c: getattr(p, c) for c in _PO}
    row["beneficiario"] = b.nombre if b else None
    return row


@poderes_router.get("")
def listar_pod(request: Request, id_beneficiario: int = Query(None), skip: int = Query(0, ge=0),
               limit: int = Query(50, ge=1, le=200), db: Session = Depends(get_db),
               current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "tesoreria_read")
    q = db.query(Poder)
    if id_beneficiario:
        q = q.filter(Poder.id_beneficiario == id_beneficiario)
    q = filtered_query(q, Poder, dict(request.query_params),
                       exclude={"skip", "limit", "id_beneficiario"}, default_sort="id", default_dir="desc")
    return [_ser_pod(p, db) for p in q.offset(skip).limit(limit).all()]


@poderes_router.post("", status_code=201)
def crear_pod(data: PoderIn, db: Session = Depends(get_db),
              current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "tesoreria_poderes")
    if not db.query(Beneficiario).filter(Beneficiario.id == data.id_beneficiario).first():
        raise HTTPException(status_code=400, detail="Beneficiario inexistente")
    p = Poder(**data.model_dump(), creado_por=_quien(current_user))
    db.add(p); db.commit(); db.refresh(p)
    return _ser_pod(p, db)


@poderes_router.put("/{pid}")
def edit_pod(pid: int, data: PoderIn, db: Session = Depends(get_db),
             current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "tesoreria_poderes")
    p = db.query(Poder).filter(Poder.id == pid).first()
    if not p:
        raise HTTPException(status_code=404, detail="Poder inexistente")
    for k, v in data.model_dump().items():
        setattr(p, k, v)
    db.commit()
    return _ser_pod(p, db)


@poderes_router.delete("/{pid}")
def del_pod(pid: int, db: Session = Depends(get_db),
            current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "tesoreria_poderes")
    p = db.query(Poder).filter(Poder.id == pid).first()
    if not p:
        raise HTTPException(status_code=404, detail="Poder inexistente")
    p.activo = False; db.commit()
    return {"message": "revocado"}
