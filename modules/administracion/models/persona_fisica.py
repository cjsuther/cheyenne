from sqlalchemy import Column, BigInteger, String, Integer, Date, Boolean

import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", ".."))
from shared.database import Base


class PersonaFisica(Base):
    __tablename__ = "administracion_personas_fisicas"

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    id_tipo_documento = Column(BigInteger, nullable=False)
    numero_documento = Column(String(50), nullable=False)
    id_nacionalidad = Column(BigInteger, nullable=True)
    nombre = Column(String(250), nullable=False)
    apellido = Column(String(250), nullable=False)
    id_genero = Column(BigInteger, nullable=True)
    id_estado_civil = Column(BigInteger, nullable=True)
    profesion = Column(String(250), nullable=True)
    matricula = Column(String(50), nullable=True)
    fecha_nacimiento = Column(Date, nullable=True)
    fecha_defuncion = Column(Date, nullable=True)
    id_condicion_fiscal = Column(BigInteger, nullable=True)
    activo = Column(Boolean, nullable=False, default=True)
