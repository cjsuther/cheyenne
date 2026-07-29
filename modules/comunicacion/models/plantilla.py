from datetime import datetime, timezone

from sqlalchemy import Column, BigInteger, String, Text, Boolean, DateTime

import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", ".."))
from shared.database import Base


class Plantilla(Base):
    __tablename__ = "comunicacion_plantillas"

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    codigo = Column(String(50), nullable=False, unique=True, index=True)
    nombre = Column(String(250), nullable=False, default="")
    asunto = Column(String(250), nullable=False)
    cuerpo = Column(Text, nullable=False)  # con variables {{nombre}}
    canal = Column(String(50), nullable=False, default="email")
    activo = Column(Boolean, nullable=False, default=True)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)
