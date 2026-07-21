from typing import List, Optional

from sqlalchemy.orm import Session
from fastapi import HTTPException, status

import sys, os
sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", ".."))
from shared.filters import apply_order

from models.permiso import Permiso
from models.perfil import Perfil
from models.usuario import Usuario


class PermisoService:
    def __init__(self, db: Session):
        self.db = db

    def list(self, skip: int = 0, limit: int = 100, sort_by: str = None, sort_dir: str = 'asc') -> List[Permiso]:
        query = apply_order(self.db.query(Permiso), Permiso, {'sort_by': sort_by, 'sort_dir': sort_dir})
        return query.offset(skip).limit(limit).all()

    def count(self) -> int:
        return self.db.query(Permiso).count()

    def find_by_id(self, id: int) -> Optional[Permiso]:
        permiso = self.db.query(Permiso).filter(Permiso.id == id).first()
        if not permiso:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Permiso {id} no encontrado",
            )
        return permiso

    def list_by_perfil(self, perfil_permisos: List[Permiso]) -> List[dict]:
        all_permisos = self.db.query(Permiso).all()
        perfil_permiso_ids = {p.id for p in perfil_permisos}
        result = []
        for permiso in all_permisos:
            result.append({
                "id": permiso.id,
                "codigo": permiso.codigo,
                "nombre": permiso.nombre,
                "descripcion": permiso.descripcion,
                "sistema": permiso.sistema,
                "id_modulo": permiso.id_modulo,
                "selected": permiso.id in perfil_permiso_ids,
            })
        return result

    def list_by_usuario(self, usuario_id: int) -> List[Permiso]:
        usuario = self.db.query(Usuario).filter(Usuario.id == usuario_id).first()
        if not usuario:
            return []
        permisos = set()
        for perfil in usuario.perfiles:
            for permiso in perfil.permisos:
                permisos.add(permiso)
        return list(permisos)

    def check_permisos(self, usuario_id: int, codigo_permiso: str) -> bool:
        usuario = self.db.query(Usuario).filter(Usuario.id == usuario_id).first()
        if not usuario:
            return False
        if usuario.superuser:
            return True
        for perfil in usuario.perfiles:
            for permiso in perfil.permisos:
                if permiso.codigo == codigo_permiso:
                    return True
        return False

    def add(self, permiso_data: dict) -> Permiso:
        existing = self.db.query(Permiso).filter(Permiso.codigo == permiso_data["codigo"]).first()
        if existing:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=f"Ya existe un permiso con código {permiso_data['codigo']}",
            )
        permiso = Permiso(**permiso_data)
        self.db.add(permiso)
        self.db.commit()
        self.db.refresh(permiso)
        return permiso

    def modify(self, id: int, update_data: dict) -> Permiso:
        permiso = self.find_by_id(id)
        for key, value in update_data.items():
            if value is not None:
                setattr(permiso, key, value)
        self.db.commit()
        self.db.refresh(permiso)
        return permiso

    def remove(self, id: int):
        permiso = self.find_by_id(id)
        self.db.delete(permiso)
        self.db.commit()
