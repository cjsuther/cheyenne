from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class ObservacionBase(BaseModel):
    entidad: str
    id_entidad: int
    detalle: str


class ObservacionCreate(ObservacionBase):
    pass


class ObservacionUpdate(BaseModel):
    detalle: Optional[str] = None


class ObservacionResponse(ObservacionBase):
    id: int
    id_usuario: Optional[int] = None
    fecha: Optional[datetime] = None

    class Config:
        from_attributes = True
