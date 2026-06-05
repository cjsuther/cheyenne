from sqlalchemy import Column, BigInteger, String, Numeric, DateTime, ForeignKey
from sqlalchemy.orm import relationship

import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", ".."))
from shared.database import Base


class PagoRendicion(Base):
    __tablename__ = "tesoreria_pago_rendiciones"

    id = Column(BigInteger, primary_key=True)
    id_pago_rendicion_lote = Column(BigInteger, ForeignKey("tesoreria_pago_rendicion_lotes.id"), nullable=False)
    id_cuenta_pago = Column(BigInteger, nullable=True)
    codigo_delegacion = Column(String(50), nullable=True)
    numero_recibo = Column(String(50), nullable=True)
    codigo_lugar_pago = Column(String(50), nullable=True)
    importe_pago = Column(Numeric(18, 2), nullable=False)
    fecha_pago = Column(DateTime, nullable=True)
    codigo_barras = Column(String(250), nullable=True)

    lote = relationship("PagoRendicionLote", back_populates="rendiciones", lazy="joined")
