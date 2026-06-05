from typing import List, Optional

from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from models.pago_notificacion import PagoNotificacion


class PagoService:
    def __init__(self, db: Session):
        self.db = db

    def list_notificaciones(self, skip: int = 0, limit: int = 20) -> List[PagoNotificacion]:
        return (
            self.db.query(PagoNotificacion)
            .order_by(PagoNotificacion.fecha_notificacion.desc())
            .offset(skip)
            .limit(limit)
            .all()
        )

    def create_notificacion(self, data: dict) -> PagoNotificacion:
        notificacion = PagoNotificacion(**data)
        self.db.add(notificacion)
        self.db.commit()
        self.db.refresh(notificacion)
        return notificacion

    def find_notificacion_by_id(self, id: int) -> PagoNotificacion:
        notificacion = self.db.query(PagoNotificacion).filter(PagoNotificacion.id == id).first()
        if not notificacion:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Notificación de pago {id} no encontrada",
            )
        return notificacion
