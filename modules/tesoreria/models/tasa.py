from sqlalchemy import Column, BigInteger, String, Numeric
from sqlalchemy.orm import relationship

import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", ".."))
from shared.database import Base


class Tasa(Base):
    __tablename__ = "tesoreria_tasas"

    id = Column(BigInteger, primary_key=True)
    codigo = Column(String(50), nullable=False)
    id_tipo_tributo = Column(BigInteger, nullable=True)
    id_categoria_tasa = Column(BigInteger, nullable=True)
    descripcion = Column(String(250), nullable=False)
    porcentaje_descuento = Column(Numeric(8, 4), nullable=True)

    sub_tasas = relationship("SubTasa", back_populates="tasa", lazy="dynamic")
