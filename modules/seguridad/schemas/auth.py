from pydantic import BaseModel
from typing import Optional, List


class LoginRequest(BaseModel):
    username: str
    password: str
    totp_code: Optional[str] = None


class TotpSetupResponse(BaseModel):
    secret: str
    otpauth_uri: str
    issuer: str
    account: str


class TotpCodeRequest(BaseModel):
    codigo: str


class TotpActivarResponse(BaseModel):
    habilitado: bool
    codigos_respaldo: List[str]
    mensaje: str


class TotpEstadoResponse(BaseModel):
    habilitado: bool
    configuracion_pendiente: bool
    codigos_respaldo_restantes: int


class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"


class RefreshTokenRequest(BaseModel):
    refresh_token: str


class PermisoInfo(BaseModel):
    codigo: str
    nombre: str
    sistema: str


class PerfilInfo(BaseModel):
    id: int
    codigo: str
    nombre: str


class MeResponse(BaseModel):
    id: int
    codigo: str
    nombre_apellido: str
    email: str
    superuser: int
    perfiles: List[PerfilInfo] = []
    permisos: List[PermisoInfo] = []


class ChangePasswordRequest(BaseModel):
    token: str
    new_password: str


class RequestPasswordResetRequest(BaseModel):
    login: str


class UpdateProfileRequest(BaseModel):
    nombre_apellido: Optional[str] = None
    email: Optional[str] = None


class ChangeOwnPasswordRequest(BaseModel):
    current_password: str
    new_password: str
