from typing import List, Optional

from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from models.boleta import Boleta


class BoletaService:
    def __init__(self, db: Session):
        self.db = db

    def list(self, skip: int = 0, limit: int = 20) -> List[Boleta]:
        return (
            self.db.query(Boleta)
            .order_by(Boleta.fecha_generacion.desc())
            .offset(skip)
            .limit(limit)
            .all()
        )

    def find_by_id(self, id: int) -> Boleta:
        boleta = self.db.query(Boleta).filter(Boleta.id == id).first()
        if not boleta:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Boleta {id} no encontrada",
            )
        return boleta

    def generate_boleta(self, boleta_data: dict) -> Boleta:
        boleta = Boleta(**boleta_data)
        self.db.add(boleta)
        self.db.commit()
        self.db.refresh(boleta)
        return boleta

    def find_by_cuenta(self, numero_cuenta: str, skip: int = 0, limit: int = 20) -> List[Boleta]:
        return (
            self.db.query(Boleta)
            .filter(Boleta.numero_cuenta == numero_cuenta)
            .order_by(Boleta.fecha_generacion.desc())
            .offset(skip)
            .limit(limit)
            .all()
        )
