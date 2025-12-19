UPDATE cuenta
SET numero_web = LPAD(FLOOR(random() * 900000 + 100000)::text, 6, '0')
WHERE numero_web IS NULL
   OR TRIM(numero_web) = ''
   OR LENGTH(TRIM(numero_web)) != 6
   OR numero_web ~ '[^0-9]';
