from sqlalchemy import (
    Column, BigInteger, Integer, String, Boolean, DateTime, Numeric, JSON, Text, UniqueConstraint, Index,
)
from datetime import datetime, timezone

import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", ".."))
from shared.database import Base


class Partida(Base):
    """Partida presupuestaria: clave de 5 dimensiones (≡ PresupuestoDeGastos del legacy)."""
    __tablename__ = "presupuesto_partidas"
    __table_args__ = (
        UniqueConstraint("anio", "id_jurisdiccion", "id_estructura", "id_objeto_gasto", "id_fuente",
                         name="uq_presu_partida_dims"),
    )

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    anio = Column(Integer, nullable=False, index=True)
    id_jurisdiccion = Column(BigInteger, nullable=False)
    id_estructura = Column(BigInteger, nullable=False)
    id_objeto_gasto = Column(BigInteger, nullable=False)
    id_fuente = Column(BigInteger, nullable=False)
    credito_inicial = Column(Numeric(18, 2), nullable=False, default=0)
    descripcion = Column(String(250), nullable=True)
    etiquetas = Column(JSON, nullable=True)  # clasificadores libres (p.ej. PPG) — decisión #5
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    activo = Column(Boolean, nullable=False, default=True)


# Tipos de movimiento del ledger (DD-01). Las liberaciones se asientan como importe
# negativo del MISMO tipo que liberan (la suma por tipo da el neto directo).
TIPOS_MOVIMIENTO = ("inicial", "modificacion", "preventivo", "compromiso", "devengado", "pagado", "ajuste")


class Movimiento(Base):
    """Ledger presupuestario: fuente única de verdad de los saldos (DD-01)."""
    __tablename__ = "presupuesto_movimientos"
    __table_args__ = (
        Index("ix_presu_mov_partida_tipo", "id_partida", "tipo"),
    )

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    id_partida = Column(BigInteger, nullable=False, index=True)
    fecha = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)
    tipo = Column(String(20), nullable=False)
    importe = Column(Numeric(18, 2), nullable=False)  # con signo
    origen = Column(String(30), nullable=True)         # módulo/pantalla que lo generó
    referencia_tipo = Column(String(40), nullable=True)  # p.ej. 'modificacion', 'orden_compra'
    referencia = Column(String(80), nullable=True)       # p.ej. número de documento
    id_afectacion = Column(BigInteger, nullable=True)    # E5: cadena de afectación
    id_usuario = Column(BigInteger, nullable=True)
    usuario_nombre = Column(String(150), nullable=True)
    observaciones = Column(Text, nullable=True)
    activo = Column(Boolean, nullable=False, default=True)
