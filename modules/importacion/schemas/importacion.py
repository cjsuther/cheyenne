from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class ImportacionLoteCreate(BaseModel):
    id_tipo_importacion: int
    nombre_archivo: str
    path_archivo: str
    id_usuario: Optional[int] = None


class ImportacionLoteResponse(BaseModel):
    id: int
    id_tipo_importacion: int
    nombre_archivo: str
    path_archivo: str
    id_estado_importacion: int
    casos_total: int
    casos_procesados: int
    casos_error: int
    id_usuario: Optional[int] = None
    fecha_inicio: datetime
    fecha_fin: Optional[datetime] = None
    detalle_error: Optional[str] = None

    class Config:
        from_attributes = True


class ImportacionDetalleResponse(BaseModel):
    id: int
    id_importacion_lote: int
    numero_linea: int
    datos_originales: str
    id_estado_detalle: int
    detalle_error: Optional[str] = None
    fecha_proceso: Optional[datetime] = None

    class Config:
        from_attributes = True


class ExportacionLoteCreate(BaseModel):
    id_tipo_exportacion: int
    nombre_archivo: str
    path_archivo: Optional[str] = None
    id_usuario: Optional[int] = None


class ExportacionLoteResponse(BaseModel):
    id: int
    id_tipo_exportacion: int
    nombre_archivo: str
    path_archivo: Optional[str] = None
    id_estado_exportacion: int
    casos: int
    id_usuario: Optional[int] = None
    fecha_creacion: datetime

    class Config:
        from_attributes = True
