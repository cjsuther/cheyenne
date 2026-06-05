from typing import List, Optional

from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from models.exportacion_lote import ExportacionLote


class ExportadorService:
    def __init__(self, db: Session):
        self.db = db

    def list_lotes(self, skip: int = 0, limit: int = 20) -> List[ExportacionLote]:
        return (
            self.db.query(ExportacionLote)
            .order_by(ExportacionLote.fecha_creacion.desc())
            .offset(skip)
            .limit(limit)
            .all()
        )

    def find_lote_by_id(self, id: int) -> ExportacionLote:
        lote = self.db.query(ExportacionLote).filter(ExportacionLote.id == id).first()
        if not lote:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Lote de exportación {id} no encontrado",
            )
        return lote

    def create_lote(self, lote_data: dict) -> ExportacionLote:
        lote = ExportacionLote(**lote_data)
        self.db.add(lote)
        self.db.commit()
        self.db.refresh(lote)
        return lote
