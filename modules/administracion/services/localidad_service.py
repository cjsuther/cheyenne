from typing import List, Optional

from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from models.localidad import Localidad


class LocalidadService:
    def __init__(self, db: Session):
        self.db = db

    def list(self, skip: int = 0, limit: int = 100, id_provincia: Optional[int] = None) -> List[Localidad]:
        query = self.db.query(Localidad)
        if id_provincia is not None:
            query = query.filter(Localidad.id_provincia == id_provincia)
        return query.order_by(Localidad.orden).offset(skip).limit(limit).all()

    def count(self, id_provincia: Optional[int] = None) -> int:
        query = self.db.query(Localidad)
        if id_provincia is not None:
            query = query.filter(Localidad.id_provincia == id_provincia)
        return query.count()

    def find_by_id(self, id: int) -> Localidad:
        localidad = self.db.query(Localidad).filter(Localidad.id == id).first()
        if not localidad:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Localidad {id} no encontrada",
            )
        return localidad

    def add(self, data: dict) -> Localidad:
        localidad = Localidad(**data)
        self.db.add(localidad)
        self.db.commit()
        self.db.refresh(localidad)
        return localidad

    def modify(self, id: int, update_data: dict) -> Localidad:
        localidad = self.find_by_id(id)
        for key, value in update_data.items():
            if value is not None:
                setattr(localidad, key, value)
        self.db.commit()
        self.db.refresh(localidad)
        return localidad

    def remove(self, id: int):
        localidad = self.find_by_id(id)
        self.db.delete(localidad)
        self.db.commit()
