-- Query para armar DDJJ_EXPORT_HACIENDA.tsv

WITH PartidasNumeradas AS (
    SELECT
        p.IdDDJJEdenProducido,
        RIGHT(
            REPLICATE('0', 20) +
            CAST(vw.Legajo AS VARCHAR) +
            RIGHT('00' + CAST(CAST(vw.Sublegajo AS INT) AS VARCHAR), 2),
            20
        ) AS NUMERO_CUENTA,
        p.Periodo AS PERIODO,
        p.Cuota AS MES,
        'TAP' AS COD_CLASE,
        p.FechaAlta AS FECHA_ALTA,
        ROW_NUMBER() OVER (PARTITION BY p.IdDDJJEdenProducido ORDER BY p.Id) AS rn,
        CAST(p.Partida AS VARCHAR) AS PARTIDA,
        CAST(p.MetrosProductivos AS VARCHAR) AS MetrosProductivos,
        CAST(p.BaseImponible AS VARCHAR) AS BaseImponible
    FROM DDJJEdenProducidoPartidas p
    JOIN VWContribuyentesLegajo vw ON p.IdContribuyenteLegajo = vw.IdContribuyenteLegajo
)

-- MANTENIMIENTO VIAL
SELECT
    '2' AS COD_TRIBUTO,
    RIGHT(
        REPLICATE('0', 20) +
        CAST(vw.Legajo AS VARCHAR) +
        RIGHT('00' + CAST(CAST(vw.Sublegajo AS INT) AS VARCHAR), 2),
        20
    ) AS NUMERO_CUENTA,
    '' AS COD_RUBRO,
    dv.Año AS PERIODO,
    dv.Mes AS MES,
    'MANT_VIAL' AS COD_CLASE,
    'GASOIL_GRADO_2' AS COD_TIPO,
    dv.Secuencia AS NUMERO,
    '4' AS COD_ORIGEN_DECLARACION_JURADA,
    CAST(dv.Gasoilgrado2 AS VARCHAR) AS VALOR,
    dv.IdDDJJMantenimientoVial AS RESOLUCION,
    dv.FechaAlta AS FECHA_ALTA,
    '' AS FECHA_BAJA,
    dv.FechaAlta AS FECHA_DECLARACION
FROM DDJJMantenimientoVial dv
JOIN VWContribuyentesLegajo vw ON dv.IdContribuyenteLegajo = vw.IdContribuyenteLegajo

UNION ALL

SELECT
    '2', RIGHT( REPLICATE('0', 20) + CAST(vw.Legajo AS VARCHAR) + RIGHT('00' + CAST(CAST(vw.Sublegajo AS INT) AS VARCHAR), 2), 20) AS NUMERO_CUENTA, '', dv.Año, dv.Mes, 'MANT_VIAL', 'GASOIL_GRADO_3', dv.Secuencia, '4', CAST(dv.Gasoilgrado3 AS VARCHAR), dv.IdDDJJMantenimientoVial, dv.FechaAlta, '', dv.FechaAlta
FROM DDJJMantenimientoVial dv
JOIN VWContribuyentesLegajo vw ON dv.IdContribuyenteLegajo = vw.IdContribuyenteLegajo

UNION ALL

SELECT
    '2', RIGHT( REPLICATE('0', 20) + CAST(vw.Legajo AS VARCHAR) + RIGHT('00' + CAST(CAST(vw.Sublegajo AS INT) AS VARCHAR), 2), 20) AS NUMERO_CUENTA, '', dv.Año, dv.Mes, 'MANT_VIAL', 'NAFTA_SUPER', dv.Secuencia, '4', CAST(dv.NaftaSuper AS VARCHAR), dv.IdDDJJMantenimientoVial, dv.FechaAlta, '', dv.FechaAlta
FROM DDJJMantenimientoVial dv
JOIN VWContribuyentesLegajo vw ON dv.IdContribuyenteLegajo = vw.IdContribuyenteLegajo

UNION ALL

SELECT
    '2', RIGHT( REPLICATE('0', 20) + CAST(vw.Legajo AS VARCHAR) + RIGHT('00' + CAST(CAST(vw.Sublegajo AS INT) AS VARCHAR), 2), 20) AS NUMERO_CUENTA, '', dv.Año, dv.Mes, 'MANT_VIAL', 'NAFTA_PREMIUM', dv.Secuencia, '4', CAST(dv.NaftaPremium AS VARCHAR), dv.IdDDJJMantenimientoVial, dv.FechaAlta, '', dv.FechaAlta
FROM DDJJMantenimientoVial dv
JOIN VWContribuyentesLegajo vw ON dv.IdContribuyenteLegajo = vw.IdContribuyenteLegajo

UNION ALL

SELECT
    '2', RIGHT( REPLICATE('0', 20) + CAST(vw.Legajo AS VARCHAR) + RIGHT('00' + CAST(CAST(vw.Sublegajo AS INT) AS VARCHAR), 2), 20) AS NUMERO_CUENTA, '', dv.Año, dv.Mes, 'MANT_VIAL', 'OTROS', dv.Secuencia, '4', CAST(dv.OtrosCombustibles AS VARCHAR), dv.IdDDJJMantenimientoVial, dv.FechaAlta, '', dv.FechaAlta
FROM DDJJMantenimientoVial dv
JOIN VWContribuyentesLegajo vw ON dv.IdContribuyenteLegajo = vw.IdContribuyenteLegajo

-- EXPLOTACIÓN CANTERAS

UNION ALL

SELECT
    '2', RIGHT( REPLICATE('0', 20) + CAST(vw.Legajo AS VARCHAR) + RIGHT('00' + CAST(CAST(vw.Sublegajo AS INT) AS VARCHAR), 2), 20) AS NUMERO_CUENTA, '', ec.Periodo, ec.Cuota, 'EXPLOTACION_CANTERAS', 'M3', ec.Secuencia, '4', CAST(ec.M3 AS VARCHAR), ec.IdDDJJExplotacionCanteras, ec.FechaAlta, '', ec.FechaAlta
FROM DDJJExplotacionCanteras ec
JOIN VWContribuyentesLegajo vw ON ec.IdContribuyenteLegajo = vw.IdContribuyenteLegajo

-- ENVASES_NR

UNION ALL

SELECT
    '2', RIGHT( REPLICATE('0', 20) + CAST(vw.Legajo AS VARCHAR) + RIGHT('00' + CAST(CAST(vw.Sublegajo AS INT) AS VARCHAR), 2), 20) AS NUMERO_CUENTA, '', e.Periodo, e.Cuota, 'ENVASES_NR', 'PET', e.Secuencia, '4', CAST(e.PET AS VARCHAR), e.IdDDJJComercializacionEnvasesNR, e.FechaAlta, '', e.FechaAlta
