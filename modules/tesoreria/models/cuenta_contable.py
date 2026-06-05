from sqlalchemy import Column, BigInteger, String, Integer, Date

import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", ".."))
from shared.database import Base


class CuentaContable(Base):
    __tablename__ = "tesoreria_cuentas_contables"

    id = Column(BigInteger, primary_key=True)
    codigo = Column(String(50), nullable=False)
    nombre = Column(String(250), nullable=False)
    orden = Column(Integer, nullable=False, default=0)
    agrupamiento = Column(String(50), nullable=True)
    ejercicio = Column(Integer, nullable=True)
    tipo = Column(String(50), nullable=True)
    fecha_baja = Column(Date, nullable=True)
