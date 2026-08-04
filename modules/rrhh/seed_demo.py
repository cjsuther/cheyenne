"""
Seed de datos DEMO para el módulo Recursos Humanos (Fase 1).
Puebla los catálogos, ~10 legajos (con 1 cargo, 1-2 antigüedades y 0-2 familiares
cada uno) y ~8 filas de planta presupuestaria (rrhh_presupuesto_cargos).

Idempotente: si ya existen legajos con numero_legajo "DEMO-*", omite.

    docker compose exec rrhh python seed_demo.py
"""
import sys
import os
from datetime import date, datetime, timezone
from decimal import Decimal

sys.path.insert(0, os.path.dirname(__file__))
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from database import SessionLocal, engine
from shared.database import Base
from models.rrhh import (
    Categoria, TipoCargo, CargoFuncion, NivelLaboral, TipoRelacion, Oficina,
    Parentesco, TipoAntiguedad, Sindicato, ObraSocial,
    Legajo, LegajoCargo, Antiguedad, Familiar, PresupuestoCargo,
)

Q = Decimal("0.01")


def _dec(v):
    return Decimal(str(v or 0)).quantize(Q)


# ── Catálogos (código con prefijo DEMO para idempotencia/limpieza) ────
CATEGORIAS = [
    ("DEMO-CAT-1", "Categoría 1 - Ingreso", "1.0000"),
    ("DEMO-CAT-2", "Categoría 2", "1.5000"),
    ("DEMO-CAT-3", "Categoría 3", "2.0000"),
    ("DEMO-CAT-4", "Categoría 4", "2.7500"),
    ("DEMO-CAT-5", "Categoría 5", "3.5000"),
    ("DEMO-CAT-6", "Categoría 6 - Superior", "4.5000"),
]
TIPOS_CARGO = [
    ("DEMO-TC-SUP", "Superior"),
    ("DEMO-TC-JER", "Jerárquico"),
    ("DEMO-TC-PRO", "Profesional"),
    ("DEMO-TC-TEC", "Técnico"),
    ("DEMO-TC-ADM", "Administrativo"),
]
CARGOS_FUNCIONES = [
    ("DEMO-CF-DIR", "Director", "4.5000", True, False),
    ("DEMO-CF-JEF", "Jefe de Departamento", "3.0000", True, False),
    ("DEMO-CF-ADM", "Administrativo", "1.5000", True, False),
    ("DEMO-CF-COO", "Coordinador (función)", "2.0000", False, True),
    ("DEMO-CF-OPE", "Operario", "1.0000", True, False),
]
NIVELES = [
    ("DEMO-NL-A", "Nivel A - Superior"),
    ("DEMO-NL-B", "Nivel B - Profesional"),
    ("DEMO-NL-C", "Nivel C - Técnico"),
    ("DEMO-NL-D", "Nivel D - Administrativo"),
    ("DEMO-NL-E", "Nivel E - Servicios"),
]
TIPOS_RELACION = [
    ("DEMO-TR-TIT", "Titular / Planta Permanente"),
    ("DEMO-TR-MEN", "Mensualizado"),
    ("DEMO-TR-JOR", "Jornalizado"),
    ("DEMO-TR-TEM", "Planta Temporaria"),
    ("DEMO-TR-CON", "Contratado"),
]
OFICINAS = [
    ("DEMO-OF-INT", "Intendencia"),
    ("DEMO-OF-HAC", "Secretaría de Hacienda"),
    ("DEMO-OF-OBR", "Secretaría de Obras Públicas"),
    ("DEMO-OF-SAL", "Secretaría de Salud"),
    ("DEMO-OF-GOB", "Secretaría de Gobierno"),
]
PARENTESCOS = [
    ("DEMO-PA-CON", "Cónyuge"),
    ("DEMO-PA-HIJ", "Hijo/a"),
    ("DEMO-PA-PAD", "Padre/Madre"),
    ("DEMO-PA-FAC", "Familiar a cargo"),
]
TIPOS_ANTIG = [
    ("DEMO-TA-MUN", "Antigüedad Municipal", "municipal", True),
    ("DEMO-TA-PUB", "Antigüedad en la Administración Pública", "publica", True),
    ("DEMO-TA-PRI", "Antigüedad Privada (no liquida)", "no_liquida", False),
]
SINDICATOS = [
    ("DEMO-SIN-SOEM", "Sindicato de Obreros y Empleados Municipales (SOEM)", "30-52145678-9", "2.5000"),
    ("DEMO-SIN-UPCN", "Unión del Personal Civil de la Nación (UPCN)", "30-54876321-4", "2.0000"),
    ("DEMO-SIN-ATE",  "Asociación Trabajadores del Estado (ATE)", "30-51234987-1", "1.8000"),
]
OBRAS_SOCIALES = [
    ("DEMO-OS-IOMA", "IOMA - Instituto de Obra Médico Asistencial", "30-99912345-6", "4.5000"),
    ("DEMO-OS-OSDE", "OSDE Binaria", "30-58765432-1", "3.0000"),
    ("DEMO-OS-SWISS", "Swiss Medical", "30-61234567-8", "3.0000"),
]

