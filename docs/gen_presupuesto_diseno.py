#!/usr/bin/env python3
"""Genera el Word de Análisis y Diseño del nuevo módulo Presupuesto de Cheyenne."""
import os
from docx import Document
from docx.shared import Pt, RGBColor, Inches
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.oxml.ns import qn
from docx.oxml import OxmlElement

HERE = os.path.dirname(__file__)
PRIMARY = RGBColor(0x1D, 0x4E, 0xD8)
DARK = RGBColor(0x1F, 0x29, 0x37)
GREY = RGBColor(0x6B, 0x72, 0x80)

doc = Document()
n = doc.styles["Normal"]; n.font.name = "Calibri"; n.font.size = Pt(11)
n.paragraph_format.space_after = Pt(6)


def shade(cell, hexc):
    tcPr = cell._tc.get_or_add_tcPr(); sh = OxmlElement("w:shd")
    sh.set(qn("w:val"), "clear"); sh.set(qn("w:color"), "auto"); sh.set(qn("w:fill"), hexc)
    tcPr.append(sh)


def h1(t):
    p = doc.add_heading(t, level=1)
    for r in p.runs: r.font.color.rgb = PRIMARY
    return p


def h2(t):
    p = doc.add_heading(t, level=2)
    for r in p.runs: r.font.color.rgb = DARK
    return p


def para(t="", bold=False, italic=False, color=None):
    p = doc.add_paragraph(); r = p.add_run(t)
    r.bold = bold; r.italic = italic
    if color: r.font.color.rgb = color
    return p


def bullet(t, lvl=0):
    p = doc.add_paragraph(style="List Bullet")
    p.paragraph_format.left_indent = Inches(0.25 + 0.2 * lvl)
    p.add_run(t); return p


def code(t):
    p = doc.add_paragraph(); r = p.add_run(t)
    r.font.name = "Consolas"; r.font.size = Pt(8.5)
    pPr = p._p.get_or_add_pPr(); sh = OxmlElement("w:shd")
    sh.set(qn("w:val"), "clear"); sh.set(qn("w:color"), "auto"); sh.set(qn("w:fill"), "F1F5F9")
    pPr.append(sh)
    return p


def table(headers, rows, widths=None):
    t = doc.add_table(rows=1, cols=len(headers)); t.style = "Light Grid Accent 1"
    for i, htext in enumerate(headers):
        c = t.rows[0].cells[i]; c.text = ""
        run = c.paragraphs[0].add_run(htext); run.bold = True; run.font.size = Pt(9.5)
        run.font.color.rgb = RGBColor(0xFF, 0xFF, 0xFF); shade(c, "1D4ED8")
    for row in rows:
        cells = t.add_row().cells
        for i, v in enumerate(row):
            cells[i].text = ""; run = cells[i].paragraphs[0].add_run(str(v)); run.font.size = Pt(9)
    if widths:
        for row in t.rows:
            for i, w in enumerate(widths):
                row.cells[i].width = Inches(w)
    return t


def note(t):
    p = doc.add_paragraph(); r = p.add_run("  ★  " + t); r.italic = True; r.font.color.rgb = RGBColor(0x1D, 0x4E, 0xD8)
    pPr = p._p.get_or_add_pPr(); sh = OxmlElement("w:shd")
    sh.set(qn("w:val"), "clear"); sh.set(qn("w:color"), "auto"); sh.set(qn("w:fill"), "EFF6FF"); pPr.append(sh)
    return p


# ── Portada ──────────────────────────────────────────────────────────
t = doc.add_paragraph(); t.alignment = WD_ALIGN_PARAGRAPH.CENTER
r = t.add_run("Cheyenne — Módulo Presupuesto"); r.bold = True; r.font.size = Pt(28); r.font.color.rgb = PRIMARY
s = doc.add_paragraph(); s.alignment = WD_ALIGN_PARAGRAPH.CENTER
r = s.add_run("Análisis completo y diseño"); r.font.size = Pt(16); r.font.color.rgb = DARK
s2 = doc.add_paragraph(); s2.alignment = WD_ALIGN_PARAGRAPH.CENTER
r = s2.add_run("Microservicio autónomo · seguridad integrada · superador del legacy · gestión simple")
r.italic = True; r.font.color.rgb = GREY
doc.add_paragraph()