FROM DDJJComercializacionEnvasesNR e
JOIN VWContribuyentesLegajo vw ON e.IdContribuyenteLegajo = vw.IdContribuyenteLegajo

UNION ALL

SELECT
    '2', RIGHT( REPLICATE('0', 20) + CAST(vw.Legajo AS VARCHAR) + RIGHT('00' + CAST(CAST(vw.Sublegajo AS INT) AS VARCHAR), 2), 20) AS NUMERO_CUENTA, '', e.Periodo, e.Cuota, 'ENVASES_NR', 'MULTICAPA', e.Secuencia, '4', CAST(e.MultiCapa AS VARCHAR), e.IdDDJJComercializacionEnvasesNR, e.FechaAlta, '', e.FechaAlta
FROM DDJJComercializacionEnvasesNR e
JOIN VWContribuyentesLegajo vw ON e.IdContribuyenteLegajo = vw.IdContribuyenteLegajo

UNION ALL

SELECT
    '2', RIGHT( REPLICATE('0', 20) + CAST(vw.Legajo AS VARCHAR) + RIGHT('00' + CAST(CAST(vw.Sublegajo AS INT) AS VARCHAR), 2), 20) AS NUMERO_CUENTA, '', e.Periodo, e.Cuota, 'ENVASES_NR', 'LATA_BEBIDA', e.Secuencia, '4', CAST(e.LataBebida AS VARCHAR), e.IdDDJJComercializacionEnvasesNR, e.FechaAlta, '', e.FechaAlta
FROM DDJJComercializacionEnvasesNR e
JOIN VWContribuyentesLegajo vw ON e.IdContribuyenteLegajo = vw.IdContribuyenteLegajo

UNION ALL

SELECT
    '2', RIGHT( REPLICATE('0', 20) + CAST(vw.Legajo AS VARCHAR) + RIGHT('00' + CAST(CAST(vw.Sublegajo AS INT) AS VARCHAR), 2), 20) AS NUMERO_CUENTA, '', e.Periodo, e.Cuota, 'ENVASES_NR', 'AEROSOL', e.Secuencia, '4', CAST(e.Aerosol AS VARCHAR), e.IdDDJJComercializacionEnvasesNR, e.FechaAlta, '', e.FechaAlta
FROM DDJJComercializacionEnvasesNR e
JOIN VWContribuyentesLegajo vw ON e.IdContribuyenteLegajo = vw.IdContribuyenteLegajo

UNION ALL

SELECT
    '2', RIGHT( REPLICATE('0', 20) + CAST(vw.Legajo AS VARCHAR) + RIGHT('00' + CAST(CAST(vw.Sublegajo AS INT) AS VARCHAR), 2), 20) AS NUMERO_CUENTA, '', e.Periodo, e.Cuota, 'ENVASES_NR', 'PAÑAL_DESCARTABLE', e.Secuencia, '4', CAST(e.PañalDescartable AS VARCHAR), e.IdDDJJComercializacionEnvasesNR, e.FechaAlta, '', e.FechaAlta
FROM DDJJComercializacionEnvasesNR e
JOIN VWContribuyentesLegajo vw ON e.IdContribuyenteLegajo = vw.IdContribuyenteLegajo

-- TISH
UNION ALL

-- TISH - MONTO_MENSUAL
SELECT
    '2',
    RIGHT(
        REPLICATE('0', 20) +
        CASE
            WHEN DJ.IdContribuyenteLegajo IS NOT NULL
                THEN CAST(vw.Legajo AS VARCHAR) +
                     RIGHT('00' + CAST(CAST(vw.Sublegajo AS INT) AS VARCHAR), 2)
            ELSE CAST(DJ.Legajo AS VARCHAR) +
                     RIGHT('00' + CAST(CAST(DJ.Sublegajo AS INT) AS VARCHAR), 2)
        END,
        20
    ) AS NUMERO_CUENTA,
    DJR.Codigo, DJ.Año, DJ.Mes, 'TISH', 'MONTO_MENSUAL', DJ.Secuencia, '4',
    CAST(DJR.MontoMensual AS VARCHAR), DJR.IdDeclaracionJurada, DJR.FechaAlta, '', DJR.FechaAlta
FROM DeclaracionJuradaRubros DJR
JOIN DeclaracionesJuradas DJ ON DJR.IdDeclaracionJurada = DJ.IdDeclaracionJurada
LEFT JOIN VWContribuyentesLegajo vw ON DJ.IdContribuyenteLegajo = vw.IdContribuyenteLegajo

UNION ALL

-- TISH - EMPLEADOS
SELECT
    '2',
    RIGHT(
        REPLICATE('0', 20) +
        CASE
            WHEN DJ.IdContribuyenteLegajo IS NOT NULL
                THEN CAST(vw.Legajo AS VARCHAR) +
                     RIGHT('00' + CAST(CAST(vw.Sublegajo AS INT) AS VARCHAR), 2)
            ELSE CAST(DJ.Legajo AS VARCHAR) +
                     RIGHT('00' + CAST(CAST(DJ.Sublegajo AS INT) AS VARCHAR), 2)
        END,
        20
    ) AS NUMERO_CUENTA,
    DJR.Codigo, DJ.Año, DJ.Mes, 'TISH_EMPLEADOS', 'EMPLEADOS', DJ.Secuencia, '4',
    CAST(DJR.Empleados AS VARCHAR), DJR.IdDeclaracionJurada, DJR.FechaAlta, '', DJR.FechaAlta
FROM DeclaracionJuradaRubros DJR
JOIN DeclaracionesJuradas DJ ON DJR.IdDeclaracionJurada = DJ.IdDeclaracionJurada
LEFT JOIN VWContribuyentesLegajo vw ON DJ.IdContribuyenteLegajo = vw.IdContribuyenteLegajo

UNION ALL

-- TISH - UNIDADES to HABITACIONES, COCHERAS, CANCHAS_PADDLE, CANCHAS_FUTBOL_TENIS, PUESTOS_FERIA
SELECT
    '2',
    RIGHT(
        REPLICATE('0', 20) +
        CASE
            WHEN DJ.IdContribuyenteLegajo IS NOT NULL
                THEN CAST(vw.Legajo AS VARCHAR) +
                     RIGHT('00' + CAST(CAST(vw.Sublegajo AS INT) AS VARCHAR), 2)
            ELSE CAST(DJ.Legajo AS VARCHAR) +
                     RIGHT('00' + CAST(CAST(DJ.Sublegajo AS INT) AS VARCHAR), 2)
        END,
        20
    ) AS NUMERO_CUENTA,
    DJR.Codigo,
    DJ.Año,
    DJ.Mes,
    'TISH',
    CASE 
        WHEN TE.Codigo = 'c' THEN 'HABITACIONES'
        WHEN TE.Codigo = 'd' THEN 'COCHERAS'
        WHEN TE.Codigo = 'e' THEN 'CANCHAS_PADDLE'
        WHEN TE.Codigo = 'f' THEN 'CANCHAS_FUTBOL_TENIS'
        WHEN TE.Codigo = 'g' THEN 'PUESTOS_FERIA'
    END AS COD_TIPO,
    DJ.Secuencia,
    '4',
    CAST(DJR.Unidades AS VARCHAR),
    DJR.IdDeclaracionJurada,
    DJR.FechaAlta,
    '',
    DJR.FechaAlta
