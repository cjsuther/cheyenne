from typing import List, Optional

from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from models.cuenta import Cuenta


class CuentaService:
    def __init__(self, db: Session):
        self.db = db

    def list(self, skip: int = 0, limit: int = 20) -> List[Cuenta]:
        return (
            self.db.query(Cuenta)
            .offset(skip)
            .limit(limit)
            .all()
        )

    def find_by_id(self, id: int) -> Cuenta:
        cuenta = self.db.query(Cuenta).filter(Cuenta.id == id).first()
        if not cuenta:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Cuenta {id} no encontrada",
            )
        return cuenta

    def find_by_numero(self, numero_cuenta: str) -> Cuenta:
        cuenta = self.db.query(Cuenta).filter(Cuenta.numero_cuenta == numero_cuenta).first()
        if not cuenta:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Cuenta con número {numero_cuenta} no encontrada",
            )
        return cuenta

    def create(self, data: dict) -> Cuenta:
        if not data.get("numero_cuenta"):
            # numero de cuenta autogenerado: tributo + contribuyente + correlativo
            n = self.db.query(Cuenta).count() + 1
            data["numero_cuenta"] = f"WAV-{int(data.get('id_tipo_tributo') or 0):03d}-{n:06d}"
        cuenta = Cuenta(**data)
        self.db.add(cuenta)
        self.db.commit()
        self.db.refresh(cuenta)
        return cuenta

    def list_by_contribuyente(self, id_contribuyente: int, skip: int = 0, limit: int = 20) -> List[Cuenta]:
        return (
            self.db.query(Cuenta)
            .filter(Cuenta.id_contribuyente == id_contribuyente)
            .offset(skip)
            .limit(limit)
            .all()
        )