# ── Legajos ───────────────────────────────────────────────────────────
# (numero, apellido_nombre, cuil, idx_tipo_relacion, idx_obra_social, idx_sindicato,
#  fecha_ingreso, estado, banco, cbu,
#  cargo=(idx_cat, idx_tc, idx_cf, idx_of, fecha_ing, letra, anio, num, exp, obj_gasto),
#  antiguedades=[(desde, hasta_o_None, lugar, idx_ta)],
#  familiares=[(nombre, doc, idx_par, a_cargo, deduce, discap, pct)])
LEGAJOS = [
    ("DEMO-0001", "Gómez, María Laura", "27-28456789-3", 0, 0, 0, date(2010, 3, 1), "activo",
     "Banco Provincia", "0140099903200012345678",
     (5, 3, 2, 1, date(2010, 3, 1), "D", 2010, "0123/10", "EXP-2010-0456", "1.1.1"),
     [(date(2010, 3, 1), None, "Municipalidad", 0)],
     [("Gómez, Juan Ignacio", "45123456", 1, True, True, False, "0")]),

    ("DEMO-0002", "Rodríguez, Carlos Alberto", "20-25123456-7", 0, 0, 1, date(2005, 6, 15), "activo",
     "Banco Nación", "0110099930000098765432",
     (6, 0, 0, 0, date(2018, 1, 2), "A", 2018, "0045/18", "EXP-2018-0021", "1.1.1"),
     [(date(2005, 6, 15), None, "Municipalidad", 0),
      (date(2000, 1, 1), date(2005, 6, 14), "Provincia de Buenos Aires", 1)],
     [("Rodríguez, Ana Sofía", "48987654", 1, True, True, False, "0"),
      ("Fernández, Silvia", "24555666", 0, True, True, False, "0")]),

    ("DEMO-0003", "Fernández, Ana Sofía", "27-30987654-2", 1, 1, 0, date(2015, 9, 1), "activo",
     "Banco Provincia", "0140011103200055667788",
     (3, 4, 2, 2, date(2015, 9, 1), "B", 2015, "0210/15", "EXP-2015-0789", "1.1.1"),
     [(date(2015, 9, 1), None, "Municipalidad", 0)],
     []),

    ("DEMO-0004", "López, Diego Martín", "20-27654321-9", 2, 2, 2, date(2020, 2, 3), "activo",
     "Banco Galicia", "0070099920000011223344",
     (2, 4, 4, 3, date(2020, 2, 3), "C", 2020, "0330/20", "EXP-2020-0112", "1.1.1"),
     [(date(2020, 2, 3), None, "Municipalidad", 0)],
     [("López, Tomás", "50111222", 1, True, False, True, "100.0000")]),

    ("DEMO-0005", "Martínez, Laura Beatriz", "27-24333222-1", 0, 0, 1, date(2008, 11, 10), "licencia",
     "Banco Provincia", "0140022203200099001122",
     (4, 2, 1, 1, date(2012, 4, 1), "B", 2012, "0155/12", "EXP-2012-0345", "1.1.1"),
     [(date(2008, 11, 10), None, "Municipalidad", 0)],
     [("Martínez, Pedro", "22333444", 2, True, False, False, "0")]),

    ("DEMO-0006", "Sánchez, Jorge Luis", "20-22111000-5", 0, 1, 0, date(2003, 4, 20), "activo",
     "Banco Nación", "0110099930000033445566",
     (6, 1, 0, 0, date(2016, 3, 1), "A", 2016, "0012/16", "EXP-2016-0008", "1.1.1"),
     [(date(2003, 4, 20), None, "Municipalidad", 0),
      (date(1998, 5, 1), date(2003, 4, 19), "Nación", 1)],
     []),

    ("DEMO-0007", "González, Verónica Paola", "27-29876543-0", 3, 2, 2, date(2019, 7, 1), "activo",
     "Banco Galicia", "0070099920000077889900",
     (1, 4, 2, 3, date(2019, 7, 1), "E", 2019, "0401/19", "EXP-2019-0567", "1.1.1"),
     [(date(2019, 7, 1), None, "Municipalidad", 0)],
     [("González, Lucas", "51777888", 1, True, True, False, "0")]),

    ("DEMO-0008", "Pérez, Roberto Daniel", "20-26543210-8", 1, 0, 1, date(2012, 1, 16), "activo",
     "Banco Provincia", "0140033303200022334455",
     (3, 2, 1, 2, date(2012, 1, 16), "C", 2012, "0088/12", "EXP-2012-0099", "1.1.1"),
     [(date(2012, 1, 16), None, "Municipalidad", 0)],
     []),

    ("DEMO-0009", "Díaz, Silvina Mariel", "27-31234567-9", 4, 1, 0, date(2022, 3, 1), "activo",
     "Banco Nación", "0110099930000044556677",
     (2, 3, 2, 4, date(2022, 3, 1), "D", 2022, "0501/22", "EXP-2022-0234", "1.1.1"),
     [(date(2022, 3, 1), None, "Municipalidad", 0)],
     [("Díaz, Camila", "52999000", 1, True, True, False, "0"),
      ("Suárez, Marcelo", "23444555", 0, True, False, False, "0")]),

    ("DEMO-0010", "Torres, Miguel Ángel", "20-23987654-3", 0, 0, 2, date(2001, 8, 5), "baja",
     "Banco Provincia", "0140044403200066778899",
     (5, 1, 1, 1, date(2001, 8, 5), "B", 2001, "0009/01", "EXP-2001-0003", "1.1.1"),
     [(date(2001, 8, 5), date(2024, 8, 5), "Municipalidad", 0)],
     []),
]

