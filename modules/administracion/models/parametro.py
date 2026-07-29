from sqlalchemy import Column, BigInteger, String, Text, Boolean, DateTime
from datetime import datetime, timezone

import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", ".."))
from shared.database import Base


class Parametro(Base):
    """Parametros de configuracion del sistema (clave/valor tipado)."""
    __tablename__ = "administracion_parametros"

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    clave = Column(String(120), nullable=False, unique=True, index=True)
    valor = Column(Text, nullable=True)
    tipo = Column(String(20), nullable=False, default="texto")  # texto|numero|booleano|fecha
    grupo = Column(String(80), nullable=True, index=True)
    descripcion = Column(String(250), nullable=True)
    activo = Column(Boolean, nullable=False, default=True)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
