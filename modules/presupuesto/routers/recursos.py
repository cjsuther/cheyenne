import sys
import os
from decimal import Decimal
from typing import Optional

from fastapi import APIRouter, Depends, Query, HTTPException, status, Body
from sqlalchemy import func
from sqlalchemy.orm import Session
from starlette.requests import Request
from pydantic import BaseModel

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", ".."))
from shared.base_module import create_auth_dependency
from shared.filters import filtered_query

from database import get_db
from config import get_settings
from models.recurso import Recurso, RecursoMovimiento
from models.nomencladores import Jurisdiccion, Rubro
from models.ejercicio import Ejercicio

settings = get_settings()
get_current_user = create_auth_dependency(settings.seguridad_url)

router = APIRouter(prefix="/recursos", tags=["Recursos"])

CERO = Decimal("0.00")


class RecursoIn(BaseModel):
    anio: int
    id_jurisdiccion: int
    id_rubro: int
    estimado_inicial: Decimal = Decimal("0")
    metodologia: Optional[str] = None


def _requiere(cu: dict, permiso: str):
    if cu.get("superuser"):
        return
    if permiso not in [p["codigo"] for p in cu.get("permisos", [])]:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=f"No tiene el permiso '{permiso}'")


def _quien(cu: dict) -> str:
    return cu.get("nombre_apellido") or cu.get("codigo") or "?"


def _ejercicio(db, anio) -> Ejercicio:
    e = db.query(Ejercicio).filter(Ejercicio.anio == anio, Ejercicio.activo == True).first()
    if not e:
        raise HTTPException(status_code=404, detail=f"Ejercicio {anio} no encontrado")
    return e


def _saldos_recursos(db, ids):
    if not ids:
        return {}
    filas = (db.query(RecursoMovimiento.id_recurso, RecursoMovimiento.tipo, func.sum(RecursoMovimiento.importe))
             .filter(RecursoMovimiento.id_recurso.in_(list(ids)), RecursoMovimiento.activo == True)
             .group_by(RecursoMovimiento.id_recurso, RecursoMovimiento.tipo).all())
    por = {}
    for id_r, tipo, total in filas:
        por.setdefault(id_r, {})[tipo] = Decimal(str(total or 0))
    out = {}
    for id_r in ids:
        t = por.get(id_r, {})
        inicial = t.get("inicial", CERO)
        modif = t.get("modificacion", CERO)
        out[id_r] = {"inicial": inicial, "modificaciones": modif,
                     "vigente": inicial + modif, "percibido": t.get("percibido", CERO)}
    return out


def _serializar(r: Recurso, saldos, nombres):
    s = saldos.get(r.id, {})
    return {
        "id": r.id, "anio": r.anio,
        "jurisdiccion": nombres["juri"].get(r.id_jurisdiccion, {}),
        "rubro": nombres["rubro"].get(r.id_rubro, {}),
        "metodologia": r.metodologia, "activo": r.activo,
        **{k: float(v) for k, v in s.items()},
    }


def _nombres(db, recursos):
    def mapa(modelo, ids):
        if not ids:
            return {}
        return {x.id: {"id": x.id, "codigo": x.codigo, "nombre": x.nombre}
                for x in db.query(modelo).filter(modelo.id.in_(list(ids))).all()}
    return {"juri": mapa(Jurisdiccion, {r.id_jurisdiccion for r in recursos}),
            "rubro": mapa(Rubro, {r.id_rubro for r in recursos})}


@router.get("")
def listar(request: Request, anio: int = Query(...), skip: int = Query(0, ge=0),
           limit: int = Query(50, ge=1, le=200), db: Session = Depends(get_db),
           current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "presupuesto_read")
    query = db.query(Recurso).filter(Recurso.anio == anio, Recurso.activo == True)
    query = filtered_query(query, Recurso, dict(request.query_params),
                           exclude={"skip", "limit", "anio"}, default_sort="id")
    recursos = query.offset(skip).limit(limit).all()
    saldos = _saldos_recursos(db, [r.id for r in recursos])
    nombres = _nombres(db, recursos)
    return [_serializar(r, saldos, nombres) for r in recursos]


