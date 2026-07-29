import sys
import os
import hashlib
import secrets
from datetime import datetime, timezone

import pyotp
from sqlalchemy.orm import Session
from fastapi import HTTPException, status

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", ".."))

from models.usuario import Usuario
from models.codigo_respaldo import CodigoRespaldo

ISSUER = "Cheyenne"
CANT_CODIGOS_RESPALDO = 10


def _hash_codigo(codigo: str) -> str:
    return hashlib.sha256(codigo.encode("utf-8")).hexdigest()


class TotpService:
    def __init__(self, db: Session):
        self.db = db

    # ── Setup / activacion ───────────────────────────────────────────
    def setup(self, usuario: Usuario) -> dict:
        """Genera (o regenera) un secret TOTP sin habilitar aun.

        Devuelve el secret y el otpauth uri para el QR.
        """
        if usuario.totp_habilitado:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="2FA ya esta habilitado. Desactivelo antes de reconfigurar.",
            )
        secret = pyotp.random_base32()
        usuario.totp_secret = secret
        self.db.commit()

        otpauth_uri = pyotp.totp.TOTP(secret).provisioning_uri(
            name=usuario.codigo,
            issuer_name=ISSUER,
        )
        return {
            "secret": secret,
            "otpauth_uri": otpauth_uri,
            "issuer": ISSUER,
            "account": usuario.codigo,
        }

    def activar(self, usuario: Usuario, codigo: str) -> dict:
        """Valida el codigo TOTP y habilita 2FA. Genera codigos de respaldo."""
        if usuario.totp_habilitado:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="2FA ya esta habilitado.",
            )
        if not usuario.totp_secret:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="No hay un secret pendiente. Ejecute /2fa/setup primero.",
            )
        if not self._verificar_totp(usuario.totp_secret, codigo):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Codigo 2FA invalido.",
            )
        usuario.totp_habilitado = True
        codigos = self._regenerar_codigos_respaldo(usuario)
        self.db.commit()
        return {
            "habilitado": True,
            "codigos_respaldo": codigos,
            "mensaje": "2FA activado. Guarde los codigos de respaldo en un lugar seguro; no se volveran a mostrar.",
        }

    def desactivar(self, usuario: Usuario, codigo: str) -> dict:
        """Desactiva 2FA. Requiere un codigo TOTP o de respaldo valido."""
        if not usuario.totp_habilitado:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="2FA no esta habilitado.",
            )
        if not self.verificar(usuario, codigo):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Codigo 2FA invalido.",
            )
        usuario.totp_habilitado = False
        usuario.totp_secret = None
        self._borrar_codigos_respaldo(usuario)
        self.db.commit()
        return {"habilitado": False, "mensaje": "2FA desactivado."}

    # ── Verificacion (login / desactivacion) ─────────────────────────
    def verificar(self, usuario: Usuario, codigo: str) -> bool:
        """Valida un codigo: primero TOTP, luego codigo de respaldo (un solo uso)."""
        if not codigo:
            return False
        codigo = codigo.strip().replace(" ", "").replace("-", "")
        if usuario.totp_secret and self._verificar_totp(usuario.totp_secret, codigo):
            return True
        return self._consumir_codigo_respaldo(usuario, codigo)

    def estado(self, usuario: Usuario) -> dict:
        restantes = (
            self.db.query(CodigoRespaldo)
            .filter(
                CodigoRespaldo.id_usuario == usuario.id,
                CodigoRespaldo.usado == False,  # noqa: E712
            )
            .count()
        )
        return {
            "habilitado": bool(usuario.totp_habilitado),
            "configuracion_pendiente": bool(usuario.totp_secret) and not usuario.totp_habilitado,
            "codigos_respaldo_restantes": restantes,
        }

    # ── Internos ─────────────────────────────────────────────────────
    def _verificar_totp(self, secret: str, codigo: str) -> bool:
        try:
            return pyotp.TOTP(secret).verify(codigo, valid_window=1)
        except Exception:
            return False

    def _regenerar_codigos_respaldo(self, usuario: Usuario) -> list:
        self._borrar_codigos_respaldo(usuario)
        codigos = []
        for _ in range(CANT_CODIGOS_RESPALDO):
            raw = secrets.token_hex(4)  # 8 hex chars
            codigos.append(raw)
            self.db.add(
                CodigoRespaldo(
                    id_usuario=usuario.id,
                    codigo_hash=_hash_codigo(raw),
                )
            )
        return codigos

    def _borrar_codigos_respaldo(self, usuario: Usuario):
        self.db.query(CodigoRespaldo).filter(
            CodigoRespaldo.id_usuario == usuario.id
        ).delete()

    def _consumir_codigo_respaldo(self, usuario: Usuario, codigo: str) -> bool:
        ch = _hash_codigo(codigo)
        registro = (
            self.db.query(CodigoRespaldo)
            .filter(
                CodigoRespaldo.id_usuario == usuario.id,
                CodigoRespaldo.codigo_hash == ch,
                CodigoRespaldo.usado == False,  # noqa: E712
            )
            .first()
        )
        if not registro:
            return False
        registro.usado = True
        registro.fecha_uso = datetime.now(timezone.utc)
        self.db.commit()
        return True
