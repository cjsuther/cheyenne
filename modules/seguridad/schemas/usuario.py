from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime


class UsuarioBase(BaseModel):
    codigo: str
    nombre_apellido: str
    email: str
    id_tipo_usuario: int = 10
    id_estado_usuario: int = 10
    id_persona: Optional[int] = None


class UsuarioCreate(UsuarioBase):
    password: str


class UsuarioUpdate(BaseModel):
    nombre_apellido: Optional[str] = None
    email: Optional[str] = None
    id_tipo_usuario: Optional[int] = None
    id_estado_usuario: Optional[int] = None
    id_persona: Optional[int] = None
    password: Optional[str] = None


class PermisoResumen(BaseModel):
    codigo: str
    nombre: str
    sistema: str

    class Config:
        from_attributes = True


class PerfilResumen(BaseModel):
    id: int
    codigo: str
    nombre: str
    permisos: List[PermisoResumen] = []

    class Config:
        from_attributes = True


class UsuarioResponse(BaseModel):
    id: int
    codigo: str
    nombre_apellido: str
    email: str
    id_tipo_usuario: int
    id_estado_usuario: int
    id_persona: Optional[int] = None
    superuser: int = 0
    fecha_alta: datetime
    fecha_baja: Optional[datetime] = None
    perfiles: List[PerfilResumen] = []

    class Config:
        from_attributes = True


class UsuarioListResponse(BaseModel):
    id: int
    codigo: str
    nombre_apellido: str
    email: str
    id_tipo_usuario: int
    id_estado_usuario: int
    fecha_alta: datetime
    fecha_baja: Optional[datetime] = None

    class Config:
        from_attributes = True


class BindPerfilesRequest(BaseModel):
    perfil_ids: List[int]
