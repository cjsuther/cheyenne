from typing import List, Optional

from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from models.vehiculo_valuacion import VehiculoValuacion


class VehiculoValuacionService:
    def __init__(self, db: Session):
        self.db = db

    def list(self, skip: int = 0, limit: int = 100) -> List[VehiculoValuacion]:
        return self.db.query(VehiculoValuacion).offset(skip).limit(limit).all()

    def count(self) -> int:
        return self.db.query(VehiculoValuacion).count()

    def find_by_id(self, id: int) -> VehiculoValuacion:
        item = self.db.query(VehiculoValuacion).filter(VehiculoValuacion.id == id).first()
        if not item:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND,
                                detail=f"Valuacion vehicular {id} no encontrada")
        return item

    def find_valor(self, codigo_modelo: str, anio: int) -> Optional[VehiculoValuacion]:
        """Última valuación vigente para un modelo/año (por ejercicio descendente)."""
        return (
            self.db.query(VehiculoValuacion)
            .filter(
                VehiculoValuacion.codigo_modelo == codigo_modelo,
                VehiculoValuacion.anio == anio,
                VehiculoValuacion.activo == True,
            )
            .order_by(VehiculoValuacion.ejercicio.desc())
            .first()
        )

    def add(self, data: dict) -> VehiculoValuacion:
        item = VehiculoValuacion(**data)
        self.db.add(item)
        self.db.commit()
        self.db.refresh(item)
        return item

    def modify(self, id: int, update_data: dict) -> VehiculoValuacion:
        item = self.find_by_id(id)
        for key, value in update_data.items():
            if value is not None:
                setattr(item, key, value)
        self.db.commit()
        self.db.refresh(item)
        return item

    def remove(self, id: int):
        item = self.find_by_id(id)
        item.activo = False
        self.db.commit()
