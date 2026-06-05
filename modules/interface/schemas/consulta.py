from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class ConsultaCreate(BaseModel):
    id_tipo_consulta: int
    identificador: str
    datos_consulta: Optional[str] = None
    ip_origen: Optional[str] = None


class ConsultaResponse(BaseModel):
    id: int
    id_tipo_consulta: int
    identificador: str
    datos_consulta: Optional[str] = None
    datos_respuesta: Optional[str] = None
    id_estado_consulta: int
    fecha_consulta: datetime
    ip_origen: Optional[str] = None

    class Config:
        from_attributes = True
