import sys
import os
from datetime import datetime, date, timezone, timedelta
from typing import Optional

from fastapi import APIRouter, Depends, Query, HTTPException, status
from sqlalchemy import func, cast, Date, Integer
from sqlalchemy.orm import Session

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", ".."))
from shared.base_module import create_auth_dependency

from database import get_db
from config import get_settings
from models.evento import EventoAuditoria

settings = get_settings()
get_current_user = create_auth_dependency(settings.seguridad_url)

router = APIRouter(prefix="/estadisticas", tags=["Estadísticas de auditoría"])


def _requiere(cu, permiso):
    if cu.get("superuser"):
        return
    if permiso not in [p["codigo"] for p in cu.get("permisos", [])]:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=f"No tiene el permiso '{permiso}'")


def _clase_status(sc: Optional[int]) -> str:
    """Agrupa un status_code en una clase legible (2xx, 3xx, 4xx, 5xx, otros)."""
    if sc is None:
        return "sin_status"
    if 200 <= sc < 300:
        return "2xx"
    if 300 <= sc < 400:
        return "3xx"
    if 400 <= sc < 500:
        return "4xx"
    if 500 <= sc < 600:
        return "5xx"
    return "otros"


@router.get("/resumen")
def resumen(
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    """KPIs globales del rastro de accesos: total, conteos por módulo, por método,
    por clase de status y de errores (>=400)."""
    _requiere(current_user, "auditoria_read")
    base = db.query(EventoAuditoria).filter(EventoAuditoria.activo == True)

    total = base.count()
    total_errores = base.filter(EventoAuditoria.status_code >= 400).count()

    por_modulo = [
        {"modulo": m or "(sin módulo)", "total": t}
        for m, t in (
            db.query(EventoAuditoria.modulo, func.count(EventoAuditoria.id))
            .filter(EventoAuditoria.activo == True)
            .group_by(EventoAuditoria.modulo)
            .order_by(func.count(EventoAuditoria.id).desc())
            .all()
        )
    ]

    por_metodo = [
        {"metodo": me or "(sin método)", "total": t}
        for me, t in (
            db.query(EventoAuditoria.metodo, func.count(EventoAuditoria.id))
            .filter(EventoAuditoria.activo == True)
            .group_by(EventoAuditoria.metodo)
            .order_by(func.count(EventoAuditoria.id).desc())
            .all()
        )
    ]

    # conteo por status_code exacto -> se agrupa por clase (2xx, 4xx, ...) en Python
    clases: dict = {}
    for sc, t in (
        db.query(EventoAuditoria.status_code, func.count(EventoAuditoria.id))
        .filter(EventoAuditoria.activo == True)
        .group_by(EventoAuditoria.status_code)
        .all()
    ):
        c = _clase_status(sc)
        clases[c] = clases.get(c, 0) + t
    orden = ["2xx", "3xx", "4xx", "5xx", "otros", "sin_status"]
    por_status = [
        {"clase": c, "total": clases[c]}
        for c in orden if c in clases
    ]

    usuarios_activos = (
        db.query(func.count(func.distinct(EventoAuditoria.usuario)))
        .filter(EventoAuditoria.activo == True, EventoAuditoria.usuario.isnot(None))
        .scalar()
    ) or 0

    return {
        "total_eventos": total,
        "total_errores": total_errores,
        "usuarios_activos": usuarios_activos,
        "por_modulo": por_modulo,
        "por_metodo": por_metodo,
        "por_status": por_status,
        "generado_en": datetime.now(timezone.utc).isoformat(),
    }


@router.get("/por-dia")
def por_dia(
    dias: int = Query(30, ge=1, le=365, description="Ventana de días hacia atrás"),
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    """Serie temporal: eventos totales y errores por día en los últimos N días.
    Rellena los días sin actividad con ceros para una serie continua."""
    _requiere(current_user, "auditoria_read")
    desde = datetime.now(timezone.utc) - timedelta(days=dias - 1)
    desde = desde.replace(hour=0, minute=0, second=0, microsecond=0)

    dia = cast(EventoAuditoria.fecha, Date)
    filas = (
        db.query(
            dia.label("dia"),
            func.count(EventoAuditoria.id).label("total"),
            func.sum(
                func.cast(EventoAuditoria.status_code >= 400, Integer)
            ).label("errores"),
        )
        .filter(EventoAuditoria.activo == True, EventoAuditoria.fecha >= desde)
        .group_by(dia)
        .order_by(dia)
        .all()
    )
    por_fecha = {
        (f.dia.isoformat() if hasattr(f.dia, "isoformat") else str(f.dia)): {
            "total": int(f.total or 0),
            "errores": int(f.errores or 0),
        }
        for f in filas
    }

    serie = []
    hoy = date.today()
    for i in range(dias):
        d = (hoy - timedelta(days=dias - 1 - i)).isoformat()
        v = por_fecha.get(d, {"total": 0, "errores": 0})
        serie.append({"dia": d, "total": v["total"], "errores": v["errores"]})

    return {"dias": dias, "desde": desde.date().isoformat(), "serie": serie}


@router.get("/por-usuario")
def por_usuario(
    limit: int = Query(20, ge=1, le=200, description="Top N usuarios"),
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    """Top usuarios por cantidad de eventos, con su conteo de errores y último acceso."""
    _requiere(current_user, "auditoria_read")
    filas = (
        db.query(
            EventoAuditoria.usuario,
            func.count(EventoAuditoria.id).label("total"),
            func.sum(
                func.cast(EventoAuditoria.status_code >= 400, Integer)
            ).label("errores"),
            func.max(EventoAuditoria.fecha).label("ultimo"),
        )
        .filter(EventoAuditoria.activo == True, EventoAuditoria.usuario.isnot(None))
        .group_by(EventoAuditoria.usuario)
        .order_by(func.count(EventoAuditoria.id).desc())
        .limit(limit)
        .all()
    )
    return [
        {
            "usuario": f.usuario,
            "total": int(f.total or 0),
            "errores": int(f.errores or 0),
            "ultimo_acceso": f.ultimo.isoformat() if f.ultimo else None,
        }
        for f in filas
    ]


@router.get("/errores")
def errores(
    limit: int = Query(50, ge=1, le=200, description="Últimos N eventos con error"),
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    """Últimos eventos con status de error (4xx/5xx), más reciente primero."""
    _requiere(current_user, "auditoria_read")
    filas = (
        db.query(EventoAuditoria)
        .filter(EventoAuditoria.activo == True, EventoAuditoria.status_code >= 400)
        .order_by(EventoAuditoria.id.desc())
        .limit(limit)
        .all()
    )
    return [
        {
            "id": e.id,
            "fecha": e.fecha.isoformat() if e.fecha else None,
            "modulo": e.modulo,
            "metodo": e.metodo,
            "path": e.path,
            "status_code": e.status_code,
            "usuario": e.usuario,
            "id_usuario": e.id_usuario,
            "ip": e.ip,
            "duracion_ms": e.duracion_ms,
        }
        for e in filas
    ]
