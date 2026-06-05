from sqlalchemy import Column, BigInteger, String, Integer, Date, Boolean

import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", ".."))
from shared.database import Base


class PersonaJuridica(Base):
    __tablename__ = "administracion_personas_juridicas"

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    id_tipo_documento = Column(BigInteger, nullable=False)
    numero_documento = Column(String(50), nullable=False)
    denominacion = Column(String(250), nullable=False)
    nombre_fantasia = Column(String(250), nullable=True)
    id_forma_juridica = Column(BigInteger, nullable=True)
    fecha_constitucion = Column(Date, nullable=True)
    mes_cierre = Column(Integer, nullable=True)
    activo = Column(Boolean, nullable=False, default=True)
