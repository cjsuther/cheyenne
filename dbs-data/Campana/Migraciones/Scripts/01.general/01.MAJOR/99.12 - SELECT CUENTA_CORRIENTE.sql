WITH CTE_CuentaCorrienteDetalle AS (
    SELECT
        CC.IdCuentaCorriente,
        CCD.IdCuentaCorrienteDetalle,
        CC.IdTipoMovimiento,
        CC.IdApremio,
        CC.IdMoratoria,
        CC.NumeroComprobante,
        CC.Periodo,
        CC.Cuota,
        CC.[1erVencimiento],
        CC.FechaAlta,
        CC.fechapago,
        CC.IdEmision,
        CCD.Importe,
        CCD.Tipo,
        TOT.IdTipoObjetoTributario,
        T.Tasa,
        T.Subtasa,
        CAST(CASE
            WHEN TOT.IdTipoObjetoTributario = 1 THEN CAST(A.Dominio AS VARCHAR(50))
            WHEN TOT.IdTipoObjetoTributario = 2 THEN CAST(M.PatenteProvincia AS VARCHAR(50))
            WHEN TOT.IdTipoObjetoTributario = 3 THEN CAST(C.Cuenta AS VARCHAR(50))
            WHEN TOT.IdTipoObjetoTributario = 4 THEN CAST(I.Cuenta AS VARCHAR(50)) + RIGHT('00' + CAST(I.SubCuenta AS VARCHAR), 2)
            WHEN TOT.IdTipoObjetoTributario IN (5, 6) THEN CAST(CO.Legajo AS VARCHAR(50)) + RIGHT('00' + CAST(CO.Sublegajo AS VARCHAR), 2)
            WHEN TOT.IdTipoObjetoTributario = 8 THEN CAST(PF.NumeroDocumento AS VARCHAR(50))
            ELSE NULL
        END AS VARCHAR(50)) AS NUMERO_CUENTA_BASE,
        ROW_NUMBER() OVER (ORDER BY CC.IdCuentaCorriente) + 900000000 AS NumeroComprobanteAutonumerico
    FROM CuentaCorriente CC
    JOIN CuentaCorrienteDetalle CCD ON CCD.IdCuentaCorriente = CC.IdCuentaCorriente
    JOIN Rentas.dbo.ContribuyentesObjetosTributarios COT ON COT.IdContribuyenteObjetoTributario = CC.IdContribuyenteObjetoTributario
    JOIN Rentas.dbo.TipoObjetoTributario TOT ON TOT.IdTipoObjetoTributario = COT.IdTipoObjetoTributario
    LEFT JOIN Rentas.dbo.Tasas T ON T.IdTasa = COT.IdTasa
    LEFT JOIN Rentas.dbo.Automotores A ON A.IdAutomotor = COT.IdObjetoTributario AND TOT.IdTipoObjetoTributario = 1
    LEFT JOIN Rentas.dbo.Motos M ON M.IdMoto = COT.IdObjetoTributario AND TOT.IdTipoObjetoTributario = 2
    LEFT JOIN Rentas.dbo.Cementerios C ON C.IdCementerio = COT.IdObjetoTributario AND TOT.IdTipoObjetoTributario = 3
    LEFT JOIN Rentas.dbo.Inmuebles I ON I.IdInmueble = COT.IdObjetoTributario AND TOT.IdTipoObjetoTributario = 4
    LEFT JOIN Rentas.dbo.Comercios CO ON CO.IdComercio = COT.IdObjetoTributario AND TOT.IdTipoObjetoTributario IN (5, 6)
    LEFT JOIN Rentas.dbo.PersonasFisicas PF ON PF.IdPersonaFisica = COT.IdObjetoTributario AND TOT.IdTipoObjetoTributario = 8
    --WHERE CC.Periodo IN (2024, 2025)
),
CTE_Pagos AS (
    SELECT
        P.IdPago,
        P.IdCuentaCorriente,
        P.Importe,
        P.Tipo,
        P.BocaPago,
        P.FechaAlta,
        P.Fecha,
        CC.IdTipoMovimiento,
        CC.IdApremio,
        CC.IdMoratoria,
        CC.NumeroComprobante,
        CC.Periodo,
        CC.Cuota,
        CC.[1erVencimiento],
        CC.IdEmision,
        T.Tasa,
        T.Subtasa,
        TOT.IdTipoObjetoTributario,
        CAST(CASE
            WHEN TOT.IdTipoObjetoTributario = 1 THEN CAST(A.Dominio AS VARCHAR(50))
            WHEN TOT.IdTipoObjetoTributario = 2 THEN CAST(M.PatenteProvincia AS VARCHAR(50))
            WHEN TOT.IdTipoObjetoTributario = 3 THEN CAST(C.Cuenta AS VARCHAR(50))
            WHEN TOT.IdTipoObjetoTributario = 4 THEN CAST(I.Cuenta AS VARCHAR(50)) + RIGHT('00' + CAST(I.SubCuenta AS VARCHAR), 2)
            WHEN TOT.IdTipoObjetoTributario IN (5, 6) THEN CAST(CO.Legajo AS VARCHAR(50)) + RIGHT('00' + CAST(CO.Sublegajo AS VARCHAR), 2)
            WHEN TOT.IdTipoObjetoTributario = 8 THEN CAST(PF.NumeroDocumento AS VARCHAR(50))
            ELSE NULL
        END AS VARCHAR(50)) AS NUMERO_CUENTA_BASE,
        ROW_NUMBER() OVER (ORDER BY P.IdPago) + 900000000 AS NumeroComprobanteAutonumerico
    FROM Pagos P
    JOIN CuentaCorriente CC ON CC.IdCuentaCorriente = P.IdCuentaCorriente
    JOIN Rentas.dbo.ContribuyentesObjetosTributarios COT ON COT.IdContribuyenteObjetoTributario = CC.IdContribuyenteObjetoTributario
    JOIN Rentas.dbo.TipoObjetoTributario TOT ON TOT.IdTipoObjetoTributario = COT.IdTipoObjetoTributario
    LEFT JOIN Rentas.dbo.Tasas T ON T.IdTasa = COT.IdTasa
    LEFT JOIN Rentas.dbo.Automotores A ON A.IdAutomotor = COT.IdObjetoTributario AND TOT.IdTipoObjetoTributario = 1
    LEFT JOIN Rentas.dbo.Motos M ON M.IdMoto = COT.IdObjetoTributario AND TOT.IdTipoObjetoTributario = 2
    LEFT JOIN Rentas.dbo.Cementerios C ON C.IdCementerio = COT.IdObjetoTributario AND TOT.IdTipoObjetoTributario = 3
    LEFT JOIN Rentas.dbo.Inmuebles I ON I.IdInmueble = COT.IdObjetoTributario AND TOT.IdTipoObjetoTributario = 4
    LEFT JOIN Rentas.dbo.Comercios CO ON CO.IdComercio = COT.IdObjetoTributario AND TOT.IdTipoObjetoTributario IN (5, 6)
    LEFT JOIN Rentas.dbo.PersonasFisicas PF ON PF.IdPersonaFisica = COT.IdObjetoTributario AND TOT.IdTipoObjetoTributario = 8
    --WHERE CC.Periodo IN (2024, 2025)
),
CTE_Creditos AS (
    SELECT
             CRE.IdCreditosOT,
             CRE.Importe,
             CRE.ImporteAplicado,
             (CRE.Importe - CRE.ImporteAplicado) as Saldo,
             CRE.FechaOrigen,
             CRE.Periodo,
             CRE.Cuota,
             T.Tasa,
             T.Subtasa,
             T.Item,
             TOT.IdTipoObjetoTributario,
             CAST(CASE
                      WHEN TOT.IdTipoObjetoTributario = 1 THEN CAST(A.Dominio AS VARCHAR(50))
                      WHEN TOT.IdTipoObjetoTributario = 2 THEN CAST(M.PatenteProvincia AS VARCHAR(50))
                      WHEN TOT.IdTipoObjetoTributario = 3 THEN CAST(C.Cuenta AS VARCHAR(50))
                      WHEN TOT.IdTipoObjetoTributario = 4 THEN CAST(I.Cuenta AS VARCHAR(50)) + RIGHT('00' + CAST(I.SubCuenta AS VARCHAR), 2)
                      WHEN TOT.IdTipoObjetoTributario IN (5, 6) THEN CAST(CO.Legajo AS VARCHAR(50)) + RIGHT('00' + CAST(CO.Sublegajo AS VARCHAR), 2)
                      WHEN TOT.IdTipoObjetoTributario = 8 THEN CAST(PF.NumeroDocumento AS VARCHAR(50))
                      ELSE NULL
                 END AS VARCHAR(50)) AS NUMERO_CUENTA_BASE,
             ROW_NUMBER() OVER (ORDER BY CRE.IdCreditosOT) + 900000000 AS NumeroComprobanteAutonumerico
         FROM CreditosOT CRE
                  JOIN Rentas.dbo.TipoObjetoTributario TOT ON TOT.IdTipoObjetoTributario = CRE.IdTipoObjetoTributario
                  LEFT JOIN Rentas.dbo.Tasas T ON T.IdTasa = CRE.IdTasa
                  LEFT JOIN Rentas.dbo.Automotores A ON A.IdAutomotor = CRE.IdObjetoTributario AND TOT.IdTipoObjetoTributario = 1
                  LEFT JOIN Rentas.dbo.Motos M ON M.IdMoto = CRE.IdObjetoTributario AND TOT.IdTipoObjetoTributario = 2
                  LEFT JOIN Rentas.dbo.Cementerios C ON C.IdCementerio = CRE.IdObjetoTributario AND TOT.IdTipoObjetoTributario = 3
                  LEFT JOIN Rentas.dbo.Inmuebles I ON I.IdInmueble = CRE.IdObjetoTributario AND TOT.IdTipoObjetoTributario = 4
                  LEFT JOIN Rentas.dbo.Comercios CO ON CO.IdComercio = CRE.IdObjetoTributario AND TOT.IdTipoObjetoTributario IN (5, 6)
                  LEFT JOIN Rentas.dbo.PersonasFisicas PF ON PF.IdPersonaFisica = CRE.IdObjetoTributario AND TOT.IdTipoObjetoTributario = 8
         WHERE CRE.Activo = 1 AND CRE.Fechabaja IS NULL AND CRE.IdAdministradorBaja IS NULL
)

