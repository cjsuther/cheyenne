from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class ExpedienteBase(BaseModel):
    matricula: Optional[str] = None
    ejercicio: int
    numero: int
    letra: Optional[str] = None
    id_tipo_expediente: Optional[int] = None
    subnumero: Optional[int] = None
    referencia_expediente: Optional[str] = None


class ExpedienteCreate(ExpedienteBase):
    pass


class ExpedienteUpdate(BaseModel):
    matricula: Optional[str] = None
    ejercicio: Optional[int] = None
    numero: Optional[int] = None
    letra: Optional[str] = None
    id_tipo_expediente: Optional[int] = None
    subnumero: Optional[int] = None
    referencia_expediente: Optional[str] = None


class ExpedienteResponse(ExpedienteBase):
    id: int
    fecha_creacion: Optional[datetime] = None

    class Config:
        from_attributes = True
