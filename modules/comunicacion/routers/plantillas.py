import sys
import os
from typing import Optional

from fastapi import APIRouter, Depends, Query, HTTPException, status
from sqlalchemy.orm import Session
from starlette.requests import Request
from pydantic import BaseModel

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", ".."))
from shared.base_module import create_auth_dependency
from shared.filters import filtered_query

from database import get_db
from config import get_settings
from models.plantilla import Plantilla

settings = get_settings()
get_current_user = create_auth_dependency(settings.seguridad_url)


def _requiere(cu, permiso):
    if cu.get("superuser"):
        return
    if permiso not in [p["codigo"] for p in cu.get("permisos", [])]:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=f"No tiene el permiso '{permiso}'")


router = APIRouter(prefix="/plantillas", tags=["Comunicacion - Plantillas"])
_COLS = ["id", "codigo", "nombre", "asunto", "cuerpo", "canal", "activo", "created_at"]


class PlantillaIn(BaseModel):
    codigo: str
    nombre: Optional[str] = ""
    asunto: str
    cuerpo: str
    canal: str = "email"
    activo: bool = True


def _out(x: Plantilla) -> dict:
    return {c: getattr(x, c) for c in _COLS}


@router.get("")
def listar(
    request: Request,
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=200),
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    _requiere(current_user, "comunicacion_read")
    q = filtered_query(db.query(Plantilla), Plantilla, dict(request.query_params),
                       exclude={"skip", "limit"}, default_sort="codigo")
    return [_out(x) for x in q.offset(skip).limit(limit).all()]


@router.get("/{id}")
def obtener(id: int, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "comunicacion_read")
    x = db.query(Plantilla).filter(Plantilla.id == id).first()
    if not x:
        raise HTTPException(status_code=404, detail="Plantilla inexistente")
    return _out(x)


@router.post("", status_code=201)
def crear(data: PlantillaIn, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "comunicacion_write")
    if db.query(Plantilla).filter(Plantilla.codigo == data.codigo.strip()).first():
        raise HTTPException(status_code=409, detail=f"Ya existe la plantilla {data.codigo}")
    x = Plantilla(**data.model_dump())
    x.codigo = x.codigo.strip()
    db.add(x)
    db.commit()
    db.refresh(x)
    return _out(x)


@router.put("/{id}")
def editar(id: int, data: PlantillaIn, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "comunicacion_write")
    x = db.query(Plantilla).filter(Plantilla.id == id).first()
    if not x:
        raise HTTPException(status_code=404, detail="Plantilla inexistente")
    otra = db.query(Plantilla).filter(Plantilla.codigo == data.codigo.strip(), Plantilla.id != id).first()
    if otra:
        raise HTTPException(status_code=409, detail=f"Ya existe la plantilla {data.codigo}")
    for k, v in data.model_dump().items():
        setattr(x, k, v)
    x.codigo = x.codigo.strip()
    db.commit()
    db.refresh(x)
    return _out(x)


@router.delete("/{id}")
def eliminar(id: int, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "comunicacion_write")
    x = db.query(Plantilla).filter(Plantilla.id == id).first()
    if not x:
        raise HTTPException(status_code=404, detail="Plantilla inexistente")
    x.activo = False
    db.commit()
    return {"message": "Plantilla dada de baja"}
