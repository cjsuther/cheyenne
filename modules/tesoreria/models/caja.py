from sqlalchemy import Column, BigInteger, String, Integer, ForeignKey
from sqlalchemy.orm import relationship

import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", ".."))
from shared.database import Base


class Caja(Base):
    __tablename__ = "tesoreria_cajas"

    id = Column(BigInteger, primary_key=True)
    codigo = Column(String(50), nullable=False)
    nombre = Column(String(250), nullable=False)
    orden = Column(Integer, nullable=False, default=0)
    id_dependencia = Column(BigInteger, ForeignKey("tesoreria_dependencias.id"), nullable=True)
    id_estado_caja = Column(BigInteger, nullable=False)
    id_usuario_actual = Column(BigInteger, nullable=True)
    id_caja_asignacion_actual = Column(BigInteger, nullable=True)
    id_recaudadora = Column(BigInteger, nullable=True)

    dependencia = relationship("Dependencia", foreign_keys=[id_dependencia], lazy="joined")
    asignaciones = relationship("CajaAsignacion", back_populates="caja", lazy="dynamic")