SELECT
    CAST(CASE IdTipoObjetoTributario
        WHEN 1 THEN 5 WHEN 2 THEN 5 WHEN 3 THEN 3 WHEN 4 THEN 1
        WHEN 5 THEN 2 WHEN 6 THEN 2 WHEN 7 THEN 7 WHEN 8 THEN 7
        ELSE NULL
    END AS NUMERIC(18,0)) AS COD_TIPO_TRIBUTO,

    RIGHT(REPLICATE('0', 20) + ISNULL(NUMERO_CUENTA_BASE, ''), 20) AS NUMERO_CUENTA,

    CAST(IdCuentaCorriente AS NUMERIC(18,0)) AS NUMERO_PARTIDA,
    CAST('' AS VARCHAR(50)) AS COD_RUBRO,
    CAST(Tasa AS VARCHAR(50)) AS COD_TASA,
    CAST(ISNULL(CAST(Subtasa AS VARCHAR), '') + ISNULL(Tipo, '') AS VARCHAR(50)) AS COD_SUBTASA,
    CAST(Periodo AS VARCHAR(50)) AS PERIODO,
    CAST(Cuota AS NUMERIC(18,0)) AS CUOTA,

    CAST(CASE
        WHEN ISNULL(Tipo, '') = '' OR Tipo = 'C' THEN 'SI'
        ELSE 'NO'
    END AS VARCHAR(50)) AS TASA_CABECERA,

    CAST(
    CASE 
        WHEN Importe > 0 AND IdEmision IS NOT NULL THEN 1       -- Emisión
        WHEN Importe > 0 AND IdEmision IS NULL THEN 3           -- Débito
        WHEN Importe < 0 THEN 4                                 -- Crédito
        ELSE NULL
    END AS NUMERIC(18,0)) AS COD_TIPO_MOVIMIENTO,
    CAST(CASE WHEN Importe > 0 THEN Importe ELSE 0 END AS NUMERIC(18,2)) AS IMPORTE_DEBE,
    CAST(CASE WHEN Importe < 0 THEN ABS(Importe) ELSE 0 END AS NUMERIC(18,2)) AS IMPORTE_HABER,
    CAST([1erVencimiento] AS DATETIME) AS FECHA_VENCIMIENTO1,
    CAST([1erVencimiento] AS DATETIME) AS FECHA_VENCIMIENTO2,
    CAST('' AS VARCHAR(50)) AS NUMERO_EMISION,
    CAST(IdApremio AS NUMERIC(18,0)) AS NUMERO_CERTIFICADO_APREMIO,
    CAST(IdMoratoria AS NUMERIC(18,0)) AS COD_PLAN_PAGO,
    CAST('00' AS VARCHAR(50)) AS CODIGO_DELEGACION,
    CAST(COALESCE(NumeroComprobante, NumeroComprobanteAutonumerico) AS NUMERIC(18,0)) AS NUMERO_MOVIMIENTO,
    CAST(ROW_NUMBER() OVER (PARTITION BY IdCuentaCorriente ORDER BY IdCuentaCorrienteDetalle) AS NUMERIC(18,0)) AS NUMERO_ITEM,
    CAST(NULL AS NUMERIC(18,0)) AS COD_LUGAR_PAGO,
    CAST('Emision Legacy ' + ISNULL(CONVERT(VARCHAR(250), IdEmision), '') AS VARCHAR(250)) AS DETALLE,
    CAST('' AS VARCHAR(250)) AS USUARIO_PROCESO,
    CAST(FechaAlta AS DATETIME) AS FECHA_PROCESO,
    CAST(fechapago AS DATETIME) AS FECHA_COBRO
