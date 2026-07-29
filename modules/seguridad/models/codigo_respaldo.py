from datetime import datetime, timezone

from sqlalchemy import Column, BigInteger, String, DateTime, Boolean, ForeignKey

import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", ".."))
from shared.database import Base


class CodigoRespaldo(Base):
    """Codigo de respaldo (un solo uso) para 2FA. Se guarda hasheado."""

    __tablename__ = "seguridad_codigos_respaldo"

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    id_usuario = Column(BigInteger, ForeignKey("seguridad_usuarios.id"), nullable=False, index=True)
    codigo_hash = Column(String(128), nullable=False)
    usado = Column(Boolean, nullable=False, default=False, server_default="false")
    fecha_uso = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )
