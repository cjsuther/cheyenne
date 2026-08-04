"""
Mecanismo de firma del módulo `firma`.

Este servicio implementa una FIRMA ELECTRÓNICA DE REGISTRO: por cada firma se calcula un
sello HMAC-SHA256 con la `secret_key` del módulo sobre (identidad del documento + usuario +
orden + instante). Eso da integridad (el documento no cambió), trazabilidad (quién/cuándo/
desde dónde) y verificabilidad (se puede recomputar y comparar). NO es una firma digital
cualificada — ver `_firmar_pdf_cualificada`.
"""
import hashlib
import hmac
import sys
import os
from datetime import datetime

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", ".."))
from config import get_settings

settings = get_settings()


def _mensaje(identidad_doc: str, id_usuario, orden_firma: int, fecha_hora_iso: str) -> str:
    """Arma el mensaje canónico que se sella. Formato estable para poder recomputar."""
    return f"{identidad_doc}|{id_usuario}|{orden_firma}|{fecha_hora_iso}"


def _identidad_documento(documento) -> str:
    """Identidad del contenido a firmar: el hash sha256 si el módulo lo mandó,
    o si no un identificador estable `origen_modulo:origen_ref`."""
    if getattr(documento, "contenido_hash", None):
        return documento.contenido_hash
    return f"{documento.origen_modulo}:{documento.origen_ref}"


def calcular_hash_firma(documento, id_usuario, orden_firma: int, fecha_hora: datetime) -> str:
    """HMAC-SHA256(secret_key, mensaje) en hex. Núcleo verificable de la firma de registro."""
    identidad = _identidad_documento(documento)
    mensaje = _mensaje(identidad, id_usuario, orden_firma, fecha_hora.isoformat())
    return hmac.new(
        settings.secret_key.encode("utf-8"),
        mensaje.encode("utf-8"),
        hashlib.sha256,
    ).hexdigest()


def firmar_documento(documento, id_usuario, orden_firma: int, fecha_hora: datetime) -> str:
    """Punto único de entrada del mecanismo de firma. Aísla el algoritmo del router.

    Hoy produce una firma electrónica de registro (HMAC). El punto de integración para
    una firma digital cualificada es `_firmar_pdf_cualificada`.
    """
    return calcular_hash_firma(documento, id_usuario, orden_firma, fecha_hora)


def verificar_firma(documento, firma) -> bool:
    """Recomputa el sello de una firma con los mismos datos y lo compara (tiempo constante)."""
    esperado = calcular_hash_firma(documento, firma.id_usuario, firma.orden_firma, firma.fecha_hora)
    return hmac.compare_digest(esperado, firma.hash_firma or "")


def _firmar_pdf_cualificada(documento, firmante, pdf_bytes: bytes):
    """TRANSPARENCIA: esto es firma electronica de registro (integridad + trazabilidad + auditoria).
    Una firma digital CUALIFICADA (PAdES sobre el PDF con certificado/token, o el servicio GenDoc
    que usaba el legacy) requiere integrar el firmador real; este es el punto de integracion.

    Aquí iría la llamada al firmador (HSM/token PKCS#11, certificado del firmante, o el servicio
    externo GenDoc) que incrusta la firma PAdES en el PDF y devuelve el documento firmado. No está
    implementado a propósito: el resto del módulo no depende de él.
    """
    raise NotImplementedError(
        "Firma digital cualificada (PAdES/GenDoc) no integrada; ver docstring."
    )
