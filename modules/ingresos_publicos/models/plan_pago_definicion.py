from sqlalchemy import Column, BigInteger, String, Integer, Date, Boolean, Numeric

import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", ".."))
from shared.database import Base


class PlanPagoDefinicion(Base):
    __tablename__ = "ingresos_publicos_plan_pago_definiciones"

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    codigo = Column(String(50), nullable=False)
    nombre = Column(String(250), nullable=False)
    id_tipo_tributo = Column(BigInteger, nullable=True)
    cuota_minima = Column(Integer, nullable=False, default=1)
    cuota_maxima = Column(Integer, nullable=False, default=12)
    porcentaje_anticipo = Column(Numeric(8, 4), nullable=True)
    tasa_interes = Column(Numeric(8, 4), nullable=True)
    activo = Column(Boolean, nullable=False, default=True)
    fecha_desde = Column(Date, nullable=True)
    fecha_hasta = Column(Date, nullable=True)
