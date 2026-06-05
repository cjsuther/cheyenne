from sqlalchemy import Column, BigInteger, String, DateTime, Boolean, ForeignKey
from sqlalchemy.sql import func

import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", ".."))
from shared.database import Base


class Cuenta(Base):
    __tablename__ = "ingresos_publicos_cuentas"

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    id_contribuyente = Column(BigInteger, ForeignKey("ingresos_publicos_contribuyentes.id"), nullable=True)
    id_tipo_tributo = Column(BigInteger, nullable=False)
    id_estado_cuenta = Column(BigInteger, nullable=False, default=10)
    numero_cuenta = Column(String(50), nullable=False, index=True)
    codigo_delegacion = Column(String(50), nullable=True)
    fecha_alta = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    fecha_baja = Column(DateTime(timezone=True), nullable=True)
    activo = Column(Boolean, nullable=False, default=True)
