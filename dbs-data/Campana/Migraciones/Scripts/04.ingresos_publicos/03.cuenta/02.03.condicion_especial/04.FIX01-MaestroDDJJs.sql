-- 1. Obtener todos los contribuyentes desde Campana.

WITH MAP_LEGAJOS AS (
    SELECT DISTINCT r.IdContribuyenteLegajo, r.Legajo, r.Sublegajo
    FROM Hacienda.dbo.AgentesDeRetencion r
    UNION
    SELECT DISTINCT e.IdContribuyenteLegajo, e.Legajo, e.Sublegajo
    FROM Hacienda.dbo.AgentesDeEdenProducido e
    UNION
    SELECT DISTINCT cl.IdContribuyenteLegajo, cl.Legajo, cl.Sublegajo
    FROM Hacienda.dbo.ContribuyenteLegajos cl
),
     MA_BASE AS (
         SELECT
             ml.Legajo,
             ml.Sublegajo,
             ma.ComercializacionEnvasesNR,
             ma.GestionResiduosGrandesGeneradores
         FROM Hacienda.dbo.AgentesDeMedioAmbiente ma
                  LEFT JOIN MAP_LEGAJOS ml
                            ON ml.IdContribuyenteLegajo = ma.IdContribuyenteLegajo
         WHERE ISNULL(ma.Activo, 0) = 1
     )
SELECT DISTINCT
    CAST(Legajo AS varchar(20)) + RIGHT('00' + CAST(Sublegajo AS varchar(10)), 2) AS numero_cuenta,
    tipo_condicion_especial
FROM (
         /* Combustibles -> DDJJ_MV (sin campo Activo, tomamos todos) */
         SELECT c.Legajo, c.Sublegajo, CAST('DDJJ_MV' AS varchar(50)) AS tipo_condicion_especial
         FROM Hacienda.dbo.AgentesDeCombustibles c

         UNION ALL
         /* Edén Producido -> DDJJ_TAP (solo activos) */
         SELECT e.Legajo, e.Sublegajo, 'DDJJ_TAP'
         FROM Hacienda.dbo.AgentesDeEdenProducido e
         WHERE ISNULL(e.Activo, 0) = 1

         UNION ALL
         /* Retención -> AGENTE_RETENCION (solo activos) */
         SELECT r.Legajo, r.Sublegajo, 'AGENTE_RETENCION'
         FROM Hacienda.dbo.AgentesDeRetencion r
         WHERE ISNULL(r.Activo, 0) = 1

         UNION ALL
         /* Explotación de Canteras -> DDJJ_EC (solo activos) */
         SELECT x.Legajo, x.Sublegajo, 'DDJJ_EC'
         FROM Hacienda.dbo.AgentesExplotacionCanteras x
         WHERE ISNULL(x.Activo, 0) = 1

         UNION ALL
         /* Medio Ambiente -> DDJJ_ENR (si ComercializacionEnvasesNR = 1 y mapeado) */
         SELECT m.Legajo, m.Sublegajo, 'DDJJ_ENR'
         FROM MA_BASE m
         WHERE ISNULL(m.ComercializacionEnvasesNR, 0) = 1
           AND m.Legajo IS NOT NULL

         UNION ALL
         /* Medio Ambiente -> DDJJ_GRGG (si GestionResiduosGrandesGeneradores = 1 y mapeado) */
         SELECT m.Legajo, m.Sublegajo, 'DDJJ_GRGG'
         FROM MA_BASE m
         WHERE ISNULL(m.GestionResiduosGrandesGeneradores, 0) = 1
           AND m.Legajo IS NOT NULL
     ) S
ORDER BY numero_cuenta, tipo_condicion_especial;

-- 2. Crear tabla e insertar el csv exportado de la query anterior.

USE LARAMIE_CAMPANA;
GO

IF OBJECT_ID('tempdb..#maestro_contribuyentes_ddjj') IS NOT NULL
    DROP TABLE maestro_contribuyentes_ddjj;

CREATE TABLE maestro_contribuyentes_ddjj
(
    numero_cuenta          varchar(20) NOT NULL,
    tipo_condicion_especial varchar(50) NOT NULL
);
GO

-- 3. Conversión y exportación para meter en condicion_especial de postgres.

USE LARAMIE_CAMPANA;
GO

DECLARE @codigo_tipo_tributo INT = 2;
DECLARE @id_tipo_tributo INT;
DECLARE @fecha_desde_base DATETIME2(0) = '2018-01-01 00:00:00';

SELECT @id_tipo_tributo = tri.id
FROM LARAMIE_CAMPANA.dbo.lista_ingresos_publicos tri
WHERE tri.tipo = 'TipoTributo'
  AND tri.codigo = @codigo_tipo_tributo;

IF @id_tipo_tributo IS NULL
    BEGIN
        RAISERROR('No se encontró TipoTributo CODIGO=%d en MAJOR_CAMPANA.dbo.LISTA.', 16, 1, @codigo_tipo_tributo);
        RETURN;
    END;

/* === SELECT para exportar a CSV (PostgreSQL) === */
WITH BASE AS (
    SELECT DISTINCT
        cue.id  AS id_cuenta,
        tce.id  AS id_tipo_condicion_especial,
        @fecha_desde_base AS fecha_desde,
        CAST(NULL AS date) AS fecha_hasta
    FROM dbo.maestro_contribuyentes_ddjj a
             INNER JOIN dbo.cuenta cue
                        ON RIGHT(REPLICATE('0', 30) + a.numero_cuenta, LEN(cue.numero_cuenta)) = cue.numero_cuenta
                            AND cue.id_tipo_tributo = @id_tipo_tributo
             INNER JOIN dbo.tipo_condicion_especial tce
                        ON tce.codigo = a.tipo_condicion_especial
)
SELECT
    id_cuenta,
    id_tipo_condicion_especial,
    fecha_desde,
    fecha_hasta
FROM BASE
ORDER BY id_cuenta, id_tipo_condicion_especial;
GO