FROM DeclaracionJuradaRubros DJR
JOIN DeclaracionesJuradas DJ ON DJR.IdDeclaracionJurada = DJ.IdDeclaracionJurada
LEFT JOIN VWContribuyentesLegajo vw ON DJ.IdContribuyenteLegajo = vw.IdContribuyenteLegajo
JOIN TasaEspecialRubros TER ON TER.CodigoRubro = DJR.Codigo
JOIN TasasEspeciales TE ON TER.idTasaEspecial = TE.idTasaEspecial
WHERE DJR.Codigo IN (
    280000, 280022, 280055, 632101, 714002, 849007
)

UNION ALL

-- TISH - M2
SELECT
    '2',
    RIGHT(
        REPLICATE('0', 20) +
        CASE
            WHEN DJ.IdContribuyenteLegajo IS NOT NULL
                THEN CAST(vw.Legajo AS VARCHAR) +
                     RIGHT('00' + CAST(CAST(vw.Sublegajo AS INT) AS VARCHAR), 2)
            ELSE CAST(DJ.Legajo AS VARCHAR) +
                     RIGHT('00' + CAST(CAST(DJ.Sublegajo AS INT) AS VARCHAR), 2)
        END,
        20
    ) AS NUMERO_CUENTA,
    DJR.Codigo, DJ.Año, DJ.Mes, 'M2', 'M2', DJ.Secuencia, '4',
    CAST(DJR.M2 AS VARCHAR), DJR.IdDeclaracionJurada, DJR.FechaAlta, '', DJR.FechaAlta
FROM DeclaracionJuradaRubros DJR
JOIN DeclaracionesJuradas DJ ON DJR.IdDeclaracionJurada = DJ.IdDeclaracionJurada
LEFT JOIN VWContribuyentesLegajo vw ON DJ.IdContribuyenteLegajo = vw.IdContribuyenteLegajo
WHERE DJR.Codigo IN (
    849101, 849103, 849104, 849105, 910001, 910201, 910202, 910203, 910204, 910301, 910302, 910303, 910401, 910501, 910503, 911101, 911102, 911103, 911104, 853004, 853005, 910502, 720001, 720003, 720004
)

UNION ALL

-- TISH - M2DESCUBIERTOS
SELECT
    '2',
    RIGHT(
        REPLICATE('0', 20) +
        CASE
            WHEN DJ.IdContribuyenteLegajo IS NOT NULL
                THEN CAST(vw.Legajo AS VARCHAR) +
                     RIGHT('00' + CAST(CAST(vw.Sublegajo AS INT) AS VARCHAR), 2)
            ELSE CAST(DJ.Legajo AS VARCHAR) +
                     RIGHT('00' + CAST(CAST(DJ.Sublegajo AS INT) AS VARCHAR), 2)
        END,
        20
    ) AS NUMERO_CUENTA,
    DJR.Codigo, DJ.Año, DJ.Mes, 'TISH', 'M2DESCUBIERTOS', DJ.Secuencia, '4',
    CAST(DJR.M2descubiertos AS VARCHAR), DJR.IdDeclaracionJurada, DJR.FechaAlta, '', DJR.FechaAlta
FROM DeclaracionJuradaRubros DJR
JOIN DeclaracionesJuradas DJ ON DJR.IdDeclaracionJurada = DJ.IdDeclaracionJurada
LEFT JOIN VWContribuyentesLegajo vw ON DJ.IdContribuyenteLegajo = vw.IdContribuyenteLegajo
WHERE DJR.Codigo IN (
    720001, 720003, 720004
)

--- TAP
UNION ALL
-- SET 1
-- PARTIDA_1
SELECT
    '2', NUMERO_CUENTA, '', PERIODO, MES, COD_CLASE, 'PARTIDA_1',
    IdDDJJEdenProducido, '4', PARTIDA,
    IdDDJJEdenProducido, FECHA_ALTA, '', FECHA_ALTA
FROM PartidasNumeradas
WHERE rn = 1

UNION ALL

-- MTS_PRODUCTIVOS_1
SELECT
    '2', NUMERO_CUENTA, '', PERIODO, MES, COD_CLASE, 'MTS_PRODUCTIVOS_1',
    IdDDJJEdenProducido, '4', MetrosProductivos,
    IdDDJJEdenProducido, FECHA_ALTA, '', FECHA_ALTA
FROM PartidasNumeradas
WHERE rn = 1

UNION ALL

-- BASE_IMPONIBLE_1
SELECT
    '2', NUMERO_CUENTA, '', PERIODO, MES, COD_CLASE, 'BASE_IMPONIBLE_1',
    IdDDJJEdenProducido, '4', BaseImponible,
    IdDDJJEdenProducido, FECHA_ALTA, '', FECHA_ALTA
FROM PartidasNumeradas
WHERE rn = 1

UNION ALL

-- SET 2
-- PARTIDA_2
SELECT
    '2', NUMERO_CUENTA, '', PERIODO, MES, COD_CLASE, 'PARTIDA_2',
    IdDDJJEdenProducido, '4', PARTIDA,
    IdDDJJEdenProducido, FECHA_ALTA, '', FECHA_ALTA
FROM PartidasNumeradas
WHERE rn = 2

UNION ALL

-- MTS_PRODUCTIVOS_2
SELECT
    '2', NUMERO_CUENTA, '', PERIODO, MES, COD_CLASE, 'MTS_PRODUCTIVOS_2',
    IdDDJJEdenProducido, '4', MetrosProductivos,
    IdDDJJEdenProducido, FECHA_ALTA, '', FECHA_ALTA
FROM PartidasNumeradas
WHERE rn = 2

UNION ALL

-- BASE_IMPONIBLE_2
SELECT
    '2', NUMERO_CUENTA, '', PERIODO, MES, COD_CLASE, 'BASE_IMPONIBLE_2',
    IdDDJJEdenProducido, '4', BaseImponible,
    IdDDJJEdenProducido, FECHA_ALTA, '', FECHA_ALTA
FROM PartidasNumeradas
WHERE rn = 2

UNION ALL

-- SET 3
-- PARTIDA_3
SELECT
    '2', NUMERO_CUENTA, '', PERIODO, MES, COD_CLASE, 'PARTIDA_3',
    IdDDJJEdenProducido, '4', PARTIDA,
    IdDDJJEdenProducido, FECHA_ALTA, '', FECHA_ALTA
