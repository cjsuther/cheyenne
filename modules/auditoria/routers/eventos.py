import sys
import os
import io
import csv
import hashlib
from datetime import datetime, date, timezone, timedelta
from typing import List, Optional

from fastapi import APIRouter, Depends, Query, Header, HTTPException, status
from fastapi.responses import PlainTextResponse
from sqlalchemy.orm import Session
from starlette.requests import Request

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", ".."))
from shared.base_module import create_auth_dependency
from shared.filters import filtered_query

from database import get_db
from config import get_settings
from models.evento import EventoAuditoria
from schemas.evento import EventoCreate, EventoResponse

settings = get_settings()
get_current_user = create_auth_dependency(settings.seguridad_url)

# clave compartida para la ingesta interna (los módulos la envían en X-Audit-Token)
AUDIT_KEY = os.environ.get("AUDIT_INGEST_KEY", "cheyenne-audit")

router = APIRouter(prefix="/eventos", tags=["Eventos de auditoría"])


def _requiere(cu, permiso):
    if cu.get("superuser"):
        return
    if permiso not in [p["codigo"] for p in cu.get("permisos", [])]:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=f"No tiene el permiso '{permiso}'")


# ── Integridad: hash encadenado ──────────────────────────────────────
# Campos que componen la huella de un evento (orden fijo y estable).
_HASH_FIELDS = ["fecha", "modulo", "metodo", "path", "status_code",
                "id_usuario", "usuario", "ip", "duracion_ms"]


def _canonico(ev: EventoAuditoria) -> str:
    """Serialización canónica y determinística de un evento para hashear."""
    partes = []
    for f in _HASH_FIELDS:
        v = getattr(ev, f, None)
        if isinstance(v, datetime):
            v = v.isoformat()
        partes.append(f"{f}={'' if v is None else v}")
    return "|".join(partes)


def _calcular_hash(ev: EventoAuditoria, hash_anterior: Optional[str]) -> str:
    base = _canonico(ev) + "||prev=" + (hash_anterior or "")
    return hashlib.sha256(base.encode("utf-8")).hexdigest()


def _ultimo_hash(db: Session) -> Optional[str]:
    ult = db.query(EventoAuditoria).order_by(EventoAuditoria.id.desc()).first()
    return ult.hash if ult else None


# ── Ingesta interna ──────────────────────────────────────────────────
@router.post("", status_code=201)
def ingest_evento(
    data: EventoCreate,
    db: Session = Depends(get_db),
    x_audit_token: str = Header(None),
):
    """Ingesta interna del rastro de accesos (la llama el middleware de cada módulo).

    Protegida por clave compartida (no por JWT) para no perder los eventos anónimos
    (por ejemplo, intentos de login). Calcula el hash encadenado del evento."""
    if x_audit_token != AUDIT_KEY:
        raise HTTPException(status_code=403, detail="clave de auditoría inválida")
    evento = EventoAuditoria(**data.model_dump())
    if evento.fecha is None:
        evento.fecha = datetime.now(timezone.utc)
    prev = _ultimo_hash(db)
    evento.hash_anterior = prev
    evento.hash = _calcular_hash(evento, prev)
    db.add(evento)
    db.commit()
    return {"ok": True}


# ── Filtros avanzados compartidos por listado y export ───────────────
def _aplicar_filtros(query, usuario: Optional[str], modulo: Optional[str],
                     desde: Optional[str], hasta: Optional[str],
                     status_code: Optional[int], metodo: Optional[str],
                     path: Optional[str]):
    if usuario:
        query = query.filter(EventoAuditoria.usuario.ilike(f"%{usuario}%"))
    if modulo:
        query = query.filter(EventoAuditoria.modulo == modulo)
    if metodo:
        query = query.filter(EventoAuditoria.metodo == metodo.upper())
    if status_code is not None:
        query = query.filter(EventoAuditoria.status_code == status_code)
    if path:
        query = query.filter(EventoAuditoria.path.ilike(f"%{path}%"))
    if desde:
        try:
            d = datetime.fromisoformat(desde)
        except ValueError:
            d = datetime.combine(date.fromisoformat(desde), datetime.min.time())
        query = query.filter(EventoAuditoria.fecha >= d)
    if hasta:
        try:
            h = datetime.fromisoformat(hasta)
        except ValueError:
            # fecha sola => incluir todo el día
            h = datetime.combine(date.fromisoformat(hasta), datetime.max.time())
        query = query.filter(EventoAuditoria.fecha <= h)
    return query


