from sqlalchemy import Column, BigInteger, String, Boolean, DateTime, Numeric, Integer
from datetime import datetime, timezone

import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", ".."))
from shared.database import Base


class VencimientoComprobante(Base):
    """Múltiples vencimientos por comprobante (hasta 4 en el port de RAFAM).

    Reemplaza el único ``fecha_vencimiento`` por una escalera de vencimientos.
    ``tipo`` = aCancelar (deuda imputada) o aPagar (importe efectivo del recibo).
    """

    __tablename__ = "emisiones_vencimientos_comprobante"

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    id_comprobante = Column(BigInteger, nullable=False, index=True)
    id_emision = Column(BigInteger, nullable=True, index=True)
    numero = Column(Integer, nullable=False, default=1)  # 1..4
    fecha_vencimiento = Column(DateTime(timezone=True), nullable=True)
    importe = Column(Numeric(18, 2), nullable=False, default=0)
    tipo = Column(String(12), nullable=False, default="aPagar")  # aCancelar | aPagar
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    activo = Column(Boolean, nullable=False, default=True)