FROM PartidasNumeradas
WHERE rn = 3

UNION ALL

-- MTS_PRODUCTIVOS_3
SELECT
    '2', NUMERO_CUENTA, '', PERIODO, MES, COD_CLASE, 'MTS_PRODUCTIVOS_3',
    IdDDJJEdenProducido, '4', MetrosProductivos,
    IdDDJJEdenProducido, FECHA_ALTA, '', FECHA_ALTA
FROM PartidasNumeradas
WHERE rn = 3

UNION ALL

-- BASE_IMPONIBLE_3
SELECT
    '2', NUMERO_CUENTA, '', PERIODO, MES, COD_CLASE, 'BASE_IMPONIBLE_3',
    IdDDJJEdenProducido, '4', BaseImponible,
    IdDDJJEdenProducido, FECHA_ALTA, '', FECHA_ALTA
FROM PartidasNumeradas
WHERE rn = 3

UNION ALL

-- SET 4
-- PARTIDA_4
SELECT
    '2', NUMERO_CUENTA, '', PERIODO, MES, COD_CLASE, 'PARTIDA_4',
    IdDDJJEdenProducido, '4', PARTIDA,
    IdDDJJEdenProducido, FECHA_ALTA, '', FECHA_ALTA
FROM PartidasNumeradas
WHERE rn = 4

UNION ALL

-- MTS_PRODUCTIVOS_4
SELECT
    '2', NUMERO_CUENTA, '', PERIODO, MES, COD_CLASE, 'MTS_PRODUCTIVOS_4',
    IdDDJJEdenProducido, '4', MetrosProductivos,
    IdDDJJEdenProducido, FECHA_ALTA, '', FECHA_ALTA
FROM PartidasNumeradas
WHERE rn = 4

UNION ALL

-- BASE_IMPONIBLE_4
SELECT
    '2', NUMERO_CUENTA, '', PERIODO, MES, COD_CLASE, 'BASE_IMPONIBLE_4',
    IdDDJJEdenProducido, '4', BaseImponible,
    IdDDJJEdenProducido, FECHA_ALTA, '', FECHA_ALTA
FROM PartidasNumeradas
WHERE rn = 4

UNION ALL

-- SET 5
-- PARTIDA_5
SELECT
    '2', NUMERO_CUENTA, '', PERIODO, MES, COD_CLASE, 'PARTIDA_5',
    IdDDJJEdenProducido, '4', PARTIDA,
    IdDDJJEdenProducido, FECHA_ALTA, '', FECHA_ALTA
FROM PartidasNumeradas
WHERE rn = 5

UNION ALL

-- MTS_PRODUCTIVOS_5
SELECT
    '2', NUMERO_CUENTA, '', PERIODO, MES, COD_CLASE, 'MTS_PRODUCTIVOS_5',
    IdDDJJEdenProducido, '4', MetrosProductivos,
    IdDDJJEdenProducido, FECHA_ALTA, '', FECHA_ALTA
FROM PartidasNumeradas
WHERE rn = 5

UNION ALL

-- BASE_IMPONIBLE_5
SELECT
    '2', NUMERO_CUENTA, '', PERIODO, MES, COD_CLASE, 'BASE_IMPONIBLE_5',
    IdDDJJEdenProducido, '4', BaseImponible,
    IdDDJJEdenProducido, FECHA_ALTA, '', FECHA_ALTA
FROM PartidasNumeradas
WHERE rn = 5

UNION ALL

-- SET 6
-- PARTIDA_6
SELECT
    '2', NUMERO_CUENTA, '', PERIODO, MES, COD_CLASE, 'PARTIDA_6',
    IdDDJJEdenProducido, '4', PARTIDA,
    IdDDJJEdenProducido, FECHA_ALTA, '', FECHA_ALTA
FROM PartidasNumeradas
WHERE rn = 6

UNION ALL

-- MTS_PRODUCTIVOS_6
SELECT
    '2', NUMERO_CUENTA, '', PERIODO, MES, COD_CLASE, 'MTS_PRODUCTIVOS_6',
    IdDDJJEdenProducido, '4', MetrosProductivos,
    IdDDJJEdenProducido, FECHA_ALTA, '', FECHA_ALTA
FROM PartidasNumeradas
WHERE rn = 6

UNION ALL

-- BASE_IMPONIBLE_6
SELECT
    '2', NUMERO_CUENTA, '', PERIODO, MES, COD_CLASE, 'BASE_IMPONIBLE_6',
    IdDDJJEdenProducido, '4', BaseImponible,
    IdDDJJEdenProducido, FECHA_ALTA, '', FECHA_ALTA
FROM PartidasNumeradas
WHERE rn = 6

UNION ALL

-- SET 7
-- PARTIDA_7
SELECT
    '2', NUMERO_CUENTA, '', PERIODO, MES, COD_CLASE, 'PARTIDA_7',
    IdDDJJEdenProducido, '4', PARTIDA,
    IdDDJJEdenProducido, FECHA_ALTA, '', FECHA_ALTA
FROM PartidasNumeradas
WHERE rn = 7

UNION ALL

-- MTS_PRODUCTIVOS_7
SELECT
    '2', NUMERO_CUENTA, '', PERIODO, MES, COD_CLASE, 'MTS_PRODUCTIVOS_7',
    IdDDJJEdenProducido, '4', MetrosProductivos,
    IdDDJJEdenProducido, FECHA_ALTA, '', FECHA_ALTA
FROM PartidasNumeradas
WHERE rn = 7

UNION ALL

-- BASE_IMPONIBLE_7
SELECT
    '2', NUMERO_CUENTA, '', PERIODO, MES, COD_CLASE, 'BASE_IMPONIBLE_7',
    IdDDJJEdenProducido, '4', BaseImponible,
    IdDDJJEdenProducido, FECHA_ALTA, '', FECHA_ALTA
FROM PartidasNumeradas
WHERE rn = 7

UNION ALL

-- SET 8
-- PARTIDA_8
SELECT
    '2', NUMERO_CUENTA, '', PERIODO, MES, COD_CLASE, 'PARTIDA_8',
    IdDDJJEdenProducido, '4', PARTIDA,
    IdDDJJEdenProducido, FECHA_ALTA, '', FECHA_ALTA
FROM PartidasNumeradas
WHERE rn = 8

UNION ALL

-- MTS_PRODUCTIVOS_8
SELECT
    '2', NUMERO_CUENTA, '', PERIODO, MES, COD_CLASE, 'MTS_PRODUCTIVOS_8',
    IdDDJJEdenProducido, '4', MetrosProductivos,
    IdDDJJEdenProducido, FECHA_ALTA, '', FECHA_ALTA
FROM PartidasNumeradas
WHERE rn = 8

UNION ALL