@router.get("", response_model=List[EventoResponse])
def list_eventos(
    request: Request,
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=200),
    usuario: Optional[str] = Query(None),
    modulo: Optional[str] = Query(None),
    desde: Optional[str] = Query(None, description="Fecha/hora ISO desde (inclusive)"),
    hasta: Optional[str] = Query(None, description="Fecha/hora ISO hasta (inclusive)"),
    status_code: Optional[int] = Query(None),
    metodo: Optional[str] = Query(None),
    path: Optional[str] = Query(None),
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    """Rastro de accesos con búsqueda avanzada, más reciente primero."""
    _requiere(current_user, "auditoria_read")
    query = db.query(EventoAuditoria).filter(EventoAuditoria.activo == True)
    query = _aplicar_filtros(query, usuario, modulo, desde, hasta, status_code, metodo, path)
    # ordenamiento configurable (sort_by/sort_dir); default id desc
    query = filtered_query(
        query, EventoAuditoria,
        {k: v for k, v in request.query_params.items() if k in ("sort_by", "sort_dir")},
        exclude=set(), default_sort="id", default_dir="desc",
    )
    return query.offset(skip).limit(limit).all()


# ── Exportación CSV ──────────────────────────────────────────────────
_CSV_COLS = ["id", "fecha", "modulo", "metodo", "path", "status_code",
             "id_usuario", "usuario", "ip", "duracion_ms", "hash"]


