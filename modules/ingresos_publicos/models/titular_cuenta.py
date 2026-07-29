from datetime import datetime, timezone

from sqlalchemy import Column, BigInteger, String, Date, DateTime, Numeric, Boolean, ForeignKey

import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", ".."))
from shared.database import Base


class TitularCuenta(Base):
    """Titularidad de una cuenta con soporte de condominio.

    Reemplaza la relación 1:1 cuenta→contribuyente del legacy: permite varios titulares
    con su porcentaje de participación y vigencia (titular, condómino o poseedor).
    """

    __tablename__ = "ingresos_publicos_titulares_cuenta"

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    id_cuenta = Column(BigInteger, ForeignKey("ingresos_publicos_cuentas.id"), nullable=False, index=True)
    id_contribuyente = Column(BigInteger, nullable=False, index=True)
    porcentaje = Column(Numeric(8, 4), nullable=False, default=100)
    tipo = Column(String(20), nullable=False, default="titular")  # titular | condomino | poseedor
    vigencia_desde = Column(Date, nullable=True)
    vigencia_hasta = Column(Date, nullable=True)
    activo = Column(Boolean, nullable=False, default=True)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
