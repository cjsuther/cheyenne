#!/usr/bin/env python3
"""Reensambla FormulaTasa.csv + FormulaTasaAcumuladores.csv (multi-línea, latin-1, ;)
y genera import_formulas.sql para las tablas del motor en emisiones."""
import re, sys

BASE = "legacy/ScriptsSQL/Tasas/QUERYS_CSV_PUNTOYCOMA"


def reassemble(fn, start_re):
    with open(f"{BASE}/{fn}", encoding="latin-1") as f:
        text = f.read().replace("\r\n", "\n").replace("\r", "\n")
    body = text.split("\n")[2:]  # saltear header + línea de guiones
    pat = re.compile(start_re)
    recs, cur = [], None
    for ln in body:
        if pat.match(ln):
            if cur is not None:
                recs.append(cur)
            cur = ln
        elif cur is not None:
            cur += " " + ln  # newline embebido -> espacio
    if cur is not None:
        recs.append(cur)
    return [r.split(";") for r in recs]


def s(v, maxlen=None):
    v = (v or "").strip()
    if v == "":
        return "NULL"
    if maxlen:
        v = v[:maxlen]
    return "'" + v.replace("'", "''") + "'"


def i(v, default=0):
    try:
        return str(int(float((v or "").strip())))
    except Exception:
        return str(default)


def d(v):
    v = (v or "").strip()[:10]
    return "'" + v + "'" if re.match(r"\d{4}-\d{2}-\d{2}", v) else "NULL"


inserts = []

# ── FormulaTasa ──
ft = reassemble("FormulaTasa.csv", r"^\d+;\d+;\d+;\d{4}-\d{2}-\d{2}")
for r in ft:
    inserts.append(
        "INSERT INTO emisiones_formula_tasa "
        "(tipo_tributo,ttas_tasa,ttas_subtasa,fort_numero,fort_orden,fort_descripcion,"
        "fort_condicion,fort_acumulador_condicion,"
        "fort_a_cancelar_1,fort_a_pagar_1,fort_a_cancelar_2,fort_a_pagar_2,"
        "fort_a_cancelar_3,fort_a_pagar_3,fort_a_cancelar_4,fort_a_pagar_4,"
        "fecha_desde,fecha_hasta,activo) VALUES ("
        f"NULL,{i(r[0])},{i(r[1])},{i(r[2])},{i(r[5])},{s(r[26],250)},"
        f"{s(r[7])},{s(r[6])},"
        f"{s(r[8])},{s(r[9])},{s(r[10])},{s(r[11])},"
        f"{s(r[12])},{s(r[13])},{s(r[14])},{s(r[15])},"
        f"{d(r[3])},{d(r[4])},true);"
    )

# ── FormulaTasaAcumuladores ──
ac = reassemble("FormulaTasaAcumuladores.csv", r"^\d+;\d+;\d+;\d+;")
for r in ac:
    inserts.append(
        "INSERT INTO emisiones_formula_tasa_acumuladores "
        "(ttas_tasa,ttas_subtasa,fort_numero,ftac_numero,ftac_descripcion,ftac_importe,activo) "
        f"VALUES ({i(r[0])},{i(r[1])},{i(r[2])},{i(r[3])},{s(r[4],250)},{s(r[5])},true);"
    )

header = """-- Migración 003 — Catálogo real de fórmulas del motor de cálculo
-- ----------------------------------------------------------------------------
-- Carga las {nf} fórmulas (FormulaTasa) y {na} acumuladores (FormulaTasaAcumuladores)
-- del sistema legacy en las tablas del módulo emisiones. Autocontenida (no depende
-- de los CSV). Idempotente: si ya hay >=100 fórmulas cargadas, no hace nada (no pisa
-- ediciones hechas por la UI).
--
-- Uso:
--   docker compose exec -T postgres sh -c 'psql -U "$POSTGRES_USER" -d "$POSTGRES_DB"' \\
--     < migrations/003_catalogo_formulas.sql
-- Regenerar desde los CSV: python3 /tmp/gen_import_formulas.py
-- ----------------------------------------------------------------------------
""".format(nf=len(ft), na=len(ac))

body = "\n".join("    " + line for line in inserts)
sql = (
    header
    + "DO $mig$\nBEGIN\n"
    + "  IF (SELECT count(*) FROM emisiones_formula_tasa) >= 100 THEN\n"
    + "    RAISE NOTICE 'Catálogo de fórmulas ya cargado; se omite.';\n"
    + "    RETURN;\n  END IF;\n"
    + "  DELETE FROM emisiones_formula_tasa_acumuladores;\n"
    + "  DELETE FROM emisiones_formula_tasa;\n"
    + body
    + "\nEND $mig$;\n"
)

out_path = "migrations/003_catalogo_formulas.sql"
with open(out_path, "w", encoding="utf-8") as f:
    f.write(sql)
# verificar que ningún valor rompa el dollar-quote $mig$
assert "$mig$" not in body, "una fórmula contiene $mig$ — cambiar el tag del dollar-quote"
print(f"formulas={len(ft)} acumuladores={len(ac)} -> {out_path}")