# ── 1. Objetivo ──────────────────────────────────────────────────────
h1("1. Objetivo y principios de diseño")
para("Construir el módulo Presupuesto de Cheyenne: la administración del presupuesto municipal de "
     "gastos y recursos, base de todo el ciclo del gasto (capítulo 1 del circuito RAFAM). Reemplaza "
     "funcionalmente al vbPresupuesto del sistema legacy CONTABLE.")
table(["Principio", "Cómo se cumple"], [
    ["Autonomía total", "Microservicio propio (modules/presupuesto), contenedor propio, tablas propias (presupuesto_*), sin leer BD de otros módulos; toda integración por HTTP. Puede desplegarse y operar solo."],
    ["Seguridad integrada", "Autenticación contra el módulo seguridad (/auth/me) y permisos granulares presupuesto_* asignables por rol, incluyendo permisos por transición de workflow (patrón probado en Emisiones)."],
    ["Superador", "Libro mayor presupuestario (ledger) con saldos en tiempo real, workflow de estados con trazabilidad usuario/fecha, API de afectación para el ciclo del gasto, validaciones automáticas de balance, carga masiva y tablero de ejecución — nada de esto existe en el legacy."],
    ["Gestión simple", "1 pantalla central (partidas con saldos), asistente de modificación en 3 pasos, nomencladores mínimos, importación por planilla, sin formularios ceremoniales (F1-F11 se reducen a lo esencial)."],
], widths=[1.5, 5.4])

# ── 2. Análisis del legacy ───────────────────────────────────────────
h1("2. Análisis: qué hace el legacy y qué tomamos")
h2("2.1 Modelo del legacy (relevado del fuente)")
bullet("Partida de gastos = ejercicio × jurisdicción (juri) × estructura programática (espr) × objeto del gasto (godg) × fuente de financiamiento (fufi) → crédito anual (prga_PuestoAnual), con expediente asociado.")
bullet("Cálculo de recursos = ejercicio × jurisdicción × rubro (repr) → estimado / programado / ejecutado, con descripción metodológica.")
bullet("Modificaciones presupuestarias: comprobante con acto administrativo, fecha, observaciones e items (partida + importe); anulables; a gastos, a recursos, o ambos.")
bullet("Ejecución: cuotas de compromiso por jurisdicción / fuente / inciso; programación financiera del compromiso.")
bullet("Formulación ceremonial F1-F11 (política, metas, RRHH por cargo, proyectos, transferencias) y evaluación de desvíos: alto costo de carga, uso real bajo, reportes anuales.")
h2("2.2 Decisiones de alcance (simplificación)")
table(["Función legacy", "Decisión en Cheyenne", "Motivo"], [
    ["Partidas de gastos + saldos", "SÍ — núcleo (mejorado con ledger)", "Es la base del ciclo del gasto"],
    ["Modificaciones presupuestarias", "SÍ — con workflow de aprobación y validación de balance", "Operación diaria"],
    ["Cálculo de recursos por rubro", "SÍ — versión simple (estimado + modificaciones + percibido)", "Contraparte legal del presupuesto"],
    ["Cuotas de compromiso", "Fase 2 del módulo", "Útil, pero no bloquea el MVP"],
    ["Formularios F1-F11 (metas, RRHH, proyectos)", "NO en el MVP — etiquetas/clasificadores libres por partida", "Ceremonial; el 90% del valor está en las partidas"],
    ["Evaluación de desvíos", "NO — lo cubre el tablero de ejecución", "Reporte, no transacción"],
    ["Perspectiva de género y clasificadores ad-hoc", "Etiquetas libres por partida", "Flexible sin costo estructural"],
], widths=[2.2, 2.7, 2.0])

# ── 3. Arquitectura ──────────────────────────────────────────────────
h1("3. Arquitectura del microservicio")
bullet("modules/presupuesto/ — FastAPI + SQLAlchemy 2 + Pydantic v2, estructura estándar de Cheyenne (main, config, database, models, schemas, routers, services).")
bullet("Contenedor propio en docker-compose (puerto 8000 interno) + ruta Nginx /api/presupuesto/ (zona api).")
bullet("Tablas propias con prefijo presupuesto_ en la BD compartida; nunca lee tablas de otros módulos.")
bullet("Middleware compartido: auditoría (shared/audit_middleware → módulo auditoria), filtros/ordenamiento (shared/filters, sort por columna con default id).")
bullet("Autenticación: shared/base_module.create_auth_dependency → seguridad /auth/me en cada request.")
h2("3.1 Integraciones (todas HTTP, todas opcionales)")
table(["Con", "Dirección", "Para qué", "¿Obligatoria?"], [
    ["seguridad", "presupuesto → seguridad", "Validar token y permisos", "Sí (como todos)"],
    ["administracion", "presupuesto → administracion", "Importar jurisdicciones/cuentas si se desea (sino se cargan localmente)", "No"],
    ["contaduria (futuro)", "contaduria → presupuesto", "API de afectación: preventivo/compromiso/devengado/pagado contra la partida", "No (el módulo opera solo)"],
    ["auditoria", "presupuesto → auditoria", "Rastro de accesos (middleware no bloqueante)", "No (best-effort)"],
], widths=[1.3, 1.7, 2.9, 1.0])
note("Clave de autonomía: el módulo tiene TODOS sus nomencladores como tablas propias con CRUD. La "
     "importación desde administracion es una comodidad, no una dependencia.")

