from sqlalchemy import Column, BigInteger, String, ForeignKey
from sqlalchemy.orm import relationship

import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", ".."))
from shared.database import Base


class Acceso(Base):
    __tablename__ = "seguridad_accesos"

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    id_usuario = Column(BigInteger, ForeignKey("seguridad_usuarios.id"), nullable=False)
    id_tipo_acceso = Column(BigInteger, nullable=False, default=10)
    identificador = Column(String(250), nullable=False, index=True)
    password = Column(String(250), nullable=False)

    usuario = relationship("Usuario", back_populates="accesos")
