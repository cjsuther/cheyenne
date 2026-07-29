import re
from datetime import datetime, timezone, timedelta
from typing import Optional

from sqlalchemy.orm import Session
from fastapi import HTTPException, status

import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", ".."))
from shared.security import verify_password, get_password_hash

from models.usuario import Usuario
from models.password_historial import PasswordHistorial
from config import get_settings


class PasswordService:
    """Politica, validacion, historial y expiracion de contrasenas."""

    def __init__(self, db: Session):
        self.db = db
        self.settings = get_settings()

    def validate_policy(self, password: str):
        errors = []
        if len(password or "") < self.settings.password_min_length:
            errors.append(f"al menos {self.settings.password_min_length} caracteres")
        if not re.search(r"[A-Z]", password or ""):
            errors.append("una mayuscula")
        if not re.search(r"[a-z]", password or ""):
            errors.append("una minuscula")
        if not re.search(r"[0-9]", password or ""):
            errors.append("un digito")
        if errors:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="La contrasena debe contener: " + ", ".join(errors),
            )

    def check_not_reused(self, id_usuario: int, new_password: str):
        historial = (
            self.db.query(PasswordHistorial)
            .filter(PasswordHistorial.id_usuario == id_usuario)
            .order_by(PasswordHistorial.created_at.desc())
            .limit(self.settings.password_historial_size)
            .all()
        )
        for h in historial:
            if verify_password(new_password, h.hash):
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"No puede reutilizar una de las ultimas {self.settings.password_historial_size} contrasenas",
                )

    def record(self, id_usuario: int, password_hash: str):
        """Guarda el hash en el historial y actualiza password_actualizado_en."""
        self.db.add(PasswordHistorial(id_usuario=id_usuario, hash=password_hash))
        usuario = self.db.query(Usuario).filter(Usuario.id == id_usuario).first()
        if usuario:
            usuario.password_actualizado_en = datetime.now(timezone.utc)
        # Poda: dejar solo las N mas recientes
        sobrantes = (
            self.db.query(PasswordHistorial)
            .filter(PasswordHistorial.id_usuario == id_usuario)
            .order_by(PasswordHistorial.created_at.desc())
            .offset(self.settings.password_historial_size)
            .all()
        )
        for s in sobrantes:
            self.db.delete(s)

    def apply_new_password(self, id_usuario: int, plain_password: str) -> str:
        """Valida politica + no-reuso, retorna el hash y registra historial. No commitea."""
        self.validate_policy(plain_password)
        self.check_not_reused(id_usuario, plain_password)
        new_hash = get_password_hash(plain_password)
        self.record(id_usuario, new_hash)
        return new_hash

    def dias_para_expirar(self, usuario: Usuario) -> Optional[int]:
        base = usuario.password_actualizado_en
        if base is None:
            return None
        base = base.replace(tzinfo=timezone.utc) if base.tzinfo is None else base
        vence = base + timedelta(days=self.settings.password_dias_expiracion)
        return int((vence - datetime.now(timezone.utc)).total_seconds() // 86400)

    def debe_cambiar(self, usuario: Usuario) -> bool:
        if usuario.password_actualizado_en is None:
            # Nunca se registro: forzar cambio para adoptar la politica
            return True
        dias = self.dias_para_expirar(usuario)
        return dias is not None and dias < 0
