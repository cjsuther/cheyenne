from sqlalchemy import Column, BigInteger, Integer, String, Numeric, Boolean, DateTime, UniqueConstraint, func

import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", ".."))
from shared.database import Base


class ValorTierra(Base):
    """Valor unitario de la tierra por zona/ejercicio (motor de valuación de inmuebles).
    base imponible = valor_m2 * superficie + valor_m2 * coef_frente * metros_frente."""
    __tablename__ = "ingresos_publicos_valor_tierra"
    __table_args__ = (UniqueConstraint("ejercicio", "zona", name="uq_ip_valortierra"),)
    id = Column(BigInteger, primary_key=True, autoincrement=True)
    ejercicio = Column(Integer, nullable=False, index=True)
    zona = Column(String(60), nullable=False, default="general")
    valor_m2 = Column(Numeric(18, 2), nullable=False, default=0)
    coef_frente = Column(Numeric(9, 4), nullable=False, default=0)   # valor extra por metro de frente
    activo = Column(Boolean, nullable=False, default=True)
    fecha_alta = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)


class AlicuotaRubro(Base):
    """Alícuota de Seguridad e Higiene / IIBB por rubro y ejercicio (liquidación de DDJJ de comercio)."""
    __tablename__ = "ingresos_publicos_alicuota_rubro"
    __table_args__ = (UniqueConstraint("id_rubro", "ejercicio", name="uq_ip_alicrubro"),)
    id = Column(BigInteger, primary_key=True, autoincrement=True)
    id_rubro = Column(BigInteger, nullable=False, index=True)
    ejercicio = Column(Integer, nullable=False)
    alicuota = Column(Numeric(9, 4), nullable=False, default=0)      # % sobre ingresos declarados
    minimo = Column(Numeric(18, 2), nullable=False, default=0)       # tributo mínimo
    activo = Column(Boolean, nullable=False, default=True)
    fecha_alta = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