FROM CTE_CuentaCorrienteDetalle
WHERE NUMERO_CUENTA_BASE IS NOT NULL

UNION ALL

SELECT
    CAST(CASE IdTipoObjetoTributario
        WHEN 1 THEN 5 WHEN 2 THEN 5 WHEN 3 THEN 3 WHEN 4 THEN 1
        WHEN 5 THEN 2 WHEN 6 THEN 2 WHEN 7 THEN 7 WHEN 8 THEN 7
        ELSE NULL
    END AS NUMERIC(18,0)) AS COD_TIPO_TRIBUTO,

    RIGHT(REPLICATE('0', 20) + ISNULL(NUMERO_CUENTA_BASE, ''), 20) AS NUMERO_CUENTA,

    CAST(IdCuentaCorriente AS NUMERIC(18,0)) AS NUMERO_PARTIDA,
    CAST('' AS VARCHAR(50)) AS COD_RUBRO,
    CAST(Tasa AS VARCHAR(50)) AS COD_TASA,
    CAST(ISNULL(CAST(Subtasa AS VARCHAR), '') + ISNULL(Tipo, '') AS VARCHAR(50)) AS COD_SUBTASA,
    CAST(Periodo AS VARCHAR(50)) AS PERIODO,
    CAST(Cuota AS NUMERIC(18,0)) AS CUOTA,

    CAST(CASE
        WHEN ISNULL(Tipo, '') = '' OR Tipo = 'C' THEN 'SI'
        ELSE 'NO'
    END AS VARCHAR(50)) AS TASA_CABECERA,

    CAST(
    CASE
        WHEN Importe > 0 THEN 3          -- Débito
        WHEN Importe < 0 THEN 2          -- Cancelado por recaudación
        ELSE NULL
    END AS NUMERIC(18,0)) AS COD_TIPO_MOVIMIENTO,
    CAST(CASE WHEN Importe > 0 THEN Importe ELSE 0 END AS NUMERIC(18,2)) AS IMPORTE_DEBE,
    CAST(CASE WHEN Importe < 0 THEN ABS(Importe) ELSE 0 END AS NUMERIC(18,2)) AS IMPORTE_HABER,
    CAST([1erVencimiento] AS DATETIME) AS FECHA_VENCIMIENTO1,
    CAST([1erVencimiento] AS DATETIME) AS FECHA_VENCIMIENTO2,
    CAST('' AS VARCHAR(50)) AS NUMERO_EMISION,
    CAST(IdApremio AS NUMERIC(18,0)) AS NUMERO_CERTIFICADO_APREMIO,
    CAST(IdMoratoria AS NUMERIC(18,0)) AS COD_PLAN_PAGO,
    CAST('00' AS VARCHAR(50)) AS CODIGO_DELEGACION,
    CAST(COALESCE(NumeroComprobante, NumeroComprobanteAutonumerico) AS NUMERIC(18,0)) AS NUMERO_MOVIMIENTO,
    CAST(ROW_NUMBER() OVER (PARTITION BY IdCuentaCorriente ORDER BY IdPago) AS NUMERIC(18,0)) AS NUMERO_ITEM,
    CAST(BocaPago AS NUMERIC(18,0)) AS COD_LUGAR_PAGO,
    CAST('Emision Legacy ' + ISNULL(CONVERT(VARCHAR(250), IdEmision), '') AS VARCHAR(250)) AS DETALLE,
    CAST('' AS VARCHAR(250)) AS USUARIO_PROCESO,
    CAST(FechaAlta AS DATETIME) AS FECHA_PROCESO,
    CAST(Fecha AS DATETIME) AS FECHA_COBRO
