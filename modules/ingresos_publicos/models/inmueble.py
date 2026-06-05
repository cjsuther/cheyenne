from sqlalchemy import Column, BigInteger, String, DateTime, Boolean, ForeignKey
from sqlalchemy.sql import func

import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", ".."))
from shared.database import Base


class Inmueble(Base):
    __tablename__ = "ingresos_publicos_inmuebles"

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    id_cuenta = Column(BigInteger, ForeignKey("ingresos_publicos_cuentas.id"), nullable=False)
    circuito = Column(String(50), nullable=True)
    sector = Column(String(50), nullable=True)
    fraccion = Column(String(50), nullable=True)
    parcela = Column(String(50), nullable=True)
    id_estado_carga = Column(BigInteger, nullable=True)
    fecha_alta = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    activo = Column(Boolean, nullable=False, default=True)
