from sqlalchemy import Column, BigInteger, String, DateTime, Text
from sqlalchemy.sql import func

import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", ".."))
from shared.database import Base


class Consulta(Base):
    __tablename__ = "interface_consultas"

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    id_tipo_consulta = Column(BigInteger, nullable=False)
    identificador = Column(String(250), nullable=False)
    datos_consulta = Column(Text, nullable=True)
    datos_respuesta = Column(Text, nullable=True)
    id_estado_consulta = Column(BigInteger, nullable=False, default=10)
    fecha_consulta = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    ip_origen = Column(String(50), nullable=True)
