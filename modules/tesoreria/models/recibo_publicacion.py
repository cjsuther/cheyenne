from sqlalchemy import Column, BigInteger, String, Integer, Date, Numeric, ForeignKey
from sqlalchemy.orm import relationship

import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", ".."))
from shared.database import Base


class ReciboPublicacion(Base):
    __tablename__ = "tesoreria_recibo_publicaciones"

    id = Column(BigInteger, primary_key=True)
    id_recibo_publicacion_lote = Column(BigInteger, ForeignKey("tesoreria_recibo_publicacion_lotes.id"), nullable=False)
    id_cuenta_pago = Column(BigInteger, nullable=True)
    codigo_tipo_tributo = Column(String(50), nullable=True)
    numero_cuenta = Column(String(50), nullable=True)
    numero_recibo = Column(String(50), nullable=True)
    periodo = Column(String(20), nullable=True)
    cuota = Column(Integer, nullable=True)
    importe_vencimiento_1 = Column(Numeric(18, 2), nullable=True)
    importe_vencimiento_2 = Column(Numeric(18, 2), nullable=True)
    fecha_vencimiento_1 = Column(Date, nullable=True)
    fecha_vencimiento_2 = Column(Date, nullable=True)
    codigo_barras = Column(String(250), nullable=True)

    lote = relationship("ReciboPublicacionLote", back_populates="publicaciones", lazy="joined")