# ── 4. Modelo de datos ───────────────────────────────────────────────
h1("4. Modelo de datos")
h2("4.1 Nomencladores (CRUD simple, soft-delete, código jerárquico)")
table(["Tabla", "Campos clave", "Notas"], [
    ["presupuesto_jurisdicciones", "codigo, nombre, activo", "Importable desde administracion"],
    ["presupuesto_estructuras", "codigo (jerárquico p.ej. 01.02.03), nombre, tipo (programa/subprograma/actividad/obra), id_padre, activo", "Árbol programático"],
    ["presupuesto_objetos_gasto", "codigo (inciso.principal.parcial), nombre, id_padre, activo", "Clasificador del gasto"],
    ["presupuesto_fuentes", "codigo, nombre, origen (municipal/provincial/nacional/afectado), activo", "Fuente de financiamiento"],
    ["presupuesto_rubros", "codigo, nombre, id_padre, activo", "Recursos por rubro"],
], widths=[2.0, 3.3, 1.6])
h2("4.2 Núcleo")
table(["Tabla", "Campos clave", "Notas"], [
    ["presupuesto_ejercicios", "anio (PK lógico), estado (formulacion/aprobado/vigente/cerrado), fecha_aprobacion, acto_administrativo, usuario/fecha por transición", "Workflow del año fiscal"],
    ["presupuesto_partidas", "ejercicio, id_jurisdiccion, id_estructura, id_objeto_gasto, id_fuente, credito_inicial, descripcion, etiquetas (JSON), activo — UNIQUE(dimensiones+ejercicio)", "La partida presupuestaria"],
    ["presupuesto_movimientos", "id_partida, fecha, tipo (inicial/modificacion/preventivo/compromiso/devengado/pagado/liberacion), importe (con signo), referencia_tipo, referencia (nro doc), origen (módulo), id_usuario, usuario_nombre, observaciones", "LEDGER: fuente única de verdad de los saldos"],
    ["presupuesto_modificaciones", "numero (auto), fecha, tipo (ampliacion/reduccion/compensacion), acto_administrativo, estado (borrador/aprobada/anulada), observaciones, usuario alta/aprobación/anulación + fechas", "Cabecera"],
    ["presupuesto_modificacion_items", "id_modificacion, id_partida, importe (signo)", "Detalle; compensación exige Σ=0"],
    ["presupuesto_recursos", "ejercicio, id_jurisdiccion, id_rubro, estimado_inicial, metodologia, activo", "Cálculo de recursos"],
    ["presupuesto_recurso_movimientos", "id_recurso, tipo (inicial/modificacion/percibido), importe, referencia, usuario", "Ledger del recurso"],
    ["presupuesto_cuotas (fase 2)", "ejercicio, dimension (jurisdiccion/fuente/inciso), periodo (trimestre), importe_autorizado", "Periodificación del compromiso"],
], widths=[1.9, 3.6, 1.4])
h2("4.3 Saldos de partida (derivados del ledger, nunca almacenados)")
code("credito_vigente   = credito_inicial + Σ modificaciones aprobadas\n"
     "preventivo        = Σ mov. preventivo  - liberaciones      (reserva)\n"
     "comprometido      = Σ mov. compromiso  - liberaciones\n"
     "devengado         = Σ mov. devengado\n"
     "pagado            = Σ mov. pagado\n"
     "saldo_disponible  = credito_vigente - preventivo - comprometido (no devengado)\n")
note("Superador clave: el legacy calcula estos números en reportes batch; acá son un endpoint en "
     "tiempo real y cada número es auditable movimiento por movimiento.")

