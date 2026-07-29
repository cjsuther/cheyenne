from datetime import datetime, timezone

from sqlalchemy import Column, BigInteger, String, Numeric, DateTime, ForeignKey

import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", ".."))
from shared.database import Base


class DebitoItem(Base):
    """Renglón de un lote de débito: un débito a una adhesión/cuenta por un importe.
    El motivo_rechazo se completa cuando el banco/procesadora rechaza el débito."""

    __tablename__ = "wav_debito_items"

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    id_lote = Column(BigInteger, ForeignKey("wav_lotes_debito.id"), nullable=False, index=True)
    id_adhesion = Column(BigInteger, nullable=True)
    id_cuenta = Column(BigInteger, nullable=True)
    medio = Column(String(20), nullable=True)          # copia del medio del lote/adhesión
    datos = Column(String(250), nullable=True)         # CBU / nro tarjeta usado para el débito
    titular = Column(String(150), nullable=True)
    importe = Column(Numeric(18, 2), nullable=False, default=0)
    estado = Column(String(20), nullable=False, default="pendiente")  # pendiente | debitado | rechazado
    motivo_rechazo = Column(String(250), nullable=True)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
