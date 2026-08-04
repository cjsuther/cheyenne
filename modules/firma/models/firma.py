from sqlalchemy import (
    Column, BigInteger, Integer, String, Boolean, DateTime, UniqueConstraint, ForeignKey,
)
from datetime import datetime, timezone

import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", ".."))
from shared.database import Base


ESTADOS_DOC = ("pendiente", "firmado", "anulado")
ESTADOS_FIRMA = ("valida", "invalida")


class DocumentoFirmable(Base):
    """Documento registrado por otro módulo para ser firmado (firma múltiple y secuencial).

    Modela el circuito RAFAM: p.ej. una Orden de Pago de Tesorería que requiere N firmas
    (ordenador, contador, tesorero…). Cada documento es idempotente por (origen_modulo, origen_ref).
    """
    __tablename__ = "firma_documentos"
    __table_args__ = (
        UniqueConstraint("origen_modulo", "origen_ref", name="uq_firma_doc_origen"),
    )
    id = Column(BigInteger, primary_key=True, autoincrement=True)
    origen_modulo = Column(String(50), nullable=False)     # ej 'tesoreria'
    origen_tipo = Column(String(50), nullable=False)       # ej 'orden_pago'
    origen_ref = Column(String(80), nullable=False)        # id/numero del doc en el modulo de origen
    titulo = Column(String(300), nullable=False)
    descripcion = Column(String(1000), nullable=True)
    archivo_nombre = Column(String(300), nullable=True)
    contenido_hash = Column(String(64), nullable=True)     # sha256 del contenido si el modulo lo manda
    cantidad_firmas = Column(Integer, nullable=False, default=1)  # firmas requeridas
    id_oficina = Column(BigInteger, nullable=True)         # para la bandeja
    id_usuario_creador = Column(BigInteger, nullable=True)
    estado = Column(String(12), nullable=False, default="pendiente")  # pendiente|firmado|anulado
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    activo = Column(Boolean, nullable=False, default=True)


class Firma(Base):
    """Firma electrónica de registro puesta por un usuario sobre un documento, en un orden dado."""
    __tablename__ = "firma_firmas"
    id = Column(BigInteger, primary_key=True, autoincrement=True)
    id_documento = Column(BigInteger, ForeignKey("firma_documentos.id"), nullable=False, index=True)
    orden_firma = Column(Integer, nullable=False)          # 1..N
    id_usuario = Column(BigInteger, nullable=False)
    firmante_nombre = Column(String(200), nullable=False)
    firmante_documento = Column(String(60), nullable=True)
    computadora = Column(String(120), nullable=True)
    fecha_hora = Column(DateTime(timezone=True), nullable=False,
                        default=lambda: datetime.now(timezone.utc))
    hash_firma = Column(String(128), nullable=False)
    estado = Column(String(12), nullable=False, default="valida")
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
