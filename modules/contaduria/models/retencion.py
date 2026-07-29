from sqlalchemy import (
    Column, BigInteger, String, Boolean, DateTime, Numeric, Text, Index,
)
from datetime import datetime, timezone

import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", ".."))
from shared.database import Base

# Regímenes de retención soportados (RAFAM / AFIP / ARBA)
REGIMENES = ("iibb", "ganancias", "iva", "sijp", "otros")
# Base de cálculo: sobre el neto o sobre el total del comprobante
BASES = ("neto", "total")


class TipoRetencion(Base):
    """Definición de un tipo/régimen de retención (alícuota, base, mínimo no imponible)."""
    __tablename__ = "contaduria_tipos_retencion"

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    codigo = Column(String(30), nullable=False, unique=True)
    nombre = Column(String(150), nullable=False)
    regimen = Column(String(15), nullable=False, default="otros")     # iibb|ganancias|iva|sijp|otros
    alicuota = Column(Numeric(9, 4), nullable=False, default=0)        # porcentaje, ej 3.0000 = 3%
    base = Column(String(10), nullable=False, default="neto")          # neto|total
    minimo_no_imponible = Column(Numeric(18, 2), nullable=True)        # si base < mínimo, no retiene
    activo = Column(Boolean, nullable=False, default=True)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))


class RetencionAplicada(Base):
    """Retención efectivamente calculada y registrada sobre un expediente de gasto."""
    __tablename__ = "contaduria_retenciones_aplicadas"
    __table_args__ = (
        Index("ix_conta_ret_gasto", "id_gasto"),
        Index("ix_conta_ret_periodo", "periodo"),
    )

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    id_gasto = Column(BigInteger, nullable=False)
    id_tipo_retencion = Column(BigInteger, nullable=False)
    # cache de datos del tipo para el reporte/export (evita joins entre módulos)
    tipo_codigo = Column(String(30), nullable=True)
    tipo_nombre = Column(String(150), nullable=True)
    regimen = Column(String(15), nullable=True)
    alicuota = Column(Numeric(9, 4), nullable=True)
    base_calculo = Column(Numeric(18, 2), nullable=False)     # importe base sobre el que se retuvo
    importe = Column(Numeric(18, 2), nullable=False)          # importe retenido
    periodo = Column(String(6), nullable=True)                # AAAAMM
    comprobante = Column(String(80), nullable=True)           # nro. de comprobante/factura asociado
    cuit_beneficiario = Column(String(13), nullable=True)     # para el TXT de AFIP/ARBA
    beneficiario = Column(String(250), nullable=True)
    observaciones = Column(Text, nullable=True)
    creado_por = Column(String(150), nullable=True)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    activo = Column(Boolean, nullable=False, default=True)
