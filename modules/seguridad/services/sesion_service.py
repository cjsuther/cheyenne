from typing import List, Optional
from datetime import datetime, timedelta, timezone

from sqlalchemy.orm import Session

from models.sesion import Sesion


SESION_TIME_MINUTES = 60
DELAY_UPDATE_SESION_SECONDS = 30


class SesionService:
    def __init__(self, db: Session):
        self.db = db

    def find_by_token(self, token: str) -> Optional[Sesion]:
        sesion = self.db.query(Sesion).filter(Sesion.token == token).first()
        if not sesion:
            return None

        now = datetime.now(timezone.utc)
        vencimiento = sesion.fecha_vencimiento
        if vencimiento.tzinfo is None:
            vencimiento = vencimiento.replace(tzinfo=timezone.utc)

        if vencimiento < now:
            return None

        # Auto-extend session if within delay threshold
        remaining = (vencimiento - now).total_seconds()
        if remaining < SESION_TIME_MINUTES * 60 - DELAY_UPDATE_SESION_SECONDS:
            sesion.fecha_vencimiento = now + timedelta(minutes=SESION_TIME_MINUTES)
            self.db.commit()

        return sesion

    def expirate_sesion(self, token: str):
        sesion = self.db.query(Sesion).filter(Sesion.token == token).first()
        if sesion:
            sesion.fecha_vencimiento = datetime.now(timezone.utc)
            self.db.commit()

    def list_by_usuario(self, usuario_id: int) -> List[Sesion]:
        return (
            self.db.query(Sesion)
            .filter(Sesion.id_usuario == usuario_id)
            .order_by(Sesion.fecha_creacion.desc())
            .all()
        )
