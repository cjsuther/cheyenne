import sys, os
from datetime import datetime, timezone

from sqlalchemy import Column, BigInteger, String, DateTime, Text

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", ".."))
from shared.database import Base


class ReporteConsulta(Base):
    """Log liviano de consultas de reportes consolidados (auditoría/uso).

    El módulo reportes NO tiene tablas de negocio propias: consolida datos
    de otros módulos por HTTP. Esta tabla solo registra cada consulta.
    """
    __tablename__ = "reportes_consultas"

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    reporte = Column(String(100), nullable=False, index=True)
    parametros = Column(Text, nullable=True)
    usuario = Column(String(150), nullable=True)
    modulos_ok = Column(String(255), nullable=True)
    modulos_error = Column(String(255), nullable=True)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
