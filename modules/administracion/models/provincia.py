from sqlalchemy import Column, BigInteger, String, Integer, ForeignKey

import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", ".."))
from shared.database import Base


class Provincia(Base):
    __tablename__ = "administracion_provincias"

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    codigo = Column(String(50), nullable=False)
    nombre = Column(String(250), nullable=False)
    orden = Column(Integer, nullable=False, default=0)
    id_pais = Column(BigInteger, ForeignKey("administracion_paises.id"), nullable=False)
