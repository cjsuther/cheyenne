from sqlalchemy import Column, BigInteger, String, Integer, DateTime, Text
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", ".."))
from shared.database import Base


class ImportacionLote(Base):
    __tablename__ = "importacion_lotes"

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    id_tipo_importacion = Column(BigInteger, nullable=False)
    nombre_archivo = Column(String(250), nullable=False)
    path_archivo = Column(String(500), nullable=False)
    id_estado_importacion = Column(BigInteger, nullable=False, default=10)
    casos_total = Column(Integer, nullable=False, default=0)
    casos_procesados = Column(Integer, nullable=False, default=0)
    casos_error = Column(Integer, nullable=False, default=0)
    id_usuario = Column(BigInteger, nullable=True)
    fecha_inicio = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    fecha_fin = Column(DateTime(timezone=True), nullable=True)
    detalle_error = Column(Text, nullable=True)

    detalles = relationship("ImportacionDetalle", back_populates="lote", lazy="selectin")
