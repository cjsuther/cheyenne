import sys
import os
from typing import List, Optional
from datetime import date, datetime, timezone
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
from models.prescripcion import Prescripcion
from models.emision import Emision
from models.cuenta import Cuenta

settings = get_settings()
get_current_user = create_auth_dependency(settings.seguridad_url)

router = APIRouter(prefix="/prescripciones", tags=["Prescripción de deuda"])

ANIOS_PRESCRIPCION_DEFAULT = 5


def _requiere(cu, permiso):
    if cu.get("superuser"):
        return
    if permiso not in [p["codigo"] for p in cu.get("permisos", [])]:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=f"No tiene el permiso '{permiso}'")


class PrescripcionResponse(BaseModel):
    id: int
    id_cuenta: int
    id_emision: Optional[int] = None
    ejercicio: Optional[int] = None
    periodo: Optional[int] = None
    fecha: date
    acto: str
    importe: Decimal
    observaciones: Optional[str] = None
    activo: bool
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class PrescriptibleItem(BaseModel):
    id_emision: int
    id_cuenta: Optional[int] = None
    ejercicio: Optional[int] = None
    periodo: Optional[int] = None
    cuota: Optional[int] = None
    antiguedad_anios: int
    importe_total: Decimal
    ya_prescripta: bool


class MarcarPrescriptaIn(BaseModel):
    id_cuenta: int
    id_emision: Optional[int] = None
    ejercicio: Optional[int] = None
    periodo: Optional[int] = None
    acto: str
    importe: Optional[Decimal] = None
    fecha: Optional[date] = None
    observaciones: Optional[str] = None


def _anio_ejercicio(em: Emision) -> Optional[int]:
    # El "ejercicio" es el año fiscal; si falta, se deriva del período (AAAAMM o AAAA).
    if em.ejercicio:
        return int(em.ejercicio)
    if em.periodo:
        p = int(em.periodo)
        return p // 100 if p > 9999 else p
    return None


@router.get("/prescriptible", response_model=List[PrescriptibleItem])
def listar_prescriptible(
    id_cuenta: Optional[int] = Query(None),
    anios_prescripcion: int = Query(ANIOS_PRESCRIPCION_DEFAULT, ge=1, le=50),
    incluir_prescriptas: bool = Query(False),
    skip: int = Query(0, ge=0),
    limit: int = Query(200, ge=1, le=200),
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    """Deuda prescriptible por antigüedad del período.

    Una emisión es prescriptible cuando su ejercicio (año) es más antiguo que
    `anios_prescripcion` respecto del año en curso. Consulta la deuda local (emisiones
    de este módulo). Excluye emisiones anuladas y las ya prescriptas (salvo flag).
    """
    _requiere(current_user, "ingresos_read")
    anio_actual = datetime.now(timezone.utc).year
    limite_anio = anio_actual - anios_prescripcion

    q = db.query(Emision).filter(Emision.id_estado_emision != 90)  # 90 = anulada
    if id_cuenta is not None:
        q = q.filter(Emision.id_cuenta == id_cuenta)
    # ordenadas de más antigua a más nueva
    q = q.order_by(Emision.ejercicio.asc().nullslast(), Emision.periodo.asc().nullslast(), Emision.id.asc())

    ya_prescriptas = {
        p.id_emision for p in db.query(Prescripcion.id_emision)
        .filter(Prescripcion.activo == True, Prescripcion.id_emision.isnot(None)).all()  # noqa: E712
        if p.id_emision is not None
    }

    out: List[PrescriptibleItem] = []
    for em in q.offset(skip).limit(limit).all():
        anio = _anio_ejercicio(em)
        if anio is None or anio > limite_anio:
            continue
        prescripta = em.id in ya_prescriptas
        if prescripta and not incluir_prescriptas:
            continue
        out.append(PrescriptibleItem(
            id_emision=em.id,
            id_cuenta=em.id_cuenta,
            ejercicio=em.ejercicio,
            periodo=em.periodo,
            cuota=em.cuota,
            antiguedad_anios=anio_actual - anio,
            importe_total=em.importe_total or Decimal("0"),
            ya_prescripta=prescripta,
        ))
    return out


@router.get("", response_model=List[PrescripcionResponse])
def listar_prescripciones(
    request: Request,
    id_cuenta: Optional[int] = Query(None),
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=200),
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    _requiere(current_user, "ingresos_read")
    q = db.query(Prescripcion).filter(Prescripcion.activo == True)  # noqa: E712
    if id_cuenta is not None:
        q = q.filter(Prescripcion.id_cuenta == id_cuenta)
    q = filtered_query(q, Prescripcion, dict(request.query_params),
                       exclude={"skip", "limit", "id_cuenta"}, default_sort="id")
    return q.offset(skip).limit(limit).all()


@router.post("", response_model=PrescripcionResponse, status_code=201)
def marcar_prescripta(
    data: MarcarPrescriptaIn,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    """Marca una deuda/período como prescripta mediante un acto administrativo.

    Requiere el permiso `ingresos_prescribir`. Idempotente por (id_emision) activa.
    """
    _requiere(current_user, "ingresos_prescribir")

    if not db.query(Cuenta).filter(Cuenta.id == data.id_cuenta).first():
        raise HTTPException(status_code=404, detail=f"Cuenta {data.id_cuenta} inexistente")

    importe = data.importe
    ejercicio = data.ejercicio
    periodo = data.periodo

    if data.id_emision is not None:
        em = db.query(Emision).filter(Emision.id == data.id_emision).first()
        if not em:
            raise HTTPException(status_code=404, detail=f"Emisión {data.id_emision} inexistente")
        # Idempotencia por emisión ya prescripta
        existente = db.query(Prescripcion).filter(
            Prescripcion.id_emision == data.id_emision, Prescripcion.activo == True  # noqa: E712
        ).first()
        if existente:
            return existente
        if importe is None:
            importe = em.importe_total or Decimal("0")
        if ejercicio is None:
            ejercicio = em.ejercicio
        if periodo is None:
            periodo = em.periodo

    x = Prescripcion(
        id_cuenta=data.id_cuenta,
        id_emision=data.id_emision,
        ejercicio=ejercicio,
        periodo=periodo,
        fecha=data.fecha or datetime.now(timezone.utc).date(),
        acto=data.acto,
        importe=importe or Decimal("0"),
        observaciones=data.observaciones,
        activo=True,
    )
    db.add(x); db.commit(); db.refresh(x)
    return x


@router.delete("/{id}")
def revertir_prescripcion(id: int, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    """Revierte (soft-delete) una prescripción registrada."""
    _requiere(current_user, "ingresos_prescribir")
    x = db.query(Prescripcion).filter(Prescripcion.id == id).first()
    if not x:
        raise HTTPException(status_code=404, detail=f"Prescripción {id} no encontrada")
    x.activo = False
    db.commit()
    return {"message": f"Prescripción {id} revertida"}
