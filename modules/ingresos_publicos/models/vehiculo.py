from sqlalchemy import Column, BigInteger, String, Integer, DateTime, Boolean, ForeignKey
from sqlalchemy.sql import func

import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", ".."))
from shared.database import Base


class Vehiculo(Base):
    __tablename__ = "ingresos_publicos_vehiculos"

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    id_cuenta = Column(BigInteger, ForeignKey("ingresos_publicos_cuentas.id"), nullable=False)
    dominio = Column(String(20), nullable=False)
    modelo = Column(String(250), nullable=True)
    codigo_modelo = Column(String(50), nullable=True, index=True)  # cruce con el catálogo de valuación
    anio = Column(Integer, nullable=True)
    numero_motor = Column(String(100), nullable=True)
    numero_chasis = Column(String(100), nullable=True)
    id_tipo_vehiculo = Column(BigInteger, nullable=True)
    fecha_alta = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    fecha_baja = Column(DateTime(timezone=True), nullable=True)
    activo = Column(Boolean, nullable=False, default=True)
