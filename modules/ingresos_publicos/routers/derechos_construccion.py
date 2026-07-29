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
from models.derecho_construccion import DerechoConstruccion

settings = get_settings()
get_current_user = create_auth_dependency(settings.seguridad_url)

router = APIRouter(prefix="/derechos-construccion", tags=["Derechos de Construcción"])

ESTADOS = ("liquidado", "pagado")
# Alícuota simple sobre el valor de obra usada al liquidar (1%)
ALICUOTA_DEFECTO = Decimal("0.01")


def _requiere(cu, permiso):
    if cu.get("superuser"):
        return
    if permiso not in [p["codigo"] for p in cu.get("permisos", [])]:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=f"No tiene el permiso '{permiso}'")


class DerechoIn(BaseModel):
    id_inmueble: Optional[int] = None
    expediente: Optional[str] = None
    m2: Optional[Decimal] = None
    destino: Optional[str] = None
    valor_obra: Decimal = Decimal("0")
    importe: Decimal = Decimal("0")
    estado: str = "liquidado"


class LiquidarIn(BaseModel):
    alicuota: Optional[Decimal] = None  # fracción (0.01 = 1%). Si no se envía, usa la de defecto


@router.get("")
def listar(request: Request, skip: int = Query(0, ge=0), limit: int = Query(50, ge=1, le=200),
           id_inmueble: Optional[int] = Query(None), estado: Optional[str] = Query(None),
           db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "ingresos_marginales")
    q = db.query(DerechoConstruccion)
    if id_inmueble is not None:
        q = q.filter(DerechoConstruccion.id_inmueble == id_inmueble)
    if estado:
        q = q.filter(DerechoConstruccion.estado == estado)
    q = filtered_query(q, DerechoConstruccion, dict(request.query_params),
                       exclude={"skip", "limit", "id_inmueble", "estado"}, default_sort="id")
    return q.offset(skip).limit(limit).all()


@router.get("/{id}")
def obtener(id: int, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "ingresos_marginales")
    x = db.query(DerechoConstruccion).filter(DerechoConstruccion.id == id).first()
    if not x:
        raise HTTPException(status_code=404, detail=f"Derecho {id} no encontrado")
    return x


@router.post("", status_code=201)
def crear(data: DerechoIn, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "ingresos_marginales")
    if data.estado not in ESTADOS:
        raise HTTPException(status_code=400, detail=f"Estado inválido: {data.estado}")
    x = DerechoConstruccion(**data.model_dump())
    db.add(x); db.commit(); db.refresh(x)
    return x


@router.put("/{id}")
def editar(id: int, data: DerechoIn, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "ingresos_marginales")
    if data.estado not in ESTADOS:
        raise HTTPException(status_code=400, detail=f"Estado inválido: {data.estado}")
    x = db.query(DerechoConstruccion).filter(DerechoConstruccion.id == id).first()
    if not x:
        raise HTTPException(status_code=404, detail=f"Derecho {id} no encontrado")
    for k, v in data.model_dump().items():
        setattr(x, k, v)
    db.commit(); db.refresh(x)
    return x


@router.post("/{id}/liquidar")
def liquidar(id: int, data: LiquidarIn = LiquidarIn(),
             db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    """Liquida el derecho: importe = valor_obra * alícuota. Deja el estado en 'liquidado'."""
    _requiere(current_user, "ingresos_marginales")
    x = db.query(DerechoConstruccion).filter(DerechoConstruccion.id == id).first()
    if not x:
        raise HTTPException(status_code=404, detail=f"Derecho {id} no encontrado")
    alicuota = data.alicuota if data.alicuota is not None else ALICUOTA_DEFECTO
    x.importe = (x.valor_obra or Decimal("0")) * alicuota
    x.estado = "liquidado"
    db.commit(); db.refresh(x)
    return x


@router.delete("/{id}")
def eliminar(id: int, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "ingresos_marginales")
    x = db.query(DerechoConstruccion).filter(DerechoConstruccion.id == id).first()
    if not x:
        raise HTTPException(status_code=404, detail=f"Derecho {id} no encontrado")
    db.delete(x)
    db.commit()
    return {"message": f"Derecho {id} eliminado"}