-- BASE_IMPONIBLE_8
SELECT
    '2', NUMERO_CUENTA, '', PERIODO, MES, COD_CLASE, 'BASE_IMPONIBLE_8',
    IdDDJJEdenProducido, '4', BaseImponible,
    IdDDJJEdenProducido, FECHA_ALTA, '', FECHA_ALTA
FROM PartidasNumeradas
WHERE rn = 8

UNION ALL

-- SET 9
-- PARTIDA_9
SELECT
    '2', NUMERO_CUENTA, '', PERIODO, MES, COD_CLASE, 'PARTIDA_9',
    IdDDJJEdenProducido, '4', PARTIDA,
    IdDDJJEdenProducido, FECHA_ALTA, '', FECHA_ALTA
FROM PartidasNumeradas
WHERE rn = 9

UNION ALL

-- MTS_PRODUCTIVOS_9
SELECT
    '2', NUMERO_CUENTA, '', PERIODO, MES, COD_CLASE, 'MTS_PRODUCTIVOS_9',
    IdDDJJEdenProducido, '4', MetrosProductivos,
    IdDDJJEdenProducido, FECHA_ALTA, '', FECHA_ALTA
FROM PartidasNumeradas
WHERE rn = 9

UNION ALL

-- BASE_IMPONIBLE_9
SELECT
    '2', NUMERO_CUENTA, '', PERIODO, MES, COD_CLASE, 'BASE_IMPONIBLE_9',
    IdDDJJEdenProducido, '4', BaseImponible,
    IdDDJJEdenProducido, FECHA_ALTA, '', FECHA_ALTA
FROM PartidasNumeradas
WHERE rn = 9

UNION ALL

-- SET 10
-- PARTIDA_10
SELECT
    '2', NUMERO_CUENTA, '', PERIODO, MES, COD_CLASE, 'PARTIDA_10',
    IdDDJJEdenProducido, '4', PARTIDA,
    IdDDJJEdenProducido, FECHA_ALTA, '', FECHA_ALTA
FROM PartidasNumeradas
WHERE rn = 10

UNION ALL

-- MTS_PRODUCTIVOS_10
SELECT
    '2', NUMERO_CUENTA, '', PERIODO, MES, COD_CLASE, 'MTS_PRODUCTIVOS_10',
    IdDDJJEdenProducido, '4', MetrosProductivos,
    IdDDJJEdenProducido, FECHA_ALTA, '', FECHA_ALTA
FROM PartidasNumeradas
WHERE rn = 10

UNION ALL

-- BASE_IMPONIBLE_10
SELECT
    '2', NUMERO_CUENTA, '', PERIODO, MES, COD_CLASE, 'BASE_IMPONIBLE_10',
    IdDDJJEdenProducido, '4', BaseImponible,
    IdDDJJEdenProducido, FECHA_ALTA, '', FECHA_ALTA
FROM PartidasNumeradas
WHERE rn = 10

UNION ALL

-- SET 11
-- PARTIDA_11
SELECT
    '2', NUMERO_CUENTA, '', PERIODO, MES, COD_CLASE, 'PARTIDA_11',
    IdDDJJEdenProducido, '4', PARTIDA,
    IdDDJJEdenProducido, FECHA_ALTA, '', FECHA_ALTA
FROM PartidasNumeradas
WHERE rn = 11

UNION ALL

-- MTS_PRODUCTIVOS_11
SELECT
    '2', NUMERO_CUENTA, '', PERIODO, MES, COD_CLASE, 'MTS_PRODUCTIVOS_11',
    IdDDJJEdenProducido, '4', MetrosProductivos,
    IdDDJJEdenProducido, FECHA_ALTA, '', FECHA_ALTA
FROM PartidasNumeradas
WHERE rn = 11

UNION ALL

-- BASE_IMPONIBLE_11
SELECT
    '2', NUMERO_CUENTA, '', PERIODO, MES, COD_CLASE, 'BASE_IMPONIBLE_11',
    IdDDJJEdenProducido, '4', BaseImponible,
    IdDDJJEdenProducido, FECHA_ALTA, '', FECHA_ALTA
FROM PartidasNumeradas
WHERE rn = 11

UNION ALL

-- SET 12
-- PARTIDA_12
SELECT
    '2', NUMERO_CUENTA, '', PERIODO, MES, COD_CLASE, 'PARTIDA_12',
    IdDDJJEdenProducido, '4', PARTIDA,
    IdDDJJEdenProducido, FECHA_ALTA, '', FECHA_ALTA
FROM PartidasNumeradas
WHERE rn = 12

UNION ALL

-- MTS_PRODUCTIVOS_12
SELECT
    '2', NUMERO_CUENTA, '', PERIODO, MES, COD_CLASE, 'MTS_PRODUCTIVOS_12',
    IdDDJJEdenProducido, '4', MetrosProductivos,
    IdDDJJEdenProducido, FECHA_ALTA, '', FECHA_ALTA
FROM PartidasNumeradas
WHERE rn = 12

UNION ALL

-- BASE_IMPONIBLE_12
SELECT
    '2', NUMERO_CUENTA, '', PERIODO, MES, COD_CLASE, 'BASE_IMPONIBLE_12',
    IdDDJJEdenProducido, '4', BaseImponible,
    IdDDJJEdenProducido, FECHA_ALTA, '', FECHA_ALTA
FROM PartidasNumeradas
WHERE rn = 12

UNION ALL

-- SET 13
-- PARTIDA_13
SELECT
    '2', NUMERO_CUENTA, '', PERIODO, MES, COD_CLASE, 'PARTIDA_13',
    IdDDJJEdenProducido, '4', PARTIDA,
    IdDDJJEdenProducido, FECHA_ALTA, '', FECHA_ALTA
FROM PartidasNumeradas
WHERE rn = 13

UNION ALL

-- MTS_PRODUCTIVOS_13
SELECT
    '2', NUMERO_CUENTA, '', PERIODO, MES, COD_CLASE, 'MTS_PRODUCTIVOS_13',
    IdDDJJEdenProducido, '4', MetrosProductivos,
    IdDDJJEdenProducido, FECHA_ALTA, '', FECHA_ALTA
FROM PartidasNumeradas
WHERE rn = 13

UNION ALL

-- BASE_IMPONIBLE_13
SELECT
    '2', NUMERO_CUENTA, '', PERIODO, MES, COD_CLASE, 'BASE_IMPONIBLE_13',
    IdDDJJEdenProducido, '4', BaseImponible,
    IdDDJJEdenProducido, FECHA_ALTA, '', FECHA_ALTA
FROM PartidasNumeradas
WHERE rn = 13

UNION ALL

-- SET 14
-- PARTIDA_14
SELECT
    '2', NUMERO_CUENTA, '', PERIODO, MES, COD_CLASE, 'PARTIDA_14',
    IdDDJJEdenProducido, '4', PARTIDA,
    IdDDJJEdenProducido, FECHA_ALTA, '', FECHA_ALTA
