#!/usr/bin/env bash
#
# deploy-remote.sh — Despliega Cheyenne en un servidor remoto por SSH.
#
# Copia deploy.sh al servidor y lo ejecuta allá. Desde tu máquina:
#
#   ./deploy-remote.sh usuario@servidor
#
# Variables de entorno opcionales (se reenvían al servidor):
#   SSH_PORT   Puerto SSH                 (default: 22)
#   SSH_KEY    Ruta a la clave privada    (default: la que use ssh por defecto)
#   APP_DIR    Directorio de despliegue   (default: $HOME/cheyenne en el server)
#   BRANCH     Rama a desplegar           (default: main)
#   REPO_URL   URL del repositorio        (default: el del deploy.sh)
#
set -euo pipefail

TARGET="${1:-}"
if [ -z "$TARGET" ]; then
  echo "Uso: $0 usuario@servidor" >&2
  exit 1
fi

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
LOCAL_SCRIPT="$SCRIPT_DIR/deploy.sh"
[ -f "$LOCAL_SCRIPT" ] || { echo "No se encontró $LOCAL_SCRIPT" >&2; exit 1; }

# Opciones SSH/SCP
SSH_PORT="${SSH_PORT:-22}"
SSH_OPTS=(-p "$SSH_PORT")
SCP_OPTS=(-P "$SSH_PORT")
if [ -n "${SSH_KEY:-}" ]; then
  SSH_OPTS+=(-i "$SSH_KEY")
  SCP_OPTS+=(-i "$SSH_KEY")
fi

# Variables a reenviar al servidor (solo las definidas)
REMOTE_ENV=""
for var in APP_DIR BRANCH REPO_URL; do
  if [ -n "${!var:-}" ]; then
    REMOTE_ENV+="${var}=$(printf '%q' "${!var}") "
  fi
done

echo "[remote] Copiando deploy.sh a $TARGET ..."
scp "${SCP_OPTS[@]}" "$LOCAL_SCRIPT" "$TARGET:~/deploy.sh"

echo "[remote] Ejecutando despliegue en $TARGET ..."
ssh "${SSH_OPTS[@]}" "$TARGET" "chmod +x ~/deploy.sh && ${REMOTE_ENV}bash ~/deploy.sh"

echo "[remote] Despliegue remoto finalizado."
