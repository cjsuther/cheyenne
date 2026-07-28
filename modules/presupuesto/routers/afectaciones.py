import sys
import os
from datetime import datetime, timezone
from decimal import Decimal
from typing import Optional

from fastapi import APIRouter, Depends, Query, HTTPException, status, Body
from sqlalchemy.orm import Session
from starlette.requests import Request
from pydantic import BaseModel

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", ".."))
from shared.base_module import create_auth_dependency
from shared.filters import filtered_query

from database import get_db
from config import get_settings
from models.afectacion import Afectacion, TIPOS_AFECTACION, ETAPA_PREVIA
from models.partida import Partida, Movimiento
from models.ejercicio import Ejercicio
from services.saldos import saldos_de_partidas

settings = get_settings()
get_current_user = create_auth_dependency(settings.seguridad_url)

router = APIRouter(prefix="/afectaciones", tags=["Afectaciones (ciclo del gasto)"])

CERO = Decimal("0.00")


class AfectacionIn(BaseModel):
    tipo: str
    importe: Decimal
    id_partida: Optional[int] = None
    dimensiones: Optional[dict] = None  # {anio, jurisdiccion, estructura, objeto_gasto, fuente} por CÓDIGO
    id_origen: Optional[int] = None
    origen_modulo: str = "presupuesto"
    referencia_tipo: str
    referencia: str
    observaciones: Optional[str] = None


def _requiere(current_user: dict, permiso: str):
    if current_user.get("superuser"):
        return
    permisos = [p["codigo"] for p in current_user.get("permisos", [])]
    if permiso not in permisos:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=f"No tiene el permiso '{permiso}'")


def _quien(cu: dict) -> str:
    return cu.get("nombre_apellido") or cu.get("codigo") or "?"


def _resolver_partida(db: Session, data: AfectacionIn) -> Partida:
    if data.id_partida:
        p = db.query(Partida).filter(Partida.id == data.id_partida, Partida.activo == True).first()
        if not p:
            raise HTTPException(status_code=404, detail=f"Partida {data.id_partida} inexistente")
        return p
    d = data.dimensiones or {}
    faltan = [k for k in ("anio", "jurisdiccion", "estructura", "objeto_gasto", "fuente") if not d.get(k)]
    if faltan:
        raise HTTPException(status_code=400, detail=f"id_partida o dimensiones completas (faltan: {', '.join(faltan)})")
    from models.nomencladores import Jurisdiccion, ObjetoGasto, Fuente, Estructura
    def buscar(modelo, codigo, nombre):
        x = db.query(modelo).filter(modelo.codigo == str(codigo), modelo.activo == True).first()
        if not x:
            raise HTTPException(status_code=400, detail=f"{nombre} '{codigo}' inexistente")
        return x.id
    p = db.query(Partida).filter(
        Partida.anio == int(d["anio"]),
        Partida.id_jurisdiccion == buscar(Jurisdiccion, d["jurisdiccion"], "jurisdicción"),
        Partida.id_estructura == buscar(Estructura, d["estructura"], "estructura"),
        Partida.id_objeto_gasto == buscar(ObjetoGasto, d["objeto_gasto"], "objeto del gasto"),
        Partida.id_fuente == buscar(Fuente, d["fuente"], "fuente"),
        Partida.activo == True).first()
    if not p:
        raise HTTPException(status_code=404, detail="No existe una partida con esas dimensiones")
    return p


def _serializar(a: Afectacion, idempotente: bool = False):
    out = {
        "id": a.id, "id_partida": a.id_partida, "tipo": a.tipo, "importe": float(a.importe),
        "estado": a.estado, "id_origen": a.id_origen, "origen_modulo": a.origen_modulo,
        "referencia_tipo": a.referencia_tipo, "referencia": a.referencia,
        "fecha": a.fecha, "usuario": a.usuario_nombre, "observaciones": a.observaciones,
        "liberada_por": a.liberada_por, "motivo_liberacion": a.motivo_liberacion,
    }
    if idempotente:
        out["idempotente"] = True
    return out


@router.get("")
def listar(
    request: Request,
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=200),
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    _requiere(current_user, "presupuesto_read")
    query = db.query(Afectacion).filter(Afectacion.activo == True)
    query = filtered_query(query, Afectacion, dict(request.query_params),
                           exclude={"skip", "limit"}, default_sort="id", default_dir="desc")
    return [_serializar(a) for a in query.offset(skip).limit(limit).all()]


