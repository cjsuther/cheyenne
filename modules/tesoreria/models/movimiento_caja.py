from sqlalchemy import Column, BigInteger, String, Numeric, DateTime

import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", ".."))
from shared.database import Base


class MovimientoCaja(Base):
    __tablename__ = "tesoreria_movimientos_caja"

    id = Column(BigInteger, primary_key=True)
    id_caja = Column(BigInteger, nullable=False)
    id_caja_asignacion = Column(BigInteger, nullable=False)
    id_tipo_movimiento_caja = Column(BigInteger, nullable=False)
    importe_cobro = Column(Numeric(18, 2), nullable=False)
    fecha_cobro = Column(DateTime, nullable=False)
    observacion = Column(String(500), nullable=True)
