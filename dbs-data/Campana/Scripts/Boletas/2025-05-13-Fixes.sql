-- Administración

UPDATE persona_fisica SET numero_documento=(replace(numero_documento,'-',''))::numeric(12,0)
WHERE
replace(numero_documento,'-','') ~'^[0-9]+$' and
replace(numero_documento,'-','')::numeric(20,0) > 1000000 and
replace(numero_documento,'-','')::numeric(20,0) < 100000000000;

UPDATE documento SET numero_documento=(replace(numero_documento,'-',''))::numeric(12,0)
WHERE
replace(numero_documento,'-','') ~'^[0-9]+$' and
replace(numero_documento,'-','')::numeric(20,0) > 1000000 and
replace(numero_documento,'-','')::numeric(20,0) < 100000000000;

-- Ingresos públicos
UPDATE persona SET numero_documento=(replace(numero_documento,'-',''))::numeric(12,0)
WHERE
replace(numero_documento,'-','') ~'^[0-9]+$' and
replace(numero_documento,'-','')::numeric(20,0) > 1000000 and
replace(numero_documento,'-','')::numeric(20,0) < 100000000000;

-- Cuentas de tributos
UPDATE cuenta SET numero_cuenta=LPAD(ltrim(numero_cuenta,'0'),GREATEST(6,LENGTH(ltrim(numero_cuenta,'0'))),'0');

-- Vehículos (Dominios)
UPDATE vehiculo SET dominio = dominio_anterior;