-- Actualización de números de cuenta para eliminar ceros a la izquierda

UPDATE cuenta
SET numero_cuenta = CASE
  WHEN id_tipo_tributo = 12 THEN
    CASE
      WHEN LENGTH(LTRIM(numero_cuenta, '0')) < 6 THEN
        LPAD(LTRIM(numero_cuenta, '0'), 6, '0')
      ELSE
        LTRIM(numero_cuenta, '0')
    END
  ELSE
    LTRIM(numero_cuenta, '0')
END;
