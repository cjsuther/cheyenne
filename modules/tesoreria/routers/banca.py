import sys
import os
from datetime import datetime, timezone, date
from decimal import Decimal
from typing import Optional, List

from fastapi import APIRouter, Depends, Query, HTTPException, status, Body
from fastapi.responses import PlainTextResponse
from sqlalchemy import func
from sqlalchemy.orm import Session
from starlette.requests import Request
from pydantic import BaseModel

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", ".."))
from shared.base_module import create_auth_dependency
from shared.filters import filtered_query

from database import get_db
from config import get_settings
from models.egresos import CuentaBancaria, OrdenPago, Egreso
from models.banca import (
    Chequera, Cheque, OrdenBancaria, OrdenBancariaItem,
    ExtractoBancario, ExtractoMovimiento, ESTADOS_CHEQUE, ESTADOS_OB,
)

settings = get_settings()
get_current_user = create_auth_dependency(settings.seguridad_url)

CERO = Decimal("0.00")


def _requiere(cu: dict, permiso: str):
    if cu.get("superuser"):
        return
    if permiso not in [p["codigo"] for p in cu.get("permisos", [])]:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=f"No tiene el permiso '{permiso}'")


def _quien(cu: dict) -> str:
    return cu.get("nombre_apellido") or cu.get("codigo") or "?"


def _cuenta(db, id_cuenta):
    c = db.query(CuentaBancaria).filter(CuentaBancaria.id == id_cuenta, CuentaBancaria.activo == True).first()
    if not c:
        raise HTTPException(status_code=400, detail="Cuenta bancaria inexistente")
    return c


def _op_pendiente(db, id_op):
    op = db.query(OrdenPago).filter(OrdenPago.id == id_op, OrdenPago.activo == True).first()
    if not op:
        raise HTTPException(status_code=400, detail=f"OP {id_op} inexistente")
    if op.estado != "pendiente":
        raise HTTPException(status_code=409, detail=f"La OP {op.numero} está '{op.estado}'")
    return op


# ═══ Cheques ═════════════════════════════════════════════════════════
cheques_router = APIRouter(prefix="/cheques", tags=["Cheques"])
chequeras_router = APIRouter(prefix="/chequeras", tags=["Chequeras"])


class ChequeraIn(BaseModel):
    id_cuenta_bancaria: int
    descripcion: Optional[str] = None
    numero_desde: int
    numero_hasta: int


def _ser_chequera(ch: Chequera):
    return {"id": ch.id, "id_cuenta_bancaria": ch.id_cuenta_bancaria, "descripcion": ch.descripcion,
            "numero_desde": ch.numero_desde, "numero_hasta": ch.numero_hasta,
            "proximo_numero": ch.proximo_numero,
            "disponibles": max(0, ch.numero_hasta - ch.proximo_numero + 1), "activo": ch.activo}


@chequeras_router.get("")
def listar_chequeras(id_cuenta_bancaria: int = Query(None), db: Session = Depends(get_db),
                     current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "tesoreria_read")
    q = db.query(Chequera).filter(Chequera.activo == True)
    if id_cuenta_bancaria:
        q = q.filter(Chequera.id_cuenta_bancaria == id_cuenta_bancaria)
    return [_ser_chequera(c) for c in q.order_by(Chequera.id.desc()).all()]


@chequeras_router.post("", status_code=201)
def crear_chequera(data: ChequeraIn, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "tesoreria_write")
    _cuenta(db, data.id_cuenta_bancaria)
    if data.numero_hasta < data.numero_desde:
        raise HTTPException(status_code=400, detail="Rango de numeración inválido")
    ch = Chequera(id_cuenta_bancaria=data.id_cuenta_bancaria, descripcion=data.descripcion,
                  numero_desde=data.numero_desde, numero_hasta=data.numero_hasta,
                  proximo_numero=data.numero_desde)
    db.add(ch); db.commit(); db.refresh(ch)
    return _ser_chequera(ch)


