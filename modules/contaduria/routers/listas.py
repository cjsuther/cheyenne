from typing import List, Optional

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from database import get_db
from services.lista_service import ListaService
from schemas.lista import ListaResponse

router = APIRouter(prefix="/listas", tags=["Listas"])


@router.get("", response_model=List[ListaResponse])
def list_listas(
    tipo: Optional[str] = Query(None),
    skip: int = Query(0, ge=0),
    limit: int = Query(20, ge=1, le=100),
    db: Session = Depends(get_db),
):
    service = ListaService(db)
    results = service.list(tipo=tipo)
    return results[skip:skip + limit]
