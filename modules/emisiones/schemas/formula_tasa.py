from typing import Optional, Dict, Any
from datetime import date

from pydantic import BaseModel


class FormulaTasaBase(BaseModel):
    tipo_tributo: Optional[str] = None
    ttas_tasa: int
    ttas_subtasa: int = 0
    fort_numero: int = 1
    fort_orden: int = 0
    fort_descripcion: Optional[str] = None
    fort_condicion: Optional[str] = None
    fort_acumulador_condicion: Optional[str] = None
    fort_a_cancelar_1: Optional[str] = None
    fort_a_pagar_1: Optional[str] = None
    fort_a_cancelar_2: Optional[str] = None
    fort_a_pagar_2: Optional[str] = None
    fort_a_cancelar_3: Optional[str] = None
    fort_a_pagar_3: Optional[str] = None
    fort_a_cancelar_4: Optional[str] = None
    fort_a_pagar_4: Optional[str] = None
    fecha_desde: Optional[date] = None
    fecha_hasta: Optional[date] = None
    activo: bool = True


class FormulaTasaCreate(FormulaTasaBase):
    pass


class FormulaTasaUpdate(BaseModel):
    tipo_tributo: Optional[str] = None
    ttas_tasa: Optional[int] = None
    ttas_subtasa: Optional[int] = None
    fort_numero: Optional[int] = None
    fort_orden: Optional[int] = None
    fort_descripcion: Optional[str] = None
    fort_condicion: Optional[str] = None
    fort_acumulador_condicion: Optional[str] = None
    fort_a_cancelar_1: Optional[str] = None
    fort_a_pagar_1: Optional[str] = None
    fort_a_cancelar_2: Optional[str] = None
    fort_a_pagar_2: Optional[str] = None
    fort_a_cancelar_3: Optional[str] = None
    fort_a_pagar_3: Optional[str] = None
    fort_a_cancelar_4: Optional[str] = None
    fort_a_pagar_4: Optional[str] = None
    fecha_desde: Optional[date] = None
    fecha_hasta: Optional[date] = None
    activo: Optional[bool] = None


class FormulaTasaResponse(FormulaTasaBase):
    id: int

    class Config:
        from_attributes = True


class ProbarFormulaRequest(BaseModel):
    formula: str
    condicion: Optional[str] = None
    periodo: int = 2026
    mes: int = 12
    datos_calculo: Dict[str, Any] = {}


class ProbarFormulaResponse(BaseModel):
    aplica: bool
    resultado: Optional[float] = None
    error: Optional[str] = None
