from datetime import datetime, timezone

from sqlalchemy import Column, BigInteger, String, Date, DateTime, Numeric, Boolean

import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", ".."))
from shared.database import Base


class Exencion(Base):
    """Exención tributaria de una cuenta o contribuyente (total o parcial).

    La consume `emisiones` al liquidar: si hay una exención vigente para la cuenta/tasa,
    aplica el `porcentaje` de descuento (100 = total). Vive en ingresos_publicos porque
    es padrón/beneficio, no liquidación.
    """

    __tablename__ = "ingresos_publicos_exenciones"

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    id_cuenta = Column(BigInteger, nullable=True, index=True)
    id_contribuyente = Column(BigInteger, nullable=True, index=True)
    id_tasa = Column(BigInteger, nullable=True)  # null = aplica a todas las tasas
    motivo = Column(String(500), nullable=True)
    porcentaje = Column(Numeric(8, 4), nullable=False, default=100)  # 100 = exención total
    vigencia_desde = Column(Date, nullable=True)
    vigencia_hasta = Column(Date, nullable=True)
    acto_administrativo = Column(String(250), nullable=True)
    activo = Column(Boolean, nullable=False, default=True)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
