from sqlalchemy import Column, BigInteger, Integer, Date, DateTime, Numeric, ForeignKey
from sqlalchemy.sql import func

import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", ".."))
from shared.database import Base


class Emision(Base):
    __tablename__ = "ingresos_publicos_emisiones"

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    id_emision_definicion = Column(BigInteger, ForeignKey("ingresos_publicos_emision_definiciones.id"), nullable=True)
    id_cuenta = Column(BigInteger, nullable=True)
    numero_emision = Column(Integer, nullable=True)
    ejercicio = Column(Integer, nullable=True)
    periodo = Column(Integer, nullable=True)
    cuota = Column(Integer, nullable=True)
    importe_original = Column(Numeric(18, 2), nullable=False, default=0)
    importe_descuento = Column(Numeric(18, 2), nullable=False, default=0)
    importe_recargo = Column(Numeric(18, 2), nullable=False, default=0)
    importe_total = Column(Numeric(18, 2), nullable=False, default=0)
    fecha_vencimiento_1 = Column(Date, nullable=True)
    fecha_vencimiento_2 = Column(Date, nullable=True)
    id_estado_emision = Column(BigInteger, nullable=False, default=10)
    fecha_emision = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
