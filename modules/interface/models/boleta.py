from sqlalchemy import Column, BigInteger, String, DateTime, Date, Numeric
from sqlalchemy.sql import func

import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", ".."))
from shared.database import Base


class Boleta(Base):
    __tablename__ = "interface_boletas"

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    id_tipo_tributo = Column(BigInteger, nullable=True)
    numero_cuenta = Column(String(50), nullable=True)
    numero_recibo = Column(String(50), nullable=True)
    importe = Column(Numeric(18, 2), nullable=False)
    fecha_generacion = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    fecha_vencimiento = Column(Date, nullable=True)
    codigo_barras = Column(String(250), nullable=True)
    id_estado_boleta = Column(BigInteger, nullable=False, default=10)
