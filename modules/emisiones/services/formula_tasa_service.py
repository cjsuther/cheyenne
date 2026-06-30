from typing import List, Optional, Dict, Any

from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from models.formula_tasa import FormulaTasa
from services.calculo.interprete import evaluar, evaluar_logica
from services.calculo.orquestador import contexto_desde_datos


class FormulaTasaService:
    def __init__(self, db: Session):
        self.db = db

    def list(self, skip: int = 0, limit: int = 100, tipo_tributo: Optional[str] = None,
             ttas_tasa: Optional[int] = None, solo_activas: bool = False) -> List[FormulaTasa]:
        q = self.db.query(FormulaTasa)
        if tipo_tributo:
            q = q.filter(FormulaTasa.tipo_tributo == tipo_tributo)
        if ttas_tasa is not None:
            q = q.filter(FormulaTasa.ttas_tasa == ttas_tasa)
        if solo_activas:
            q = q.filter(FormulaTasa.activo == True)
        return (
            q.order_by(FormulaTasa.tipo_tributo, FormulaTasa.ttas_tasa,
                       FormulaTasa.ttas_subtasa, FormulaTasa.fort_orden)
            .offset(skip).limit(limit).all()
        )

    def count(self, tipo_tributo: Optional[str] = None, ttas_tasa: Optional[int] = None,
              solo_activas: bool = False) -> int:
        q = self.db.query(FormulaTasa)
        if tipo_tributo:
            q = q.filter(FormulaTasa.tipo_tributo == tipo_tributo)
        if ttas_tasa is not None:
            q = q.filter(FormulaTasa.ttas_tasa == ttas_tasa)
        if solo_activas:
            q = q.filter(FormulaTasa.activo == True)
        return q.count()

    def find_by_id(self, id: int) -> FormulaTasa:
        f = self.db.query(FormulaTasa).filter(FormulaTasa.id == id).first()
        if not f:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail=f"Fórmula {id} no encontrada")
        return f

    def add(self, data: dict) -> FormulaTasa:
        f = FormulaTasa(**data)
        self.db.add(f)
        self.db.commit()
        self.db.refresh(f)
        return f

    def modify(self, id: int, data: dict) -> FormulaTasa:
        f = self.find_by_id(id)
        for k, v in data.items():
            setattr(f, k, v)
        self.db.commit()
        self.db.refresh(f)
        return f

    def remove(self, id: int):
        f = self.find_by_id(id)
        f.activo = False  # soft delete
        self.db.commit()

    def probar(self, formula: str, condicion: Optional[str], periodo: int, mes: int,
               datos_calculo: Dict[str, Any]) -> Dict[str, Any]:
        try:
            ctx = contexto_desde_datos(datos_calculo or {}, periodo, mes)
            aplica = evaluar_logica(condicion, ctx) if (condicion or "").strip() else True
            if not aplica:
                return {"aplica": False, "resultado": None, "error": None}
            val = evaluar(formula, ctx)
            return {"aplica": True, "resultado": float(val), "error": None}
        except Exception as e:
            return {"aplica": False, "resultado": None, "error": str(e)}
