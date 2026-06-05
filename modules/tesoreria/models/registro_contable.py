from sqlalchemy import Column, BigInteger, String, Integer, Date, Numeric, ForeignKey
from sqlalchemy.orm import relationship

import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", ".."))
from shared.database import Base


class RegistroContable(Base):
    __tablename__ = "tesoreria_registros_contables"

    id = Column(BigInteger, primary_key=True)
    id_registro_contable_lote = Column(BigInteger, ForeignKey("tesoreria_registro_contable_lotes.id"), nullable=False)
    id_recaudacion = Column(BigInteger, nullable=True)
    fecha_ingreso = Column(Date, nullable=True)
    cuenta_contable = Column(String(250), nullable=True)
    jurisdiccion = Column(String(250), nullable=True)
    recurso_por_rubro = Column(String(250), nullable=True)
    codigo_lugar_pago = Column(String(50), nullable=True)
    ejercicio = Column(Integer, nullable=True)
    codigo_forma_pago = Column(String(50), nullable=True)
    importe = Column(Numeric(18, 2), nullable=False, default=0)

    lote = relationship("RegistroContableLote", back_populates="registros", lazy="joined")
