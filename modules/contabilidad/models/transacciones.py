from sqlalchemy import (
    Column, BigInteger, Integer, String, Boolean, DateTime, Numeric, Text, Date, UniqueConstraint,
)
from datetime import datetime, timezone

import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", ".."))
from shared.database import Base


# Estados de una transacción económica recibida de un módulo:
#   imputada   -> se generó el asiento
#   sin_regla  -> no hay regla de imputación para su tipo (bandeja de definición)
#   error      -> hay regla pero no se pudo resolver (falta mapeo de cuenta, no balancea, etc.)
#   anulada
ESTADOS_TX = ("imputada", "sin_regla", "error", "anulada")


class Transaccion(Base):
    """Hecho económico crudo posteado por un módulo. El contable decide cómo convertirlo en asiento."""
    __tablename__ = "contabilidad_transacciones"
    __table_args__ = (UniqueConstraint("origen_modulo", "origen_ref", name="uq_cont_tx_origen"),)
    id = Column(BigInteger, primary_key=True, autoincrement=True)
    origen_modulo = Column(String(60), nullable=False, index=True)
    origen_ref = Column(String(150), nullable=False, index=True)   # idempotencia
    tipo = Column(String(80), nullable=False, index=True)          # ej: gasto.devengado
    fecha = Column(Date, nullable=True)
    importe = Column(Numeric(18, 2), nullable=False, default=0)
    concepto = Column(String(250), nullable=True)
    contexto = Column(Text, nullable=True)                         # JSON con las dimensiones del hecho
    estado = Column(String(15), nullable=False, default="sin_regla", index=True)
    motivo = Column(String(400), nullable=True)                    # por qué quedó pendiente/error
    id_asiento = Column(BigInteger, nullable=True)
    creado_por = Column(String(150), nullable=True)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))


class ReglaImputacion(Base):
    """Plantilla de asiento para un tipo de transacción. Definida por el contable."""
    __tablename__ = "contabilidad_reglas_imputacion"
    __table_args__ = (UniqueConstraint("tipo", name="uq_cont_regla_tipo"),)
    id = Column(BigInteger, primary_key=True, autoincrement=True)
    tipo = Column(String(80), nullable=False)
    descripcion = Column(String(250), nullable=True)
    activo = Column(Boolean, nullable=False, default=True)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))


class ReglaLinea(Base):
    """Una línea de la plantilla de imputación."""
    __tablename__ = "contabilidad_regla_lineas"
    id = Column(BigInteger, primary_key=True, autoincrement=True)
    id_regla = Column(BigInteger, nullable=False, index=True)
    orden = Column(Integer, nullable=False, default=1)
    lado = Column(String(5), nullable=False)                       # debe / haber
    origen_cuenta = Column(String(10), nullable=False, default="fija")   # fija / derivada
    cuenta_codigo = Column(String(30), nullable=True)             # si origen_cuenta = fija
    dimension = Column(String(60), nullable=True)                 # si derivada: clave del contexto para el mapeo
    importe_campo = Column(String(60), nullable=False, default="importe")  # "importe" o una clave del contexto
    detalle = Column(String(250), nullable=True)


class MapeoCuenta(Base):
    """Tabla de derivación de cuentas: (dimensión, clave) -> código de cuenta.
    Ej: (objeto_gasto, '3.4.2') -> 5.1.04 ; (tributo, 'TSG') -> 4.1.02."""
    __tablename__ = "contabilidad_mapeo_cuentas"
    __table_args__ = (UniqueConstraint("dimension", "clave", name="uq_cont_mapeo"),)
    id = Column(BigInteger, primary_key=True, autoincrement=True)
    dimension = Column(String(60), nullable=False)
    clave = Column(String(120), nullable=False)
    cuenta_codigo = Column(String(30), nullable=False)
    activo = Column(Boolean, nullable=False, default=True)
