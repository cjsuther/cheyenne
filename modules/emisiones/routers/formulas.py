import sys
import os
from typing import List, Optional

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", ".."))
from shared.base_module import create_auth_dependency

from database import get_db
from config import get_settings
from services.formula_tasa_service import FormulaTasaService
from schemas.formula_tasa import (
    FormulaTasaCreate, FormulaTasaUpdate, FormulaTasaResponse,
    ProbarFormulaRequest, ProbarFormulaResponse,
)

settings = get_settings()
get_current_user = create_auth_dependency(settings.seguridad_url)

router = APIRouter(prefix="/formulas", tags=["Formulas"])


@router.get("", response_model=List[FormulaTasaResponse])
def list_formulas(
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=200),
    tipo_tributo: Optional[str] = Query(None),
    ttas_tasa: Optional[int] = Query(None),
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    return FormulaTasaService(db).list(skip, limit, tipo_tributo, ttas_tasa)


@router.post("/probar", response_model=ProbarFormulaResponse)
def probar_formula(
    data: ProbarFormulaRequest,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    return FormulaTasaService(db).probar(
        data.formula, data.condicion, data.periodo, data.mes, data.datos_calculo
    )


@router.get("/{id}", response_model=FormulaTasaResponse)
def get_formula(id: int, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    return FormulaTasaService(db).find_by_id(id)


@router.post("", response_model=FormulaTasaResponse, status_code=201)
def create_formula(
    data: FormulaTasaCreate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    return FormulaTasaService(db).add(data.model_dump())


@router.put("/{id}", response_model=FormulaTasaResponse)
def update_formula(
    id: int,
    data: FormulaTasaUpdate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    return FormulaTasaService(db).modify(id, data.model_dump(exclude_unset=True))


@router.delete("/{id}")
def delete_formula(id: int, db: Session = Depends(get_db), current_user: dict = Depends(get_current_user)):
    FormulaTasaService(db).remove(id)
    return {"message": f"Fórmula {id} desactivada"}
