import sys
import os
from decimal import Decimal
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
from models.rrhh import (
    Categoria, TipoCargo, CargoFuncion, NivelLaboral, TipoRelacion, Oficina,
    Parentesco, TipoAntiguedad, Sindicato, ObraSocial, REGIMENES_ANTIG,
)

settings = get_settings()
get_current_user = create_auth_dependency(settings.seguridad_url)


def _requiere(cu, permiso):
    if cu.get("superuser"):
        return
    if permiso not in [p["codigo"] for p in cu.get("permisos", [])]:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=f"No tiene el permiso '{permiso}'")


def _make_catalog_router(prefix, tag, model, in_model, cols, valida=None):
    """Genera un APIRouter con CRUD estándar (list/get/create/update/delete soft)
    para un catálogo simple. `cols` son las columnas serializadas; `valida(data)`
    es una validación opcional antes de crear/editar."""
    router = APIRouter(prefix=prefix, tags=[tag])

    def _ser(x):
        out = {}
        for c in cols:
            v = getattr(x, c)
            if isinstance(v, Decimal):
                v = float(v)
            out[c] = v
        return out

    @router.get("")
    def listar(request: Request, skip: int = Query(0, ge=0), limit: int = Query(50, ge=1, le=100),
               db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
        _requiere(current_user, "rrhh_read")
        q = db.query(model).filter(model.activo == True)
        q = filtered_query(q, model, dict(request.query_params),
                           exclude={"skip", "limit"}, default_sort="codigo")
        return [_ser(x) for x in q.offset(skip).limit(limit).all()]

    @router.get("/{id}")
    def obtener(id: int, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
        _requiere(current_user, "rrhh_read")
        x = db.query(model).filter(model.id == id).first()
        if not x:
            raise HTTPException(status_code=404, detail=f"{tag} inexistente")
        return _ser(x)

    @router.post("", status_code=201)
    def crear(data: in_model, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
        _requiere(current_user, "rrhh_write")
        if valida:
            valida(data)
        codigo = (data.codigo or "").strip()
        if db.query(model).filter(model.codigo == codigo).first():
            raise HTTPException(status_code=409, detail=f"Ya existe el código {codigo}")
        payload = data.model_dump()
        payload["codigo"] = codigo
        x = model(**payload)
        db.add(x); db.commit(); db.refresh(x)
        return _ser(x)

    @router.put("/{id}")
    def editar(id: int, data: in_model, db: Session = Depends(get_db),
               current_user: dict = Depends(get_current_user)):
        _requiere(current_user, "rrhh_write")
        if valida:
            valida(data)
        x = db.query(model).filter(model.id == id).first()
        if not x:
            raise HTTPException(status_code=404, detail=f"{tag} inexistente")
        for k, v in data.model_dump().items():
            if k == "codigo":
                v = (v or "").strip()
            setattr(x, k, v)
        db.commit(); db.refresh(x)
        return _ser(x)

    @router.delete("/{id}")
    def borrar(id: int, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
        _requiere(current_user, "rrhh_write")
        x = db.query(model).filter(model.id == id).first()
        if not x:
            raise HTTPException(status_code=404, detail=f"{tag} inexistente")
        x.activo = False; db.commit()
        return {"message": "dado de baja"}

    return router


# ── Schemas de entrada ────────────────────────────────────────────────
class CategoriaIn(BaseModel):
    codigo: str
    descripcion: str
    cantidad_modulos: Decimal = Decimal("0")
    activo: bool = True


class TipoCargoIn(BaseModel):
    codigo: str
    descripcion: str
    activo: bool = True


class CargoFuncionIn(BaseModel):
    codigo: str
    descripcion: str
    cantidad_modulos: Decimal = Decimal("0")
    es_cargo: bool = True
    es_funcion: bool = False
    activo: bool = True


class NivelLaboralIn(BaseModel):
    codigo: str
    descripcion: str
    activo: bool = True


class TipoRelacionIn(BaseModel):
    codigo: str
    descripcion: str
    activo: bool = True


class OficinaIn(BaseModel):
    codigo: str
    descripcion: str
    activo: bool = True


class ParentescoIn(BaseModel):
    codigo: str
    descripcion: str
    activo: bool = True


class TipoAntiguedadIn(BaseModel):
    codigo: str
    descripcion: str
    regimen: str = "municipal"
    computa: bool = True
    activo: bool = True


class SindicatoIn(BaseModel):
    codigo: str
    nombre: str
    cuit: Optional[str] = None
    porcentaje_aporte: Decimal = Decimal("0")
    activo: bool = True


class ObraSocialIn(BaseModel):
    codigo: str
    nombre: str
    cuit: Optional[str] = None
    porcentaje_aporte: Decimal = Decimal("0")
    activo: bool = True


def _valida_tipo_antig(data):
    if data.regimen not in REGIMENES_ANTIG:
        raise HTTPException(status_code=400, detail=f"Régimen inválido; use uno de {REGIMENES_ANTIG}")


# ── Routers de catálogos ──────────────────────────────────────────────
categorias_router = _make_catalog_router(
    "/categorias", "Categorías", Categoria, CategoriaIn,
    ["id", "codigo", "descripcion", "cantidad_modulos", "activo"])

tipos_cargo_router = _make_catalog_router(
    "/tipos-cargo", "Tipos de Cargo", TipoCargo, TipoCargoIn,
    ["id", "codigo", "descripcion", "activo"])

cargos_funciones_router = _make_catalog_router(
    "/cargos-funciones", "Cargos y Funciones", CargoFuncion, CargoFuncionIn,
    ["id", "codigo", "descripcion", "cantidad_modulos", "es_cargo", "es_funcion", "activo"])

niveles_laboral_router = _make_catalog_router(
    "/niveles-laboral", "Niveles Laborales", NivelLaboral, NivelLaboralIn,
    ["id", "codigo", "descripcion", "activo"])

tipos_relacion_router = _make_catalog_router(
    "/tipos-relacion", "Tipos de Relación", TipoRelacion, TipoRelacionIn,
    ["id", "codigo", "descripcion", "activo"])

oficinas_router = _make_catalog_router(
    "/oficinas", "Oficinas", Oficina, OficinaIn,
    ["id", "codigo", "descripcion", "activo"])

parentescos_router = _make_catalog_router(
    "/parentescos", "Parentescos", Parentesco, ParentescoIn,
    ["id", "codigo", "descripcion", "activo"])

tipos_antiguedad_router = _make_catalog_router(
    "/tipos-antiguedad", "Tipos de Antigüedad", TipoAntiguedad, TipoAntiguedadIn,
    ["id", "codigo", "descripcion", "regimen", "computa", "activo"], valida=_valida_tipo_antig)

sindicatos_router = _make_catalog_router(
    "/sindicatos", "Sindicatos", Sindicato, SindicatoIn,
    ["id", "codigo", "nombre", "cuit", "porcentaje_aporte", "activo"])

obras_sociales_router = _make_catalog_router(
    "/obras-sociales", "Obras Sociales", ObraSocial, ObraSocialIn,
    ["id", "codigo", "nombre", "cuit", "porcentaje_aporte", "activo"])
