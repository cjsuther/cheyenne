USE LARAMIE_CAMPANA
GO

DELETE vc
FROM variable_cuenta vc
INNER JOIN variable v
    ON v.id = vc.id_variable
WHERE v.codigo = 'ORDENAMIENTO'
GO

--Variables de Inmuebles (constantes) (extras)
INSERT INTO variable(id, codigo, descripcion, id_tipo_tributo, tipo_dato, constante, predefinido, opcional, activo, global,lista)
VALUES
(906,'ORDENAMIENTO','Ordenamiento',10,'string',1,1,0,1,0,'');

INSERT INTO variable_cuenta (
    id,
    id_variable,
    id_cuenta,
    valor,
    fecha_desde,
    fecha_hasta
)
SELECT
    ROW_NUMBER() OVER (ORDER BY CC.COD_TIPO_TRIBUTO, CC.NUMERO_CUENTA) + (
        SELECT ISNULL(MAX(id),0) FROM variable_cuenta
    ) AS id,
    V.id AS id_variable,
    C.id AS id_cuenta,
    ISNULL(CC.ORDEN,'') AS valor,
    NULL,
    NULL
FROM MAJOR_CAMPANA.dbo.CONTROLADOR_CUENTA CC
    LEFT JOIN MAJOR_CAMPANA.dbo.LISTA L
        ON L.NOMBRE = 'TipoTributo' AND L.CODIGO = CC.COD_TIPO_TRIBUTO
    LEFT JOIN LARAMIE_CAMPANA.dbo.variable V
        ON V.codigo = 'ORDENAMIENTO' AND V.id_tipo_tributo = L.id
    LEFT JOIN LARAMIE_CAMPANA.dbo.cuenta C
        ON C.numero_cuenta = CC.NUMERO_CUENTA AND C.id_tipo_tributo = L.id
ORDER BY id
GO
