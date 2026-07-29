import sys
import os
from typing import List, Optional
from datetime import date, datetime, timedelta

from pydantic import BaseModel
from fastapi import APIRouter, Depends, Query, HTTPException, status
from sqlalchemy.orm import Session
from starlette.requests import Request

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", ".."))
from shared.base_module import create_auth_dependency
from shared.filters import filtered_query

from database import get_db
from config import get_settings
from models.certificado import Certificado
from models.cuenta import Cuenta
from services.deuda_client import deuda_por_contribuyente, resumen_deuda

settings = get_settings()
get_current_user = create_auth_dependency(settings.seguridad_url)

router = APIRouter(prefix="/certificados", tags=["Certificados"])

TIPO_CERT_LIBRE_DEUDA = 20  # tipo de certificado "libre deuda"


def _requiere(cu, permiso):
    if cu.get("superuser"):
        return
    if permiso not in [p["codigo"] for p in cu.get("permisos", [])]:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail=f"No tiene el permiso '{permiso}'")


class LibreDeudaRequest(BaseModel):
    id_cuenta: Optional[int] = None
    id_contribuyente: Optional[int] = None
    dias_validez: int = 30


class CertificadoCreate(BaseModel):
    id_cuenta: Optional[int] = None
    id_tipo_certificado: int
    numero_certificado: Optional[str] = None
    fecha_vencimiento: Optional[date] = None
    id_estado_certificado: int = 10
    detalle: Optional[str] = None
    id_usuario: Optional[int] = None


class CertificadoUpdate(BaseModel):
    id_cuenta: Optional[int] = None
    id_tipo_certificado: Optional[int] = None
    numero_certificado: Optional[str] = None
    fecha_vencimiento: Optional[date] = None
    id_estado_certificado: Optional[int] = None
    detalle: Optional[str] = None
    id_usuario: Optional[int] = None


class CertificadoResponse(BaseModel):
    id: int
    id_cuenta: Optional[int] = None
    id_tipo_certificado: int
    numero_certificado: Optional[str] = None
    fecha_emision: datetime
    fecha_vencimiento: Optional[date] = None
    id_estado_certificado: int
    detalle: Optional[str] = None
    id_usuario: Optional[int] = None

    class Config:
        from_attributes = True


@router.post("/libre-deuda")
def emitir_libre_deuda(
    data: LibreDeudaRequest,
    request: Request,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    """Certificado de libre deuda REAL.

    Resuelve el contribuyente (por cuenta o directo), consulta la deuda a `emisiones` por
    HTTP (reenviando el token) y:
      - si hay saldo impago -> NO emite y devuelve el detalle de la deuda (409).
      - si está al día -> emite el certificado (número + validez) y lo persiste.
    """
    _requiere(current_user, "ingresos_certificados")

    id_cuenta = data.id_cuenta
    id_contribuyente = data.id_contribuyente
    if id_cuenta is None and id_contribuyente is None:
        raise HTTPException(status_code=400, detail="Indique id_cuenta o id_contribuyente")

    if id_contribuyente is None:
        cuenta = db.query(Cuenta).filter(Cuenta.id == id_cuenta).first()
        if not cuenta:
            raise HTTPException(status_code=404, detail=f"Cuenta {id_cuenta} inexistente")
        id_contribuyente = cuenta.id_contribuyente
        if id_contribuyente is None:
            raise HTTPException(status_code=400, detail="La cuenta no tiene contribuyente asociado")

    token = request.headers.get("authorization")
    items = deuda_por_contribuyente(id_contribuyente, token)
    resumen = resumen_deuda(items)

    if resumen["total_deuda"] > 0:
        return {
            "emitido": False,
            "motivo": "El contribuyente/cuenta registra deuda impaga",
            "id_cuenta": id_cuenta,
            "id_contribuyente": id_contribuyente,
            **resumen,
        }

    hoy = date.today()
    numero = f"LD-{hoy.strftime('%Y%m%d')}-{id_contribuyente}"
    cert = Certificado(
        id_cuenta=id_cuenta,
        id_tipo_certificado=TIPO_CERT_LIBRE_DEUDA,
        numero_certificado=numero,
        fecha_vencimiento=hoy + timedelta(days=max(1, data.dias_validez)),
        id_estado_certificado=10,
        detalle=f"Libre deuda del contribuyente {id_contribuyente} (sin deuda a la fecha)",
        id_usuario=current_user.get("id"),
    )
    db.add(cert); db.commit(); db.refresh(cert)
    return {
        "emitido": True,
        "id_certificado": cert.id,
        "numero_certificado": cert.numero_certificado,
        "fecha_emision": cert.fecha_emision,
        "fecha_vencimiento": cert.fecha_vencimiento,
        "id_cuenta": id_cuenta,
        "id_contribuyente": id_contribuyente,
        "total_deuda": 0.0,
    }


@router.get("", response_model=List[CertificadoResponse])
def list_certificados(
    request: Request,
    skip: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    id_cuenta: Optional[int] = Query(None),
    id_tipo_certificado: Optional[int] = Query(None),
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    query = db.query(Certificado)
    if id_cuenta is not None:
        query = query.filter(Certificado.id_cuenta == id_cuenta)
    if id_tipo_certificado is not None:
        query = query.filter(Certificado.id_tipo_certificado == id_tipo_certificado)
    query = filtered_query(query, Certificado, dict(request.query_params), exclude={'skip', 'limit', 'id_cuenta', 'id_tipo_certificado'})
    return query.offset(skip).limit(limit).all()


@router.get("/{id}", response_model=CertificadoResponse)
def get_certificado(
    id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    certificado = db.query(Certificado).filter(Certificado.id == id).first()
    if not certificado:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Certificado {id} no encontrado",
        )
    return certificado


@router.post("", response_model=CertificadoResponse, status_code=201)
def create_certificado(
    data: CertificadoCreate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    certificado = Certificado(**data.model_dump())
    db.add(certificado)
    db.commit()
    db.refresh(certificado)
    return certificado


@router.put("/{id}", response_model=CertificadoResponse)
def update_certificado(
    id: int,
    data: CertificadoUpdate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    certificado = db.query(Certificado).filter(Certificado.id == id).first()
    if not certificado:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Certificado {id} no encontrado",
        )
    for key, value in data.model_dump(exclude_unset=True).items():
        if value is not None:
            setattr(certificado, key, value)
    db.commit()
    db.refresh(certificado)
    return certificado


@router.delete("/{id}")
def delete_certificado(
    id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    certificado = db.query(Certificado).filter(Certificado.id == id).first()
    if not certificado:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Certificado {id} no encontrado",
        )
    certificado.id_estado_certificado = 90  # Anulado
    db.commit()
    return {"message": f"Certificado {id} anulado"}
