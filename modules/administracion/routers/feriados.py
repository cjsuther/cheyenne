import sys
import os
from typing import Optional
from datetime import date, timedelta

from fastapi import APIRouter, Depends, Query, HTTPException, status
from sqlalchemy.orm import Session
from starlette.requests import Request
from pydantic import BaseModel

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", ".."))
from shared.base_module import create_auth_dependency
from shared.filters import filtered_query

from database import get_db
from config import get_settings
from models.feriado import Feriado

settings = get_settings()
get_current_user = create_auth_dependency(settings.seguridad_url)

_TIPOS = {"nacional", "provincial", "municipal"}


def _requiere(cu, permiso):
    if cu.get("superuser"):
        return
    if permiso not in [p["codigo"] for p in cu.get("permisos", [])]:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=f"No tiene el permiso '{permiso}'")


router = APIRouter(prefix="/feriados", tags=["Feriados"])
_F = ["id", "fecha", "descripcion", "tipo", "activo"]


def _dump(x):
    return {c: getattr(x, c) for c in _F}


def _es_feriado(db: Session, f: date) -> Optional[Feriado]:
    return db.query(Feriado).filter(Feriado.fecha == f, Feriado.activo == True).first()  # noqa: E712


def _es_habil(db: Session, f: date) -> bool:
    # weekday(): 5=sabado, 6=domingo
    if f.weekday() >= 5:
        return False
    return _es_feriado(db, f) is None


class FeriadoIn(BaseModel):
    fecha: date
    descripcion: Optional[str] = None
    tipo: str = "nacional"
    activo: bool = True


class FeriadoUpdate(BaseModel):
    fecha: Optional[date] = None
    descripcion: Optional[str] = None
    tipo: Optional[str] = None
    activo: Optional[bool] = None


def _validar_tipo(tipo: Optional[str]):
    if tipo is not None and tipo not in _TIPOS:
        raise HTTPException(status_code=422, detail=f"tipo invalido; use uno de {sorted(_TIPOS)}")


# ── Endpoints de calculo (antes de /{id} para no colisionar) ─────────
@router.get("/es-habil")
def es_habil(fecha: date = Query(..., description="YYYY-MM-DD"),
             db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "administracion_config_read")
    fer = _es_feriado(db, fecha)
    finde = fecha.weekday() >= 5
    return {
        "fecha": fecha,
        "es_habil": (not finde) and fer is None,
        "es_finde": finde,
        "es_feriado": fer is not None,
        "feriado": _dump(fer) if fer else None,
    }


@router.get("/proximo-habil")
def proximo_habil(fecha: date = Query(..., description="YYYY-MM-DD"),
                  incluir_actual: bool = Query(True, description="Si la fecha dada ya es habil, devolverla"),
                  db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "administracion_config_read")
    cursor = fecha if incluir_actual else fecha + timedelta(days=1)
    # tope de seguridad para no iterar indefinidamente
    for _ in range(370):
        if _es_habil(db, cursor):
            return {"fecha": fecha, "proximo_habil": cursor}
        cursor += timedelta(days=1)
    raise HTTPException(status_code=500, detail="No se encontro un dia habil en el rango")


# ── CRUD ─────────────────────────────────────────────────────────────
@router.get("")
def listar(request: Request, skip: int = Query(0, ge=0), limit: int = Query(50, ge=1, le=200),
           db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "administracion_config_read")
    q = filtered_query(db.query(Feriado), Feriado, dict(request.query_params),
                       exclude={"skip", "limit"}, default_sort="fecha")
    return [_dump(x) for x in q.offset(skip).limit(limit).all()]


@router.get("/{id}")
def obtener(id: int, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "administracion_config_read")
    x = db.query(Feriado).filter(Feriado.id == id).first()
    if not x:
        raise HTTPException(status_code=404, detail="Feriado inexistente")
    return _dump(x)


@router.post("", status_code=201)
def crear(data: FeriadoIn, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "administracion_config_write")
    _validar_tipo(data.tipo)
    if db.query(Feriado).filter(Feriado.fecha == data.fecha).first():
        raise HTTPException(status_code=409, detail=f"Ya existe un feriado para {data.fecha}")
    x = Feriado(**data.model_dump())
    db.add(x); db.commit(); db.refresh(x)
    return _dump(x)


@router.put("/{id}")
def editar(id: int, data: FeriadoUpdate, db: Session = Depends(get_db),
           current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "administracion_config_write")
    _validar_tipo(data.tipo)
    x = db.query(Feriado).filter(Feriado.id == id).first()
    if not x:
        raise HTTPException(status_code=404, detail="Feriado inexistente")
    cambios = data.model_dump(exclude_unset=True)
    if "fecha" in cambios and cambios["fecha"] != x.fecha:
        if db.query(Feriado).filter(Feriado.fecha == cambios["fecha"], Feriado.id != id).first():
            raise HTTPException(status_code=409, detail=f"Ya existe un feriado para {cambios['fecha']}")
    for k, v in cambios.items():
        setattr(x, k, v)
    db.commit(); db.refresh(x)
    return _dump(x)


@router.delete("/{id}")
def eliminar(id: int, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "administracion_config_delete")
    x = db.query(Feriado).filter(Feriado.id == id).first()
    if not x:
        raise HTTPException(status_code=404, detail="Feriado inexistente")
    x.activo = False; db.commit()
    return {"message": "dado de baja"}
