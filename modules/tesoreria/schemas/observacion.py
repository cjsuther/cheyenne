from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class ObservacionCreate(BaseModel):
    entidad: str
    id_entidad: int
    detalle: str


class ObservacionResponse(BaseModel):
    id: int
    entidad: str
    id_entidad: int
    detalle: str
    id_usuario: Optional[int] = None
    fecha: datetime

    class Config:
        from_attributes = True
