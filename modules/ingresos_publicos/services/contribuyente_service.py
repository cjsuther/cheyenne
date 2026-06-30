from typing import List, Optional

from sqlalchemy.orm import Session
from sqlalchemy import or_, func
from fastapi import HTTPException, status

from models.contribuyente import Contribuyente
from models.persona import Persona


class ContribuyenteService:
    def __init__(self, db: Session):
        self.db = db

    def list(self, skip: int = 0, limit: int = 100) -> List[Contribuyente]:
        return self.db.query(Contribuyente).offset(skip).limit(limit).all()

    def search(self, q: str, limit: int = 20) -> List[dict]:
        """Busca contribuyentes por CUIL/DNI (numero_documento) o nombre/apellido/denominación.
        Insensible a acentos y mayúsculas (vía unaccent + ilike)."""
        term = f"%{q}%"

        def like(col):
            # unaccent en ambos lados => 'garcia' matchea 'García'
            return func.unaccent(col).ilike(func.unaccent(term))

        rows = (
            self.db.query(Contribuyente, Persona)
            .join(Persona, Persona.id == Contribuyente.id_persona)
            .filter(Contribuyente.activo == True)
            .filter(or_(
                like(Persona.nombre),
                like(Persona.apellido),
                like(Persona.denominacion),
                Persona.numero_documento.ilike(term),
                Contribuyente.numero_documento.ilike(term),
            ))
            .limit(limit)
            .all()
        )
        result = []
        for c, p in rows:
            nombre_completo = (
                p.denominacion
                or " ".join(x for x in [p.nombre, p.apellido] if x)
                or c.numero_documento
            )
            result.append({
                "id": c.id,
                "id_persona": p.id,
                "id_tipo_persona": c.id_tipo_persona,
                "numero_documento": c.numero_documento,
                "nombre": p.nombre,
                "apellido": p.apellido,
                "denominacion": p.denominacion,
                "nombre_completo": nombre_completo,
            })
        return result

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
