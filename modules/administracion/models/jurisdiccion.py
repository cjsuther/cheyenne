from sqlalchemy import Column, BigInteger, String, Integer

import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", ".."))
from shared.database import Base


class Jurisdiccion(Base):
    __tablename__ = "administracion_jurisdicciones"

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    codigo = Column(String(50), nullable=False)
    nombre = Column(String(250), nullable=False)
    orden = Column(Integer, nullable=False, default=0)
    ejercicio = Column(Integer, nullable=True)
    agrupamiento = Column(String(50), nullable=True)
    nivel = Column(Integer, nullable=True)
    tipo = Column(String(50), nullable=True)
