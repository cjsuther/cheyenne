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
from models.numerador import Numerador

settings = get_settings()
get_current_user = create_auth_dependency(settings.seguridad_url)


def _requiere(cu, permiso):
    if cu.get("superuser"):
        return
    if permiso not in [p["codigo"] for p in cu.get("permisos", [])]:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=f"No tiene el permiso '{permiso}'")


router = APIRouter(prefix="/numeradores", tags=["Numeradores"])
_F = ["id", "clave", "descripcion", "anio", "proximo", "prefijo", "padding", "activo"]


def _dump(x):
    return {c: getattr(x, c) for c in _F}


def _formatear(prefijo: Optional[str], padding: int, numero: int) -> str:
    cuerpo = str(numero).zfill(padding) if padding and padding > 0 else str(numero)
    return f"{prefijo or ''}{cuerpo}"


class NumeradorIn(BaseModel):
    clave: str
    descripcion: Optional[str] = None
    anio: Optional[int] = None
    proximo: int = 1
    prefijo: Optional[str] = None
    padding: int = 0
    activo: bool = True


class NumeradorUpdate(BaseModel):
    descripcion: Optional[str] = None
    anio: Optional[int] = None
    proximo: Optional[int] = None
    prefijo: Optional[str] = None
    padding: Optional[int] = None
    activo: Optional[bool] = None


@router.get("")
def listar(request: Request, skip: int = Query(0, ge=0), limit: int = Query(50, ge=1, le=200),
           db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "administracion_config_read")
    q = filtered_query(db.query(Numerador), Numerador, dict(request.query_params),
                       exclude={"skip", "limit"}, default_sort="clave")
    return [_dump(x) for x in q.offset(skip).limit(limit).all()]


@router.get("/{clave}")
def obtener(clave: str, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "administracion_config_read")
    x = db.query(Numerador).filter(Numerador.clave == clave).first()
    if not x:
        raise HTTPException(status_code=404, detail="Numerador inexistente")
    return _dump(x)


@router.post("", status_code=201)
def crear(data: NumeradorIn, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "administracion_config_write")
    clave = data.clave.strip()
    if db.query(Numerador).filter(Numerador.clave == clave).first():
        raise HTTPException(status_code=409, detail=f"Ya existe el numerador '{clave}'")
    payload = data.model_dump()
    payload["clave"] = clave
    x = Numerador(**payload)
    db.add(x); db.commit(); db.refresh(x)
    return _dump(x)


@router.put("/{clave}")
def editar(clave: str, data: NumeradorUpdate, db: Session = Depends(get_db),
           current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "administracion_config_write")
    x = db.query(Numerador).filter(Numerador.clave == clave).first()
    if not x:
        raise HTTPException(status_code=404, detail="Numerador inexistente")
    for k, v in data.model_dump(exclude_unset=True).items():
        setattr(x, k, v)
    db.commit(); db.refresh(x)
    return _dump(x)


@router.delete("/{clave}")
def eliminar(clave: str, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "administracion_config_delete")
    x = db.query(Numerador).filter(Numerador.clave == clave).first()
    if not x:
        raise HTTPException(status_code=404, detail="Numerador inexistente")
    x.activo = False; db.commit()
    return {"message": "dado de baja"}


@router.put("/id/{id}")
def editar_por_id(id: int, data: NumeradorUpdate, db: Session = Depends(get_db),
                  current_user: dict = Depends(get_current_user)):
    """Alias por id numerico (para clientes CRUD genericos)."""
    _requiere(current_user, "administracion_config_write")
    x = db.query(Numerador).filter(Numerador.id == id).first()
    if not x:
        raise HTTPException(status_code=404, detail="Numerador inexistente")
    for k, v in data.model_dump(exclude_unset=True).items():
        setattr(x, k, v)
    db.commit(); db.refresh(x)
    return _dump(x)


@router.delete("/id/{id}")
def eliminar_por_id(id: int, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "administracion_config_delete")
    x = db.query(Numerador).filter(Numerador.id == id).first()
    if not x:
        raise HTTPException(status_code=404, detail="Numerador inexistente")
    x.activo = False; db.commit()
    return {"message": "dado de baja"}


@router.post("/{clave}/siguiente")
def siguiente(clave: str, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    """Incrementa atomicamente el numerador y devuelve el numero formateado."""
    _requiere(current_user, "administracion_config_write")
    # Lock de fila para evitar duplicados bajo concurrencia (SELECT ... FOR UPDATE)
    x = db.query(Numerador).filter(Numerador.clave == clave).with_for_update().first()
    if not x:
        raise HTTPException(status_code=404, detail="Numerador inexistente")
    if not x.activo:
        raise HTTPException(status_code=409, detail="Numerador inactivo")
    numero = x.proximo or 1
    x.proximo = numero + 1
    db.commit()
    return {
        "clave": x.clave,
        "numero": numero,
        "formateado": _formatear(x.prefijo, x.padding or 0, numero),
        "proximo": x.proximo,
    }