@router.post("", status_code=201)
def registrar(data: AfectacionIn, db: Session = Depends(get_db),
              current_user: dict = Depends(get_current_user)):
    """Registra una etapa del gasto contra la partida (RN-09/RN-10). Idempotente (DD-07)."""
    _requiere(current_user, "presupuesto_afectar")
    if data.tipo not in TIPOS_AFECTACION:
        raise HTTPException(status_code=400, detail=f"Tipo inválido: {data.tipo}")
    if data.importe <= 0:
        raise HTTPException(status_code=400, detail="El importe debe ser mayor a cero")
    if not (data.referencia or "").strip() or not (data.referencia_tipo or "").strip():
        raise HTTPException(status_code=400, detail="referencia_tipo y referencia son obligatorios (RN-09)")

    # Idempotencia: misma (origen, referencia_tipo, referencia, tipo) devuelve la existente
    existente = db.query(Afectacion).filter(
        Afectacion.origen_modulo == data.origen_modulo,
        Afectacion.referencia_tipo == data.referencia_tipo,
        Afectacion.referencia == data.referencia,
        Afectacion.tipo == data.tipo,
        Afectacion.activo == True).first()
    if existente:
        return _serializar(existente, idempotente=True)

    partida = _resolver_partida(db, data)
    ejercicio = db.query(Ejercicio).filter(Ejercicio.anio == partida.anio, Ejercicio.activo == True).first()
    if not ejercicio or ejercicio.estado != "vigente":
        raise HTTPException(status_code=409, detail=f"El ejercicio {partida.anio} no está vigente (RN-09)")

    # Cadena (RN-10): validar la etapa previa si se referencia
    origen = None
    if data.id_origen:
        origen = db.query(Afectacion).filter(Afectacion.id == data.id_origen, Afectacion.activo == True).first()
        if not origen:
            raise HTTPException(status_code=404, detail=f"Afectación origen {data.id_origen} inexistente")
        esperado = ETAPA_PREVIA.get(data.tipo)
        if origen.tipo != esperado:
            raise HTTPException(status_code=409, detail=f"Un {data.tipo} solo puede referenciar un {esperado} (RN-10)")
        if origen.id_partida != partida.id:
            raise HTTPException(status_code=409, detail="La afectación origen pertenece a otra partida (RN-10)")
        if origen.estado != "vigente":
            raise HTTPException(status_code=409, detail=f"La afectación origen está '{origen.estado}' (RN-10)")

    # Control de disponible (solo etapas que reservan crédito: preventivo y compromiso)
    advertencia = None
    if data.tipo in ("preventivo", "compromiso"):
        db.query(Partida).filter(Partida.id == partida.id).with_for_update().first()  # serializa (NFR concurrencia)
        disponible = saldos_de_partidas(db, [partida.id])[partida.id]["disponible"]
        liberacion = origen.importe if (origen and data.tipo == "compromiso") else CERO
        if disponible + liberacion - data.importe < 0:
            msg = (f"Disponible insuficiente: {disponible}"
                   f"{f' (+{liberacion} del preventivo que convierte)' if liberacion else ''}"
                   f" para afectar {data.importe} (RN-09)")
            if ejercicio.control_sobregiro == "bloquear":
                raise HTTPException(status_code=409, detail=msg)
            advertencia = msg

    # fase 2: cuotas de compromiso (tope trimestral acumulado por ámbito)
    advertencias_cuota = []
    if data.tipo == "compromiso":
        from services.cuotas import validar_cuota_compromiso
        violaciones = validar_cuota_compromiso(db, partida, data.importe)
        if violaciones:
            if ejercicio.control_sobregiro == "bloquear":
                raise HTTPException(status_code=409, detail="; ".join(violaciones))
            advertencias_cuota = violaciones

    a = Afectacion(
        id_partida=partida.id, tipo=data.tipo, importe=data.importe, id_origen=data.id_origen,
        origen_modulo=data.origen_modulo, referencia_tipo=data.referencia_tipo,
        referencia=data.referencia, observaciones=data.observaciones,
        usuario_nombre=_quien(current_user))
    db.add(a); db.flush()

    # movimiento de la etapa
    db.add(Movimiento(
        id_partida=partida.id, tipo=data.tipo, importe=data.importe, origen=data.origen_modulo,
        referencia_tipo=data.referencia_tipo, referencia=data.referencia, id_afectacion=a.id,
        id_usuario=current_user.get("id"), usuario_nombre=_quien(current_user),
        observaciones=data.observaciones))

    # conversión preventivo→compromiso: libera la reserva del preventivo y lo cierra (RN-10)
    if origen and data.tipo == "compromiso":
        db.add(Movimiento(
            id_partida=partida.id, tipo="preventivo", importe=-origen.importe, origen=data.origen_modulo,
            referencia_tipo="conversion", referencia=data.referencia, id_afectacion=origen.id,
            id_usuario=current_user.get("id"), usuario_nombre=_quien(current_user),
            observaciones=f"Convertido a compromiso {data.referencia}"))
        origen.estado = "cerrada"
    elif origen:
        origen.estado = "cerrada"  # devengado/pagado encadenan sin liberar importe (el crédito sigue tomado)

    db.commit(); db.refresh(a)
    out = _serializar(a)
    if advertencia:
        out["advertencia"] = advertencia
    if advertencias_cuota:
        out["advertencias_cuota"] = advertencias_cuota
    return out


@router.post("/{id}/liberar")
def liberar(id: int, data: dict = Body(default={}), db: Session = Depends(get_db),
            current_user: dict = Depends(get_current_user)):
    """Libera una afectación vigente (desafectación con contra-movimiento — RN-11)."""
    _requiere(current_user, "presupuesto_afectar")
    a = db.query(Afectacion).filter(Afectacion.id == id, Afectacion.activo == True).first()
    if not a:
        raise HTTPException(status_code=404, detail=f"Afectación {id} inexistente")
    if a.estado != "vigente":
        raise HTTPException(status_code=409, detail=f"Está '{a.estado}': solo se libera una vigente (RN-11)")
    if a.tipo not in ("preventivo", "compromiso"):
        raise HTTPException(status_code=409, detail="Solo se liberan preventivos o compromisos (RN-11)")
    db.add(Movimiento(
        id_partida=a.id_partida, tipo=a.tipo, importe=-a.importe, origen=a.origen_modulo,
        referencia_tipo="liberacion", referencia=a.referencia, id_afectacion=a.id,
        id_usuario=current_user.get("id"), usuario_nombre=_quien(current_user),
        observaciones=data.get("motivo")))
    a.estado = "liberada"
    a.liberada_por = _quien(current_user)
    a.fecha_liberacion = datetime.now(timezone.utc)
    a.motivo_liberacion = data.get("motivo")
    db.commit()
    return _serializar(a)
