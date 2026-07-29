import sys
import os
from decimal import Decimal
from datetime import date, datetime, timezone
from typing import Optional

from fastapi import APIRouter, Depends, Query, HTTPException, status
from sqlalchemy import func
from sqlalchemy.orm import Session
from starlette.requests import Request
from pydantic import BaseModel

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", ".."))
from shared.base_module import create_auth_dependency
from shared.filters import filtered_query

from database import get_db
from config import get_settings
from models.cementerio import (
    Sepultura, Concesion, Difunto, Inhumacion, Traslado, TasaCementerio,
    TIPOS_INHUMACION, ESTADOS_TASA,
)

settings = get_settings()
get_current_user = create_auth_dependency(settings.seguridad_url)


def _requiere(cu, permiso):
    if cu.get("superuser"):
        return
    if permiso not in [p["codigo"] for p in cu.get("permisos", [])]:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=f"No tiene el permiso '{permiso}'")


def _quien(cu):
    return cu.get("nombre_apellido") or cu.get("codigo") or "?"


# ═══ Inhumaciones ════════════════════════════════════════════════════
inhumaciones_router = APIRouter(prefix="/inhumaciones", tags=["Inhumaciones"])
_I = ["id", "id_difunto", "id_sepultura", "fecha", "tipo", "observaciones", "registrado_por", "activo"]


class InhumacionIn(BaseModel):
    id_difunto: int
    id_sepultura: int
    fecha: Optional[date] = None
    tipo: str = "inhumacion"
    observaciones: Optional[str] = None


def _ser_inhum(x: Inhumacion, db):
    d = {c: getattr(x, c) for c in _I}
    dif = db.query(Difunto).filter(Difunto.id == x.id_difunto).first()
    sep = db.query(Sepultura).filter(Sepultura.id == x.id_sepultura).first()
    d["difunto"] = {"id": dif.id, "nombre": dif.nombre, "documento": dif.documento} if dif else None
    d["sepultura"] = {"id": sep.id, "tipo": sep.tipo, "seccion": sep.seccion,
                      "fila": sep.fila, "numero": sep.numero} if sep else None
    return d


@inhumaciones_router.get("")
def listar_inhumaciones(request: Request, skip: int = Query(0, ge=0), limit: int = Query(50, ge=1, le=200),
                        db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "cementerio_read")
    q = filtered_query(db.query(Inhumacion), Inhumacion, dict(request.query_params),
                       exclude={"skip", "limit"}, default_sort="id", default_dir="desc")
    return [_ser_inhum(x, db) for x in q.offset(skip).limit(limit).all()]


