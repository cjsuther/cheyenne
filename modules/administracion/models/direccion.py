from sqlalchemy import Column, BigInteger, String, Float

import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", ".."))
from shared.database import Base


class Direccion(Base):
    __tablename__ = "administracion_direcciones"

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    entidad = Column(String(50), nullable=False, index=True)
    id_entidad = Column(BigInteger, nullable=False, index=True)
    id_pais = Column(BigInteger, nullable=True)
    id_provincia = Column(BigInteger, nullable=True)
    id_localidad = Column(BigInteger, nullable=True)
    codigo_postal = Column(String(20), nullable=True)
    calle = Column(String(250), nullable=False)
    altura = Column(String(20), nullable=True)
    piso = Column(String(10), nullable=True)
    dpto = Column(String(10), nullable=True)
    referencia = Column(String(500), nullable=True)
    longitud = Column(Float, nullable=True)
    latitud = Column(Float, nullable=True)
