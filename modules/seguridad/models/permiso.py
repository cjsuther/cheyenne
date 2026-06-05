from sqlalchemy import Column, BigInteger, String
from sqlalchemy.orm import relationship

import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", ".."))
from shared.database import Base


class Permiso(Base):
    __tablename__ = "seguridad_permisos"

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    codigo = Column(String(50), nullable=False, unique=True)
    nombre = Column(String(250), nullable=False)
    descripcion = Column(String(250), nullable=False, default="")
    sistema = Column(String(50), nullable=False, default="")
    id_modulo = Column(BigInteger, nullable=False, default=0)

    perfiles = relationship("Perfil", secondary="seguridad_perfil_permiso", back_populates="permisos", lazy="selectin")
