from sqlalchemy import Column, BigInteger, String, Integer, Date

import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", ".."))
from shared.database import Base


class RecursoPorRubro(Base):
    __tablename__ = "tesoreria_recursos_por_rubro"

    id = Column(BigInteger, primary_key=True)
    codigo = Column(String(50), nullable=False)
    nombre = Column(String(250), nullable=False)
    orden = Column(Integer, nullable=False, default=0)
    presupuesto = Column(String(250), nullable=True)
    agrupamiento = Column(String(50), nullable=True)
    nivel = Column(Integer, nullable=True)
    ejercicio = Column(Integer, nullable=True)
    fecha_baja = Column(Date, nullable=True)
