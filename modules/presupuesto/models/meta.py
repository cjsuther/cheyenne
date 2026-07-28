from sqlalchemy import (
    Column, BigInteger, Integer, String, Boolean, Numeric, Text, Date, UniqueConstraint,
)

import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", ".."))
from shared.database import Base


class Meta(Base):
    """Meta física por programa (≡ F5 del legacy, simplificado): qué se produce y cuánto."""
    __tablename__ = "presupuesto_metas"
    __table_args__ = (UniqueConstraint("anio", "id_estructura", "descripcion", name="uq_presu_meta"),)

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    anio = Column(Integer, nullable=False, index=True)
    id_estructura = Column(BigInteger, nullable=False)
    descripcion = Column(String(250), nullable=False)      # p.ej. "Luminarias LED instaladas"
    unidad_medida = Column(String(50), nullable=False)     # p.ej. "unidades", "m2", "raciones"
    meta_anual = Column(Numeric(18, 2), nullable=False, default=0)
    ejecutado = Column(Numeric(18, 2), nullable=False, default=0)  # avance acumulado
    observaciones = Column(Text, nullable=True)
    activo = Column(Boolean, nullable=False, default=True)


ESTADOS_PROYECTO = ("formulacion", "ejecucion", "terminado", "cancelado")


class Proyecto(Base):
    """Proyecto de inversión (banco de proyectos simplificado, ≡ F8/F9 del legacy)."""
    __tablename__ = "presupuesto_proyectos"
    __table_args__ = (UniqueConstraint("codigo", name="uq_presu_proyecto_codigo"),)

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    codigo = Column(String(30), nullable=False)
    nombre = Column(String(250), nullable=False)
    anio_inicio = Column(Integer, nullable=False)
    id_jurisdiccion = Column(BigInteger, nullable=True)
    id_estructura = Column(BigInteger, nullable=True)   # actividad/obra presupuestaria asociada
    monto_total = Column(Numeric(18, 2), nullable=False, default=0)
    estado = Column(String(15), nullable=False, default="formulacion")
    etapa = Column(String(80), nullable=True)           # descripción libre de la etapa actual
    avance_fisico = Column(Numeric(5, 2), nullable=False, default=0)   # %
    avance_financiero = Column(Numeric(5, 2), nullable=False, default=0)  # % (manual o calculado)
    fecha_inicio = Column(Date, nullable=True)
    fecha_fin_estimada = Column(Date, nullable=True)
    descripcion = Column(Text, nullable=True)
    activo = Column(Boolean, nullable=False, default=True)
