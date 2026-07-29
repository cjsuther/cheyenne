from sqlalchemy import Column, BigInteger, String, Integer, Numeric, Boolean, DateTime, ForeignKey
from datetime import datetime, timezone

import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", ".."))
from shared.database import Base


class ServicioMedido(Base):
    __tablename__ = "ingresos_publicos_servicios_medidos"

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    id_cuenta = Column(BigInteger, nullable=True)
    tipo = Column(String(20), nullable=False)  # agua | cloaca | luz
    medidor_numero = Column(String(50), nullable=True)
    tarifa = Column(Numeric(18, 2), nullable=False, default=0)  # importe por unidad de consumo
    activo = Column(Boolean, nullable=False, default=True)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)


class LecturaMedidor(Base):
    __tablename__ = "ingresos_publicos_lecturas_medidor"

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    id_servicio = Column(BigInteger, ForeignKey("ingresos_publicos_servicios_medidos.id"), nullable=False)
    periodo = Column(Integer, nullable=False)  # AAAAMM
    lectura_anterior = Column(Numeric(18, 2), nullable=False, default=0)
    lectura_actual = Column(Numeric(18, 2), nullable=False, default=0)
    consumo = Column(Numeric(18, 2), nullable=False, default=0)
    importe = Column(Numeric(18, 2), nullable=False, default=0)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)
