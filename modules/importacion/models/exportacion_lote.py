from sqlalchemy import Column, BigInteger, String, Integer, DateTime
from sqlalchemy.sql import func

import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", ".."))
from shared.database import Base


class ExportacionLote(Base):
    __tablename__ = "importacion_exportacion_lotes"

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    id_tipo_exportacion = Column(BigInteger, nullable=False)
    nombre_archivo = Column(String(250), nullable=False)
    path_archivo = Column(String(500), nullable=True)
    id_estado_exportacion = Column(BigInteger, nullable=False, default=10)
    casos = Column(Integer, nullable=False, default=0)
    id_usuario = Column(BigInteger, nullable=True)
    fecha_creacion = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
