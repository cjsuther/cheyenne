from sqlalchemy import Column, BigInteger, String, Numeric, Boolean, DateTime
from datetime import datetime, timezone

import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", ".."))
from shared.database import Base


class PuestoMercado(Base):
    __tablename__ = "ingresos_publicos_puestos_mercado"

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    id_contribuyente = Column(BigInteger, nullable=True)
    mercado = Column(String(200), nullable=True)
    puesto_numero = Column(String(50), nullable=True)
    rubro = Column(String(200), nullable=True)
    superficie = Column(Numeric(18, 2), nullable=True)
    activo = Column(Boolean, nullable=False, default=True)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)
