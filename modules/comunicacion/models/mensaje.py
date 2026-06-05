from sqlalchemy import Column, BigInteger, String, DateTime, func

import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", ".."))
from shared.database import Base


class Mensaje(Base):
    __tablename__ = "comunicacion_mensajes"

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    id_tipo_mensaje = Column(BigInteger, nullable=False)
    id_estado_mensaje = Column(BigInteger, nullable=False, default=10)
    id_canal = Column(BigInteger, nullable=False)
    id_prioridad = Column(BigInteger, nullable=False, default=10)
    identificador = Column(String(250), nullable=False)
    titulo = Column(String(250), nullable=False)
    cuerpo = Column(String(1000), nullable=False)
    id_usuario_creacion = Column(BigInteger, nullable=True)
    fecha_creacion = Column(DateTime, server_default=func.now(), nullable=False)
    fecha_recepcion = Column(DateTime, nullable=True)
    fecha_envio = Column(DateTime, nullable=True)
