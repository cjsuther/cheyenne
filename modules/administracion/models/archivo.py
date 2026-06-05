from sqlalchemy import Column, BigInteger, String, DateTime, func

import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", ".."))
from shared.database import Base


class Archivo(Base):
    __tablename__ = "administracion_archivos"

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    entidad = Column(String(50), nullable=False, index=True)
    id_entidad = Column(BigInteger, nullable=False, index=True)
    nombre = Column(String(250), nullable=False)
    path = Column(String(500), nullable=False)
    descripcion = Column(String(500), nullable=True)
    id_usuario = Column(BigInteger, nullable=True)
    fecha = Column(DateTime(timezone=True), server_default=func.now())
