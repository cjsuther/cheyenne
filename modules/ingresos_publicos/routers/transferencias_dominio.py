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
from models.transferencia_dominio import TransferenciaDominio
from models.titular_cuenta import TitularCuenta
from models.cuenta import Cuenta

settings = get_settings()
get_current_user = create_auth_dependency(settings.seguridad_url)

router = APIRouter(prefix="/transferencias-dominio", tags=["Transferencia de dominio"])


def _requiere(cu, permiso):
    if cu.get("superuser"):
        return
    if permiso not in [p["codigo"] for p in cu.get("permisos", [])]:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=f"No tiene el permiso '{permiso}'")


class TransferenciaResponse(BaseModel):
    id: int
    id_cuenta: int
    id_contribuyente_origen: Optional[int] = None
    id_contribuyente_destino: int
    fecha: date
    acto: str
    id_titular_origen: Optional[int] = None
    id_titular_destino: Optional[int] = None
    observaciones: Optional[str] = None
    activo: bool
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class TransferenciaIn(BaseModel):
    id_cuenta: int
    id_contribuyente_destino: int
    id_contribuyente_origen: Optional[int] = None  # si no viene, se toma del titular activo
    fecha: Optional[date] = None
    acto: str
    porcentaje: Decimal = Decimal("100")
    tipo: str = "titular"
    observaciones: Optional[str] = None


@router.get("", response_model=List[TransferenciaResponse])
def listar_transferencias(
    request: Request,
    id_cuenta: Optional[int] = Query(None),
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=200),
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    _requiere(current_user, "ingresos_read")
    q = db.query(TransferenciaDominio).filter(TransferenciaDominio.activo == True)  # noqa: E712
    if id_cuenta is not None:
        q = q.filter(TransferenciaDominio.id_cuenta == id_cuenta)
    q = filtered_query(q, TransferenciaDominio, dict(request.query_params),
                       exclude={"skip", "limit", "id_cuenta"}, default_sort="id")
    return q.offset(skip).limit(limit).all()


@router.post("", response_model=TransferenciaResponse, status_code=201)
def transferir_dominio(
    data: TransferenciaIn,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    """Transfiere la titularidad de una cuenta a otro contribuyente.

    Circuito:
      1. Cierra la vigencia (`vigencia_hasta` = fecha) y desactiva el TitularCuenta 'titular'
         activo actual de la cuenta.
      2. Abre un nuevo TitularCuenta para el contribuyente destino (vigencia desde la fecha).
      3. Registra el movimiento TransferenciaDominio con el acto administrativo.

    Requiere el permiso `ingresos_transferir`.
    """
    _requiere(current_user, "ingresos_transferir")

    if not db.query(Cuenta).filter(Cuenta.id == data.id_cuenta).first():
        raise HTTPException(status_code=404, detail=f"Cuenta {data.id_cuenta} inexistente")

    fecha = data.fecha or datetime.now(timezone.utc).date()

    # 1. Titular activo actual (tipo 'titular') de la cuenta
    titular_actual = (
        db.query(TitularCuenta)
        .filter(
            TitularCuenta.id_cuenta == data.id_cuenta,
            TitularCuenta.activo == True,  # noqa: E712
            TitularCuenta.tipo == "titular",
        )
        .order_by(TitularCuenta.id.desc())
        .first()
    )

    id_origen = data.id_contribuyente_origen
    id_titular_origen = None
    if titular_actual:
        id_titular_origen = titular_actual.id
        if id_origen is None:
            id_origen = titular_actual.id_contribuyente
        if titular_actual.id_contribuyente == data.id_contribuyente_destino:
            raise HTTPException(status_code=409, detail="El contribuyente destino ya es el titular actual")
        titular_actual.vigencia_hasta = fecha
        titular_actual.activo = False

    # 2. Nuevo titular
    nuevo = TitularCuenta(
        id_cuenta=data.id_cuenta,
        id_contribuyente=data.id_contribuyente_destino,
        porcentaje=data.porcentaje,
        tipo=data.tipo,
        vigencia_desde=fecha,
        vigencia_hasta=None,
        activo=True,
    )
    db.add(nuevo)
    db.flush()  # obtener nuevo.id

    # 3. Movimiento de transferencia
    mov = TransferenciaDominio(
        id_cuenta=data.id_cuenta,
        id_contribuyente_origen=id_origen,
        id_contribuyente_destino=data.id_contribuyente_destino,
        fecha=fecha,
        acto=data.acto,
        id_titular_origen=id_titular_origen,
        id_titular_destino=nuevo.id,
        observaciones=data.observaciones,
        activo=True,
    )
    db.add(mov)
    db.commit()
    db.refresh(mov)
    return mov
