-- Migración 002 — Buscador de contribuyentes (Vista 360)
-- ----------------------------------------------------------------------------
-- Habilita la extensión `unaccent` de PostgreSQL para que la búsqueda de
-- contribuyentes por nombre sea insensible a acentos (ej: 'garcia' encuentra
-- 'García'). Hay que correrla en cada entorno tras desplegar la Vista 360.
-- Idempotente.
--
-- Uso:
--   docker compose exec -T postgres sh -c 'psql -U "$POSTGRES_USER" -d "$POSTGRES_DB"' \
--     < migrations/002_busqueda_contribuyente.sql
-- ----------------------------------------------------------------------------

CREATE EXTENSION IF NOT EXISTS unaccent;
