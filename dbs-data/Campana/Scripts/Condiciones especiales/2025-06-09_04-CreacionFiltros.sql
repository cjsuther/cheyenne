-- Filtro para comercio que aplica DDJJ - Envases NR

CREATE FUNCTION filtro_comercio_ddjj_envases()
RETURNS TABLE(id bigint)
LANGUAGE plpgsql
AS
$$
DECLARE
    v_today timestamp;
    v_codigo_tipo_ce varchar(50);
    v_id_tipo_ce bigint;
BEGIN
    SELECT DATE(now()) INTO v_today;
    SELECT q.valor INTO v_codigo_tipo_ce FROM configuracion q WHERE q.nombre = 'TipoCondicionEspecialDDJJEnvasesNR';
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

ALTER FUNCTION filtro_comercio_ddjj_envases() OWNER TO postgres;

-- Filtro para comercio que aplica DDJJ - TAP

CREATE FUNCTION filtro_comercio_ddjj_tap()
RETURNS TABLE(id bigint)
LANGUAGE plpgsql
AS
$$
DECLARE
    v_today timestamp;
    v_codigo_tipo_ce varchar(50);
    v_id_tipo_ce bigint;
BEGIN
    SELECT DATE(now()) INTO v_today;
    SELECT q.valor INTO v_codigo_tipo_ce FROM configuracion q WHERE q.nombre = 'TipoCondicionEspecialDDJJAlumbrado';
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

ALTER FUNCTION filtro_comercio_ddjj_tap() OWNER TO postgres;

-- Filtro para comercio que aplica DDJJ - Explotación Canteras

CREATE FUNCTION filtro_comercio_ddjj_explotacion_canteras()
RETURNS TABLE(id bigint)
LANGUAGE plpgsql
AS
$$
DECLARE
    v_today timestamp;
    v_codigo_tipo_ce varchar(50);
    v_id_tipo_ce bigint;
BEGIN
    SELECT DATE(now()) INTO v_today;
    SELECT q.valor INTO v_codigo_tipo_ce FROM configuracion q WHERE q.nombre = 'TipoCondicionEspecialDDJJExplotacionCanteras';
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

ALTER FUNCTION filtro_comercio_ddjj_explotacion_canteras() OWNER TO postgres;

-- Filtro para comercio que aplica DDJJ - Mantenimiento Vial

CREATE FUNCTION filtro_comercio_ddjj_mant_vial()
RETURNS TABLE(id bigint)
LANGUAGE plpgsql
AS
$$
DECLARE
    v_today timestamp;
    v_codigo_tipo_ce varchar(50);
    v_id_tipo_ce bigint;
BEGIN
    SELECT DATE(now()) INTO v_today;
    SELECT q.valor INTO v_codigo_tipo_ce FROM configuracion q WHERE q.nombre = 'TipoCondicionEspecialDDJJMantenimientoVial';
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

ALTER FUNCTION filtro_comercio_ddjj_mant_vial() OWNER TO postgres;
