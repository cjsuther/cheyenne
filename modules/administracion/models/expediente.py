from sqlalchemy import Column, BigInteger, String, Integer, DateTime, func

import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", ".."))
from shared.database import Base


class Expediente(Base):
    __tablename__ = "administracion_expedientes"

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    matricula = Column(String(50), nullable=True)
    ejercicio = Column(Integer, nullable=False)
    numero = Column(Integer, nullable=False)
    letra = Column(String(10), nullable=True)
    id_tipo_expediente = Column(BigInteger, nullable=True)
    subnumero = Column(Integer, nullable=True)
    referencia_expediente = Column(String(500), nullable=True)
    fecha_creacion = Column(DateTime(timezone=True), server_default=func.now())
