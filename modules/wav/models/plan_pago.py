from sqlalchemy import Column, BigInteger, Integer, DateTime, Numeric, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", ".."))
from shared.database import Base


class PlanPago(Base):
    __tablename__ = "wav_planes_pago"

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    id_cuenta = Column(BigInteger, ForeignKey("wav_cuentas.id"), nullable=True)
    id_plan_pago_definicion = Column(BigInteger, nullable=True)
    cantidad_cuotas = Column(Integer, nullable=False)
    importe_total = Column(Numeric(18, 2), nullable=False, default=0)
    importe_anticipo = Column(Numeric(18, 2), nullable=False, default=0)
    importe_cuota = Column(Numeric(18, 2), nullable=False, default=0)
    id_estado_plan = Column(BigInteger, nullable=False, default=10)
    fecha_alta = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    cuenta = relationship("Cuenta", back_populates="planes_pago")
