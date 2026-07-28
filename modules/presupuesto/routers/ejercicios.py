import sys
import os
from datetime import datetime, timezone
from typing import Optional

from fastapi import APIRouter, Depends, Query, HTTPException, status, Body
from sqlalchemy.orm import Session
from starlette.requests import Request

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", ".."))
from shared.base_module import create_auth_dependency
from shared.filters import filtered_query

from database import get_db
from config import get_settings
from models.ejercicio import Ejercicio
from pydantic import BaseModel

settings = get_settings()
get_current_user = create_auth_dependency(settings.seguridad_url)

router = APIRouter(prefix="/ejercicios", tags=["Ejercicios"])

# transición → (estado requerido, estado destino)  — workflow del diseño §7.1
TRANSICIONES = {
    "aprobar":  ("formulacion", "aprobado"),
    "vigencia": ("aprobado", "vigente"),
    "cerrar":   ("vigente", "cerrado"),
    "reabrir":  ("cerrado", "vigente"),  # solo admin (RN: queda auditada)
}


class EjercicioCreate(BaseModel):
    anio: int
    control_sobregiro: str = "bloquear"  # bloquear|advertir (decisión: configurable)


def _requiere(current_user: dict, permiso: str):
    if current_user.get("superuser"):
        return
    permisos = [p["codigo"] for p in current_user.get("permisos", [])]
    if permiso not in permisos:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=f"No tiene el permiso '{permiso}'")


def _serializar(e: Ejercicio):
    return {
        "id": e.id, "anio": e.anio, "estado": e.estado,
        "control_sobregiro": e.control_sobregiro,
        "acto_administrativo": e.acto_administrativo,
        "fecha_aprobacion": e.fecha_aprobacion,
        "historial": e.historial or [],
        "activo": e.activo,
    }


def _registrar(e: Ejercicio, accion: str, current_user: dict, observaciones: str = None):
    hist = list(e.historial or [])
    hist.append({
        "accion": accion,
        "usuario": current_user.get("codigo"),
        "usuario_nombre": current_user.get("nombre_apellido"),
        "fecha": datetime.now(timezone.utc).isoformat(),
        "observaciones": observaciones,
    })
    e.historial = hist


@router.get("")
def listar(
    request: Request,
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=200),
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    _requiere(current_user, "presupuesto_read")
    query = db.query(Ejercicio)
    query = filtered_query(query, Ejercicio, dict(request.query_params),
                           exclude={"skip", "limit"}, default_sort="anio", default_dir="desc")
    return [_serializar(e) for e in query.offset(skip).limit(limit).all()]


@router.get("/{anio}")
def obtener(anio: int, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "presupuesto_read")
    e = db.query(Ejercicio).filter(Ejercicio.anio == anio, Ejercicio.activo == True).first()
    if not e:
        raise HTTPException(status_code=404, detail=f"Ejercicio {anio} no encontrado")
    return _serializar(e)


@router.post("", status_code=201)
def crear(data: EjercicioCreate, db: Session = Depends(get_db),
          current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "presupuesto_write")
    if data.control_sobregiro not in ("bloquear", "advertir"):
        raise HTTPException(status_code=400, detail="control_sobregiro debe ser 'bloquear' o 'advertir'")
    if not (2000 <= data.anio <= 2100):
        raise HTTPException(status_code=400, detail="Año fuera de rango")
    if db.query(Ejercicio).filter(Ejercicio.anio == data.anio, Ejercicio.activo == True).first():
        raise HTTPException(status_code=409, detail=f"El ejercicio {data.anio} ya existe")
    e = Ejercicio(anio=data.anio, control_sobregiro=data.control_sobregiro)
    _registrar(e, "crear", current_user)
    db.add(e); db.commit(); db.refresh(e)
    return _serializar(e)


@router.put("/{anio}/configuracion")
def configurar(anio: int, data: dict = Body(...), db: Session = Depends(get_db),
               current_user: dict = Depends(get_current_user)):
    """Cambia control_sobregiro (permiso admin)."""
    _requiere(current_user, "presupuesto_admin")
    e = db.query(Ejercicio).filter(Ejercicio.anio == anio, Ejercicio.activo == True).first()
    if not e:
        raise HTTPException(status_code=404, detail=f"Ejercicio {anio} no encontrado")
    cs = data.get("control_sobregiro")
    if cs not in ("bloquear", "advertir"):
        raise HTTPException(status_code=400, detail="control_sobregiro debe ser 'bloquear' o 'advertir'")
    e.control_sobregiro = cs
    _registrar(e, f"configurar sobregiro={cs}", current_user)
    db.commit(); db.refresh(e)
    return _serializar(e)


@router.post("/{anio}/{transicion}")
def transicionar(
    anio: int,
    transicion: str,
    data: dict = Body(default={}),
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    if transicion not in TRANSICIONES:
        raise HTTPException(status_code=404, detail=f"Transición '{transicion}' inexistente")
    # permisos: reabrir exige admin; el resto, aprobar_ejercicio
    _requiere(current_user, "presupuesto_admin" if transicion == "reabrir" else "presupuesto_aprobar_ejercicio")

    e = db.query(Ejercicio).filter(Ejercicio.anio == anio, Ejercicio.activo == True).first()
    if not e:
        raise HTTPException(status_code=404, detail=f"Ejercicio {anio} no encontrado")

    desde, hacia = TRANSICIONES[transicion]
    if e.estado != desde:
        raise HTTPException(
            status_code=409,
            detail=f"El ejercicio está en '{e.estado}'; '{transicion}' requiere estado '{desde}'")

    if transicion == "aprobar":
        acto = (data.get("acto_administrativo") or "").strip()
        if not acto:
            raise HTTPException(status_code=400, detail="El acto administrativo es obligatorio para aprobar (RN-07)")
        e.acto_administrativo = acto
        e.fecha_aprobacion = datetime.now(timezone.utc)

    e.estado = hacia
    _registrar(e, transicion, current_user, data.get("observaciones"))
    db.commit(); db.refresh(e)
    return _serializar(e)