FROM PartidasNumeradas
WHERE rn = 14

UNION ALL

-- MTS_PRODUCTIVOS_14
SELECT
    '2', NUMERO_CUENTA, '', PERIODO, MES, COD_CLASE, 'MTS_PRODUCTIVOS_14',
    IdDDJJEdenProducido, '4', MetrosProductivos,
    IdDDJJEdenProducido, FECHA_ALTA, '', FECHA_ALTA
FROM PartidasNumeradas
WHERE rn = 14

UNION ALL

-- BASE_IMPONIBLE_14
SELECT
    '2', NUMERO_CUENTA, '', PERIODO, MES, COD_CLASE, 'BASE_IMPONIBLE_14',
    IdDDJJEdenProducido, '4', BaseImponible,
    IdDDJJEdenProducido, FECHA_ALTA, '', FECHA_ALTA
FROM PartidasNumeradas
WHERE rn = 14

UNION ALL

-- SET 15
-- PARTIDA_15
SELECT
    '2', NUMERO_CUENTA, '', PERIODO, MES, COD_CLASE, 'PARTIDA_15',
    IdDDJJEdenProducido, '4', PARTIDA,
    IdDDJJEdenProducido, FECHA_ALTA, '', FECHA_ALTA
FROM PartidasNumeradas
WHERE rn = 15

UNION ALL

-- MTS_PRODUCTIVOS_15
SELECT
    '2', NUMERO_CUENTA, '', PERIODO, MES, COD_CLASE, 'MTS_PRODUCTIVOS_15',
    IdDDJJEdenProducido, '4', MetrosProductivos,
    IdDDJJEdenProducido, FECHA_ALTA, '', FECHA_ALTA
FROM PartidasNumeradas
WHERE rn = 15

UNION ALL

-- BASE_IMPONIBLE_15
SELECT
    '2', NUMERO_CUENTA, '', PERIODO, MES, COD_CLASE, 'BASE_IMPONIBLE_15',
    IdDDJJEdenProducido, '4', BaseImponible,
    IdDDJJEdenProducido, FECHA_ALTA, '', FECHA_ALTA
FROM PartidasNumeradas
WHERE rn = 15

UNION ALL

-- SET 16
-- PARTIDA_16
SELECT
    '2', NUMERO_CUENTA, '', PERIODO, MES, COD_CLASE, 'PARTIDA_16',
    IdDDJJEdenProducido, '4', PARTIDA,
    IdDDJJEdenProducido, FECHA_ALTA, '', FECHA_ALTA
FROM PartidasNumeradas
WHERE rn = 16

UNION ALL

-- MTS_PRODUCTIVOS_16
SELECT
    '2', NUMERO_CUENTA, '', PERIODO, MES, COD_CLASE, 'MTS_PRODUCTIVOS_16',
    IdDDJJEdenProducido, '4', MetrosProductivos,
    IdDDJJEdenProducido, FECHA_ALTA, '', FECHA_ALTA
FROM PartidasNumeradas
WHERE rn = 16

UNION ALL

-- BASE_IMPONIBLE_16
SELECT
    '2', NUMERO_CUENTA, '', PERIODO, MES, COD_CLASE, 'BASE_IMPONIBLE_16',
    IdDDJJEdenProducido, '4', BaseImponible,
    IdDDJJEdenProducido, FECHA_ALTA, '', FECHA_ALTA
FROM PartidasNumeradas
WHERE rn = 16

UNION ALL

-- SET 17
-- PARTIDA_17
SELECT
    '2', NUMERO_CUENTA, '', PERIODO, MES, COD_CLASE, 'PARTIDA_17',
    IdDDJJEdenProducido, '4', PARTIDA,
    IdDDJJEdenProducido, FECHA_ALTA, '', FECHA_ALTA
FROM PartidasNumeradas
WHERE rn = 17

UNION ALL

-- MTS_PRODUCTIVOS_17
SELECT
    '2', NUMERO_CUENTA, '', PERIODO, MES, COD_CLASE, 'MTS_PRODUCTIVOS_17',
    IdDDJJEdenProducido, '4', MetrosProductivos,
    IdDDJJEdenProducido, FECHA_ALTA, '', FECHA_ALTA
FROM PartidasNumeradas
WHERE rn = 17

UNION ALL

-- BASE_IMPONIBLE_17
SELECT
    '2', NUMERO_CUENTA, '', PERIODO, MES, COD_CLASE, 'BASE_IMPONIBLE_17',
    IdDDJJEdenProducido, '4', BaseImponible,
    IdDDJJEdenProducido, FECHA_ALTA, '', FECHA_ALTA
FROM PartidasNumeradas
WHERE rn = 17

UNION ALL

-- SET 18
-- PARTIDA_18
SELECT
    '2', NUMERO_CUENTA, '', PERIODO, MES, COD_CLASE, 'PARTIDA_18',
    IdDDJJEdenProducido, '4', PARTIDA,
    IdDDJJEdenProducido, FECHA_ALTA, '', FECHA_ALTA
FROM PartidasNumeradas
WHERE rn = 18

UNION ALL

-- MTS_PRODUCTIVOS_18
SELECT
    '2', NUMERO_CUENTA, '', PERIODO, MES, COD_CLASE, 'MTS_PRODUCTIVOS_18',
    IdDDJJEdenProducido, '4', MetrosProductivos,
    IdDDJJEdenProducido, FECHA_ALTA, '', FECHA_ALTA
FROM PartidasNumeradas
WHERE rn = 18

UNION ALL

-- BASE_IMPONIBLE_18
SELECT
    '2', NUMERO_CUENTA, '', PERIODO, MES, COD_CLASE, 'BASE_IMPONIBLE_18',
    IdDDJJEdenProducido, '4', BaseImponible,
    IdDDJJEdenProducido, FECHA_ALTA, '', FECHA_ALTA
FROM PartidasNumeradas
WHERE rn = 18

UNION ALL

-- SET 19
-- PARTIDA_19
SELECT
    '2', NUMERO_CUENTA, '', PERIODO, MES, COD_CLASE, 'PARTIDA_19',
    IdDDJJEdenProducido, '4', PARTIDA,
    IdDDJJEdenProducido, FECHA_ALTA, '', FECHA_ALTA
FROM PartidasNumeradas
WHERE rn = 19

UNION ALL

-- MTS_PRODUCTIVOS_19
SELECT
    '2', NUMERO_CUENTA, '', PERIODO, MES, COD_CLASE, 'MTS_PRODUCTIVOS_19',
    IdDDJJEdenProducido, '4', MetrosProductivos,
    IdDDJJEdenProducido, FECHA_ALTA, '', FECHA_ALTA
FROM PartidasNumeradas
WHERE rn = 19

UNION ALL

