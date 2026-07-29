from sqlalchemy import Column, BigInteger, Integer, String, Boolean, DateTime, Index
from datetime import datetime, timezone

import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", ".."))
from shared.database import Base


class MapeoTributoRecurso(Base):
    """Mapea un tributo (código, ej TSG/TSH) + ejercicio → recurso presupuestario.

    Cierra el circuito devengado↔percibido: permite que Rentas/Tesorería informen
    lo percibido por tributo y el módulo lo impute al recurso presupuestario correcto.
    """
    __tablename__ = "presupuesto_mapeo_tributo_recurso"
    __table_args__ = (Index("ix_presu_mapeo_trib", "tributo", "anio"),)

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    tributo = Column(String(30), nullable=False)   # código del tributo (ej TSG, TSH)
    anio = Column(Integer, nullable=False, index=True)
    id_recurso = Column(BigInteger, nullable=False)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    activo = Column(Boolean, nullable=False, default=True)
