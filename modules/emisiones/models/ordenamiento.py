from sqlalchemy import Column, BigInteger, String, Boolean, DateTime, Integer, JSON
from datetime import datetime, timezone

import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", ".."))
from shared.database import Base


class Ordenamiento(Base):
    __tablename__ = "emisiones_ordenamientos"

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    id_emision = Column(BigInteger, nullable=False, index=True)
    nombre = Column(String(250), nullable=False)
    descripcion = Column(String(500), nullable=True)
    tipo = Column(String(50), nullable=False, default="secuencial")
    cantidad_items = Column(Integer, nullable=True, default=0)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))
    activo = Column(Boolean, nullable=False, default=True)


class OrdenamientoItem(Base):
    __tablename__ = "emisiones_ordenamiento_items"

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    id_ordenamiento = Column(BigInteger, nullable=False, index=True)
    id_liquidacion = Column(BigInteger, nullable=True)
    id_contribuyente = Column(BigInteger, nullable=True)
    numero_orden = Column(Integer, nullable=False)
    criterio_detalle = Column(JSON, nullable=True)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    activo = Column(Boolean, nullable=False, default=True)
