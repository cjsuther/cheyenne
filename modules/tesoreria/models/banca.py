from sqlalchemy import Column, BigInteger, Integer, String, Boolean, DateTime, Date, Numeric, Text
from datetime import datetime, timezone

import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", ".."))
from shared.database import Base


# ── Cheques ──────────────────────────────────────────────────────────
class Chequera(Base):
    """Talonario de cheques de una cuenta: numeración correlativa."""
    __tablename__ = "tesoreria_chequeras"
    id = Column(BigInteger, primary_key=True, autoincrement=True)
    id_cuenta_bancaria = Column(BigInteger, nullable=False, index=True)
    descripcion = Column(String(150), nullable=True)
    numero_desde = Column(Integer, nullable=False)
    numero_hasta = Column(Integer, nullable=False)
    proximo_numero = Column(Integer, nullable=False)
    activo = Column(Boolean, nullable=False, default=True)


ESTADOS_CHEQUE = ("emitido", "entregado", "cobrado", "anulado", "rechazado")


class Cheque(Base):
    """Cheque librado contra una cuenta. Puede ser común o diferido y estar ligado a una OP."""
    __tablename__ = "tesoreria_cheques"
    id = Column(BigInteger, primary_key=True, autoincrement=True)
    id_cuenta_bancaria = Column(BigInteger, nullable=False, index=True)
    id_chequera = Column(BigInteger, nullable=True)
    numero = Column(String(40), nullable=False)
    importe = Column(Numeric(18, 2), nullable=False)
    beneficiario_nombre = Column(String(250), nullable=True)
    id_orden_pago = Column(BigInteger, nullable=True, index=True)
    id_egreso = Column(BigInteger, nullable=True)               # egreso generado al pagar la OP
    diferido = Column(Boolean, nullable=False, default=False)
    fecha_emision = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    fecha_pago = Column(Date, nullable=True)                    # fecha de cobro previsto (diferido)
    estado = Column(String(15), nullable=False, default="emitido")
    creado_por = Column(String(150), nullable=True)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    activo = Column(Boolean, nullable=False, default=True)


# ── Órdenes bancarias / archivo de transferencias ────────────────────
ESTADOS_OB = ("preparada", "enviada", "confirmada", "anulada")


class OrdenBancaria(Base):
    """Lote de transferencias a enviar al banco (archivo). Agrupa varias OP pendientes."""
    __tablename__ = "tesoreria_ordenes_bancarias"
    id = Column(BigInteger, primary_key=True, autoincrement=True)
    id_cuenta_bancaria = Column(BigInteger, nullable=False, index=True)
    fecha = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    descripcion = Column(String(200), nullable=True)
    estado = Column(String(15), nullable=False, default="preparada")
    total = Column(Numeric(18, 2), nullable=False, default=0)
    creado_por = Column(String(150), nullable=True)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    activo = Column(Boolean, nullable=False, default=True)


class OrdenBancariaItem(Base):
    __tablename__ = "tesoreria_orden_bancaria_items"
    id = Column(BigInteger, primary_key=True, autoincrement=True)
    id_orden_bancaria = Column(BigInteger, nullable=False, index=True)
    id_orden_pago = Column(BigInteger, nullable=False)
    beneficiario_nombre = Column(String(250), nullable=True)
    cbu = Column(String(30), nullable=True)
    importe = Column(Numeric(18, 2), nullable=False)


# ── Conciliación bancaria ────────────────────────────────────────────
class ExtractoBancario(Base):
    """Extracto/resumen del banco de un período, contra el que se concilia."""
    __tablename__ = "tesoreria_extractos"
    id = Column(BigInteger, primary_key=True, autoincrement=True)
    id_cuenta_bancaria = Column(BigInteger, nullable=False, index=True)
    periodo = Column(String(7), nullable=False)                # 'YYYY-MM'
    saldo_inicial = Column(Numeric(18, 2), nullable=False, default=0)
    saldo_final = Column(Numeric(18, 2), nullable=False, default=0)
    creado_por = Column(String(150), nullable=True)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    activo = Column(Boolean, nullable=False, default=True)


class ExtractoMovimiento(Base):
    """Movimiento del extracto. importe con signo: negativo = débito, positivo = crédito."""
    __tablename__ = "tesoreria_extracto_movimientos"
    id = Column(BigInteger, primary_key=True, autoincrement=True)
    id_extracto = Column(BigInteger, nullable=False, index=True)
    fecha = Column(Date, nullable=True)
    descripcion = Column(String(250), nullable=True)
    importe = Column(Numeric(18, 2), nullable=False)
    conciliado = Column(Boolean, nullable=False, default=False)
    id_egreso = Column(BigInteger, nullable=True)              # egreso del sistema con el que se casó
    activo = Column(Boolean, nullable=False, default=True)
