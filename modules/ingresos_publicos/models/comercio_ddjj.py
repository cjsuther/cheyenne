from sqlalchemy import Column, BigInteger, Integer, Date, DateTime, Numeric, Boolean, ForeignKey
from sqlalchemy.sql import func

import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", ".."))
from shared.database import Base


class ComercioDDJJ(Base):
    """Declaración Jurada de ingresos de un comercio por período (port de `DeclaRubros`).

    Los `ingresos_declarados` son la **base imponible** de la tasa de Seguridad e Higiene: la
    fórmula los pondera por la alícuota del rubro. El padrón de cálculo expone el último período
    declarado como variable `@C_INGRESOS`.
    """

    __tablename__ = "ingresos_publicos_comercio_ddjj"

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    id_comercio = Column(
        BigInteger, ForeignKey("ingresos_publicos_comercios.id"), nullable=False, index=True
    )
    id_rubro = Column(BigInteger, nullable=True)
    periodo = Column(Integer, nullable=False)
    mes = Column(Integer, nullable=True)
    ingresos_declarados = Column(Numeric(18, 2), nullable=False, default=0)
    importe_liquidado = Column(Numeric(18, 2), nullable=True)
    fecha_presentacion = Column(Date, nullable=True)
    fecha_alta = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    activo = Column(Boolean, nullable=False, default=True)
