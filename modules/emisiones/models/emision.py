from sqlalchemy import Column, BigInteger, String, Integer, Boolean, DateTime, Numeric, Text, JSON
from datetime import datetime, timezone

import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", ".."))
from shared.database import Base


class Emision(Base):
    __tablename__ = "emisiones_emisiones"

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    tipo_tributo = Column(String(50), nullable=False)
    periodo = Column(String(20), nullable=False)
    ttas_tasa = Column(Integer, nullable=True, index=True)      # tasa del catálogo a liquidar
    ttas_subtasa = Column(Integer, nullable=True, default=0)
    descripcion = Column(String(500), nullable=True)
    fecha_emision = Column(DateTime(timezone=True), nullable=True)
    fecha_vencimiento_1 = Column(DateTime(timezone=True), nullable=True)
    fecha_vencimiento_2 = Column(DateTime(timezone=True), nullable=True)
    estado = Column(String(50), nullable=False, default="borrador")
    paso_actual = Column(Integer, nullable=False, default=0)
    id_usuario_creador = Column(BigInteger, nullable=True)
    id_usuario_aprobador = Column(BigInteger, nullable=True)
    fecha_aprobacion = Column(DateTime(timezone=True), nullable=True)
    observaciones_aprobacion = Column(Text, nullable=True)
    cantidad_contribuyentes = Column(Integer, nullable=True, default=0)
    monto_total = Column(Numeric(18, 2), nullable=True, default=0)
    parametros = Column(JSON, nullable=True)
    numero = Column(String(50), nullable=True)
    codigo_delegacion = Column(String(20), nullable=True)
    id_numeracion = Column(BigInteger, nullable=True)
    id_procedimiento = Column(BigInteger, nullable=True)
    id_emision_base = Column(BigInteger, nullable=True)
    procesa_planes = Column(Boolean, nullable=False, default=False)
    procesa_rubros = Column(Boolean, nullable=False, default=False)
    procesa_elementos = Column(Boolean, nullable=False, default=False)
    calculo_mostrador_web = Column(Boolean, nullable=False, default=False)
    calculo_masivo = Column(Boolean, nullable=False, default=False)
    calculo_pago_anticipado = Column(Boolean, nullable=False, default=False)
    calculo_prueba = Column(Boolean, nullable=False, default=False)
    imprime_recibos = Column(Boolean, nullable=False, default=False)
    aplica_debito_automatico = Column(Boolean, nullable=False, default=False)
    fecha_reliquidacion_desde = Column(DateTime(timezone=True), nullable=True)
    fecha_reliquidacion_hasta = Column(DateTime(timezone=True), nullable=True)
    fecha_ejecucion_inicio = Column(DateTime(timezone=True), nullable=True)
    fecha_ejecucion_fin = Column(DateTime(timezone=True), nullable=True)
    modulo = Column(String(50), nullable=True)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))
    activo = Column(Boolean, nullable=False, default=True)
