"""
Servicio de envio real de mensajes por email (SMTP via aiosmtplib).

- Resuelve los estados de mensaje (pendiente/enviado/error) a partir de la
  tabla de listas (mismo modulo), buscando por codigo.
- Registra cada intento en comunicacion_intentos_envio.
- Nunca crashea si no hay SMTP configurado: marca error con detalle.
"""
from datetime import datetime, timezone
from email.message import EmailMessage

from sqlalchemy.orm import Session

import aiosmtplib

from models.mensaje import Mensaje
from models.lista import Lista
from models.intento_envio import IntentoEnvio


# Codigos de estado en la lista `estado_mensaje` (ver seed.py)
EST_PENDIENTE = "EST_PENDIENTE"
EST_ENVIADO = "EST_ENVIADO"
EST_ERROR = "EST_ERROR"


def _estado_id(db: Session, codigo: str):
    row = (
        db.query(Lista)
        .filter(Lista.tipo == "estado_mensaje", Lista.codigo == codigo)
        .first()
    )
    return row.id if row else None


def _canal_es_email(db: Session, id_canal) -> bool:
    row = db.query(Lista).filter(Lista.id == id_canal).first()
    if not row:
        return True  # por defecto tratamos como email
    return (row.codigo or "").upper() == "CANAL_EMAIL" or (row.tipo == "canal" and "EMAIL" in (row.codigo or "").upper())


def _registrar_intento(db: Session, id_mensaje: int, resultado: str, detalle: str | None):
    db.add(IntentoEnvio(id_mensaje=id_mensaje, resultado=resultado, detalle_error=detalle))


async def _smtp_send(settings, destinatario: str, asunto: str, cuerpo: str):
    """Despacha realmente por SMTP. Lanza excepcion en caso de fallo."""
    if not settings.smtp_host:
        raise RuntimeError("SMTP no configurado (smtp_host vacio)")

    msg = EmailMessage()
    remitente = settings.smtp_user or f"no-reply@{settings.smtp_host}"
    msg["From"] = remitente
    msg["To"] = destinatario
    msg["Subject"] = asunto
    msg.set_content(cuerpo)

    kwargs = {
        "hostname": settings.smtp_host,
        "port": settings.smtp_port,
        "timeout": 20,
    }
    # STARTTLS en el puerto 587 tipico; TLS implicito en 465
    if settings.smtp_port == 465:
        kwargs["use_tls"] = True
    else:
        kwargs["start_tls"] = True

    if settings.smtp_user:
        kwargs["username"] = settings.smtp_user
        kwargs["password"] = settings.smtp_pass

    await aiosmtplib.send(msg, **kwargs)


async def enviar_mensaje(db: Session, settings, mensaje: Mensaje) -> dict:
    """
    Intenta despachar un Mensaje ya persistido. Actualiza su estado y
    fecha_envio, y registra el intento. Devuelve dict resumen.
    """
    destinatario = (mensaje.identificador or "").strip()
    ok = False
    detalle = None

    try:
        if not destinatario or "@" not in destinatario:
            raise RuntimeError(f"Destinatario invalido: '{destinatario}'")
        if not _canal_es_email(db, mensaje.id_canal):
            raise RuntimeError("El canal del mensaje no es email; solo se soporta envio SMTP")
        await _smtp_send(settings, destinatario, mensaje.titulo, mensaje.cuerpo)
        ok = True
    except Exception as e:  # noqa: BLE001 - best effort, no crashea
        detalle = f"{type(e).__name__}: {e}"

    id_enviado = _estado_id(db, EST_ENVIADO)
    id_error = _estado_id(db, EST_ERROR)

    if ok:
        mensaje.fecha_envio = datetime.now(timezone.utc)
        if id_enviado:
            mensaje.id_estado_mensaje = id_enviado
        _registrar_intento(db, mensaje.id, "enviado", None)
    else:
        if id_error:
            mensaje.id_estado_mensaje = id_error
        _registrar_intento(db, mensaje.id, "error", detalle)

    db.commit()
    db.refresh(mensaje)

    return {
        "id_mensaje": mensaje.id,
        "enviado": ok,
        "estado": mensaje.id_estado_mensaje,
        "detalle_error": detalle,
    }
