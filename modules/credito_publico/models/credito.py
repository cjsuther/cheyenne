from sqlalchemy import (
    Column, BigInteger, Integer, String, Boolean, DateTime, Date, Numeric, UniqueConstraint,
)
from datetime import datetime, timezone

import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", ".."))
from shared.database import Base


TIPOS_DEUDA = ("prestamo", "bono", "adelanto", "otro")
ESTADOS_EMP = ("vigente", "cancelado", "en_mora")
SISTEMAS = ("frances", "aleman")


class Emprestito(Base):
    """Empréstito / deuda pública: capital tomado y su servicio (amortización + intereses)."""
    __tablename__ = "credito_emprestitos"
    __table_args__ = (UniqueConstraint("codigo", name="uq_cred_emp_codigo"),)
    id = Column(BigInteger, primary_key=True, autoincrement=True)
    codigo = Column(String(40), nullable=False)
    denominacion = Column(String(250), nullable=False)
    acreedor = Column(String(200), nullable=True)
    moneda = Column(String(10), nullable=False, default="ARS")
    tipo = Column(String(15), nullable=False, default="prestamo")
    monto_original = Column(Numeric(18, 2), nullable=False, default=0)
    tasa_anual = Column(Numeric(9, 4), nullable=False, default=0)   # % anual
    plazo_meses = Column(Integer, nullable=False, default=0)
    sistema = Column(String(10), nullable=False, default="frances")
    fecha_toma = Column(Date, nullable=True)
    saldo_capital = Column(Numeric(18, 2), nullable=False, default=0)
    desembolsado = Column(Numeric(18, 2), nullable=False, default=0)
    estado = Column(String(12), nullable=False, default="vigente")
    creado_por = Column(String(150), nullable=True)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    activo = Column(Boolean, nullable=False, default=True)


ESTADOS_CUOTA = ("pendiente", "pagada")


class CuotaEmprestito(Base):
    """Cuota del cronograma de amortización de un empréstito."""
    __tablename__ = "credito_cuotas"
    id = Column(BigInteger, primary_key=True, autoincrement=True)
    id_emprestito = Column(BigInteger, nullable=False, index=True)
    numero = Column(Integer, nullable=False)
    fecha_vencimiento = Column(Date, nullable=True)
    capital = Column(Numeric(18, 2), nullable=False, default=0)
    interes = Column(Numeric(18, 2), nullable=False, default=0)
    total = Column(Numeric(18, 2), nullable=False, default=0)
    saldo_posterior = Column(Numeric(18, 2), nullable=False, default=0)
    estado = Column(String(12), nullable=False, default="pendiente")
    fecha_pago = Column(Date, nullable=True)


class Desembolso(Base):
    """Desembolso del empréstito (entrada de fondos)."""
    __tablename__ = "credito_desembolsos"
    id = Column(BigInteger, primary_key=True, autoincrement=True)
    id_emprestito = Column(BigInteger, nullable=False, index=True)
    fecha = Column(Date, nullable=True)
    importe = Column(Numeric(18, 2), nullable=False, default=0)
    estado = Column(String(12), nullable=False, default="real")   # estimado | real
    detalle = Column(String(250), nullable=True)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
