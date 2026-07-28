from sqlalchemy import Column, BigInteger, Integer, String, Boolean, Numeric, UniqueConstraint

import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", ".."))
from shared.database import Base

# Ámbitos de cuota (≡ legacy: por jurisdicción / fuente / inciso)
DIMENSIONES_CUOTA = ("jurisdiccion", "fuente", "inciso")


class Cuota(Base):
    """Cuota de compromiso: tope trimestral autorizado por ámbito (fase 2 del diseño)."""
    __tablename__ = "presupuesto_cuotas"
    __table_args__ = (
        UniqueConstraint("anio", "dimension_tipo", "dimension_ref", "trimestre", name="uq_presu_cuota"),
    )

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    anio = Column(Integer, nullable=False, index=True)
    dimension_tipo = Column(String(15), nullable=False)   # jurisdiccion | fuente | inciso
    dimension_ref = Column(String(64), nullable=False)    # id (juri/fuente) o código raíz (inciso)
    trimestre = Column(Integer, nullable=False)           # 1..4
    importe_autorizado = Column(Numeric(18, 2), nullable=False, default=0)
    activo = Column(Boolean, nullable=False, default=True)
