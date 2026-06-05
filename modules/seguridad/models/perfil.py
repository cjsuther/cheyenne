from sqlalchemy import Column, BigInteger, String, Table, ForeignKey
from sqlalchemy.orm import relationship

import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", ".."))
from shared.database import Base

perfil_permiso = Table(
    "seguridad_perfil_permiso",
    Base.metadata,
    Column("perfil_id", BigInteger, ForeignKey("seguridad_perfiles.id"), primary_key=True),
    Column("permiso_id", BigInteger, ForeignKey("seguridad_permisos.id"), primary_key=True),
)


class Perfil(Base):
    __tablename__ = "seguridad_perfiles"

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    codigo = Column(String(50), nullable=False, unique=True)
    nombre = Column(String(250), nullable=False)

    usuarios = relationship("Usuario", secondary="seguridad_usuario_perfil", back_populates="perfiles", lazy="selectin")
    permisos = relationship("Permiso", secondary=perfil_permiso, back_populates="perfiles", lazy="selectin")
