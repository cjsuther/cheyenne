from pydantic import BaseModel
from typing import Optional


class DireccionBase(BaseModel):
    entidad: str
    id_entidad: int
    id_pais: Optional[int] = None
    id_provincia: Optional[int] = None
    id_localidad: Optional[int] = None
    codigo_postal: Optional[str] = None
    calle: str
    altura: Optional[str] = None
    piso: Optional[str] = None
    dpto: Optional[str] = None
    referencia: Optional[str] = None
    longitud: Optional[float] = None
    latitud: Optional[float] = None


class DireccionCreate(DireccionBase):
    pass


class DireccionUpdate(BaseModel):
    id_pais: Optional[int] = None
    id_provincia: Optional[int] = None
    id_localidad: Optional[int] = None
    codigo_postal: Optional[str] = None
    calle: Optional[str] = None
    altura: Optional[str] = None
    piso: Optional[str] = None
    dpto: Optional[str] = None
    referencia: Optional[str] = None
    longitud: Optional[float] = None
    latitud: Optional[float] = None


class DireccionResponse(DireccionBase):
    id: int

    class Config:
        from_attributes = True
