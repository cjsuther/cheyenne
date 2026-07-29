from sqlalchemy import Column, BigInteger, String, Numeric, DateTime
from datetime import datetime, timezone

import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", ".."))
from shared.database import Base


class DerechoConstruccion(Base):
    __tablename__ = "ingresos_publicos_derechos_construccion"

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    id_inmueble = Column(BigInteger, nullable=True)
    expediente = Column(String(100), nullable=True)
    m2 = Column(Numeric(18, 2), nullable=True)
    destino = Column(String(200), nullable=True)  # vivienda, comercial, etc.
    valor_obra = Column(Numeric(18, 2), nullable=False, default=0)
    importe = Column(Numeric(18, 2), nullable=False, default=0)
    estado = Column(String(20), nullable=False, default="liquidado")  # liquidado | pagado
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc), nullable=False)
