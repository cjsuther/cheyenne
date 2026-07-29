import sys
import os
from decimal import Decimal
from datetime import date, timedelta
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
from models.credito import Emprestito, CuotaEmprestito, Desembolso, TIPOS_DEUDA, SISTEMAS

settings = get_settings()
get_current_user = create_auth_dependency(settings.seguridad_url)

CERO = Decimal("0.00")
Q = Decimal("0.01")


def _requiere(cu, permiso):
    if cu.get("superuser"):
        return
    if permiso not in [p["codigo"] for p in cu.get("permisos", [])]:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=f"No tiene el permiso '{permiso}'")


def _quien(cu):
    return cu.get("nombre_apellido") or cu.get("codigo") or "?"


def _dec(v):
    return Decimal(str(v or 0)).quantize(Q)


def postear_contab(tipo, origen_ref, importe, concepto, contexto, token):
    """POST best-effort a Contabilidad. El contable arma el asiento."""
    import httpx
    try:
        if not importe or float(importe) <= 0:
            return
        with httpx.Client(timeout=6) as c:
            c.post(f"{settings.contabilidad_url}/transacciones",
                   json={"origen_modulo": "credito_publico", "origen_ref": str(origen_ref), "tipo": tipo,
                         "fecha": None, "importe": float(importe), "concepto": concepto, "contexto": contexto or {}},
                   headers={"Authorization": token} if token else {})
    except Exception:
        pass


emprestitos_router = APIRouter(prefix="/emprestitos", tags=["Empréstitos"])


class EmprestitoIn(BaseModel):
    codigo: str
    denominacion: str
    acreedor: Optional[str] = None
    moneda: str = "ARS"
    tipo: str = "prestamo"
    monto_original: Decimal
    tasa_anual: Decimal = Decimal("0")
    plazo_meses: int
    sistema: str = "frances"
    fecha_toma: Optional[date] = None


def _ser_emp(e: Emprestito):
    return {
        "id": e.id, "codigo": e.codigo, "denominacion": e.denominacion, "acreedor": e.acreedor,
        "moneda": e.moneda, "tipo": e.tipo, "monto_original": float(e.monto_original),
        "tasa_anual": float(e.tasa_anual), "plazo_meses": e.plazo_meses, "sistema": e.sistema,
        "fecha_toma": e.fecha_toma, "saldo_capital": float(e.saldo_capital),
        "desembolsado": float(e.desembolsado), "estado": e.estado,
    }


@emprestitos_router.get("")
def listar(request: Request, estado: str = Query(None), skip: int = Query(0, ge=0),
           limit: int = Query(50, ge=1, le=200), db: Session = Depends(get_db),
           current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "credito_read")
    q = db.query(Emprestito).filter(Emprestito.activo == True)
    if estado:
        q = q.filter(Emprestito.estado == estado)
    q = filtered_query(q, Emprestito, dict(request.query_params),
                       exclude={"skip", "limit", "estado"}, default_sort="codigo")
    return [_ser_emp(e) for e in q.offset(skip).limit(limit).all()]


