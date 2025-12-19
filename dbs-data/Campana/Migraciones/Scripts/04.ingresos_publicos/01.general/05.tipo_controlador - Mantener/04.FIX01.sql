UPDATE tipo_controlador SET direccion=true WHERE codigo='1'; --REPARTIDOR
UPDATE tipo_controlador SET abogado=true WHERE codigo='2'; --AGENTE FISCAL
UPDATE tipo_controlador SET abogado=true WHERE codigo='3'; --ABOGADO

INSERT INTO tipo_controlador(id, codigo, nombre, orden, es_supervisor, email, direccion, abogado, oficial_justicia, id_tipo_tributo)
	SELECT 100, '100', 'DOMICILIO ELECTRÓNICO', 100, false, true, false, false, false, null
	WHERE not exists (select id from tipo_controlador where codigo='100')