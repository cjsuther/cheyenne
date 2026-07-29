from sqlalchemy import Column, BigInteger, String, Date, Boolean, DateTime
from datetime import datetime, timezone

import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", ".."))
from shared.database import Base


class Feriado(Base):
    """Feriados para el calculo de dias habiles administrativos."""
    __tablename__ = "administracion_feriados"

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    fecha = Column(Date, nullable=False, unique=True, index=True)
    descripcion = Column(String(250), nullable=True)
    tipo = Column(String(20), nullable=False, default="nacional")  # nacional|provincial|municipal
    activo = Column(Boolean, nullable=False, default=True)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
