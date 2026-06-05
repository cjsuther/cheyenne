"""
Seed de datos para el módulo Administración.
Ejecutar: docker compose exec administracion python seed.py
"""
import sys
import os

sys.path.insert(0, os.path.dirname(__file__))
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from database import SessionLocal, engine
from shared.database import Base

from models.lista import Lista
from models.entidad import Entidad
from models.entidad_definicion import EntidadDefinicion
from models.pais import Pais
from models.provincia import Provincia
from models.localidad import Localidad
from models.persona_fisica import PersonaFisica
from models.persona_juridica import PersonaJuridica
from models.documento import Documento
from models.direccion import Direccion
from models.contacto import Contacto
from models.medio_pago import MedioPago
from models.expediente import Expediente
from models.cuenta_contable import CuentaContable
from models.jurisdiccion import Jurisdiccion
from models.recurso_por_rubro import RecursoPorRubro
from models.etiqueta import Etiqueta
from models.observacion import Observacion


def seed():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    if db.query(Lista).first():
        print("Ya existen datos en administracion. Seed omitido.")
        db.close()
        return

    # ══════════════════════════════════════════════════════════════════
    # LISTAS (tablas de referencia)
    # ══════════════════════════════════════════════════════════════════
    listas = [
        # Tipos de documento
        Lista(codigo="DNI", tipo="tipo_documento", nombre="DNI", orden=1),
        Lista(codigo="CUIL", tipo="tipo_documento", nombre="CUIL", orden=2),
        Lista(codigo="CUIT", tipo="tipo_documento", nombre="CUIT", orden=3),
        Lista(codigo="PASAPORTE", tipo="tipo_documento", nombre="Pasaporte", orden=4),
        Lista(codigo="LE", tipo="tipo_documento", nombre="Libreta de Enrolamiento", orden=5),
        Lista(codigo="LC", tipo="tipo_documento", nombre="Libreta Cívica", orden=6),
        # Tipos de persona
        Lista(codigo="PF", tipo="tipo_persona", nombre="Persona Física", orden=1),
        Lista(codigo="PJ", tipo="tipo_persona", nombre="Persona Jurídica", orden=2),
        # Géneros
        Lista(codigo="M", tipo="genero", nombre="Masculino", orden=1),
        Lista(codigo="F", tipo="genero", nombre="Femenino", orden=2),
        Lista(codigo="X", tipo="genero", nombre="No Binario", orden=3),
        # Estados civiles
        Lista(codigo="SOLTERO", tipo="estado_civil", nombre="Soltero/a", orden=1),
        Lista(codigo="CASADO", tipo="estado_civil", nombre="Casado/a", orden=2),
        Lista(codigo="DIVORCIADO", tipo="estado_civil", nombre="Divorciado/a", orden=3),
        Lista(codigo="VIUDO", tipo="estado_civil", nombre="Viudo/a", orden=4),
        Lista(codigo="UNION_CONVIVENCIAL", tipo="estado_civil", nombre="Unión Convivencial", orden=5),
        # Condiciones fiscales
        Lista(codigo="RI", tipo="condicion_fiscal", nombre="Responsable Inscripto", orden=1),
        Lista(codigo="MONOTRIBUTO", tipo="condicion_fiscal", nombre="Monotributista", orden=2),
        Lista(codigo="EXENTO", tipo="condicion_fiscal", nombre="Exento", orden=3),
        Lista(codigo="CONSUMIDOR_FINAL", tipo="condicion_fiscal", nombre="Consumidor Final", orden=4),
        # Formas jurídicas
        Lista(codigo="SA", tipo="forma_juridica", nombre="Sociedad Anónima", orden=1),
        Lista(codigo="SRL", tipo="forma_juridica", nombre="SRL", orden=2),
        Lista(codigo="SAS", tipo="forma_juridica", nombre="SAS", orden=3),
        Lista(codigo="COOP", tipo="forma_juridica", nombre="Cooperativa", orden=4),
        Lista(codigo="FUNDACION", tipo="forma_juridica", nombre="Fundación", orden=5),
        Lista(codigo="ASOCIACION", tipo="forma_juridica", nombre="Asociación Civil", orden=6),
        # Tipos de contacto
        Lista(codigo="TEL", tipo="tipo_contacto", nombre="Teléfono", orden=1),
        Lista(codigo="CEL", tipo="tipo_contacto", nombre="Celular", orden=2),
        Lista(codigo="EMAIL", tipo="tipo_contacto", nombre="Email", orden=3),
        Lista(codigo="WEB", tipo="tipo_contacto", nombre="Sitio Web", orden=4),
        # Tipos de medio de pago
        Lista(codigo="CBU", tipo="tipo_medio_pago", nombre="CBU", orden=1),
        Lista(codigo="CVU", tipo="tipo_medio_pago", nombre="CVU", orden=2),
        Lista(codigo="ALIAS", tipo="tipo_medio_pago", nombre="Alias", orden=3),
        # Tipos de expediente
        Lista(codigo="TRAMITE", tipo="tipo_expediente", nombre="Trámite General", orden=1),
        Lista(codigo="RECURSO", tipo="tipo_expediente", nombre="Recurso", orden=2),
        Lista(codigo="RECLAMO", tipo="tipo_expediente", nombre="Reclamo", orden=3),
        Lista(codigo="NOTA", tipo="tipo_expediente", nombre="Nota", orden=4),
        # Nacionalidades
        Lista(codigo="AR", tipo="nacionalidad", nombre="Argentina", orden=1),
        Lista(codigo="BR", tipo="nacionalidad", nombre="Brasileña", orden=2),
        Lista(codigo="UY", tipo="nacionalidad", nombre="Uruguaya", orden=3),
        Lista(codigo="CL", tipo="nacionalidad", nombre="Chilena", orden=4),
        Lista(codigo="PY", tipo="nacionalidad", nombre="Paraguaya", orden=5),
        Lista(codigo="BO", tipo="nacionalidad", nombre="Boliviana", orden=6),
    ]
    for i, lista in enumerate(listas):
        lista.id = i + 1
        db.add(lista)
    db.flush()

    # ══════════════════════════════════════════════════════════════════
    # GEOGRAFÍA: Países → Provincias → Localidades
    # ══════════════════════════════════════════════════════════════════
    paises = [
        Pais(codigo="AR", nombre="Argentina", orden=1),
        Pais(codigo="BR", nombre="Brasil", orden=2),
        Pais(codigo="UY", nombre="Uruguay", orden=3),
        Pais(codigo="CL", nombre="Chile", orden=4),
        Pais(codigo="PY", nombre="Paraguay", orden=5),
    ]
    for p in paises:
        db.add(p)
    db.flush()

    # Provincias argentinas (id_pais = Argentina)
    ar_id = paises[0].id
    provincias = [
        Provincia(codigo="BSAS", nombre="Buenos Aires", orden=1, id_pais=ar_id),
        Provincia(codigo="CABA", nombre="Ciudad Autónoma de Buenos Aires", orden=2, id_pais=ar_id),
        Provincia(codigo="CBA", nombre="Córdoba", orden=3, id_pais=ar_id),
        Provincia(codigo="SFE", nombre="Santa Fe", orden=4, id_pais=ar_id),
        Provincia(codigo="MZA", nombre="Mendoza", orden=5, id_pais=ar_id),
        Provincia(codigo="TUC", nombre="Tucumán", orden=6, id_pais=ar_id),
        Provincia(codigo="SDE", nombre="Santiago del Estero", orden=7, id_pais=ar_id),
        Provincia(codigo="NEU", nombre="Neuquén", orden=8, id_pais=ar_id),
        Provincia(codigo="CHU", nombre="Chubut", orden=9, id_pais=ar_id),
        Provincia(codigo="RNG", nombre="Río Negro", orden=10, id_pais=ar_id),
    ]
    for p in provincias:
        db.add(p)
    db.flush()

    bsas_id = provincias[0].id
    caba_id = provincias[1].id
    cba_id = provincias[2].id
    sfe_id = provincias[3].id

    localidades = [
        Localidad(codigo="LAPLATA", nombre="La Plata", orden=1, id_provincia=bsas_id),
        Localidad(codigo="MDPLATA", nombre="Mar del Plata", orden=2, id_provincia=bsas_id),
        Localidad(codigo="BAHIA", nombre="Bahía Blanca", orden=3, id_provincia=bsas_id),
        Localidad(codigo="QUILMES", nombre="Quilmes", orden=4, id_provincia=bsas_id),
        Localidad(codigo="LOMAS", nombre="Lomas de Zamora", orden=5, id_provincia=bsas_id),
        Localidad(codigo="CABA", nombre="CABA", orden=1, id_provincia=caba_id),
        Localidad(codigo="CBA_CAP", nombre="Córdoba Capital", orden=1, id_provincia=cba_id),
        Localidad(codigo="VILLAMARIA", nombre="Villa María", orden=2, id_provincia=cba_id),
        Localidad(codigo="ROSARIO", nombre="Rosario", orden=1, id_provincia=sfe_id),
        Localidad(codigo="SFE_CAP", nombre="Santa Fe Capital", orden=2, id_provincia=sfe_id),
    ]
    for l in localidades:
        db.add(l)
    db.flush()

    # ══════════════════════════════════════════════════════════════════
    # PERSONAS FÍSICAS
    # ══════════════════════════════════════════════════════════════════
    personas_fisicas = [
        PersonaFisica(id_tipo_documento=1, numero_documento="30567890", nombre="Juan Carlos", apellido="García López", id_genero=1, id_estado_civil=2, id_nacionalidad=1, id_condicion_fiscal=1, profesion="Contador Público", fecha_nacimiento="1975-03-15", activo=True),
        PersonaFisica(id_tipo_documento=1, numero_documento="28345612", nombre="María Elena", apellido="Rodríguez", id_genero=2, id_estado_civil=1, id_nacionalidad=1, id_condicion_fiscal=2, profesion="Abogada", fecha_nacimiento="1980-07-22", activo=True),
        PersonaFisica(id_tipo_documento=1, numero_documento="35678901", nombre="Carlos Alberto", apellido="Martínez", id_genero=1, id_estado_civil=1, id_nacionalidad=1, id_condicion_fiscal=4, profesion="Ingeniero Civil", fecha_nacimiento="1988-11-05", activo=True),
        PersonaFisica(id_tipo_documento=1, numero_documento="27123456", nombre="Ana Lucía", apellido="Fernández", id_genero=2, id_estado_civil=3, id_nacionalidad=1, id_condicion_fiscal=1, profesion="Arquitecta", fecha_nacimiento="1978-01-30", activo=True),
        PersonaFisica(id_tipo_documento=1, numero_documento="40234567", nombre="Pablo Esteban", apellido="López Suárez", id_genero=1, id_estado_civil=1, id_nacionalidad=1, id_condicion_fiscal=2, profesion="Diseñador Gráfico", fecha_nacimiento="1995-06-12", activo=True),
        PersonaFisica(id_tipo_documento=1, numero_documento="33445566", nombre="Laura Beatriz", apellido="Gómez", id_genero=2, id_estado_civil=2, id_nacionalidad=1, id_condicion_fiscal=1, profesion="Médica", fecha_nacimiento="1983-09-18", activo=True),
        PersonaFisica(id_tipo_documento=1, numero_documento="29876543", nombre="Roberto Daniel", apellido="Sánchez", id_genero=1, id_estado_civil=2, id_nacionalidad=1, id_condicion_fiscal=1, profesion="Escribano", fecha_nacimiento="1977-04-25", activo=True),
        PersonaFisica(id_tipo_documento=4, numero_documento="AAB123456", nombre="Lucas", apellido="Oliveira", id_genero=1, id_estado_civil=1, id_nacionalidad=2, id_condicion_fiscal=4, profesion="Comerciante", fecha_nacimiento="1990-12-01", activo=True),
        PersonaFisica(id_tipo_documento=1, numero_documento="31998877", nombre="Silvina Marta", apellido="Peralta", id_genero=2, id_estado_civil=4, id_nacionalidad=1, id_condicion_fiscal=3, profesion="Docente", fecha_nacimiento="1970-08-14", activo=False),
        PersonaFisica(id_tipo_documento=1, numero_documento="38112233", nombre="Diego Armando", apellido="Ruiz", id_genero=1, id_estado_civil=1, id_nacionalidad=1, id_condicion_fiscal=2, profesion="Programador", fecha_nacimiento="1992-02-28", activo=True),
    ]
    for pf in personas_fisicas:
        db.add(pf)
    db.flush()

    # ══════════════════════════════════════════════════════════════════
    # PERSONAS JURÍDICAS
    # ══════════════════════════════════════════════════════════════════
    personas_juridicas = [
        PersonaJuridica(id_tipo_documento=3, numero_documento="30-71234567-9", denominacion="Constructora del Sur S.A.", nombre_fantasia="Constructora del Sur", id_forma_juridica=1, fecha_constitucion="2005-03-10", mes_cierre=12, activo=True),
        PersonaJuridica(id_tipo_documento=3, numero_documento="30-71876543-2", denominacion="Servicios Integrales SRL", nombre_fantasia="ServiInt", id_forma_juridica=2, fecha_constitucion="2010-07-15", mes_cierre=6, activo=True),
        PersonaJuridica(id_tipo_documento=3, numero_documento="33-71555444-9", denominacion="Cooperativa Agropecuaria Ltda.", nombre_fantasia="CoopAgro", id_forma_juridica=4, fecha_constitucion="1998-01-20", mes_cierre=12, activo=True),
        PersonaJuridica(id_tipo_documento=3, numero_documento="30-71999888-5", denominacion="Tech Solutions SAS", nombre_fantasia="TechSol", id_forma_juridica=3, fecha_constitucion="2019-11-05", mes_cierre=12, activo=True),
        PersonaJuridica(id_tipo_documento=3, numero_documento="30-71333222-1", denominacion="Fundación Educativa Cheyenne", nombre_fantasia="FEC", id_forma_juridica=5, fecha_constitucion="2001-06-30", mes_cierre=12, activo=True),
    ]
    for pj in personas_juridicas:
        db.add(pj)
    db.flush()

    # ══════════════════════════════════════════════════════════════════
    # DOCUMENTOS ADICIONALES
    # ══════════════════════════════════════════════════════════════════
    documentos = [
        Documento(id_tipo_persona=1, id_persona=personas_fisicas[0].id, id_tipo_documento=2, numero_documento="20-30567890-4", principal=False),
        Documento(id_tipo_persona=1, id_persona=personas_fisicas[1].id, id_tipo_documento=2, numero_documento="27-28345612-8", principal=False),
        Documento(id_tipo_persona=1, id_persona=personas_fisicas[2].id, id_tipo_documento=2, numero_documento="20-35678901-6", principal=False),
        Documento(id_tipo_persona=2, id_persona=personas_juridicas[0].id, id_tipo_documento=3, numero_documento="30-71234567-9", principal=True),
    ]
    for d in documentos:
        db.add(d)
    db.flush()

    # ══════════════════════════════════════════════════════════════════
    # DIRECCIONES (vinculadas a personas)
    # ══════════════════════════════════════════════════════════════════
    laplata_id = localidades[0].id
    caba_loc_id = localidades[5].id
    cba_loc_id = localidades[6].id
    rosario_id = localidades[8].id

    direcciones = [
        Direccion(entidad="persona_fisica", id_entidad=personas_fisicas[0].id, calle="Av. 7", altura="1520", piso="3", dpto="B", codigo_postal="1900", id_pais=ar_id, id_provincia=bsas_id, id_localidad=laplata_id),
        Direccion(entidad="persona_fisica", id_entidad=personas_fisicas[1].id, calle="Corrientes", altura="3456", codigo_postal="1043", id_pais=ar_id, id_provincia=caba_id, id_localidad=caba_loc_id),
        Direccion(entidad="persona_fisica", id_entidad=personas_fisicas[2].id, calle="San Martín", altura="890", codigo_postal="5000", id_pais=ar_id, id_provincia=cba_id, id_localidad=cba_loc_id),
        Direccion(entidad="persona_fisica", id_entidad=personas_fisicas[3].id, calle="Pellegrini", altura="1200", piso="7", dpto="A", codigo_postal="2000", id_pais=ar_id, id_provincia=sfe_id, id_localidad=rosario_id),
        Direccion(entidad="persona_juridica", id_entidad=personas_juridicas[0].id, calle="Diagonal 80", altura="345", codigo_postal="1900", id_pais=ar_id, id_provincia=bsas_id, id_localidad=laplata_id),
        Direccion(entidad="persona_juridica", id_entidad=personas_juridicas[1].id, calle="Rivadavia", altura="5678", piso="10", dpto="C", codigo_postal="1033", id_pais=ar_id, id_provincia=caba_id, id_localidad=caba_loc_id),
    ]
    for d in direcciones:
        db.add(d)
    db.flush()

    # ══════════════════════════════════════════════════════════════════
    # CONTACTOS
    # ══════════════════════════════════════════════════════════════════
    contactos = [
        Contacto(entidad="persona_fisica", id_entidad=personas_fisicas[0].id, id_tipo_contacto=1, detalle="0221-4567890"),
        Contacto(entidad="persona_fisica", id_entidad=personas_fisicas[0].id, id_tipo_contacto=2, detalle="+54 9 221 555-1234"),
        Contacto(entidad="persona_fisica", id_entidad=personas_fisicas[0].id, id_tipo_contacto=3, detalle="jcgarcia@email.com"),
        Contacto(entidad="persona_fisica", id_entidad=personas_fisicas[1].id, id_tipo_contacto=2, detalle="+54 9 11 555-4567"),
        Contacto(entidad="persona_fisica", id_entidad=personas_fisicas[1].id, id_tipo_contacto=3, detalle="mrodriguez@estudio.com"),
        Contacto(entidad="persona_juridica", id_entidad=personas_juridicas[0].id, id_tipo_contacto=1, detalle="0221-4891234"),
        Contacto(entidad="persona_juridica", id_entidad=personas_juridicas[0].id, id_tipo_contacto=3, detalle="info@constructoradelsur.com.ar"),
        Contacto(entidad="persona_juridica", id_entidad=personas_juridicas[0].id, id_tipo_contacto=4, detalle="www.constructoradelsur.com.ar"),
        Contacto(entidad="persona_juridica", id_entidad=personas_juridicas[1].id, id_tipo_contacto=3, detalle="contacto@serviint.com.ar"),
    ]
    for c in contactos:
        db.add(c)
    db.flush()

    # ══════════════════════════════════════════════════════════════════
    # MEDIOS DE PAGO
    # ══════════════════════════════════════════════════════════════════
    medios_pago = [
        MedioPago(id_tipo_persona=1, id_persona=personas_fisicas[0].id, id_tipo_medio_pago=1, titular="Juan Carlos García López", numero="0140000000000000001234", banco="Banco Provincia", alias="juangarcia.cbu"),
        MedioPago(id_tipo_persona=1, id_persona=personas_fisicas[1].id, id_tipo_medio_pago=1, titular="María Elena Rodríguez", numero="0070000000000000005678", banco="Banco Galicia", alias="mrodriguez.gal"),
        MedioPago(id_tipo_persona=2, id_persona=personas_juridicas[0].id, id_tipo_medio_pago=1, titular="Constructora del Sur S.A.", numero="0110000000000000009012", banco="Banco Nación", alias="construcsur.bn"),
        MedioPago(id_tipo_persona=1, id_persona=personas_fisicas[4].id, id_tipo_medio_pago=2, titular="Pablo López Suárez", numero="0000003100089912345678", banco=None, alias="pablo.mp"),
    ]
    for mp in medios_pago:
        db.add(mp)
    db.flush()

    # ══════════════════════════════════════════════════════════════════
    # EXPEDIENTES
    # ══════════════════════════════════════════════════════════════════
    expedientes = [
        Expediente(matricula="ADM", ejercicio=2025, numero=1, letra="A", id_tipo_expediente=1, subnumero=0, referencia_expediente="Habilitación comercial - Constructora del Sur"),
        Expediente(matricula="ADM", ejercicio=2025, numero=2, letra="A", id_tipo_expediente=3, subnumero=0, referencia_expediente="Reclamo por tasa municipal - García López"),
        Expediente(matricula="ADM", ejercicio=2025, numero=3, letra="B", id_tipo_expediente=1, subnumero=0, referencia_expediente="Solicitud de exención - Fundación Educativa"),
        Expediente(matricula="ADM", ejercicio=2024, numero=45, letra="A", id_tipo_expediente=2, subnumero=0, referencia_expediente="Recurso de reconsideración - Martínez"),
        Expediente(matricula="ADM", ejercicio=2024, numero=46, letra="C", id_tipo_expediente=4, subnumero=0, referencia_expediente="Nota interna - Actualización catastral"),
        Expediente(matricula="ING", ejercicio=2025, numero=1, letra="A", id_tipo_expediente=1, subnumero=0, referencia_expediente="Alta de contribuyente - Tech Solutions"),
    ]
    for exp in expedientes:
        db.add(exp)
    db.flush()

    # ══════════════════════════════════════════════════════════════════
    # ENTIDAD DEFINICIONES
    # ══════════════════════════════════════════════════════════════════
    entidad_defs = [
        EntidadDefinicion(tipo="banco", nombre1="Código BCRA", nombre2="Razón Social", nombre3="CUIT", tipo_dato1="string", tipo_dato2="string", tipo_dato3="string"),
        EntidadDefinicion(tipo="moneda", nombre1="Símbolo", nombre2="Nombre Corto", tipo_dato1="string", tipo_dato2="string"),
    ]
    for ed in entidad_defs:
        db.add(ed)
    db.flush()

    # ══════════════════════════════════════════════════════════════════
    # ENTIDADES
    # ══════════════════════════════════════════════════════════════════
    entidades = [
        Entidad(codigo="BNA", tipo="banco", nombre="Banco de la Nación Argentina", orden=1, dato1="011", dato2="Banco de la Nación Argentina", dato3="30-50000845-5"),
        Entidad(codigo="BPBA", tipo="banco", nombre="Banco de la Provincia de Buenos Aires", orden=2, dato1="014", dato2="Banco Provincia", dato3="30-99903208-5"),
        Entidad(codigo="GALICIA", tipo="banco", nombre="Banco Galicia", orden=3, dato1="007", dato2="Banco Galicia", dato3="30-50000173-5"),
        Entidad(codigo="MACRO", tipo="banco", nombre="Banco Macro", orden=4, dato1="285", dato2="Banco Macro", dato3="30-50001008-4"),
        Entidad(codigo="ARS", tipo="moneda", nombre="Peso Argentino", orden=1, dato1="$", dato2="ARS"),
        Entidad(codigo="USD", tipo="moneda", nombre="Dólar Estadounidense", orden=2, dato1="US$", dato2="USD"),
    ]
    for e in entidades:
        db.add(e)
    db.flush()

    # ══════════════════════════════════════════════════════════════════
    # CUENTAS CONTABLES
    # ══════════════════════════════════════════════════════════════════
    cuentas_contables = [
        CuentaContable(codigo="1.1.1", nombre="Caja", orden=1, agrupamiento="Activo"),
        CuentaContable(codigo="1.1.2", nombre="Bancos", orden=2, agrupamiento="Activo"),
        CuentaContable(codigo="1.2.1", nombre="Créditos por tributos", orden=3, agrupamiento="Activo"),
        CuentaContable(codigo="1.2.2", nombre="Créditos por tasas", orden=4, agrupamiento="Activo"),
        CuentaContable(codigo="2.1.1", nombre="Proveedores", orden=5, agrupamiento="Pasivo"),
        CuentaContable(codigo="2.1.2", nombre="Sueldos a pagar", orden=6, agrupamiento="Pasivo"),
        CuentaContable(codigo="3.1.1", nombre="Capital", orden=7, agrupamiento="Patrimonio"),
        CuentaContable(codigo="4.1.1", nombre="Recaudación tributaria", orden=8, agrupamiento="Recursos"),
        CuentaContable(codigo="4.1.2", nombre="Tasas municipales", orden=9, agrupamiento="Recursos"),
        CuentaContable(codigo="4.2.1", nombre="Multas e intereses", orden=10, agrupamiento="Recursos"),
        CuentaContable(codigo="5.1.1", nombre="Gastos en personal", orden=11, agrupamiento="Gastos"),
        CuentaContable(codigo="5.2.1", nombre="Bienes de consumo", orden=12, agrupamiento="Gastos"),
    ]
    for cc in cuentas_contables:
        db.add(cc)
    db.flush()

    # ══════════════════════════════════════════════════════════════════
    # JURISDICCIONES
    # ══════════════════════════════════════════════════════════════════
    jurisdicciones = [
        Jurisdiccion(codigo="MUN", nombre="Municipalidad", orden=1, ejercicio=2025, agrupamiento="Ejecutivo", nivel=1, tipo="ejecutivo"),
        Jurisdiccion(codigo="HCD", nombre="Honorable Concejo Deliberante", orden=2, ejercicio=2025, agrupamiento="Legislativo", nivel=1, tipo="legislativo"),
        Jurisdiccion(codigo="SEC_HAC", nombre="Secretaría de Hacienda", orden=3, ejercicio=2025, agrupamiento="Ejecutivo", nivel=2, tipo="ejecutivo"),
        Jurisdiccion(codigo="SEC_GOB", nombre="Secretaría de Gobierno", orden=4, ejercicio=2025, agrupamiento="Ejecutivo", nivel=2, tipo="ejecutivo"),
        Jurisdiccion(codigo="SEC_OPU", nombre="Secretaría de Obras Públicas", orden=5, ejercicio=2025, agrupamiento="Ejecutivo", nivel=2, tipo="ejecutivo"),
        Jurisdiccion(codigo="DIR_ING", nombre="Dirección de Ingresos Públicos", orden=6, ejercicio=2025, agrupamiento="Ejecutivo", nivel=3, tipo="ejecutivo"),
        Jurisdiccion(codigo="DIR_CONT", nombre="Dirección de Contaduría", orden=7, ejercicio=2025, agrupamiento="Ejecutivo", nivel=3, tipo="ejecutivo"),
        Jurisdiccion(codigo="DIR_TES", nombre="Dirección de Tesorería", orden=8, ejercicio=2025, agrupamiento="Ejecutivo", nivel=3, tipo="ejecutivo"),
    ]
    for j in jurisdicciones:
        db.add(j)
    db.flush()

    # ══════════════════════════════════════════════════════════════════
    # RECURSOS POR RUBRO
    # ══════════════════════════════════════════════════════════════════
    recursos = [
        RecursoPorRubro(codigo="1.1.1", nombre="Tasa por alumbrado, barrido y limpieza", orden=1, presupuesto="2025", agrupamiento="Tributarios", nivel=1),
        RecursoPorRubro(codigo="1.1.2", nombre="Tasa por servicios sanitarios", orden=2, presupuesto="2025", agrupamiento="Tributarios", nivel=1),
        RecursoPorRubro(codigo="1.1.3", nombre="Tasa por inspección de seguridad e higiene", orden=3, presupuesto="2025", agrupamiento="Tributarios", nivel=1),
        RecursoPorRubro(codigo="1.2.1", nombre="Impuesto automotor", orden=4, presupuesto="2025", agrupamiento="Tributarios", nivel=1),
        RecursoPorRubro(codigo="1.2.2", nombre="Impuesto inmobiliario", orden=5, presupuesto="2025", agrupamiento="Tributarios", nivel=1),
        RecursoPorRubro(codigo="2.1.1", nombre="Multas por infracciones", orden=6, presupuesto="2025", agrupamiento="No Tributarios", nivel=1),
        RecursoPorRubro(codigo="2.1.2", nombre="Intereses por mora", orden=7, presupuesto="2025", agrupamiento="No Tributarios", nivel=1),
        RecursoPorRubro(codigo="3.1.1", nombre="Coparticipación federal", orden=8, presupuesto="2025", agrupamiento="Transferencias", nivel=1),
    ]
    for r in recursos:
        db.add(r)
    db.flush()

    # ══════════════════════════════════════════════════════════════════
    # ETIQUETAS
    # ══════════════════════════════════════════════════════════════════
    etiquetas = [
        Etiqueta(entidad="persona_fisica", id_entidad=personas_fisicas[0].id, codigo="CONTRIBUYENTE"),
        Etiqueta(entidad="persona_fisica", id_entidad=personas_fisicas[0].id, codigo="PROFESIONAL"),
        Etiqueta(entidad="persona_fisica", id_entidad=personas_fisicas[5].id, codigo="PROFESIONAL"),
        Etiqueta(entidad="persona_juridica", id_entidad=personas_juridicas[0].id, codigo="CONTRIBUYENTE"),
        Etiqueta(entidad="persona_juridica", id_entidad=personas_juridicas[0].id, codigo="GRAN_CONTRIBUYENTE"),
    ]
    for e in etiquetas:
        db.add(e)
    db.flush()

    # ══════════════════════════════════════════════════════════════════
    # OBSERVACIONES
    # ══════════════════════════════════════════════════════════════════
    observaciones = [
        Observacion(entidad="persona_fisica", id_entidad=personas_fisicas[0].id, detalle="Contribuyente con buena situación fiscal. Sin deuda pendiente.", id_usuario=1),
        Observacion(entidad="persona_juridica", id_entidad=personas_juridicas[0].id, detalle="Empresa con habilitación municipal vigente. Próxima renovación: 2026.", id_usuario=1),
        Observacion(entidad="expediente", id_entidad=expedientes[1].id, detalle="Reclamo recibido el 15/01/2025. En análisis por la Dirección de Ingresos.", id_usuario=1),
    ]
    for o in observaciones:
        db.add(o)

    db.commit()
    db.close()

    print("Seed de Administración completado.")
    print(f"  - {len(listas)} listas de referencia")
    print(f"  - {len(paises)} países, {len(provincias)} provincias, {len(localidades)} localidades")
    print(f"  - {len(personas_fisicas)} personas físicas, {len(personas_juridicas)} personas jurídicas")
    print(f"  - {len(expedientes)} expedientes")
    print(f"  - {len(cuentas_contables)} cuentas contables")
    print(f"  - {len(jurisdicciones)} jurisdicciones")
    print(f"  - {len(recursos)} recursos por rubro")


if __name__ == "__main__":
    seed()
