from sqlalchemy import Column, BigInteger, String, Integer, DateTime, Boolean, func

import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", ".."))
from shared.database import Base


class EventoAuditoria(Base):
    """Rastro de accesos: un registro por request HTTP servido por cualquier módulo."""

    __tablename__ = "auditoria_eventos"

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    fecha = Column(DateTime(timezone=True), server_default=func.now(), nullable=False, index=True)
    modulo = Column(String(50), nullable=True, index=True)
    metodo = Column(String(10), nullable=True)
    path = Column(String(500), nullable=True)
    status_code = Column(Integer, nullable=True)
    id_usuario = Column(BigInteger, nullable=True)
    usuario = Column(String(150), nullable=True)
    ip = Column(String(64), nullable=True)
    duracion_ms = Column(Integer, nullable=True)
    activo = Column(Boolean, nullable=False, default=True)
    # Integridad: cadena de hash encadenado (blockchain-like). Cada evento
    # encadena el sha256 del evento anterior; alterar un evento rompe la cadena.
    hash = Column(String(64), nullable=True, index=True)
    hash_anterior = Column(String(64), nullable=True)
