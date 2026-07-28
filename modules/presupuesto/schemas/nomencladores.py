from typing import Optional
from pydantic import BaseModel


class NomencladorBase(BaseModel):
    codigo: str
    nombre: str
    activo: bool = True


class JurisdiccionCreate(NomencladorBase):
    tipo: Optional[str] = None


class ObjetoGastoCreate(NomencladorBase):
    detalle: Optional[str] = None


class FuenteCreate(NomencladorBase):
    detalle: Optional[str] = None
    origen: Optional[str] = None


class RubroCreate(NomencladorBase):
    caracter_economico: Optional[str] = None


class EstructuraCreate(BaseModel):
    codigo: str
    nombre: str
    id_jurisdiccion: Optional[int] = None
    tipo_programa: Optional[str] = None
    descripcion: Optional[str] = None
    activo: bool = True
