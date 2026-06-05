from sqlalchemy import Column, BigInteger, String, DateTime, Numeric, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", ".."))
from shared.database import Base


class PagoContado(Base):
    __tablename__ = "wav_pagos_contado"

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    id_cuenta = Column(BigInteger, ForeignKey("wav_cuentas.id"), nullable=True)
    id_tipo_tributo = Column(BigInteger, nullable=True)
    importe = Column(Numeric(18, 2), nullable=False)
    fecha_pago = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    id_pasarela_pago = Column(BigInteger, nullable=True)
    id_transaccion_externa = Column(String(250), nullable=True)
    id_estado_pago = Column(BigInteger, nullable=False, default=10)
    codigo_barras = Column(String(250), nullable=True)

    cuenta = relationship("Cuenta", back_populates="pagos_contado")
