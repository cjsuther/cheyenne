from sqlalchemy import Column, BigInteger, String, Integer, DateTime, Boolean, Text, func

import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", ".."))
from shared.database import Base


# Tipos de condición soportados por el motor de evaluación.
TIPOS_CONDICION = ("login_fallido", "borrado_masivo", "error_5xx", "permiso_denegado")


class ReglaAlerta(Base):
    """Regla proactiva: define un patrón crítico a vigilar sobre los eventos.

    Si en la ventana temporal se supera el umbral de ocurrencias del patrón,
    se dispara una alerta (AlertaDisparada) y se notifica por el canal indicado."""

    __tablename__ = "auditoria_reglas_alerta"

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    codigo = Column(String(50), nullable=False, unique=True, index=True)
    descripcion = Column(String(300), nullable=True)
    # login_fallido | borrado_masivo | error_5xx | permiso_denegado
    condicion = Column(String(30), nullable=False)
    umbral = Column(Integer, nullable=False, default=5)
    ventana_minutos = Column(Integer, nullable=False, default=10)
    canal = Column(String(50), nullable=False, default="email")  # email | interno | webhook
    activo = Column(Boolean, nullable=False, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)


class AlertaDisparada(Base):
    """Registro histórico de una regla que se disparó al superar su umbral."""

    __tablename__ = "auditoria_alertas_disparadas"

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    id_regla = Column(BigInteger, nullable=False, index=True)
    codigo_regla = Column(String(50), nullable=True)
    condicion = Column(String(30), nullable=True)
    fecha = Column(DateTime(timezone=True), server_default=func.now(), nullable=False, index=True)
    detalle = Column(Text, nullable=True)
    cantidad = Column(Integer, nullable=False, default=0)
    notificado = Column(Boolean, nullable=False, default=False)
    activo = Column(Boolean, nullable=False, default=True)
