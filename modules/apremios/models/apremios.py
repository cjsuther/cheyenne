from sqlalchemy import (
    Column, BigInteger, String, Boolean, DateTime, Numeric, Text,
)
from datetime import datetime, timezone

import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", ".."))
from shared.database import Base


# Circuito de estados del juicio de apremio
ESTADOS_JUICIO = ("iniciado", "mandamiento", "embargo", "sentencia", "cobrado", "archivado")

# Transiciones válidas del circuito procesal
TRANSICIONES = {
    "iniciado": ("mandamiento", "archivado"),
    "mandamiento": ("embargo", "sentencia", "archivado"),
    "embargo": ("sentencia", "cobrado", "archivado"),
    "sentencia": ("cobrado", "embargo", "archivado"),
    "cobrado": ("archivado",),
    "archivado": (),
}

TIPOS_EMBARGO = ("inmueble", "vehiculo", "cuenta", "sueldo")


class Juicio(Base):
    """Juicio de apremio: gestión judicial de deuda de un contribuyente."""
    __tablename__ = "apremios_juicios"
    id = Column(BigInteger, primary_key=True, autoincrement=True)
    id_contribuyente = Column(BigInteger, nullable=True, index=True)
    contribuyente_nombre = Column(String(250), nullable=True)
    caratula = Column(String(300), nullable=False)
    juzgado = Column(String(200), nullable=True, index=True)
    deuda_capital = Column(Numeric(18, 2), nullable=False, default=0)
    deuda_actualizada = Column(Numeric(18, 2), nullable=False, default=0)
    estado = Column(String(20), nullable=False, default="iniciado", index=True)
    fecha_inicio = Column(DateTime(timezone=True), nullable=True)
    expediente_judicial = Column(String(120), nullable=True)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    activo = Column(Boolean, nullable=False, default=True)


class ActoProcesal(Base):
    """Acto procesal: hito del expediente (línea de tiempo del juicio)."""
    __tablename__ = "apremios_actos_procesales"
    id = Column(BigInteger, primary_key=True, autoincrement=True)
    id_juicio = Column(BigInteger, nullable=False, index=True)
    tipo = Column(String(60), nullable=False)
    fecha = Column(DateTime(timezone=True), nullable=True)
    detalle = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    activo = Column(Boolean, nullable=False, default=True)


class EmbargoJudicial(Base):
    """Embargo trabado sobre un bien del contribuyente demandado."""
    __tablename__ = "apremios_embargos"
    id = Column(BigInteger, primary_key=True, autoincrement=True)
    id_juicio = Column(BigInteger, nullable=False, index=True)
    tipo = Column(String(20), nullable=False)  # inmueble|vehiculo|cuenta|sueldo
    bien_descripcion = Column(String(300), nullable=True)
    importe = Column(Numeric(18, 2), nullable=False, default=0)
    estado = Column(String(30), nullable=False, default="trabado")
    fecha = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    activo = Column(Boolean, nullable=False, default=True)


class Honorario(Base):
    """Honorarios del profesional actuante en el juicio."""
    __tablename__ = "apremios_honorarios"
    id = Column(BigInteger, primary_key=True, autoincrement=True)
    id_juicio = Column(BigInteger, nullable=False, index=True)
    profesional = Column(String(200), nullable=False)
    porcentaje = Column(Numeric(18, 2), nullable=False, default=0)
    importe = Column(Numeric(18, 2), nullable=False, default=0)
    pagado = Column(Boolean, nullable=False, default=False)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    activo = Column(Boolean, nullable=False, default=True)


class Mandamiento(Base):
    """Mandamiento de intimación/embargo diligenciado por el oficial de justicia."""
    __tablename__ = "apremios_mandamientos"
    id = Column(BigInteger, primary_key=True, autoincrement=True)
    id_juicio = Column(BigInteger, nullable=False, index=True)
    fecha = Column(DateTime(timezone=True), nullable=True)
    oficial = Column(String(200), nullable=True)
    resultado = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    activo = Column(Boolean, nullable=False, default=True)