class ChequeIn(BaseModel):
    id_cuenta_bancaria: int
    importe: Optional[Decimal] = None       # si viene de OP se toma de la OP
    beneficiario_nombre: Optional[str] = None
    numero: Optional[str] = None            # si no viene y hay chequera, se autonumera
    id_chequera: Optional[int] = None
    id_orden_pago: Optional[int] = None
    diferido: bool = False
    fecha_pago: Optional[date] = None


def _ser_cheque(ck: Cheque):
    return {
        "id": ck.id, "id_cuenta_bancaria": ck.id_cuenta_bancaria, "numero": ck.numero,
        "importe": float(ck.importe), "beneficiario": ck.beneficiario_nombre,
        "id_orden_pago": ck.id_orden_pago, "diferido": ck.diferido,
        "fecha_emision": ck.fecha_emision, "fecha_pago": ck.fecha_pago.isoformat() if ck.fecha_pago else None,
        "estado": ck.estado, "creado_por": ck.creado_por,
    }


@cheques_router.get("")
def listar_cheques(request: Request, id_cuenta_bancaria: int = Query(None), estado: str = Query(None),
                   diferido: bool = Query(None), skip: int = Query(0, ge=0), limit: int = Query(50, ge=1, le=200),
                   db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "tesoreria_read")
    q = db.query(Cheque).filter(Cheque.activo == True)
    if id_cuenta_bancaria:
        q = q.filter(Cheque.id_cuenta_bancaria == id_cuenta_bancaria)
    if estado:
        q = q.filter(Cheque.estado == estado)
    if diferido is not None:
        q = q.filter(Cheque.diferido == diferido)
    q = filtered_query(q, Cheque, dict(request.query_params),
                       exclude={"skip", "limit", "id_cuenta_bancaria", "estado", "diferido"},
                       default_sort="id", default_dir="desc")
    return [_ser_cheque(c) for c in q.offset(skip).limit(limit).all()]


