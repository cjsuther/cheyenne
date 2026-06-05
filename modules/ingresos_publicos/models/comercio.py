from sqlalchemy import Column, BigInteger, String, DateTime, Boolean, ForeignKey
from sqlalchemy.sql import func

import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", ".."))
from shared.database import Base


class Comercio(Base):
    __tablename__ = "ingresos_publicos_comercios"

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    id_cuenta = Column(BigInteger, ForeignKey("ingresos_publicos_cuentas.id"), nullable=False)
    cuit = Column(String(20), nullable=True)
    nombre_fantasia = Column(String(250), nullable=True)
    id_categoria = Column(BigInteger, nullable=True)
    gran_contribuyente = Column(Boolean, nullable=False, default=False)
    fecha_alta = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    activo = Column(Boolean, nullable=False, default=True)
