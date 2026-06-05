from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session

from database import get_db
from services.auth_service import AuthService
from models.usuario import Usuario

security_scheme = HTTPBearer()


def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security_scheme),
    db: Session = Depends(get_db),
) -> Usuario:
    token = credentials.credentials
    auth_service = AuthService(db)
    usuario = auth_service.get_current_user(token)
    if not usuario:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token inválido o sesión expirada",
        )
    return usuario


def require_permission(codigo_permiso: str):
    def dependency(
        current_user: Usuario = Depends(get_current_user),
        db: Session = Depends(get_db),
    ) -> Usuario:
        if current_user.superuser:
            return current_user
        from services.permiso_service import PermisoService
        permiso_service = PermisoService(db)
        if not permiso_service.check_permisos(current_user.id, codigo_permiso):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"No tiene el permiso '{codigo_permiso}'",
            )
        return current_user
    return dependency
