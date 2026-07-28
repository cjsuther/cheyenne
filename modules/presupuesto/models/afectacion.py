from sqlalchemy import (
    Column, BigInteger, String, Boolean, DateTime, Numeric, Text, UniqueConstraint,
)
from datetime import datetime, timezone

import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", ".."))
from shared.database import Base

# Cadena del gasto (DD-06): cada etapa puede referenciar la anterior
TIPOS_AFECTACION = ("preventivo", "compromiso", "devengado", "pagado")
ETAPA_PREVIA = {"compromiso": "preventivo", "devengado": "compromiso", "pagado": "devengado"}


class Afectacion(Base):
    """Afectación presupuestaria (contrato del ciclo del gasto). Idempotente por referencia (DD-07)."""
    __tablename__ = "presupuesto_afectaciones"
    __table_args__ = (
        UniqueConstraint("origen_modulo", "referencia_tipo", "referencia", "tipo",
                         name="uq_presu_afect_ref"),
    )

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    id_partida = Column(BigInteger, nullable=False, index=True)
    tipo = Column(String(15), nullable=False)
    importe = Column(Numeric(18, 2), nullable=False)
    estado = Column(String(15), nullable=False, default="vigente")  # vigente|cerrada|liberada
    id_origen = Column(BigInteger, nullable=True)   # afectación previa de la cadena
    origen_modulo = Column(String(30), nullable=False)      # quién la registró (contaduria, presupuesto…)
    referencia_tipo = Column(String(40), nullable=False)    # p.ej. 'orden_compra'
    referencia = Column(String(80), nullable=False)         # p.ej. 'OC-2027-15'
    observaciones = Column(Text, nullable=True)
    fecha = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    usuario_nombre = Column(String(150), nullable=True)
    liberada_por = Column(String(150), nullable=True)
    fecha_liberacion = Column(DateTime(timezone=True), nullable=True)
    motivo_liberacion = Column(Text, nullable=True)
    activo = Column(Boolean, nullable=False, default=True)
