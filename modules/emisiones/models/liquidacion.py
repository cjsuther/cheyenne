from sqlalchemy import Column, BigInteger, String, Boolean, DateTime, Numeric, Integer, JSON
from datetime import datetime, timezone

import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", ".."))
from shared.database import Base


class Liquidacion(Base):
    __tablename__ = "emisiones_liquidaciones"

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    id_emision = Column(BigInteger, nullable=False, index=True)
    id_contribuyente = Column(BigInteger, nullable=False)
    id_objeto_imponible = Column(BigInteger, nullable=True)
    tipo = Column(String(50), nullable=False)
    periodo = Column(String(20), nullable=True)
    cuota = Column(Integer, nullable=True)
    # liquidación por fórmula/vencimiento (port de CalcPagos): a_cancelar = deuda imputada a la
    # cuenta corriente ; a_pagar = importe efectivo del recibo en ese vencimiento.
    id_tasa = Column(Integer, nullable=True, index=True)
    id_sub_tasa = Column(Integer, nullable=True)
    fort_numero = Column(Integer, nullable=True)
    numero_vencimiento = Column(Integer, nullable=True)
    a_cancelar = Column(Numeric(18, 2), nullable=True, default=0)
    a_pagar = Column(Numeric(18, 2), nullable=True, default=0)
    base_imponible = Column(Numeric(18, 2), nullable=True, default=0)
    alicuota = Column(Numeric(10, 4), nullable=True, default=0)
    monto_calculado = Column(Numeric(18, 2), nullable=True, default=0)
    monto_bonificacion = Column(Numeric(18, 2), nullable=True, default=0)
    monto_recargo = Column(Numeric(18, 2), nullable=True, default=0)
    monto_final = Column(Numeric(18, 2), nullable=True, default=0)
    fecha_vencimiento_1 = Column(DateTime(timezone=True), nullable=True)
    fecha_vencimiento_2 = Column(DateTime(timezone=True), nullable=True)
    estado = Column(String(50), nullable=False, default="calculada")
    numero_comprobante = Column(String(50), nullable=True)
    detalle_calculo = Column(JSON, nullable=True)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))
    activo = Column(Boolean, nullable=False, default=True)
