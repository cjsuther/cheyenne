import sys
import os
from datetime import datetime, timezone, timedelta
from typing import List, Optional

import httpx
from fastapi import APIRouter, Depends, Query, HTTPException, status
from sqlalchemy import func
from sqlalchemy.orm import Session
from starlette.requests import Request

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", ".."))
from shared.base_module import create_auth_dependency
from shared.filters import filtered_query

from database import get_db
from config import get_settings
from models.evento import EventoAuditoria
from models.alerta import ReglaAlerta, AlertaDisparada, TIPOS_CONDICION
from schemas.alerta import (
    ReglaAlertaCreate, ReglaAlertaUpdate, ReglaAlertaResponse,
    AlertaDisparadaResponse,
)

settings = get_settings()
get_current_user = create_auth_dependency(settings.seguridad_url)

router = APIRouter(prefix="/alertas", tags=["Alertas proactivas"])


def _requiere(cu, permiso):
    if cu.get("superuser"):
        return
    if permiso not in [p["codigo"] for p in cu.get("permisos", [])]:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=f"No tiene el permiso '{permiso}'")


# ── CRUD de reglas ───────────────────────────────────────────────────
_ORDENABLES = {"id", "codigo", "condicion", "umbral", "ventana_minutos", "canal", "activo", "created_at"}


@router.get("/reglas", response_model=List[ReglaAlertaResponse])
def list_reglas(
    request: Request,
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=200),
    condicion: Optional[str] = Query(None),
    activo: Optional[bool] = Query(None),
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    _requiere(current_user, "auditoria_read")
    query = db.query(ReglaAlerta)
    if condicion:
        query = query.filter(ReglaAlerta.condicion == condicion)
    if activo is not None:
        query = query.filter(ReglaAlerta.activo == activo)
    query = filtered_query(
        query, ReglaAlerta,
        {k: v for k, v in request.query_params.items() if k in ("sort_by", "sort_dir")},
        exclude=set(), default_sort="id", default_dir="asc",
    )
    return query.offset(skip).limit(limit).all()


