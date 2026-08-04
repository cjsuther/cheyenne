from datetime import datetime
from typing import Optional, List

from pydantic import BaseModel, ConfigDict


class DocumentoCreate(BaseModel):
    """Alta de un documento para firmar; la llaman otros módulos (idempotente por origen)."""
    origen_modulo: str
    origen_tipo: str
    origen_ref: str
    titulo: str
    descripcion: Optional[str] = None
    archivo_nombre: Optional[str] = None
    contenido_hash: Optional[str] = None
    cantidad_firmas: int = 1
    id_oficina: Optional[int] = None


class FirmarRequest(BaseModel):
    computadora: Optional[str] = None


class FirmaResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    id_documento: int
    orden_firma: int
    id_usuario: int
    firmante_nombre: str
    firmante_documento: Optional[str] = None
    computadora: Optional[str] = None
    fecha_hora: datetime
    hash_firma: str
    estado: str


class DocumentoFirmableResponse(BaseModel):
    model_config = ConfigDict(from_attributes=True)
    id: int
    origen_modulo: str
    origen_tipo: str
    origen_ref: str
    titulo: str
    descripcion: Optional[str] = None
    archivo_nombre: Optional[str] = None
    contenido_hash: Optional[str] = None
    cantidad_firmas: int
    id_oficina: Optional[int] = None
    id_usuario_creador: Optional[int] = None
    estado: str
    created_at: Optional[datetime] = None
    activo: bool
    firmas: List[FirmaResponse] = []
