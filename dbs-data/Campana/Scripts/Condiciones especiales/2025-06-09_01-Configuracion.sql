INSERT INTO configuracion (id, nombre, valor)
SELECT 3000601, 'TipoCondicionEspecialDDJJExplotacionCanteras', 'DDJJ_EC'
WHERE NOT EXISTS (
    SELECT 1 FROM configuracion WHERE nombre = 'TipoCondicionEspecialDDJJExplotacionCanteras'
);

INSERT INTO configuracion (id, nombre, valor)
SELECT 3000602, 'TipoCondicionEspecialDDJJAlumbrado', 'DDJJ_TAP'
WHERE NOT EXISTS (
    SELECT 1 FROM configuracion WHERE nombre = 'TipoCondicionEspecialDDJJAlumbrado'
);

INSERT INTO configuracion (id, nombre, valor)
SELECT 3000603, 'TipoCondicionEspecialDDJJEnvasesNR', 'DDJJ_ENR'
WHERE NOT EXISTS (
    SELECT 1 FROM configuracion WHERE nombre = 'TipoCondicionEspecialDDJJEnvasesNR'
);

INSERT INTO configuracion (id, nombre, valor)
SELECT 3000604, 'TipoCondicionEspecialDDJJMantenimientoVial', 'DDJJ_MV'
WHERE NOT EXISTS (
    SELECT 1 FROM configuracion WHERE nombre = 'TipoCondicionEspecialDDJJMantenimientoVial'
);