import hmac
import hashlib
import json
from datetime import datetime, timezone
from typing import List, Optional

import httpx
from sqlalchemy.orm import Session
from fastapi import HTTPException, status

from models.pago_notificacion import PagoNotificacion
from config import get_settings

settings = get_settings()


class PagoService:
    def __init__(self, db: Session):
        self.db = db

    def list_notificaciones(self, skip: int = 0, limit: int = 20) -> List[PagoNotificacion]:
        return (
            self.db.query(PagoNotificacion)
            .order_by(PagoNotificacion.fecha_notificacion.desc())
            .offset(skip)
            .limit(limit)
            .all()
        )

    def find_notificacion_by_id(self, id: int) -> PagoNotificacion:
        notificacion = self.db.query(PagoNotificacion).filter(PagoNotificacion.id == id).first()
        if not notificacion:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"Notificación de pago {id} no encontrada",
            )
        return notificacion

    # ── Seguridad del webhook ────────────────────────────────────────
    @staticmethod
    def verify_signature(raw_body: bytes, signature: Optional[str]) -> bool:
        """Valida una firma HMAC-SHA256 del body crudo contra webhook_secret.
        Acepta firma en hex, opcionalmente con prefijo 'sha256='."""
        if not signature:
            return False
        sig = signature.strip()
        if sig.lower().startswith("sha256="):
            sig = sig[7:]
        expected = hmac.new(
            settings.webhook_secret.encode("utf-8"),
            raw_body,
            hashlib.sha256,
        ).hexdigest()
        return hmac.compare_digest(expected, sig.lower())

    # ── Webhook: procesa notificación de pago ────────────────────────
    def process_webhook(self, data: dict, token: Optional[str] = None) -> PagoNotificacion:
        # Idempotencia por id_transaccion_externa del proveedor
        existente = (
            self.db.query(PagoNotificacion)
            .filter(PagoNotificacion.id_transaccion_externa == data["id_transaccion_externa"])
            .first()
        )
        if existente:
            return existente

        notificacion = PagoNotificacion(
            id_pasarela_pago=data["id_pasarela_pago"],
            id_transaccion_externa=data["id_transaccion_externa"],
            comprobante_ref=data.get("comprobante_ref"),
            importe=data["importe"],
            estado=data["estado"],
            datos_notificacion=data.get("datos_notificacion"),
            procesado=False,
        )
        self.db.add(notificacion)
        self.db.commit()
        self.db.refresh(notificacion)

        # Solo impactamos deuda si el pago viene aprobado
        estado = (data.get("estado") or "").lower()
        if estado in ("aprobado", "approved", "acreditado", "pagado", "paid"):
            ok, detalle = self._impactar_deuda(notificacion, token)
            notificacion.impacto_ok = ok
            notificacion.impacto_detalle = detalle
            notificacion.procesado = True
            notificacion.fecha_proceso = datetime.now(timezone.utc)
            self.db.commit()
            self.db.refresh(notificacion)

        return notificacion

    def _impactar_deuda(self, notificacion: PagoNotificacion, token: Optional[str]) -> tuple:
        """Best-effort: registra el pago del comprobante en Emisiones.
        Idempotente por origen_ref = id de transacción del proveedor. No rompe la request."""
        if not notificacion.comprobante_ref:
            return False, "Sin comprobante_ref: no se impacta deuda"
        payload = {
            "comprobante_ref": notificacion.comprobante_ref,
            "importe": str(notificacion.importe),
            "origen_modulo": "interface",
            "origen_ref": notificacion.id_transaccion_externa,
            "medio": "pasarela",
        }
        headers = {}
        if token:
            headers["Authorization"] = token
        try:
            r = httpx.post(
                f"{settings.emisiones_url}/pagos/registrar",
                json=payload,
                headers=headers,
                timeout=8.0,
            )
            if r.status_code < 300:
                return True, f"Impacto OK en emisiones ({r.status_code})"
            return False, f"Emisiones respondió {r.status_code}: {r.text[:200]}"
        except Exception as e:  # best-effort: nunca rompe la notificación
            return False, f"Emisiones no disponible: {e}"
