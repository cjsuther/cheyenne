create function filtro_comercio_ddjj_monotasa()
    returns TABLE(id bigint)
    language plpgsql
as
$$
DECLARE
    v_today timestamp;
    v_codigo_tipo_ce varchar(50);
    v_id_tipo_ce bigint;
BEGIN
    SELECT DATE(now()) INTO v_today;
    SELECT q.valor INTO v_codigo_tipo_ce FROM configuracion q WHERE q.nombre = 'TipoCondicionEspecialMonotasa';
    SELECT q.id INTO v_id_tipo_ce FROM tipo_condicion_especial q WHERE q.codigo = v_codigo_tipo_ce;

    RETURN QUERY
        SELECT ce.id_cuenta AS id
        FROM condicion_especial ce
        WHERE ce.id_tipo_condicion_especial = v_id_tipo_ce
          AND (ce.fecha_desde IS NULL OR ce.fecha_desde <= v_today)
          AND (ce.fecha_hasta IS NULL OR ce.fecha_hasta >= v_today)
        GROUP BY ce.id_cuenta
        ORDER BY ce.id_cuenta;
END
$$;

alter function filtro_comercio_ddjj_monotasa() owner to postgres;

