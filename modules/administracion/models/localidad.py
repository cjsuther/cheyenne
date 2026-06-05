from sqlalchemy import Column, BigInteger, String, Integer, ForeignKey

import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", ".."))
from shared.database import Base


class Localidad(Base):
    __tablename__ = "administracion_localidades"

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    codigo = Column(String(50), nullable=False)
    nombre = Column(String(250), nullable=False)
    orden = Column(Integer, nullable=False, default=0)
    id_provincia = Column(BigInteger, ForeignKey("administracion_provincias.id"), nullable=False)
