USE LARAMIE_CAMPANA
GO

TRUNCATE TABLE observacion_cementerio
GO

INSERT INTO observacion_cementerio
SELECT
    (ROW_NUMBER() OVER (ORDER BY A.NUMERO_CUENTA)) id,
    'Cementerio' entidad,
    cem.ID id_entidad,
    cast(A.OBSERVACIONES as varchar(1000)) detalle,
    1 id_usuario,
    getdate() fecha
FROM
	MAJOR_CAMPANA.dbo.INHUMADO A
	left join LARAMIE_CAMPANA.dbo.cementerio cem on cem.numero_cuenta=A.NUMERO_CUENTA
WHERE len(cast(A.OBSERVACIONES as varchar(1000)))>0
ORDER BY id
GO
