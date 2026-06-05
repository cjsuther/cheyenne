from typing import List, Optional

from sqlalchemy.orm import Session
from sqlalchemy import or_
from fastapi import HTTPException, status

from models.cuenta import Cuenta


class CuentaService:
    def __init__(self, db: Session):
        self.db = db

    def list(self, skip: int = 0, limit: int = 100, q: str = None) -> List[Cuenta]:
        query = self.db.query(Cuenta)
        if q:
            term = f"%{q}%"
            query = query.filter(
                or_(
                    Cuenta.numero_cuenta.ilike(term),
                    Cuenta.codigo_delegacion.ilike(term),
                )
            )
        return query.offset(skip).limit(limit).all()

    def count(self) -> int:
        return self.db.query(Cuenta).count()

    def find_by_id(self, id: int) -> Cuenta:
        cuenta = self.db.query(Cuenta).filter(Cuenta.id == id).first()
        if not cuenta:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Cuenta {id} no encontrada",
            )
        return cuenta

    def find_by_numero(self, numero_cuenta: str) -> Optional[Cuenta]:
        return (
            self.db.query(Cuenta)
            .filter(Cuenta.numero_cuenta == numero_cuenta)
            .first()
        )

    def list_by_contribuyente(self, id_contribuyente: int, skip: int = 0, limit: int = 100) -> List[Cuenta]:
        return (
            self.db.query(Cuenta)
            .filter(Cuenta.id_contribuyente == id_contribuyente)
            .offset(skip)
            .limit(limit)
            .all()
        )

    def add(self, data: dict) -> Cuenta:
        cuenta = Cuenta(**data)
        self.db.add(cuenta)
        self.db.commit()
        self.db.refresh(cuenta)
        return cuenta

    def modify(self, id: int, update_data: dict) -> Cuenta:
        cuenta = self.find_by_id(id)
        for key, value in update_data.items():
            if value is not None:
                setattr(cuenta, key, value)
        self.db.commit()
        self.db.refresh(cuenta)
        return cuenta
