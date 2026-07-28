import sys
import os
from datetime import datetime, timezone
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
from models.modificacion import Modificacion, ModificacionItem, TIPOS_MODIFICACION
from models.partida import Partida, Movimiento
from models.ejercicio import Ejercicio
from services.saldos import saldos_de_partidas

settings = get_settings()
get_current_user = create_auth_dependency(settings.seguridad_url)

router = APIRouter(prefix="/modificaciones", tags=["Modificaciones Presupuestarias"])

CERO = Decimal("0.00")


class ItemIn(BaseModel):
    id_partida: int
    importe: Decimal
    detalle: str


class ModificacionIn(BaseModel):
    anio: int
    tipo: str
    acto_administrativo: str
    expediente: Optional[str] = None
    observaciones: Optional[str] = None
    items: List[ItemIn]


def _requiere(current_user: dict, permiso: str):
    if current_user.get("superuser"):
        return
    permisos = [p["codigo"] for p in current_user.get("permisos", [])]
    if permiso not in permisos:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=f"No tiene el permiso '{permiso}'")


def _quien(current_user: dict) -> str:
    return current_user.get("nombre_apellido") or current_user.get("codigo") or "?"


def _ejercicio_modificable(db: Session, anio: int) -> Ejercicio:
    e = db.query(Ejercicio).filter(Ejercicio.anio == anio, Ejercicio.activo == True).first()
    if not e:
        raise HTTPException(status_code=404, detail=f"Ejercicio {anio} no encontrado")
    if e.estado == "formulacion":
        raise HTTPException(status_code=409, detail="En formulación el crédito se edita directo en la partida; las modificaciones aplican desde la aprobación (RN-02)")
    if e.estado == "cerrado":
        raise HTTPException(status_code=409, detail="El ejercicio está cerrado (RN-13)")
    return e


def _validar_items(db: Session, data: ModificacionIn):
    """RN-03 + RN-04. Devuelve los items normalizados."""
    if data.tipo not in TIPOS_MODIFICACION:
        raise HTTPException(status_code=400, detail=f"Tipo inválido: {data.tipo}")
    if not (data.acto_administrativo or "").strip():
        raise HTTPException(status_code=400, detail="El acto administrativo es obligatorio (RN-07)")
    if not data.items:
        raise HTTPException(status_code=400, detail="Debe cargar al menos un ítem (RN-03)")
    total = CERO
    for i, it in enumerate(data.items, start=1):
        if it.importe == 0:
            raise HTTPException(status_code=400, detail=f"Ítem {i}: el importe no puede ser cero (RN-03)")
        if not (it.detalle or "").strip():
            raise HTTPException(status_code=400, detail=f"Ítem {i}: el detalle es obligatorio (RN-03)")
        p = db.query(Partida).filter(Partida.id == it.id_partida, Partida.activo == True,
                                     Partida.anio == data.anio).first()
        if not p:
            raise HTTPException(status_code=400, detail=f"Ítem {i}: partida {it.id_partida} inexistente en {data.anio} (RN-03)")
        if data.tipo == "ampliacion" and it.importe < 0:
            raise HTTPException(status_code=400, detail=f"Ítem {i}: una ampliación solo admite importes positivos (RN-04)")
        if data.tipo == "reduccion" and it.importe > 0:
            raise HTTPException(status_code=400, detail=f"Ítem {i}: una reducción solo admite importes negativos (RN-04)")
        total += it.importe
    if data.tipo == "compensacion" and total != 0:
        raise HTTPException(status_code=409, detail=f"La compensación debe balancear en cero: suma actual {total} (RN-04)")
    return data.items


