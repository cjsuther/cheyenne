import sys
import os
import re
from typing import List, Optional, Dict

from fastapi import APIRouter, Depends, Query, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", ".."))
from shared.base_module import create_auth_dependency

from database import get_db
from config import get_settings
from models.mensaje import Mensaje
from models.lista import Lista
from models.intento_envio import IntentoEnvio
from models.plantilla import Plantilla
from services.envio_service import enviar_mensaje, EST_PENDIENTE, EST_ERROR

settings = get_settings()
get_current_user = create_auth_dependency(settings.seguridad_url)


def _requiere(cu, permiso):
    if cu.get("superuser"):
        return
    if permiso not in [p["codigo"] for p in cu.get("permisos", [])]:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=f"No tiene el permiso '{permiso}'")


# ── Helpers de listas locales ───────────────────────────────────────
def _lista_id(db: Session, tipo: str, codigo: str):
    row = db.query(Lista).filter(Lista.tipo == tipo, Lista.codigo == codigo).first()
    return row.id if row else None


def _default_ids(db: Session) -> dict:
    """IDs por defecto para tipo/canal/prioridad/estado al crear mensajes ad-hoc."""
    def first_of(tipo):
        r = db.query(Lista).filter(Lista.tipo == tipo).order_by(Lista.orden).first()
        return r.id if r else 1
    return {
        "tipo": _lista_id(db, "tipo_mensaje", "MSG_NOTIFICACION") or first_of("tipo_mensaje"),
        "canal": _lista_id(db, "canal", "CANAL_EMAIL") or first_of("canal"),
        "prioridad": _lista_id(db, "prioridad", "PRIO_NORMAL") or first_of("prioridad"),
        "pendiente": _lista_id(db, "estado_mensaje", EST_PENDIENTE) or first_of("estado_mensaje"),
    }


_VAR_RE = re.compile(r"\{\{\s*([\w.-]+)\s*\}\}")


def _render(texto: str, variables: Dict[str, object]) -> str:
    if not texto:
        return texto
    def repl(m):
        key = m.group(1)
        val = variables.get(key)
        return str(val) if val is not None else m.group(0)
    return _VAR_RE.sub(repl, texto)


# ── Router ──────────────────────────────────────────────────────────
router = APIRouter(prefix="/mensajes", tags=["Comunicacion - Envios"])


class EnvioDirecto(BaseModel):
    to: str
    asunto: str
    cuerpo: str


class DesdePlantilla(BaseModel):
    codigo: str
    destinatario: str
    variables: Dict[str, object] = {}


class DestinatarioMasivo(BaseModel):
    email: str
    variables: Dict[str, object] = {}


class EnvioMasivo(BaseModel):
    id_plantilla: int
    destinatarios: List[DestinatarioMasivo]


def _crear_mensaje(db: Session, destinatario: str, asunto: str, cuerpo: str,
                   usuario_id: Optional[int], id_canal: Optional[int] = None) -> Mensaje:
    d = _default_ids(db)
    m = Mensaje(
        id_tipo_mensaje=d["tipo"],
        id_estado_mensaje=d["pendiente"],
        id_canal=id_canal or d["canal"],
        id_prioridad=d["prioridad"],
        identificador=destinatario,
        titulo=asunto[:250],
        cuerpo=cuerpo[:1000],
        id_usuario_creacion=usuario_id,
    )
    db.add(m)
    db.commit()
    db.refresh(m)
    return m