-- BASE_IMPONIBLE_19
SELECT
    '2', NUMERO_CUENTA, '', PERIODO, MES, COD_CLASE, 'BASE_IMPONIBLE_19',
    IdDDJJEdenProducido, '4', BaseImponible,
    IdDDJJEdenProducido, FECHA_ALTA, '', FECHA_ALTA
FROM PartidasNumeradas
WHERE rn = 19

UNION ALL

-- SET 20
-- PARTIDA_20
SELECT
    '2', NUMERO_CUENTA, '', PERIODO, MES, COD_CLASE, 'PARTIDA_20',
    IdDDJJEdenProducido, '4', PARTIDA,
    IdDDJJEdenProducido, FECHA_ALTA, '', FECHA_ALTA
FROM PartidasNumeradas
WHERE rn = 20

UNION ALL

-- MTS_PRODUCTIVOS_20
SELECT
    '2', NUMERO_CUENTA, '', PERIODO, MES, COD_CLASE, 'MTS_PRODUCTIVOS_20',
    IdDDJJEdenProducido, '4', MetrosProductivos,
    IdDDJJEdenProducido, FECHA_ALTA, '', FECHA_ALTA
FROM PartidasNumeradas
WHERE rn = 20

UNION ALL

-- BASE_IMPONIBLE_20
SELECT
    '2', NUMERO_CUENTA, '', PERIODO, MES, COD_CLASE, 'BASE_IMPONIBLE_20',
    IdDDJJEdenProducido, '4', BaseImponible,
    IdDDJJEdenProducido, FECHA_ALTA, '', FECHA_ALTA
FROM PartidasNumeradas
WHERE rn = 20

UNION ALL

-- SET 21
-- PARTIDA_21
SELECT
    '2', NUMERO_CUENTA, '', PERIODO, MES, COD_CLASE, 'PARTIDA_21',
    IdDDJJEdenProducido, '4', PARTIDA,
    IdDDJJEdenProducido, FECHA_ALTA, '', FECHA_ALTA
FROM PartidasNumeradas
WHERE rn = 21

UNION ALL

-- MTS_PRODUCTIVOS_21
SELECT
    '2', NUMERO_CUENTA, '', PERIODO, MES, COD_CLASE, 'MTS_PRODUCTIVOS_21',
    IdDDJJEdenProducido, '4', MetrosProductivos,
    IdDDJJEdenProducido, FECHA_ALTA, '', FECHA_ALTA
FROM PartidasNumeradas
WHERE rn = 21

UNION ALL

-- BASE_IMPONIBLE_21
SELECT
    '2', NUMERO_CUENTA, '', PERIODO, MES, COD_CLASE, 'BASE_IMPONIBLE_21',
    IdDDJJEdenProducido, '4', BaseImponible,
    IdDDJJEdenProducido, FECHA_ALTA, '', FECHA_ALTA
FROM PartidasNumeradas
WHERE rn = 21

UNION ALL

-- SET 22
-- PARTIDA_22
SELECT
    '2', NUMERO_CUENTA, '', PERIODO, MES, COD_CLASE, 'PARTIDA_22',
    IdDDJJEdenProducido, '4', PARTIDA,
    IdDDJJEdenProducido, FECHA_ALTA, '', FECHA_ALTA
FROM PartidasNumeradas
WHERE rn = 22

UNION ALL

-- MTS_PRODUCTIVOS_22
SELECT
    '2', NUMERO_CUENTA, '', PERIODO, MES, COD_CLASE, 'MTS_PRODUCTIVOS_22',
    IdDDJJEdenProducido, '4', MetrosProductivos,
    IdDDJJEdenProducido, FECHA_ALTA, '', FECHA_ALTA
FROM PartidasNumeradas
WHERE rn = 22

UNION ALL

-- BASE_IMPONIBLE_22
SELECT
    '2', NUMERO_CUENTA, '', PERIODO, MES, COD_CLASE, 'BASE_IMPONIBLE_22',
    IdDDJJEdenProducido, '4', BaseImponible,
    IdDDJJEdenProducido, FECHA_ALTA, '', FECHA_ALTA
FROM PartidasNumeradas
WHERE rn = 22

UNION ALL

-- SET 23
-- PARTIDA_23
SELECT
    '2', NUMERO_CUENTA, '', PERIODO, MES, COD_CLASE, 'PARTIDA_23',
    IdDDJJEdenProducido, '4', PARTIDA,
    IdDDJJEdenProducido, FECHA_ALTA, '', FECHA_ALTA
FROM PartidasNumeradas
WHERE rn = 23

UNION ALL

-- MTS_PRODUCTIVOS_23
SELECT
    '2', NUMERO_CUENTA, '', PERIODO, MES, COD_CLASE, 'MTS_PRODUCTIVOS_23',
    IdDDJJEdenProducido, '4', MetrosProductivos,
    IdDDJJEdenProducido, FECHA_ALTA, '', FECHA_ALTA
FROM PartidasNumeradas
WHERE rn = 23

UNION ALL

-- BASE_IMPONIBLE_23
SELECT
    '2', NUMERO_CUENTA, '', PERIODO, MES, COD_CLASE, 'BASE_IMPONIBLE_23',
    IdDDJJEdenProducido, '4', BaseImponible,
    IdDDJJEdenProducido, FECHA_ALTA, '', FECHA_ALTA
FROM PartidasNumeradas
WHERE rn = 23

UNION ALL

-- SET 24
-- PARTIDA_24
SELECT
    '2', NUMERO_CUENTA, '', PERIODO, MES, COD_CLASE, 'PARTIDA_24',
    IdDDJJEdenProducido, '4', PARTIDA,
    IdDDJJEdenProducido, FECHA_ALTA, '', FECHA_ALTA
FROM PartidasNumeradas
WHERE rn = 24

UNION ALL

-- MTS_PRODUCTIVOS_24
SELECT
    '2', NUMERO_CUENTA, '', PERIODO, MES, COD_CLASE, 'MTS_PRODUCTIVOS_24',
    IdDDJJEdenProducido, '4', MetrosProductivos,
    IdDDJJEdenProducido, FECHA_ALTA, '', FECHA_ALTA
FROM PartidasNumeradas
WHERE rn = 24

UNION ALL

-- BASE_IMPONIBLE_24
SELECT
    '2', NUMERO_CUENTA, '', PERIODO, MES, COD_CLASE, 'BASE_IMPONIBLE_24',
    IdDDJJEdenProducido, '4', BaseImponible,
    IdDDJJEdenProducido, FECHA_ALTA, '', FECHA_ALTA
FROM PartidasNumeradas
WHERE rn = 24

UNION ALL

-- SET 25
-- PARTIDA_25
SELECT
    '2', NUMERO_CUENTA, '', PERIODO, MES, COD_CLASE, 'PARTIDA_25',
    IdDDJJEdenProducido, '4', PARTIDA,
    IdDDJJEdenProducido, FECHA_ALTA, '', FECHA_ALTA