@emprestitos_router.get("/resumen")
def resumen(db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    """Resumen de la deuda: saldo total vigente y servicio (capital+interés) pendiente."""
    _requiere(current_user, "credito_read")
    emps = db.query(Emprestito).filter(Emprestito.activo == True, Emprestito.estado != "cancelado").all()
    saldo = sum((_dec(e.saldo_capital) for e in emps), CERO)
    cuotas_pend = db.query(CuotaEmprestito).filter(CuotaEmprestito.estado == "pendiente").all()
    serv_capital = sum((_dec(c.capital) for c in cuotas_pend), CERO)
    serv_interes = sum((_dec(c.interes) for c in cuotas_pend), CERO)
    return {"emprestitos_vigentes": len(emps), "saldo_capital_total": float(saldo),
            "servicio_pendiente_capital": float(serv_capital), "servicio_pendiente_interes": float(serv_interes),
            "servicio_pendiente_total": float(serv_capital + serv_interes)}


@emprestitos_router.get("/{id}")
def obtener(id: int, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "credito_read")
    e = db.query(Emprestito).filter(Emprestito.id == id, Emprestito.activo == True).first()
    if not e:
        raise HTTPException(status_code=404, detail="Empréstito inexistente")
    out = _ser_emp(e)
    cuotas = db.query(CuotaEmprestito).filter(CuotaEmprestito.id_emprestito == id).order_by(CuotaEmprestito.numero).all()
    out["cuotas"] = [{"id": c.id, "numero": c.numero, "fecha_vencimiento": c.fecha_vencimiento,
                      "capital": float(c.capital), "interes": float(c.interes), "total": float(c.total),
                      "saldo_posterior": float(c.saldo_posterior), "estado": c.estado, "fecha_pago": c.fecha_pago}
                     for c in cuotas]
    desem = db.query(Desembolso).filter(Desembolso.id_emprestito == id).order_by(Desembolso.id).all()
    out["desembolsos"] = [{"id": d.id, "fecha": d.fecha, "importe": float(d.importe),
                           "estado": d.estado, "detalle": d.detalle} for d in desem]
    return out


@emprestitos_router.post("", status_code=201)
def crear(data: EmprestitoIn, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "credito_write")
    if data.tipo not in TIPOS_DEUDA:
        raise HTTPException(status_code=400, detail=f"Tipo inválido; use uno de {TIPOS_DEUDA}")
    if data.sistema not in SISTEMAS:
        raise HTTPException(status_code=400, detail=f"Sistema inválido; use uno de {SISTEMAS}")
    if db.query(Emprestito).filter(Emprestito.codigo == data.codigo.strip()).first():
        raise HTTPException(status_code=409, detail=f"Ya existe el empréstito {data.codigo}")
    if data.monto_original <= 0 or data.plazo_meses <= 0:
        raise HTTPException(status_code=400, detail="Monto y plazo deben ser mayores a cero")
    e = Emprestito(codigo=data.codigo.strip(), denominacion=data.denominacion, acreedor=data.acreedor,
                   moneda=data.moneda, tipo=data.tipo, monto_original=data.monto_original,
                   tasa_anual=data.tasa_anual, plazo_meses=data.plazo_meses, sistema=data.sistema,
                   fecha_toma=data.fecha_toma or date.today(), saldo_capital=CERO, desembolsado=CERO,
                   estado="vigente", creado_por=_quien(current_user))
    db.add(e); db.commit(); db.refresh(e)
    return _ser_emp(e)


def _add_meses(d: date, meses: int):
    m = d.month - 1 + meses
    y = d.year + m // 12
    mm = m % 12 + 1
    return date(y, mm, min(d.day, 28))


@emprestitos_router.post("/{id}/plan-amortizacion")
def generar_plan(id: int, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    """Genera el cronograma de amortización (sistema francés o alemán) sobre el monto original."""
    _requiere(current_user, "credito_write")
    e = db.query(Emprestito).filter(Emprestito.id == id, Emprestito.activo == True).first()
    if not e:
        raise HTTPException(status_code=404, detail="Empréstito inexistente")
    if db.query(CuotaEmprestito).filter(CuotaEmprestito.id_emprestito == id).first():
        raise HTTPException(status_code=409, detail="El empréstito ya tiene cronograma generado")
    P = _dec(e.monto_original)
    n = e.plazo_meses
    i = (_dec(e.tasa_anual) / Decimal("100") / Decimal("12"))  # tasa mensual
    inicio = e.fecha_toma or date.today()
    saldo = P
    if e.sistema == "frances" and i > 0:
        # cuota constante: P * i / (1 - (1+i)^-n)
        factor = (Decimal(1) - (Decimal(1) + i) ** (-n))
        cuota_fija = (P * i / factor).quantize(Q)
    for k in range(1, n + 1):
        if e.sistema == "aleman" or i == 0:
            capital = (P / Decimal(n)).quantize(Q)
            interes = (saldo * i).quantize(Q)
        else:
            interes = (saldo * i).quantize(Q)
            capital = (cuota_fija - interes).quantize(Q)
        if k == n:  # ajuste final para cerrar el saldo exacto
            capital = saldo
        saldo = (saldo - capital).quantize(Q)
        db.add(CuotaEmprestito(id_emprestito=id, numero=k, fecha_vencimiento=_add_meses(inicio, k),
                               capital=capital, interes=interes, total=(capital + interes).quantize(Q),
                               saldo_posterior=saldo, estado="pendiente"))
    db.commit()
    return obtener(id, db, current_user)


@emprestitos_router.post("/{id}/desembolso")
def desembolsar(id: int, request: Request, data: dict = Body(...), db: Session = Depends(get_db),
                current_user: dict = Depends(get_current_user)):
    """Registra un desembolso (entra plata, aumenta el pasivo). Postea al ledger."""
    _requiere(current_user, "credito_write")
    e = db.query(Emprestito).filter(Emprestito.id == id, Emprestito.activo == True).first()
    if not e:
        raise HTTPException(status_code=404, detail="Empréstito inexistente")
    importe = _dec(data.get("importe"))
    if importe <= 0:
        raise HTTPException(status_code=400, detail="Importe inválido")
    estado = data.get("estado", "real")
    d = Desembolso(id_emprestito=id, fecha=date.today(), importe=importe, estado=estado,
                   detalle=data.get("detalle"))
    db.add(d); db.flush()
    if estado == "real":
        e.desembolsado = _dec(e.desembolsado) + importe
        e.saldo_capital = _dec(e.saldo_capital) + importe
        postear_contab("credito.desembolso", f"desem-{d.id}", importe,
                       f"Desembolso empréstito {e.codigo}", {"id_emprestito": id},
                       request.headers.get("authorization"))
    db.commit()
    return _ser_emp(e)


cuotas_router = APIRouter(prefix="/cuotas", tags=["Servicio de deuda"])


@cuotas_router.post("/{id}/pagar")
def pagar_cuota(id: int, request: Request, db: Session = Depends(get_db),
                current_user: dict = Depends(get_current_user)):
    """Paga una cuota del servicio de deuda: amortiza capital y registra el interés.
    Postea dos hechos al ledger (capital e interés). Idempotente por cuota."""
    _requiere(current_user, "credito_servicio")
    c = db.query(CuotaEmprestito).filter(CuotaEmprestito.id == id).first()
    if not c:
        raise HTTPException(status_code=404, detail="Cuota inexistente")
    if c.estado == "pagada":
        raise HTTPException(status_code=409, detail="La cuota ya está pagada")
    e = db.query(Emprestito).filter(Emprestito.id == c.id_emprestito).first()
    c.estado = "pagada"; c.fecha_pago = date.today()
    if e:
        e.saldo_capital = _dec(e.saldo_capital) - _dec(c.capital)
        if _dec(e.saldo_capital) <= 0:
            e.saldo_capital = CERO
            e.estado = "cancelado"
    db.commit()
    token = request.headers.get("authorization")
    postear_contab("credito.pago_capital", f"cuota-cap-{c.id}", c.capital,
                   f"Amortización cuota {c.numero} empréstito {e.codigo if e else ''}",
                   {"id_emprestito": c.id_emprestito, "cuota": c.numero}, token)
    postear_contab("credito.pago_interes", f"cuota-int-{c.id}", c.interes,
                   f"Interés cuota {c.numero} empréstito {e.codigo if e else ''}",
                   {"id_emprestito": c.id_emprestito, "cuota": c.numero}, token)
    return {"id": c.id, "numero": c.numero, "estado": c.estado, "capital": float(c.capital),
            "interes": float(c.interes), "saldo_capital_emprestito": float(e.saldo_capital) if e else None}
