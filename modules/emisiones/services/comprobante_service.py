from decimal import Decimal
from typing import Dict, Any

from sqlalchemy.orm import Session

from models.emision import Emision
from models.liquidacion import Liquidacion
from models.comprobante import Comprobante


class ComprobanteService:
    def __init__(self, db: Session):
        self.db = db

    def generar_comprobantes(self, id_emision: int) -> Dict[str, Any]:
        """Agrupa las liquidaciones por cuenta (contribuyente + objeto) en un comprobante
        cobrable por cada una, con su importe y código de barras."""
        emision = self.db.query(Emision).filter(Emision.id == id_emision).first()
        if not emision:
            raise ValueError(f"Emision {id_emision} no encontrada")

        liquidaciones = self.db.query(Liquidacion).filter(
            Liquidacion.id_emision == id_emision, Liquidacion.activo == True
        ).all()

        # agrupar por (contribuyente, objeto imponible)
        grupos: Dict[tuple, list] = {}
        for liq in liquidaciones:
            grupos.setdefault((liq.id_contribuyente, liq.id_objeto_imponible), []).append(liq)

        # idempotente
        self.db.query(Comprobante).filter(Comprobante.id_emision == id_emision).delete()

        creados = 0
        for (id_contrib, id_obj), liqs in grupos.items():
            a_cancelar = sum((Decimal(str(l.a_cancelar or 0)) for l in liqs), Decimal("0"))
            a_pagar = sum((Decimal(str(l.a_pagar or 0)) for l in liqs), Decimal("0"))
            if a_pagar <= 0 and a_cancelar <= 0:
                continue
            seq = creados + 1
            numero = f"E{id_emision:06d}-{seq:06d}"
            # código de barras: emisión(6) + contribuyente(8) + importe en centavos(12)
            codigo = f"{id_emision:06d}{(id_contrib or 0):08d}{int(a_pagar * 100):012d}"
            comp = Comprobante(
                id_emision=id_emision,
                id_contribuyente=id_contrib,
                id_objeto_imponible=id_obj,
                numero_comprobante=numero,
                tipo_tributo=emision.tipo_tributo,
                periodo=emision.periodo,
                cantidad_lineas=len(liqs),
                importe_a_cancelar=a_cancelar,
                importe_total=a_pagar,
                codigo_barras=codigo,
                estado="emitido",
            )
            self.db.add(comp)
            for l in liqs:
                l.numero_comprobante = numero
            creados += 1

        self.db.commit()
        return {"comprobantes_generados": creados}
