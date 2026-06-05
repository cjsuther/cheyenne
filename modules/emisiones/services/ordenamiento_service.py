from typing import Dict, Any

from sqlalchemy.orm import Session

from models.emision import Emision
from models.liquidacion import Liquidacion
from models.ordenamiento import Ordenamiento, OrdenamientoItem


class OrdenamientoService:
    def __init__(self, db: Session):
        self.db = db

    def generar_ordenamiento(self, id_emision: int) -> Dict[str, Any]:
        emision = self.db.query(Emision).filter(Emision.id == id_emision).first()
        if not emision:
            raise ValueError(f"Emision {id_emision} no encontrada")

        liquidaciones = self.db.query(Liquidacion).filter(
            Liquidacion.id_emision == id_emision,
            Liquidacion.activo == True,
        ).order_by(Liquidacion.id_contribuyente).all()

        ordenamiento = Ordenamiento(
            id_emision=id_emision,
            nombre=f"Ordenamiento {emision.tipo_tributo} - {emision.periodo}",
            descripcion=f"Ordenamiento secuencial para emision {id_emision}",
            tipo="secuencial",
            cantidad_items=len(liquidaciones),
        )
        self.db.add(ordenamiento)
        self.db.commit()
        self.db.refresh(ordenamiento)

        for i, liq in enumerate(liquidaciones, 1):
            item = OrdenamientoItem(
                id_ordenamiento=ordenamiento.id,
                id_liquidacion=liq.id,
                id_contribuyente=liq.id_contribuyente,
                numero_orden=i,
            )
            self.db.add(item)
        self.db.commit()

        return {
            "id_ordenamiento": ordenamiento.id,
            "items_generados": len(liquidaciones),
        }
