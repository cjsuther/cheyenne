from sqlalchemy import Column, BigInteger, String, Date, DateTime
from sqlalchemy.sql import func

import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", ".."))
from shared.database import Base


class Certificado(Base):
    __tablename__ = "ingresos_publicos_certificados"

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    id_cuenta = Column(BigInteger, nullable=True)
    id_tipo_certificado = Column(BigInteger, nullable=False)
    numero_certificado = Column(String(50), nullable=True)
    fecha_emision = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    fecha_vencimiento = Column(Date, nullable=True)
    id_estado_certificado = Column(BigInteger, nullable=False, default=10)
    detalle = Column(String(500), nullable=True)
    id_usuario = Column(BigInteger, nullable=True)
