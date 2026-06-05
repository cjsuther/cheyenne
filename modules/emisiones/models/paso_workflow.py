from sqlalchemy import Column, BigInteger, String, Boolean, DateTime, Integer, Text, JSON
from datetime import datetime, timezone

import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", ".."))
from shared.database import Base


class PasoWorkflow(Base):
    __tablename__ = "emisiones_pasos_workflow"

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    id_emision = Column(BigInteger, nullable=False, index=True)
    numero_paso = Column(Integer, nullable=False)
    nombre_paso = Column(String(100), nullable=False)
    estado = Column(String(50), nullable=False, default="pendiente")
    fecha_inicio = Column(DateTime(timezone=True), nullable=True)
    fecha_fin = Column(DateTime(timezone=True), nullable=True)
    id_usuario = Column(BigInteger, nullable=True)
    resultado = Column(Text, nullable=True)
    metadata_paso = Column(JSON, nullable=True)
    error = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    activo = Column(Boolean, nullable=False, default=True)
