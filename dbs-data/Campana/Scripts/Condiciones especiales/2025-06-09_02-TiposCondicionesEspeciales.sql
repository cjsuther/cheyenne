INSERT INTO tipo_condicion_especial (
    id, codigo, nombre, orden, id_tipo_tributo, tipo, color, inhibicion
)
SELECT 3000009, 'DDJJ_ENR', 'Aplica DDJJ - Envases NR', 1, 11, 0, 'FFFFFF', false
WHERE NOT EXISTS (
    SELECT 1 FROM tipo_condicion_especial WHERE codigo = 'DDJJ_ENR'
);

INSERT INTO tipo_condicion_especial (
    id, codigo, nombre, orden, id_tipo_tributo, tipo, color, inhibicion
)
SELECT 3000010, 'DDJJ_MV', 'Aplica DDJJ - Mant Vial', 2, 11, 0, 'FFFFFF', false
WHERE NOT EXISTS (
    SELECT 1 FROM tipo_condicion_especial WHERE codigo = 'DDJJ_MV'
);

INSERT INTO tipo_condicion_especial (
    id, codigo, nombre, orden, id_tipo_tributo, tipo, color, inhibicion
)
SELECT 3000011, 'DDJJ_TAP', 'Aplica DDJJ - TAP', 3, 11, 0, 'FFFFFF', false
WHERE NOT EXISTS (
    SELECT 1 FROM tipo_condicion_especial WHERE codigo = 'DDJJ_TAP'
);

INSERT INTO tipo_condicion_especial (
    id, codigo, nombre, orden, id_tipo_tributo, tipo, color, inhibicion
)
SELECT 3000012, 'DDJJ_EC', 'Aplica DDJJ - Explotación Canteras', 4, 11, 0, 'FFFFFF', false
WHERE NOT EXISTS (
    SELECT 1 FROM tipo_condicion_especial WHERE codigo = 'DDJJ_EC'
);
