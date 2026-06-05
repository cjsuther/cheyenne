from sqlalchemy import Column, BigInteger, String, Boolean
from sqlalchemy.orm import relationship

import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", ".."))
from shared.database import Base


class Cuenta(Base):
    __tablename__ = "wav_cuentas"

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    id_contribuyente = Column(BigInteger, nullable=True)
    id_tipo_tributo = Column(BigInteger, nullable=False)
    numero_cuenta = Column(String(50), nullable=False)
    id_estado_cuenta = Column(BigInteger, nullable=False, default=10)
    activo = Column(Boolean, nullable=False, default=True)

    declaraciones = relationship("DeclaracionJurada", back_populates="cuenta", lazy="selectin")
    pagos_contado = relationship("PagoContado", back_populates="cuenta", lazy="selectin")
    planes_pago = relationship("PlanPago", back_populates="cuenta", lazy="selectin")
