from sqlalchemy import Column, BigInteger, Integer, String, DateTime, Table, ForeignKey, Boolean
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", ".."))
from shared.database import Base

usuario_perfil = Table(
    "seguridad_usuario_perfil",
    Base.metadata,
    Column("usuario_id", BigInteger, ForeignKey("seguridad_usuarios.id"), primary_key=True),
    Column("perfil_id", BigInteger, ForeignKey("seguridad_perfiles.id"), primary_key=True),
)


class Usuario(Base):
    __tablename__ = "seguridad_usuarios"

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    id_tipo_usuario = Column(BigInteger, nullable=False, default=10)
    id_estado_usuario = Column(BigInteger, nullable=False, default=10)
    id_persona = Column(BigInteger, nullable=True)
    codigo = Column(String(50), nullable=False, unique=True, index=True)
    nombre_apellido = Column(String(250), nullable=False)
    email = Column(String(250), nullable=False)
    superuser = Column(BigInteger, nullable=False, default=0)
    fecha_alta = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    fecha_baja = Column(DateTime(timezone=True), nullable=True)

    # Bloqueo por intentos fallidos
    intentos_fallidos = Column(Integer, nullable=False, default=0, server_default="0")
    bloqueado_hasta = Column(DateTime(timezone=True), nullable=True)

    # Politica de contrasena
    password_actualizado_en = Column(DateTime(timezone=True), nullable=True)

    # 2FA (TOTP)
    totp_secret = Column(String(64), nullable=True)
    totp_habilitado = Column(Boolean, nullable=False, default=False, server_default="false")

    # Credencial de firma (PIN de firma + aclaracion) - equivalente al certificado/token del legacy
    clave_firma_hash = Column(String(200), nullable=True)
    aclaracion_firma = Column(String(200), nullable=True)

    perfiles = relationship("Perfil", secondary=usuario_perfil, back_populates="usuarios", lazy="selectin")
    accesos = relationship("Acceso", back_populates="usuario", lazy="selectin", cascade="all, delete-orphan")
    sesiones = relationship("Sesion", back_populates="usuario", lazy="selectin", cascade="all, delete-orphan")
