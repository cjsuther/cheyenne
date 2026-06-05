from sqlalchemy import Column, BigInteger, String, Integer

import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", ".."))
from shared.database import Base


class Entidad(Base):
    __tablename__ = "tesoreria_entidades"

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    codigo = Column(String(50), nullable=False)
    tipo = Column(String(50), nullable=False, index=True)
    nombre = Column(String(250), nullable=False)
    orden = Column(Integer, nullable=False, default=0)
    dato1 = Column(String(250), nullable=True)
    dato2 = Column(String(250), nullable=True)
    dato3 = Column(String(250), nullable=True)
    dato4 = Column(String(250), nullable=True)
    dato5 = Column(String(250), nullable=True)
    dato6 = Column(String(250), nullable=True)
    dato7 = Column(String(250), nullable=True)
    dato8 = Column(String(250), nullable=True)
    dato9 = Column(String(250), nullable=True)
    dato10 = Column(String(250), nullable=True)
