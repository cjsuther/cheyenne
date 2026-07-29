from typing import Optional
from datetime import datetime

from pydantic import BaseModel


class EventoCreate(BaseModel):
    modulo: Optional[str] = None
    metodo: Optional[str] = None
    path: Optional[str] = None
    status_code: Optional[int] = None
    id_usuario: Optional[int] = None
    usuario: Optional[str] = None
    ip: Optional[str] = None
    duracion_ms: Optional[int] = None


class EventoResponse(EventoCreate):
    id: int
    fecha: datetime
    hash: Optional[str] = None
    hash_anterior: Optional[str] = None

    class Config:
        from_attributes = True
