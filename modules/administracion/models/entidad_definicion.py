from sqlalchemy import Column, BigInteger, String

import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", ".."))
from shared.database import Base


class EntidadDefinicion(Base):
    __tablename__ = "administracion_entidad_definiciones"

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    tipo = Column(String(50), nullable=False, unique=True, index=True)
    nombre1 = Column(String(250), nullable=True)
    nombre2 = Column(String(250), nullable=True)
    nombre3 = Column(String(250), nullable=True)
    nombre4 = Column(String(250), nullable=True)
    nombre5 = Column(String(250), nullable=True)
    nombre6 = Column(String(250), nullable=True)
    nombre7 = Column(String(250), nullable=True)
    nombre8 = Column(String(250), nullable=True)
    nombre9 = Column(String(250), nullable=True)
    nombre10 = Column(String(250), nullable=True)
    tipo_dato1 = Column(String(50), nullable=True)
    tipo_dato2 = Column(String(50), nullable=True)
    tipo_dato3 = Column(String(50), nullable=True)
    tipo_dato4 = Column(String(50), nullable=True)
    tipo_dato5 = Column(String(50), nullable=True)
    tipo_dato6 = Column(String(50), nullable=True)
    tipo_dato7 = Column(String(50), nullable=True)
    tipo_dato8 = Column(String(50), nullable=True)
    tipo_dato9 = Column(String(50), nullable=True)
    tipo_dato10 = Column(String(50), nullable=True)
