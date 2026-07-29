from sqlalchemy import Column, BigInteger, String, Boolean, DateTime, Numeric, Integer, JSON
from datetime import datetime, timezone

import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", ".."))
from shared.database import Base


class MovimientoCtaCte(Base):
    """Libro mayor INMUTABLE de la cuenta corriente del contribuyente.

    Cada emisión imputa un DEBITO y cada pago un CREDITO. El saldo NO se guarda
    como campo mutable: se DERIVA sumando debito − credito de los movimientos.
    ``saldo_posterior`` es una foto (snapshot) del saldo del concepto al momento
    de insertar el movimiento, útil para el extracto; no se recalcula hacia atrás.
    """

    __tablename__ = "emisiones_movimientos_ctacte"

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    # ancla del movimiento: una fila de cuenta corriente (concepto) y/o el contribuyente
    id_cuenta_corriente = Column(BigInteger, nullable=True, index=True)
    id_contribuyente = Column(BigInteger, nullable=False, index=True)
    id_emision = Column(BigInteger, nullable=True, index=True)
    tipo_tributo = Column(String(50), nullable=True)
    periodo = Column(String(20), nullable=True)
    cuota = Column(Integer, nullable=True)
    numero_comprobante = Column(String(50), nullable=True, index=True)

    fecha = Column(DateTime(timezone=True), nullable=False,
                   default=lambda: datetime.now(timezone.utc))
    # tipo: debito | credito
    tipo = Column(String(10), nullable=False)
    # concepto: emision | pago | interes | quita | ajuste
    concepto = Column(String(20), nullable=False)
    importe = Column(Numeric(18, 2), nullable=False, default=0)
    descripcion = Column(String(300), nullable=True)
    comprobante = Column(String(50), nullable=True)          # nro recibo / comprobante del movimiento
    saldo_posterior = Column(Numeric(18, 2), nullable=True)  # snapshot del saldo del concepto
    origen = Column(String(60), nullable=True)               # p.ej. 'emision', 'tesoreria', 'wav', 'manual'
    origen_modulo = Column(String(50), nullable=True)        # idempotencia de integraciones
    origen_ref = Column(String(120), nullable=True)          # idempotencia de integraciones
    detalle = Column(JSON, nullable=True)

    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    activo = Column(Boolean, nullable=False, default=True)
