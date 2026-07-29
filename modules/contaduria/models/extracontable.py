from sqlalchemy import (
    Column, BigInteger, String, Boolean, DateTime, Numeric, Text, Date, Index,
)
from datetime import datetime, timezone

import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", ".."))
from shared.database import Base

TIPOS_MOV = ("ingreso", "egreso")


class MovimientoExtracontable(Base):
    """Fondos de terceros / extracontables: garantías, depósitos, embargos retenidos.
    No son fondos del municipio; se llevan por concepto con su saldo."""
    __tablename__ = "contaduria_movimientos_extracontables"
    __table_args__ = (
        Index("ix_conta_extra_concepto", "concepto"),
    )

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    concepto = Column(String(150), nullable=False)          # agrupador de saldo (ej "Garantías de oferta")
    tipo = Column(String(10), nullable=False)               # ingreso|egreso
    importe = Column(Numeric(18, 2), nullable=False)
    beneficiario = Column(String(250), nullable=True)
    referencia = Column(String(120), nullable=True)         # nro. de expediente/garantía/embargo
    fecha = Column(Date, nullable=True)
    observaciones = Column(Text, nullable=True)
    creado_por = Column(String(150), nullable=True)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    activo = Column(Boolean, nullable=False, default=True)
