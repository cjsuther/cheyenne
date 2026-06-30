from sqlalchemy import Column, BigInteger, Integer, String, DateTime, Numeric, Boolean
from datetime import datetime, timezone

import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", ".."))
from shared.database import Base


class PagoRecibo(Base):
    """Comprobante de un pago registrado contra un concepto de la cuenta corriente."""

    __tablename__ = "emisiones_pago_recibos"

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    numero_recibo = Column(String(40), nullable=True, index=True)
    fecha_pago = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    id_contribuyente = Column(BigInteger, nullable=False, index=True)
    id_cuenta_corriente = Column(BigInteger, nullable=False)
    id_emision = Column(BigInteger, nullable=True)
    tipo_tributo = Column(String(50), nullable=True)
    periodo = Column(String(20), nullable=True)
    concepto = Column(String(250), nullable=True)
    capital_pagado = Column(Numeric(18, 2), nullable=False, default=0)
    recargo_mora = Column(Numeric(18, 2), nullable=False, default=0)
    total_pagado = Column(Numeric(18, 2), nullable=False, default=0)
    dias_mora = Column(Integer, nullable=True, default=0)
    estado_resultante = Column(String(50), nullable=True)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    activo = Column(Boolean, nullable=False, default=True)
