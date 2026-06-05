from sqlalchemy import Column, BigInteger, String, Date, DateTime, Numeric, ForeignKey
from sqlalchemy.sql import func

import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", ".."))
from shared.database import Base


class Multa(Base):
    __tablename__ = "ingresos_publicos_multas"

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    id_cuenta = Column(BigInteger, ForeignKey("ingresos_publicos_cuentas.id"), nullable=True)
    id_tipo_multa = Column(BigInteger, nullable=False)
    numero_multa = Column(String(50), nullable=True)
    importe = Column(Numeric(18, 2), nullable=False)
    fecha_alta = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    fecha_vencimiento = Column(Date, nullable=True)
    id_estado_multa = Column(BigInteger, nullable=False, default=10)
    detalle = Column(String(500), nullable=True)
