from sqlalchemy import Column, BigInteger, String, Boolean

import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", ".."))
from shared.database import Base


class Documento(Base):
    __tablename__ = "administracion_documentos"

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    id_tipo_persona = Column(BigInteger, nullable=False)
    id_persona = Column(BigInteger, nullable=False)
    id_tipo_documento = Column(BigInteger, nullable=False)
    numero_documento = Column(String(50), nullable=False)
    principal = Column(Boolean, nullable=False, default=False)
