from sqlalchemy import Column, BigInteger, String, DateTime, Boolean
from sqlalchemy.sql import func

import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", ".."))
from shared.database import Base


class Contribuyente(Base):
    __tablename__ = "ingresos_publicos_contribuyentes"

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    id_persona = Column(BigInteger, nullable=False)
    id_tipo_persona = Column(BigInteger, nullable=False)
    id_tipo_documento = Column(BigInteger, nullable=False)
    numero_documento = Column(String(50), nullable=False)
    fecha_alta = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    fecha_baja = Column(DateTime(timezone=True), nullable=True)
    activo = Column(Boolean, nullable=False, default=True)
