from sqlalchemy import Column, BigInteger, Integer, Date, DateTime, Numeric, Boolean, ForeignKey
from sqlalchemy.sql import func

import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", ".."))
from shared.database import Base


class InmuebleValuacion(Base):
    """Valuación fiscal de un inmueble por ejercicio (base imponible del ABL).

    Alimenta la función #I_VALUACION(tipo) del intérprete de fórmulas: suma el `valor`
    de las valuaciones cuyo `id_tipo_valuacion` coincide (0 = todas).
    """

    __tablename__ = "ingresos_publicos_inmueble_valuaciones"

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    id_inmueble = Column(
        BigInteger, ForeignKey("ingresos_publicos_inmuebles.id"), nullable=False, index=True
    )
    id_tipo_valuacion = Column(BigInteger, nullable=True)  # tierra / edificado / etc. (tval_Codigo)
    ejercicio = Column(Integer, nullable=True)
    valor = Column(Numeric(18, 2), nullable=False, default=0)
    fecha_vigencia = Column(Date, nullable=True)
    fecha_alta = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    activo = Column(Boolean, nullable=False, default=True)
