import sys
import os
from decimal import Decimal
from typing import Optional

from fastapi import APIRouter, Depends, Query, HTTPException, status, Body
from sqlalchemy.orm import Session
from starlette.requests import Request
from pydantic import BaseModel

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", ".."))
from shared.base_module import create_auth_dependency
from shared.filters import filtered_query

from database import get_db
from config import get_settings
from models.meta import Meta, Proyecto, ESTADOS_PROYECTO
from models.nomencladores import Estructura, Jurisdiccion

settings = get_settings()
get_current_user = create_auth_dependency(settings.seguridad_url)

metas_router = APIRouter(prefix="/metas", tags=["Metas físicas"])
proyectos_router = APIRouter(prefix="/proyectos", tags=["Proyectos de inversión"])


class MetaIn(BaseModel):
    anio: int
    id_estructura: int
    descripcion: str
    unidad_medida: str
    meta_anual: Decimal = Decimal("0")
    observaciones: Optional[str] = None


class ProyectoIn(BaseModel):
    codigo: str
    nombre: str
    anio_inicio: int
    id_jurisdiccion: Optional[int] = None
    id_estructura: Optional[int] = None
    monto_total: Decimal = Decimal("0")
    estado: str = "formulacion"
    etapa: Optional[str] = None
    avance_fisico: Decimal = Decimal("0")
    avance_financiero: Decimal = Decimal("0")
    fecha_inicio: Optional[str] = None
    fecha_fin_estimada: Optional[str] = None
    descripcion: Optional[str] = None


def _requiere(cu, permiso):
    if cu.get("superuser"):
        return
    if permiso not in [p["codigo"] for p in cu.get("permisos", [])]:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=f"No tiene el permiso '{permiso}'")


def _espr(db, ids):
    if not ids:
        return {}
    return {x.id: {"id": x.id, "codigo": x.codigo, "nombre": x.nombre}
            for x in db.query(Estructura).filter(Estructura.id.in_(list(ids))).all()}


# ── Metas ────────────────────────────────────────────────────────────
def _ser_meta(m: Meta, espr):
    avance = float(m.ejecutado / m.meta_anual * 100) if m.meta_anual else 0.0
    return {"id": m.id, "anio": m.anio, "estructura": espr.get(m.id_estructura, {}),
            "descripcion": m.descripcion, "unidad_medida": m.unidad_medida,
            "meta_anual": float(m.meta_anual), "ejecutado": float(m.ejecutado),
            "avance": round(avance, 1), "observaciones": m.observaciones, "activo": m.activo}


@metas_router.get("")
def listar_metas(request: Request, anio: int = Query(...), skip: int = Query(0, ge=0),
                 limit: int = Query(50, ge=1, le=200), db: Session = Depends(get_db),
                 current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "presupuesto_read")
    query = db.query(Meta).filter(Meta.anio == anio, Meta.activo == True)
    query = filtered_query(query, Meta, dict(request.query_params),
                           exclude={"skip", "limit", "anio"}, default_sort="id")
    filas = query.offset(skip).limit(limit).all()
    espr = _espr(db, {m.id_estructura for m in filas})
    return [_ser_meta(m, espr) for m in filas]


@metas_router.post("", status_code=201)
def crear_meta(data: MetaIn, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "presupuesto_write")
    if not db.query(Estructura).filter(Estructura.id == data.id_estructura, Estructura.activo == True).first():
        raise HTTPException(status_code=400, detail="Estructura programática inexistente")
    if not data.descripcion.strip() or not data.unidad_medida.strip():
        raise HTTPException(status_code=400, detail="Descripción y unidad de medida son obligatorias")
    m = Meta(**data.model_dump())
    db.add(m); db.commit(); db.refresh(m)
    return _ser_meta(m, _espr(db, {m.id_estructura}))


@metas_router.put("/{id}")
def actualizar_meta(id: int, data: MetaIn, db: Session = Depends(get_db),
                    current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "presupuesto_write")
    m = db.query(Meta).filter(Meta.id == id, Meta.activo == True).first()
    if not m:
        raise HTTPException(status_code=404, detail=f"Meta {id} inexistente")
    for k, v in data.model_dump().items():
        setattr(m, k, v)
    db.commit()
    return _ser_meta(m, _espr(db, {m.id_estructura}))


