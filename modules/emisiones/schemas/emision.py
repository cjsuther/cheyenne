from pydantic import BaseModel
from typing import Optional, List, Any
from datetime import datetime
from decimal import Decimal


class ParametrosCalculo(BaseModel):
    tipo_tributo: str
    periodo: str
    alicuota: Optional[Decimal] = None
    base_imponible_minima: Optional[Decimal] = None
    bonificacion_porcentaje: Optional[Decimal] = None
    recargo_porcentaje: Optional[Decimal] = None
    fecha_vencimiento_1: Optional[datetime] = None
    fecha_vencimiento_2: Optional[datetime] = None
    parametros_adicionales: Optional[dict] = None


class EmisionBase(BaseModel):
    tipo_tributo: str
    periodo: str
    ttas_tasa: Optional[int] = None
    ttas_subtasa: Optional[int] = 0
    variables_default: Optional[Any] = None
    descripcion: Optional[str] = None
    fecha_vencimiento_1: Optional[datetime] = None
    fecha_vencimiento_2: Optional[datetime] = None
    numero: Optional[str] = None
    codigo_delegacion: Optional[str] = None
    id_numeracion: Optional[int] = None
    id_procedimiento: Optional[int] = None
    id_emision_base: Optional[int] = None
    procesa_planes: bool = False
    procesa_rubros: bool = False
    procesa_elementos: bool = False
    calculo_mostrador_web: bool = False
    calculo_masivo: bool = False
    calculo_pago_anticipado: bool = False
    calculo_prueba: bool = False
    imprime_recibos: bool = False
    aplica_debito_automatico: bool = False
    fecha_reliquidacion_desde: Optional[datetime] = None
    fecha_reliquidacion_hasta: Optional[datetime] = None
    modulo: Optional[str] = None
    parametros: Optional[dict] = None


class EmisionCreate(EmisionBase):
    pass


class EmisionUpdate(BaseModel):
    tipo_tributo: Optional[str] = None
    periodo: Optional[str] = None
    descripcion: Optional[str] = None
    fecha_vencimiento_1: Optional[datetime] = None
    fecha_vencimiento_2: Optional[datetime] = None
    numero: Optional[str] = None
    codigo_delegacion: Optional[str] = None
    id_numeracion: Optional[int] = None
    id_procedimiento: Optional[int] = None
    id_emision_base: Optional[int] = None
    procesa_planes: Optional[bool] = None
    procesa_rubros: Optional[bool] = None
    procesa_elementos: Optional[bool] = None
    calculo_mostrador_web: Optional[bool] = None
    calculo_masivo: Optional[bool] = None
    calculo_pago_anticipado: Optional[bool] = None
    calculo_prueba: Optional[bool] = None
    imprime_recibos: Optional[bool] = None
    aplica_debito_automatico: Optional[bool] = None
    fecha_reliquidacion_desde: Optional[datetime] = None
    fecha_reliquidacion_hasta: Optional[datetime] = None
    modulo: Optional[str] = None
    parametros: Optional[dict] = None
    activo: Optional[bool] = None


class AprobacionRequest(BaseModel):
    aprobado: bool
    observaciones: Optional[str] = None


class EmisionResponse(EmisionBase):
    id: int
    estado: str
    paso_actual: int
    id_usuario_creador: Optional[int] = None
    id_usuario_aprobador: Optional[int] = None
    fecha_emision: Optional[datetime] = None
    fecha_aprobacion: Optional[datetime] = None
    observaciones_aprobacion: Optional[str] = None
    cantidad_contribuyentes: Optional[int] = 0
    monto_total: Optional[Decimal] = None
    fecha_ejecucion_inicio: Optional[datetime] = None
    fecha_ejecucion_fin: Optional[datetime] = None
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None
    activo: bool = True

    class Config:
        from_attributes = True


class EmisionListResponse(BaseModel):
    items: List[EmisionResponse]
    total: int
    skip: int
    limit: int
