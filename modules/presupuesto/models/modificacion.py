from sqlalchemy import (
    Column, BigInteger, Integer, String, Boolean, DateTime, Numeric, Text, UniqueConstraint,
)
from datetime import datetime, timezone

import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", ".."))
from shared.database import Base

TIPOS_MODIFICACION = ("ampliacion", "reduccion", "compensacion")
ESTADOS_MODIFICACION = ("borrador", "aprobada", "anulada")


class Modificacion(Base):
    """Modificación presupuestaria (≡ comprobantes 71/72 del legacy, con workflow — DD-04)."""
    __tablename__ = "presupuesto_modificaciones"
    __table_args__ = (UniqueConstraint("anio", "numero", name="uq_presu_modif_numero"),)

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    anio = Column(Integer, nullable=False, index=True)
    numero = Column(Integer, nullable=True)  # se asigna al APROBAR (RN-08: sin huecos)
    fecha = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    tipo = Column(String(20), nullable=False)
    acto_administrativo = Column(String(120), nullable=False)  # RN-07
    expediente = Column(String(80), nullable=True)
    estado = Column(String(15), nullable=False, default="borrador")
    observaciones = Column(Text, nullable=True)
    # trazabilidad de workflow
    creado_por = Column(String(150), nullable=True)
    aprobado_por = Column(String(150), nullable=True)
    fecha_aprobacion = Column(DateTime(timezone=True), nullable=True)
    anulado_por = Column(String(150), nullable=True)
    fecha_anulacion = Column(DateTime(timezone=True), nullable=True)
    motivo_anulacion = Column(Text, nullable=True)
    activo = Column(Boolean, nullable=False, default=True)


class ModificacionItem(Base):
    __tablename__ = "presupuesto_modificacion_items"

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    id_modificacion = Column(BigInteger, nullable=False, index=True)
    id_partida = Column(BigInteger, nullable=False)
    importe = Column(Numeric(18, 2), nullable=False)  # con signo (RN-03: ≠ 0)
    detalle = Column(String(250), nullable=False)      # RN-03: obligatorio