@cheques_router.post("", status_code=201)
def emitir_cheque(data: ChequeIn, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    """Libra un cheque. Si viene ligado a una OP pendiente, la paga (genera egreso)."""
    _requiere(current_user, "tesoreria_pagar")
    _cuenta(db, data.id_cuenta_bancaria)
    if data.diferido and not data.fecha_pago:
        raise HTTPException(status_code=400, detail="Un cheque diferido requiere fecha de pago")

    op = None
    importe = data.importe
    beneficiario = data.beneficiario_nombre
    if data.id_orden_pago:
        op = _op_pendiente(db, data.id_orden_pago)
        importe = Decimal(str(op.importe))
        beneficiario = beneficiario or op.beneficiario_nombre
    if importe is None or Decimal(str(importe)) <= 0:
        raise HTTPException(status_code=400, detail="Importe inválido")

    # numeración
    numero = (data.numero or "").strip()
    chequera = None
    if data.id_chequera:
        chequera = db.query(Chequera).filter(Chequera.id == data.id_chequera, Chequera.activo == True).first()
        if not chequera:
            raise HTTPException(status_code=400, detail="Chequera inexistente")
        if chequera.id_cuenta_bancaria != data.id_cuenta_bancaria:
            raise HTTPException(status_code=400, detail="La chequera es de otra cuenta")
        if not numero:
            if chequera.proximo_numero > chequera.numero_hasta:
                raise HTTPException(status_code=409, detail="La chequera no tiene cheques disponibles")
            numero = str(chequera.proximo_numero)
            chequera.proximo_numero += 1
    if not numero:
        raise HTTPException(status_code=400, detail="Indique número de cheque o una chequera")
    if db.query(Cheque).filter(Cheque.id_cuenta_bancaria == data.id_cuenta_bancaria,
                               Cheque.numero == numero, Cheque.activo == True).first():
        raise HTTPException(status_code=409, detail=f"Ya existe el cheque {numero} en esa cuenta")

    egreso = None
    if op:
        egreso = Egreso(id_orden_pago=op.id, medio="cheque", id_cuenta_bancaria=data.id_cuenta_bancaria,
                        numero_cheque=numero, importe=importe, usuario_nombre=_quien(current_user),
                        observaciones="Cheque diferido" if data.diferido else None)
        db.add(egreso); db.flush()
        op.estado = "pagada"

    ck = Cheque(id_cuenta_bancaria=data.id_cuenta_bancaria, id_chequera=data.id_chequera,
                numero=numero, importe=importe, beneficiario_nombre=beneficiario,
                id_orden_pago=op.id if op else None, id_egreso=egreso.id if egreso else None,
                diferido=data.diferido, fecha_pago=data.fecha_pago, estado="emitido",
                creado_por=_quien(current_user))
    db.add(ck); db.commit(); db.refresh(ck)
    return _ser_cheque(ck)


def _transicion_cheque(id, nuevo, db, cu, permiso, desde):
    _requiere(cu, permiso)
    ck = db.query(Cheque).filter(Cheque.id == id, Cheque.activo == True).first()
    if not ck:
        raise HTTPException(status_code=404, detail="Cheque inexistente")
    if ck.estado not in desde:
        raise HTTPException(status_code=409, detail=f"No se puede pasar a '{nuevo}' desde '{ck.estado}'")
    ck.estado = nuevo
    # anular/rechazar: revertir el pago (egreso y OP) si estaba ligado
    if nuevo in ("anulado", "rechazado") and ck.id_egreso:
        db.query(Egreso).filter(Egreso.id == ck.id_egreso).update({Egreso.activo: False}, synchronize_session=False)
        if ck.id_orden_pago:
            op = db.query(OrdenPago).filter(OrdenPago.id == ck.id_orden_pago).first()
            if op and op.estado == "pagada":
                op.estado = "pendiente"
    db.commit(); db.refresh(ck)
    return _ser_cheque(ck)


@cheques_router.post("/{id}/entregar")
def entregar_cheque(id: int, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    return _transicion_cheque(id, "entregado", db, current_user, "tesoreria_pagar", ("emitido",))


@cheques_router.post("/{id}/cobrar")
def cobrar_cheque(id: int, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    return _transicion_cheque(id, "cobrado", db, current_user, "tesoreria_pagar", ("emitido", "entregado"))


@cheques_router.post("/{id}/anular")
def anular_cheque(id: int, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    return _transicion_cheque(id, "anulado", db, current_user, "tesoreria_anular_pago", ("emitido", "entregado"))


@cheques_router.post("/{id}/rechazar")
def rechazar_cheque(id: int, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    return _transicion_cheque(id, "rechazado", db, current_user, "tesoreria_anular_pago", ("emitido", "entregado"))


# ═══ Órdenes bancarias / archivo ═════════════════════════════════════
ob_router = APIRouter(prefix="/ordenes-bancarias", tags=["Órdenes bancarias"])


class OBIn(BaseModel):
    id_cuenta_bancaria: int
    descripcion: Optional[str] = None
    ordenes_pago: List[int]


def _ser_ob(ob: OrdenBancaria, db, con_items=True):
    out = {"id": ob.id, "id_cuenta_bancaria": ob.id_cuenta_bancaria, "fecha": ob.fecha,
           "descripcion": ob.descripcion, "estado": ob.estado, "total": float(ob.total),
           "creado_por": ob.creado_por}
    if con_items:
        items = db.query(OrdenBancariaItem).filter(OrdenBancariaItem.id_orden_bancaria == ob.id).all()
        out["items"] = [{"id": i.id, "id_orden_pago": i.id_orden_pago, "beneficiario": i.beneficiario_nombre,
                         "cbu": i.cbu, "importe": float(i.importe)} for i in items]
    return out


@ob_router.get("")
def listar_ob(id_cuenta_bancaria: int = Query(None), estado: str = Query(None),
              skip: int = Query(0, ge=0), limit: int = Query(50, ge=1, le=200),
              db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "tesoreria_read")
    q = db.query(OrdenBancaria).filter(OrdenBancaria.activo == True)
    if id_cuenta_bancaria:
        q = q.filter(OrdenBancaria.id_cuenta_bancaria == id_cuenta_bancaria)
    if estado:
        q = q.filter(OrdenBancaria.estado == estado)
    return [_ser_ob(ob, db, con_items=False) for ob in q.order_by(OrdenBancaria.id.desc()).offset(skip).limit(limit).all()]


@ob_router.get("/{id}")
def obtener_ob(id: int, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "tesoreria_read")
    ob = db.query(OrdenBancaria).filter(OrdenBancaria.id == id, OrdenBancaria.activo == True).first()
    if not ob:
        raise HTTPException(status_code=404, detail="Orden bancaria inexistente")
    return _ser_ob(ob, db)


@ob_router.post("", status_code=201)
def crear_ob(data: OBIn, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    """Arma un lote de transferencias con OP pendientes (una por beneficiario)."""
    _requiere(current_user, "tesoreria_write")
    _cuenta(db, data.id_cuenta_bancaria)
    if not data.ordenes_pago:
        raise HTTPException(status_code=400, detail="Seleccione al menos una orden de pago")
    ob = OrdenBancaria(id_cuenta_bancaria=data.id_cuenta_bancaria, descripcion=data.descripcion,
                       estado="preparada", total=CERO, creado_por=_quien(current_user))
    db.add(ob); db.flush()
    total = CERO
    for id_op in data.ordenes_pago:
        op = _op_pendiente(db, id_op)
        total += Decimal(str(op.importe))
        db.add(OrdenBancariaItem(id_orden_bancaria=ob.id, id_orden_pago=op.id,
                                 beneficiario_nombre=op.beneficiario_nombre, cbu=None,
                                 importe=op.importe))
    ob.total = total
    db.commit(); db.refresh(ob)
    return _ser_ob(ob, db)


@ob_router.get("/{id}/archivo", response_class=PlainTextResponse)
def archivo_ob(id: int, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    """Genera el archivo de transferencias (formato de texto delimitado por banco)."""
    _requiere(current_user, "tesoreria_read")
    ob = db.query(OrdenBancaria).filter(OrdenBancaria.id == id, OrdenBancaria.activo == True).first()
    if not ob:
        raise HTTPException(status_code=404, detail="Orden bancaria inexistente")
    cuenta = _cuenta(db, ob.id_cuenta_bancaria)
    items = db.query(OrdenBancariaItem).filter(OrdenBancariaItem.id_orden_bancaria == ob.id).all()
    lineas = [f"H;{cuenta.banco};{cuenta.numero};{ob.total:.2f};{len(items)}"]
    for i in items:
        lineas.append(f"D;{(i.beneficiario_nombre or '').upper()};{i.cbu or ''};{i.importe:.2f}")
    return "\n".join(lineas)


@ob_router.post("/{id}/confirmar")
def confirmar_ob(id: int, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    """Confirma el envío: paga las OP del lote generando los egresos (medio orden_bancaria)."""
    _requiere(current_user, "tesoreria_pagar")
    ob = db.query(OrdenBancaria).filter(OrdenBancaria.id == id, OrdenBancaria.activo == True).first()
    if not ob:
        raise HTTPException(status_code=404, detail="Orden bancaria inexistente")
    if ob.estado == "confirmada":
        raise HTTPException(status_code=409, detail="La orden ya está confirmada")
    if ob.estado == "anulada":
        raise HTTPException(status_code=409, detail="La orden está anulada")
    items = db.query(OrdenBancariaItem).filter(OrdenBancariaItem.id_orden_bancaria == ob.id).all()
    for it in items:
        op = db.query(OrdenPago).filter(OrdenPago.id == it.id_orden_pago, OrdenPago.activo == True).first()
        if op and op.estado == "pendiente":
            db.add(Egreso(id_orden_pago=op.id, medio="orden_bancaria",
                          id_cuenta_bancaria=ob.id_cuenta_bancaria, importe=op.importe,
                          usuario_nombre=_quien(current_user),
                          observaciones=f"Orden bancaria #{ob.id}"))
            op.estado = "pagada"
    ob.estado = "confirmada"
    db.commit(); db.refresh(ob)
    return _ser_ob(ob, db)


@ob_router.post("/{id}/anular")
def anular_ob(id: int, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "tesoreria_anular_pago")
    ob = db.query(OrdenBancaria).filter(OrdenBancaria.id == id, OrdenBancaria.activo == True).first()
    if not ob:
        raise HTTPException(status_code=404, detail="Orden bancaria inexistente")
    if ob.estado == "confirmada":
        raise HTTPException(status_code=409, detail="No se anula una orden ya confirmada")
    ob.estado = "anulada"
    db.commit()
    return _ser_ob(ob, db)


# ═══ Conciliación bancaria ═══════════════════════════════════════════
conc_router = APIRouter(prefix="/conciliacion", tags=["Conciliación bancaria"])


class MovExtractoIn(BaseModel):
    fecha: Optional[date] = None
    descripcion: Optional[str] = None
    importe: Decimal                      # con signo: negativo = débito


class ExtractoIn(BaseModel):
    id_cuenta_bancaria: int
    periodo: str                          # 'YYYY-MM'
    saldo_inicial: Decimal = Decimal("0")
    saldo_final: Decimal = Decimal("0")
    movimientos: List[MovExtractoIn] = []


def _ser_mov(m: ExtractoMovimiento):
    return {"id": m.id, "fecha": m.fecha.isoformat() if m.fecha else None, "descripcion": m.descripcion,
            "importe": float(m.importe), "conciliado": m.conciliado, "id_egreso": m.id_egreso}


def _ser_extracto(ex: ExtractoBancario, db, con_movs=True):
    out = {"id": ex.id, "id_cuenta_bancaria": ex.id_cuenta_bancaria, "periodo": ex.periodo,
           "saldo_inicial": float(ex.saldo_inicial), "saldo_final": float(ex.saldo_final),
           "creado_por": ex.creado_por, "created_at": ex.created_at}
    if con_movs:
        movs = db.query(ExtractoMovimiento).filter(
            ExtractoMovimiento.id_extracto == ex.id, ExtractoMovimiento.activo == True).order_by(ExtractoMovimiento.id).all()
        out["movimientos"] = [_ser_mov(m) for m in movs]
    return out


@conc_router.get("/extractos")
def listar_extractos(id_cuenta_bancaria: int = Query(None), db: Session = Depends(get_db),
                     current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "tesoreria_read")
    q = db.query(ExtractoBancario).filter(ExtractoBancario.activo == True)
    if id_cuenta_bancaria:
        q = q.filter(ExtractoBancario.id_cuenta_bancaria == id_cuenta_bancaria)
    return [_ser_extracto(e, db, con_movs=False) for e in q.order_by(ExtractoBancario.id.desc()).all()]


@conc_router.post("/extractos", status_code=201)
def crear_extracto(data: ExtractoIn, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "tesoreria_conciliar")
    _cuenta(db, data.id_cuenta_bancaria)
    ex = ExtractoBancario(id_cuenta_bancaria=data.id_cuenta_bancaria, periodo=data.periodo,
                          saldo_inicial=data.saldo_inicial, saldo_final=data.saldo_final,
                          creado_por=_quien(current_user))
    db.add(ex); db.flush()
    for m in data.movimientos:
        db.add(ExtractoMovimiento(id_extracto=ex.id, fecha=m.fecha, descripcion=m.descripcion, importe=m.importe))
    db.commit(); db.refresh(ex)
    return _ser_extracto(ex, db)


@conc_router.get("/extractos/{id}")
def obtener_extracto(id: int, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "tesoreria_read")
    ex = db.query(ExtractoBancario).filter(ExtractoBancario.id == id, ExtractoBancario.activo == True).first()
    if not ex:
        raise HTTPException(status_code=404, detail="Extracto inexistente")
    return _ser_extracto(ex, db)


@conc_router.get("/extractos/{id}/egresos-pendientes")
def egresos_pendientes(id: int, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    """Egresos de la cuenta aún no conciliados (candidatos para casar con el extracto)."""
    _requiere(current_user, "tesoreria_read")
    ex = db.query(ExtractoBancario).filter(ExtractoBancario.id == id, ExtractoBancario.activo == True).first()
    if not ex:
        raise HTTPException(status_code=404, detail="Extracto inexistente")
    conciliados = {m.id_egreso for m in db.query(ExtractoMovimiento).filter(
        ExtractoMovimiento.id_egreso.isnot(None), ExtractoMovimiento.activo == True).all()}
    egresos = db.query(Egreso).filter(Egreso.id_cuenta_bancaria == ex.id_cuenta_bancaria,
                                      Egreso.activo == True).order_by(Egreso.fecha).all()
    ops = {op.id: op for op in db.query(OrdenPago).filter(
        OrdenPago.id.in_([e.id_orden_pago for e in egresos] or [0])).all()}
    return [{"id": e.id, "medio": e.medio, "numero_cheque": e.numero_cheque, "importe": float(e.importe),
             "fecha": e.fecha, "beneficiario": ops[e.id_orden_pago].beneficiario_nombre if e.id_orden_pago in ops else None}
            for e in egresos if e.id not in conciliados]


@conc_router.post("/extractos/{id}/auto-conciliar")
def auto_conciliar(id: int, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    """Concilia automáticamente: casa cada débito del extracto pendiente con un egreso no conciliado
    del mismo importe (y fecha cercana, ±5 días si ambos la tienen). 1 a 1, sin ambigüedad."""
    _requiere(current_user, "tesoreria_conciliar")
    ex = db.query(ExtractoBancario).filter(ExtractoBancario.id == id, ExtractoBancario.activo == True).first()
    if not ex:
        raise HTTPException(status_code=404, detail="Extracto inexistente")
    ya_conc = {m.id_egreso for m in db.query(ExtractoMovimiento).filter(
        ExtractoMovimiento.id_egreso.isnot(None), ExtractoMovimiento.activo == True).all()}
    egresos = [e for e in db.query(Egreso).filter(
        Egreso.id_cuenta_bancaria == ex.id_cuenta_bancaria, Egreso.activo == True).all() if e.id not in ya_conc]
    movs = db.query(ExtractoMovimiento).filter(
        ExtractoMovimiento.id_extracto == ex.id, ExtractoMovimiento.activo == True,
        ExtractoMovimiento.conciliado == False).all()

    def cerca(fa, fb):
        if not fa or not fb:
            return True
        try:
            return abs((fa - fb).days) <= 5
        except Exception:
            return True

    usados = set(); conciliados = 0
    for m in movs:
        if Decimal(str(m.importe)) >= 0:   # solo débitos (importe negativo) casan con egresos
            continue
        objetivo = abs(Decimal(str(m.importe)))
        candidatos = [e for e in egresos if e.id not in usados
                      and Decimal(str(e.importe)) == objetivo and cerca(m.fecha, e.fecha.date() if e.fecha else None)]
        if len(candidatos) >= 1:
            e = candidatos[0]
            m.id_egreso = e.id; m.conciliado = True; usados.add(e.id); conciliados += 1
    db.commit()
    return {"conciliados": conciliados, "movimientos_pendientes": len(movs) - conciliados,
            "egresos_sin_casar": len([e for e in egresos if e.id not in usados])}


@conc_router.post("/movimientos/{id}/conciliar")
def conciliar(id: int, data: dict = Body(...), db: Session = Depends(get_db),
              current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "tesoreria_conciliar")
    m = db.query(ExtractoMovimiento).filter(ExtractoMovimiento.id == id, ExtractoMovimiento.activo == True).first()
    if not m:
        raise HTTPException(status_code=404, detail="Movimiento inexistente")
    id_egreso = data.get("id_egreso")
    if id_egreso:
        eg = db.query(Egreso).filter(Egreso.id == id_egreso, Egreso.activo == True).first()
        if not eg:
            raise HTTPException(status_code=400, detail="Egreso inexistente")
        if db.query(ExtractoMovimiento).filter(ExtractoMovimiento.id_egreso == id_egreso,
                                               ExtractoMovimiento.id != id, ExtractoMovimiento.activo == True).first():
            raise HTTPException(status_code=409, detail="Ese egreso ya está conciliado")
        m.id_egreso = id_egreso
    m.conciliado = True
    db.commit()
    return _ser_mov(m)


@conc_router.post("/movimientos/{id}/desconciliar")
def desconciliar(id: int, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "tesoreria_conciliar")
    m = db.query(ExtractoMovimiento).filter(ExtractoMovimiento.id == id, ExtractoMovimiento.activo == True).first()
    if not m:
        raise HTTPException(status_code=404, detail="Movimiento inexistente")
    m.conciliado = False; m.id_egreso = None
    db.commit()
    return _ser_mov(m)


@conc_router.get("/extractos/{id}/resumen")
def resumen_conciliacion(id: int, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    """Saldo del extracto vs saldo contable de la cuenta y estado de conciliación."""
    _requiere(current_user, "tesoreria_read")
    ex = db.query(ExtractoBancario).filter(ExtractoBancario.id == id, ExtractoBancario.activo == True).first()
    if not ex:
        raise HTTPException(status_code=404, detail="Extracto inexistente")
    cuenta = _cuenta(db, ex.id_cuenta_bancaria)
    from models.egresos import DepositoBancario
    egresado = db.query(func.sum(Egreso.importe)).filter(
        Egreso.id_cuenta_bancaria == cuenta.id, Egreso.activo == True).scalar() or 0
    depositado = db.query(func.sum(DepositoBancario.importe)).filter(
        DepositoBancario.id_cuenta_bancaria == cuenta.id, DepositoBancario.activo == True).scalar() or 0
    saldo_contable = Decimal(str(cuenta.saldo_inicial)) + Decimal(str(depositado)) - Decimal(str(egresado))
    movs = db.query(ExtractoMovimiento).filter(
        ExtractoMovimiento.id_extracto == ex.id, ExtractoMovimiento.activo == True).all()
    total = len(movs)
    conciliados = sum(1 for m in movs if m.conciliado)
    egresos_totales = db.query(Egreso).filter(Egreso.id_cuenta_bancaria == cuenta.id, Egreso.activo == True).count()
    egresos_conc = db.query(ExtractoMovimiento).filter(
        ExtractoMovimiento.id_egreso.isnot(None), ExtractoMovimiento.activo == True).count()
    return {
        "cuenta": {"banco": cuenta.banco, "numero": cuenta.numero},
        "periodo": ex.periodo,
        "saldo_extracto": float(ex.saldo_final),
        "saldo_contable": float(saldo_contable),
        "diferencia": float(Decimal(str(ex.saldo_final)) - saldo_contable),
        "movimientos_total": total, "movimientos_conciliados": conciliados,
        "movimientos_pendientes": total - conciliados,
        "egresos_no_debitados": max(0, egresos_totales - egresos_conc),
        "conciliado": total > 0 and conciliados == total,
    }
