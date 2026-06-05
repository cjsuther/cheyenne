from sqlalchemy import Column, BigInteger, String, Integer, Date, DateTime, Numeric
from sqlalchemy.orm import relationship

import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", ".."))
from shared.database import Base


class RecaudacionLote(Base):
    __tablename__ = "tesoreria_recaudacion_lotes"

    id = Column(BigInteger, primary_key=True)
    numero_lote = Column(Integer, nullable=False)
    fecha_lote = Column(Date, nullable=False)
    casos = Column(Integer, nullable=False, default=0)
    id_usuario_proceso = Column(BigInteger, nullable=True)
    fecha_proceso = Column(DateTime, nullable=True)
    id_origen_recaudacion = Column(BigInteger, nullable=True)
    id_recaudadora = Column(BigInteger, nullable=True)
    fecha_acreditacion = Column(Date, nullable=True)
    importe_total = Column(Numeric(18, 2), nullable=False, default=0)
    importe_neto = Column(Numeric(18, 2), nullable=False, default=0)
    path_archivo_recaudacion = Column(String(500), nullable=True)
    nombre_archivo_recaudacion = Column(String(250), nullable=True)

    recaudaciones = relationship("Recaudacion", back_populates="lote", lazy="dynamic")