def _serializar(m: Modificacion, db: Session, con_items: bool = False):
    items_q = db.query(ModificacionItem).filter(ModificacionItem.id_modificacion == m.id).all()
    amp = sum((i.importe for i in items_q if i.importe > 0), CERO)
    red = sum((i.importe for i in items_q if i.importe < 0), CERO)
    out = {
        "id": m.id, "anio": m.anio, "numero": m.numero, "fecha": m.fecha, "tipo": m.tipo,
        "acto_administrativo": m.acto_administrativo, "expediente": m.expediente,
        "estado": m.estado, "observaciones": m.observaciones,
        "creado_por": m.creado_por, "aprobado_por": m.aprobado_por, "fecha_aprobacion": m.fecha_aprobacion,
        "anulado_por": m.anulado_por, "fecha_anulacion": m.fecha_anulacion, "motivo_anulacion": m.motivo_anulacion,
        "total_ampliado": float(amp), "total_reducido": float(red), "cantidad_items": len(items_q),
    }
    if con_items:
        partidas = db.query(Partida).filter(Partida.id.in_([i.id_partida for i in items_q] or [0])).all()
        from routers.partidas import _nombres_nomencladores
        nombres = _nombres_nomencladores(db, partidas)
        dims = {p.id: p for p in partidas}
        def etiqueta(idp):
            p = dims.get(idp)
            if not p:
                return f"partida {idp}"
            j = nombres["juri"].get(p.id_jurisdiccion, {}).get("codigo")
            g = nombres["godg"].get(p.id_objeto_gasto, {}).get("codigo")
            e = nombres["espr"].get(p.id_estructura, {}).get("codigo")
            f = nombres["fufi"].get(p.id_fuente, {}).get("codigo")
            return f"{j} · {e} · {g} · {f}"
        out["items"] = [{"id": i.id, "id_partida": i.id_partida, "partida": etiqueta(i.id_partida),
                         "importe": float(i.importe), "detalle": i.detalle} for i in items_q]
    return out


@router.get("")
def listar(
    request: Request,
    anio: int = Query(...),
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=200),
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    _requiere(current_user, "presupuesto_read")
    query = db.query(Modificacion).filter(Modificacion.anio == anio, Modificacion.activo == True)
    query = filtered_query(query, Modificacion, dict(request.query_params),
                           exclude={"skip", "limit", "anio"}, default_sort="id", default_dir="desc")
    return [_serializar(m, db) for m in query.offset(skip).limit(limit).all()]


@router.get("/{id}")
def obtener(id: int, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "presupuesto_read")
    m = db.query(Modificacion).filter(Modificacion.id == id, Modificacion.activo == True).first()
    if not m:
        raise HTTPException(status_code=404, detail=f"Modificación {id} no encontrada")
    return _serializar(m, db, con_items=True)


@router.post("", status_code=201)
def crear(data: ModificacionIn, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "presupuesto_write")
    _ejercicio_modificable(db, data.anio)
    items = _validar_items(db, data)
    m = Modificacion(
        anio=data.anio, tipo=data.tipo, acto_administrativo=data.acto_administrativo.strip(),
        expediente=data.expediente, observaciones=data.observaciones, creado_por=_quien(current_user))
    db.add(m); db.flush()
    for it in items:
        db.add(ModificacionItem(id_modificacion=m.id, id_partida=it.id_partida,
                                importe=it.importe, detalle=it.detalle.strip()))
    db.commit()
    return _serializar(m, db, con_items=True)


@router.put("/{id}")
def actualizar(id: int, data: ModificacionIn, db: Session = Depends(get_db),
               current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "presupuesto_write")
    m = db.query(Modificacion).filter(Modificacion.id == id, Modificacion.activo == True).first()
    if not m:
        raise HTTPException(status_code=404, detail=f"Modificación {id} no encontrada")
    if m.estado != "borrador":
        raise HTTPException(status_code=409, detail="Solo se edita un borrador (RN-06)")
    _ejercicio_modificable(db, data.anio)
    items = _validar_items(db, data)
    m.anio, m.tipo = data.anio, data.tipo
    m.acto_administrativo = data.acto_administrativo.strip()
    m.expediente, m.observaciones = data.expediente, data.observaciones
    db.query(ModificacionItem).filter(ModificacionItem.id_modificacion == id).delete()
    for it in items:
        db.add(ModificacionItem(id_modificacion=id, id_partida=it.id_partida,
                                importe=it.importe, detalle=it.detalle.strip()))
    db.commit()
    return _serializar(m, db, con_items=True)


@router.delete("/{id}")
def eliminar(id: int, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "presupuesto_write")
    m = db.query(Modificacion).filter(Modificacion.id == id, Modificacion.activo == True).first()
    if not m:
        raise HTTPException(status_code=404, detail=f"Modificación {id} no encontrada")
    if m.estado != "borrador":
        raise HTTPException(status_code=409, detail="Solo se descarta un borrador (RN-06)")
    m.activo = False
    db.commit()
    return {"message": f"Borrador {id} descartado"}


