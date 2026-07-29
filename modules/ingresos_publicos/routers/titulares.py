import sys
import os
from typing import List, Optional
from datetime import date, datetime
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
from models.titular_cuenta import TitularCuenta
from models.cuenta import Cuenta

settings = get_settings()
get_current_user = create_auth_dependency(settings.seguridad_url)

router = APIRouter(prefix="/titulares", tags=["Titulares / Condominio"])

TIPOS_TITULAR = {"titular", "condomino", "poseedor"}


def _requiere(cu, permiso):
    if cu.get("superuser"):
        return
    if permiso not in [p["codigo"] for p in cu.get("permisos", [])]:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=f"No tiene el permiso '{permiso}'")


class TitularCreate(BaseModel):
    id_cuenta: int
    id_contribuyente: int
    porcentaje: Decimal = Decimal("100")
    tipo: str = "titular"
    vigencia_desde: Optional[date] = None
    vigencia_hasta: Optional[date] = None
    activo: bool = True


class TitularUpdate(BaseModel):
    id_contribuyente: Optional[int] = None
    porcentaje: Optional[Decimal] = None
    tipo: Optional[str] = None
    vigencia_desde: Optional[date] = None
    vigencia_hasta: Optional[date] = None
    activo: Optional[bool] = None


class TitularResponse(BaseModel):
    id: int
    id_cuenta: int
    id_contribuyente: int
    porcentaje: Decimal
    tipo: str
    vigencia_desde: Optional[date] = None
    vigencia_hasta: Optional[date] = None
    activo: bool
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


def _valida_tipo(tipo: Optional[str]):
    if tipo is not None and tipo not in TIPOS_TITULAR:
        raise HTTPException(status_code=400, detail=f"tipo debe ser uno de {sorted(TIPOS_TITULAR)}")


@router.get("/by-cuenta/{id_cuenta}", response_model=List[TitularResponse])
def list_titulares_by_cuenta(
    id_cuenta: int,
    solo_activos: bool = Query(True),
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    """Titulares/condóminos de una cuenta (varios, con % de participación)."""
    q = db.query(TitularCuenta).filter(TitularCuenta.id_cuenta == id_cuenta)
    if solo_activos:
        q = q.filter(TitularCuenta.activo == True)  # noqa: E712
    return q.order_by(TitularCuenta.id).all()


@router.get("", response_model=List[TitularResponse])
def list_titulares(
    request: Request,
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=200),
    id_cuenta: Optional[int] = Query(None),
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    query = db.query(TitularCuenta)
    if id_cuenta is not None:
        query = query.filter(TitularCuenta.id_cuenta == id_cuenta)
    query = filtered_query(query, TitularCuenta, dict(request.query_params),
                           exclude={"skip", "limit", "id_cuenta"}, default_sort="id")
    return query.offset(skip).limit(limit).all()


@router.get("/{id}", response_model=TitularResponse)
def get_titular(id: int, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    x = db.query(TitularCuenta).filter(TitularCuenta.id == id).first()
    if not x:
        raise HTTPException(status_code=404, detail=f"Titular {id} no encontrado")
    return x


@router.post("", response_model=TitularResponse, status_code=201)
def create_titular(data: TitularCreate, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "ingresos_write")
    _valida_tipo(data.tipo)
    if not db.query(Cuenta).filter(Cuenta.id == data.id_cuenta).first():
        raise HTTPException(status_code=404, detail=f"Cuenta {data.id_cuenta} inexistente")
    x = TitularCuenta(**data.model_dump())
    db.add(x); db.commit(); db.refresh(x)
    return x


@router.put("/{id}", response_model=TitularResponse)
def update_titular(id: int, data: TitularUpdate, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "ingresos_write")
    _valida_tipo(data.tipo)
    x = db.query(TitularCuenta).filter(TitularCuenta.id == id).first()
    if not x:
        raise HTTPException(status_code=404, detail=f"Titular {id} no encontrado")
    for k, v in data.model_dump(exclude_unset=True).items():
        setattr(x, k, v)
    db.commit(); db.refresh(x)
    return x


@router.delete("/{id}")
def delete_titular(id: int, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    _requiere(current_user, "ingresos_write")
    x = db.query(TitularCuenta).filter(TitularCuenta.id == id).first()
    if not x:
        raise HTTPException(status_code=404, detail=f"Titular {id} no encontrado")
    x.activo = False; db.commit()
    return {"message": f"Titular {id} dado de baja"}
