USE LARAMIE_CAMPANA;
GO

TRUNCATE TABLE dbo.cartel;
GO

;WITH src AS (
    SELECT
        A.*,
        -- Normalizo TODAS las claves de join a texto limpio (trim, vacío->NULL)
        NULLIF(LTRIM(RTRIM(CAST(A.COD_TIPO_CARTEL        AS varchar(50)))), '') AS k_tipo_cartel,
        NULLIF(LTRIM(RTRIM(CAST(A.COD_TIPO_PROPIEDAD     AS varchar(50)))), '') AS k_tipo_propiedad,
        NULLIF(LTRIM(RTRIM(CAST(A.COD_BLOQUEO_EMISION    AS varchar(50)))), '') AS k_bloqueo_emision,
        NULLIF(LTRIM(RTRIM(CAST(A.COD_MOTIVO_BAJA_COMERCIO AS varchar(50)))), '') AS k_motivo_baja,
        NULLIF(LTRIM(RTRIM(CAST(A.COD_TIPO_ANUNCIO      AS varchar(50)))), '') AS k_tipo_anuncio,
        NULLIF(LTRIM(RTRIM(CAST(A.COD_TIPO_DDJJ         AS varchar(50)))), '') AS k_tipo_ddjj,
        NULLIF(LTRIM(RTRIM(CAST(A.COD_CATEGORIA_UBICACION AS varchar(50)))), '') AS k_categoria_ubicacion,
        NULLIF(LTRIM(RTRIM(CAST(A.COD_TASA              AS varchar(50)))), '') AS k_tasa,
        NULLIF(LTRIM(RTRIM(CAST(A.COD_SUB_TASA          AS varchar(50)))), '') AS k_sub_tasa
    FROM MAJOR_CAMPANA.dbo.CARTEL A
)

INSERT INTO dbo.cartel (
    id, id_comercio, numero, id_tipo_anuncio, id_tipo_cartel, id_tipo_propiedad,
    id_origen_declaracion_jurada, id_categoria_ubicacion,
    anuncio, marquesina, cantidad_publicidades,
    fecha_inicio, fecha_resolucion, numero_ddjj, fecha_ddjj, anio_ddjj, mes_ddjj,
    catastral_cir, catastral_sec, catastral_cod, catastral_chacra, catastral_lchacra,
    catastral_quinta, catastral_lquinta, catastral_frac, catastral_lfrac, catastral_manz,
    catastral_lmanz, catastral_parc, catastral_lparc, catastral_subparc, catastral_ufunc,
    catastral_ucomp, id_cuenta_inmueble, id_tasa, id_sub_tasa,
    alto, ancho, id_motivo_baja_comercio, fecha_baja, id_bloqueo_emision,
    id_tipo_producto_publicitado, superficie, direccion
)
SELECT
    ROW_NUMBER() OVER (ORDER BY S.NUMERO_CUENTA_COMERCIO, S.NUMERO) AS id,
    com.ID                                                                                  AS id_comercio,
    COALESCE(TRY_CONVERT(int, NULLIF(LTRIM(RTRIM(S.NUMERO)), '')), 0)                       AS numero,

    anu.ID                                                                                  AS id_tipo_anuncio,
    tca.ID                                                                                  AS id_tipo_cartel,
    tpr.ID                                                                                  AS id_tipo_propiedad,
    odj.ID                                                                                  AS id_origen_declaracion_jurada,
    ubi.ID                                                                                  AS id_categoria_ubicacion,

    COALESCE(NULLIF(LTRIM(RTRIM(CAST(S.ANUNCIO AS nvarchar(250)))), ''), N'')               AS anuncio,

    COALESCE(
        TRY_CONVERT(int, NULLIF(LTRIM(RTRIM(S.MARQUESINA)), '')),
        CASE
            WHEN UPPER(LTRIM(RTRIM(CAST(S.MARQUESINA AS nvarchar(10))))) IN (N'S',N'SI',N'Y',N'YES',N'T',N'TRUE') THEN 1
            WHEN UPPER(LTRIM(RTRIM(CAST(S.MARQUESINA AS nvarchar(10))))) IN (N'N',N'NO',N'F',N'FALSE')             THEN 0
        END,
        0
    )                                                                                       AS marquesina,

    COALESCE(TRY_CONVERT(int, NULLIF(LTRIM(RTRIM(S.CANTIDAD_PUBLICIDADES)), '')), 0)        AS cantidad_publicidades,

    MAJOR_CAMPANA.dbo.GET_FECHA(S.FECHA_INICIO)                                             AS fecha_inicio,
    MAJOR_CAMPANA.dbo.GET_FECHA(S.FECHA_RESOLUCION)                                         AS fecha_resolucion,

    COALESCE(NULLIF(LTRIM(RTRIM(CAST(S.NUMERO_DDJJ AS nvarchar(20)))), ''), N'')             AS numero_ddjj,
    MAJOR_CAMPANA.dbo.GET_FECHA(S.FECHA_DDJJ)                                               AS fecha_ddjj,

    COALESCE(NULLIF(LTRIM(RTRIM(CAST(S.ANIO_DDJJ AS nvarchar(20)))), ''), N'')               AS anio_ddjj,
    COALESCE(TRY_CONVERT(int, NULLIF(LTRIM(RTRIM(S.MES_DDJJ)), '')), 0)                      AS mes_ddjj,

    S.CATASTRAL_CIR, S.CATASTRAL_SEC, S.CATASTRAL_COD, S.CATASTRAL_CHACRA, S.CATASTRAL_LCHACRA,
    S.CATASTRAL_QUINTA, S.CATASTRAL_LQUINTA, S.CATASTRAL_FRAC, S.CATASTRAL_LFRAC, S.CATASTRAL_MANZ,
    S.CATASTRAL_LMANZ, S.CATASTRAL_PARC, S.CATASTRAL_LPARC, S.CATASTRAL_SUBPARC, S.CATASTRAL_UFUNC, S.CATASTRAL_UCOMP,

    inm.ID                                                                                  AS id_cuenta_inmueble,
    tas.ID                                                                                  AS id_tasa,
    stas.ID                                                                                 AS id_sub_tasa,

    COALESCE(
        TRY_CONVERT(decimal(18,2), NULLIF(LTRIM(RTRIM(REPLACE(REPLACE(CAST(S.ALTO      AS nvarchar(100)), ',', '.'), ' ', ''))), '')),
        0
    )                                                                                       AS alto,
    COALESCE(
        TRY_CONVERT(decimal(18,2), NULLIF(LTRIM(RTRIM(REPLACE(REPLACE(CAST(S.ANCHO     AS nvarchar(100)), ',', '.'), ' ', ''))), '')),
        0
    )                                                                                       AS ancho,

    baja.ID                                                                                 AS id_motivo_baja_comercio,
    MAJOR_CAMPANA.dbo.GET_FECHA(S.FECHA_BAJA)                                               AS fecha_baja,
    bloq.ID                                                                                 AS id_bloqueo_emision,

    1590                                                                                     AS id_tipo_producto_publicitado,

    COALESCE(
        TRY_CONVERT(decimal(18,2), NULLIF(LTRIM(RTRIM(REPLACE(REPLACE(CAST(S.SUPERFICIE AS nvarchar(100)), ',', '.'), ' ', ''))), '')),
        0
    )                                                                                       AS superficie,

    MAJOR_CAMPANA.dbo.GET_DOMICILIO(
        S.CALLE, S.ALTURA, S.PISO, S.DEPTO, S.CP,
        CASE WHEN L.IdLocalidad IS NULL THEN 0 ELSE L.IdLocalidad END,
        CASE WHEN R.IdProvincia IS NULL THEN 0 ELSE R.IdProvincia END,
        CASE WHEN R.IdProvincia IS NULL THEN 0 ELSE 1 END
    )                                                                                       AS direccion