@router.post("/{id}/enviar")
async def enviar_por_id(
    id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    _requiere(current_user, "comunicacion_enviar")
    m = db.query(Mensaje).filter(Mensaje.id == id).first()
    if not m:
        raise HTTPException(status_code=404, detail=f"Mensaje {id} no encontrado")
    return await enviar_mensaje(db, settings, m)


@router.post("/enviar-directo", status_code=201)
async def enviar_directo(
    data: EnvioDirecto,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    _requiere(current_user, "comunicacion_enviar")
    m = _crear_mensaje(db, data.to.strip(), data.asunto, data.cuerpo,
                       current_user.get("id") or current_user.get("user_id"))
    res = await enviar_mensaje(db, settings, m)
    return res


@router.get("/{id}/intentos")
def listar_intentos(
    id: int,
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=200),
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    _requiere(current_user, "comunicacion_read")
    q = (
        db.query(IntentoEnvio)
        .filter(IntentoEnvio.id_mensaje == id)
        .order_by(IntentoEnvio.fecha.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )
    return [
        {
            "id": x.id,
            "id_mensaje": x.id_mensaje,
            "fecha": x.fecha,
            "resultado": x.resultado,
            "detalle_error": x.detalle_error,
        }
        for x in q
    ]


@router.post("/reintentar-pendientes")
async def reintentar_pendientes(
    limite: int = Query(20, ge=1, le=200),
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    _requiere(current_user, "comunicacion_enviar")
    id_pend = _lista_id(db, "estado_mensaje", EST_PENDIENTE)
    id_err = _lista_id(db, "estado_mensaje", EST_ERROR)
    estados = [e for e in (id_pend, id_err) if e is not None]
    if not estados:
        return {"reintentados": 0, "enviados": 0, "errores": 0, "detalle": []}

    mensajes = (
        db.query(Mensaje)
        .filter(Mensaje.id_estado_mensaje.in_(estados))
        .order_by(Mensaje.id)
        .limit(limite)
        .all()
    )
    enviados = 0
    errores = 0
    detalle = []
    for m in mensajes:
        res = await enviar_mensaje(db, settings, m)
        if res["enviado"]:
            enviados += 1
        else:
            errores += 1
        detalle.append(res)
    return {"reintentados": len(mensajes), "enviados": enviados, "errores": errores, "detalle": detalle}


@router.post("/desde-plantilla", status_code=201)
async def enviar_desde_plantilla(
    data: DesdePlantilla,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    _requiere(current_user, "comunicacion_enviar")
    pl = db.query(Plantilla).filter(Plantilla.codigo == data.codigo.strip(), Plantilla.activo == True).first()  # noqa: E712
    if not pl:
        raise HTTPException(status_code=404, detail=f"Plantilla '{data.codigo}' no encontrada")
    asunto = _render(pl.asunto, data.variables)
    cuerpo = _render(pl.cuerpo, data.variables)
    id_canal = _lista_id(db, "canal", f"CANAL_{(pl.canal or 'email').upper()}")
    m = _crear_mensaje(db, data.destinatario.strip(), asunto, cuerpo,
                       current_user.get("id") or current_user.get("user_id"), id_canal=id_canal)
    return await enviar_mensaje(db, settings, m)


@router.post("/masivo", status_code=201)
async def envio_masivo(
    data: EnvioMasivo,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    _requiere(current_user, "comunicacion_enviar")
    pl = db.query(Plantilla).filter(Plantilla.id == data.id_plantilla).first()
    if not pl:
        raise HTTPException(status_code=404, detail=f"Plantilla {data.id_plantilla} no encontrada")
    id_canal = _lista_id(db, "canal", f"CANAL_{(pl.canal or 'email').upper()}")

    enviados = 0
    errores = 0
    resultados = []
    for dest in data.destinatarios:
        asunto = _render(pl.asunto, dest.variables)
        cuerpo = _render(pl.cuerpo, dest.variables)
        m = _crear_mensaje(db, dest.email.strip(), asunto, cuerpo,
                           current_user.get("id") or current_user.get("user_id"), id_canal=id_canal)
        res = await enviar_mensaje(db, settings, m)
        if res["enviado"]:
            enviados += 1
        else:
            errores += 1
        resultados.append({"email": dest.email, **res})

    return {
        "total": len(data.destinatarios),
        "enviados": enviados,
        "errores": errores,
        "resultados": resultados,
    }
