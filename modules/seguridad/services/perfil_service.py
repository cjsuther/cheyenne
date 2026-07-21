from typing import List, Optional

from sqlalchemy.orm import Session
from fastapi import HTTPException, status

import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", ".."))
from shared.filters import apply_order

from models.perfil import Perfil
from models.permiso import Permiso


class PerfilService:
    def __init__(self, db: Session):
        self.db = db

    def list(self, skip: int = 0, limit: int = 100, sort_by: str = None, sort_dir: str = 'asc') -> List[Perfil]:
        query = apply_order(self.db.query(Perfil), Perfil, {'sort_by': sort_by, 'sort_dir': sort_dir})
        return query.offset(skip).limit(limit).all()

    def count(self) -> int:
        return self.db.query(Perfil).count()

    def find_by_id(self, id: int) -> Optional[Perfil]:
        perfil = self.db.query(Perfil).filter(Perfil.id == id).first()
        if not perfil:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Perfil {id} no encontrado",
            )
        return perfil

    def list_by_usuario(self, usuario_perfiles: List[Perfil]) -> List[dict]:
        all_perfiles = self.db.query(Perfil).all()
        usuario_perfil_ids = {p.id for p in usuario_perfiles}
        result = []
        for perfil in all_perfiles:
            result.append({
                "id": perfil.id,
                "codigo": perfil.codigo,
                "nombre": perfil.nombre,
                "selected": perfil.id in usuario_perfil_ids,
            })
        return result

    def add(self, perfil_data: dict) -> Perfil:
        existing = self.db.query(Perfil).filter(Perfil.codigo == perfil_data["codigo"]).first()
        if existing:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=f"Ya existe un perfil con código {perfil_data['codigo']}",
            )
        perfil = Perfil(**perfil_data)
        self.db.add(perfil)
        self.db.commit()
        self.db.refresh(perfil)
        return perfil

    def modify(self, id: int, update_data: dict) -> Perfil:
        perfil = self.find_by_id(id)
        for key, value in update_data.items():
            if value is not None:
                setattr(perfil, key, value)
        self.db.commit()
        self.db.refresh(perfil)
        return perfil

    def remove(self, id: int):
        perfil = self.find_by_id(id)
        self.db.delete(perfil)
        self.db.commit()

    def bind_permisos(self, id: int, permiso_ids: List[int]) -> Perfil:
        perfil = self.find_by_id(id)
        permisos = self.db.query(Permiso).filter(Permiso.id.in_(permiso_ids)).all()
        for permiso in permisos:
            if permiso not in perfil.permisos:
                perfil.permisos.append(permiso)
        self.db.commit()
        self.db.refresh(perfil)
        return perfil

    def unbind_permisos(self, id: int, permiso_ids: List[int]) -> Perfil:
        perfil = self.find_by_id(id)
        perfil.permisos = [p for p in perfil.permisos if p.id not in permiso_ids]
        self.db.commit()
        self.db.refresh(perfil)
        return perfil