FROM src S
LEFT JOIN LARAMIE_CAMPANA.dbo.comercio com
       ON com.numero_cuenta = S.NUMERO_CUENTA_COMERCIO
LEFT JOIN LARAMIE_CAMPANA.dbo.inmueble inm
       ON inm.numero_cuenta = S.NUMERO_CUENTA_INMUEBLE

-- TODOS los JOINs por CODIGO pasan a TEXTO explícito (evita varchar→numeric implícito)
LEFT JOIN LARAMIE_CAMPANA.dbo.tipo_anuncio anu
       ON CAST(anu.codigo AS varchar(50)) = S.k_tipo_anuncio
LEFT JOIN LARAMIE_CAMPANA.dbo.origen_declaracion_jurada odj
       ON CAST(odj.codigo AS varchar(50)) = S.k_tipo_ddjj
LEFT JOIN LARAMIE_CAMPANA.dbo.categoria_ubicacion ubi
       ON CAST(ubi.codigo AS varchar(50)) = S.k_categoria_ubicacion
LEFT JOIN LARAMIE_CAMPANA.dbo.tasa tas
       ON CAST(tas.codigo AS varchar(50)) = S.k_tasa
LEFT JOIN LARAMIE_CAMPANA.dbo.sub_tasa stas
       ON CAST(stas.codigo AS varchar(50)) = S.k_sub_tasa
      AND stas.id_tasa = tas.id

LEFT JOIN MAJOR_CAMPANA.dbo.LISTA tca
       ON tca.NOMBRE='TipoCartel'
      AND CAST(tca.CODIGO AS varchar(50)) = S.k_tipo_cartel
LEFT JOIN MAJOR_CAMPANA.dbo.LISTA tpr
       ON tpr.NOMBRE='TipoPropiedad'
      AND CAST(tpr.CODIGO AS varchar(50)) = S.k_tipo_propiedad
LEFT JOIN MAJOR_CAMPANA.dbo.LISTA bloq
       ON bloq.NOMBRE='BloqueoEmision'
      AND CAST(bloq.CODIGO AS varchar(50)) = S.k_bloqueo_emision
LEFT JOIN LARAMIE_CAMPANA.dbo.motivo_baja_rubro_comercio baja
       ON CAST(baja.codigo AS varchar(50)) = S.k_motivo_baja

LEFT JOIN MAJOR_CAMPANA_COMPLEMENTO.dbo.Provincias R
       ON R.IdProvincia = 1
LEFT JOIN MAJOR_CAMPANA_COMPLEMENTO.dbo.LocalidadesAgrupado L
       ON TRIM(L.Descripcion)=TRIM(S.LOCALIDAD)
      AND L.IdProvincia = R.IdProvincia
      AND S.LOCALIDAD <> ''
ORDER BY 1;
GO
