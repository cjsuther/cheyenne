"""
Seed de datos DEMO para el módulo Firma Digital.
Puebla firma_documentos con ~6 documentos que simulan Órdenes de Pago de Tesorería
(origen_modulo='tesoreria', origen_tipo='orden_pago', origen_ref='OP-DEMO-0001'...) y
sus firma_firmas, con estados variados: sin firmar, firma parcial y firmado completo.

Las firmas sembradas usan la MISMA lógica de sellado que el service (firma_service),
de modo que el endpoint /verificar las da por válidas.

Idempotente: si ya existe un documento con origen_ref que empieza con 'OP-DEMO-', omite.

    docker compose exec firma python seed_demo.py
"""
import sys
import os
from datetime import datetime, timezone, timedelta

sys.path.insert(0, os.path.dirname(__file__))
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from database import SessionLocal, engine
from shared.database import Base
from models.firma import DocumentoFirmable, Firma
from services import firma_service


# Firmantes DEMO (id_usuario, nombre, documento) — roles típicos del circuito de una OP.
FIRMANTES = [
    (1001, "Cra. Laura Giménez (Contadora Municipal)", "27.883.114"),
    (1002, "Lic. Roberto Paz (Secretario de Hacienda)", "24.551.907"),
    (1003, "Sr. Daniel Ocampo (Tesorero Municipal)", "20.114.762"),
]


# (origen_ref, titulo, cantidad_firmas, firmas_a_poner, id_oficina)
DOCUMENTOS = [
    ("OP-DEMO-0001", "Orden de Pago N° 0001 - Beneficiario: Vialidad del Sur S.A.", 2, 0, None),
    ("OP-DEMO-0002", "Orden de Pago N° 0002 - Beneficiario: Distribuidora Eléctrica Regional", 3, 0, None),
    ("OP-DEMO-0003", "Orden de Pago N° 0003 - Beneficiario: Construcciones Andinas SRL", 2, 1, None),
    ("OP-DEMO-0004", "Orden de Pago N° 0004 - Beneficiario: Farmacia Central (Insumos Salud)", 3, 1, None),
    ("OP-DEMO-0005", "Orden de Pago N° 0005 - Beneficiario: Servicios Urbanos Municipales", 2, 2, None),
    ("OP-DEMO-0006", "Orden de Pago N° 0006 - Beneficiario: Papelera del Litoral SA", 2, 0, 501),
]


def seed():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        ya = (db.query(DocumentoFirmable)
              .filter(DocumentoFirmable.origen_ref.like("OP-DEMO-%"))
              .first())
        if ya:
            print("seed_demo firma: ya sembrado, omito")
            return

        base = datetime.now(timezone.utc) - timedelta(days=10)
        n_doc = n_fir = 0

        for i, (ref, titulo, req, a_poner, oficina) in enumerate(DOCUMENTOS):
            try:
                creado = base + timedelta(days=i)
                doc = DocumentoFirmable(
                    origen_modulo="tesoreria",
                    origen_tipo="orden_pago",
                    origen_ref=ref,
                    titulo=titulo,
                    descripcion="Documento de demostración generado por seed_demo.",
                    archivo_nombre=f"{ref}.pdf",
                    contenido_hash=None,
                    cantidad_firmas=req,
                    id_oficina=oficina,
                    id_usuario_creador=FIRMANTES[0][0],
                    estado="pendiente",
                    created_at=creado,
                    activo=True,
                )
                db.add(doc)
                db.flush()  # obtener doc.id
                n_doc += 1

                for k in range(a_poner):
                    uid, nombre, documento = FIRMANTES[k]
                    orden = k + 1
                    fh = creado + timedelta(hours=orden)
                    hash_firma = firma_service.firmar_documento(doc, uid, orden, fh)
                    db.add(Firma(
                        id_documento=doc.id, orden_firma=orden, id_usuario=uid,
                        firmante_nombre=nombre, firmante_documento=documento,
                        computadora=f"PC-HACIENDA-{orden:02d}", fecha_hora=fh,
                        hash_firma=hash_firma, estado="valida", created_at=fh,
                    ))
                    n_fir += 1

                if a_poner >= req:
                    doc.estado = "firmado"
                db.flush()
            except Exception as ex:
                db.rollback()
                print(f"seed_demo firma: fallo en {ref}: {ex}")

        db.commit()
        print(f"seed_demo firma: +{n_doc} documentos, +{n_fir} firmas")
    finally:
        db.close()


if __name__ == "__main__":
    seed()
