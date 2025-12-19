# 🚀 Laramie Databases – Data Scripts

Este repositorio está destinado exclusivamente a almacenar scripts SQL que modifican datos en nuestras bases de datos, sin afectar la estructura (esquemas, tablas, índices, etc.).

## 🗂 Estructura del repositorio

* Cada carpeta corresponde a un cliente diferente, aunque también se incluye una general con datos/scripts que aplicarán a todos.
* Dentro de cada carpeta se encuentran scripts organizados por fecha, funcionalidad o incidente relacionado, según corresponda.

## ✅ Objetivos
* Mantener un historial claro y versionado de las modificaciones de datos realizadas manualmente o como parte de procesos especiales.
* Permitir auditoría y trazabilidad de cambios en datos críticos.
* Evitar confusiones con scripts de migración de esquema (que viven en otro repositorio).

## 🚫 Qué no incluye este repositorio
* Scripts que crean o modifican estructuras de base de datos (tablas, columnas, índices, constraints, etc.).
* Migraciones automáticas generadas por ORMs o herramientas de versionado de schema.

## 📌 Recomendaciones
* Usar nombres descriptivos para los archivos (ej. 2024-09-20-ajuste-mora-cliente-x.sql).
* Incluir comentarios dentro del script indicando el motivo del cambio y quién lo ejecutó.
* Validar los scripts en entorno de testing antes de aplicarlos en producción.
