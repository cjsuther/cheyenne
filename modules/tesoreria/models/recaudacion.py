from sqlalchemy import Column, BigInteger, String, Numeric, DateTime, ForeignKey
from sqlalchemy.orm import relationship

import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", ".."))
from shared.database import Base


class Recaudacion(Base):
    __tablename__ = "tesoreria_recaudaciones"

    id = Column(BigInteger, primary_key=True)
    id_recaudacion_lote = Column(BigInteger, ForeignKey("tesoreria_recaudacion_lotes.id"), nullable=False)
    numero_control = Column(String(50), nullable=True)
    numero_comprobante = Column(String(50), nullable=True)
    codigo_tipo_tributo = Column(String(50), nullable=True)
    numero_cuenta = Column(String(50), nullable=True)
    codigo_delegacion = Column(String(50), nullable=True)
    numero_recibo = Column(String(50), nullable=True)
    importe_cobro = Column(Numeric(18, 2), nullable=False)
    fecha_cobro = Column(DateTime, nullable=True)
    codigo_barras = Column(String(250), nullable=True)
    observacion = Column(String(500), nullable=True)

    lote = relationship("RecaudacionLote", back_populates="recaudaciones", lazy="joined")
