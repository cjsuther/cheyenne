from typing import List, Optional

from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from models.persona_fisica import PersonaFisica
from models.persona_juridica import PersonaJuridica


class PersonaFisicaService:
    def __init__(self, db: Session):
        self.db = db

    def list(self, skip: int = 0, limit: int = 100, activo: Optional[bool] = None) -> List[PersonaFisica]:
        query = self.db.query(PersonaFisica)
        if activo is not None:
            query = query.filter(PersonaFisica.activo == activo)
        return query.offset(skip).limit(limit).all()

    def count(self, activo: Optional[bool] = None) -> int:
        query = self.db.query(PersonaFisica)
        if activo is not None:
            query = query.filter(PersonaFisica.activo == activo)
        return query.count()

    def find_by_id(self, id: int) -> PersonaFisica:
        persona = self.db.query(PersonaFisica).filter(PersonaFisica.id == id).first()
        if not persona:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Persona física {id} no encontrada",
            )
        return persona

    def find_by_documento(self, id_tipo_documento: int, numero_documento: str) -> Optional[PersonaFisica]:
        return (
            self.db.query(PersonaFisica)
            .filter(
                PersonaFisica.id_tipo_documento == id_tipo_documento,
                PersonaFisica.numero_documento == numero_documento,
            )
            .first()
        )

    def add(self, data: dict) -> PersonaFisica:
        persona = PersonaFisica(**data)
        self.db.add(persona)
        self.db.commit()
        self.db.refresh(persona)
        return persona

    def modify(self, id: int, update_data: dict) -> PersonaFisica:
        persona = self.find_by_id(id)
        for key, value in update_data.items():
            if value is not None:
                setattr(persona, key, value)
        self.db.commit()
        self.db.refresh(persona)
        return persona

    def remove(self, id: int):
        persona = self.find_by_id(id)
        self.db.delete(persona)
        self.db.commit()


class PersonaJuridicaService:
    def __init__(self, db: Session):
        self.db = db

    def list(self, skip: int = 0, limit: int = 100, activo: Optional[bool] = None) -> List[PersonaJuridica]:
        query = self.db.query(PersonaJuridica)
        if activo is not None:
            query = query.filter(PersonaJuridica.activo == activo)
        return query.offset(skip).limit(limit).all()

    def count(self, activo: Optional[bool] = None) -> int:
        query = self.db.query(PersonaJuridica)
        if activo is not None:
            query = query.filter(PersonaJuridica.activo == activo)
        return query.count()

    def find_by_id(self, id: int) -> PersonaJuridica:
        persona = self.db.query(PersonaJuridica).filter(PersonaJuridica.id == id).first()
        if not persona:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Persona jurídica {id} no encontrada",
            )
        return persona

    def find_by_documento(self, id_tipo_documento: int, numero_documento: str) -> Optional[PersonaJuridica]:
        return (
            self.db.query(PersonaJuridica)
            .filter(
                PersonaJuridica.id_tipo_documento == id_tipo_documento,
                PersonaJuridica.numero_documento == numero_documento,
            )
            .first()
        )

    def add(self, data: dict) -> PersonaJuridica:
        persona = PersonaJuridica(**data)
        self.db.add(persona)
        self.db.commit()
        self.db.refresh(persona)
        return persona

    def modify(self, id: int, update_data: dict) -> PersonaJuridica:
        persona = self.find_by_id(id)
        for key, value in update_data.items():
            if value is not None:
                setattr(persona, key, value)
        self.db.commit()
        self.db.refresh(persona)
        return persona

    def remove(self, id: int):
        persona = self.find_by_id(id)
        self.db.delete(persona)
        self.db.commit()
