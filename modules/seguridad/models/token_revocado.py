from datetime import datetime, timezone

from sqlalchemy import Column, BigInteger, String, DateTime

import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", ".."))
from shared.database import Base


class TokenRevocado(Base):
    __tablename__ = "seguridad_tokens_revocados"

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    token_hash = Column(String(64), nullable=False, unique=True, index=True)
    id_usuario = Column(BigInteger, nullable=True, index=True)
    expira_en = Column(DateTime(timezone=True), nullable=True)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)
