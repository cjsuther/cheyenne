from typing import List, Optional

from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from models.vehiculo import Vehiculo


class VehiculoService:
    def __init__(self, db: Session):
        self.db = db

    def list(self, skip: int = 0, limit: int = 100) -> List[Vehiculo]:
        return self.db.query(Vehiculo).offset(skip).limit(limit).all()

    def count(self) -> int:
        return self.db.query(Vehiculo).count()

    def find_by_id(self, id: int) -> Vehiculo:
        vehiculo = self.db.query(Vehiculo).filter(Vehiculo.id == id).first()
        if not vehiculo:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Vehiculo {id} no encontrado",
            )
        return vehiculo

    def list_by_cuenta(self, id_cuenta: int) -> List[Vehiculo]:
        return (
            self.db.query(Vehiculo)
            .filter(Vehiculo.id_cuenta == id_cuenta)
            .all()
        )

    def find_by_dominio(self, dominio: str) -> Optional[Vehiculo]:
        return (
            self.db.query(Vehiculo)
            .filter(Vehiculo.dominio == dominio)
            .first()
        )

    def add(self, data: dict) -> Vehiculo:
        vehiculo = Vehiculo(**data)
        self.db.add(vehiculo)
        self.db.commit()
        self.db.refresh(vehiculo)
        return vehiculo

    def modify(self, id: int, update_data: dict) -> Vehiculo:
        vehiculo = self.find_by_id(id)
        for key, value in update_data.items():
            if value is not None:
                setattr(vehiculo, key, value)
        self.db.commit()
        self.db.refresh(vehiculo)
        return vehiculo

    def remove(self, id: int):
        vehiculo = self.find_by_id(id)
        vehiculo.activo = False
        from datetime import datetime, timezone
        vehiculo.fecha_baja = datetime.now(timezone.utc)
        self.db.commit()
