from typing import List, Optional
from datetime import datetime, timezone

from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from models.verificacion import Verificacion


class VerificacionService:
    def __init__(self, db: Session):
        self.db = db

    def list(self, skip: int = 0, limit: int = 100) -> List[Verificacion]:
        return self.db.query(Verificacion).offset(skip).limit(limit).all()

    def find_by_id(self, id: int) -> Optional[Verificacion]:
        verificacion = self.db.query(Verificacion).filter(Verificacion.id == id).first()
        if not verificacion:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Verificacion {id} no encontrada",
            )
        return verificacion

    def verify_password_token(self, token: str) -> Verificacion:
        verificacion = (
            self.db.query(Verificacion)
            .filter(
                Verificacion.token == token,
                Verificacion.id_estado_verificacion == 51,
            )
            .first()
        )
        if not verificacion:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Token de verificación inválido",
            )

        now = datetime.now(timezone.utc)
        fecha_hasta = verificacion.fecha_hasta
        if fecha_hasta.tzinfo is None:
            fecha_hasta = fecha_hasta.replace(tzinfo=timezone.utc)

        if fecha_hasta < now:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Token de verificación expirado",
            )

        return verificacion
