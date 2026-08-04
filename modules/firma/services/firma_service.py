"""
Mecanismo de firma del módulo `firma`.

Este servicio implementa una FIRMA ELECTRÓNICA DE REGISTRO: por cada firma se calcula un
sello HMAC-SHA256 con la `secret_key` del módulo sobre (identidad del documento + usuario +
orden + instante). Eso da integridad (el documento no cambió), trazabilidad (quién/cuándo/
desde dónde) y verificabilidad (se puede recomputar y comparar). NO es una firma digital
cualificada — ver `aplicar_firma`.

MODOS DE FIRMA (configurables en la fila única `firma_configuracion`):

  * hmac  -> firma electrónica de registro (HMAC-SHA256). Es lo que funciona hoy.
  * pades -> firma digital cualificada PAdES incrustada en el PDF con certificado/token del
             firmante y sello de tiempo (TSA). NO integrada: falta la credencial real; el
             despachador lanza un ValueError claro pidiendo cargar el certificado y la TSA.
  * gendoc-> firma vía el servicio externo GenDoc (el que usaba el legacy). NO integrada:
             falta la URL/credenciales del servicio; el despachador lanza un ValueError claro.

Es decir: `hmac` firma de verdad; `pades`/`gendoc` están cableados (leen la config, validan
prerequisitos y marcan el punto de integración real) pero avisan claramente que faltan las
credenciales en lugar de simular un éxito.
"""
import hashlib
import hmac
import sys
import os
from datetime import datetime

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "..", ".."))
from config import get_settings
from models.firma import ConfiguracionFirma

settings = get_settings()

MODOS_VALIDOS = ("hmac", "pades", "gendoc")


# ---------------------------------------------------------------------------
# Configuración de sistema (fila única id=1)
# ---------------------------------------------------------------------------
def get_config(db) -> ConfiguracionFirma:
    """Devuelve la fila única de configuración (id=1); la crea con defaults si no existe.

    Los defaults iniciales salen del entorno (settings.firma_modo/gendoc_url/tsa_url), pero
    una vez creada la fila MANDA la fila: cambiarla es vía el endpoint PUT /configuracion.
    """
    cfg = db.query(ConfiguracionFirma).filter(ConfiguracionFirma.id == 1).first()
    if cfg is None:
        modo = settings.firma_modo if settings.firma_modo in MODOS_VALIDOS else "hmac"
        cfg = ConfiguracionFirma(
            id=1,
            modo=modo,
            gendoc_url=settings.gendoc_url or "",
            tsa_url=settings.tsa_url or "",
            actualizado_por=None,
        )
        db.add(cfg)
        db.commit()
        db.refresh(cfg)
    return cfg


# ---------------------------------------------------------------------------
# Núcleo HMAC (modo 'hmac')
# ---------------------------------------------------------------------------
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
    """Punto único de entrada del sello HMAC. Aísla el algoritmo del despachador/router."""
    return calcular_hash_firma(documento, id_usuario, orden_firma, fecha_hora)


def verificar_firma(documento, firma) -> bool:
    """Recomputa el sello de una firma con los mismos datos y lo compara (tiempo constante).

    Solo aplica a firmas de método 'hmac' (las únicas recomputables por este módulo). Para
    métodos cualificados (pades/gendoc) la verificación la haría el validador externo.
    """
    if getattr(firma, "metodo", "hmac") != "hmac":
        # Método cualificado: no recomputable acá; se asume válido si fue emitido por el firmador.
        return firma.estado == "valida"
    esperado = calcular_hash_firma(documento, firma.id_usuario, firma.orden_firma, firma.fecha_hora)
    return hmac.compare_digest(esperado, firma.hash_firma or "")


# ---------------------------------------------------------------------------
# Despachador por modo
# ---------------------------------------------------------------------------
def aplicar_firma(db, documento, firmante, orden: int, fecha_iso: str) -> dict:
    """Despacha la firma según el MODO configurado en la fila única `firma_configuracion`.

    Devuelve un dict {"hash_firma": str, "metodo": str} listo para persistir en la Firma.

    Modos:
      * hmac  -> devuelve el sello HMAC-SHA256 (lo que funciona hoy).
      * pades -> firma digital cualificada PAdES. NO integrada: como no hay certificado ni
                 firmador real, lanza ValueError pidiendo cargar la credencial y la CA/TSA.
                 (Aquí iría pyHanko sign_pdf con el certificado del firmante y la TSA.)
      * gendoc-> firma vía servicio externo GenDoc. Si falta la URL en la config, lanza
                 ValueError; si está seteada, marca el punto de integración (httpx.post) y por
                 ahora lanza ValueError porque faltan las credenciales del servicio. NO simula éxito.

    `fecha_iso` es la fecha/hora en ISO usada para el sello HMAC (coincide con Firma.fecha_hora).
    `firmante` es el dict del usuario actual (identidad/aclaración ya validada contra seguridad).
    """
    cfg = get_config(db)
    modo = (cfg.modo or "hmac").lower()

    if modo == "hmac":
        fecha_hora = datetime.fromisoformat(fecha_iso)
        id_usuario = firmante.get("id") or firmante.get("id_usuario") or 0
        return {
            "hash_firma": calcular_hash_firma(documento, id_usuario, orden, fecha_hora),
            "metodo": "hmac",
        }

    if modo == "pades":
        # PAdES real: incrustar la firma en el PDF con el certificado/token del firmante y sellar
        # con la TSA (cfg.tsa_url). Aquí iría, p.ej.:
        #   from pyhanko.sign import signers, timestamps
        #   signer = signers.SimpleSigner.load(cert_path, key_path, ...)
        #   ts = timestamps.HTTPTimeStamper(cfg.tsa_url)
        #   firmado = signers.sign_pdf(pdf_writer, signature_meta, signer=signer, timestamper=ts)
        # No hay certificado configurado en este entorno -> se avisa claramente.
        raise ValueError(
            "Modo PAdES: falta configurar el certificado del firmante / TSA. "
            "Cargá la credencial en el perfil del usuario y la CA/TSA en Configuración."
        )

    if modo == "gendoc":
        if not (cfg.gendoc_url or "").strip():
            raise ValueError("Modo GenDoc: falta la URL del servicio en Configuración.")
        # Integración GenDoc: enviar el documento al servicio externo para que lo firme.
        # Aquí iría, p.ej.:
        #   import httpx
        #   resp = httpx.post(cfg.gendoc_url, json={...datos del documento y firmante...}, timeout=30)
        #   resp.raise_for_status()
        #   return {"hash_firma": resp.json()["firma"], "metodo": "gendoc"}
        # Faltan las credenciales del servicio -> no se simula éxito.
        raise ValueError("Integracion GenDoc pendiente de credenciales del servicio.")

    raise ValueError(f"Modo de firma desconocido: {modo!r}")
