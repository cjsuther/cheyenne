from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class PadronResponse(BaseModel):
    id: int
    id_emision: int
    tipo_tributo: str
    nombre: str
    descripcion: Optional[str] = None
    cantidad_registros: Optional[int] = 0
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    activo: bool = True

    class Config:
        from_attributes = True


class ContribuyentePadronResponse(BaseModel):
    id: int
    id_padron: int
    id_contribuyente: int
    id_objeto_imponible: Optional[int] = None
    numero_documento: Optional[str] = None
    nombre_contribuyente: Optional[str] = None
    partida: Optional[str] = None
    categoria: Optional[str] = None
    zona: Optional[str] = None
    estado: str
    created_at: Optional[datetime] = None
    activo: bool = True

    class Config:
        from_attributes = True
