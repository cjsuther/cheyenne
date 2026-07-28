from sqlalchemy import Column, BigInteger, Integer, String, Boolean, DateTime, Numeric, Text, UniqueConstraint
from datetime import datetime, timezone

import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", ".."))
from shared.database import Base


class Beneficiario(Base):
    __tablename__ = "tesoreria_beneficiarios"
    __table_args__ = (UniqueConstraint("codigo", name="uq_tes_benef_codigo"),)
    id = Column(BigInteger, primary_key=True, autoincrement=True)
    codigo = Column(String(30), nullable=False)
    nombre = Column(String(250), nullable=False)
    cuit = Column(String(20), nullable=True)
    cbu = Column(String(30), nullable=True)
    activo = Column(Boolean, nullable=False, default=True)


class CuentaBancaria(Base):
    __tablename__ = "tesoreria_cuentas_bancarias"
    id = Column(BigInteger, primary_key=True, autoincrement=True)
    banco = Column(String(120), nullable=False)
    numero = Column(String(50), nullable=False)
    tipo = Column(String(30), nullable=True)          # cuenta corriente / caja de ahorro
    descripcion = Column(String(150), nullable=True)
    saldo_inicial = Column(Numeric(18, 2), nullable=False, default=0)
    activo = Column(Boolean, nullable=False, default=True)


ESTADOS_OP = ("pendiente", "pagada", "anulada")


class OrdenPago(Base):
    """Orden de pago: emitida (por Contaduría o manual) y ejecutada por Tesorería."""
    __tablename__ = "tesoreria_ordenes_pago"
    __table_args__ = (UniqueConstraint("anio", "numero", name="uq_tes_op_numero"),)
    id = Column(BigInteger, primary_key=True, autoincrement=True)
    anio = Column(Integer, nullable=False, index=True)
    numero = Column(Integer, nullable=False)
    id_beneficiario = Column(BigInteger, nullable=True)
    beneficiario_nombre = Column(String(250), nullable=True)   # cache/manual
    importe = Column(Numeric(18, 2), nullable=False)
    concepto = Column(String(250), nullable=True)
    estado = Column(String(15), nullable=False, default="pendiente")
    origen = Column(String(30), nullable=False, default="manual")     # manual | contaduria
    referencia_externa = Column(String(80), nullable=True)            # p.ej. expediente GEX
    creado_por = Column(String(150), nullable=True)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    activo = Column(Boolean, nullable=False, default=True)


MEDIOS_PAGO = ("efectivo", "cheque", "transferencia", "orden_bancaria")


class Egreso(Base):
    """Pago efectivo de una OP: el dinero que sale (parte diario de egresos)."""
    __tablename__ = "tesoreria_egresos"
    id = Column(BigInteger, primary_key=True, autoincrement=True)
    id_orden_pago = Column(BigInteger, nullable=False, index=True)
    medio = Column(String(20), nullable=False)
    id_cuenta_bancaria = Column(BigInteger, nullable=True)
    numero_cheque = Column(String(40), nullable=True)
    importe = Column(Numeric(18, 2), nullable=False)
    fecha = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    usuario_nombre = Column(String(150), nullable=True)
    observaciones = Column(Text, nullable=True)
    activo = Column(Boolean, nullable=False, default=True)
