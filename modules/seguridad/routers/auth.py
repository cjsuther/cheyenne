from fastapi import APIRouter, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session

from database import get_db
from dependencies import get_current_user
from services.auth_service import AuthService
from services.password_service import PasswordService
from services.permiso_efectivo_service import PermisoEfectivoService
from schemas.auth import (
    LoginRequest,
    TokenResponse,
    RefreshTokenRequest,
    MeResponse,
    PerfilInfo,
    PermisoInfo,
    ChangePasswordRequest,
    RequestPasswordResetRequest,
    UpdateProfileRequest,
    ChangeOwnPasswordRequest,
)
from models.usuario import Usuario

router = APIRouter(prefix="/auth", tags=["Autenticación"])
security_scheme = HTTPBearer()


@router.post("/token", response_model=TokenResponse)
def login(request: LoginRequest, db: Session = Depends(get_db)):
    auth_service = AuthService(db)
    return auth_service.authenticate(request.username, request.password, request.totp_code)


@router.post("/refresh", response_model=TokenResponse)
def refresh_token(request: RefreshTokenRequest, db: Session = Depends(get_db)):
    auth_service = AuthService(db)
    return auth_service.refresh(request.refresh_token)


@router.get("/me", response_model=MeResponse)
def get_me(
    current_user: Usuario = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    efectivo = PermisoEfectivoService(db)
    permisos_set = {}
    for permiso in efectivo.permisos_efectivos(current_user):
        permisos_set[permiso.codigo] = PermisoInfo(
            codigo=permiso.codigo,
            nombre=permiso.nombre,
            sistema=permiso.sistema,
        )

    return MeResponse(
        id=current_user.id,
        codigo=current_user.codigo,
        nombre_apellido=current_user.nombre_apellido,
        email=current_user.email,
        superuser=current_user.superuser,
        perfiles=[
            PerfilInfo(id=p.id, codigo=p.codigo, nombre=p.nombre)
            for p in current_user.perfiles
        ],
        permisos=list(permisos_set.values()),
    )


@router.post("/logout")
def logout(
    credentials: HTTPAuthorizationCredentials = Depends(security_scheme),
    db: Session = Depends(get_db),
):
    auth_service = AuthService(db)
    auth_service.logout(credentials.credentials)
    return {"message": "Sesión cerrada"}


@router.post("/request-password-reset", status_code=status.HTTP_202_ACCEPTED)
def request_password_reset(
    request: RequestPasswordResetRequest, db: Session = Depends(get_db)
):
    auth_service = AuthService(db)
    auth_service.request_password_reset(request.login)
    # Respuesta generica: nunca revela si el usuario existe ni el token
    return {"message": "Si el usuario existe, se enviaron instrucciones por email"}


@router.post("/change-password")
def change_password(request: ChangePasswordRequest, db: Session = Depends(get_db)):
    auth_service = AuthService(db)
    auth_service.change_password(request.token, request.new_password)
    return {"message": "Contraseña actualizada"}


@router.put("/profile", response_model=MeResponse)
def update_profile(
    request: UpdateProfileRequest,
    current_user: Usuario = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    auth_service = AuthService(db)
    usuario = auth_service.update_profile(current_user, request.model_dump(exclude_unset=True))
    permisos_set = {}
    for perfil in usuario.perfiles:
        for permiso in perfil.permisos:
            if permiso.codigo not in permisos_set:
                permisos_set[permiso.codigo] = PermisoInfo(
                    codigo=permiso.codigo, nombre=permiso.nombre, sistema=permiso.sistema
                )
    return MeResponse(
        id=usuario.id,
        codigo=usuario.codigo,
        nombre_apellido=usuario.nombre_apellido,
        email=usuario.email,
        superuser=usuario.superuser,
        perfiles=[PerfilInfo(id=p.id, codigo=p.codigo, nombre=p.nombre) for p in usuario.perfiles],
        permisos=list(permisos_set.values()),
    )


@router.post("/change-own-password")
def change_own_password(
    request: ChangeOwnPasswordRequest,
    current_user: Usuario = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    auth_service = AuthService(db)
    auth_service.change_own_password(current_user, request.current_password, request.new_password)
    return {"message": "Contrasena actualizada"}


@router.get("/password-status")
def password_status(
    current_user: Usuario = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    pwd = PasswordService(db)
    return {
        "debe_cambiar": pwd.debe_cambiar(current_user),
        "dias_para_expirar": pwd.dias_para_expirar(current_user),
        "password_actualizado_en": current_user.password_actualizado_en,
        "dias_expiracion": pwd.settings.password_dias_expiracion,
    }


# ── Sesiones (revocacion / blacklist) ────────────────────────────────
@router.get("/sesiones")
def list_sesiones(
    credentials: HTTPAuthorizationCredentials = Depends(security_scheme),
    current_user: Usuario = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    auth_service = AuthService(db)
    return auth_service.list_sesiones(current_user, credentials.credentials)


@router.post("/sesiones/{sesion_id}/revocar")
def revocar_sesion(
    sesion_id: int,
    current_user: Usuario = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    auth_service = AuthService(db)
    return auth_service.revocar_sesion(current_user, sesion_id)
