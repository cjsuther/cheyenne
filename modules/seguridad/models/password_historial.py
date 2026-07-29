from datetime import datetime, timezone

from sqlalchemy import Column, BigInteger, String, DateTime, ForeignKey

import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", ".."))
from shared.database import Base


class PasswordHistorial(Base):
    __tablename__ = "seguridad_password_historial"

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    id_usuario = Column(BigInteger, ForeignKey("seguridad_usuarios.id"), nullable=False, index=True)
    hash = Column(String(250), nullable=False)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)
