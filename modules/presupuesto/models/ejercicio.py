from sqlalchemy import Column, BigInteger, Integer, String, Boolean, DateTime, JSON, UniqueConstraint
from datetime import datetime, timezone

import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", ".."))
from shared.database import Base

# Estados del workflow (diseño §7.1)
ESTADOS = ("formulacion", "aprobado", "vigente", "cerrado")


class Ejercicio(Base):
    __tablename__ = "presupuesto_ejercicios"
    __table_args__ = (UniqueConstraint("anio", name="uq_presu_ejercicio_anio"),)

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    anio = Column(Integer, nullable=False, index=True)
    estado = Column(String(20), nullable=False, default="formulacion")
    control_sobregiro = Column(String(10), nullable=False, default="bloquear")  # bloquear|advertir
    acto_administrativo = Column(String(120), nullable=True)  # decreto/ordenanza de aprobación
    fecha_aprobacion = Column(DateTime(timezone=True), nullable=True)
    # historial de transiciones: [{accion, usuario, usuario_nombre, fecha, observaciones}]
    historial = Column(JSON, nullable=True)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    activo = Column(Boolean, nullable=False, default=True)
