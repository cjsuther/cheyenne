"""
Seed de datos para el módulo Comunicación.
    docker compose exec comunicacion python seed.py
"""
import sys
import os

sys.path.insert(0, os.path.dirname(__file__))
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from database import SessionLocal, engine
from shared.database import Base

from models.lista import Lista
from models.mensaje import Mensaje


def seed():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    if db.query(Lista).first():
        print("Ya existen datos en comunicacion. Seed omitido.")
        db.close()
        return

    # ══════════════════════════════════════════════════════════════════
    # LISTAS
    # ══════════════════════════════════════════════════════════════════
    listas = [
        # Tipos de mensaje
        Lista(codigo="MSG_NOTIFICACION", tipo="tipo_mensaje", nombre="Notificación", orden=1),
        Lista(codigo="MSG_AVISO", tipo="tipo_mensaje", nombre="Aviso", orden=2),
        Lista(codigo="MSG_RECORDATORIO", tipo="tipo_mensaje", nombre="Recordatorio", orden=3),
        Lista(codigo="MSG_ALERTA", tipo="tipo_mensaje", nombre="Alerta", orden=4),
        Lista(codigo="MSG_CIRCULAR", tipo="tipo_mensaje", nombre="Circular", orden=5),
        # Estados de mensaje
        Lista(codigo="EST_BORRADOR", tipo="estado_mensaje", nombre="Borrador", orden=1),
        Lista(codigo="EST_PENDIENTE", tipo="estado_mensaje", nombre="Pendiente", orden=2),
        Lista(codigo="EST_ENVIADO", tipo="estado_mensaje", nombre="Enviado", orden=3),
        Lista(codigo="EST_RECIBIDO", tipo="estado_mensaje", nombre="Recibido", orden=4),
        Lista(codigo="EST_LEIDO", tipo="estado_mensaje", nombre="Leído", orden=5),
        Lista(codigo="EST_ERROR", tipo="estado_mensaje", nombre="Error", orden=6),
        # Canales
        Lista(codigo="CANAL_EMAIL", tipo="canal", nombre="Email", orden=1),
        Lista(codigo="CANAL_SMS", tipo="canal", nombre="SMS", orden=2),
        Lista(codigo="CANAL_PUSH", tipo="canal", nombre="Push Notification", orden=3),
        Lista(codigo="CANAL_INTERNO", tipo="canal", nombre="Mensaje Interno", orden=4),
        # Prioridades
        Lista(codigo="PRIO_BAJA", tipo="prioridad", nombre="Baja", orden=1),
        Lista(codigo="PRIO_NORMAL", tipo="prioridad", nombre="Normal", orden=2),
        Lista(codigo="PRIO_ALTA", tipo="prioridad", nombre="Alta", orden=3),
        Lista(codigo="PRIO_URGENTE", tipo="prioridad", nombre="Urgente", orden=4),
    ]
    for i, l in enumerate(listas):
        l.id = i + 1
        db.add(l)
    db.flush()

    tipo_msg = {l.codigo: l.id for l in listas if l.tipo == "tipo_mensaje"}
    est_msg = {l.codigo: l.id for l in listas if l.tipo == "estado_mensaje"}
    canal = {l.codigo: l.id for l in listas if l.tipo == "canal"}
    prio = {l.codigo: l.id for l in listas if l.tipo == "prioridad"}

    # ══════════════════════════════════════════════════════════════════
    # MENSAJES
    # Notificaciones del sistema consistentes con las operaciones
    # de los otros módulos
    # ══════════════════════════════════════════════════════════════════
    mensajes = [
        # Notificaciones de vencimiento ABL (a contribuyentes del seed de IP)
        Mensaje(
            id_tipo_mensaje=tipo_msg["MSG_RECORDATORIO"],
            id_estado_mensaje=est_msg["EST_ENVIADO"],
            id_canal=canal["CANAL_EMAIL"],
            id_prioridad=prio["PRIO_NORMAL"],
            identificador="jcgarcia@email.com",
            titulo="Recordatorio: Vencimiento ABL Periodo 3/2025",
            cuerpo="Estimado Juan Carlos García López,\n\nLe recordamos que el vencimiento de su ABL (cuenta ABL-001-2025) periodo 3/2025 es el 10/03/2025.\nImporte: $8.500,00\n\nMunicipalidad de Cheyenne",
            id_usuario_creacion=1,
        ),
        Mensaje(
            id_tipo_mensaje=tipo_msg["MSG_RECORDATORIO"],
            id_estado_mensaje=est_msg["EST_ENVIADO"],
            id_canal=canal["CANAL_EMAIL"],
            id_prioridad=prio["PRIO_NORMAL"],
            identificador="mrodriguez@estudio.com",
            titulo="Recordatorio: Vencimiento ABL Periodo 3/2025",
            cuerpo="Estimada María Elena Rodríguez,\n\nLe recordamos que el vencimiento de su ABL (cuenta ABL-002-2025) periodo 3/2025 es el 10/03/2025.\nImporte: $6.200,00\n\nMunicipalidad de Cheyenne",
            id_usuario_creacion=1,
        ),

        # Notificación de multa
        Mensaje(
            id_tipo_mensaje=tipo_msg["MSG_ALERTA"],
            id_estado_mensaje=est_msg["EST_ENVIADO"],
            id_canal=canal["CANAL_EMAIL"],
            id_prioridad=prio["PRIO_ALTA"],
            identificador="jcgarcia@email.com",
            titulo="Multa por mora - ABL Periodo 3/2025",
            cuerpo="Estimado Juan Carlos García López,\n\nSe le informa que se ha generado la multa MLT-2025-001 por $2.500,00 debido a mora en el pago de ABL periodo 3/2025.\nFecha de vencimiento: 30/04/2025.\n\nMunicipalidad de Cheyenne",
            id_usuario_creacion=1,
        ),

        # Notificación de habilitación comercial
        Mensaje(
            id_tipo_mensaje=tipo_msg["MSG_NOTIFICACION"],
            id_estado_mensaje=est_msg["EST_ENVIADO"],
            id_canal=canal["CANAL_EMAIL"],
            id_prioridad=prio["PRIO_NORMAL"],
            identificador="info@constructoradelsur.com.ar",
            titulo="Certificado de habilitación emitido",
            cuerpo="Estimados Constructora del Sur S.A.,\n\nSe ha emitido el certificado de habilitación HAB-2025-001 con vencimiento 10/03/2026.\nPuede descargarlo desde el portal municipal.\n\nMunicipalidad de Cheyenne",
            id_usuario_creacion=1,
        ),

        # Circular interna
        Mensaje(
            id_tipo_mensaje=tipo_msg["MSG_CIRCULAR"],
            id_estado_mensaje=est_msg["EST_ENVIADO"],
            id_canal=canal["CANAL_INTERNO"],
            id_prioridad=prio["PRIO_NORMAL"],
            identificador="todos",
            titulo="Cierre de caja - Recordatorio diario",
            cuerpo="Se recuerda a todos los operadores de caja que deben realizar el cierre diario antes de las 18:00 hs.\n\nDirección de Tesorería",
            id_usuario_creacion=1,
        ),

        # Aviso de plan de pago
        Mensaje(
            id_tipo_mensaje=tipo_msg["MSG_AVISO"],
            id_estado_mensaje=est_msg["EST_ENVIADO"],
            id_canal=canal["CANAL_EMAIL"],
            id_prioridad=prio["PRIO_NORMAL"],
            identificador="jcgarcia@email.com",
            titulo="Plan de pago aprobado",
            cuerpo="Estimado Juan Carlos García López,\n\nSu plan de pago #1 ha sido aprobado.\nTotal: $51.000,00 en 6 cuotas de $7.650,00.\nAnticipo: $5.100,00.\nVencimiento: 10/09/2025.\n\nMunicipalidad de Cheyenne",
            id_usuario_creacion=1,
        ),

        # Notificación de pago recibido
        Mensaje(
            id_tipo_mensaje=tipo_msg["MSG_NOTIFICACION"],
            id_estado_mensaje=est_msg["EST_RECIBIDO"],
            id_canal=canal["CANAL_EMAIL"],
            id_prioridad=prio["PRIO_BAJA"],
            identificador="jcgarcia@email.com",
            titulo="Pago recibido - ABL Periodo 1/2025",
            cuerpo="Estimado Juan Carlos García López,\n\nHemos recibido su pago de $7.650,00 correspondiente al ABL periodo 1/2025 (cuenta ABL-001-2025).\nRecibo: R-001.\n\nMunicipalidad de Cheyenne",
            id_usuario_creacion=1,
        ),

        # SMS de vencimiento
        Mensaje(
            id_tipo_mensaje=tipo_msg["MSG_RECORDATORIO"],
            id_estado_mensaje=est_msg["EST_ENVIADO"],
            id_canal=canal["CANAL_SMS"],
            id_prioridad=prio["PRIO_NORMAL"],
            identificador="+54 9 221 555-1234",
            titulo="Vencimiento ABL",
            cuerpo="Municipalidad Cheyenne: Su ABL vence el 10/03. Importe: $8500. Pague en linea en www.cheyenne.gob.ar",
            id_usuario_creacion=1,
        ),

        # Alerta interna: infracción ISH
        Mensaje(
            id_tipo_mensaje=tipo_msg["MSG_ALERTA"],
            id_estado_mensaje=est_msg["EST_LEIDO"],
            id_canal=canal["CANAL_INTERNO"],
            id_prioridad=prio["PRIO_ALTA"],
            identificador="admin",
            titulo="Infracción detectada: Constructora del Sur",
            cuerpo="Se ha generado la multa MLT-2025-002 ($15.000,00) para Constructora del Sur S.A. por falta de documentación de seguridad.\nExpediente asociado: ADM-2025-1-A.\n\nDirección de Ingresos Públicos",
            id_usuario_creacion=1,
        ),

        # Notificación de libre deuda
        Mensaje(
            id_tipo_mensaje=tipo_msg["MSG_NOTIFICACION"],
            id_estado_mensaje=est_msg["EST_ENVIADO"],
            id_canal=canal["CANAL_EMAIL"],
            id_prioridad=prio["PRIO_BAJA"],
            identificador="mrodriguez@estudio.com",
            titulo="Certificado de libre deuda emitido",
            cuerpo="Estimada María Elena Rodríguez,\n\nSe ha emitido el certificado de libre deuda LD-2025-001 para su cuenta ABL-002-2025.\nVigencia hasta: 30/06/2025.\n\nMunicipalidad de Cheyenne",
            id_usuario_creacion=1,
        ),

        # Mensaje con error de envío
        Mensaje(
            id_tipo_mensaje=tipo_msg["MSG_RECORDATORIO"],
            id_estado_mensaje=est_msg["EST_ERROR"],
            id_canal=canal["CANAL_EMAIL"],
            id_prioridad=prio["PRIO_NORMAL"],
            identificador="email_invalido@noexiste",
            titulo="Recordatorio: Vencimiento ISH",
            cuerpo="Estimado contribuyente...",
            id_usuario_creacion=1,
        ),

        # Mensaje urgente de moratoria
        Mensaje(
            id_tipo_mensaje=tipo_msg["MSG_AVISO"],
            id_estado_mensaje=est_msg["EST_ENVIADO"],
            id_canal=canal["CANAL_EMAIL"],
            id_prioridad=prio["PRIO_URGENTE"],
            identificador="todos_contribuyentes",
            titulo="Moratoria municipal - Últimos días!",
            cuerpo="Estimado/a contribuyente,\n\nLe informamos que la moratoria municipal 2025 (Plan PP-MORA-24) vence el 30/06/2025.\nBeneficios: hasta 24 cuotas con 2% de interés y solo 5% de anticipo.\n\nNo pierda esta oportunidad. Consulte en www.cheyenne.gob.ar o acérquese a nuestras oficinas.\n\nMunicipalidad de Cheyenne",
            id_usuario_creacion=1,
        ),
    ]
    for m in mensajes:
        db.add(m)

    db.commit()
    db.close()

    print("Seed de Comunicación completado.")
    print(f"  - {len(listas)} listas de referencia")
    print(f"  - {len(mensajes)} mensajes")


if __name__ == "__main__":
    seed()
