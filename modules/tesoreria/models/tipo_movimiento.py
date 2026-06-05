from sqlalchemy import Column, BigInteger, String, Integer, Boolean

import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", ".."))
from shared.database import Base


class TipoMovimiento(Base):
    __tablename__ = "tesoreria_tipos_movimiento"

    id = Column(BigInteger, primary_key=True)
    codigo = Column(String(50), nullable=False)
    nombre = Column(String(250), nullable=False)
    orden = Column(Integer, nullable=False, default=0)
    tipo = Column(String(50), nullable=True)
    automatico = Column(Boolean, nullable=False, default=False)
    autonumerado = Column(Boolean, nullable=False, default=False)
