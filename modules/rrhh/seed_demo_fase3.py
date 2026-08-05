"""
Seed de datos DEMO para la FASE 3 del módulo RRHH:
ausencias/licencias, horas extra y embargos, integrados al motor de liquidación.

Agrega (get-or-create por código, prefijo DEMO- para conceptos) 2 conceptos nuevos, ~6
motivos de ausencia, ~5 ausencias, ~5 licencias anuales, ~4 horas extra y ~3 embargos
sobre los legajos DEMO-* existentes.

Idempotente. Ejecutar después de seed_demo.py y seed_demo_liquidacion.py:

    docker compose exec rrhh python seed_demo_fase3.py
"""
import sys
import os
from datetime import datetime, timezone, date
from decimal import Decimal

sys.path.insert(0, os.path.dirname(__file__))
sys.path.insert(0, os.path.join(os.path.dirname(__file__), ".."))

from database import SessionLocal, engine
from shared.database import Base
from models.rrhh import (
    Concepto, Legajo, MotivoAusencia, Ausencia, LicenciaAnual, HoraExtra, Embargo,
)


# ── Conceptos nuevos (get-or-create por codigo) ───────────────────────
# (codigo, descripcion, tipo, orden, condicion, cantidad, base, porcentaje, formula, aguinaldo)
CONCEPTOS = [
    ("DEMO-C25", "Horas extra", "H", "25", "@HS_EXTRA_IMPORTE > 0", None, None, None,
     "#REDONDEO(@HS_EXTRA_IMPORTE, 2)", False),
    ("DEMO-C90", "Descuento por ausencias", "D", "90", "@DIAS_DESCONTAR > 0", None, None, None,
     "#REDONDEO(@TN_HABER / 30 * @DIAS_DESCONTAR, 2)", False),
]

# ── Motivos de ausencia (codigo, desc, %desc, descuenta_dias, descuenta_agui,
#    afecta_presentismo, es_licencia_anual, requiere_certificado) ───────
MOTIVOS = [
    ("ENF", "Enfermedad", "0", False, False, False, False, True),
    ("INJ", "Inasistencia injustificada", "100", True, True, True, False, False),
    ("VAC", "Licencia anual (vacaciones)", "0", False, False, False, True, False),
    ("MAT", "Licencia por maternidad", "0", False, False, False, False, True),
    ("DUE", "Licencia por duelo", "0", False, False, False, False, False),
    ("SG", "Licencia sin goce de haberes", "100", True, True, True, False, False),
]


def _leg_by_num(db, num):
    return db.query(Legajo).filter(Legajo.numero_legajo == num).first()


