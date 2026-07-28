from sqlalchemy import (
    Column, BigInteger, Integer, String, Boolean, DateTime, Numeric, Text, UniqueConstraint, Index,
)
from datetime import datetime, timezone

import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", ".."))
from shared.database import Base


class Recurso(Base):
    """Cálculo de recursos: (ejercicio, jurisdicción, rubro) → estimado (≡ CalculoDeRecursos legacy)."""
    __tablename__ = "presupuesto_recursos"
    __table_args__ = (UniqueConstraint("anio", "id_jurisdiccion", "id_rubro", name="uq_presu_recurso"),)

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    anio = Column(Integer, nullable=False, index=True)
    id_jurisdiccion = Column(BigInteger, nullable=False)
    id_rubro = Column(BigInteger, nullable=False)
    estimado_inicial = Column(Numeric(18, 2), nullable=False, default=0)
    metodologia = Column(Text, nullable=True)  # descripción metodológica (legacy care_DescMetodologica)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    activo = Column(Boolean, nullable=False, default=True)


class RecursoMovimiento(Base):
    """Ledger del recurso: inicial / modificacion / percibido."""
    __tablename__ = "presupuesto_recurso_movimientos"
    __table_args__ = (Index("ix_presu_recmov", "id_recurso", "tipo"),)

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    id_recurso = Column(BigInteger, nullable=False, index=True)
    tipo = Column(String(15), nullable=False)
    importe = Column(Numeric(18, 2), nullable=False)
    referencia = Column(String(120), nullable=True)  # acto administrativo o comprobante de ingreso
    fecha = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    usuario_nombre = Column(String(150), nullable=True)
    observaciones = Column(Text, nullable=True)
    activo = Column(Boolean, nullable=False, default=True)
