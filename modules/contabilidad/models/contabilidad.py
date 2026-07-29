from sqlalchemy import (
    Column, BigInteger, Integer, String, Boolean, DateTime, Numeric, Text, Date, UniqueConstraint,
)
from datetime import datetime, timezone

import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", ".."))
from shared.database import Base


TIPOS_CUENTA = ("activo", "pasivo", "patrimonio", "recurso", "gasto", "orden")


class PlanCuenta(Base):
    """Plan de cuentas contable jerárquico (por id_padre)."""
    __tablename__ = "contabilidad_plan_cuentas"
    __table_args__ = (UniqueConstraint("codigo", name="uq_cont_plan_codigo"),)
    id = Column(BigInteger, primary_key=True, autoincrement=True)
    codigo = Column(String(30), nullable=False)
    nombre = Column(String(250), nullable=False)
    tipo = Column(String(15), nullable=False)          # activo/pasivo/patrimonio/recurso/gasto/orden
    imputable = Column(Boolean, nullable=False, default=True)
    id_padre = Column(BigInteger, nullable=True, index=True)
    nivel = Column(Integer, nullable=False, default=1)
    activo = Column(Boolean, nullable=False, default=True)


ESTADOS_EJERCICIO = ("abierto", "cerrado")


class EjercicioContable(Base):
    __tablename__ = "contabilidad_ejercicios"
    __table_args__ = (UniqueConstraint("anio", name="uq_cont_ejercicio_anio"),)
    id = Column(BigInteger, primary_key=True, autoincrement=True)
    anio = Column(Integer, nullable=False, index=True)
    estado = Column(String(10), nullable=False, default="abierto")   # abierto/cerrado
    fecha_apertura = Column(Date, nullable=True)
    fecha_cierre = Column(Date, nullable=True)


TIPOS_ASIENTO = ("manual", "automatico", "apertura", "cierre")
ESTADOS_ASIENTO = ("borrador", "confirmado", "anulado")


class Asiento(Base):
    """Asiento contable: cabecera de la partida doble."""
    __tablename__ = "contabilidad_asientos"
    __table_args__ = (UniqueConstraint("anio", "numero", name="uq_cont_asiento_numero"),)
    id = Column(BigInteger, primary_key=True, autoincrement=True)
    anio = Column(Integer, nullable=False, index=True)
    numero = Column(Integer, nullable=False)
    fecha = Column(Date, nullable=False)
    tipo = Column(String(15), nullable=False, default="manual")     # manual/automatico/apertura/cierre
    concepto = Column(String(250), nullable=True)
    origen_modulo = Column(String(60), nullable=True, index=True)   # idempotencia de integraciones
    origen_ref = Column(String(120), nullable=True, index=True)
    estado = Column(String(15), nullable=False, default="borrador")  # borrador/confirmado/anulado
    total_debe = Column(Numeric(18, 2), nullable=False, default=0)
    total_haber = Column(Numeric(18, 2), nullable=False, default=0)
    creado_por = Column(String(150), nullable=True)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))


class AsientoItem(Base):
    __tablename__ = "contabilidad_asiento_items"
    id = Column(BigInteger, primary_key=True, autoincrement=True)
    id_asiento = Column(BigInteger, nullable=False, index=True)
    id_cuenta = Column(BigInteger, nullable=False, index=True)
    debe = Column(Numeric(18, 2), nullable=False, default=0)
    haber = Column(Numeric(18, 2), nullable=False, default=0)
    detalle = Column(String(250), nullable=True)
