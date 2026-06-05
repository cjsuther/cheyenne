from sqlalchemy import Column, BigInteger, String, DateTime, func

import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", ".."))
from shared.database import Base


class Observacion(Base):
    __tablename__ = "administracion_observaciones"

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    entidad = Column(String(50), nullable=False, index=True)
    id_entidad = Column(BigInteger, nullable=False, index=True)
    detalle = Column(String(1000), nullable=False)
    id_usuario = Column(BigInteger, nullable=True)
    fecha = Column(DateTime(timezone=True), server_default=func.now())