# ── 5. Workflows y permisos ──────────────────────────────────────────
h1("5. Workflows y seguridad")
h2("5.1 Workflow del ejercicio")
code("FORMULACION ── aprobar (acto administrativo) ──► APROBADO ── poner en vigencia ──► VIGENTE ── cerrar ──► CERRADO\n"
     "· En FORMULACION: partidas editables libremente (alta/edición/carga masiva).\n"
     "· Desde APROBADO: el crédito SOLO cambia por modificación presupuestaria aprobada.\n"
     "· Prórroga: crear ejercicio nuevo copiando partidas del anterior (apertura simplificada).")
h2("5.2 Workflow de la modificación presupuestaria")
code("BORRADOR ── aprobar ──► APROBADA (impacta el ledger) ── anular ──► ANULADA (movimiento inverso)\n"
     "· Compensación: la suma algebraica de los items debe ser 0.\n"
     "· Ampliación/Reducción: libre, con acto administrativo obligatorio.\n"
     "· Nada se borra: anular genera el contra-movimiento (trazabilidad total).")
h2("5.3 Permisos (seed en seguridad, asignables por rol)")
table(["Código", "Habilita"], [
    ["presupuesto_read / write / delete / admin", "Acceso estándar al módulo y sus nomencladores (menú, CRUD)"],
    ["presupuesto_aprobar_ejercicio", "Transiciones del ejercicio (aprobar, vigencia, cierre, prórroga)"],
    ["presupuesto_modificacion_aprobar", "Aprobar / anular modificaciones presupuestarias"],
    ["presupuesto_afectar", "Registrar afectaciones (preventivo/compromiso/devengado/pagado) vía API — lo usarán contaduría y usuarios habilitados"],
], widths=[2.6, 4.3])
bullet("Cada transición registra usuario (nombre + login) y fecha/hora, visible en el historial — mismo patrón que el workflow de Emisiones.")

# ── 6. API ───────────────────────────────────────────────────────────
h1("6. API del módulo")
h2("6.1 Nomencladores y ejercicios")
code("GET/POST/PUT/DELETE /jurisdicciones · /estructuras · /objetos-gasto · /fuentes · /rubros\n"
     "POST /jurisdicciones/importar        ← trae por HTTP las de administracion (opcional)\n"
     "GET  /ejercicios · POST /ejercicios\n"
     "POST /ejercicios/{anio}/aprobar · /vigencia · /cerrar · /prorrogar")
h2("6.2 Partidas y saldos")
code("GET  /partidas?ejercicio&filtros_multidimension&sort_by&sort_dir   → con TODOS los saldos\n"
     "POST /partidas · PUT /partidas/{id}      (solo en formulación)\n"
     "POST /partidas/importar                  (CSV/JSON masivo, valida nomencladores)\n"
     "GET  /partidas/{id}/movimientos          (ledger completo de la partida)\n"
     "GET  /resumen?ejercicio&por=inciso|jurisdiccion|fuente   (tablero de ejecución)\n"
     "GET  /export?ejercicio                   (CSV)")
h2("6.3 Modificaciones")
code("GET/POST /modificaciones · GET /modificaciones/{id}\n"
     "POST /modificaciones/{id}/aprobar · /anular      (permiso presupuesto_modificacion_aprobar)")
h2("6.4 API de afectación (contrato para el ciclo del gasto)")
code("POST /afectaciones\n"
     "  { tipo: preventivo|compromiso|devengado|pagado,\n"
     "    id_partida | dimensiones {ejercicio,jurisdiccion,estructura,objeto,fuente},\n"
     "    importe, referencia_tipo, referencia, observaciones }\n"
     "  → valida saldo disponible (configurable: bloquear o advertir) y crea el movimiento\n"
     "  → idempotente por (referencia_tipo, referencia, tipo)\n"
     "POST /afectaciones/{id}/liberar          (desafectación con contra-movimiento)\n"
     "GET  /afectaciones?filtros")
note("Este contrato es lo que hará que el futuro ciclo del gasto de Contaduría 'enchufe' directo: "
     "cada preventivo/compromiso/OP llamará a esta API, igual que Tesorería hoy impacta la deuda de "
     "Emisiones por HTTP.")
h2("6.5 Salud")
code("GET /health → {status, module: presupuesto}")

