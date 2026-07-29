from datetime import datetime, timezone

from sqlalchemy import Column, BigInteger, String, Date, DateTime, Boolean, ForeignKey

import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", ".."))
from shared.database import Base


class TransferenciaDominio(Base):
    """Movimiento de transferencia de dominio / titularidad de una cuenta.

    Registra el cambio de titular de un objeto (inmueble/vehículo/cuenta) de un contribuyente
    origen a uno destino. El circuito cierra la vigencia del TitularCuenta actual y abre uno
    nuevo para el contribuyente destino; este modelo deja la traza del acto administrativo.
    """

    __tablename__ = "ingresos_publicos_transferencias_dominio"

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    id_cuenta = Column(BigInteger, ForeignKey("ingresos_publicos_cuentas.id"), nullable=False, index=True)
    id_contribuyente_origen = Column(BigInteger, nullable=True, index=True)
    id_contribuyente_destino = Column(BigInteger, nullable=False, index=True)
    fecha = Column(Date, nullable=False, default=lambda: datetime.now(timezone.utc).date())
    acto = Column(String(200), nullable=False)  # escritura / boleto / acto administrativo
    id_titular_origen = Column(BigInteger, nullable=True)   # TitularCuenta cerrado
    id_titular_destino = Column(BigInteger, nullable=True)  # TitularCuenta creado
    observaciones = Column(String(500), nullable=True)
    activo = Column(Boolean, nullable=False, default=True)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
