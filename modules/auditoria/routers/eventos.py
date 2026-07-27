import sys
import os
from typing import List

from fastapi import APIRouter, Depends, Query, Header, HTTPException
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


@router.post("", status_code=201)
def ingest_evento(
    data: EventoCreate,
    db: Session = Depends(get_db),
    x_audit_token: str = Header(None),
):
    """Ingesta interna del rastro de accesos (la llama el middleware de cada módulo).

    Protegida por clave compartida (no por JWT) para no perder los eventos anónimos
    (por ejemplo, intentos de login)."""
    if x_audit_token != AUDIT_KEY:
        raise HTTPException(status_code=403, detail="clave de auditoría inválida")
    evento = EventoAuditoria(**data.model_dump())
    db.add(evento)
    db.commit()
    return {"ok": True}


@router.get("", response_model=List[EventoResponse])
def list_eventos(
    request: Request,
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=200),
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    """Rastro de accesos, más reciente primero (para la pantalla de Auditoría)."""
    query = db.query(EventoAuditoria).filter(EventoAuditoria.activo == True)
    query = filtered_query(
        query, EventoAuditoria, dict(request.query_params),
        exclude={"skip", "limit"}, default_sort="id", default_dir="desc",
    )
    return query.offset(skip).limit(limit).all()