@metas_router.post("/{id}/ejecutado")
def registrar_ejecutado(id: int, data: dict = Body(...), db: Session = Depends(get_db),
                        current_user: dict = Depends(get_current_user)):
    """Registra avance físico (suma al acumulado; negativo corrige)."""
    _requiere(current_user, "presupuesto_write")
    m = db.query(Meta).filter(Meta.id == id, Meta.activo == True).first()
    if not m:
        raise HTTPException(status_code=404, detail=f"Meta {id} inexistente")
    try:
        cantidad = Decimal(str(data.get("cantidad")))
    except Exception:
        raise HTTPException(status_code=400, detail="cantidad inválida")
    nuevo = Decimal(str(m.ejecutado)) + cantidad
    if nuevo < 0:
        raise HTTPException(status_code=409, detail="El ejecutado no puede quedar negativo")
    m.ejecutado = nuevo
    db.commit()
    return _ser_meta(m, _espr(db, {m.id_estructura}))


@metas_router.delete("/{id}")
def eliminar_meta(id: int, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "presupuesto_delete")
    m = db.query(Meta).filter(Meta.id == id, Meta.activo == True).first()
    if not m:
        raise HTTPException(status_code=404, detail=f"Meta {id} inexistente")
    m.activo = False; db.commit()
    return {"message": f"Meta {id} dada de baja"}


# ── Proyectos ────────────────────────────────────────────────────────
def _ser_proy(p: Proyecto, db):
    juri = db.query(Jurisdiccion).filter(Jurisdiccion.id == p.id_jurisdiccion).first() if p.id_jurisdiccion else None
    espr = db.query(Estructura).filter(Estructura.id == p.id_estructura).first() if p.id_estructura else None
    return {"id": p.id, "codigo": p.codigo, "nombre": p.nombre, "anio_inicio": p.anio_inicio,
            "jurisdiccion": {"id": juri.id, "codigo": juri.codigo, "nombre": juri.nombre} if juri else None,
            "estructura": {"id": espr.id, "codigo": espr.codigo, "nombre": espr.nombre} if espr else None,
            "monto_total": float(p.monto_total), "estado": p.estado, "etapa": p.etapa,
            "avance_fisico": float(p.avance_fisico), "avance_financiero": float(p.avance_financiero),
            "fecha_inicio": p.fecha_inicio, "fecha_fin_estimada": p.fecha_fin_estimada,
            "descripcion": p.descripcion, "activo": p.activo}


def _validar_proyecto(data: ProyectoIn):
    if data.estado not in ESTADOS_PROYECTO:
        raise HTTPException(status_code=400, detail=f"Estado inválido: {data.estado}")
    for campo in ("avance_fisico", "avance_financiero"):
        v = getattr(data, campo)
        if not (0 <= v <= 100):
            raise HTTPException(status_code=400, detail=f"{campo} debe estar entre 0 y 100")


@proyectos_router.get("")
def listar_proyectos(request: Request, skip: int = Query(0, ge=0), limit: int = Query(50, ge=1, le=200),
                     db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "presupuesto_read")
    query = db.query(Proyecto).filter(Proyecto.activo == True)
    query = filtered_query(query, Proyecto, dict(request.query_params),
                           exclude={"skip", "limit"}, default_sort="codigo")
    return [_ser_proy(p, db) for p in query.offset(skip).limit(limit).all()]


@proyectos_router.post("", status_code=201)
def crear_proyecto(data: ProyectoIn, db: Session = Depends(get_db),
                   current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "presupuesto_write")
    _validar_proyecto(data)
    if db.query(Proyecto).filter(Proyecto.codigo == data.codigo.strip()).first():
        raise HTTPException(status_code=409, detail=f"Ya existe el proyecto {data.codigo}")
    payload = data.model_dump()
    payload["codigo"] = payload["codigo"].strip()
    p = Proyecto(**payload)
    db.add(p); db.commit(); db.refresh(p)
    return _ser_proy(p, db)


@proyectos_router.put("/{id}")
def actualizar_proyecto(id: int, data: ProyectoIn, db: Session = Depends(get_db),
                        current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "presupuesto_write")
    p = db.query(Proyecto).filter(Proyecto.id == id, Proyecto.activo == True).first()
    if not p:
        raise HTTPException(status_code=404, detail=f"Proyecto {id} inexistente")
    _validar_proyecto(data)
    dupe = db.query(Proyecto).filter(Proyecto.codigo == data.codigo.strip(), Proyecto.id != id).first()
    if dupe:
        raise HTTPException(status_code=409, detail=f"Ya existe el proyecto {data.codigo}")
    for k, v in data.model_dump().items():
        setattr(p, k, v)
    db.commit()
    return _ser_proy(p, db)


@proyectos_router.delete("/{id}")
def eliminar_proyecto(id: int, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "presupuesto_delete")
    p = db.query(Proyecto).filter(Proyecto.id == id, Proyecto.activo == True).first()
    if not p:
        raise HTTPException(status_code=404, detail=f"Proyecto {id} inexistente")
    p.activo = False; db.commit()
    return {"message": f"Proyecto {id} dado de baja"}
