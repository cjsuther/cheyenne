from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class VehiculoCreate(BaseModel):
    id_cuenta: int
    dominio: str
    modelo: Optional[str] = None
    anio: Optional[int] = None
    numero_motor: Optional[str] = None
    numero_chasis: Optional[str] = None
    id_tipo_vehiculo: Optional[int] = None
    activo: bool = True


class VehiculoUpdate(BaseModel):
    id_cuenta: Optional[int] = None
    dominio: Optional[str] = None
    modelo: Optional[str] = None
    anio: Optional[int] = None
    numero_motor: Optional[str] = None
    numero_chasis: Optional[str] = None
    id_tipo_vehiculo: Optional[int] = None
    activo: Optional[bool] = None


class VehiculoResponse(BaseModel):
    id: int
    id_cuenta: int
    dominio: str
    modelo: Optional[str] = None
    anio: Optional[int] = None
    numero_motor: Optional[str] = None
    numero_chasis: Optional[str] = None
    id_tipo_vehiculo: Optional[int] = None
    fecha_alta: datetime
    fecha_baja: Optional[datetime] = None
    activo: bool

    class Config:
        from_attributes = True
