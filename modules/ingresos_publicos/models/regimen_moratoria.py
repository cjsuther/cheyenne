from datetime import datetime, timezone

from sqlalchemy import Column, BigInteger, String, Integer, Date, DateTime, Numeric, Boolean

import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", ".."))
from shared.database import Base


class RegimenMoratoria(Base):
    """Régimen de moratoria: parámetros de una campaña de regularización de deuda.

    Define la quita de intereses/recargos, el anticipo exigido, el tope de cuotas y la
    tasa de financiación. El motor de planes (sistema francés) lo usa para simular/generar.
    """

    __tablename__ = "ingresos_publicos_regimenes_moratoria"

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    nombre = Column(String(250), nullable=False)
    quita_intereses_pct = Column(Numeric(8, 4), nullable=False, default=0)   # % de quita sobre recargo/interés de mora
    anticipo_pct = Column(Numeric(8, 4), nullable=False, default=0)          # % de anticipo exigido
    cuotas_max = Column(Integer, nullable=False, default=12)
    tasa_financiacion = Column(Numeric(8, 4), nullable=False, default=0)     # interés mensual de financiación (%)
    vigencia_desde = Column(Date, nullable=True)
    vigencia_hasta = Column(Date, nullable=True)
    activo = Column(Boolean, nullable=False, default=True)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
