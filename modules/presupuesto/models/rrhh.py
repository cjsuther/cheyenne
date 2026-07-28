from sqlalchemy import (
    Column, BigInteger, Integer, String, Boolean, Numeric, UniqueConstraint,
)

import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", ".."))
from shared.database import Base


class Cargo(Base):
    """Nomenclador de cargos/funciones (≡ legacy CargosFunciones/Categorias, simplificado)."""
    __tablename__ = "presupuesto_cargos"
    __table_args__ = (UniqueConstraint("codigo", name="uq_presu_cargo_codigo"),)

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    codigo = Column(String(30), nullable=False)
    nombre = Column(String(250), nullable=False)
    categoria = Column(String(80), nullable=True)
    activo = Column(Boolean, nullable=False, default=True)


class PlantaRRHH(Base):
    """Planta de cargos presupuestada (F6 del legacy, simplificado): cantidad × costo por
    (ejercicio, jurisdicción, estructura, cargo)."""
    __tablename__ = "presupuesto_rrhh"
    __table_args__ = (
        UniqueConstraint("anio", "id_jurisdiccion", "id_estructura", "id_cargo", name="uq_presu_rrhh"),
    )

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    anio = Column(Integer, nullable=False, index=True)
    id_jurisdiccion = Column(BigInteger, nullable=False)
    id_estructura = Column(BigInteger, nullable=False)
    id_cargo = Column(BigInteger, nullable=False)
    cantidad = Column(Integer, nullable=False, default=1)
    costo_mensual = Column(Numeric(18, 2), nullable=False, default=0)
    meses = Column(Integer, nullable=False, default=13)  # 12 + SAC
    activo = Column(Boolean, nullable=False, default=True)
