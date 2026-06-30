from sqlalchemy import Column, BigInteger, Integer, String, DateTime, Numeric, Boolean
from datetime import datetime, timezone

import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", ".."))
from shared.database import Base


class Comprobante(Base):
    """Comprobante / recibo de una emisión: agrupa las liquidaciones de una cuenta en un
    documento cobrable (con importe y código de barras de pago)."""

    __tablename__ = "emisiones_comprobantes"

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    id_emision = Column(BigInteger, nullable=False, index=True)
    id_contribuyente = Column(BigInteger, nullable=False)
    id_objeto_imponible = Column(BigInteger, nullable=True)
    numero_comprobante = Column(String(50), nullable=True, index=True)
    tipo_tributo = Column(String(50), nullable=True)
    periodo = Column(String(20), nullable=True)
    cantidad_lineas = Column(Integer, nullable=False, default=0)
    importe_a_cancelar = Column(Numeric(18, 2), nullable=False, default=0)  # deuda imputada
    importe_total = Column(Numeric(18, 2), nullable=False, default=0)       # a pagar (1er vto)
    codigo_barras = Column(String(80), nullable=True)
    fecha_emision = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    estado = Column(String(50), nullable=False, default="emitido")
    activo = Column(Boolean, nullable=False, default=True)
