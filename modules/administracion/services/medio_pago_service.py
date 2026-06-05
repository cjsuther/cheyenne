from typing import List, Optional

from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from models.medio_pago import MedioPago


class MedioPagoService:
    def __init__(self, db: Session):
        self.db = db

    def list(self, skip: int = 0, limit: int = 100, id_persona: Optional[int] = None, id_tipo_persona: Optional[int] = None) -> List[MedioPago]:
        query = self.db.query(MedioPago)
        if id_persona is not None:
            query = query.filter(MedioPago.id_persona == id_persona)
        if id_tipo_persona is not None:
            query = query.filter(MedioPago.id_tipo_persona == id_tipo_persona)
        return query.offset(skip).limit(limit).all()

    def count(self, id_persona: Optional[int] = None, id_tipo_persona: Optional[int] = None) -> int:
        query = self.db.query(MedioPago)
        if id_persona is not None:
            query = query.filter(MedioPago.id_persona == id_persona)
        if id_tipo_persona is not None:
            query = query.filter(MedioPago.id_tipo_persona == id_tipo_persona)
        return query.count()

    def find_by_id(self, id: int) -> MedioPago:
        medio_pago = self.db.query(MedioPago).filter(MedioPago.id == id).first()
        if not medio_pago:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Medio de pago {id} no encontrado",
            )
        return medio_pago

    def add(self, data: dict) -> MedioPago:
        medio_pago = MedioPago(**data)
        self.db.add(medio_pago)
        self.db.commit()
        self.db.refresh(medio_pago)
        return medio_pago

    def modify(self, id: int, update_data: dict) -> MedioPago:
        medio_pago = self.find_by_id(id)
        for key, value in update_data.items():
            if value is not None:
                setattr(medio_pago, key, value)
        self.db.commit()
        self.db.refresh(medio_pago)
        return medio_pago

    def remove(self, id: int):
        medio_pago = self.find_by_id(id)
        self.db.delete(medio_pago)
        self.db.commit()
