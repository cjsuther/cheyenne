from typing import List, Optional

from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from models.recibo_publicacion_lote import ReciboPublicacionLote
from models.recibo_publicacion import ReciboPublicacion
from models.pago_rendicion_lote import PagoRendicionLote
from models.pago_rendicion import PagoRendicion


class ReciboService:
    def __init__(self, db: Session):
        self.db = db

    # --- Recibo Publicacion Lotes ---

    def list_publicacion_lotes(self, skip: int = 0, limit: int = 100) -> List[ReciboPublicacionLote]:
        return (
            self.db.query(ReciboPublicacionLote)
            .order_by(ReciboPublicacionLote.fecha_lote.desc())
            .offset(skip)
            .limit(limit)
            .all()
        )

    def count_publicacion_lotes(self) -> int:
        return self.db.query(ReciboPublicacionLote).count()

    def find_publicacion_lote_by_id(self, id: int) -> ReciboPublicacionLote:
        item = self.db.query(ReciboPublicacionLote).filter(ReciboPublicacionLote.id == id).first()
        if not item:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"ReciboPublicacionLote {id} no encontrado",
            )
        return item

    def add_publicacion_lote(self, data: dict) -> ReciboPublicacionLote:
        item = ReciboPublicacionLote(**data)
        self.db.add(item)
        self.db.commit()
        self.db.refresh(item)
        return item

    def modify_publicacion_lote(self, id: int, update_data: dict) -> ReciboPublicacionLote:
        item = self.find_publicacion_lote_by_id(id)
        for key, value in update_data.items():
            if value is not None:
                setattr(item, key, value)
        self.db.commit()
        self.db.refresh(item)
        return item

    def remove_publicacion_lote(self, id: int):
        item = self.find_publicacion_lote_by_id(id)
        self.db.delete(item)
        self.db.commit()

    # --- Recibo Publicaciones ---

    def list_publicaciones(self, id_lote: int, skip: int = 0, limit: int = 100) -> List[ReciboPublicacion]:
        return (
            self.db.query(ReciboPublicacion)
            .filter(ReciboPublicacion.id_recibo_publicacion_lote == id_lote)
            .offset(skip)
            .limit(limit)
            .all()
        )

    def find_publicacion_by_id(self, id: int) -> ReciboPublicacion:
        item = self.db.query(ReciboPublicacion).filter(ReciboPublicacion.id == id).first()
        if not item:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"ReciboPublicacion {id} no encontrada",
            )
        return item

    def add_publicacion(self, data: dict) -> ReciboPublicacion:
        item = ReciboPublicacion(**data)
        self.db.add(item)
        self.db.commit()
        self.db.refresh(item)
        return item

    def modify_publicacion(self, id: int, update_data: dict) -> ReciboPublicacion:
        item = self.find_publicacion_by_id(id)
        for key, value in update_data.items():
            if value is not None:
                setattr(item, key, value)
        self.db.commit()
        self.db.refresh(item)
        return item

    def remove_publicacion(self, id: int):
        item = self.find_publicacion_by_id(id)
        self.db.delete(item)
        self.db.commit()

    # --- Pago Rendicion Lotes ---

    def list_pago_rendicion_lotes(self, skip: int = 0, limit: int = 100) -> List[PagoRendicionLote]:
        return (
            self.db.query(PagoRendicionLote)
            .order_by(PagoRendicionLote.fecha_lote.desc())
            .offset(skip)
            .limit(limit)
            .all()
        )

    def count_pago_rendicion_lotes(self) -> int:
        return self.db.query(PagoRendicionLote).count()

    def find_pago_rendicion_lote_by_id(self, id: int) -> PagoRendicionLote:
        item = self.db.query(PagoRendicionLote).filter(PagoRendicionLote.id == id).first()
        if not item:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"PagoRendicionLote {id} no encontrado",
            )
        return item

    def add_pago_rendicion_lote(self, data: dict) -> PagoRendicionLote:
        item = PagoRendicionLote(**data)
        self.db.add(item)
        self.db.commit()
        self.db.refresh(item)
        return item

    def modify_pago_rendicion_lote(self, id: int, update_data: dict) -> PagoRendicionLote:
        item = self.find_pago_rendicion_lote_by_id(id)
        for key, value in update_data.items():
            if value is not None:
                setattr(item, key, value)
        self.db.commit()
        self.db.refresh(item)
        return item

    def remove_pago_rendicion_lote(self, id: int):
        item = self.find_pago_rendicion_lote_by_id(id)
        self.db.delete(item)
        self.db.commit()

    # --- Pago Rendiciones ---

    def list_pago_rendiciones(self, id_lote: int, skip: int = 0, limit: int = 100) -> List[PagoRendicion]:
        return (
            self.db.query(PagoRendicion)
            .filter(PagoRendicion.id_pago_rendicion_lote == id_lote)
            .offset(skip)
            .limit(limit)
            .all()
        )

    def find_pago_rendicion_by_id(self, id: int) -> PagoRendicion:
        item = self.db.query(PagoRendicion).filter(PagoRendicion.id == id).first()
        if not item:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"PagoRendicion {id} no encontrada",
            )
        return item

    def add_pago_rendicion(self, data: dict) -> PagoRendicion:
        item = PagoRendicion(**data)
        self.db.add(item)
        self.db.commit()
        self.db.refresh(item)
        return item

    def modify_pago_rendicion(self, id: int, update_data: dict) -> PagoRendicion:
        item = self.find_pago_rendicion_by_id(id)
        for key, value in update_data.items():
            if value is not None:
                setattr(item, key, value)
        self.db.commit()
        self.db.refresh(item)
        return item

    def remove_pago_rendicion(self, id: int):
        item = self.find_pago_rendicion_by_id(id)
        self.db.delete(item)
        self.db.commit()
