DO $$
BEGIN
    INSERT INTO condicion_especial (
        id_cuenta,
        id_tipo_condicion_especial,
        fecha_desde,
        fecha_hasta
    )
    SELECT DISTINCT
        dji.id_cuenta,
        tce.id,
        DATE '2025-01-01',
        NULL::timestamp
    FROM declaracion_jurada_item dji
    INNER JOIN tipo_condicion_especial tce
        ON (
            (dji.id_clase_declaracion_jurada = 1 AND tce.codigo = 'DDJJ_ENR') OR
            (dji.id_clase_declaracion_jurada = 2 AND tce.codigo = 'DDJJ_EC') OR
            (dji.id_clase_declaracion_jurada = 4 AND tce.codigo = 'DDJJ_MV') OR
            (dji.id_clase_declaracion_jurada = 5 AND tce.codigo = 'DDJJ_TAP')
        )
    WHERE NOT EXISTS (
        SELECT 1
        FROM condicion_especial ce
        WHERE ce.id_cuenta = dji.id_cuenta
          AND ce.id_tipo_condicion_especial = tce.id
          AND ce.fecha_desde = DATE '2025-01-01'
    );
END $$;
