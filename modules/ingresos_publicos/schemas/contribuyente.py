from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class ContribuyenteCreate(BaseModel):
    id_persona: int
    id_tipo_persona: int
    id_tipo_documento: int
    numero_documento: str
    activo: bool = True


class ContribuyenteUpdate(BaseModel):
    id_persona: Optional[int] = None
    id_tipo_persona: Optional[int] = None
    id_tipo_documento: Optional[int] = None
    numero_documento: Optional[str] = None
    activo: Optional[bool] = None


class ContribuyenteResponse(BaseModel):
    id: int
    id_persona: int
    id_tipo_persona: int
    id_tipo_documento: int
    numero_documento: str
    fecha_alta: datetime
    fecha_baja: Optional[datetime] = None
    activo: bool

    class Config:
        from_attributes = True


class ContribuyenteBusqueda(BaseModel):
    """Resultado del buscador 360: contribuyente + datos de su persona."""
    id: int
    id_persona: int
    id_tipo_persona: int
    numero_documento: str
    nombre: Optional[str] = None
    apellido: Optional[str] = None
    denominacion: Optional[str] = None
    nombre_completo: str
