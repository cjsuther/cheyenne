from sqlalchemy import Column, BigInteger, Integer, String, DateTime, Numeric, ForeignKey
from sqlalchemy.orm import relationship

import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", ".."))
from shared.database import Base


class DeclaracionJurada(Base):
    __tablename__ = "wav_declaraciones_juradas"

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    id_cuenta = Column(BigInteger, ForeignKey("wav_cuentas.id"), nullable=False)
    id_modelo_declaracion = Column(BigInteger, nullable=True)
    anio = Column(Integer, nullable=False)
    mes = Column(Integer, nullable=False)
    numero_declaracion = Column(String(50), nullable=True)
    fecha_presentacion = Column(DateTime(timezone=True), nullable=True)
    id_estado_declaracion = Column(BigInteger, nullable=False, default=10)
    importe_total = Column(Numeric(18, 2), nullable=False, default=0)
    saldo = Column(Numeric(18, 2), nullable=False, default=0)

    cuenta = relationship("Cuenta", back_populates="declaraciones")
    items = relationship("DeclaracionJuradaItem", back_populates="declaracion", lazy="selectin", cascade="all, delete-orphan")
