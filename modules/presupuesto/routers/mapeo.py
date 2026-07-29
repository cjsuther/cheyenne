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
from models.recurso import Recurso, RecursoMovimiento
from models.mapeo_tributo import MapeoTributoRecurso

settings = get_settings()
get_current_user = create_auth_dependency(settings.seguridad_url)

router = APIRouter(prefix="/mapeo-tributo-recurso", tags=["Mapeo Tributo-Recurso"])


def _requiere(cu: dict, permiso: str):
    if cu.get("superuser"):
        return
    if permiso not in [p["codigo"] for p in cu.get("permisos", [])]:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=f"No tiene el permiso '{permiso}'")


def _quien(cu: dict) -> str:
    return cu.get("nombre_apellido") or cu.get("codigo") or "?"


class MapeoIn(BaseModel):
    tributo: str
    anio: int
    id_recurso: int


def _serializar(m: MapeoTributoRecurso) -> dict:
    return {"id": m.id, "tributo": m.tributo, "anio": m.anio,
            "id_recurso": m.id_recurso, "activo": m.activo}


@router.get("")
def listar(request: Request, skip: int = Query(0, ge=0), limit: int = Query(50, ge=1, le=200),
           db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "presupuesto_read")
    query = db.query(MapeoTributoRecurso).filter(MapeoTributoRecurso.activo == True)
    query = filtered_query(query, MapeoTributoRecurso, dict(request.query_params),
                           exclude={"skip", "limit"}, default_sort="id")
    return [_serializar(m) for m in query.offset(skip).limit(limit).all()]


@router.post("", status_code=201)
def crear(data: MapeoIn, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "presupuesto_write")
    tributo = (data.tributo or "").strip().upper()
    if not tributo:
        raise HTTPException(status_code=400, detail="El tributo es obligatorio")
    r = db.query(Recurso).filter(Recurso.id == data.id_recurso, Recurso.activo == True).first()
    if not r:
        raise HTTPException(status_code=400, detail=f"No existe el recurso (id {data.id_recurso})")
    dupe = db.query(MapeoTributoRecurso).filter(
        MapeoTributoRecurso.tributo == tributo, MapeoTributoRecurso.anio == data.anio,
        MapeoTributoRecurso.id_recurso == data.id_recurso, MapeoTributoRecurso.activo == True).first()
    if dupe:
        raise HTTPException(status_code=409, detail="Ya existe ese mapeo (tributo/año/recurso)")
    m = MapeoTributoRecurso(tributo=tributo, anio=data.anio, id_recurso=data.id_recurso)
    db.add(m); db.commit(); db.refresh(m)
    return _serializar(m)


@router.delete("/{id}", status_code=204)
def eliminar(id: int, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "presupuesto_write")
    m = db.query(MapeoTributoRecurso).filter(MapeoTributoRecurso.id == id, MapeoTributoRecurso.activo == True).first()
    if not m:
        raise HTTPException(status_code=404, detail="Mapeo inexistente")
    m.activo = False
    db.commit()


def _resolver_recurso(db: Session, tributo: str, anio: int) -> Optional[int]:
    """Resuelve id_recurso por (tributo, anio); si no hay del año, toma el mapeo más reciente del tributo."""
    exacto = (db.query(MapeoTributoRecurso)
              .filter(MapeoTributoRecurso.tributo == tributo, MapeoTributoRecurso.anio == anio,
                      MapeoTributoRecurso.activo == True)
              .order_by(MapeoTributoRecurso.id.desc()).first())
    if exacto:
        return exacto.id_recurso
    reciente = (db.query(MapeoTributoRecurso)
                .filter(MapeoTributoRecurso.tributo == tributo, MapeoTributoRecurso.activo == True)
                .order_by(MapeoTributoRecurso.anio.desc(), MapeoTributoRecurso.id.desc()).first())
    return reciente.id_recurso if reciente else None


class PercibidoPorTributoIn(BaseModel):
    anio: int
    tributo: str
    importe: float
    periodo: Optional[str] = None
    origen_ref: str
    concepto: Optional[str] = None


# Ruta sin prefijo del router de mapeo: se monta en la app aparte
percibido_router = APIRouter(tags=["Recursos"])


@percibido_router.post("/percibido-por-tributo")
def percibido_por_tributo(data: PercibidoPorTributoIn, db: Session = Depends(get_db),
                          current_user: dict = Depends(get_current_user)):
    """Registra lo percibido de un tributo contra su recurso presupuestario (devengado↔percibido).

    - Resuelve el recurso vía MapeoTributoRecurso (tributo+año, o el mapeo más reciente del tributo).
    - Si no hay mapeo → 200 {estado:"sin_mapeo"} (no falla).
    - Si hay → registra RecursoMovimiento tipo "percibido" idempotente por origen_ref.
    """
    _requiere(current_user, "presupuesto_write")
    tributo = (data.tributo or "").strip().upper()
    origen_ref = (data.origen_ref or "").strip()
    if not tributo:
        raise HTTPException(status_code=400, detail="El tributo es obligatorio")
    if not origen_ref:
        raise HTTPException(status_code=400, detail="origen_ref es obligatorio (idempotencia)")
    try:
        importe = Decimal(str(data.importe))
    except Exception:
        raise HTTPException(status_code=400, detail="importe inválido")
    if importe <= 0:
        raise HTTPException(status_code=400, detail="El importe debe ser positivo")

    id_recurso = _resolver_recurso(db, tributo, data.anio)
    if id_recurso is None:
        return {"estado": "sin_mapeo"}

    r = db.query(Recurso).filter(Recurso.id == id_recurso, Recurso.activo == True).first()
    if not r:
        # El mapeo apunta a un recurso dado de baja: tratar como sin mapeo utilizable.
        return {"estado": "sin_mapeo"}

    # Idempotencia por origen_ref (guardado en referencia).
    dupe = db.query(RecursoMovimiento).filter(
        RecursoMovimiento.id_recurso == id_recurso, RecursoMovimiento.tipo == "percibido",
        RecursoMovimiento.referencia == origen_ref, RecursoMovimiento.activo == True).first()
    if dupe:
        return {"estado": "registrado", "idempotente": True, "id_recurso": id_recurso,
                "id_movimiento": dupe.id, "importe": float(dupe.importe)}

    obs_partes = [p for p in [f"Tributo {tributo}", data.periodo and f"período {data.periodo}", data.concepto] if p]
    m = RecursoMovimiento(id_recurso=id_recurso, tipo="percibido", importe=importe, referencia=origen_ref,
                          usuario_nombre=_quien(current_user), observaciones="; ".join(obs_partes) or None)
    db.add(m); db.commit(); db.refresh(m)
    return {"estado": "registrado", "id_recurso": id_recurso, "id_movimiento": m.id, "importe": float(importe)}