@router.post("", status_code=201)
def crear(data: RecursoIn, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "presupuesto_write")
    e = _ejercicio(db, data.anio)
    if e.estado != "formulacion":
        raise HTTPException(status_code=409, detail="El estimado inicial se carga en formulación; luego use una modificación (RN-14)")
    for modelo, id_, nombre in ((Jurisdiccion, data.id_jurisdiccion, "jurisdicción"), (Rubro, data.id_rubro, "rubro")):
        if not db.query(modelo).filter(modelo.id == id_, modelo.activo == True).first():
            raise HTTPException(status_code=400, detail=f"No existe la {nombre} (id {id_})")
    if db.query(Recurso).filter(Recurso.anio == data.anio, Recurso.id_jurisdiccion == data.id_jurisdiccion,
                                Recurso.id_rubro == data.id_rubro, Recurso.activo == True).first():
        raise HTTPException(status_code=409, detail="Ya existe el recurso para esa jurisdicción y rubro")
    r = Recurso(**data.model_dump())
    db.add(r); db.flush()
    db.add(RecursoMovimiento(id_recurso=r.id, tipo="inicial", importe=r.estimado_inicial,
                             usuario_nombre=_quien(current_user), observaciones="Estimado inicial"))
    db.commit(); db.refresh(r)
    return _serializar(r, _saldos_recursos(db, [r.id]), _nombres(db, [r]))


@router.post("/{id}/modificar")
def modificar(id: int, data: dict = Body(...), db: Session = Depends(get_db),
              current_user: dict = Depends(get_current_user)):
    """Modificación del cálculo de recursos (delta ±) con acto administrativo (RN-14)."""
    _requiere(current_user, "presupuesto_modificacion_aprobar")
    r = db.query(Recurso).filter(Recurso.id == id, Recurso.activo == True).first()
    if not r:
        raise HTTPException(status_code=404, detail=f"Recurso {id} inexistente")
    e = _ejercicio(db, r.anio)
    if e.estado not in ("aprobado", "vigente"):
        raise HTTPException(status_code=409, detail=f"El ejercicio está '{e.estado}' (RN-14)")
    try:
        importe = Decimal(str(data.get("importe")))
    except Exception:
        raise HTTPException(status_code=400, detail="importe inválido")
    if importe == 0:
        raise HTTPException(status_code=400, detail="El importe no puede ser cero")
    acto = (data.get("acto_administrativo") or "").strip()
    if not acto:
        raise HTTPException(status_code=400, detail="El acto administrativo es obligatorio (RN-07)")
    db.add(RecursoMovimiento(id_recurso=id, tipo="modificacion", importe=importe, referencia=acto,
                             usuario_nombre=_quien(current_user), observaciones=data.get("observaciones")))
    db.commit()
    return _serializar(r, _saldos_recursos(db, [id]), _nombres(db, [r]))


@router.post("/percibido")
def percibido(data: dict = Body(...), db: Session = Depends(get_db),
              current_user: dict = Depends(get_current_user)):
    """Registra recaudación percibida contra un recurso (futuro: Tesorería/Rentas por HTTP)."""
    _requiere(current_user, "presupuesto_afectar")
    r = db.query(Recurso).filter(Recurso.id == data.get("id_recurso"), Recurso.activo == True).first()
    if not r:
        raise HTTPException(status_code=404, detail="Recurso inexistente")
    try:
        importe = Decimal(str(data.get("importe")))
    except Exception:
        raise HTTPException(status_code=400, detail="importe inválido")
    if importe <= 0:
        raise HTTPException(status_code=400, detail="El importe debe ser positivo")
    referencia = (data.get("referencia") or "").strip() or None
    # idempotencia simple por referencia
    if referencia:
        dupe = db.query(RecursoMovimiento).filter(
            RecursoMovimiento.id_recurso == r.id, RecursoMovimiento.tipo == "percibido",
            RecursoMovimiento.referencia == referencia, RecursoMovimiento.activo == True).first()
        if dupe:
            return {"idempotente": True, "id_movimiento": dupe.id}
    m = RecursoMovimiento(id_recurso=r.id, tipo="percibido", importe=importe, referencia=referencia,
                          usuario_nombre=_quien(current_user), observaciones=data.get("observaciones"))
    db.add(m); db.commit()
    return {"id_movimiento": m.id, "percibido": float(importe)}


@router.get("/{id}/movimientos")
def movimientos(id: int, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "presupuesto_read")
    movs = (db.query(RecursoMovimiento).filter(RecursoMovimiento.id_recurso == id, RecursoMovimiento.activo == True)
            .order_by(RecursoMovimiento.fecha.desc()).all())
    return [{"id": m.id, "fecha": m.fecha, "tipo": m.tipo, "importe": float(m.importe),
             "referencia": m.referencia, "usuario": m.usuario_nombre, "observaciones": m.observaciones}
            for m in movs]
