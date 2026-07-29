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
from models.apremios import Juicio, Mandamiento

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


mandamientos_router = APIRouter(prefix="/juicios/{id_juicio}/mandamientos", tags=["Mandamientos"])

_M = ["id", "id_juicio", "fecha", "oficial", "resultado", "created_at", "activo"]


class MandamientoIn(BaseModel):
    fecha: Optional[datetime] = None
    oficial: Optional[str] = None
    resultado: Optional[str] = None
    activo: bool = True


@mandamientos_router.get("")
def listar_mandamientos(id_juicio: int, skip: int = Query(0, ge=0), limit: int = Query(100, ge=1, le=200),
                        db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "apremios_read")
    _juicio_o_404(db, id_juicio)
    q = (db.query(Mandamiento)
         .filter(Mandamiento.id_juicio == id_juicio, Mandamiento.activo == True)  # noqa: E712
         .order_by(Mandamiento.id.desc()))
    return [{c: getattr(x, c) for c in _M} for x in q.offset(skip).limit(limit).all()]


@mandamientos_router.post("", status_code=201)
def crear_mandamiento(id_juicio: int, data: MandamientoIn, db: Session = Depends(get_db),
                      current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "apremios_gestionar")
    _juicio_o_404(db, id_juicio)
    x = Mandamiento(id_juicio=id_juicio, **data.model_dump())
    if not x.fecha:
        x.fecha = datetime.now(timezone.utc)
    db.add(x); db.commit(); db.refresh(x)
    return {c: getattr(x, c) for c in _M}


@mandamientos_router.put("/{id}")
def editar_mandamiento(id_juicio: int, id: int, data: MandamientoIn, db: Session = Depends(get_db),
                       current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "apremios_gestionar")
    x = db.query(Mandamiento).filter(Mandamiento.id == id, Mandamiento.id_juicio == id_juicio).first()
    if not x:
        raise HTTPException(status_code=404, detail="Mandamiento inexistente")
    for k, v in data.model_dump().items():
        setattr(x, k, v)
    db.commit(); db.refresh(x)
    return {c: getattr(x, c) for c in _M}


@mandamientos_router.delete("/{id}")
def baja_mandamiento(id_juicio: int, id: int, db: Session = Depends(get_db),
                     current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "apremios_admin")
    x = db.query(Mandamiento).filter(Mandamiento.id == id, Mandamiento.id_juicio == id_juicio).first()
    if not x:
        raise HTTPException(status_code=404, detail="Mandamiento inexistente")
    x.activo = False; db.commit()
    return {"message": "dado de baja"}
