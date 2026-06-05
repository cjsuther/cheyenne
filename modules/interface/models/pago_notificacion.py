from sqlalchemy import Column, BigInteger, String, DateTime, Text, Boolean, Numeric
from sqlalchemy.sql import func

import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", ".."))
from shared.database import Base


class PagoNotificacion(Base):
    __tablename__ = "interface_pago_notificaciones"

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    id_pasarela_pago = Column(BigInteger, nullable=False)
    id_transaccion_externa = Column(String(250), nullable=False)
    importe = Column(Numeric(18, 2), nullable=False)
    estado = Column(String(50), nullable=False)
    datos_notificacion = Column(Text, nullable=True)
    fecha_notificacion = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    procesado = Column(Boolean, nullable=False, default=False)
    fecha_proceso = Column(DateTime(timezone=True), nullable=True)