# ── 7. Frontend ──────────────────────────────────────────────────────
h1("7. Frontend (dentro del super-módulo Contaduría)")
bullet("Nuevo submenú 'Presupuesto' en el super-módulo Contaduría (deja de ser placeholder).")
bullet("Solapas agrupadas (GroupedTabBar): Ejercicio → [Partidas, Recursos, Tablero] · Modificaciones · Nomencladores → [Estructura, Objetos del gasto, Fuentes, Rubros, Jurisdicciones].")
h2("Pantalla central: Partidas")
bullet("Selector de ejercicio (con badge de estado) + tabla de partidas con columnas: dimensiones (mostradas como 'valor (código)'), crédito inicial, modificaciones, vigente, comprometido, devengado, pagado, DISPONIBLE (coloreado).")
bullet("Filtro por columna + ordenamiento (patrón CrudTab existente); click en partida → drawer con el ledger de movimientos.")
bullet("Botones: Nueva partida (solo formulación), Importar planilla, Exportar, Nueva modificación.")
h2("Asistente de modificación (3 pasos)")
bullet("1) Tipo (ampliación/reducción/compensación) + acto administrativo y fecha.")
bullet("2) Items: buscar partidas y cargar importes; balance en vivo (en compensación el asistente muestra Σ y no deja confirmar si ≠ 0).")
bullet("3) Confirmación → queda en borrador; quien tenga el permiso la aprueba (botón con historial usuario/fecha).")
h2("Tablero")
bullet("Totalizadores del ejercicio (vigente/comprometido/devengado/pagado/disponible) + barras de ejecución por inciso, jurisdicción y fuente + últimas modificaciones.")

# ── 8. Superador ─────────────────────────────────────────────────────
h1("8. Por qué es superador al legacy")
table(["Dolor del legacy", "Solución Cheyenne"], [
    ["Saldos calculados en reportes batch; sin visión en línea", "Ledger + saldos en tiempo real en la propia grilla de partidas"],
    ["Modificaciones sin flujo de aprobación (se cargan y listo)", "Workflow borrador→aprobada→anulada con permiso específico y trazabilidad usuario/fecha"],
    ["Sin API: cada módulo lee las tablas de otro", "API de afectación con contrato claro e idempotencia (HTTP-only)"],
    ["Compensaciones desbalanceadas posibles (control manual)", "Validación Σ=0 automática, en vivo en el asistente"],
    ["Carga partida por partida en formularios MDI", "Importación masiva por planilla + carga rápida en formulación"],
    ["Trazabilidad limitada (auditoría por BD espejo)", "Cada movimiento con origen, referencia, usuario y hora; nada se borra, todo se contra-asienta"],
    ["Seguridad por recursos de menú", "Permisos por acción de negocio (aprobar, afectar) asignables por rol"],
    ["54 clases y 11 formularios de formulación", "4 conceptos: partida, movimiento, modificación, recurso"],
], widths=[3.2, 3.7])

# ── 9. Plan de construcción ──────────────────────────────────────────
h1("9. Plan de construcción")
table(["Entrega", "Contenido", "Resultado verificable"], [
    ["E1 — Esqueleto", "Servicio FastAPI + compose + nginx + health + auth + permisos seed (migración)", "GET /api/presupuesto/health OK; permisos visibles en Seguridad"],
    ["E2 — Nomencladores + Ejercicios", "CRUDs + workflow del ejercicio + importar jurisdicciones", "Alta de ejercicio 2026 en formulación con nomencladores cargados"],
    ["E3 — Partidas + Ledger", "Partidas, carga masiva, movimientos, saldos derivados, export", "Grilla de partidas con disponible en tiempo real"],
    ["E4 — Modificaciones", "Cabecera+items, workflow aprobar/anular con validación de balance", "Compensación aprobada impacta el vigente y queda auditada"],
    ["E5 — Afectaciones + Tablero", "API de afectación idempotente + resumen/tablero + frontend completo en super-módulo Contaduría", "Preventivo de prueba descuenta disponible; tablero con % ejecución"],
], widths=[1.4, 3.4, 2.1])
para()
para("Cada entrega es desplegable por sí sola (mismo pipeline: build del contenedor presupuesto + "
     "frontend, migración SQL, verificación por API). El módulo no requiere que exista el ciclo del "
     "gasto para dar valor: presupuesto, modificaciones y consulta de ejecución funcionan solos.",
     italic=True, color=GREY)

out = os.path.join(HERE, "Cheyenne-Presupuesto-Analisis-y-Diseno.docx")
doc.save(out)
print("OK ->", out)
