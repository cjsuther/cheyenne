from sqlalchemy import Column, BigInteger, String, Integer

import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", ".."))
from shared.database import Base


class Lista(Base):
    __tablename__ = "interface_listas"

    id = Column(BigInteger, primary_key=True)
    codigo = Column(String(50), nullable=False)
    tipo = Column(String(50), nullable=False, index=True)
    nombre = Column(String(250), nullable=False)
    orden = Column(Integer, nullable=False, default=0)
