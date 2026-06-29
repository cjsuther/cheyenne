from sqlalchemy import Column, BigInteger, Integer, String, DateTime, Numeric, Boolean
from sqlalchemy.sql import func

import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", ".."))
from shared.database import Base


class VehiculoValuacion(Base):
    """Valuación de un vehículo por código de modelo y año (port de `ValuacionesCodigosDNRPA`).

    Es un **catálogo** (no por vehículo): la patente se calcula sobre el valor del modelo/año.
    El padrón cruza el `codigo_modelo` + `anio` del vehículo con este catálogo y expone
    `@V_VALUACION`.
    """

    __tablename__ = "ingresos_publicos_vehiculo_valuaciones"

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    codigo_modelo = Column(String(50), nullable=False, index=True)
    anio = Column(Integer, nullable=False)
    ejercicio = Column(Integer, nullable=True)
    valor = Column(Numeric(18, 2), nullable=False, default=0)
    activo = Column(Boolean, nullable=False, default=True)
    fecha_alta = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
