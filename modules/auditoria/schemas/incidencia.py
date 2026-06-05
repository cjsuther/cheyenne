from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class IncidenciaCreate(BaseModel):
    id_tipo_incidencia: int
    id_nivel_criticidad: int
    id_usuario: Optional[int] = None
    id_modulo: Optional[int] = None
    origen: Optional[str] = None
    mensaje: Optional[str] = None
    error_data: Optional[str] = None
    data: Optional[str] = None


class IncidenciaResponse(BaseModel):
    id: int
    token: Optional[str] = None
    id_tipo_incidencia: int
    id_nivel_criticidad: int
    id_usuario: Optional[int] = None
    fecha: datetime
    id_modulo: Optional[int] = None
    origen: Optional[str] = None
    mensaje: Optional[str] = None
    error_data: Optional[str] = None
    data: Optional[str] = None

    class Config:
        from_attributes = True


class IncidenciaFilter(BaseModel):
    id_tipo_incidencia: Optional[int] = None
    id_nivel_criticidad: Optional[int] = None
    fecha_desde: Optional[datetime] = None
    fecha_hasta: Optional[datetime] = None
