"""
Seed de datos para el módulo Ingresos Públicos.
Ejecutar DESPUÉS del seed de administración (usa los mismos IDs de personas).
    docker compose exec ingresos_publicos python seed.py
"""
import sys
import os
from datetime import date
from decimal import Decimal

sys.path.insert(0, os.path.dirname(__file__))
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from database import SessionLocal, engine
from shared.database import Base

from models.lista import Lista
from models.persona import Persona
from models.contribuyente import Contribuyente
from models.cuenta import Cuenta
from models.comercio import Comercio
from models.inmueble import Inmueble
from models.vehiculo import Vehiculo
from models.tasa import Tasa
from models.sub_tasa import SubTasa
from models.emision_definicion import EmisionDefinicion
from models.emision import Emision
from models.plan_pago_definicion import PlanPagoDefinicion
from models.plan_pago import PlanPago
from models.certificado import Certificado
from models.multa import Multa


def seed():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    if db.query(Lista).first():
        print("Ya existen datos en ingresos_publicos. Seed omitido.")
        db.close()
        return

    # ══════════════════════════════════════════════════════════════════
    # LISTAS (tablas de referencia)
    # ══════════════════════════════════════════════════════════════════
    listas = [
        # Tipos de tributo
        Lista(codigo="ABL", tipo="tipo_tributo", nombre="Alumbrado, Barrido y Limpieza", orden=1),
        Lista(codigo="ISH", tipo="tipo_tributo", nombre="Seguridad e Higiene", orden=2),
        Lista(codigo="AUTOMOTOR", tipo="tipo_tributo", nombre="Automotor", orden=3),
        Lista(codigo="INMOBILIARIO", tipo="tipo_tributo", nombre="Inmobiliario", orden=4),
        Lista(codigo="SANITARIO", tipo="tipo_tributo", nombre="Servicios Sanitarios", orden=5),
        # Estados de cuenta
        Lista(codigo="CTA_ACTIVA", tipo="estado_cuenta", nombre="Activa", orden=1),
        Lista(codigo="CTA_SUSPENDIDA", tipo="estado_cuenta", nombre="Suspendida", orden=2),
        Lista(codigo="CTA_BAJA", tipo="estado_cuenta", nombre="Baja", orden=3),
        # Estados de emisión
        Lista(codigo="EMI_PENDIENTE", tipo="estado_emision", nombre="Pendiente", orden=1),
        Lista(codigo="EMI_PAGADA", tipo="estado_emision", nombre="Pagada", orden=2),
        Lista(codigo="EMI_VENCIDA", tipo="estado_emision", nombre="Vencida", orden=3),
        Lista(codigo="EMI_ANULADA", tipo="estado_emision", nombre="Anulada", orden=4),
        # Estados de plan de pago
        Lista(codigo="PP_VIGENTE", tipo="estado_plan_pago", nombre="Vigente", orden=1),
        Lista(codigo="PP_COMPLETO", tipo="estado_plan_pago", nombre="Completo", orden=2),
        Lista(codigo="PP_CAIDO", tipo="estado_plan_pago", nombre="Caído", orden=3),
        Lista(codigo="PP_CANCELADO", tipo="estado_plan_pago", nombre="Cancelado", orden=4),
        # Tipos de certificado
        Lista(codigo="CERT_LIBRE_DEUDA", tipo="tipo_certificado", nombre="Libre Deuda", orden=1),
        Lista(codigo="CERT_CATASTRAL", tipo="tipo_certificado", nombre="Catastral", orden=2),
        Lista(codigo="CERT_HABILITACION", tipo="tipo_certificado", nombre="Habilitación", orden=3),
        # Estados de certificado
        Lista(codigo="CERT_VIGENTE", tipo="estado_certificado", nombre="Vigente", orden=1),
        Lista(codigo="CERT_VENCIDO", tipo="estado_certificado", nombre="Vencido", orden=2),
        Lista(codigo="CERT_ANULADO", tipo="estado_certificado", nombre="Anulado", orden=3),
        # Tipos de multa
        Lista(codigo="MULTA_MORA", tipo="tipo_multa", nombre="Multa por mora", orden=1),
        Lista(codigo="MULTA_INFRACCION", tipo="tipo_multa", nombre="Multa por infracción", orden=2),
        Lista(codigo="MULTA_OMISION", tipo="tipo_multa", nombre="Multa por omisión", orden=3),
        # Estados de multa
        Lista(codigo="MLT_PENDIENTE", tipo="estado_multa", nombre="Pendiente", orden=1),
        Lista(codigo="MLT_PAGADA", tipo="estado_multa", nombre="Pagada", orden=2),
        Lista(codigo="MLT_ANULADA", tipo="estado_multa", nombre="Anulada", orden=3),
        # Categorías de tasa
        Lista(codigo="CAT_RESIDENCIAL", tipo="categoria_tasa", nombre="Residencial", orden=1),
        Lista(codigo="CAT_COMERCIAL", tipo="categoria_tasa", nombre="Comercial", orden=2),
        Lista(codigo="CAT_INDUSTRIAL", tipo="categoria_tasa", nombre="Industrial", orden=3),
        # Tipos de vehículo
        Lista(codigo="VEH_AUTO", tipo="tipo_vehiculo", nombre="Automóvil", orden=1),
        Lista(codigo="VEH_CAMIONETA", tipo="tipo_vehiculo", nombre="Camioneta", orden=2),
        Lista(codigo="VEH_CAMION", tipo="tipo_vehiculo", nombre="Camión", orden=3),
        Lista(codigo="VEH_MOTO", tipo="tipo_vehiculo", nombre="Motocicleta", orden=4),
        # Tipos de persona (referencia cruzada con admin)
        Lista(codigo="PF", tipo="tipo_persona", nombre="Persona Física", orden=1),
        Lista(codigo="PJ", tipo="tipo_persona", nombre="Persona Jurídica", orden=2),
        # Tipos de documento
        Lista(codigo="DNI", tipo="tipo_documento", nombre="DNI", orden=1),
        Lista(codigo="CUIL", tipo="tipo_documento", nombre="CUIL", orden=2),
        Lista(codigo="CUIT", tipo="tipo_documento", nombre="CUIT", orden=3),
    ]
    for i, lista in enumerate(listas):
        lista.id = i + 1
        db.add(lista)
    db.flush()

    # Map IDs por código para referencia
    tipo_tributo = {l.codigo: l.id for l in listas if l.tipo == "tipo_tributo"}
    estado_cuenta = {l.codigo: l.id for l in listas if l.tipo == "estado_cuenta"}
    estado_emision = {l.codigo: l.id for l in listas if l.tipo == "estado_emision"}
    estado_plan = {l.codigo: l.id for l in listas if l.tipo == "estado_plan_pago"}
    tipo_cert = {l.codigo: l.id for l in listas if l.tipo == "tipo_certificado"}
    estado_cert = {l.codigo: l.id for l in listas if l.tipo == "estado_certificado"}
    tipo_multa = {l.codigo: l.id for l in listas if l.tipo == "tipo_multa"}
    estado_multa = {l.codigo: l.id for l in listas if l.tipo == "estado_multa"}
    cat_tasa = {l.codigo: l.id for l in listas if l.tipo == "categoria_tasa"}
    tipo_vehiculo = {l.codigo: l.id for l in listas if l.tipo == "tipo_vehiculo"}

    # ══════════════════════════════════════════════════════════════════
    # PERSONAS (copia local para este módulo, referencia a admin)
    # ══════════════════════════════════════════════════════════════════
    personas = [
        # Personas Físicas (id_tipo_persona=1 = PF)
        Persona(id_tipo_persona=1, id_tipo_documento=1, numero_documento="30567890", nombre="Juan Carlos", apellido="García López"),
        Persona(id_tipo_persona=1, id_tipo_documento=1, numero_documento="28345612", nombre="María Elena", apellido="Rodríguez"),
        Persona(id_tipo_persona=1, id_tipo_documento=1, numero_documento="35678901", nombre="Carlos Alberto", apellido="Martínez"),
        Persona(id_tipo_persona=1, id_tipo_documento=1, numero_documento="27123456", nombre="Ana Lucía", apellido="Fernández"),
        Persona(id_tipo_persona=1, id_tipo_documento=1, numero_documento="40234567", nombre="Pablo Esteban", apellido="López Suárez"),
        Persona(id_tipo_persona=1, id_tipo_documento=1, numero_documento="33445566", nombre="Laura Beatriz", apellido="Gómez"),
        Persona(id_tipo_persona=1, id_tipo_documento=1, numero_documento="29876543", nombre="Roberto Daniel", apellido="Sánchez"),
        Persona(id_tipo_persona=1, id_tipo_documento=1, numero_documento="38112233", nombre="Diego Armando", apellido="Ruiz"),
        # Personas Jurídicas (id_tipo_persona=2 = PJ)
        Persona(id_tipo_persona=2, id_tipo_documento=3, numero_documento="30-71234567-9", denominacion="Constructora del Sur S.A."),
        Persona(id_tipo_persona=2, id_tipo_documento=3, numero_documento="30-71876543-2", denominacion="Servicios Integrales SRL"),
        Persona(id_tipo_persona=2, id_tipo_documento=3, numero_documento="33-71555444-9", denominacion="Cooperativa Agropecuaria Ltda."),
        Persona(id_tipo_persona=2, id_tipo_documento=3, numero_documento="30-71999888-5", denominacion="Tech Solutions SAS"),
    ]
    for p in personas:
        db.add(p)
    db.flush()

    # ══════════════════════════════════════════════════════════════════
    # CONTRIBUYENTES
    # ══════════════════════════════════════════════════════════════════
    contribuyentes = [
        Contribuyente(id_persona=personas[0].id, id_tipo_persona=1, id_tipo_documento=1, numero_documento="30567890", activo=True),
        Contribuyente(id_persona=personas[1].id, id_tipo_persona=1, id_tipo_documento=1, numero_documento="28345612", activo=True),
        Contribuyente(id_persona=personas[2].id, id_tipo_persona=1, id_tipo_documento=1, numero_documento="35678901", activo=True),
        Contribuyente(id_persona=personas[3].id, id_tipo_persona=1, id_tipo_documento=1, numero_documento="27123456", activo=True),
        Contribuyente(id_persona=personas[4].id, id_tipo_persona=1, id_tipo_documento=1, numero_documento="40234567", activo=True),
        Contribuyente(id_persona=personas[5].id, id_tipo_persona=1, id_tipo_documento=1, numero_documento="33445566", activo=True),
        Contribuyente(id_persona=personas[6].id, id_tipo_persona=1, id_tipo_documento=1, numero_documento="29876543", activo=True),
        Contribuyente(id_persona=personas[7].id, id_tipo_persona=1, id_tipo_documento=1, numero_documento="38112233", activo=True),
        # Jurídicas
        Contribuyente(id_persona=personas[8].id, id_tipo_persona=2, id_tipo_documento=3, numero_documento="30-71234567-9", activo=True),
        Contribuyente(id_persona=personas[9].id, id_tipo_persona=2, id_tipo_documento=3, numero_documento="30-71876543-2", activo=True),
        Contribuyente(id_persona=personas[10].id, id_tipo_persona=2, id_tipo_documento=3, numero_documento="33-71555444-9", activo=True),
        Contribuyente(id_persona=personas[11].id, id_tipo_persona=2, id_tipo_documento=3, numero_documento="30-71999888-5", activo=True),
    ]
    for c in contribuyentes:
        db.add(c)
    db.flush()

    # ══════════════════════════════════════════════════════════════════
    # CUENTAS (vinculadas a contribuyentes y tipos de tributo)
    # ══════════════════════════════════════════════════════════════════
    cuentas = [
        # García López: ABL + Automotor
        Cuenta(id_contribuyente=contribuyentes[0].id, id_tipo_tributo=tipo_tributo["ABL"], id_estado_cuenta=estado_cuenta["CTA_ACTIVA"], numero_cuenta="ABL-001-2025", activo=True),
        Cuenta(id_contribuyente=contribuyentes[0].id, id_tipo_tributo=tipo_tributo["AUTOMOTOR"], id_estado_cuenta=estado_cuenta["CTA_ACTIVA"], numero_cuenta="AUT-001-2025", activo=True),
        # Rodríguez: ABL
        Cuenta(id_contribuyente=contribuyentes[1].id, id_tipo_tributo=tipo_tributo["ABL"], id_estado_cuenta=estado_cuenta["CTA_ACTIVA"], numero_cuenta="ABL-002-2025", activo=True),
        # Martínez: Inmobiliario
        Cuenta(id_contribuyente=contribuyentes[2].id, id_tipo_tributo=tipo_tributo["INMOBILIARIO"], id_estado_cuenta=estado_cuenta["CTA_ACTIVA"], numero_cuenta="INM-001-2025", activo=True),
        # Fernández: ABL + Automotor
        Cuenta(id_contribuyente=contribuyentes[3].id, id_tipo_tributo=tipo_tributo["ABL"], id_estado_cuenta=estado_cuenta["CTA_ACTIVA"], numero_cuenta="ABL-003-2025", activo=True),
        Cuenta(id_contribuyente=contribuyentes[3].id, id_tipo_tributo=tipo_tributo["AUTOMOTOR"], id_estado_cuenta=estado_cuenta["CTA_ACTIVA"], numero_cuenta="AUT-002-2025", activo=True),
        # López Suárez: Automotor
        Cuenta(id_contribuyente=contribuyentes[4].id, id_tipo_tributo=tipo_tributo["AUTOMOTOR"], id_estado_cuenta=estado_cuenta["CTA_ACTIVA"], numero_cuenta="AUT-003-2025", activo=True),
        # Gómez: ABL
        Cuenta(id_contribuyente=contribuyentes[5].id, id_tipo_tributo=tipo_tributo["ABL"], id_estado_cuenta=estado_cuenta["CTA_ACTIVA"], numero_cuenta="ABL-004-2025", activo=True),
        # Constructora del Sur: ISH + Inmobiliario
        Cuenta(id_contribuyente=contribuyentes[8].id, id_tipo_tributo=tipo_tributo["ISH"], id_estado_cuenta=estado_cuenta["CTA_ACTIVA"], numero_cuenta="ISH-001-2025", activo=True),
        Cuenta(id_contribuyente=contribuyentes[8].id, id_tipo_tributo=tipo_tributo["INMOBILIARIO"], id_estado_cuenta=estado_cuenta["CTA_ACTIVA"], numero_cuenta="INM-002-2025", activo=True),
        # Servicios Integrales: ISH
        Cuenta(id_contribuyente=contribuyentes[9].id, id_tipo_tributo=tipo_tributo["ISH"], id_estado_cuenta=estado_cuenta["CTA_ACTIVA"], numero_cuenta="ISH-002-2025", activo=True),
        # Tech Solutions: ISH
        Cuenta(id_contribuyente=contribuyentes[11].id, id_tipo_tributo=tipo_tributo["ISH"], id_estado_cuenta=estado_cuenta["CTA_ACTIVA"], numero_cuenta="ISH-003-2025", activo=True),
    ]
    for c in cuentas:
        db.add(c)
    db.flush()

    # ══════════════════════════════════════════════════════════════════
    # COMERCIOS
    # ══════════════════════════════════════════════════════════════════
    comercios = [
        Comercio(id_cuenta=cuentas[8].id, cuit="30-71234567-9", nombre_fantasia="Constructora del Sur", id_categoria=cat_tasa["CAT_INDUSTRIAL"], gran_contribuyente=True, activo=True),
        Comercio(id_cuenta=cuentas[10].id, cuit="30-71876543-2", nombre_fantasia="ServiInt", id_categoria=cat_tasa["CAT_COMERCIAL"], gran_contribuyente=False, activo=True),
        Comercio(id_cuenta=cuentas[11].id, cuit="30-71999888-5", nombre_fantasia="TechSol", id_categoria=cat_tasa["CAT_COMERCIAL"], gran_contribuyente=False, activo=True),
    ]
    for c in comercios:
        db.add(c)
    db.flush()

    # ══════════════════════════════════════════════════════════════════
    # INMUEBLES
    # ══════════════════════════════════════════════════════════════════
    inmuebles = [
        Inmueble(id_cuenta=cuentas[0].id, circuito="I", sector="A", fraccion="001", parcela="0012", id_estado_carga=10, activo=True),
        Inmueble(id_cuenta=cuentas[2].id, circuito="II", sector="B", fraccion="003", parcela="0045", id_estado_carga=10, activo=True),
        Inmueble(id_cuenta=cuentas[3].id, circuito="I", sector="C", fraccion="002", parcela="0078", id_estado_carga=10, activo=True),
        Inmueble(id_cuenta=cuentas[4].id, circuito="III", sector="A", fraccion="005", parcela="0023", id_estado_carga=10, activo=True),
        Inmueble(id_cuenta=cuentas[7].id, circuito="I", sector="D", fraccion="001", parcela="0099", id_estado_carga=10, activo=True),
        Inmueble(id_cuenta=cuentas[9].id, circuito="IV", sector="A", fraccion="010", parcela="0001", id_estado_carga=10, activo=True),
    ]
    for i in inmuebles:
        db.add(i)
    db.flush()

    # ══════════════════════════════════════════════════════════════════
    # VEHÍCULOS
    # ══════════════════════════════════════════════════════════════════
    vehiculos = [
        Vehiculo(id_cuenta=cuentas[1].id, dominio="AB123CD", modelo="Toyota Corolla", anio=2020, numero_motor="MOT-20201234", numero_chasis="CHA-20201234", id_tipo_vehiculo=tipo_vehiculo["VEH_AUTO"], activo=True),
        Vehiculo(id_cuenta=cuentas[5].id, dominio="EF456GH", modelo="Volkswagen Amarok", anio=2022, numero_motor="MOT-20225678", numero_chasis="CHA-20225678", id_tipo_vehiculo=tipo_vehiculo["VEH_CAMIONETA"], activo=True),
        Vehiculo(id_cuenta=cuentas[6].id, dominio="IJ789KL", modelo="Honda CB250", anio=2023, numero_motor="MOT-20239012", numero_chasis="CHA-20239012", id_tipo_vehiculo=tipo_vehiculo["VEH_MOTO"], activo=True),
        Vehiculo(id_cuenta=cuentas[1].id, dominio="MN012OP", modelo="Ford EcoSport", anio=2019, numero_motor="MOT-20193456", numero_chasis="CHA-20193456", id_tipo_vehiculo=tipo_vehiculo["VEH_AUTO"], activo=True),
    ]
    for v in vehiculos:
        db.add(v)
    db.flush()

    # ══════════════════════════════════════════════════════════════════
    # TASAS
    # ══════════════════════════════════════════════════════════════════
    tasas = [
        Tasa(codigo="ABL-RES", id_tipo_tributo=tipo_tributo["ABL"], id_categoria_tasa=cat_tasa["CAT_RESIDENCIAL"], descripcion="ABL Residencial", porcentaje_descuento=Decimal("10.00")),
        Tasa(codigo="ABL-COM", id_tipo_tributo=tipo_tributo["ABL"], id_categoria_tasa=cat_tasa["CAT_COMERCIAL"], descripcion="ABL Comercial", porcentaje_descuento=Decimal("5.00")),
        Tasa(codigo="ISH-COM", id_tipo_tributo=tipo_tributo["ISH"], id_categoria_tasa=cat_tasa["CAT_COMERCIAL"], descripcion="Seguridad e Higiene Comercial", porcentaje_descuento=Decimal("5.00")),
        Tasa(codigo="ISH-IND", id_tipo_tributo=tipo_tributo["ISH"], id_categoria_tasa=cat_tasa["CAT_INDUSTRIAL"], descripcion="Seguridad e Higiene Industrial", porcentaje_descuento=Decimal("0.00")),
        Tasa(codigo="AUT-GEN", id_tipo_tributo=tipo_tributo["AUTOMOTOR"], id_categoria_tasa=None, descripcion="Automotor General", porcentaje_descuento=Decimal("15.00")),
        Tasa(codigo="INM-GEN", id_tipo_tributo=tipo_tributo["INMOBILIARIO"], id_categoria_tasa=None, descripcion="Inmobiliario General", porcentaje_descuento=Decimal("10.00")),
    ]
    for t in tasas:
        db.add(t)
    db.flush()

    # ══════════════════════════════════════════════════════════════════
    # SUB-TASAS
    # ══════════════════════════════════════════════════════════════════
    sub_tasas = [
        SubTasa(id_tasa=tasas[0].id, codigo="ABL-RES-1", descripcion="ABL Residencial - Zona Urbana", fecha_desde=date(2025, 1, 1), fecha_hasta=date(2025, 12, 31)),
        SubTasa(id_tasa=tasas[0].id, codigo="ABL-RES-2", descripcion="ABL Residencial - Zona Suburbana", fecha_desde=date(2025, 1, 1), fecha_hasta=date(2025, 12, 31)),
        SubTasa(id_tasa=tasas[1].id, codigo="ABL-COM-1", descripcion="ABL Comercial - Centro", fecha_desde=date(2025, 1, 1), fecha_hasta=date(2025, 12, 31)),
        SubTasa(id_tasa=tasas[2].id, codigo="ISH-COM-1", descripcion="ISH Comercial - Hasta 10 empleados", fecha_desde=date(2025, 1, 1), fecha_hasta=date(2025, 12, 31)),
        SubTasa(id_tasa=tasas[2].id, codigo="ISH-COM-2", descripcion="ISH Comercial - Más de 10 empleados", fecha_desde=date(2025, 1, 1), fecha_hasta=date(2025, 12, 31)),
        SubTasa(id_tasa=tasas[4].id, codigo="AUT-CAT-A", descripcion="Automotor - Categoría A (hasta 2000cc)", fecha_desde=date(2025, 1, 1)),
        SubTasa(id_tasa=tasas[4].id, codigo="AUT-CAT-B", descripcion="Automotor - Categoría B (más de 2000cc)", fecha_desde=date(2025, 1, 1)),
    ]
    for st in sub_tasas:
        db.add(st)
    db.flush()

    # ══════════════════════════════════════════════════════════════════
    # DEFINICIONES DE EMISIÓN
    # ══════════════════════════════════════════════════════════════════
    emision_defs = [
        EmisionDefinicion(codigo="ABL-2025", nombre="ABL Ejercicio 2025", id_tipo_tributo=tipo_tributo["ABL"], id_tasa=tasas[0].id, ejercicio=2025, periodo_desde=1, periodo_hasta=12, cuota_desde=1, cuota_hasta=1, fecha_vencimiento_1=date(2025, 3, 10), fecha_vencimiento_2=date(2025, 3, 20), activo=True),
        EmisionDefinicion(codigo="ISH-2025", nombre="ISH Ejercicio 2025", id_tipo_tributo=tipo_tributo["ISH"], id_tasa=tasas[2].id, ejercicio=2025, periodo_desde=1, periodo_hasta=12, cuota_desde=1, cuota_hasta=1, fecha_vencimiento_1=date(2025, 3, 15), fecha_vencimiento_2=date(2025, 3, 25), activo=True),
        EmisionDefinicion(codigo="AUT-2025", nombre="Automotor Ejercicio 2025", id_tipo_tributo=tipo_tributo["AUTOMOTOR"], id_tasa=tasas[4].id, ejercicio=2025, periodo_desde=1, periodo_hasta=6, cuota_desde=1, cuota_hasta=1, fecha_vencimiento_1=date(2025, 2, 15), fecha_vencimiento_2=date(2025, 2, 28), activo=True),
        EmisionDefinicion(codigo="INM-2025", nombre="Inmobiliario Ejercicio 2025", id_tipo_tributo=tipo_tributo["INMOBILIARIO"], id_tasa=tasas[5].id, ejercicio=2025, periodo_desde=1, periodo_hasta=4, cuota_desde=1, cuota_hasta=1, fecha_vencimiento_1=date(2025, 4, 10), fecha_vencimiento_2=date(2025, 4, 20), activo=True),
    ]
    for ed in emision_defs:
        db.add(ed)
    db.flush()

    # ══════════════════════════════════════════════════════════════════
    # EMISIONES (boletas generadas)
    # ══════════════════════════════════════════════════════════════════
    emisiones = []

    # ABL - García López (cuenta ABL-001) - periodos 1-6 de 2025
    for per in range(1, 7):
        est = estado_emision["EMI_PAGADA"] if per <= 2 else estado_emision["EMI_PENDIENTE"]
        emisiones.append(Emision(
            id_emision_definicion=emision_defs[0].id, id_cuenta=cuentas[0].id,
            numero_emision=per, ejercicio=2025, periodo=per, cuota=1,
            importe_original=Decimal("8500.00"), importe_descuento=Decimal("850.00") if per <= 2 else Decimal("0"),
            importe_recargo=Decimal("0"), importe_total=Decimal("7650.00") if per <= 2 else Decimal("8500.00"),
            fecha_vencimiento_1=date(2025, per, 10), fecha_vencimiento_2=date(2025, per, 20),
            id_estado_emision=est,
        ))

    # ABL - Rodríguez (cuenta ABL-002) - periodos 1-3
    for per in range(1, 4):
        emisiones.append(Emision(
            id_emision_definicion=emision_defs[0].id, id_cuenta=cuentas[2].id,
            numero_emision=per, ejercicio=2025, periodo=per, cuota=1,
            importe_original=Decimal("6200.00"), importe_descuento=Decimal("620.00"),
            importe_recargo=Decimal("0"), importe_total=Decimal("5580.00"),
            fecha_vencimiento_1=date(2025, per, 10), fecha_vencimiento_2=date(2025, per, 20),
            id_estado_emision=estado_emision["EMI_PAGADA"],
        ))

    # Automotor - García López (cuenta AUT-001) - semestral
    for per in range(1, 4):
        emisiones.append(Emision(
            id_emision_definicion=emision_defs[2].id, id_cuenta=cuentas[1].id,
            numero_emision=per, ejercicio=2025, periodo=per, cuota=1,
            importe_original=Decimal("12000.00"), importe_descuento=Decimal("1800.00") if per == 1 else Decimal("0"),
            importe_recargo=Decimal("0"), importe_total=Decimal("10200.00") if per == 1 else Decimal("12000.00"),
            fecha_vencimiento_1=date(2025, per * 2, 15), fecha_vencimiento_2=date(2025, per * 2, 28),
            id_estado_emision=estado_emision["EMI_PAGADA"] if per == 1 else estado_emision["EMI_PENDIENTE"],
        ))

    # ISH - Constructora del Sur (cuenta ISH-001)
    for per in range(1, 4):
        emisiones.append(Emision(
            id_emision_definicion=emision_defs[1].id, id_cuenta=cuentas[8].id,
            numero_emision=per, ejercicio=2025, periodo=per, cuota=1,
            importe_original=Decimal("45000.00"), importe_descuento=Decimal("0"),
            importe_recargo=Decimal("0"), importe_total=Decimal("45000.00"),
            fecha_vencimiento_1=date(2025, per, 15), fecha_vencimiento_2=date(2025, per, 25),
            id_estado_emision=estado_emision["EMI_PAGADA"] if per <= 2 else estado_emision["EMI_PENDIENTE"],
        ))

    # ISH - Tech Solutions (cuenta ISH-003)
    for per in range(1, 4):
        emisiones.append(Emision(
            id_emision_definicion=emision_defs[1].id, id_cuenta=cuentas[11].id,
            numero_emision=per, ejercicio=2025, periodo=per, cuota=1,
            importe_original=Decimal("18500.00"), importe_descuento=Decimal("925.00"),
            importe_recargo=Decimal("0"), importe_total=Decimal("17575.00"),
            fecha_vencimiento_1=date(2025, per, 15), fecha_vencimiento_2=date(2025, per, 25),
            id_estado_emision=estado_emision["EMI_PAGADA"],
        ))

    for e in emisiones:
        db.add(e)
    db.flush()

    # ══════════════════════════════════════════════════════════════════
    # DEFINICIONES DE PLAN DE PAGO
    # ══════════════════════════════════════════════════════════════════
    pp_defs = [
        PlanPagoDefinicion(codigo="PP-STD-6", nombre="Plan Estándar 6 cuotas", id_tipo_tributo=None, cuota_minima=3, cuota_maxima=6, porcentaje_anticipo=Decimal("10.0000"), tasa_interes=Decimal("3.5000"), activo=True, fecha_desde=date(2025, 1, 1)),
        PlanPagoDefinicion(codigo="PP-STD-12", nombre="Plan Estándar 12 cuotas", id_tipo_tributo=None, cuota_minima=6, cuota_maxima=12, porcentaje_anticipo=Decimal("15.0000"), tasa_interes=Decimal("5.0000"), activo=True, fecha_desde=date(2025, 1, 1)),
        PlanPagoDefinicion(codigo="PP-MORA-24", nombre="Plan Moratoria 24 cuotas", id_tipo_tributo=None, cuota_minima=12, cuota_maxima=24, porcentaje_anticipo=Decimal("5.0000"), tasa_interes=Decimal("2.0000"), activo=True, fecha_desde=date(2025, 3, 1), fecha_hasta=date(2025, 6, 30)),
    ]
    for ppd in pp_defs:
        db.add(ppd)
    db.flush()

    # ══════════════════════════════════════════════════════════════════
    # PLANES DE PAGO
    # ══════════════════════════════════════════════════════════════════
    planes = [
        PlanPago(id_plan_pago_definicion=pp_defs[0].id, id_cuenta=cuentas[0].id, id_contribuyente=contribuyentes[0].id, numero_plan=1, cantidad_cuotas=6, importe_total=Decimal("51000.00"), importe_anticipo=Decimal("5100.00"), importe_cuota=Decimal("7650.00"), id_estado_plan=estado_plan["PP_VIGENTE"], fecha_caducidad=date(2025, 9, 10)),
        PlanPago(id_plan_pago_definicion=pp_defs[1].id, id_cuenta=cuentas[3].id, id_contribuyente=contribuyentes[2].id, numero_plan=1, cantidad_cuotas=12, importe_total=Decimal("96000.00"), importe_anticipo=Decimal("14400.00"), importe_cuota=Decimal("6800.00"), id_estado_plan=estado_plan["PP_VIGENTE"], fecha_caducidad=date(2026, 1, 10)),
    ]
    for pp in planes:
        db.add(pp)
    db.flush()

    # ══════════════════════════════════════════════════════════════════
    # CERTIFICADOS
    # ══════════════════════════════════════════════════════════════════
    certificados = [
        Certificado(id_cuenta=cuentas[2].id, id_tipo_certificado=tipo_cert["CERT_LIBRE_DEUDA"], numero_certificado="LD-2025-001", fecha_vencimiento=date(2025, 6, 30), id_estado_certificado=estado_cert["CERT_VIGENTE"], detalle="Libre deuda ABL - Rodríguez", id_usuario=1),
        Certificado(id_cuenta=cuentas[8].id, id_tipo_certificado=tipo_cert["CERT_HABILITACION"], numero_certificado="HAB-2025-001", fecha_vencimiento=date(2026, 3, 10), id_estado_certificado=estado_cert["CERT_VIGENTE"], detalle="Habilitación comercial - Constructora del Sur", id_usuario=1),
        Certificado(id_cuenta=cuentas[3].id, id_tipo_certificado=tipo_cert["CERT_CATASTRAL"], numero_certificado="CAT-2025-001", fecha_vencimiento=date(2025, 12, 31), id_estado_certificado=estado_cert["CERT_VIGENTE"], detalle="Certificado catastral - Martínez", id_usuario=1),
    ]
    for c in certificados:
        db.add(c)
    db.flush()

    # ══════════════════════════════════════════════════════════════════
    # MULTAS
    # ══════════════════════════════════════════════════════════════════
    multas = [
        Multa(id_cuenta=cuentas[0].id, id_tipo_multa=tipo_multa["MULTA_MORA"], numero_multa="MLT-2025-001", importe=Decimal("2500.00"), fecha_vencimiento=date(2025, 4, 30), id_estado_multa=estado_multa["MLT_PENDIENTE"], detalle="Multa por mora en pago ABL periodo 3/2025"),
        Multa(id_cuenta=cuentas[8].id, id_tipo_multa=tipo_multa["MULTA_INFRACCION"], numero_multa="MLT-2025-002", importe=Decimal("15000.00"), fecha_vencimiento=date(2025, 5, 15), id_estado_multa=estado_multa["MLT_PENDIENTE"], detalle="Infracción por falta de documentación de seguridad"),
        Multa(id_cuenta=cuentas[1].id, id_tipo_multa=tipo_multa["MULTA_OMISION"], numero_multa="MLT-2024-015", importe=Decimal("5000.00"), fecha_vencimiento=date(2024, 12, 31), id_estado_multa=estado_multa["MLT_PAGADA"], detalle="Omisión de declaración jurada automotor 2024"),
    ]
    for m in multas:
        db.add(m)

    db.commit()
    db.close()

    print("Seed de Ingresos Públicos completado.")
    print(f"  - {len(listas)} listas de referencia")
    print(f"  - {len(personas)} personas, {len(contribuyentes)} contribuyentes")
    print(f"  - {len(cuentas)} cuentas")
    print(f"  - {len(comercios)} comercios, {len(inmuebles)} inmuebles, {len(vehiculos)} vehículos")
    print(f"  - {len(tasas)} tasas, {len(sub_tasas)} sub-tasas")
    print(f"  - {len(emision_defs)} definiciones de emisión, {len(emisiones)} emisiones")
    print(f"  - {len(pp_defs)} definiciones de plan de pago, {len(planes)} planes de pago")
    print(f"  - {len(certificados)} certificados, {len(multas)} multas")


if __name__ == "__main__":
    seed()
