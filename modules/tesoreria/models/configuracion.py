from sqlalchemy import Column, BigInteger, String

import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", ".."))
from shared.database import Base


class Configuracion(Base):
    __tablename__ = "tesoreria_configuraciones"

    id = Column(BigInteger, primary_key=True)
    nombre = Column(String(250), nullable=False)
    valor = Column(String(1000), nullable=False)
