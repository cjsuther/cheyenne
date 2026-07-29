from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database import get_db
from dependencies import get_current_user
from services.totp_service import TotpService
from schemas.auth import (
    TotpSetupResponse,
    TotpCodeRequest,
    TotpActivarResponse,
    TotpEstadoResponse,
)
from models.usuario import Usuario

router = APIRouter(prefix="/2fa", tags=["2FA"])


@router.get("/estado", response_model=TotpEstadoResponse)
def estado_2fa(
    current_user: Usuario = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return TotpService(db).estado(current_user)


@router.post("/setup", response_model=TotpSetupResponse)
def setup_2fa(
    current_user: Usuario = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Genera un secret TOTP para el usuario actual (sin habilitar aun)."""
    return TotpService(db).setup(current_user)


@router.post("/activar", response_model=TotpActivarResponse)
def activar_2fa(
    request: TotpCodeRequest,
    current_user: Usuario = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Valida el codigo de 6 digitos y habilita 2FA. Devuelve codigos de respaldo."""
    return TotpService(db).activar(current_user, request.codigo)


@router.post("/verificar")
def verificar_2fa(
    request: TotpCodeRequest,
    current_user: Usuario = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Valida un codigo TOTP o de respaldo del usuario actual."""
    valido = TotpService(db).verificar(current_user, request.codigo)
    return {"valido": valido}


@router.post("/desactivar")
def desactivar_2fa(
    request: TotpCodeRequest,
    current_user: Usuario = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Desactiva 2FA. Requiere un codigo TOTP o de respaldo valido."""
    return TotpService(db).desactivar(current_user, request.codigo)
