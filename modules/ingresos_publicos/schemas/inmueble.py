from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class InmuebleCreate(BaseModel):
    id_cuenta: int
    circuito: Optional[str] = None
    sector: Optional[str] = None
    fraccion: Optional[str] = None
    parcela: Optional[str] = None
    id_estado_carga: Optional[int] = None
    activo: bool = True


class InmuebleUpdate(BaseModel):
    id_cuenta: Optional[int] = None
    circuito: Optional[str] = None
    sector: Optional[str] = None
    fraccion: Optional[str] = None
    parcela: Optional[str] = None
    id_estado_carga: Optional[int] = None
    activo: Optional[bool] = None


class InmuebleResponse(BaseModel):
    id: int
    id_cuenta: int
    circuito: Optional[str] = None
    sector: Optional[str] = None
    fraccion: Optional[str] = None
    parcela: Optional[str] = None
    id_estado_carga: Optional[int] = None
    fecha_alta: datetime
    activo: bool

    class Config:
        from_attributes = True
