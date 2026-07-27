from typing import List, Optional

from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from models.declaracion_jurada import DeclaracionJurada
from models.declaracion_jurada_item import DeclaracionJuradaItem


class DeclaracionService:
    def __init__(self, db: Session):
        self.db = db

    def list(self, skip: int = 0, limit: int = 20) -> List[DeclaracionJurada]:
        return (
            self.db.query(DeclaracionJurada)
            .order_by(DeclaracionJurada.id.desc())
            .offset(skip)
            .limit(limit)
            .all()
        )

    def find_by_id(self, id: int) -> DeclaracionJurada:
        declaracion = self.db.query(DeclaracionJurada).filter(DeclaracionJurada.id == id).first()
        if not declaracion:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Declaración jurada {id} no encontrada",
            )
        return declaracion

    def create(self, declaracion_data: dict) -> DeclaracionJurada:
        from decimal import Decimal
        items_data = declaracion_data.pop("items", [])
        # el total se calcula a partir de los renglones (base imponible x alícuota)
        total = Decimal("0")
        for item_data in items_data:
            base = Decimal(str(item_data.get("base_imponible") or 0))
            alic = Decimal(str(item_data.get("alicuota") or 0))
            importe = Decimal(str(item_data.get("importe") or 0))
            if importe == 0 and base and alic:
                importe = (base * alic / Decimal("100")).quantize(Decimal("0.01"))
            item_data["importe"] = importe
            total += importe
        declaracion_data["importe_total"] = total
        declaracion_data["saldo"] = total
        declaracion = DeclaracionJurada(**declaracion_data)
        self.db.add(declaracion)
        self.db.flush()
        if not declaracion.numero_declaracion:
            declaracion.numero_declaracion = f"DDJJ-{declaracion.id:08d}"

        for item_data in items_data:
            self.db.add(DeclaracionJuradaItem(id_declaracion_jurada=declaracion.id, **item_data))

        self.db.commit()
        self.db.refresh(declaracion)
        return declaracion

    def list_by_cuenta(self, id_cuenta: int, skip: int = 0, limit: int = 20) -> List[DeclaracionJurada]:
        return (
            self.db.query(DeclaracionJurada)
            .filter(DeclaracionJurada.id_cuenta == id_cuenta)
            .order_by(DeclaracionJurada.id.desc())
            .offset(skip)
            .limit(limit)
            .all()
        )
