from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class MensajeCreate(BaseModel):
    id_tipo_mensaje: int
    id_canal: int
    id_prioridad: int
    identificador: str
    titulo: str
    cuerpo: str


class MensajeUpdate(BaseModel):
    id_tipo_mensaje: Optional[int] = None
    id_canal: Optional[int] = None
    id_prioridad: Optional[int] = None
    id_estado_mensaje: Optional[int] = None
    identificador: Optional[str] = None
    titulo: Optional[str] = None
    cuerpo: Optional[str] = None


class MensajeResponse(BaseModel):
    id: int
    id_tipo_mensaje: int
    id_estado_mensaje: int
    id_canal: int
    id_prioridad: int
    identificador: str
    titulo: str
    cuerpo: str
    id_usuario_creacion: Optional[int] = None
    fecha_creacion: datetime
    fecha_recepcion: Optional[datetime] = None
    fecha_envio: Optional[datetime] = None

    class Config:
        from_attributes = True


class MensajeFilter(BaseModel):
    id_tipo_mensaje: Optional[int] = None
    id_estado_mensaje: Optional[int] = None
    id_canal: Optional[int] = None
