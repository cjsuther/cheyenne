#!/usr/bin/env python3
"""Diagrama del ciclo completo de una emisión (16 pasos) y sus interacciones."""
import os
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
from matplotlib.patches import FancyBboxPatch, FancyArrowPatch

# tipo -> color (borde/relleno) y etiqueta
TIPO = {
    "ejecucion": ("#059669", "Ejecución"),
    "edicion":   ("#B45309", "Edición"),
    "aprobacion": ("#2563EB", "Aprobación"),
}

# (numero, nombre, tipo)  — tal cual pasos_workflow.PASOS
PASOS = [
    (1,  "Importar cálculo anterior", "ejecucion"),
    (2,  "Editar cálculo anterior", "edicion"),
    (3,  "Generar cálculo de prueba", "ejecucion"),
    (4,  "Aprobación del cálculo de prueba", "aprobacion"),
    (5,  "Generar cálculo general", "ejecucion"),
    (6,  "Aprobación del cálculo general", "aprobacion"),
    (7,  "Ordenamiento de prueba", "ejecucion"),
    (8,  "Impresión de los recibos de prueba", "ejecucion"),
    (9,  "Aprobación del ordenamiento de prueba", "aprobacion"),
    (10, "Aprobación de la impresión de prueba", "aprobacion"),
    (11, "Aprobación del código de barras", "aprobacion"),
    (12, "Ordenamiento general", "ejecucion"),
    (13, "Aprobación del ordenamiento general", "aprobacion"),
    (14, "Impresión de los recibos general", "ejecucion"),
    (15, "Aprobación de la impresión general", "aprobacion"),
    (16, "Generación de la cuenta corriente", "ejecucion"),
]

# fase por rango de pasos (para las bandas)
FASES = [
    ("Preparación", 1, 2, "#EEF2FF"),
    ("Cálculo de prueba", 3, 4, "#ECFDF5"),
    ("Cálculo general", 5, 6, "#ECFDF5"),
    ("Prueba de reparto e impresión", 7, 11, "#EFF6FF"),
    ("Reparto e impresión general", 12, 15, "#EFF6FF"),
    ("Cierre", 16, 16, "#FEF9C3"),
]

# interacciones externas por paso (texto a la derecha)
INTERACC = {
    3:  "← padrón de ingresos_publicos (base imponible)",
    5:  "← padrón de ingresos_publicos (todo el universo)",
    8:  "→ genera PDFs de recibos (volumen emisiones_pdfs)",
    14: "→ genera PDFs de recibos (volumen emisiones_pdfs)",
    16: "→ impacta la cuenta corriente / deuda del contribuyente",
}

N = len(PASOS)
row_h = 4.6
top = 92
left_x, box_w = 4, 52
fig, ax = plt.subplots(figsize=(12.6, 15), dpi=140)
ax.set_xlim(0, 100); ax.set_ylim(0, 100); ax.axis("off")

ax.text(50, 97.5, "Cheyenne — Ciclo de una emisión (16 pasos con permiso por paso)",
        ha="center", fontsize=15, fontweight="bold", color="#1F2937")

def y_of(numero):
    return top - (numero - 1) * row_h

# bandas de fase
for nombre, a, b, color in FASES:
    y_top = y_of(a) + row_h / 2 + 0.3
    y_bot = y_of(b) - row_h / 2 - 0.3
    ax.add_patch(FancyBboxPatch((left_x - 2.2, y_bot), box_w + 4.4, y_top - y_bot,
                                boxstyle="round,pad=0.2,rounding_size=0.8",
                                fc=color, ec="#CBD5E1", lw=0.8, zorder=0))
    ax.text(left_x - 1.2, (y_top + y_bot) / 2, nombre, ha="left", va="center",
            rotation=90, fontsize=8.5, color="#475569", fontweight="bold")

# pasos
for numero, nombre, tipo in PASOS:
    y = y_of(numero)
    color, _ = TIPO[tipo]
    ax.add_patch(FancyBboxPatch((left_x + 3, y - row_h / 2 + 0.5), box_w - 3, row_h - 1.2,
                                boxstyle="round,pad=0.2,rounding_size=0.7",
                                fc="white", ec=color, lw=1.6, zorder=3))
    # badge número
    ax.add_patch(plt.Circle((left_x + 6.5, y), 1.5, color=color, zorder=4))
    ax.text(left_x + 6.5, y, str(numero), ha="center", va="center", color="white",
            fontsize=9, fontweight="bold", zorder=5)
    ax.text(left_x + 10, y, nombre, ha="left", va="center", fontsize=9.2,
            color="#1F2937", zorder=5)
    # flecha al siguiente
    if numero < N:
        ax.add_patch(FancyArrowPatch((left_x + 6.5, y - row_h / 2 + 0.5),
                                     (left_x + 6.5, y_of(numero + 1) + row_h / 2 - 0.5),
                                     arrowstyle="-|>", mutation_scale=11, color="#94A3B8",
                                     lw=1.3, zorder=2))
    # interacción externa
    if numero in INTERACC:
        ax.annotate(INTERACC[numero], xy=(left_x + box_w + 1, y),
                    xytext=(left_x + box_w + 3, y), ha="left", va="center",
                    fontsize=8.3, color="#0F766E" if "←" in INTERACC[numero] or "→ genera" in INTERACC[numero] else "#92400E")
        ax.add_patch(FancyArrowPatch((left_x + box_w, y), (left_x + box_w + 2.6, y),
                                     arrowstyle="-", color="#CBD5E1", lw=1.0, zorder=1))

# leyenda
ly = 6.5
ax.text(left_x + 3, ly + 3.2, "Referencias:", fontsize=9.5, fontweight="bold", color="#1F2937")
for i, (tipo, (color, label)) in enumerate(TIPO.items()):
    x = left_x + 3 + i * 15
    ax.add_patch(FancyBboxPatch((x, ly), 2.4, 2.0, boxstyle="round,pad=0.1,rounding_size=0.4",
                                fc="white", ec=color, lw=1.6))
    ax.text(x + 3.2, ly + 1, label, fontsize=8.6, va="center", color="#1F2937")

nota = ("Cada paso exige su propio permiso (emisiones_pasoNN_...), verificado contra seguridad (/auth/me) "
        "y asignable por rol desde el módulo de permisos. El historial registra usuario y fecha/hora por paso.")
ax.text(50, 1.5, nota, ha="center", va="center", fontsize=8.2, color="#475569", style="italic", wrap=True)

out = os.path.join(os.path.dirname(__file__), "flujo-emision.png")
plt.savefig(out, bbox_inches="tight", facecolor="white")
print("OK ->", out)
