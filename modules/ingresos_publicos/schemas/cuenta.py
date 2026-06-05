from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class CuentaCreate(BaseModel):
    id_contribuyente: Optional[int] = None
    id_tipo_tributo: int
    id_estado_cuenta: int = 10
    numero_cuenta: str
    codigo_delegacion: Optional[str] = None
    activo: bool = True


class CuentaUpdate(BaseModel):
    id_contribuyente: Optional[int] = None
    id_tipo_tributo: Optional[int] = None
    id_estado_cuenta: Optional[int] = None
    numero_cuenta: Optional[str] = None
    codigo_delegacion: Optional[str] = None
    activo: Optional[bool] = None


class CuentaResponse(BaseModel):
    id: int
    id_contribuyente: Optional[int] = None
    id_tipo_tributo: int
    id_estado_cuenta: int
    numero_cuenta: str
    codigo_delegacion: Optional[str] = None
    fecha_alta: datetime
    fecha_baja: Optional[datetime] = None
    activo: bool

    class Config:
        from_attributes = True
