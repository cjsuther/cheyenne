import sys
import os
import uuid
from datetime import datetime, timedelta, timezone
from typing import Optional

from sqlalchemy.orm import Session
from fastapi import HTTPException, status

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", ".."))
from shared.security import (
    verify_password,
    get_password_hash,
    create_access_token,
    create_refresh_token,
    decode_token,
)

from models.usuario import Usuario
from models.acceso import Acceso
from models.sesion import Sesion
from config import get_settings


class AuthService:
    SESION_TIME_MINUTES = 60
    DELAY_UPDATE_SESION_SECONDS = 30

    def __init__(self, db: Session):
        self.db = db
        self.settings = get_settings()

    def authenticate(self, username: str, password: str) -> dict:
        acceso = (
            self.db.query(Acceso)
            .filter(Acceso.identificador == username)
            .first()
        )
        if not acceso:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Credenciales inválidas",
            )

        if not verify_password(password, acceso.password):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Credenciales inválidas",
            )

        usuario = (
            self.db.query(Usuario)
            .filter(Usuario.id == acceso.id_usuario)
            .first()
        )
        if not usuario or usuario.id_estado_usuario != 10:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Usuario inactivo o no encontrado",
            )

        perfiles_ids = [p.id for p in usuario.perfiles]
        permisos = []
        for perfil in usuario.perfiles:
            for permiso in perfil.permisos:
                permisos.append(permiso.codigo)

        token_data = {
            "sub": str(usuario.id),
            "codigo": usuario.codigo,
            "perfiles": perfiles_ids,
            "superuser": usuario.superuser,
        }

        access_token = create_access_token(
            data=token_data,
            secret_key=self.settings.secret_key,
            algorithm=self.settings.algorithm,
            expires_delta=timedelta(minutes=self.settings.access_token_expire_minutes),
        )
        refresh_token = create_refresh_token(
            data={"sub": str(usuario.id)},
            secret_key=self.settings.secret_key,
            algorithm=self.settings.algorithm,
            expires_delta=timedelta(days=self.settings.refresh_token_expire_days),
        )

        sesion = Sesion(
            id_usuario=usuario.id,
            token=access_token,
            refresh_token=refresh_token,
            fecha_vencimiento=datetime.now(timezone.utc) + timedelta(minutes=self.SESION_TIME_MINUTES),
        )
        self.db.add(sesion)
        self.db.commit()

        return {
            "access_token": access_token,
            "refresh_token": refresh_token,
            "token_type": "bearer",
        }

    def refresh(self, refresh_token: str) -> dict:
        payload = decode_token(
            refresh_token, self.settings.secret_key, self.settings.algorithm
        )
        if not payload or payload.get("type") != "refresh":
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Refresh token inválido",
            )

        usuario_id = int(payload["sub"])
        usuario = self.db.query(Usuario).filter(Usuario.id == usuario_id).first()
        if not usuario or usuario.id_estado_usuario != 10:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Usuario inactivo o no encontrado",
            )

        # Invalidar sesión anterior
        old_sesion = (
            self.db.query(Sesion)
            .filter(Sesion.refresh_token == refresh_token)
            .first()
        )
        if old_sesion:
            self.db.delete(old_sesion)

        perfiles_ids = [p.id for p in usuario.perfiles]
        token_data = {
            "sub": str(usuario.id),
            "codigo": usuario.codigo,
            "perfiles": perfiles_ids,
            "superuser": usuario.superuser,
        }

        new_access_token = create_access_token(
            data=token_data,
            secret_key=self.settings.secret_key,
            algorithm=self.settings.algorithm,
            expires_delta=timedelta(minutes=self.settings.access_token_expire_minutes),
        )
        new_refresh_token = create_refresh_token(
            data={"sub": str(usuario.id)},
            secret_key=self.settings.secret_key,
            algorithm=self.settings.algorithm,
            expires_delta=timedelta(days=self.settings.refresh_token_expire_days),
        )

        sesion = Sesion(
            id_usuario=usuario.id,
            token=new_access_token,
            refresh_token=new_refresh_token,
            fecha_vencimiento=datetime.now(timezone.utc) + timedelta(minutes=self.SESION_TIME_MINUTES),
        )
        self.db.add(sesion)
        self.db.commit()

        return {
            "access_token": new_access_token,
            "refresh_token": new_refresh_token,
            "token_type": "bearer",
        }

    def get_current_user(self, token: str) -> Optional[Usuario]:
        payload = decode_token(token, self.settings.secret_key, self.settings.algorithm)
        if not payload or payload.get("type") != "access":
            return None

        usuario_id = int(payload["sub"])
        sesion = (
            self.db.query(Sesion)
            .filter(Sesion.token == token)
            .first()
        )
        if not sesion:
            return None

        now = datetime.now(timezone.utc)
        if sesion.fecha_vencimiento.replace(tzinfo=timezone.utc) < now:
            return None

        # Auto-extend session
        remaining = (sesion.fecha_vencimiento.replace(tzinfo=timezone.utc) - now).total_seconds()
        if remaining < self.SESION_TIME_MINUTES * 60 - self.DELAY_UPDATE_SESION_SECONDS:
            sesion.fecha_vencimiento = now + timedelta(minutes=self.SESION_TIME_MINUTES)
            self.db.commit()

        return self.db.query(Usuario).filter(Usuario.id == usuario_id).first()

    def logout(self, token: str):
        sesion = self.db.query(Sesion).filter(Sesion.token == token).first()
        if sesion:
            sesion.fecha_vencimiento = datetime.now(timezone.utc)
            self.db.commit()

    def request_password_reset(self, login: str) -> str:
        from models.verificacion import Verificacion

        acceso = self.db.query(Acceso).filter(Acceso.identificador == login).first()
        if not acceso:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Usuario no encontrado",
            )

        token = str(uuid.uuid4())
        verificacion = Verificacion(
            id_tipo_verificacion=10,
            id_estado_verificacion=51,
            id_usuario=acceso.id_usuario,
            codigo=f"PWD_RESET_{acceso.id_usuario}",
            fecha_hasta=datetime.now(timezone.utc) + timedelta(hours=24),
            token=token,
            detalle=f"Solicitud de cambio de contraseña para {login}",
        )
        self.db.add(verificacion)
        self.db.commit()
        return token

    def change_password(self, token: str, new_password: str):
        from models.verificacion import Verificacion

        verificacion = (
            self.db.query(Verificacion)
            .filter(Verificacion.token == token, Verificacion.id_estado_verificacion == 51)
            .first()
        )
        if not verificacion:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Token de verificación inválido",
            )

        now = datetime.now(timezone.utc)
        if verificacion.fecha_hasta.replace(tzinfo=timezone.utc) < now:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Token de verificación expirado",
            )

        acceso = (
            self.db.query(Acceso)
            .filter(Acceso.id_usuario == verificacion.id_usuario)
            .first()
        )
        if not acceso:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Acceso no encontrado",
            )

        acceso.password = get_password_hash(new_password)
        verificacion.id_estado_verificacion = 52  # Usado
        self.db.commit()

    def update_profile(self, usuario: Usuario, data: dict) -> Usuario:
        for key, value in data.items():
            if value is not None:
                setattr(usuario, key, value)
        self.db.commit()
        self.db.refresh(usuario)
        return usuario

    def change_own_password(self, usuario: Usuario, current_password: str, new_password: str):
        acceso = (
            self.db.query(Acceso)
            .filter(Acceso.id_usuario == usuario.id)
            .first()
        )
        if not acceso:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Acceso no encontrado",
            )
        if not verify_password(current_password, acceso.password):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Contrasena actual incorrecta",
            )
        acceso.password = get_password_hash(new_password)
        self.db.commit()
