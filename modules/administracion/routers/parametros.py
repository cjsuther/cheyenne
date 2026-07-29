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
from models.parametro import Parametro

settings = get_settings()
get_current_user = create_auth_dependency(settings.seguridad_url)

_TIPOS = {"texto", "numero", "booleano", "fecha"}


def _requiere(cu, permiso):
    if cu.get("superuser"):
        return
    if permiso not in [p["codigo"] for p in cu.get("permisos", [])]:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=f"No tiene el permiso '{permiso}'")


router = APIRouter(prefix="/parametros", tags=["Parametros"])
_F = ["id", "clave", "valor", "tipo", "grupo", "descripcion", "activo"]


def _dump(x):
    return {c: getattr(x, c) for c in _F}


class ParametroIn(BaseModel):
    clave: str
    valor: Optional[str] = None
    tipo: str = "texto"
    grupo: Optional[str] = None
    descripcion: Optional[str] = None
    activo: bool = True


class ParametroUpdate(BaseModel):
    valor: Optional[str] = None
    tipo: Optional[str] = None
    grupo: Optional[str] = None
    descripcion: Optional[str] = None
    activo: Optional[bool] = None


def _validar_tipo(tipo: Optional[str]):
    if tipo is not None and tipo not in _TIPOS:
        raise HTTPException(status_code=422, detail=f"tipo invalido; use uno de {sorted(_TIPOS)}")


@router.get("")
def listar(request: Request, skip: int = Query(0, ge=0), limit: int = Query(50, ge=1, le=200),
           db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "administracion_config_read")
    q = filtered_query(db.query(Parametro), Parametro, dict(request.query_params),
                       exclude={"skip", "limit"}, default_sort="clave")
    return [_dump(x) for x in q.offset(skip).limit(limit).all()]


@router.get("/{clave}")
def obtener(clave: str, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "administracion_config_read")
    x = db.query(Parametro).filter(Parametro.clave == clave).first()
    if not x:
        raise HTTPException(status_code=404, detail="Parametro inexistente")
    return _dump(x)


@router.post("", status_code=201)
def crear(data: ParametroIn, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "administracion_config_write")
    _validar_tipo(data.tipo)
    clave = data.clave.strip()
    if db.query(Parametro).filter(Parametro.clave == clave).first():
        raise HTTPException(status_code=409, detail=f"Ya existe el parametro '{clave}'")
    payload = data.model_dump()
    payload["clave"] = clave
    x = Parametro(**payload)
    db.add(x); db.commit(); db.refresh(x)
    return _dump(x)


@router.put("/{clave}")
def editar(clave: str, data: ParametroUpdate, db: Session = Depends(get_db),
           current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "administracion_config_write")
    _validar_tipo(data.tipo)
    x = db.query(Parametro).filter(Parametro.clave == clave).first()
    if not x:
        raise HTTPException(status_code=404, detail="Parametro inexistente")
    for k, v in data.model_dump(exclude_unset=True).items():
        setattr(x, k, v)
    db.commit(); db.refresh(x)
    return _dump(x)


@router.delete("/{clave}")
def eliminar(clave: str, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "administracion_config_delete")
    x = db.query(Parametro).filter(Parametro.clave == clave).first()
    if not x:
        raise HTTPException(status_code=404, detail="Parametro inexistente")
    x.activo = False; db.commit()
    return {"message": "dado de baja"}


@router.put("/id/{id}")
def editar_por_id(id: int, data: ParametroUpdate, db: Session = Depends(get_db),
                  current_user: dict = Depends(get_current_user)):
    """Alias por id numerico (para clientes CRUD genericos)."""
    _requiere(current_user, "administracion_config_write")
    _validar_tipo(data.tipo)
    x = db.query(Parametro).filter(Parametro.id == id).first()
    if not x:
        raise HTTPException(status_code=404, detail="Parametro inexistente")
    for k, v in data.model_dump(exclude_unset=True).items():
        setattr(x, k, v)
    db.commit(); db.refresh(x)
    return _dump(x)


@router.delete("/id/{id}")
def eliminar_por_id(id: int, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "administracion_config_delete")
    x = db.query(Parametro).filter(Parametro.id == id).first()
    if not x:
        raise HTTPException(status_code=404, detail="Parametro inexistente")
    x.activo = False; db.commit()
    return {"message": "dado de baja"}
