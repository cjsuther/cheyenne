from sqlalchemy import Column, BigInteger, String, DateTime, ForeignKey
from sqlalchemy.sql import func

import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", ".."))
from shared.database import Base


class Verificacion(Base):
    __tablename__ = "seguridad_verificaciones"

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    id_tipo_verificacion = Column(BigInteger, nullable=False)
    id_estado_verificacion = Column(BigInteger, nullable=False, default=51)
    id_usuario = Column(BigInteger, ForeignKey("seguridad_usuarios.id"), nullable=True)
    codigo = Column(String(50), nullable=False)
    fecha_desde = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    fecha_hasta = Column(DateTime(timezone=True), nullable=False)
    token = Column(String(250), nullable=False, unique=True, index=True)
    detalle = Column(String(1000), nullable=False, default="")
