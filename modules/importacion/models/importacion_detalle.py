from sqlalchemy import Column, BigInteger, Integer, String, DateTime, Text, ForeignKey
from sqlalchemy.orm import relationship

import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", ".."))
from shared.database import Base


class ImportacionDetalle(Base):
    __tablename__ = "importacion_detalles"

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    id_importacion_lote = Column(BigInteger, ForeignKey("importacion_lotes.id"), nullable=False)
    numero_linea = Column(Integer, nullable=False)
    datos_originales = Column(Text, nullable=False)
    id_estado_detalle = Column(BigInteger, nullable=False, default=10)
    detalle_error = Column(String(1000), nullable=True)
    fecha_proceso = Column(DateTime(timezone=True), nullable=True)

    lote = relationship("ImportacionLote", back_populates="detalles")