def seed():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        now = datetime.now(timezone.utc)

        # 1) Conceptos
        n_con = 0
        for (cod, desc, tipo, orden, cond, cant, base, porc, form, agui) in CONCEPTOS:
            if db.query(Concepto).filter(Concepto.codigo == cod).first():
                continue
            db.add(Concepto(codigo=cod, descripcion=desc, tipo=tipo, orden=Decimal(orden),
                            condicion=cond, cantidad=cant, base=base, porcentaje=porc,
                            formula=form, aguinaldo=agui, created_at=now)); n_con += 1

        # 2) Motivos de ausencia
        n_mot = 0
        motivos_by_cod = {}
        for (cod, desc, pct, dd, da, ap, lic, cert) in MOTIVOS:
            m = db.query(MotivoAusencia).filter(MotivoAusencia.codigo == cod).first()
            if not m:
                m = MotivoAusencia(
                    codigo=cod, descripcion=desc, porcentaje_descuento=Decimal(pct),
                    descuenta_dias=dd, descuenta_aguinaldo=da, afecta_presentismo=ap,
                    es_licencia_anual=lic, requiere_certificado=cert, created_at=now)
                db.add(m); n_mot += 1
            motivos_by_cod[cod] = m
        db.flush()  # asegurar ids de motivos

        # Legajos DEMO existentes
        legs = db.query(Legajo).filter(Legajo.numero_legajo.like("DEMO-%")).order_by(Legajo.id).all()
        legs = legs[:5]
        if not legs:
            db.commit()
            print("seed rrhh fase3: no hay legajos DEMO-*; corré seed_demo.py primero")
            return
        # rellenar hasta 5 referencias reutilizando
        L = (legs + legs * 5)[:5]
        anio = date.today().year
        mes = date.today().month

        m_inj = motivos_by_cod["INJ"]; m_enf = motivos_by_cod["ENF"]
        m_vac = motivos_by_cod["VAC"]; m_sg = motivos_by_cod["SG"]; m_due = motivos_by_cod["DUE"]

        # 3) Ausencias (algunas injustificadas -> descuentan) del período actual
        AUSENCIAS = [
            (L[0].id, m_inj.id, date(anio, mes, 3), date(anio, mes, 4), 2, False, "Inasistencia sin aviso"),
            (L[1].id, m_enf.id, date(anio, mes, 5), date(anio, mes, 9), 3, True, "Reposo con certificado"),
            (L[2].id, m_vac.id, date(anio, mes, 10), date(anio, mes, 20), 8, False, "Vacaciones"),
            (L[3].id, m_sg.id, date(anio, mes, 1), date(anio, mes, 2), 2, False, "Sin goce de haberes"),
            (L[4].id, m_due.id, date(anio, mes, 6), date(anio, mes, 8), 3, False, "Duelo familiar directo"),
        ]
        n_aus = 0
        for (idl, idm, fi, ff, dh, cert, obs) in AUSENCIAS:
            ya = db.query(Ausencia).filter(
                Ausencia.id_legajo == idl, Ausencia.id_motivo == idm,
                Ausencia.fecha_inicio == fi).first()
            if ya:
                continue
            db.add(Ausencia(id_legajo=idl, id_motivo=idm, fecha_inicio=fi, fecha_fin=ff,
                            dias_habiles=dh, certificado=cert, observaciones=obs,
                            created_at=now)); n_aus += 1

        # 4) Licencias anuales (~5)
        n_lic = 0
        for i, leg in enumerate(L):
            ya = db.query(LicenciaAnual).filter(
                LicenciaAnual.id_legajo == leg.id, LicenciaAnual.anio == anio).first()
            if ya:
                continue
            db.add(LicenciaAnual(id_legajo=leg.id, anio=anio, cant_dias=20,
                                 dias_tomados=[8, 0, 15, 5, 0][i], created_at=now)); n_lic += 1

        # 5) Horas extra (~4) del período actual, con valor_hora
        HORAS = [
            (L[0].id, "50", "10", "1500.0000"),
            (L[1].id, "100", "5", "1500.0000"),
            (L[3].id, "50", "8", "1800.0000"),
            (L[3].id, "100", "3", "1800.0000"),
        ]
        n_he = 0
        for (idl, tipo, cant, val) in HORAS:
            ya = db.query(HoraExtra).filter(
                HoraExtra.id_legajo == idl, HoraExtra.anio == anio,
                HoraExtra.mes == mes, HoraExtra.tipo == tipo).first()
            if ya:
                continue
            db.add(HoraExtra(id_legajo=idl, anio=anio, mes=mes, tipo=tipo,
                             cantidad=Decimal(cant), valor_hora=Decimal(val),
                             created_at=now)); n_he += 1

        # 6) Embargos (~3): 1 alimentos %, 1 común importe fijo con tope, 1 cerca del tope
        EMBARGOS = [
            (L[0].id, "EMB-2024-001", "alimentos", "porcentaje", "20", "0", True,
             date(anio - 1, 1, 10), None, "Alimentos - hijo menor", "Juzgado de Familia Nº 3", "Banco Provincia"),
            (L[1].id, "EMB-2024-002", "comun", "importe", "5000", "60000", True,
             date(anio - 1, 6, 5), None, "Ejecución fiscal", "Juzgado Civil y Comercial Nº 1", "Banco Nación"),
            (L[3].id, "EMB-2023-099", "comun", "importe", "8000", "10000", True,
             date(anio - 2, 3, 20), None, "Cobro ejecutivo (casi saldado)", "Juzgado de Paz", "Banco Galicia"),
        ]
        n_emb = 0
        for (idl, num, tipo, retiene, cuota, tope, rsf, fecha, venc, carat, juz, banco) in EMBARGOS:
            ya = db.query(Embargo).filter(Embargo.numero == num).first()
            if ya:
                continue
            db.add(Embargo(id_legajo=idl, numero=num, tipo=tipo, retiene=retiene,
                           cuota_valor=Decimal(cuota), monto_total=Decimal(tope),
                           respeta_salario_familiar=rsf, fecha=fecha, fecha_vencimiento=venc,
                           caratula=carat, juzgado=juz, estado="autorizado",
                           banco_destino=banco, created_at=now)); n_emb += 1

        db.commit()
        print(f"seed rrhh fase3: +{n_mot} motivos, +{n_aus} ausencias, +{n_lic} licencias, "
              f"+{n_he} horas_extra, +{n_emb} embargos (+{n_con} conceptos)")
    except Exception as ex:
        db.rollback()
        print(f"seed rrhh fase3: fallo: {ex}")
        raise
    finally:
        db.close()


if __name__ == "__main__":
    seed()
