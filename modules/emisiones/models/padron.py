from sqlalchemy import Column, BigInteger, String, Boolean, DateTime, Integer
from datetime import datetime, timezone

import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", ".."))
from shared.database import Base


class Padron(Base):
    __tablename__ = "emisiones_padrones"

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    id_emision = Column(BigInteger, nullable=False, index=True)
    tipo_tributo = Column(String(50), nullable=False)
    nombre = Column(String(250), nullable=False)
    descripcion = Column(String(500), nullable=True)
    cantidad_registros = Column(Integer, nullable=True, default=0)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))
    activo = Column(Boolean, nullable=False, default=True)


class ContribuyentePadron(Base):
    __tablename__ = "emisiones_padron_contribuyentes"

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    id_padron = Column(BigInteger, nullable=False, index=True)
    id_contribuyente = Column(BigInteger, nullable=False)
    id_objeto_imponible = Column(BigInteger, nullable=True)
    numero_documento = Column(String(50), nullable=True)
    nombre_contribuyente = Column(String(250), nullable=True)
    partida = Column(String(50), nullable=True)
    categoria = Column(String(50), nullable=True)
    zona = Column(String(50), nullable=True)
    estado = Column(String(50), nullable=False, default="pendiente")
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    activo = Column(Boolean, nullable=False, default=True)
