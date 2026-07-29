from sqlalchemy import Column, BigInteger, Integer, String, Boolean, DateTime, Numeric, Text
from datetime import datetime, timezone

import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", ".."))
from shared.database import Base


class RetencionPago(Base):
    """Retención practicada al momento de pagar una OP.
    El importe queda como pasivo a depositar hasta que se marca depositada.
    """
    __tablename__ = "tesoreria_retenciones"
    id = Column(BigInteger, primary_key=True, autoincrement=True)
    id_orden_pago = Column(BigInteger, nullable=False, index=True)
    id_egreso = Column(BigInteger, nullable=True, index=True)
    regimen = Column(String(80), nullable=False)          # p.ej. IVA, Ganancias, IIBB, SUSS
    base = Column(Numeric(18, 2), nullable=False, default=0)
    alicuota = Column(Numeric(9, 4), nullable=False, default=0)   # % (informativo)
    importe = Column(Numeric(18, 2), nullable=False, default=0)
    comprobante = Column(String(80), nullable=True)
    depositada = Column(Boolean, nullable=False, default=False)
    fecha_deposito = Column(DateTime(timezone=True), nullable=True)
    comprobante_deposito = Column(String(80), nullable=True)
    creado_por = Column(String(150), nullable=True)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    activo = Column(Boolean, nullable=False, default=True)


TIPOS_PROG = ("ingreso_previsto", "egreso_previsto")


class ProgramacionCaja(Base):
    """Programación de caja (F47/F48): proyección de flujo previsto por período."""
    __tablename__ = "tesoreria_programacion_caja"
    id = Column(BigInteger, primary_key=True, autoincrement=True)
    anio = Column(Integer, nullable=False, index=True)
    periodo = Column(Integer, nullable=False)             # mes 1..12
    concepto = Column(String(200), nullable=False)
    tipo = Column(String(20), nullable=False)             # ingreso_previsto | egreso_previsto
    importe = Column(Numeric(18, 2), nullable=False, default=0)
    creado_por = Column(String(150), nullable=True)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    activo = Column(Boolean, nullable=False, default=True)


TIPOS_EMBARGO = ("importe", "porcentaje")


class EmbargoBeneficiario(Base):
    """Embargo judicial sobre pagos a un beneficiario. Retiene importe/porcentaje al pagar."""
    __tablename__ = "tesoreria_embargos"
    id = Column(BigInteger, primary_key=True, autoincrement=True)
    id_beneficiario = Column(BigInteger, nullable=False, index=True)
    caratula = Column(String(250), nullable=False)
    juzgado = Column(String(200), nullable=True)
    tipo = Column(String(20), nullable=False, default="importe")   # importe | porcentaje
    importe_o_porcentaje = Column(Numeric(18, 2), nullable=False, default=0)
    retenido_acumulado = Column(Numeric(18, 2), nullable=False, default=0)
    creado_por = Column(String(150), nullable=True)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    activo = Column(Boolean, nullable=False, default=True)


class Poder(Base):
    """Poder/apoderado para cobro por terceros en nombre de un beneficiario."""
    __tablename__ = "tesoreria_poderes"
    id = Column(BigInteger, primary_key=True, autoincrement=True)
    id_beneficiario = Column(BigInteger, nullable=False, index=True)
    apoderado_nombre = Column(String(250), nullable=False)
    apoderado_cuit = Column(String(20), nullable=True)
    vigencia_desde = Column(DateTime(timezone=True), nullable=True)
    vigencia_hasta = Column(DateTime(timezone=True), nullable=True)
    observaciones = Column(Text, nullable=True)
    creado_por = Column(String(150), nullable=True)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    activo = Column(Boolean, nullable=False, default=True)
