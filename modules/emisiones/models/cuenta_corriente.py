from sqlalchemy import Column, BigInteger, String, Boolean, DateTime, Numeric, Integer, JSON
from datetime import datetime, timezone

import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", ".."))
from shared.database import Base


class CuentaCorriente(Base):
    __tablename__ = "emisiones_cuentas_corrientes"

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    id_emision = Column(BigInteger, nullable=False, index=True)
    id_contribuyente = Column(BigInteger, nullable=False)
    id_objeto_imponible = Column(BigInteger, nullable=True)
    id_liquidacion = Column(BigInteger, nullable=True)
    tipo_tributo = Column(String(50), nullable=False)
    periodo = Column(String(20), nullable=True)
    cuota = Column(Integer, nullable=True)
    concepto = Column(String(250), nullable=True)
    monto_original = Column(Numeric(18, 2), nullable=True, default=0)
    monto_pagado = Column(Numeric(18, 2), nullable=True, default=0)
    saldo = Column(Numeric(18, 2), nullable=True, default=0)
    fecha_vencimiento = Column(DateTime(timezone=True), nullable=True)
    estado = Column(String(50), nullable=False, default="pendiente")
    numero_comprobante = Column(String(50), nullable=True)
    historial_pagos = Column(JSON, nullable=True)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))
    activo = Column(Boolean, nullable=False, default=True)
