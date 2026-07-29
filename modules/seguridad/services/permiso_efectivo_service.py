from typing import List, Dict

from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from models.usuario import Usuario
from models.permiso import Permiso
from models.usuario_permiso import UsuarioPermiso


class PermisoEfectivoService:
    """Calcula permisos efectivos = permisos por perfil + grants - denies (por usuario)."""

    def __init__(self, db: Session):
        self.db = db

    def _grants_denies(self, id_usuario: int):
        rows = (
            self.db.query(UsuarioPermiso)
            .filter(UsuarioPermiso.id_usuario == id_usuario)
            .all()
        )
        grant_ids = {r.id_permiso for r in rows if r.tipo == "grant"}
        deny_ids = {r.id_permiso for r in rows if r.tipo == "deny"}
        return grant_ids, deny_ids

    def permisos_efectivos(self, usuario: Usuario) -> List[Permiso]:
        # Base: permisos por perfil
        base: Dict[int, Permiso] = {}
        for perfil in usuario.perfiles:
            for permiso in perfil.permisos:
                base[permiso.id] = permiso

        grant_ids, deny_ids = self._grants_denies(usuario.id)

        # Sumar grants (traer los permisos que no esten ya presentes)
        faltantes = grant_ids - set(base.keys())
        if faltantes:
            for p in self.db.query(Permiso).filter(Permiso.id.in_(faltantes)).all():
                base[p.id] = p

        # Restar denies
        for pid in deny_ids:
            base.pop(pid, None)

        return list(base.values())

    def list_overrides(self, id_usuario: int) -> List[dict]:
        """Devuelve el catalogo de permisos con el override individual del usuario (grant/deny/None)."""
        rows = (
            self.db.query(UsuarioPermiso)
            .filter(UsuarioPermiso.id_usuario == id_usuario)
            .all()
        )
        override_by_pid = {r.id_permiso: r.tipo for r in rows}

        usuario = self.db.query(Usuario).filter(Usuario.id == id_usuario).first()
        perfil_pids = set()
        if usuario:
            for perfil in usuario.perfiles:
                for permiso in perfil.permisos:
                    perfil_pids.add(permiso.id)

        result = []
        for permiso in self.db.query(Permiso).order_by(Permiso.sistema, Permiso.codigo).all():
            result.append({
                "id": permiso.id,
                "codigo": permiso.codigo,
                "nombre": permiso.nombre,
                "sistema": permiso.sistema,
                "por_perfil": permiso.id in perfil_pids,
                "override": override_by_pid.get(permiso.id),  # 'grant' | 'deny' | None
            })
        return result

    def set_override(self, id_usuario: int, id_permiso: int, tipo: str) -> UsuarioPermiso:
        if tipo not in ("grant", "deny"):
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="tipo debe ser 'grant' o 'deny'")
        if not self.db.query(Usuario).filter(Usuario.id == id_usuario).first():
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Usuario {id_usuario} no encontrado")
        if not self.db.query(Permiso).filter(Permiso.id == id_permiso).first():
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Permiso {id_permiso} no encontrado")

        row = (
            self.db.query(UsuarioPermiso)
            .filter(UsuarioPermiso.id_usuario == id_usuario, UsuarioPermiso.id_permiso == id_permiso)
            .first()
        )
        if row:
            row.tipo = tipo
        else:
            row = UsuarioPermiso(id_usuario=id_usuario, id_permiso=id_permiso, tipo=tipo)
            self.db.add(row)
        self.db.commit()
        self.db.refresh(row)
        return row

    def clear_override(self, id_usuario: int, id_permiso: int):
        row = (
            self.db.query(UsuarioPermiso)
            .filter(UsuarioPermiso.id_usuario == id_usuario, UsuarioPermiso.id_permiso == id_permiso)
            .first()
        )
        if not row:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="No existe override para ese permiso")
        self.db.delete(row)
        self.db.commit()
