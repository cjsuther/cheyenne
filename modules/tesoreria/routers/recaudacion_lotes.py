import sys
import os
from typing import List

from fastapi import APIRouter, Depends, Query, Body, HTTPException
from sqlalchemy.orm import Session
from starlette.requests import Request

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", ".."))
from shared.base_module import create_auth_dependency
from shared.filters import filtered_query

from database import get_db
from config import get_settings
from services.recaudacion_service import RecaudacionService
from models.recaudacion_lote import RecaudacionLote
from models.recaudacion import Recaudacion
from schemas.recaudacion_lote import RecaudacionLoteCreate, RecaudacionLoteUpdate, RecaudacionLoteResponse
from schemas.recaudacion import RecaudacionCreate, RecaudacionUpdate, RecaudacionResponse

import logging
import httpx

settings = get_settings()
get_current_user = create_auth_dependency(settings.seguridad_url)

logger = logging.getLogger("tesoreria.recaudacion")

router = APIRouter(prefix="/recaudacion-lotes", tags=["Recaudacion Lotes"])


def _impactar_deuda_en_emisiones(recaudacion, token: str) -> None:
    """Best-effort: avisa a emisiones para bajar la deuda del comprobante cobrado.
    Nunca interrumpe ni falla el registro de la recaudación (solo loguea)."""
    numero = getattr(recaudacion, "numero_comprobante", None)
    importe = getattr(recaudacion, "importe_cobro", None)
    if not numero or importe is None:
        return
    fecha = getattr(recaudacion, "fecha_cobro", None)
    payload = {
        "numero_comprobante": numero,
        "importe": float(importe),
        "fecha_pago": fecha.date().isoformat() if fecha else None,
        "origen": "tesoreria",
    }
    headers = {"Authorization": token} if token else {}
    try:
        with httpx.Client(timeout=10) as client:
            resp = client.post(
                f"{settings.emisiones_url}/emisiones/cuenta-corriente/pagar-por-comprobante",
                json=payload, headers=headers,
            )
        if resp.status_code >= 400:
            logger.warning("emisiones rechazó el impacto de %s: HTTP %s %s",
                           numero, resp.status_code, resp.text[:200])
    except Exception as e:  # red caída, timeout, etc.
        logger.warning("No se pudo impactar la deuda en emisiones para %s: %s", numero, e)


@router.get("", response_model=List[RecaudacionLoteResponse])
def list_lotes(
    request: Request,
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    query = db.query(RecaudacionLote)
    query = filtered_query(query, RecaudacionLote, dict(request.query_params), exclude={'skip', 'limit'})
    return query.offset(skip).limit(limit).all()


@router.get("/{id}", response_model=RecaudacionLoteResponse)
def get_lote(
    id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    service = RecaudacionService(db)
    return service.find_lote_by_id(id)


@router.post("", response_model=RecaudacionLoteResponse, status_code=201)
def create_lote(
    data: RecaudacionLoteCreate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    service = RecaudacionService(db)
    return service.add_lote(data.model_dump())


@router.put("/{id}", response_model=RecaudacionLoteResponse)
def update_lote(
    id: int,
    data: RecaudacionLoteUpdate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    service = RecaudacionService(db)
    return service.modify_lote(id, data.model_dump(exclude_unset=True))


@router.delete("/{id}")
def delete_lote(
    id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    service = RecaudacionService(db)
    service.remove_lote(id)
    return {"message": f"RecaudacionLote {id} eliminado"}


@router.post("/cobro-externo", status_code=201)
def registrar_cobro_externo(
    request: Request,
    data: dict = Body(...),
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    """Registra un cobro externo (p. ej. autogestión WAV) como recaudación en un lote diario;
    impacta la deuda de emisiones si viene numero_comprobante."""
    importe = data.get("importe")
    if importe is None:
        raise HTTPException(status_code=400, detail="importe es obligatorio")
    from datetime import datetime
    fecha = data.get("fecha_cobro")
    if isinstance(fecha, str) and fecha:
        try:
            fecha = datetime.fromisoformat(fecha.replace("Z", "+00:00"))
        except ValueError:
            fecha = None
    else:
        fecha = None
    rec = RecaudacionService(db).registrar_cobro_externo(
        importe=importe,
        numero_cuenta=data.get("numero_cuenta"),
        numero_comprobante=data.get("numero_comprobante"),
        codigo_tipo_tributo=data.get("codigo_tipo_tributo"),
        fecha_cobro=fecha,
    )
    _impactar_deuda_en_emisiones(rec, request.headers.get("authorization"))
    return {"id": rec.id, "id_recaudacion_lote": rec.id_recaudacion_lote, "importe_cobro": float(rec.importe_cobro)}


@router.get("/{id_lote}/recaudaciones", response_model=List[RecaudacionResponse])
def list_recaudaciones(
    request: Request,
    id_lote: int,
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    query = db.query(Recaudacion).filter(Recaudacion.id_recaudacion_lote == id_lote)
    query = filtered_query(query, Recaudacion, dict(request.query_params), exclude={'skip', 'limit', 'id_lote'})
    return query.offset(skip).limit(limit).all()


@router.post("/{id_lote}/recaudaciones", response_model=RecaudacionResponse, status_code=201)
def create_recaudacion(
    id_lote: int,
    data: RecaudacionCreate,
    request: Request,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    service = RecaudacionService(db)
    recaudacion_data = data.model_dump()
    recaudacion_data["id_recaudacion_lote"] = id_lote
    recaudacion = service.add_recaudacion(recaudacion_data)
    # integración: el cobro impacta la cuenta corriente de emisiones (HTTP, no bloqueante)
    _impactar_deuda_en_emisiones(recaudacion, request.headers.get("authorization"))
    return recaudacion


@router.put("/recaudaciones/{id}", response_model=RecaudacionResponse)
def update_recaudacion(
    id: int,
    data: RecaudacionUpdate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    service = RecaudacionService(db)
    return service.modify_recaudacion(id, data.model_dump(exclude_unset=True))


@router.delete("/recaudaciones/{id}")
def delete_recaudacion(
    id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    service = RecaudacionService(db)
    service.remove_recaudacion(id)
    return {"message": f"Recaudacion {id} eliminada"}
