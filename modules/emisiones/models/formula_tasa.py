from sqlalchemy import Column, BigInteger, Integer, String, Text, Date, DateTime, Boolean

from datetime import datetime, timezone

import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", ".."))
from shared.database import Base


class FormulaTasa(Base):
    """Catálogo de fórmulas de cálculo por tasa (port de la tabla `FormulaTasa` del legacy).

    Cada fila define, para una (tasa, subtasa, número de fórmula), la condición de aplicación
    y las expresiones `aCancelar`/`aPagar` de los 4 vencimientos, que el liquidador evalúa con
    el intérprete de fórmulas.
    """

    __tablename__ = "emisiones_formula_tasa"

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    tipo_tributo = Column(String(50), nullable=True, index=True)
    ttas_tasa = Column(Integer, nullable=False, index=True)
    ttas_subtasa = Column(Integer, nullable=False, default=0)
    fort_numero = Column(Integer, nullable=False, default=1)
    fort_orden = Column(Integer, nullable=False, default=0)
    fort_descripcion = Column(String(250), nullable=True)

    fort_condicion = Column(Text, nullable=True)
    fort_acumulador_condicion = Column(Text, nullable=True)

    fort_a_cancelar_1 = Column(Text, nullable=True)
    fort_a_pagar_1 = Column(Text, nullable=True)
    fort_a_cancelar_2 = Column(Text, nullable=True)
    fort_a_pagar_2 = Column(Text, nullable=True)
    fort_a_cancelar_3 = Column(Text, nullable=True)
    fort_a_pagar_3 = Column(Text, nullable=True)
    fort_a_cancelar_4 = Column(Text, nullable=True)
    fort_a_pagar_4 = Column(Text, nullable=True)

    fecha_desde = Column(Date, nullable=True)
    fecha_hasta = Column(Date, nullable=True)
    activo = Column(Boolean, nullable=False, default=True)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))


class FormulaTasaAcumulador(Base):
    """Acumuladores de una fórmula (port de `FormulaTasaAcumuladores`).

    Variables intermedias (`@K_ACUMULA{nn}`) que el liquidador evalúa antes de la condición y
    de los importes. `ftac_numero` es el índice del acumulador (`@K_ACUMULA{ftac_numero:02d}`).
    """

    __tablename__ = "emisiones_formula_tasa_acumuladores"

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    ttas_tasa = Column(Integer, nullable=False, index=True)
    ttas_subtasa = Column(Integer, nullable=False, default=0)
    fort_numero = Column(Integer, nullable=False, default=1)
    ftac_numero = Column(Integer, nullable=False)
    ftac_descripcion = Column(String(250), nullable=True)
    ftac_importe = Column(Text, nullable=True)   # la fórmula del acumulador
    activo = Column(Boolean, nullable=False, default=True)
