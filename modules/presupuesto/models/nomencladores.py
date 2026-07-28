from sqlalchemy import Column, BigInteger, String, Integer, Boolean, Text, UniqueConstraint

import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", ".."))
from shared.database import Base


class _NomencladorJerarquico:
    """Campos comunes: código punteado (jerarquía RAFAM), padre y nivel derivados al guardar."""
    id = Column(BigInteger, primary_key=True, autoincrement=True)
    codigo = Column(String(64), nullable=False, index=True)
    nombre = Column(String(250), nullable=False)
    id_padre = Column(BigInteger, nullable=True)
    nivel = Column(Integer, nullable=False, default=1)
    activo = Column(Boolean, nullable=False, default=True)


class Jurisdiccion(Base, _NomencladorJerarquico):
    __tablename__ = "presupuesto_jurisdicciones"
    __table_args__ = (UniqueConstraint("codigo", name="uq_presu_juri_codigo"),)
    tipo = Column(String(30), nullable=True)  # A/U o etiqueta (legacy juri_Tipo)


class ObjetoGasto(Base, _NomencladorJerarquico):
    __tablename__ = "presupuesto_objetos_gasto"
    __table_args__ = (UniqueConstraint("codigo", name="uq_presu_godg_codigo"),)
    detalle = Column(Text, nullable=True)


class Fuente(Base, _NomencladorJerarquico):
    __tablename__ = "presupuesto_fuentes"
    __table_args__ = (UniqueConstraint("codigo", name="uq_presu_fufi_codigo"),)
    detalle = Column(Text, nullable=True)
    origen = Column(String(30), nullable=True)  # municipal/provincial/nacional/afectado


class Rubro(Base, _NomencladorJerarquico):
    __tablename__ = "presupuesto_rubros"
    __table_args__ = (UniqueConstraint("codigo", name="uq_presu_repr_codigo"),)
    caracter_economico = Column(String(64), nullable=True)


class Estructura(Base):
    """Estructura programática: código plano, POR JURISDICCIÓN (decisión DD-03/validada)."""
    __tablename__ = "presupuesto_estructuras"
    __table_args__ = (UniqueConstraint("codigo", "id_jurisdiccion", name="uq_presu_espr"),)

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    codigo = Column(String(64), nullable=False, index=True)
    nombre = Column(String(250), nullable=False)
    id_jurisdiccion = Column(BigInteger, nullable=True)  # nula = aplica a todo el municipio
    tipo_programa = Column(String(30), nullable=True)
    descripcion = Column(Text, nullable=True)
    activo = Column(Boolean, nullable=False, default=True)