@router.post("/{id}/aprobar")
def aprobar(id: int, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "presupuesto_modificacion_aprobar")
    m = db.query(Modificacion).filter(Modificacion.id == id, Modificacion.activo == True).first()
    if not m:
        raise HTTPException(status_code=404, detail=f"Modificación {id} no encontrada")
    if m.estado != "borrador":
        raise HTTPException(status_code=409, detail=f"Está '{m.estado}': solo se aprueba un borrador")
    ejercicio = _ejercicio_modificable(db, m.anio)
    items = db.query(ModificacionItem).filter(ModificacionItem.id_modificacion == id).all()

    # revalidar RN-04 (pudo cambiar el contexto desde el borrador)
    data = ModificacionIn(anio=m.anio, tipo=m.tipo, acto_administrativo=m.acto_administrativo,
                          items=[ItemIn(id_partida=i.id_partida, importe=i.importe, detalle=i.detalle) for i in items])
    _validar_items(db, data)

    # RN-05: control de sobregiro sobre el neto por partida (con lock de las partidas)
    neto = {}
    for i in items:
        neto[i.id_partida] = neto.get(i.id_partida, CERO) + i.importe
    ids_reducidas = [pid for pid, n in neto.items() if n < 0]
    advertencias = []
    if ids_reducidas:
        (db.query(Partida).filter(Partida.id.in_(ids_reducidas))
           .with_for_update().all())  # serializa contra otras aprobaciones/afectaciones
        saldos = saldos_de_partidas(db, ids_reducidas)
        for pid in ids_reducidas:
            disponible = saldos.get(pid, {}).get("disponible", CERO)
            if disponible + neto[pid] < 0:
                msg = f"Partida {pid}: disponible {disponible} insuficiente para reducir {abs(neto[pid])} (RN-05)"
                if ejercicio.control_sobregiro == "bloquear":
                    raise HTTPException(status_code=409, detail=msg)
                advertencias.append(msg)

    # RN-08: numeración definitiva al aprobar, secuencial por ejercicio
    ultimo = db.query(func.max(Modificacion.numero)).filter(Modificacion.anio == m.anio).scalar() or 0
    m.numero = ultimo + 1
    referencia = f"MOD-{m.anio}-{m.numero:04d}"

    # RN-06: un movimiento por ítem
    for i in items:
        db.add(Movimiento(
            id_partida=i.id_partida, tipo="modificacion", importe=i.importe,
            origen="presupuesto", referencia_tipo="modificacion", referencia=referencia,
            id_usuario=current_user.get("id"), usuario_nombre=_quien(current_user),
            observaciones=f"{m.tipo.capitalize()} {m.acto_administrativo} — {i.detalle}"))
    m.estado = "aprobada"
    m.aprobado_por = _quien(current_user)
    m.fecha_aprobacion = datetime.now(timezone.utc)
    db.commit()
    out = _serializar(m, db, con_items=True)
    out["advertencias"] = advertencias
    return out


@router.post("/{id}/anular")
def anular(id: int, data: dict = Body(default={}), db: Session = Depends(get_db),
           current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "presupuesto_modificacion_aprobar")
    m = db.query(Modificacion).filter(Modificacion.id == id, Modificacion.activo == True).first()
    if not m:
        raise HTTPException(status_code=404, detail=f"Modificación {id} no encontrada")
    if m.estado != "aprobada":
        raise HTTPException(status_code=409, detail=f"Está '{m.estado}': solo se anula una aprobada (RN-06)")
    _ejercicio_modificable(db, m.anio)
    items = db.query(ModificacionItem).filter(ModificacionItem.id_modificacion == id).all()
    referencia = f"MOD-{m.anio}-{(m.numero or 0):04d}-ANUL"
    for i in items:
        db.add(Movimiento(
            id_partida=i.id_partida, tipo="modificacion", importe=-i.importe,  # contra-movimiento
            origen="presupuesto", referencia_tipo="anulacion_modificacion", referencia=referencia,
            id_usuario=current_user.get("id"), usuario_nombre=_quien(current_user),
            observaciones=f"Anulación de MOD-{m.anio}-{(m.numero or 0):04d} — {data.get('motivo') or ''}".strip(" —")))
    m.estado = "anulada"
    m.anulado_por = _quien(current_user)
    m.fecha_anulacion = datetime.now(timezone.utc)
    m.motivo_anulacion = data.get("motivo")
    db.commit()
    return _serializar(m, db, con_items=True)
