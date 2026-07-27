from pydantic import BaseModel
from typing import Optional


class CuentaCreate(BaseModel):
    id_contribuyente: Optional[int] = None
    id_tipo_tributo: int
    numero_cuenta: Optional[str] = None  # se autogenera si viene vacío
    id_estado_cuenta: int = 10


class CuentaResponse(BaseModel):
    id: int
    id_contribuyente: Optional[int] = None
    id_tipo_tributo: int
    numero_cuenta: str
    id_estado_cuenta: int
    activo: bool

    class Config:
        from_attributes = True
