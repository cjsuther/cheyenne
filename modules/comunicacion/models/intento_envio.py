from datetime import datetime, timezone

from sqlalchemy import Column, BigInteger, String, DateTime, Text

import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", ".."))
from shared.database import Base


class IntentoEnvio(Base):
    __tablename__ = "comunicacion_intentos_envio"

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    id_mensaje = Column(BigInteger, nullable=False, index=True)
    fecha = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)
    resultado = Column(String(20), nullable=False)  # enviado / error
    detalle_error = Column(Text, nullable=True)
