from sqlalchemy import Column, BigInteger, String, Integer, Boolean, DateTime
from datetime import datetime, timezone

import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", ".."))
from shared.database import Base


class Numerador(Base):
    """Maestro de numeracion correlativa transaccional (recibos, ordenes de pago, expedientes, etc.)."""
    __tablename__ = "administracion_numeradores"

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    clave = Column(String(80), nullable=False, unique=True, index=True)
    descripcion = Column(String(250), nullable=True)
    anio = Column(Integer, nullable=True)
    proximo = Column(Integer, nullable=False, default=1)
    prefijo = Column(String(30), nullable=True)
    padding = Column(Integer, nullable=False, default=0)
    activo = Column(Boolean, nullable=False, default=True)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
