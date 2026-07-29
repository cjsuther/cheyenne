import sys
import os
from typing import Optional
from decimal import Decimal

from pydantic import BaseModel
from fastapi import APIRouter, Depends, Query, HTTPException, status
from sqlalchemy.orm import Session
from starlette.requests import Request

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", ".."))
from shared.base_module import create_auth_dependency
from shared.filters import filtered_query

from database import get_db
from config import get_settings
from models.servicio_medido import ServicioMedido, LecturaMedidor

settings = get_settings()
get_current_user = create_auth_dependency(settings.seguridad_url)

router = APIRouter(prefix="/servicios-medidos", tags=["Servicios Medidos"])

TIPOS = ("agua", "cloaca", "luz")


def _requiere(cu, permiso):
    if cu.get("superuser"):
        return
    if permiso not in [p["codigo"] for p in cu.get("permisos", [])]:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=f"No tiene el permiso '{permiso}'")


class ServicioIn(BaseModel):
    id_cuenta: Optional[int] = None
    tipo: str
    medidor_numero: Optional[str] = None
    tarifa: Decimal = Decimal("0")
    activo: bool = True


class LecturaIn(BaseModel):
    periodo: int
    lectura_anterior: Optional[Decimal] = None  # si no se envia, toma la ultima lectura_actual
    lectura_actual: Decimal


# ── Servicios medidos (CRUD) ─────────────────────────────────────────
@router.get("")
def listar(request: Request, skip: int = Query(0, ge=0), limit: int = Query(50, ge=1, le=200),
           id_cuenta: Optional[int] = Query(None), tipo: Optional[str] = Query(None),
           db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "ingresos_marginales")
    q = db.query(ServicioMedido)
    if id_cuenta is not None:
        q = q.filter(ServicioMedido.id_cuenta == id_cuenta)
    if tipo:
        q = q.filter(ServicioMedido.tipo == tipo)
    q = filtered_query(q, ServicioMedido, dict(request.query_params),
                       exclude={"skip", "limit", "id_cuenta", "tipo"}, default_sort="id")
    return q.offset(skip).limit(limit).all()


@router.get("/{id}")
def obtener(id: int, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "ingresos_marginales")
    x = db.query(ServicioMedido).filter(ServicioMedido.id == id).first()
    if not x:
        raise HTTPException(status_code=404, detail=f"Servicio {id} no encontrado")
    return x


@router.post("", status_code=201)
def crear(data: ServicioIn, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "ingresos_marginales")
    if data.tipo not in TIPOS:
        raise HTTPException(status_code=400, detail=f"Tipo inválido: {data.tipo} (permitidos: {', '.join(TIPOS)})")
    x = ServicioMedido(**data.model_dump())
    db.add(x); db.commit(); db.refresh(x)
    return x


@router.put("/{id}")
def editar(id: int, data: ServicioIn, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "ingresos_marginales")
    if data.tipo not in TIPOS:
        raise HTTPException(status_code=400, detail=f"Tipo inválido: {data.tipo} (permitidos: {', '.join(TIPOS)})")
    x = db.query(ServicioMedido).filter(ServicioMedido.id == id).first()
    if not x:
        raise HTTPException(status_code=404, detail=f"Servicio {id} no encontrado")
    for k, v in data.model_dump().items():
        setattr(x, k, v)
    db.commit(); db.refresh(x)
    return x


@router.delete("/{id}")
def eliminar(id: int, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "ingresos_marginales")
    x = db.query(ServicioMedido).filter(ServicioMedido.id == id).first()
    if not x:
        raise HTTPException(status_code=404, detail=f"Servicio {id} no encontrado")
    x.activo = False
    db.commit()
    return {"message": f"Servicio {id} dado de baja"}


# ── Lecturas de medidor ──────────────────────────────────────────────
@router.get("/{id_servicio}/lecturas")
def listar_lecturas(id_servicio: int, skip: int = Query(0, ge=0), limit: int = Query(50, ge=1, le=200),
                    db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "ingresos_marginales")
    return (db.query(LecturaMedidor)
            .filter(LecturaMedidor.id_servicio == id_servicio)
            .order_by(LecturaMedidor.periodo.desc())
            .offset(skip).limit(limit).all())


@router.post("/{id_servicio}/lecturas", status_code=201)
def cargar_lectura(id_servicio: int, data: LecturaIn,
                   db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    """Carga una lectura: calcula consumo = actual - anterior e importe = consumo * tarifa del servicio."""
    _requiere(current_user, "ingresos_marginales")
    serv = db.query(ServicioMedido).filter(ServicioMedido.id == id_servicio).first()
    if not serv:
        raise HTTPException(status_code=404, detail=f"Servicio {id_servicio} no encontrado")

    # Lectura anterior: la enviada, o la última lectura_actual registrada
    if data.lectura_anterior is not None:
        anterior = data.lectura_anterior
    else:
        ultima = (db.query(LecturaMedidor)
                  .filter(LecturaMedidor.id_servicio == id_servicio)
                  .order_by(LecturaMedidor.periodo.desc(), LecturaMedidor.id.desc())
                  .first())
        anterior = ultima.lectura_actual if ultima else Decimal("0")

    consumo = data.lectura_actual - anterior
    if consumo < 0:
        raise HTTPException(status_code=400, detail="La lectura actual no puede ser menor que la anterior")

    tarifa = serv.tarifa or Decimal("0")
    importe = consumo * tarifa

    lec = LecturaMedidor(
        id_servicio=id_servicio,
        periodo=data.periodo,
        lectura_anterior=anterior,
        lectura_actual=data.lectura_actual,
        consumo=consumo,
        importe=importe,
    )
    db.add(lec); db.commit(); db.refresh(lec)
    return lec
