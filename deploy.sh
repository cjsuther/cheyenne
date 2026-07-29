#!/usr/bin/env bash
#
# deploy.sh — Despliegue de Cheyenne en el servidor.
#
# Clona (o actualiza) el repositorio, reconstruye las imágenes con los
# últimos cambios, levanta toda la plataforma con Docker Compose y siembra
# los datos iniciales de forma idempotente.
#
# Uso:
#   ./deploy.sh
#
# Variables de entorno opcionales:
#   REPO_URL   URL del repositorio        (default: https://github.com/cjsuther/cheyenne.git)
#   BRANCH     Rama a desplegar           (default: main)
#   APP_DIR    Directorio de despliegue   (default: $HOME/cheyenne)
#
set -euo pipefail

# ── Configuración ─────────────────────────────────────────────────────
REPO_URL="${REPO_URL:-https://github.com/cjsuther/cheyenne.git}"
BRANCH="${BRANCH:-main}"
APP_DIR="${APP_DIR:-$HOME/cheyenne}"

# Módulos con datos iniciales (seguridad debe ir primero: crea roles/usuario admin)
SEED_MODULES=(seguridad administracion auditoria comunicacion ingresos_publicos tesoreria)

# ── Utilidades de log ─────────────────────────────────────────────────
log()  { printf '\033[1;34m[deploy]\033[0m %s\n' "$*"; }
warn() { printf '\033[1;33m[aviso ]\033[0m %s\n' "$*"; }
err()  { printf '\033[1;31m[error ]\033[0m %s\n' "$*" >&2; }

# ── Pre-requisitos ────────────────────────────────────────────────────
command -v git >/dev/null 2>&1 || { err "git no está instalado."; exit 1; }

if docker compose version >/dev/null 2>&1; then
  DC="docker compose"
elif command -v docker-compose >/dev/null 2>&1; then
  DC="docker-compose"
else
  err "No se encontró 'docker compose' (v2) ni 'docker-compose' (v1)."
  exit 1
fi
log "Usando: $DC"

# ── 1. Obtener / actualizar el código ─────────────────────────────────
if [ -d "$APP_DIR/.git" ]; then
  log "Actualizando repositorio en $APP_DIR (rama $BRANCH)"
  git -C "$APP_DIR" fetch --all --prune
  git -C "$APP_DIR" checkout "$BRANCH"
  git -C "$APP_DIR" reset --hard "origin/$BRANCH"
else
  log "Clonando $REPO_URL en $APP_DIR"
  git clone --branch "$BRANCH" "$REPO_URL" "$APP_DIR"
fi
cd "$APP_DIR"

# ── 2. Archivo .env ───────────────────────────────────────────────────
if [ ! -f .env ]; then
  log "No existe .env; creándolo a partir de .env.example"
  cp .env.example .env
  # SECRET_KEY aleatorio para JWT
  if command -v openssl >/dev/null 2>&1; then
    SECRET=$(openssl rand -hex 32)
    sed -i "s|^SECRET_KEY=.*|SECRET_KEY=${SECRET}|" .env
    log "SECRET_KEY generado automáticamente."
  else
    warn "openssl no disponible: editá SECRET_KEY en .env manualmente."
  fi
  warn "Revisá .env y ajustá credenciales de BD y SMTP antes de usar en producción."
else
  log ".env ya existe; se respeta la configuración actual."
fi

# ── 3. Reconstruir imágenes y levantar servicios ──────────────────────
log "Construyendo imágenes con los últimos cambios..."
$DC build --pull

log "Levantando servicios..."
$DC up -d --remove-orphans

# ── 3.5. Migraciones de esquema (aplicador con tracking) ──────────────
# Espera a que Postgres esté listo y aplica las migraciones pendientes en orden.
log "Aplicando migraciones pendientes..."
for _ in $(seq 1 30); do
  $DC exec -T postgres pg_isready -U "${POSTGRES_USER:-cheyenne}" >/dev/null 2>&1 && break
  sleep 2
done
if bash scripts/migrate.sh; then
  log "Migraciones al día."
else
  warn "El aplicador de migraciones devolvió error; revisar scripts/migrate.sh status."
fi

# ── 4. Sembrar datos iniciales ────────────────────────────────────────
# Espera a que un servicio responda /health antes de ejecutar su seed.
wait_health() {
  local svc="$1" tries="${2:-60}"
  for _ in $(seq 1 "$tries"); do
    if $DC exec -T "$svc" python -c \
        "import urllib.request; urllib.request.urlopen('http://localhost:8000/health', timeout=2)" \
        >/dev/null 2>&1; then
      return 0
    fi
    sleep 2
  done
  return 1
}

for svc in "${SEED_MODULES[@]}"; do
  log "Esperando a '$svc'..."
  if wait_health "$svc"; then
    log "Sembrando datos de '$svc'..."
    if $DC exec -T "$svc" python seed.py; then
      log "Seed de '$svc' OK."
    else
      warn "El seed de '$svc' devolvió error (puede que los datos ya existan)."
    fi
  else
    warn "'$svc' no respondió a tiempo; se omite su seed."
  fi
done

# ── 5. Estado final ───────────────────────────────────────────────────
log "Estado de los contenedores:"
$DC ps

echo
log "Despliegue finalizado."
log "Health check:  curl http://localhost/health"
log "API seguridad: curl http://localhost/api/seguridad/health"
