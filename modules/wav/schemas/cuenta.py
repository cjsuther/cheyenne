from pydantic import BaseModel
from typing import Optional


class CuentaResponse(BaseModel):
    id: int
    id_contribuyente: Optional[int] = None
    id_tipo_tributo: int
    numero_cuenta: str
    id_estado_cuenta: int
    activo: bool

    class Config:
        from_attributes = True
