from sqlalchemy import Column, BigInteger, String, Date, ForeignKey
from sqlalchemy.orm import relationship

import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", ".."))
from shared.database import Base


class SubTasa(Base):
    __tablename__ = "tesoreria_sub_tasas"

    id = Column(BigInteger, primary_key=True)
    id_tasa = Column(BigInteger, ForeignKey("tesoreria_tasas.id"), nullable=False)
    codigo = Column(String(50), nullable=False)
    descripcion = Column(String(250), nullable=False)
    fecha_desde = Column(Date, nullable=True)
    fecha_hasta = Column(Date, nullable=True)

    tasa = relationship("Tasa", back_populates="sub_tasas", lazy="joined")
