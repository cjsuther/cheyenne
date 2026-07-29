import json
import re

import httpx

from config import get_settings

settings = get_settings()

# Tipo de consulta para constancia de padrón (valor de catálogo interface_listas)
TIPO_CONSULTA_CONSTANCIA = 100


class AfipService:
    """Cliente de interfaz AFIP/ARBA. Consulta padrón/constancia.

    Implementación stub configurable por URL (afip_padron_url). Si no hay
    credenciales/URL configuradas, devuelve un resultado SIMULADO claramente
    marcado (simulado=True) para no bloquear el desarrollo/demo."""

    def __init__(self):
        self.base_url = (settings.afip_padron_url or "").strip()
        self.token = (settings.afip_padron_token or "").strip()

    def consultar_constancia(self, cuit: str) -> dict:
        cuit_norm = re.sub(r"\D", "", cuit or "")
        if len(cuit_norm) != 11:
            return {
                "cuit": cuit,
                "ok": False,
                "simulado": True,
                "error": "CUIT inválido: debe tener 11 dígitos",
            }

        if not self.base_url:
            return self._simulado(cuit_norm)

        headers = {}
        if self.token:
            headers["Authorization"] = f"Bearer {self.token}"
        try:
            r = httpx.get(
                f"{self.base_url.rstrip('/')}/constancia/{cuit_norm}",
                headers=headers,
                timeout=10.0,
            )
            if r.status_code < 300:
                data = r.json()
                data.setdefault("cuit", cuit_norm)
                data["ok"] = True
                data["simulado"] = False
                return data
            return {
                "cuit": cuit_norm,
                "ok": False,
                "simulado": False,
                "error": f"AFIP respondió {r.status_code}",
            }
        except Exception as e:
            return {
                "cuit": cuit_norm,
                "ok": False,
                "simulado": False,
                "error": f"Servicio AFIP no disponible: {e}",
            }

    @staticmethod
    def _simulado(cuit_norm: str) -> dict:
        tipo = "PERSONA_FISICA" if cuit_norm[:2] in ("20", "23", "24", "27") else "PERSONA_JURIDICA"
        return {
            "cuit": cuit_norm,
            "ok": True,
            "simulado": True,
            "tipo_persona": tipo,
            "razon_social": f"CONTRIBUYENTE SIMULADO {cuit_norm}",
            "estado": "ACTIVO",
            "domicilio_fiscal": "Sin datos (respuesta simulada)",
            "condicion_iva": "RESPONSABLE INSCRIPTO",
            "nota": "Resultado SIMULADO: no hay afip_padron_url configurada.",
        }
