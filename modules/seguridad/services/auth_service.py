import sys
import os
import uuid
import hashlib
from datetime import datetime, timedelta, timezone
from typing import Optional

import httpx
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
from models.token_revocado import TokenRevocado
from config import get_settings


def _token_hash(token: str) -> str:
    return hashlib.sha256(token.encode("utf-8")).hexdigest()


class AuthService:
    SESION_TIME_MINUTES = 60
    DELAY_UPDATE_SESION_SECONDS = 30

    def __init__(self, db: Session):
        self.db = db
        self.settings = get_settings()

    def authenticate(self, username: str, password: str, totp_code: Optional[str] = None) -> dict:
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

        now = datetime.now(timezone.utc)

        # Bloqueo por intentos fallidos
        if usuario.bloqueado_hasta is not None:
            bloqueo = usuario.bloqueado_hasta.replace(tzinfo=timezone.utc) if usuario.bloqueado_hasta.tzinfo is None else usuario.bloqueado_hasta
            if bloqueo > now:
                restante = int((bloqueo - now).total_seconds() // 60) + 1
                raise HTTPException(
                    status_code=status.HTTP_423_LOCKED,
                    detail=f"Usuario bloqueado por intentos fallidos. Reintente en {restante} minuto(s).",
                )

        if not verify_password(password, acceso.password):
            # Incrementar intentos y bloquear si alcanza el maximo
            usuario.intentos_fallidos = (usuario.intentos_fallidos or 0) + 1
            if usuario.intentos_fallidos >= self.settings.max_intentos_fallidos:
                usuario.bloqueado_hasta = now + timedelta(minutes=self.settings.bloqueo_minutos)
            self.db.commit()
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Credenciales inválidas",
            )

        # Password OK: resetear contador y bloqueo
        usuario.intentos_fallidos = 0
        usuario.bloqueado_hasta = None
        self.db.commit()

        # 2FA (TOTP): si el usuario lo tiene habilitado, exigir codigo valido
        if usuario.totp_habilitado:
            if not totp_code:
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="2FA requerido: ingrese el codigo de su aplicacion de autenticacion.",
                    headers={"X-2FA-Required": "true"},
                )
            from services.totp_service import TotpService
            if not TotpService(self.db).verificar(usuario, totp_code):
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Codigo 2FA invalido.",
                    headers={"X-2FA-Required": "true"},
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

    def is_revoked(self, token: str) -> bool:
        return (
            self.db.query(TokenRevocado)
            .filter(TokenRevocado.token_hash == _token_hash(token))
            .first()
            is not None
        )

    def get_current_user(self, token: str) -> Optional[Usuario]:
        payload = decode_token(token, self.settings.secret_key, self.settings.algorithm)
        if not payload or payload.get("type") != "access":
            return None

        # Blacklist / revocacion de sesiones
        if self.is_revoked(token):
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

    def _revocar_token(self, token: str, id_usuario: Optional[int], vencimiento: Optional[datetime]):
        th = _token_hash(token)
        existe = self.db.query(TokenRevocado).filter(TokenRevocado.token_hash == th).first()
        if not existe:
            self.db.add(TokenRevocado(token_hash=th, id_usuario=id_usuario, expira_en=vencimiento))

    def logout(self, token: str):
        sesion = self.db.query(Sesion).filter(Sesion.token == token).first()
        now = datetime.now(timezone.utc)
        if sesion:
            self._revocar_token(token, sesion.id_usuario, sesion.fecha_vencimiento)
            sesion.fecha_vencimiento = now
        else:
            self._revocar_token(token, None, None)
        self.db.commit()

    def list_sesiones(self, usuario: Usuario, current_token: str) -> list:
        now = datetime.now(timezone.utc)
        sesiones = (
            self.db.query(Sesion)
            .filter(Sesion.id_usuario == usuario.id)
            .order_by(Sesion.fecha_creacion.desc())
            .all()
        )
        result = []
        for s in sesiones:
            venc = s.fecha_vencimiento.replace(tzinfo=timezone.utc) if s.fecha_vencimiento.tzinfo is None else s.fecha_vencimiento
            activa = venc > now and not self.is_revoked(s.token)
            result.append({
                "id": s.id,
                "fecha_creacion": s.fecha_creacion,
                "fecha_vencimiento": s.fecha_vencimiento,
                "activa": activa,
                "actual": s.token == current_token,
            })
        return result

    def revocar_sesion(self, usuario: Usuario, sesion_id: int):
        sesion = (
            self.db.query(Sesion)
            .filter(Sesion.id == sesion_id, Sesion.id_usuario == usuario.id)
            .first()
        )
        if not sesion:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Sesion no encontrada")
        self._revocar_token(sesion.token, sesion.id_usuario, sesion.fecha_vencimiento)
        sesion.fecha_vencimiento = datetime.now(timezone.utc)
        self.db.commit()
        return {"message": "Sesion revocada"}

    def request_password_reset(self, login: str):
        """Genera un token de reset y lo envia por email via comunicacion (best-effort).

        NO devuelve el token. Responde siempre 202 generico para no filtrar
        si el usuario existe o no.
        """
        from models.verificacion import Verificacion

        acceso = self.db.query(Acceso).filter(Acceso.identificador == login).first()
        if not acceso:
            # Respuesta generica: no revelar existencia del usuario
            return

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

        usuario = self.db.query(Usuario).filter(Usuario.id == acceso.id_usuario).first()
        self._enviar_email_reset(usuario, token)

    def _enviar_email_reset(self, usuario: Optional[Usuario], token: str):
        """POST best-effort a comunicacion. Nunca rompe la request principal."""
        if not usuario or not usuario.email:
            return
        try:
            payload = {
                "origen_modulo": "seguridad",
                "origen_ref": f"pwd_reset_{token}",
                "destinatario": usuario.email,
                "asunto": "Restablecimiento de contraseña",
                "cuerpo": (
                    f"Hola {usuario.nombre_apellido},\n\n"
                    f"Use el siguiente token para restablecer su contraseña: {token}\n"
                    f"El token vence en 24 horas."
                ),
                "token": token,
            }
            httpx.post(
                f"{self.settings.comunicacion_url}/mensajes",
                json=payload,
                timeout=3.0,
            )
        except Exception:
            # Best-effort: se ignora cualquier fallo de comunicacion
            pass

    def change_password(self, token: str, new_password: str):
        from models.verificacion import Verificacion
        from services.password_service import PasswordService

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

        pwd_service = PasswordService(self.db)
        acceso.password = pwd_service.apply_new_password(verificacion.id_usuario, new_password)
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
        from services.password_service import PasswordService
        pwd_service = PasswordService(self.db)
        acceso.password = pwd_service.apply_new_password(usuario.id, new_password)
        self.db.commit()
