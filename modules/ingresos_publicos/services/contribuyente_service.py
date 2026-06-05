from typing import List, Optional

from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from models.contribuyente import Contribuyente


class ContribuyenteService:
    def __init__(self, db: Session):
        self.db = db

    def list(self, skip: int = 0, limit: int = 100) -> List[Contribuyente]:
        return self.db.query(Contribuyente).offset(skip).limit(limit).all()

    def count(self) -> int:
        return self.db.query(Contribuyente).count()

    def find_by_id(self, id: int) -> Contribuyente:
        contribuyente = self.db.query(Contribuyente).filter(Contribuyente.id == id).first()
        if not contribuyente:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Contribuyente {id} no encontrado",
            )
        return contribuyente

    def find_by_documento(self, id_tipo_documento: int, numero_documento: str) -> Optional[Contribuyente]:
        return (
            self.db.query(Contribuyente)
            .filter(
                Contribuyente.id_tipo_documento == id_tipo_documento,
                Contribuyente.numero_documento == numero_documento,
            )
            .first()
        )

    def add(self, data: dict) -> Contribuyente:
        contribuyente = Contribuyente(**data)
        self.db.add(contribuyente)
        self.db.commit()
        self.db.refresh(contribuyente)
        return contribuyente

    def modify(self, id: int, update_data: dict) -> Contribuyente:
        contribuyente = self.find_by_id(id)
        for key, value in update_data.items():
            if value is not None:
                setattr(contribuyente, key, value)
        self.db.commit()
        self.db.refresh(contribuyente)
        return contribuyente

    def remove(self, id: int):
        contribuyente = self.find_by_id(id)
        contribuyente.activo = False
        from datetime import datetime, timezone
        contribuyente.fecha_baja = datetime.now(timezone.utc)
        self.db.commit()
