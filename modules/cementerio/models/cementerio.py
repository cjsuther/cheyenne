from sqlalchemy import (
    Column, BigInteger, Integer, String, Boolean, DateTime, Date, Numeric, Text, UniqueConstraint,
)
from datetime import datetime, timezone

import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", ".."))
from shared.database import Base


TIPOS_SEPULTURA = ("nicho", "parcela", "boveda", "tierra")
ESTADOS_SEPULTURA = ("libre", "ocupada", "reservada")
ESTADOS_CONCESION = ("vigente", "vencida", "caduca")
TIPOS_INHUMACION = ("inhumacion", "exhumacion", "reduccion")
ESTADOS_TASA = ("pendiente", "pagada")


class Sepultura(Base):
    __tablename__ = "cementerio_sepulturas"
    __table_args__ = (
        UniqueConstraint("seccion", "fila", "numero", name="uq_cem_sepultura_ubic"),
    )
    id = Column(BigInteger, primary_key=True, autoincrement=True)
    tipo = Column(String(15), nullable=False)          # nicho|parcela|boveda|tierra
    seccion = Column(String(60), nullable=True)
    fila = Column(String(60), nullable=True)
    numero = Column(String(60), nullable=False)
    estado = Column(String(15), nullable=False, default="libre")   # libre|ocupada|reservada
    observaciones = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    activo = Column(Boolean, nullable=False, default=True)


class Concesion(Base):
    __tablename__ = "cementerio_concesiones"
    id = Column(BigInteger, primary_key=True, autoincrement=True)
    id_sepultura = Column(BigInteger, nullable=False, index=True)
    id_contribuyente = Column(BigInteger, nullable=True)   # referencia externa (ingresos/wav) por HTTP
    titular_nombre = Column(String(250), nullable=False)
    titular_documento = Column(String(40), nullable=True)
    fecha_desde = Column(Date, nullable=True)
    fecha_hasta = Column(Date, nullable=True)
    anios = Column(Integer, nullable=True)
    estado = Column(String(15), nullable=False, default="vigente")   # vigente|vencida|caduca
    acto = Column(String(120), nullable=True)              # resolución / decreto de otorgamiento
    observaciones = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    activo = Column(Boolean, nullable=False, default=True)


class Difunto(Base):
    __tablename__ = "cementerio_difuntos"
    id = Column(BigInteger, primary_key=True, autoincrement=True)
    nombre = Column(String(250), nullable=False)
    documento = Column(String(40), nullable=True, index=True)
    fecha_fallecimiento = Column(Date, nullable=True)
    fecha_inhumacion = Column(Date, nullable=True)
    id_sepultura = Column(BigInteger, nullable=True, index=True)   # ubicación actual (última inhumación)
    observaciones = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    activo = Column(Boolean, nullable=False, default=True)


class Inhumacion(Base):
    __tablename__ = "cementerio_inhumaciones"
    id = Column(BigInteger, primary_key=True, autoincrement=True)
    id_difunto = Column(BigInteger, nullable=False, index=True)
    id_sepultura = Column(BigInteger, nullable=False, index=True)
    fecha = Column(Date, nullable=True)
    tipo = Column(String(15), nullable=False, default="inhumacion")   # inhumacion|exhumacion|reduccion
    observaciones = Column(Text, nullable=True)
    registrado_por = Column(String(150), nullable=True)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    activo = Column(Boolean, nullable=False, default=True)


class Traslado(Base):
    __tablename__ = "cementerio_traslados"
    id = Column(BigInteger, primary_key=True, autoincrement=True)
    id_difunto = Column(BigInteger, nullable=False, index=True)
    id_sepultura_origen = Column(BigInteger, nullable=True, index=True)
    id_sepultura_destino = Column(BigInteger, nullable=False, index=True)
    fecha = Column(Date, nullable=True)
    motivo = Column(String(250), nullable=True)
    registrado_por = Column(String(150), nullable=True)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    activo = Column(Boolean, nullable=False, default=True)


class TasaCementerio(Base):
    __tablename__ = "cementerio_tasas"
    id = Column(BigInteger, primary_key=True, autoincrement=True)
    id_concesion = Column(BigInteger, nullable=False, index=True)
    periodo = Column(String(20), nullable=False)          # ej: 2026 o 2026-01
    concepto = Column(String(150), nullable=True)
    importe = Column(Numeric(18, 2), nullable=False, default=0)
    estado = Column(String(15), nullable=False, default="pendiente")   # pendiente|pagada
    vencimiento = Column(Date, nullable=True)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    activo = Column(Boolean, nullable=False, default=True)
