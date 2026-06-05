from sqlalchemy import Column, BigInteger, String

import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", ".."))
from shared.database import Base


class Etiqueta(Base):
    __tablename__ = "tesoreria_etiquetas"

    id = Column(BigInteger, primary_key=True)
    entidad = Column(String(50), nullable=False, index=True)
    id_entidad = Column(BigInteger, nullable=False, index=True)
    codigo = Column(String(50), nullable=False)
