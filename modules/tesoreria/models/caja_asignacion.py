from sqlalchemy import Column, BigInteger, Numeric, DateTime, ForeignKey
from sqlalchemy.orm import relationship

import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", ".."))
from shared.database import Base


class CajaAsignacion(Base):
    __tablename__ = "tesoreria_caja_asignaciones"

    id = Column(BigInteger, primary_key=True)
    id_caja = Column(BigInteger, ForeignKey("tesoreria_cajas.id"), nullable=False)
    id_usuario = Column(BigInteger, nullable=False)
    fecha_apertura = Column(DateTime, nullable=False)
    fecha_cierre = Column(DateTime, nullable=True)
    importe_saldo_inicial = Column(Numeric(18, 2), nullable=False)
    importe_saldo_final = Column(Numeric(18, 2), nullable=True)
    importe_cobro = Column(Numeric(18, 2), nullable=False, default=0)
    importe_cobro_efectivo = Column(Numeric(18, 2), nullable=False, default=0)
    id_recaudacion_lote = Column(BigInteger, nullable=True)

    caja = relationship("Caja", back_populates="asignaciones", lazy="joined")
