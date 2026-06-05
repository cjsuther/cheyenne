from sqlalchemy import Column, BigInteger, Integer, Date, Numeric
from sqlalchemy.orm import relationship

import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", ".."))
from shared.database import Base


class ReciboPublicacionLote(Base):
    __tablename__ = "tesoreria_recibo_publicacion_lotes"

    id = Column(BigInteger, primary_key=True)
    numero_lote = Column(Integer, nullable=False)
    fecha_lote = Column(Date, nullable=False)
    casos = Column(Integer, nullable=False, default=0)
    importe_total_1 = Column(Numeric(18, 2), nullable=False, default=0)
    importe_total_2 = Column(Numeric(18, 2), nullable=False, default=0)

    publicaciones = relationship("ReciboPublicacion", back_populates="lote", lazy="dynamic")
