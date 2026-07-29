from sqlalchemy import Column, BigInteger, String, Boolean, DateTime
from datetime import datetime, timezone

import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", ".."))
from shared.database import Base


class Funcionario(Base):
    """Funcionarios responsables / firmantes (ordenes, pagos, resoluciones)."""
    __tablename__ = "administracion_funcionarios"

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    codigo = Column(String(50), nullable=False, unique=True, index=True)
    nombre = Column(String(250), nullable=False)
    cargo = Column(String(150), nullable=True)
    id_dependencia = Column(BigInteger, nullable=True)
    firma_para = Column(String(20), nullable=False, default="varios")  # ordenes|pagos|resoluciones|varios
    activo = Column(Boolean, nullable=False, default=True)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
