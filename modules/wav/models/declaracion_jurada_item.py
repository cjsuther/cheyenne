from sqlalchemy import Column, BigInteger, String, Numeric, ForeignKey
from sqlalchemy.orm import relationship

import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", ".."))
from shared.database import Base


class DeclaracionJuradaItem(Base):
    __tablename__ = "wav_declaracion_jurada_items"

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    id_declaracion_jurada = Column(BigInteger, ForeignKey("wav_declaraciones_juradas.id"), nullable=False)
    id_rubro = Column(BigInteger, nullable=True)
    codigo_rubro = Column(String(50), nullable=True)
    descripcion = Column(String(250), nullable=True)
    importe = Column(Numeric(18, 2), nullable=False, default=0)
    cantidad = Column(Numeric(18, 4), nullable=False, default=0)
    base_imponible = Column(Numeric(18, 2), nullable=False, default=0)
    alicuota = Column(Numeric(8, 4), nullable=False, default=0)

    declaracion = relationship("DeclaracionJurada", back_populates="items")
