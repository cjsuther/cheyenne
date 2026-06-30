from typing import List, Optional

from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from models.mensaje import Mensaje


class MensajeService:
    def __init__(self, db: Session):
        self.db = db

    def list(
        self,
        id_tipo_mensaje: Optional[int] = None,
        id_estado_mensaje: Optional[int] = None,
        id_canal: Optional[int] = None,
        skip: int = 0,
        limit: int = 20,
    ) -> List[Mensaje]:
        query = self.db.query(Mensaje)
        if id_tipo_mensaje is not None:
            query = query.filter(Mensaje.id_tipo_mensaje == id_tipo_mensaje)
        if id_estado_mensaje is not None:
            query = query.filter(Mensaje.id_estado_mensaje == id_estado_mensaje)
        if id_canal is not None:
            query = query.filter(Mensaje.id_canal == id_canal)
        return query.order_by(Mensaje.fecha_creacion.desc()).offset(skip).limit(limit).all()

    def find_by_id(self, id: int) -> Mensaje:
        mensaje = self.db.query(Mensaje).filter(Mensaje.id == id).first()
        if not mensaje:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Mensaje {id} no encontrado",
            )
        return mensaje

    def add(self, mensaje_data: dict) -> Mensaje:
        mensaje = Mensaje(**mensaje_data)
        self.db.add(mensaje)
        self.db.commit()
        self.db.refresh(mensaje)
        return mensaje

    def modify(self, id: int, update_data: dict) -> Mensaje:
        mensaje = self.find_by_id(id)
        for key, value in update_data.items():
            if value is not None:
                setattr(mensaje, key, value)
        self.db.commit()
        self.db.refresh(mensaje)
        return mensaje

    def remove(self, id: int):
        # Mensaje no tiene campo `activo`: se borra físicamente (es transitorio).
        mensaje = self.find_by_id(id)
        self.db.delete(mensaje)
        self.db.commit()

    def count(
        self,
        id_tipo_mensaje: Optional[int] = None,
        id_estado_mensaje: Optional[int] = None,
        id_canal: Optional[int] = None,
    ) -> int:
        query = self.db.query(Mensaje)
        if id_tipo_mensaje is not None:
            query = query.filter(Mensaje.id_tipo_mensaje == id_tipo_mensaje)
        if id_estado_mensaje is not None:
            query = query.filter(Mensaje.id_estado_mensaje == id_estado_mensaje)
        if id_canal is not None:
            query = query.filter(Mensaje.id_canal == id_canal)
        return query.count()