FROM PartidasNumeradas
WHERE rn = 25

UNION ALL

-- MTS_PRODUCTIVOS_25
SELECT
    '2', NUMERO_CUENTA, '', PERIODO, MES, COD_CLASE, 'MTS_PRODUCTIVOS_25',
    IdDDJJEdenProducido, '4', MetrosProductivos,
    IdDDJJEdenProducido, FECHA_ALTA, '', FECHA_ALTA
FROM PartidasNumeradas
WHERE rn = 25

UNION ALL

-- BASE_IMPONIBLE_25
SELECT
    '2', NUMERO_CUENTA, '', PERIODO, MES, COD_CLASE, 'BASE_IMPONIBLE_25',
    IdDDJJEdenProducido, '4', BaseImponible,
    IdDDJJEdenProducido, FECHA_ALTA, '', FECHA_ALTA
FROM PartidasNumeradas
WHERE rn = 25

UNION ALL

-- SET 26
-- PARTIDA_26
SELECT
    '2', NUMERO_CUENTA, '', PERIODO, MES, COD_CLASE, 'PARTIDA_26',
    IdDDJJEdenProducido, '4', PARTIDA,
    IdDDJJEdenProducido, FECHA_ALTA, '', FECHA_ALTA
FROM PartidasNumeradas
WHERE rn = 26

UNION ALL

-- MTS_PRODUCTIVOS_26
SELECT
    '2', NUMERO_CUENTA, '', PERIODO, MES, COD_CLASE, 'MTS_PRODUCTIVOS_26',
    IdDDJJEdenProducido, '4', MetrosProductivos,
    IdDDJJEdenProducido, FECHA_ALTA, '', FECHA_ALTA
FROM PartidasNumeradas
WHERE rn = 26

UNION ALL

-- BASE_IMPONIBLE_26
SELECT
    '2', NUMERO_CUENTA, '', PERIODO, MES, COD_CLASE, 'BASE_IMPONIBLE_26',
    IdDDJJEdenProducido, '4', BaseImponible,
    IdDDJJEdenProducido, FECHA_ALTA, '', FECHA_ALTA
FROM PartidasNumeradas
WHERE rn = 26

UNION ALL

-- SET 27
-- PARTIDA_27
SELECT
    '2', NUMERO_CUENTA, '', PERIODO, MES, COD_CLASE, 'PARTIDA_27',
    IdDDJJEdenProducido, '4', PARTIDA,
    IdDDJJEdenProducido, FECHA_ALTA, '', FECHA_ALTA
FROM PartidasNumeradas
WHERE rn = 27

UNION ALL

-- MTS_PRODUCTIVOS_27
SELECT
    '2', NUMERO_CUENTA, '', PERIODO, MES, COD_CLASE, 'MTS_PRODUCTIVOS_27',
    IdDDJJEdenProducido, '4', MetrosProductivos,
    IdDDJJEdenProducido, FECHA_ALTA, '', FECHA_ALTA
FROM PartidasNumeradas
WHERE rn = 27

UNION ALL

-- BASE_IMPONIBLE_27
SELECT
    '2', NUMERO_CUENTA, '', PERIODO, MES, COD_CLASE, 'BASE_IMPONIBLE_27',
    IdDDJJEdenProducido, '4', BaseImponible,
    IdDDJJEdenProducido, FECHA_ALTA, '', FECHA_ALTA
FROM PartidasNumeradas
WHERE rn = 27

UNION ALL

-- SET 28
-- PARTIDA_28
SELECT
    '2', NUMERO_CUENTA, '', PERIODO, MES, COD_CLASE, 'PARTIDA_28',
    IdDDJJEdenProducido, '4', PARTIDA,
    IdDDJJEdenProducido, FECHA_ALTA, '', FECHA_ALTA
FROM PartidasNumeradas
WHERE rn = 28

UNION ALL

-- MTS_PRODUCTIVOS_28
SELECT
    '2', NUMERO_CUENTA, '', PERIODO, MES, COD_CLASE, 'MTS_PRODUCTIVOS_28',
    IdDDJJEdenProducido, '4', MetrosProductivos,
    IdDDJJEdenProducido, FECHA_ALTA, '', FECHA_ALTA
FROM PartidasNumeradas
WHERE rn = 28

UNION ALL

-- BASE_IMPONIBLE_28
SELECT
    '2', NUMERO_CUENTA, '', PERIODO, MES, COD_CLASE, 'BASE_IMPONIBLE_28',
    IdDDJJEdenProducido, '4', BaseImponible,
    IdDDJJEdenProducido, FECHA_ALTA, '', FECHA_ALTA
FROM PartidasNumeradas
WHERE rn = 28

UNION ALL

-- SET 29
-- PARTIDA_29
SELECT
    '2', NUMERO_CUENTA, '', PERIODO, MES, COD_CLASE, 'PARTIDA_29',
    IdDDJJEdenProducido, '4', PARTIDA,
    IdDDJJEdenProducido, FECHA_ALTA, '', FECHA_ALTA
FROM PartidasNumeradas
WHERE rn = 29

UNION ALL

-- MTS_PRODUCTIVOS_29
SELECT
    '2', NUMERO_CUENTA, '', PERIODO, MES, COD_CLASE, 'MTS_PRODUCTIVOS_29',
    IdDDJJEdenProducido, '4', MetrosProductivos,
    IdDDJJEdenProducido, FECHA_ALTA, '', FECHA_ALTA
FROM PartidasNumeradas
WHERE rn = 29

UNION ALL

-- BASE_IMPONIBLE_29
SELECT
    '2', NUMERO_CUENTA, '', PERIODO, MES, COD_CLASE, 'BASE_IMPONIBLE_29',
    IdDDJJEdenProducido, '4', BaseImponible,
    IdDDJJEdenProducido, FECHA_ALTA, '', FECHA_ALTA
FROM PartidasNumeradas
WHERE rn = 29

UNION ALL

-- SET 30
-- PARTIDA_30
SELECT
    '2', NUMERO_CUENTA, '', PERIODO, MES, COD_CLASE, 'PARTIDA_30',
    IdDDJJEdenProducido, '4', PARTIDA,
    IdDDJJEdenProducido, FECHA_ALTA, '', FECHA_ALTA
FROM PartidasNumeradas
WHERE rn = 30

UNION ALL

-- MTS_PRODUCTIVOS_30
SELECT
    '2', NUMERO_CUENTA, '', PERIODO, MES, COD_CLASE, 'MTS_PRODUCTIVOS_30',
    IdDDJJEdenProducido, '4', MetrosProductivos,
    IdDDJJEdenProducido, FECHA_ALTA, '', FECHA_ALTA
FROM PartidasNumeradas
WHERE rn = 30