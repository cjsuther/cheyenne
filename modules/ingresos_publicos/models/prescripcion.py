from datetime import datetime, timezone

from sqlalchemy import Column, BigInteger, Integer, String, Date, DateTime, Numeric, Boolean, ForeignKey

import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", ".."))
from shared.database import Base


class Prescripcion(Base):
    """Prescripción de deuda por antigüedad del período.

    Marca una deuda/período de una cuenta como prescripta mediante un acto administrativo.
    No borra la emisión: registra el hecho jurídico (soft, con acto e importe prescripto).
    """

    __tablename__ = "ingresos_publicos_prescripciones"

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    id_cuenta = Column(BigInteger, ForeignKey("ingresos_publicos_cuentas.id"), nullable=False, index=True)
    id_emision = Column(BigInteger, nullable=True, index=True)  # emisión concreta prescripta (opcional)
    ejercicio = Column(Integer, nullable=True)
    periodo = Column(Integer, nullable=True)
    fecha = Column(Date, nullable=False, default=lambda: datetime.now(timezone.utc).date())
    acto = Column(String(200), nullable=False)  # acto administrativo (resolución/decreto)
    importe = Column(Numeric(18, 2), nullable=False, default=0)
    observaciones = Column(String(500), nullable=True)
    activo = Column(Boolean, nullable=False, default=True)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
