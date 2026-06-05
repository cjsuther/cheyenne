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
    db: Session = Depends(get_db),
):
    service = ListaService(db)
    return service.list(tipo=tipo)
