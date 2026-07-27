from typing import List, Optional

from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from models.recaudacion_lote import RecaudacionLote
from models.recaudacion import Recaudacion


class RecaudacionService:
    def __init__(self, db: Session):
        self.db = db

    # --- Lotes ---

    def list_lotes(self, skip: int = 0, limit: int = 100) -> List[RecaudacionLote]:
        return (
            self.db.query(RecaudacionLote)
            .order_by(RecaudacionLote.fecha_lote.desc())
            .offset(skip)
            .limit(limit)
            .all()
        )

    def count_lotes(self) -> int:
        return self.db.query(RecaudacionLote).count()

    def find_lote_by_id(self, id: int) -> RecaudacionLote:
        item = self.db.query(RecaudacionLote).filter(RecaudacionLote.id == id).first()
        if not item:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"RecaudacionLote {id} no encontrado",
            )
        return item

    def add_lote(self, data: dict) -> RecaudacionLote:
        item = RecaudacionLote(**data)
        self.db.add(item)
        self.db.commit()
        self.db.refresh(item)
        return item

    def modify_lote(self, id: int, update_data: dict) -> RecaudacionLote:
        item = self.find_lote_by_id(id)
        for key, value in update_data.items():
            if value is not None:
                setattr(item, key, value)
        self.db.commit()
        self.db.refresh(item)
        return item

    def remove_lote(self, id: int):
        item = self.find_lote_by_id(id)
        self.db.delete(item)
        self.db.commit()

    # --- Recaudaciones ---

    def list_recaudaciones(self, id_lote: int, skip: int = 0, limit: int = 100) -> List[Recaudacion]:
        return (
            self.db.query(Recaudacion)
            .filter(Recaudacion.id_recaudacion_lote == id_lote)
            .offset(skip)
            .limit(limit)
            .all()
        )

    def count_recaudaciones(self, id_lote: int) -> int:
        return self.db.query(Recaudacion).filter(Recaudacion.id_recaudacion_lote == id_lote).count()

    def find_recaudacion_by_id(self, id: int) -> Recaudacion:
        item = self.db.query(Recaudacion).filter(Recaudacion.id == id).first()
        if not item:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Recaudacion {id} no encontrada",
            )
        return item


    # ── Cobro externo (p. ej. autogestión WAV): consolida en un lote diario ──
    ORIGEN_AUTOGESTION = 900

    def get_or_create_lote_dia(self, fecha, origen_id=None):
        numero = int(fecha.strftime("%Y%m%d"))
        q = self.db.query(RecaudacionLote).filter(RecaudacionLote.numero_lote == numero)
        if origen_id is not None:
            q = q.filter(RecaudacionLote.id_origen_recaudacion == origen_id)
        lote = q.first()
        if not lote:
            lote = RecaudacionLote(numero_lote=numero, fecha_lote=fecha, id_origen_recaudacion=origen_id)
            self.db.add(lote)
            self.db.commit()
            self.db.refresh(lote)
        return lote

    def registrar_cobro_externo(self, importe, numero_cuenta=None, numero_comprobante=None,
                                codigo_tipo_tributo=None, fecha_cobro=None, origen_id=None):
        from datetime import datetime, timezone
        from decimal import Decimal
        fc = fecha_cobro or datetime.now(timezone.utc)
        lote = self.get_or_create_lote_dia(fc.date(), origen_id if origen_id is not None else self.ORIGEN_AUTOGESTION)
        rec = Recaudacion(
            id_recaudacion_lote=lote.id,
            importe_cobro=importe,
            numero_cuenta=numero_cuenta,
            numero_comprobante=numero_comprobante,
            codigo_tipo_tributo=codigo_tipo_tributo,
            fecha_cobro=fc,
        )
        self.db.add(rec)
        lote.casos = (lote.casos or 0) + 1
        lote.importe_total = (Decimal(str(lote.importe_total or 0)) + Decimal(str(importe)))
        self.db.commit()
        self.db.refresh(rec)
        return rec

    def add_recaudacion(self, data: dict) -> Recaudacion:
        item = Recaudacion(**data)
        self.db.add(item)
        self.db.commit()
        self.db.refresh(item)
        return item

    def modify_recaudacion(self, id: int, update_data: dict) -> Recaudacion:
        item = self.find_recaudacion_by_id(id)
        for key, value in update_data.items():
            if value is not None:
                setattr(item, key, value)
        self.db.commit()
        self.db.refresh(item)
        return item

    def remove_recaudacion(self, id: int):
        item = self.find_recaudacion_by_id(id)
        self.db.delete(item)
        self.db.commit()
