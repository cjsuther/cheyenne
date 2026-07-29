import sys
import os
from datetime import datetime, timezone
from typing import Optional

from fastapi import APIRouter, Depends, Query, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", ".."))
from shared.base_module import create_auth_dependency

from database import get_db
from config import get_settings
from models.apremios import Juicio, ActoProcesal

settings = get_settings()
get_current_user = create_auth_dependency(settings.seguridad_url)


def _requiere(cu, permiso):
    if cu.get("superuser"):
        return
    if permiso not in [p["codigo"] for p in cu.get("permisos", [])]:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=f"No tiene el permiso '{permiso}'")


def _juicio_o_404(db, id_juicio):
    j = db.query(Juicio).filter(Juicio.id == id_juicio, Juicio.activo == True).first()  # noqa: E712
    if not j:
        raise HTTPException(status_code=404, detail="Juicio inexistente")
    return j


actos_router = APIRouter(prefix="/juicios/{id_juicio}/actos", tags=["Actos Procesales"])

_A = ["id", "id_juicio", "tipo", "fecha", "detalle", "created_at", "activo"]


class ActoIn(BaseModel):
    tipo: str
    fecha: Optional[datetime] = None
    detalle: Optional[str] = None


@actos_router.get("")
def listar_actos(id_juicio: int, skip: int = Query(0, ge=0), limit: int = Query(100, ge=1, le=200),
                 db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "apremios_read")
    _juicio_o_404(db, id_juicio)
    q = (db.query(ActoProcesal)
         .filter(ActoProcesal.id_juicio == id_juicio, ActoProcesal.activo == True)  # noqa: E712
         .order_by(ActoProcesal.fecha.asc().nullslast(), ActoProcesal.id.asc()))
    return [{c: getattr(x, c) for c in _A} for x in q.offset(skip).limit(limit).all()]


@actos_router.post("", status_code=201)
def crear_acto(id_juicio: int, data: ActoIn, db: Session = Depends(get_db),
               current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "apremios_gestionar")
    _juicio_o_404(db, id_juicio)
    x = ActoProcesal(id_juicio=id_juicio, tipo=data.tipo,
                     fecha=data.fecha or datetime.now(timezone.utc), detalle=data.detalle)
    db.add(x); db.commit(); db.refresh(x)
    return {c: getattr(x, c) for c in _A}


@actos_router.delete("/{id}")
def baja_acto(id_juicio: int, id: int, db: Session = Depends(get_db),
              current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "apremios_admin")
    x = db.query(ActoProcesal).filter(ActoProcesal.id == id, ActoProcesal.id_juicio == id_juicio).first()
    if not x:
        raise HTTPException(status_code=404, detail="Acto inexistente")
    x.activo = False; db.commit()
    return {"message": "dado de baja"}
