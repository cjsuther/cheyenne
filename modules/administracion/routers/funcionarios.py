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
from models.funcionario import Funcionario

settings = get_settings()
get_current_user = create_auth_dependency(settings.seguridad_url)

_FIRMA_PARA = {"ordenes", "pagos", "resoluciones", "varios"}


def _requiere(cu, permiso):
    if cu.get("superuser"):
        return
    if permiso not in [p["codigo"] for p in cu.get("permisos", [])]:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=f"No tiene el permiso '{permiso}'")


router = APIRouter(prefix="/funcionarios", tags=["Funcionarios"])
_F = ["id", "codigo", "nombre", "cargo", "id_dependencia", "firma_para", "activo"]


def _dump(x):
    return {c: getattr(x, c) for c in _F}


class FuncionarioIn(BaseModel):
    codigo: str
    nombre: str
    cargo: Optional[str] = None
    id_dependencia: Optional[int] = None
    firma_para: str = "varios"
    activo: bool = True


class FuncionarioUpdate(BaseModel):
    codigo: Optional[str] = None
    nombre: Optional[str] = None
    cargo: Optional[str] = None
    id_dependencia: Optional[int] = None
    firma_para: Optional[str] = None
    activo: Optional[bool] = None


def _validar_firma(v: Optional[str]):
    if v is not None and v not in _FIRMA_PARA:
        raise HTTPException(status_code=422, detail=f"firma_para invalido; use uno de {sorted(_FIRMA_PARA)}")


@router.get("")
def listar(request: Request, skip: int = Query(0, ge=0), limit: int = Query(50, ge=1, le=200),
           db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "administracion_config_read")
    q = filtered_query(db.query(Funcionario), Funcionario, dict(request.query_params),
                       exclude={"skip", "limit"}, default_sort="codigo")
    return [_dump(x) for x in q.offset(skip).limit(limit).all()]


@router.get("/{id}")
def obtener(id: int, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "administracion_config_read")
    x = db.query(Funcionario).filter(Funcionario.id == id).first()
    if not x:
        raise HTTPException(status_code=404, detail="Funcionario inexistente")
    return _dump(x)


@router.post("", status_code=201)
def crear(data: FuncionarioIn, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "administracion_config_write")
    _validar_firma(data.firma_para)
    codigo = data.codigo.strip()
    if db.query(Funcionario).filter(Funcionario.codigo == codigo).first():
        raise HTTPException(status_code=409, detail=f"Ya existe el funcionario '{codigo}'")
    payload = data.model_dump()
    payload["codigo"] = codigo
    x = Funcionario(**payload)
    db.add(x); db.commit(); db.refresh(x)
    return _dump(x)


@router.put("/{id}")
def editar(id: int, data: FuncionarioUpdate, db: Session = Depends(get_db),
           current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "administracion_config_write")
    _validar_firma(data.firma_para)
    x = db.query(Funcionario).filter(Funcionario.id == id).first()
    if not x:
        raise HTTPException(status_code=404, detail="Funcionario inexistente")
    cambios = data.model_dump(exclude_unset=True)
    if "codigo" in cambios and cambios["codigo"] and cambios["codigo"] != x.codigo:
        if db.query(Funcionario).filter(Funcionario.codigo == cambios["codigo"], Funcionario.id != id).first():
            raise HTTPException(status_code=409, detail=f"Ya existe el funcionario '{cambios['codigo']}'")
    for k, v in cambios.items():
        setattr(x, k, v)
    db.commit(); db.refresh(x)
    return _dump(x)


@router.delete("/{id}")
def eliminar(id: int, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "administracion_config_delete")
    x = db.query(Funcionario).filter(Funcionario.id == id).first()
    if not x:
        raise HTTPException(status_code=404, detail="Funcionario inexistente")
    x.activo = False; db.commit()
    return {"message": "dado de baja"}
