from datetime import datetime, timezone

from sqlalchemy import Column, BigInteger, String, Boolean, DateTime

import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", ".."))
from shared.database import Base


class AdhesionDebito(Base):
    """Adhesión a débito automático de una cuenta de autogestión.
    Los formatos bancarios completos quedan fuera de alcance: sólo se guardan
    el medio (tarjeta/cbu) y los datos en texto libre."""

    __tablename__ = "wav_adhesiones_debito"

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    id_cuenta = Column(BigInteger, nullable=False)
    medio = Column(String(20), nullable=False)  # 'tarjeta' | 'cbu'
    datos = Column(String(250), nullable=True)   # nro tarjeta/cbu enmascarado, titular, etc.
    titular = Column(String(150), nullable=True)
    activo = Column(Boolean, nullable=False, default=True)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
