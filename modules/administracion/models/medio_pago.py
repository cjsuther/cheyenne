from sqlalchemy import Column, BigInteger, String

import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", ".."))
from shared.database import Base


class MedioPago(Base):
    __tablename__ = "administracion_medios_pago"

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    id_tipo_persona = Column(BigInteger, nullable=False)
    id_persona = Column(BigInteger, nullable=False)
    id_tipo_medio_pago = Column(BigInteger, nullable=False)
    titular = Column(String(250), nullable=False)
    numero = Column(String(50), nullable=False)
    banco = Column(String(250), nullable=True)
    alias = Column(String(250), nullable=True)