# ── Planta presupuestaria ─────────────────────────────────────────────
# (anio, idx_categoria, idx_tipo_cargo, objeto_gasto, cantidad, costo_anual)
PRESUPUESTO = [
    (2026, 5, 0, "1.1.1", 8,  Decimal("96000000.00")),
    (2026, 4, 1, "1.1.1", 15, Decimal("135000000.00")),
    (2026, 2, 2, "1.1.1", 25, Decimal("175000000.00")),
    (2026, 1, 3, "1.1.1", 40, Decimal("220000000.00")),
    (2026, 0, 4, "1.1.1", 60, Decimal("240000000.00")),
    (2026, 0, 4, "1.2.1", 12, Decimal("36000000.00")),
    (2025, 5, 0, "1.1.1", 7,  Decimal("70000000.00")),
    (2025, 0, 4, "1.1.1", 55, Decimal("192500000.00")),
]


def _seed_catalogo(db, model, rows, builder):
    n = 0
    for r in rows:
        codigo = r[0]
        if db.query(model).filter(model.codigo == codigo).first():
            continue
        db.add(builder(r)); n += 1
    return n


def seed():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        if db.query(Legajo).filter(Legajo.numero_legajo.like("DEMO-%")).first():
            print("seed_demo rrhh: ya sembrado, omito")
            return

        now = datetime.now(timezone.utc)

        # 1) Catálogos
        n_cat = _seed_catalogo(db, Categoria, CATEGORIAS,
            lambda r: Categoria(codigo=r[0], descripcion=r[1], cantidad_modulos=_dec(r[2]), created_at=now))
        n_tc = _seed_catalogo(db, TipoCargo, TIPOS_CARGO,
            lambda r: TipoCargo(codigo=r[0], descripcion=r[1], created_at=now))
        n_cf = _seed_catalogo(db, CargoFuncion, CARGOS_FUNCIONES,
            lambda r: CargoFuncion(codigo=r[0], descripcion=r[1], cantidad_modulos=_dec(r[2]),
                                   es_cargo=r[3], es_funcion=r[4], created_at=now))
        n_nl = _seed_catalogo(db, NivelLaboral, NIVELES,
            lambda r: NivelLaboral(codigo=r[0], descripcion=r[1], created_at=now))
        n_tr = _seed_catalogo(db, TipoRelacion, TIPOS_RELACION,
            lambda r: TipoRelacion(codigo=r[0], descripcion=r[1], created_at=now))
        n_of = _seed_catalogo(db, Oficina, OFICINAS,
            lambda r: Oficina(codigo=r[0], descripcion=r[1], created_at=now))
        n_pa = _seed_catalogo(db, Parentesco, PARENTESCOS,
            lambda r: Parentesco(codigo=r[0], descripcion=r[1], created_at=now))
        n_ta = _seed_catalogo(db, TipoAntiguedad, TIPOS_ANTIG,
            lambda r: TipoAntiguedad(codigo=r[0], descripcion=r[1], regimen=r[2], computa=r[3], created_at=now))
        n_sin = _seed_catalogo(db, Sindicato, SINDICATOS,
            lambda r: Sindicato(codigo=r[0], nombre=r[1], cuit=r[2], porcentaje_aporte=_dec(r[3]), created_at=now))
        n_os = _seed_catalogo(db, ObraSocial, OBRAS_SOCIALES,
            lambda r: ObraSocial(codigo=r[0], nombre=r[1], cuit=r[2], porcentaje_aporte=_dec(r[3]), created_at=now))
        db.flush()

        # Resolver IDs de catálogos por índice (orden de inserción == orden de listas)
        cats = db.query(Categoria).filter(Categoria.codigo.like("DEMO-CAT-%")).order_by(Categoria.id).all()
        tcs = db.query(TipoCargo).filter(TipoCargo.codigo.like("DEMO-TC-%")).order_by(TipoCargo.id).all()
        cfs = db.query(CargoFuncion).filter(CargoFuncion.codigo.like("DEMO-CF-%")).order_by(CargoFuncion.id).all()
        ofs = db.query(Oficina).filter(Oficina.codigo.like("DEMO-OF-%")).order_by(Oficina.id).all()
        trs = db.query(TipoRelacion).filter(TipoRelacion.codigo.like("DEMO-TR-%")).order_by(TipoRelacion.id).all()
        oss = db.query(ObraSocial).filter(ObraSocial.codigo.like("DEMO-OS-%")).order_by(ObraSocial.id).all()
        sins = db.query(Sindicato).filter(Sindicato.codigo.like("DEMO-SIN-%")).order_by(Sindicato.id).all()
        pars = db.query(Parentesco).filter(Parentesco.codigo.like("DEMO-PA-%")).order_by(Parentesco.id).all()
        tas = db.query(TipoAntiguedad).filter(TipoAntiguedad.codigo.like("DEMO-TA-%")).order_by(TipoAntiguedad.id).all()

        # 2) Legajos + cargos + antigüedades + familiares
        n_leg = n_car = n_ant = n_fam = 0
        for spec in LEGAJOS:
            (num, nombre, cuil, i_tr, i_os, i_sin, f_ing, estado, banco, cbu,
             cargo, antigs, fams) = spec
            leg = Legajo(numero_legajo=num, apellido_nombre=nombre, cuil=cuil,
                         id_tipo_relacion=trs[i_tr].id, id_obra_social=oss[i_os].id,
                         id_sindicato=sins[i_sin].id, fecha_ingreso=f_ing,
                         estado=estado, banco=banco, cbu=cbu, created_at=now, activo=True)
            db.add(leg); db.flush(); n_leg += 1

            (ic, itc, icf, iof, f_car, letra, anio, numnom, exp, obj) = cargo
            db.add(LegajoCargo(id_legajo=leg.id, id_categoria=cats[ic].id, id_tipo_cargo=tcs[itc].id,
                               id_cargo_funcion=cfs[icf].id, id_oficina=ofs[iof].id,
                               fecha_ingreso_cargo=f_car, letra_nombramiento=letra,
                               anio_nombramiento=anio, numero_nombramiento=numnom, expediente=exp,
                               jurisdiccion="1", estructura="01.00", fuente="11", objeto_gasto=obj,
                               created_at=now, activo=True)); n_car += 1

            for (desde, hasta, lugar, i_ta) in antigs:
                db.add(Antiguedad(id_legajo=leg.id, fecha_desde=desde, fecha_hasta=hasta,
                                  lugar=lugar, id_tipo_antiguedad=tas[i_ta].id,
                                  created_at=now, activo=True)); n_ant += 1

            for (fnom, doc, i_par, acg, ded, dis, pct) in fams:
                db.add(Familiar(id_legajo=leg.id, apellido_nombre=fnom, documento=doc,
                                id_parentesco=pars[i_par].id, a_cargo=acg, deduce_ganancias=ded,
                                discapacitado=dis, porcentaje_deduccion=_dec(pct),
                                created_at=now, activo=True)); n_fam += 1

        # 3) Planta presupuestaria
        n_pre = 0
        for (anio, ic, itc, obj, cant, costo) in PRESUPUESTO:
            db.add(PresupuestoCargo(anio=anio, id_categoria=cats[ic].id, id_tipo_cargo=tcs[itc].id,
                                    objeto_gasto=obj, cantidad_cargos=cant, costo_anual=_dec(costo),
                                    created_at=now, activo=True)); n_pre += 1

        db.commit()
        print(f"seed_demo rrhh: +{n_leg} legajos, +{n_car} cargos, +{n_ant} antiguedades, "
              f"+{n_fam} familiares, +{n_pre} presupuesto_cargos | catálogos: "
              f"cat={n_cat} tc={n_tc} cf={n_cf} nl={n_nl} tr={n_tr} of={n_of} pa={n_pa} "
              f"ta={n_ta} sind={n_sin} os={n_os}")
    except Exception as ex:
        db.rollback()
        print(f"seed_demo rrhh: fallo: {ex}")
        raise
    finally:
        db.close()


if __name__ == "__main__":
    seed()
