from sqlalchemy import Column, BigInteger, Date, DateTime, Boolean, ForeignKey
from sqlalchemy.sql import func

import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", ".."))
from shared.database import Base


class ComercioRubro(Base):
    """Rubro habilitado de un comercio (port de `RubroHabilitados`).

    Define qué actividades declara el comercio; la alícuota de cada rubro es parametrización
    de la tasa (vive en `FormulaTasa`), no acá.
    """

    __tablename__ = "ingresos_publicos_comercio_rubros"

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    id_comercio = Column(
        BigInteger, ForeignKey("ingresos_publicos_comercios.id"), nullable=False, index=True
    )
    id_rubro = Column(BigInteger, nullable=False)
    principal = Column(Boolean, nullable=False, default=False)
    fecha_alta = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    fecha_baja = Column(Date, nullable=True)
    activo = Column(Boolean, nullable=False, default=True)
