SELECT DISTINCT
    -- Legajo + sublegajo (2 dígitos)
    CAST(co.Legajo AS varchar(20))
        + RIGHT('00' + CAST(co.Sublegajo AS varchar(10)), 2)        AS numero_cuenta,
    REPLACE(REPLACE(LTRIM(RTRIM(CAST(co.CUIT AS varchar(50)))),'-',''),' ','') AS cuitContribuyente,
    LTRIM(RTRIM(b.Codigo))                                           AS codigo_banco,
    REPLACE(
            REPLACE(
                    LTRIM(RTRIM(CAST(cdb.CBU1 AS varchar(16))))
                        + LTRIM(RTRIM(CAST(cdb.CBU2 AS varchar(20))))
                ,' ','')
        ,'-','')                                                         AS cbu,
    CAST(mo.FechaAlta AS datetime2(3))                                AS fecha_alta
FROM Hacienda.dbo.Monotasa mo
         JOIN Rentas.dbo.Comercios co
              ON co.IdComercio = mo.IdComercio
         JOIN Hacienda.dbo.ContribuyentesDatosBanco cdb
              ON cdb.IdContribuyenteDatosBanco = mo.IdContribuyenteDatosBanco
         JOIN Hacienda.dbo.Bancos b
              ON b.IdBanco = cdb.IdBanco
WHERE mo.FechaBaja IS NULL
  AND ISNULL(mo.IdAdministradorBaja, 0) = 0
  AND cdb.FechaBaja IS NULL
  AND ISNULL(cdb.IdAdministradorBaja, 0) = 0
  AND mo.IdContribuyenteDatosBanco IS NOT NULL
  AND LTRIM(RTRIM(ISNULL(cdb.CBU1,''))) <> ''
  AND LTRIM(RTRIM(ISNULL(cdb.CBU2,''))) <> ''
-- Sirve para asegurar 22 dígitos de CBU.
--  AND LEN(REPLACE(REPLACE(LTRIM(RTRIM(cdb.CBU1)) + LTRIM(RTRIM(cdb.CBU2)),' ',''),'-','')) = 22
ORDER BY numero_cuenta;
