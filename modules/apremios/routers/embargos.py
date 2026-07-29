import sys
import os
from decimal import Decimal
from datetime import datetime, timezone
from typing import Optional

from fastapi import APIRouter, Depends, Query, HTTPException, status
from sqlalchemy.orm import Session
from pydantic import BaseModel

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", ".."))
from shared.base_module import create_auth_dependency

from database import get_db
from config import get_settings
from models.apremios import Juicio, EmbargoJudicial, TIPOS_EMBARGO

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


embargos_router = APIRouter(prefix="/juicios/{id_juicio}/embargos", tags=["Embargos Judiciales"])

_E = ["id", "id_juicio", "tipo", "bien_descripcion", "importe", "estado", "fecha", "created_at", "activo"]


class EmbargoIn(BaseModel):
    tipo: str
    bien_descripcion: Optional[str] = None
    importe: Decimal = Decimal("0")
    estado: str = "trabado"
    fecha: Optional[datetime] = None
    activo: bool = True


@embargos_router.get("")
def listar_embargos(id_juicio: int, skip: int = Query(0, ge=0), limit: int = Query(100, ge=1, le=200),
                    db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "apremios_read")
    _juicio_o_404(db, id_juicio)
    q = (db.query(EmbargoJudicial)
         .filter(EmbargoJudicial.id_juicio == id_juicio, EmbargoJudicial.activo == True)  # noqa: E712
         .order_by(EmbargoJudicial.id.desc()))
    return [{c: getattr(x, c) for c in _E} for x in q.offset(skip).limit(limit).all()]


@embargos_router.post("", status_code=201)
def crear_embargo(id_juicio: int, data: EmbargoIn, db: Session = Depends(get_db),
                  current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "apremios_gestionar")
    _juicio_o_404(db, id_juicio)
    if data.tipo not in TIPOS_EMBARGO:
        raise HTTPException(status_code=400, detail=f"Tipo inválido: {data.tipo}. Válidos: {list(TIPOS_EMBARGO)}")
    x = EmbargoJudicial(id_juicio=id_juicio, **data.model_dump())
    if not x.fecha:
        x.fecha = datetime.now(timezone.utc)
    db.add(x); db.commit(); db.refresh(x)
    return {c: getattr(x, c) for c in _E}


@embargos_router.put("/{id}")
def editar_embargo(id_juicio: int, id: int, data: EmbargoIn, db: Session = Depends(get_db),
                   current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "apremios_gestionar")
    if data.tipo not in TIPOS_EMBARGO:
        raise HTTPException(status_code=400, detail=f"Tipo inválido: {data.tipo}. Válidos: {list(TIPOS_EMBARGO)}")
    x = db.query(EmbargoJudicial).filter(EmbargoJudicial.id == id, EmbargoJudicial.id_juicio == id_juicio).first()
    if not x:
        raise HTTPException(status_code=404, detail="Embargo inexistente")
    for k, v in data.model_dump().items():
        setattr(x, k, v)
    db.commit(); db.refresh(x)
    return {c: getattr(x, c) for c in _E}


@embargos_router.delete("/{id}")
def baja_embargo(id_juicio: int, id: int, db: Session = Depends(get_db),
                 current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "apremios_admin")
    x = db.query(EmbargoJudicial).filter(EmbargoJudicial.id == id, EmbargoJudicial.id_juicio == id_juicio).first()
    if not x:
        raise HTTPException(status_code=404, detail="Embargo inexistente")
    x.activo = False; db.commit()
    return {"message": "dado de baja"}
