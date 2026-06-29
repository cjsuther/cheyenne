from sqlalchemy import Column, BigInteger, Integer, Date, DateTime, Numeric, Boolean, ForeignKey
from sqlalchemy.sql import func

import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", ".."))
from shared.database import Base


class PlanPagoCuota(Base):
    """Cuota de un plan de pago (la genera el motor de planes — sistema francés).

    Cubre el hueco del legacy donde el plan era sólo un encabezado: acá se persiste la
    desagregación capital/interés por cuota.
    """

    __tablename__ = "ingresos_publicos_plan_pago_cuotas"

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    id_plan_pago = Column(
        BigInteger, ForeignKey("ingresos_publicos_planes_pago.id"), nullable=False, index=True
    )
    numero_cuota = Column(Integer, nullable=False)
    capital = Column(Numeric(18, 2), nullable=False, default=0)
    interes = Column(Numeric(18, 2), nullable=False, default=0)
    importe = Column(Numeric(18, 2), nullable=False, default=0)
    fecha_vencimiento = Column(Date, nullable=True)
    id_estado_cuota = Column(BigInteger, nullable=False, default=10)  # 10 = pendiente
    fecha_alta = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    activo = Column(Boolean, nullable=False, default=True)