@inhumaciones_router.post("", status_code=201)
def registrar_inhumacion(data: InhumacionIn, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    """Registra una inhumación/exhumación/reducción.

    - inhumacion: marca la sepultura ocupada y fija la ubicación del difunto.
    - exhumacion: libera la sepultura y desvincula al difunto.
    """
    _requiere(current_user, "cementerio_write")
    if data.tipo not in TIPOS_INHUMACION:
        raise HTTPException(status_code=400, detail=f"Tipo inválido: {data.tipo}")
    dif = db.query(Difunto).filter(Difunto.id == data.id_difunto, Difunto.activo == True).first()
    if not dif:
        raise HTTPException(status_code=404, detail="Difunto inexistente")
    sep = db.query(Sepultura).filter(Sepultura.id == data.id_sepultura, Sepultura.activo == True).first()
    if not sep:
        raise HTTPException(status_code=404, detail="Sepultura inexistente")

    if data.tipo == "inhumacion":
        if sep.estado == "ocupada":
            raise HTTPException(status_code=409, detail=f"La sepultura {sep.numero} ya está ocupada")
        sep.estado = "ocupada"
        dif.id_sepultura = sep.id
        if data.fecha:
            dif.fecha_inhumacion = data.fecha
    elif data.tipo == "exhumacion":
        sep.estado = "libre"
        if dif.id_sepultura == sep.id:
            dif.id_sepultura = None

    x = Inhumacion(id_difunto=data.id_difunto, id_sepultura=data.id_sepultura, fecha=data.fecha,
                   tipo=data.tipo, observaciones=data.observaciones, registrado_por=_quien(current_user))
    db.add(x); db.commit(); db.refresh(x)
    return _ser_inhum(x, db)


# ═══ Traslados ═══════════════════════════════════════════════════════
traslados_router = APIRouter(prefix="/traslados", tags=["Traslados"])
_T = ["id", "id_difunto", "id_sepultura_origen", "id_sepultura_destino", "fecha",
      "motivo", "registrado_por", "activo"]


class TrasladoIn(BaseModel):
    id_difunto: int
    id_sepultura_destino: int
    id_sepultura_origen: Optional[int] = None
    fecha: Optional[date] = None
    motivo: Optional[str] = None


def _ser_traslado(x: Traslado, db):
    d = {c: getattr(x, c) for c in _T}
    dif = db.query(Difunto).filter(Difunto.id == x.id_difunto).first()
    d["difunto"] = {"id": dif.id, "nombre": dif.nombre} if dif else None
    for k, sid in (("origen", x.id_sepultura_origen), ("destino", x.id_sepultura_destino)):
        sep = db.query(Sepultura).filter(Sepultura.id == sid).first() if sid else None
        d[k] = {"id": sep.id, "numero": sep.numero, "seccion": sep.seccion} if sep else None
    return d


@traslados_router.get("")
def listar_traslados(request: Request, skip: int = Query(0, ge=0), limit: int = Query(50, ge=1, le=200),
                     db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "cementerio_read")
    q = filtered_query(db.query(Traslado), Traslado, dict(request.query_params),
                       exclude={"skip", "limit"}, default_sort="id", default_dir="desc")
    return [_ser_traslado(x, db) for x in q.offset(skip).limit(limit).all()]


@traslados_router.post("", status_code=201)
def registrar_traslado(data: TrasladoIn, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    """Traslada un difunto de una sepultura a otra: libera la de origen y ocupa la de destino."""
    _requiere(current_user, "cementerio_write")
    dif = db.query(Difunto).filter(Difunto.id == data.id_difunto, Difunto.activo == True).first()
    if not dif:
        raise HTTPException(status_code=404, detail="Difunto inexistente")
    destino = db.query(Sepultura).filter(Sepultura.id == data.id_sepultura_destino, Sepultura.activo == True).first()
    if not destino:
        raise HTTPException(status_code=404, detail="Sepultura destino inexistente")
    if destino.estado == "ocupada":
        raise HTTPException(status_code=409, detail=f"La sepultura destino {destino.numero} está ocupada")

    origen_id = data.id_sepultura_origen or dif.id_sepultura
    if origen_id:
        origen = db.query(Sepultura).filter(Sepultura.id == origen_id).first()
        if origen:
            origen.estado = "libre"

    destino.estado = "ocupada"
    dif.id_sepultura = destino.id

    x = Traslado(id_difunto=data.id_difunto, id_sepultura_origen=origen_id,
                 id_sepultura_destino=destino.id, fecha=data.fecha, motivo=data.motivo,
                 registrado_por=_quien(current_user))
    db.add(x); db.commit(); db.refresh(x)
    return _ser_traslado(x, db)


# ═══ Tasas ═══════════════════════════════════════════════════════════
tasas_router = APIRouter(prefix="/tasas", tags=["Tasas de cementerio"])
_TA = ["id", "id_concesion", "periodo", "concepto", "importe", "estado", "vencimiento", "activo"]


class LiquidarTasaIn(BaseModel):
    id_concesion: int
    periodo: str
    concepto: Optional[str] = "Tasa de mantenimiento de cementerio"
    importe: Decimal
    vencimiento: Optional[date] = None


def _ser_tasa(x: TasaCementerio):
    return {c: getattr(x, c) for c in _TA}


@tasas_router.get("")
def listar_tasas(request: Request, skip: int = Query(0, ge=0), limit: int = Query(50, ge=1, le=200),
                 db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "cementerio_read")
    q = filtered_query(db.query(TasaCementerio), TasaCementerio, dict(request.query_params),
                       exclude={"skip", "limit"}, default_sort="id", default_dir="desc")
    return [_ser_tasa(x) for x in q.offset(skip).limit(limit).all()]


@tasas_router.post("/liquidar", status_code=201)
def liquidar_tasa(data: LiquidarTasaIn, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    """Liquida (genera) una tasa de cementerio para una concesión y período dados."""
    _requiere(current_user, "cementerio_liquidar")
    c = db.query(Concesion).filter(Concesion.id == data.id_concesion, Concesion.activo == True).first()
    if not c:
        raise HTTPException(status_code=404, detail="Concesión inexistente")
    dup = db.query(TasaCementerio).filter(
        TasaCementerio.id_concesion == data.id_concesion,
        TasaCementerio.periodo == data.periodo,
        TasaCementerio.activo == True,
    ).first()
    if dup:
        raise HTTPException(status_code=409, detail=f"Ya existe una tasa del período {data.periodo} para esta concesión")
    x = TasaCementerio(id_concesion=data.id_concesion, periodo=data.periodo, concepto=data.concepto,
                       importe=data.importe, estado="pendiente", vencimiento=data.vencimiento)
    db.add(x); db.commit(); db.refresh(x)
    return _ser_tasa(x)


@tasas_router.post("/{id}/pagar")
def pagar_tasa(id: int, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "cementerio_liquidar")
    x = db.query(TasaCementerio).filter(TasaCementerio.id == id).first()
    if not x:
        raise HTTPException(status_code=404, detail="Tasa inexistente")
    if x.estado == "pagada":
        raise HTTPException(status_code=409, detail="La tasa ya está pagada")
    x.estado = "pagada"; db.commit()
    return _ser_tasa(x)


# ═══ Ocupación / Mapa ════════════════════════════════════════════════
ocupacion_router = APIRouter(prefix="/ocupacion", tags=["Ocupación"])


@ocupacion_router.get("")
def mapa_ocupacion(db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    """Mapa de ocupación del cementerio: resumen global, por tipo y por sección."""
    _requiere(current_user, "cementerio_read")
    base = db.query(Sepultura).filter(Sepultura.activo == True)

    por_estado = dict(
        db.query(Sepultura.estado, func.count(Sepultura.id))
        .filter(Sepultura.activo == True).group_by(Sepultura.estado).all()
    )
    total = sum(por_estado.values())

    por_tipo = [
        {"tipo": t, "estado": e, "cantidad": n}
        for t, e, n in db.query(Sepultura.tipo, Sepultura.estado, func.count(Sepultura.id))
        .filter(Sepultura.activo == True).group_by(Sepultura.tipo, Sepultura.estado).all()
    ]

    secciones = {}
    for sep in base.all():
        s = secciones.setdefault(sep.seccion or "—", {"seccion": sep.seccion or "—",
                                                       "libre": 0, "ocupada": 0, "reservada": 0, "total": 0})
        s[sep.estado] = s.get(sep.estado, 0) + 1
        s["total"] += 1

    return {
        "total": total,
        "libres": por_estado.get("libre", 0),
        "ocupadas": por_estado.get("ocupada", 0),
        "reservadas": por_estado.get("reservada", 0),
        "por_tipo": por_tipo,
        "por_seccion": sorted(secciones.values(), key=lambda x: x["seccion"]),
    }
