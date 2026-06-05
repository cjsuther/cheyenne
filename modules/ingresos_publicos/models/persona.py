from sqlalchemy import Column, BigInteger, String, Boolean

import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", ".."))
from shared.database import Base


class Persona(Base):
    __tablename__ = "ingresos_publicos_personas"

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    id_tipo_persona = Column(BigInteger, nullable=False)
    id_tipo_documento = Column(BigInteger, nullable=False)
    numero_documento = Column(String(50), nullable=False)
    nombre = Column(String(250), nullable=True)
    apellido = Column(String(250), nullable=True)
    denominacion = Column(String(250), nullable=True)
    activo = Column(Boolean, nullable=False, default=True)
