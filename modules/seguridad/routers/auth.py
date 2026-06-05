from fastapi import APIRouter, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session

from database import get_db
from dependencies import get_current_user
from services.auth_service import AuthService
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
    return auth_service.authenticate(request.username, request.password)


@router.post("/refresh", response_model=TokenResponse)
def refresh_token(request: RefreshTokenRequest, db: Session = Depends(get_db)):
    auth_service = AuthService(db)
    return auth_service.refresh(request.refresh_token)


@router.get("/me", response_model=MeResponse)
def get_me(current_user: Usuario = Depends(get_current_user)):
    permisos_set = {}
    for perfil in current_user.perfiles:
        for permiso in perfil.permisos:
            if permiso.codigo not in permisos_set:
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


@router.post("/request-password-reset")
def request_password_reset(
    request: RequestPasswordResetRequest, db: Session = Depends(get_db)
):
    auth_service = AuthService(db)
    token = auth_service.request_password_reset(request.login)
    return {"message": "Solicitud de cambio de contraseña creada", "token": token}


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
