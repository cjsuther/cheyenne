from pydantic import BaseModel
from typing import Optional


class CajaBase(BaseModel):
    codigo: str
    nombre: str
    orden: int = 0
    id_dependencia: Optional[int] = None
    id_estado_caja: int
    id_usuario_actual: Optional[int] = None
    id_caja_asignacion_actual: Optional[int] = None
    id_recaudadora: Optional[int] = None


class CajaCreate(CajaBase):
    pass


class CajaUpdate(BaseModel):
    codigo: Optional[str] = None
    nombre: Optional[str] = None
    orden: Optional[int] = None
    id_dependencia: Optional[int] = None
    id_estado_caja: Optional[int] = None
    id_usuario_actual: Optional[int] = None
    id_caja_asignacion_actual: Optional[int] = None
    id_recaudadora: Optional[int] = None


class CajaResponse(CajaBase):
    id: int

    class Config:
        from_attributes = True
