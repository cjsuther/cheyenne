from sqlalchemy import Column, BigInteger, String, Integer, Date, Boolean

import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", ".."))
from shared.database import Base


class EmisionDefinicion(Base):
    __tablename__ = "ingresos_publicos_emision_definiciones"

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    codigo = Column(String(50), nullable=False)
    nombre = Column(String(250), nullable=False)
    id_tipo_tributo = Column(BigInteger, nullable=True)
    id_tasa = Column(BigInteger, nullable=True)
    ejercicio = Column(Integer, nullable=True)
    periodo_desde = Column(Integer, nullable=True)
    periodo_hasta = Column(Integer, nullable=True)
    cuota_desde = Column(Integer, nullable=True)
    cuota_hasta = Column(Integer, nullable=True)
    fecha_vencimiento_1 = Column(Date, nullable=True)
    fecha_vencimiento_2 = Column(Date, nullable=True)
    activo = Column(Boolean, nullable=False, default=True)