FROM CTE_Pagos
WHERE NUMERO_CUENTA_BASE IS NOT NULL

UNION ALL

SELECT
    CAST(CASE IdTipoObjetoTributario
             WHEN 1 THEN 5 WHEN 2 THEN 5 WHEN 3 THEN 3 WHEN 4 THEN 1
             WHEN 5 THEN 2 WHEN 6 THEN 2 WHEN 7 THEN 7 WHEN 8 THEN 7
             ELSE NULL
        END AS NUMERIC(18,0)) AS COD_TIPO_TRIBUTO,

    RIGHT(REPLICATE('0', 20) + ISNULL(NUMERO_CUENTA_BASE, ''), 20) AS NUMERO_CUENTA,
    CAST(IdCreditosOT AS NUMERIC(18,0)) AS NUMERO_PARTIDA,
    CAST('' AS VARCHAR(50)) AS COD_RUBRO,
    CAST(Tasa AS VARCHAR(50)) AS COD_TASA,
    CAST(ISNULL(CAST(Subtasa AS VARCHAR), '') + ISNULL(Item, '') AS VARCHAR(50)) AS COD_SUBTASA,
    CAST(Periodo AS VARCHAR(50)) AS PERIODO,
    CAST(Cuota AS NUMERIC(18,0)) AS CUOTA,

    CAST(CASE
             WHEN ISNULL(Item, '') = '' OR Item = 'C' THEN 'SI'
             ELSE 'NO'
        END AS VARCHAR(50)) AS TASA_CABECERA,

    CAST(4 AS NUMERIC(18,0)) AS COD_TIPO_MOVIMIENTO,
    0 AS IMPORTE_DEBE,
    CAST(Saldo AS NUMERIC(18,2)) AS IMPORTE_HABER,
    CAST([FechaOrigen] AS DATETIME) AS FECHA_VENCIMIENTO1,
    CAST([FechaOrigen] AS DATETIME) AS FECHA_VENCIMIENTO2,
    CAST('' AS VARCHAR(50)) AS NUMERO_EMISION,
    CAST(0 AS NUMERIC(18,0)) AS NUMERO_CERTIFICADO_APREMIO,
    CAST(0 AS NUMERIC(18,0)) AS COD_PLAN_PAGO,
    CAST('00' AS VARCHAR(50)) AS CODIGO_DELEGACION,
    CAST(NumeroComprobanteAutonumerico AS NUMERIC(18,0)) AS NUMERO_MOVIMIENTO,
    CAST(ROW_NUMBER() OVER (PARTITION BY IdCreditosOT ORDER BY IdCreditosOT) AS NUMERIC(18,0)) AS NUMERO_ITEM,
    CAST(0 AS NUMERIC(18,0)) AS COD_LUGAR_PAGO,
    CAST('Credito ' + ISNULL(CONVERT(VARCHAR(250), IdCreditosOT), '') AS VARCHAR(250)) AS DETALLE,
    CAST('' AS VARCHAR(250)) AS USUARIO_PROCESO,
    CAST(FechaOrigen AS DATETIME) AS FECHA_PROCESO,
    CAST(FechaOrigen AS DATETIME) AS FECHA_COBRO
FROM CTE_Creditos
WHERE NUMERO_CUENTA_BASE IS NOT NULL