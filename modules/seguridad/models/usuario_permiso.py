from datetime import datetime, timezone

from sqlalchemy import Column, BigInteger, String, DateTime, ForeignKey, UniqueConstraint

import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", ".."))
from shared.database import Base


class UsuarioPermiso(Base):
    """Permisos a nivel usuario individual: grant (suma) o deny (resta)."""
    __tablename__ = "seguridad_usuario_permiso"
    __table_args__ = (
        UniqueConstraint("id_usuario", "id_permiso", name="uq_seguridad_usuario_permiso"),
    )

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    id_usuario = Column(BigInteger, ForeignKey("seguridad_usuarios.id"), nullable=False, index=True)
    id_permiso = Column(BigInteger, ForeignKey("seguridad_permisos.id"), nullable=False, index=True)
    tipo = Column(String(10), nullable=False, default="grant")  # 'grant' | 'deny'
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)
