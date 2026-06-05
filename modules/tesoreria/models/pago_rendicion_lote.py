from sqlalchemy import Column, BigInteger, String, Integer, Date, DateTime, Numeric
from sqlalchemy.orm import relationship

import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", ".."))
from shared.database import Base


class PagoRendicionLote(Base):
    __tablename__ = "tesoreria_pago_rendicion_lotes"

    id = Column(BigInteger, primary_key=True)
    numero_lote = Column(Integer, nullable=False)
    fecha_lote = Column(Date, nullable=False)
    casos = Column(Integer, nullable=False, default=0)
    importe_total = Column(Numeric(18, 2), nullable=False, default=0)
    id_usuario_proceso = Column(BigInteger, nullable=True)
    fecha_proceso = Column(DateTime, nullable=True)
    fecha_confirmacion = Column(DateTime, nullable=True)

    rendiciones = relationship("PagoRendicion", back_populates="lote", lazy="dynamic")