@router.get("/export.csv")
def export_csv(
    usuario: Optional[str] = Query(None),
    modulo: Optional[str] = Query(None),
    desde: Optional[str] = Query(None),
    hasta: Optional[str] = Query(None),
    status_code: Optional[int] = Query(None),
    metodo: Optional[str] = Query(None),
    path: Optional[str] = Query(None),
    limit: int = Query(5000, ge=1, le=50000),
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    """Exporta el rastro filtrado a CSV (text/csv). Mismos filtros que el listado."""
    _requiere(current_user, "auditoria_read")
    query = db.query(EventoAuditoria).filter(EventoAuditoria.activo == True)
    query = _aplicar_filtros(query, usuario, modulo, desde, hasta, status_code, metodo, path)
    query = query.order_by(EventoAuditoria.id.desc()).limit(limit)

    buf = io.StringIO()
    w = csv.writer(buf)
    w.writerow(_CSV_COLS)
    for ev in query.all():
        row = []
        for c in _CSV_COLS:
            v = getattr(ev, c, None)
            if isinstance(v, datetime):
                v = v.isoformat()
            row.append("" if v is None else v)
        w.writerow(row)

    fname = f"auditoria_eventos_{datetime.now(timezone.utc).strftime('%Y%m%d_%H%M%S')}.csv"
    return PlainTextResponse(
        content=buf.getvalue(),
        media_type="text/csv",
        headers={"Content-Disposition": f'attachment; filename="{fname}"'},
    )


# ── Verificación de integridad de la cadena ──────────────────────────
@router.get("/verificar-integridad")
def verificar_integridad(
    limit: int = Query(10000, ge=1, le=100000, description="Máximo de eventos a recorrer"),
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    """Recorre la cadena de hash y reporta si algún eslabón fue alterado."""
    _requiere(current_user, "auditoria_read")
    eventos = (db.query(EventoAuditoria)
               .order_by(EventoAuditoria.id.asc())
               .limit(limit).all())
    total = len(eventos)
    prev_hash = None
    alterados = []
    rotos_cadena = []
    sin_hash = 0
    primero = True
    for ev in eventos:
        if ev.hash is None:
            sin_hash += 1
            prev_hash = None
            primero = False
            continue
        # recalcular la huella y comparar con el hash almacenado
        esperado = _calcular_hash(ev, ev.hash_anterior)
        if esperado != ev.hash:
            alterados.append({"id": ev.id, "fecha": ev.fecha.isoformat() if ev.fecha else None,
                              "modulo": ev.modulo, "path": ev.path})
        # verificar que enlaza con el anterior de la cadena
        if not primero and prev_hash is not None and ev.hash_anterior != prev_hash:
            rotos_cadena.append({"id": ev.id, "hash_anterior": ev.hash_anterior,
                                 "esperado_anterior": prev_hash})
        prev_hash = ev.hash
        primero = False

    integro = not alterados and not rotos_cadena
    return {
        "integro": integro,
        "total_eventos": total,
        "eventos_alterados": alterados,
        "eslabones_rotos": rotos_cadena,
        "sin_hash": sin_hash,
        "verificado_en": datetime.now(timezone.utc).isoformat(),
    }


# ── Retención / purga ────────────────────────────────────────────────
@router.post("/purgar")
def purgar_eventos(
    antes_de: Optional[str] = Query(None, description="Purga eventos con fecha < esta (YYYY-MM-DD)"),
    dias_retencion: Optional[int] = Query(None, ge=1, description="Alternativa: purga eventos con más de N días"),
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    """Archiva/purga eventos anteriores a una fecha, dejando un evento-resumen.

    Requiere permiso auditoria_admin. Se puede indicar `antes_de` (fecha corte)
    o `dias_retencion` (se calcula el corte). El resumen preserva conteo, rango
    de ids y el hash del último evento purgado para no romper la cadena."""
    _requiere(current_user, "auditoria_admin")

    if antes_de:
        try:
            corte = datetime.combine(date.fromisoformat(antes_de), datetime.min.time())
        except ValueError:
            corte = datetime.fromisoformat(antes_de)
        corte = corte.replace(tzinfo=timezone.utc) if corte.tzinfo is None else corte
    elif dias_retencion is not None:
        corte = datetime.now(timezone.utc) - timedelta(days=dias_retencion)
    else:
        raise HTTPException(status_code=400, detail="Indique 'antes_de' o 'dias_retencion'")

    q = db.query(EventoAuditoria).filter(EventoAuditoria.fecha < corte)
    total = q.count()
    if total == 0:
        return {"purgados": 0, "corte": corte.isoformat(), "resumen_id": None}

    ids = [r[0] for r in q.with_entities(EventoAuditoria.id).order_by(EventoAuditoria.id.asc()).all()]
    id_min, id_max = ids[0], ids[-1]
    # hash del último evento purgado (para encadenar el resumen)
    ultimo_purgado = db.query(EventoAuditoria).filter(EventoAuditoria.id == id_max).first()
    prev_hash = ultimo_purgado.hash if ultimo_purgado else None

    # borrado físico de los eventos purgados (la retención los descarta)
    q.delete(synchronize_session=False)

    usuario = current_user.get("username") or current_user.get("usuario") or "sistema"
    resumen = EventoAuditoria(
        fecha=datetime.now(timezone.utc),
        modulo="auditoria",
        metodo="PURGE",
        path=f"/eventos/purgar?antes_de={corte.date().isoformat()}",
        status_code=200,
        id_usuario=current_user.get("id"),
        usuario=usuario,
        ip=None,
        duracion_ms=None,
    )
    # el resumen enlaza con la cadena que lo precedía y con el último hash real
    resumen.hash_anterior = prev_hash
    resumen.path = (resumen.path or "") + f" | purgados={total} ids=[{id_min}-{id_max}]"
    resumen.hash = _calcular_hash(resumen, prev_hash)
    db.add(resumen)
    db.commit()
    db.refresh(resumen)

    return {
        "purgados": total,
        "corte": corte.isoformat(),
        "rango_ids": [id_min, id_max],
        "resumen_id": resumen.id,
    }
