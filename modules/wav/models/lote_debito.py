from datetime import datetime, timezone

from sqlalchemy import Column, BigInteger, String, Integer, Numeric, DateTime, Boolean

import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", ".."))
from shared.database import Base


class LoteDebito(Base):
    """Lote de débito automático: agrupa los débitos de un período por medio de
    cobro (CBU o tarjeta). Se genera desde las adhesiones activas y la deuda del
    período (consultada por HTTP a emisiones)."""

    __tablename__ = "wav_lotes_debito"

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    periodo = Column(String(20), nullable=False)          # p.ej. '2026-06'
    medio = Column(String(20), nullable=False)            # 'cbu' | 'tarjeta'
    estado = Column(String(20), nullable=False, default="generado")  # generado | enviado | procesado
    total = Column(Numeric(18, 2), nullable=False, default=0)
    cantidad = Column(Integer, nullable=False, default=0)
    fecha = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    activo = Column(Boolean, nullable=False, default=True)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
