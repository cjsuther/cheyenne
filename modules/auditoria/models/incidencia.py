from sqlalchemy import Column, BigInteger, String, Text, DateTime, func

import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", ".."))
from shared.database import Base


class Incidencia(Base):
    __tablename__ = "auditoria_incidencias"

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    token = Column(String(250), nullable=True)
    id_tipo_incidencia = Column(BigInteger, nullable=False)
    id_nivel_criticidad = Column(BigInteger, nullable=False)
    id_usuario = Column(BigInteger, nullable=True)
    fecha = Column(DateTime, server_default=func.now(), nullable=False)
    id_modulo = Column(BigInteger, nullable=True)
    origen = Column(String(250), nullable=True)
    mensaje = Column(Text, nullable=True)
    error_data = Column(Text, nullable=True)
    data = Column(Text, nullable=True)
