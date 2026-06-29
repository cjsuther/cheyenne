from sqlalchemy import Column, BigInteger, Date, DateTime, Numeric, Boolean, ForeignKey
from sqlalchemy.sql import func

import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", ".."))
from shared.database import Base


class InmuebleSuperficie(Base):
    """Superficie de un inmueble por tipo/clase, con vigencia.

    Alimenta la función #I_SUPERFICIE(tipo, clase) del intérprete: suma `superficie` de las
    filas vigentes al mes de cálculo (`fecha_vigencia <= fin de mes`), filtrando por
    `id_tipo_superficie` (0 = todos) y `clase` (0 = todas).
    """

    __tablename__ = "ingresos_publicos_inmueble_superficies"

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    id_inmueble = Column(
        BigInteger, ForeignKey("ingresos_publicos_inmuebles.id"), nullable=False, index=True
    )
    id_tipo_superficie = Column(BigInteger, nullable=True)  # tips_Codigo (cubierta/semicubierta/…)
    clase = Column(BigInteger, nullable=True)               # tips_Clase
    superficie = Column(Numeric(14, 2), nullable=False, default=0)
    fecha_vigencia = Column(Date, nullable=True)
    fecha_alta = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    activo = Column(Boolean, nullable=False, default=True)
