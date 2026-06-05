from sqlalchemy import Column, BigInteger, String, Integer

import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", ".."))
from shared.database import Base


class Recaudadora(Base):
    __tablename__ = "tesoreria_recaudadoras"

    id = Column(BigInteger, primary_key=True)
    codigo = Column(String(50), nullable=False)
    nombre = Column(String(250), nullable=False)
    orden = Column(Integer, nullable=False, default=0)
    codigo_cliente = Column(String(50), nullable=True)
    id_lugar_pago = Column(BigInteger, nullable=True)
    id_metodo_importacion = Column(BigInteger, nullable=True)
