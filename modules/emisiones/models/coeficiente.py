from sqlalchemy import Column, BigInteger, String, Boolean, DateTime, Numeric
from datetime import datetime, timezone

import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", ".."))
from shared.database import Base


class Coeficiente(Base):
    """Curva temporal de recargos/coeficientes por mora.

    En vez de un % plano a hoy, la mora se calcula recorriendo tramos vigentes
    en el tiempo. ``tipo`` = mensual (aplica valor por cada 30 días del tramo) o
    diario (aplica valor por cada día del tramo). ``valor`` es el porcentaje del
    tramo (p.ej. 3.0 = 3% mensual).
    """

    __tablename__ = "emisiones_coeficientes"

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    tipo_tributo = Column(String(50), nullable=True)  # NULL = aplica a todos los tributos
    fecha_desde = Column(DateTime(timezone=True), nullable=False, index=True)
    fecha_hasta = Column(DateTime(timezone=True), nullable=True)
    tipo = Column(String(10), nullable=False, default="mensual")  # mensual | diario
    valor = Column(Numeric(12, 6), nullable=False, default=0)
    descripcion = Column(String(200), nullable=True)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc),
                        onupdate=lambda: datetime.now(timezone.utc))
    activo = Column(Boolean, nullable=False, default=True)
