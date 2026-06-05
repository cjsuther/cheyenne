from sqlalchemy import Column, BigInteger, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", ".."))
from shared.database import Base


class Sesion(Base):
    __tablename__ = "seguridad_sesiones"

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    id_usuario = Column(BigInteger, ForeignKey("seguridad_usuarios.id"), nullable=False)
    token = Column(String(1000), nullable=False, index=True)
    refresh_token = Column(String(1000), nullable=True)
    fecha_vencimiento = Column(DateTime(timezone=True), nullable=False)
    fecha_creacion = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)

    usuario = relationship("Usuario", back_populates="sesiones")
