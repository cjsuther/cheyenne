from sqlalchemy import (
    Column, BigInteger, Integer, String, Boolean, DateTime, Numeric, Text, JSON, UniqueConstraint,
)
from datetime import datetime, timezone

import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", ".."))
from shared.database import Base

# Estados del expediente = etapas del ciclo del gasto RAFAM
ESTADOS = ("preventivado", "comprometido", "devengado", "pagado", "anulado")


class GastoExpediente(Base):
    """Expediente de gasto: recorre Preventivo → Compromiso → Devengado → Pagado,
    afectando el presupuesto por HTTP (API de afectación del módulo presupuesto)."""
    __tablename__ = "contaduria_gastos"
    __table_args__ = (UniqueConstraint("anio", "numero", name="uq_conta_gasto_numero"),)

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    anio = Column(Integer, nullable=False, index=True)
    numero = Column(Integer, nullable=False)
    descripcion = Column(String(250), nullable=False)
    proveedor = Column(String(250), nullable=True)
    id_partida = Column(BigInteger, nullable=False)         # partida del módulo presupuesto (por API)
    partida_etiqueta = Column(String(250), nullable=True)   # cache de las dimensiones para mostrar
    importe = Column(Numeric(18, 2), nullable=False)
    estado = Column(String(15), nullable=False, default="preventivado")
    id_afectacion_actual = Column(BigInteger, nullable=True)  # última afectación en presupuesto
    oc_numero = Column(String(80), nullable=True)
    factura_numero = Column(String(80), nullable=True)
    op_numero = Column(String(80), nullable=True)
    # historial: [{etapa, usuario, fecha, referencia, importe, id_afectacion}]
    historial = Column(JSON, nullable=True)
    observaciones = Column(Text, nullable=True)
    creado_por = Column(String(150), nullable=True)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    activo = Column(Boolean, nullable=False, default=True)
