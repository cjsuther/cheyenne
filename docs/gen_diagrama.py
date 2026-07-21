#!/usr/bin/env python3
"""Diagrama de arquitectura de Cheyenne (PNG para embeber en el Word)."""
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
from matplotlib.patches import FancyBboxPatch, FancyArrowPatch

fig, ax = plt.subplots(figsize=(12.2, 8.4), dpi=150)
ax.set_xlim(0, 100); ax.set_ylim(0, 100); ax.axis("off")

C = {
    "front": "#4F46E5", "infra": "#0F172A", "seg": "#DC2626",
    "rentas": "#059669", "cobr": "#2563EB", "sop": "#64748B",
    "data": "#B45309", "muted": "#94A3B8",
}


def box(x, y, w, h, text, color, fs=10, tcolor="white", bold=True):
    ax.add_patch(FancyBboxPatch((x, y), w, h, boxstyle="round,pad=0.4,rounding_size=1.2",
                                fc=color, ec="white", lw=1.2, zorder=3))
    ax.text(x + w / 2, y + h / 2, text, ha="center", va="center", color=tcolor,
            fontsize=fs, fontweight="bold" if bold else "normal", zorder=4)


def arrow(x1, y1, x2, y2, color="#334155", style="-|>", lw=1.8, ls="-"):
    ax.add_patch(FancyArrowPatch((x1, y1), (x2, y2), arrowstyle=style, mutation_scale=16,
                                 color=color, lw=lw, linestyle=ls, zorder=2))


# ── Capa presentación ────────────────────────────────────────────────
box(33, 90, 34, 7, "Frontend  ·  React SPA (Vite + Tailwind)", C["front"], 12)
box(20, 79, 60, 6.5, "Nginx  ·  reverse proxy   /api/{módulo}/   ·   rate limiting  ·  TLS", C["infra"], 11)
arrow(50, 90, 50, 85.5)

# ── Módulos de negocio ───────────────────────────────────────────────
# Núcleo Rentas
box(6, 60, 20, 8, "ingresos_publicos\n(padrón, tasas, planes)", C["rentas"], 9.5)
box(30, 60, 18, 8, "emisiones\n(motor de cálculo)", C["rentas"], 9.5)
box(52, 60, 15, 8, "tesorería\n(recaudación)", C["cobr"], 9.5)
box(71, 60, 23, 8, "seguridad\n(auth / RBAC)", C["seg"], 9.5)

# Soporte / maestros
sop = [("administración", 6), ("comunicación", 24.5), ("auditoría", 43), ("importación", 58),
       ("interface", 73), ("wav", 85.5)]
for name, x in sop:
    w = 17 if name in ("administración", "comunicación", "importación") else (13 if name == "interface" else (9.5 if name == "wav" else 14))
    box(x, 48, w, 6.5, name, C["sop"], 9)
box(6, 48, 0, 0, "", C["sop"])  # noop keep spacing

# Nginx -> módulos (banda)
for cx in (16, 39, 59.5, 82):
    arrow(50 if cx == 59.5 else cx, 79, cx, 68.2, color=C["muted"], lw=1.3)

# emisiones -> ingresos_publicos (padrón)
arrow(30, 63.5, 26.2, 63.5, color=C["rentas"], lw=2.4)
ax.text(28, 65.6, "padrón\n(HTTP)", ha="center", va="bottom", fontsize=7.5, color=C["rentas"])

# todos -> seguridad (auth) — representado con nota
arrow(60, 62, 71, 63, color=C["seg"], lw=1.6, ls="--")
ax.text(65, 57.5, "todos los módulos validan el token\ncontra seguridad  ( /auth/me )",
        ha="center", va="top", fontsize=7.8, color=C["seg"], style="italic")

# ── Capa datos ───────────────────────────────────────────────────────
box(14, 30, 46, 8, "PostgreSQL 16\nun esquema/prefijo por módulo  ·  sin acceso cruzado a tablas", C["data"], 10)
box(66, 30, 20, 8, "Redis\n(workers / cache)", C["data"], 10)
for cx in (24, 39, 54, 79):
    arrow(cx, 48, cx, 38.4, color=C["muted"], lw=1.1, ls=":")
ax.text(50, 40.7, "cada módulo persiste SOLO en sus tablas", ha="center", fontsize=8, color="#475569", style="italic")

# ── Notas ────────────────────────────────────────────────────────────
ax.add_patch(FancyBboxPatch((6, 8), 88, 15, boxstyle="round,pad=0.5,rounding_size=1",
                            fc="#F1F5F9", ec="#CBD5E1", lw=1, zorder=1))
notas = (
    "Reglas de arquitectura:\n"
    "• Comunicación entre módulos: SOLO HTTP (nunca leen la base de otro módulo).\n"
    "• seguridad es la única autoridad de autenticación (JWT + RBAC).\n"
    "• Única llamada de negocio entre módulos hoy: emisiones → ingresos_publicos (carga del padrón).\n"
    "• Auditoría: el middleware registra a LOGS (stdout); NO persiste en el módulo auditoría.\n"
    "• Frontend orquesta cross-módulo (ej. Vista 360 = ingresos_publicos + emisiones)."
)
ax.text(9, 20.5, notas, ha="left", va="top", fontsize=9.2, color="#1F2937")

ax.text(50, 98.5, "Cheyenne — Arquitectura de la solución", ha="center", fontsize=15, fontweight="bold", color="#1F2937")

import os
out = os.path.join(os.path.dirname(__file__), "arquitectura.png")
plt.savefig(out, bbox_inches="tight", facecolor="white")
print("OK ->", out)
