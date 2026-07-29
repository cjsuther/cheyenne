from sqlalchemy import (
    Column, BigInteger, Integer, String, Boolean, DateTime, Date, Numeric, Text, UniqueConstraint,
)
from datetime import datetime, timezone

import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", ".."))
from shared.database import Base


TIPOS_BIEN = ("mueble", "inmueble", "rodado", "informatico", "otro")
ESTADOS_BIEN = ("alta", "baja", "transferido")
ORIGENES = ("compra", "donacion", "construccion", "otro")


class Bien(Base):
    """Bien de uso patrimonial: alta, amortización lineal y baja."""
    __tablename__ = "patrimonio_bienes"
    __table_args__ = (UniqueConstraint("codigo", name="uq_patr_bien_codigo"),)
    id = Column(BigInteger, primary_key=True, autoincrement=True)
    codigo = Column(String(40), nullable=False)
    denominacion = Column(String(250), nullable=False)
    tipo = Column(String(15), nullable=False, default="mueble")
    dependencia = Column(String(150), nullable=True)          # oficina responsable
    responsable = Column(String(150), nullable=True)
    origen = Column(String(15), nullable=False, default="compra")
    id_orden_compra = Column(BigInteger, nullable=True)       # si vino de una recepción de Compras
    fecha_alta = Column(Date, nullable=True)
    valor_origen = Column(Numeric(18, 2), nullable=False, default=0)
    valor_residual = Column(Numeric(18, 2), nullable=False, default=0)   # valor de rezago
    vida_util_meses = Column(Integer, nullable=False, default=0)         # 0 = no amortizable
    amortizacion_acumulada = Column(Numeric(18, 2), nullable=False, default=0)
    estado = Column(String(15), nullable=False, default="alta")
    creado_por = Column(String(150), nullable=True)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    activo = Column(Boolean, nullable=False, default=True)


TIPOS_MOV = ("alta", "amortizacion", "pase", "baja", "revaluo")


class MovimientoBien(Base):
    """Historial del bien: alta, amortizaciones mensuales, pases entre dependencias, bajas."""
    __tablename__ = "patrimonio_movimientos"
    id = Column(BigInteger, primary_key=True, autoincrement=True)
    id_bien = Column(BigInteger, nullable=False, index=True)
    tipo = Column(String(15), nullable=False)
    fecha = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    periodo = Column(String(7), nullable=True)                # YYYY-MM (amortización)
    importe = Column(Numeric(18, 2), nullable=True)
    dependencia_origen = Column(String(150), nullable=True)
    dependencia_destino = Column(String(150), nullable=True)
    detalle = Column(String(300), nullable=True)
    usuario_nombre = Column(String(150), nullable=True)
