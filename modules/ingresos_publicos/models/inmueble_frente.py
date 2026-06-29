from sqlalchemy import Column, BigInteger, String, DateTime, Numeric, Boolean, ForeignKey
from sqlalchemy.sql import func

import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", ".."))
from shared.database import Base


class InmuebleFrente(Base):
    """Frente de un inmueble sobre una calle (metros lineales).

    Base para la numeración domiciliaria y para tasas que ponderan por metros de frente.
    `ochava` marca la esquina (en el legacy, la ochava computa medio metraje).
    """

    __tablename__ = "ingresos_publicos_inmueble_frentes"

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    id_inmueble = Column(
        BigInteger, ForeignKey("ingresos_publicos_inmuebles.id"), nullable=False, index=True
    )
    id_calle = Column(BigInteger, nullable=True)
    numero = Column(String(20), nullable=True)
    metros = Column(Numeric(12, 2), nullable=False, default=0)
    ochava = Column(Boolean, nullable=False, default=False)
    fecha_alta = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    activo = Column(Boolean, nullable=False, default=True)
