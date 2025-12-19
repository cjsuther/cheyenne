DO $$
DECLARE
  last_id bigint;
BEGIN
  -- Obtener el último ID actual de la tabla
  SELECT MAX(id) INTO last_id FROM cuenta_corriente_item;

  -- Si no hay registros, iniciar en 1 (sin marcar como ya usado)
  IF last_id IS NULL THEN
    PERFORM setval('cuenta_corriente_item_id_seq', 1, false);
  ELSE
    -- Si hay registros, actualizar la secuencia al último ID
    PERFORM setval('cuenta_corriente_item_id_seq', last_id, true);
  END IF;
END $$;
