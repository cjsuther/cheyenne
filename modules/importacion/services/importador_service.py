from typing import List, Optional

from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from models.importacion_lote import ImportacionLote
from models.importacion_detalle import ImportacionDetalle


class ImportadorService:
    def __init__(self, db: Session):
        self.db = db

    def list_lotes(self, skip: int = 0, limit: int = 20) -> List[ImportacionLote]:
        return (
            self.db.query(ImportacionLote)
            .order_by(ImportacionLote.fecha_inicio.desc())
            .offset(skip)
            .limit(limit)
            .all()
        )

    def find_lote_by_id(self, id: int) -> ImportacionLote:
        lote = self.db.query(ImportacionLote).filter(ImportacionLote.id == id).first()
        if not lote:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Lote de importación {id} no encontrado",
            )
        return lote

    def create_lote(self, lote_data: dict) -> ImportacionLote:
        lote = ImportacionLote(**lote_data)
        self.db.add(lote)
        self.db.commit()
        self.db.refresh(lote)
        return lote

    def update_lote_status(self, id: int, update_data: dict) -> ImportacionLote:
        lote = self.find_lote_by_id(id)
        for key, value in update_data.items():
            if value is not None:
                setattr(lote, key, value)
        self.db.commit()
        self.db.refresh(lote)
        return lote

    def list_detalles_by_lote(
        self, id_lote: int, skip: int = 0, limit: int = 20
    ) -> List[ImportacionDetalle]:
        return (
            self.db.query(ImportacionDetalle)
            .filter(ImportacionDetalle.id_importacion_lote == id_lote)
            .order_by(ImportacionDetalle.numero_linea)
            .offset(skip)
            .limit(limit)
            .all()
        )

    def count(self) -> int:
        return self.db.query(ImportacionLote).count()
