USE LARAMIE_CAMPANA;
GO

INSERT INTO lista_ingresos_publicos
SELECT
    s.ID,
    s.CODIGO,
    s.NOMBRE AS tipo,
    s.VALOR  AS nombre,
    ROW_NUMBER() OVER (ORDER BY s.NOMBRE) AS orden
FROM MAJOR_CAMPANA.dbo.LISTA s
WHERE
    s.NOMBRE IN (
                 'Cementerio',
                 'MotivoBajaVehiculo',
                 'TipoCartel',
                 'TipoCertificado',
                 'TipoDestinoInhumacion',
                 'TipoOrigenInhumacion',
                 'EstadoCivil',
                 'TipoDocumento'
        )
  AND NOT EXISTS (
    SELECT 1
    FROM LARAMIE_CAMPANA.dbo.lista_ingresos_publicos t
    WHERE
       -- mismo id ya presente
        t.id = s.id
       OR
       -- mismo (tipo, codigo, nombre) ignorando mayúsculas/acentos y espacios
        (   LTRIM(RTRIM(t.tipo))   COLLATE Latin1_General_CI_AI = LTRIM(RTRIM(s.NOMBRE)) COLLATE Latin1_General_CI_AI
            AND LTRIM(RTRIM(t.codigo)) COLLATE Latin1_General_CI_AI = LTRIM(RTRIM(s.CODIGO)) COLLATE Latin1_General_CI_AI
            AND LTRIM(RTRIM(t.nombre)) COLLATE Latin1_General_CI_AI = LTRIM(RTRIM(s.VALOR))  COLLATE Latin1_General_CI_AI
            )
)
ORDER BY tipo;
GO