@router.get("/reglas/{id}", response_model=ReglaAlertaResponse)
def get_regla(
    id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    _requiere(current_user, "auditoria_read")
    r = db.query(ReglaAlerta).filter(ReglaAlerta.id == id).first()
    if not r:
        raise HTTPException(status_code=404, detail=f"Regla {id} no encontrada")
    return r


def _validar_condicion(cond: Optional[str]):
    if cond is not None and cond not in TIPOS_CONDICION:
        raise HTTPException(status_code=400,
                            detail=f"condicion inválida; use una de {list(TIPOS_CONDICION)}")


@router.post("/reglas", response_model=ReglaAlertaResponse, status_code=201)
def create_regla(
    data: ReglaAlertaCreate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    _requiere(current_user, "auditoria_admin")
    _validar_condicion(data.condicion)
    if db.query(ReglaAlerta).filter(ReglaAlerta.codigo == data.codigo).first():
        raise HTTPException(status_code=409, detail=f"Ya existe una regla con código '{data.codigo}'")
    r = ReglaAlerta(**data.model_dump())
    db.add(r)
    db.commit()
    db.refresh(r)
    return r


@router.put("/reglas/{id}", response_model=ReglaAlertaResponse)
def update_regla(
    id: int,
    data: ReglaAlertaUpdate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    _requiere(current_user, "auditoria_admin")
    r = db.query(ReglaAlerta).filter(ReglaAlerta.id == id).first()
    if not r:
        raise HTTPException(status_code=404, detail=f"Regla {id} no encontrada")
    cambios = data.model_dump(exclude_unset=True)
    _validar_condicion(cambios.get("condicion"))
    if "codigo" in cambios and cambios["codigo"] != r.codigo:
        if db.query(ReglaAlerta).filter(ReglaAlerta.codigo == cambios["codigo"]).first():
            raise HTTPException(status_code=409, detail=f"Ya existe una regla con código '{cambios['codigo']}'")
    for k, v in cambios.items():
        setattr(r, k, v)
    db.commit()
    db.refresh(r)
    return r


@router.delete("/reglas/{id}")
def delete_regla(
    id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    """Soft-delete de la regla (activo=False)."""
    _requiere(current_user, "auditoria_admin")
    r = db.query(ReglaAlerta).filter(ReglaAlerta.id == id).first()
    if not r:
        raise HTTPException(status_code=404, detail=f"Regla {id} no encontrada")
    r.activo = False
    db.commit()
    return {"ok": True, "id": id}


# ── Alertas disparadas (histórico) ───────────────────────────────────
@router.get("", response_model=List[AlertaDisparadaResponse])
def list_alertas(
    request: Request,
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=200),
    id_regla: Optional[int] = Query(None),
    condicion: Optional[str] = Query(None),
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    """Histórico de alertas disparadas, más reciente primero."""
    _requiere(current_user, "auditoria_read")
    query = db.query(AlertaDisparada).filter(AlertaDisparada.activo == True)
    if id_regla is not None:
        query = query.filter(AlertaDisparada.id_regla == id_regla)
    if condicion:
        query = query.filter(AlertaDisparada.condicion == condicion)
    query = filtered_query(
        query, AlertaDisparada,
        {k: v for k, v in request.query_params.items() if k in ("sort_by", "sort_dir")},
        exclude=set(), default_sort="id", default_dir="desc",
    )
    return query.offset(skip).limit(limit).all()


# ── Motor de evaluación ──────────────────────────────────────────────
# Cada tipo de condición se traduce en: (1) un filtro sobre EventoAuditoria y
# (2) las claves de agrupación. Si algún grupo supera el umbral en la ventana,
# se dispara la alerta.

def _grupos_condicion(db: Session, regla: ReglaAlerta, desde: datetime):
    """Devuelve lista de (clave_grupo:str, cantidad:int) que superan el umbral."""
    q = db.query(EventoAuditoria).filter(
        EventoAuditoria.activo == True,
        EventoAuditoria.fecha >= desde,
    )
    cond = regla.condicion

    if cond == "login_fallido":
        # requests de autenticación con status 401/403; agrupa por usuario+ip
        q = q.filter(
            EventoAuditoria.path.ilike("%/auth/token%"),
            EventoAuditoria.status_code.in_([401, 403]),
        )
        etiqueta = func.concat(
            func.coalesce(EventoAuditoria.usuario, "?"), "@",
            func.coalesce(EventoAuditoria.ip, "?"),
        )
    elif cond == "permiso_denegado":
        # 403 en cualquier endpoint; agrupa por usuario
        q = q.filter(EventoAuditoria.status_code == 403)
        etiqueta = func.coalesce(EventoAuditoria.usuario, EventoAuditoria.ip, "?")
    elif cond == "error_5xx":
        # errores de servidor; agrupa por módulo
        q = q.filter(EventoAuditoria.status_code >= 500)
        etiqueta = func.coalesce(EventoAuditoria.modulo, "?")
    elif cond == "borrado_masivo":
        # DELETE exitosos; agrupa por usuario
        q = q.filter(
            EventoAuditoria.metodo == "DELETE",
            EventoAuditoria.status_code < 400,
        )
        etiqueta = func.coalesce(EventoAuditoria.usuario, EventoAuditoria.ip, "?")
    else:
        return []

    filas = (q.with_entities(etiqueta.label("clave"), func.count().label("cant"))
             .group_by("clave")
             .having(func.count() > regla.umbral)
             .all())
    return [(r.clave, int(r.cant)) for r in filas]


async def _notificar(authorization: Optional[str], regla: ReglaAlerta, detalle: str) -> bool:
    """POST best-effort a comunicación para notificar la alerta. Nunca lanza."""
    payload = {
        "to": settings.alertas_destinatario,
        "asunto": f"[Auditoría] Alerta: {regla.codigo}",
        "cuerpo": (f"Se disparó la regla '{regla.codigo}' ({regla.condicion}).\n"
                   f"Umbral {regla.umbral} en {regla.ventana_minutos} min.\n\n{detalle}"),
    }
    headers = {}
    if authorization:
        headers["authorization"] = authorization
    url = settings.comunicacion_url.rstrip("/") + "/mensajes/enviar-directo"
    try:
        async with httpx.AsyncClient(timeout=5.0) as client:
            resp = await client.post(url, json=payload, headers=headers)
            return resp.status_code < 400
    except Exception:
        return False


@router.post("/evaluar")
async def evaluar(
    request: Request,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    """Recorre las reglas activas y dispara alertas para las que superen su umbral
    en la ventana temporal. Notifica best-effort a comunicación. Idempotente por
    ventana: no re-dispara la misma regla si ya hay una alerta dentro de su ventana."""
    _requiere(current_user, "auditoria_admin")
    ahora = datetime.now(timezone.utc)
    authorization = request.headers.get("authorization")

    reglas = db.query(ReglaAlerta).filter(ReglaAlerta.activo == True).all()
    disparadas = []
    for regla in reglas:
        desde = ahora - timedelta(minutes=regla.ventana_minutos)

        # idempotencia: si ya se disparó dentro de la ventana, saltear
        ya = (db.query(AlertaDisparada)
              .filter(AlertaDisparada.id_regla == regla.id,
                      AlertaDisparada.fecha >= desde)
              .first())
        if ya:
            continue

        grupos = _grupos_condicion(db, regla, desde)
        if not grupos:
            continue

        grupos.sort(key=lambda g: g[1], reverse=True)
        total = sum(c for _, c in grupos)
        detalle = "; ".join(f"{clave}: {cant}" for clave, cant in grupos[:20])

        notificado = await _notificar(authorization, regla, detalle)

        alerta = AlertaDisparada(
            id_regla=regla.id,
            codigo_regla=regla.codigo,
            condicion=regla.condicion,
            fecha=ahora,
            detalle=detalle,
            cantidad=total,
            notificado=notificado,
        )
        db.add(alerta)
        db.commit()
        db.refresh(alerta)
        disparadas.append({
            "id": alerta.id, "id_regla": regla.id, "codigo": regla.codigo,
            "condicion": regla.condicion, "cantidad": total,
            "notificado": notificado, "grupos": grupos[:20],
        })

    return {
        "evaluadas": len(reglas),
        "disparadas": len(disparadas),
        "alertas": disparadas,
        "evaluado_en": ahora.isoformat(),
    }
