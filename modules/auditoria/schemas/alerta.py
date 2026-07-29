from typing import Optional
from datetime import datetime

from pydantic import BaseModel


class ReglaAlertaBase(BaseModel):
    codigo: str
    descripcion: Optional[str] = None
    condicion: str  # login_fallido | borrado_masivo | error_5xx | permiso_denegado
    umbral: int = 5
    ventana_minutos: int = 10
    canal: str = "email"
    activo: bool = True


class ReglaAlertaCreate(ReglaAlertaBase):
    pass


class ReglaAlertaUpdate(BaseModel):
    codigo: Optional[str] = None
    descripcion: Optional[str] = None
    condicion: Optional[str] = None
    umbral: Optional[int] = None
    ventana_minutos: Optional[int] = None
    canal: Optional[str] = None
    activo: Optional[bool] = None


class ReglaAlertaResponse(ReglaAlertaBase):
    id: int
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class AlertaDisparadaResponse(BaseModel):
    id: int
    id_regla: int
    codigo_regla: Optional[str] = None
    condicion: Optional[str] = None
    fecha: datetime
    detalle: Optional[str] = None
    cantidad: int
    notificado: bool

    class Config:
        from_attributes = True
