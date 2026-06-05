from typing import List, Optional

from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from models.cuenta_contable import CuentaContable


class CuentaContableService:
    def __init__(self, db: Session):
        self.db = db

    def list(self, skip: int = 0, limit: int = 100, agrupamiento: Optional[str] = None) -> List[CuentaContable]:
        query = self.db.query(CuentaContable)
        if agrupamiento:
            query = query.filter(CuentaContable.agrupamiento == agrupamiento)
        return query.order_by(CuentaContable.orden).offset(skip).limit(limit).all()

    def count(self, agrupamiento: Optional[str] = None) -> int:
        query = self.db.query(CuentaContable)
        if agrupamiento:
            query = query.filter(CuentaContable.agrupamiento == agrupamiento)
        return query.count()

    def find_by_id(self, id: int) -> CuentaContable:
        cuenta = self.db.query(CuentaContable).filter(CuentaContable.id == id).first()
        if not cuenta:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Cuenta contable {id} no encontrada",
            )
        return cuenta

    def add(self, data: dict) -> CuentaContable:
        cuenta = CuentaContable(**data)
        self.db.add(cuenta)
        self.db.commit()
        self.db.refresh(cuenta)
        return cuenta

    def modify(self, id: int, update_data: dict) -> CuentaContable:
        cuenta = self.find_by_id(id)
        for key, value in update_data.items():
            if value is not None:
                setattr(cuenta, key, value)
        self.db.commit()
        self.db.refresh(cuenta)
        return cuenta

    def remove(self, id: int):
        cuenta = self.find_by_id(id)
        self.db.delete(cuenta)
        self.db.commit()
