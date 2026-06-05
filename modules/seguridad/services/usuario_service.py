import sys
import os
from typing import List, Optional

from sqlalchemy.orm import Session
from fastapi import HTTPException, status

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", ".."))
from shared.security import get_password_hash

from models.usuario import Usuario
from models.acceso import Acceso
from models.perfil import Perfil


class UsuarioService:
    def __init__(self, db: Session):
        self.db = db

    def list(self, skip: int = 0, limit: int = 100) -> List[Usuario]:
        return self.db.query(Usuario).offset(skip).limit(limit).all()

    def count(self) -> int:
        return self.db.query(Usuario).count()

    def find_by_id(self, id: int) -> Optional[Usuario]:
        usuario = self.db.query(Usuario).filter(Usuario.id == id).first()
        if not usuario:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Usuario {id} no encontrado",
            )
        return usuario

    def find_by_ids(self, ids: List[int]) -> List[Usuario]:
        return self.db.query(Usuario).filter(Usuario.id.in_(ids)).all()

    def find_by_codigo(self, codigo: str) -> Optional[Usuario]:
        return self.db.query(Usuario).filter(Usuario.codigo == codigo).first()

    def add(self, usuario_data: dict, password: str) -> Usuario:
        existing = self.find_by_codigo(usuario_data["codigo"])
        if existing:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=f"Ya existe un usuario con código {usuario_data['codigo']}",
            )

        usuario = Usuario(**usuario_data)
        self.db.add(usuario)
        self.db.flush()

        acceso = Acceso(
            id_usuario=usuario.id,
            id_tipo_acceso=10,
            identificador=usuario.codigo,
            password=get_password_hash(password),
        )
        self.db.add(acceso)
        self.db.commit()
        self.db.refresh(usuario)
        return usuario

    def modify(self, id: int, update_data: dict) -> Usuario:
        usuario = self.find_by_id(id)
        password = update_data.pop("password", None)

        for key, value in update_data.items():
            if value is not None:
                setattr(usuario, key, value)

        if password:
            acceso = (
                self.db.query(Acceso)
                .filter(Acceso.id_usuario == id)
                .first()
            )
            if acceso:
                acceso.password = get_password_hash(password)

        self.db.commit()
        self.db.refresh(usuario)
        return usuario

    def remove(self, id: int):
        usuario = self.find_by_id(id)
        self.db.delete(usuario)
        self.db.commit()

    def bind_perfiles(self, id: int, perfil_ids: List[int]) -> Usuario:
        usuario = self.find_by_id(id)
        perfiles = self.db.query(Perfil).filter(Perfil.id.in_(perfil_ids)).all()
        for perfil in perfiles:
            if perfil not in usuario.perfiles:
                usuario.perfiles.append(perfil)
        self.db.commit()
        self.db.refresh(usuario)
        return usuario

    def unbind_perfiles(self, id: int, perfil_ids: List[int]) -> Usuario:
        usuario = self.find_by_id(id)
        usuario.perfiles = [p for p in usuario.perfiles if p.id not in perfil_ids]
        self.db.commit()
        self.db.refresh(usuario)
        return usuario
