from typing import List, Optional

from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from models.consulta import Consulta


class ConsultaService:
    def __init__(self, db: Session):
        self.db = db

    def list(self, skip: int = 0, limit: int = 20) -> List[Consulta]:
        return (
            self.db.query(Consulta)
            .order_by(Consulta.fecha_consulta.desc())
            .offset(skip)
            .limit(limit)
            .all()
        )

    def find_by_id(self, id: int) -> Consulta:
        consulta = self.db.query(Consulta).filter(Consulta.id == id).first()
        if not consulta:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Consulta {id} no encontrada",
            )
        return consulta

    def create(self, consulta_data: dict) -> Consulta:
        consulta = Consulta(**consulta_data)
        self.db.add(consulta)
        self.db.commit()
        self.db.refresh(consulta)
        return consulta

    def update(self, id: int, update_data: dict) -> Consulta:
        consulta = self.find_by_id(id)
        for key, value in update_data.items():
            if value is not None:
                setattr(consulta, key, value)
        self.db.commit()
        self.db.refresh(consulta)
        return consulta

    def count(self) -> int:
        return self.db.query(Consulta).count()
