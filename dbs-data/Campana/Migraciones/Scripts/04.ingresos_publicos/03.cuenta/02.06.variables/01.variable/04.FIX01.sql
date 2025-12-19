--Variables de Inmuebles (constantes) (extras)
INSERT INTO variable(id, codigo, descripcion, id_tipo_tributo, tipo_dato, constante, predefinido, opcional, activo, global,lista)
VALUES
(900,'CATEGORIA_VIVIENDA','Categoría de Vivienda',10,'string',true,true,false,true,false,''),
(901,'ZONIFICACION','Zonificación',10,'string',true,true,false,true,false,'Zonificacion'),
(902,'BLOQUEO_EMISION','Bloqueo de Emisión',10,'string',true,true,false,true,false,'BloqueoEmision'),
(903,'NIVEL_SOCIO_ECONOMICO','Nivel Socio-Económico',10,'string',true,true,false,true,false,''),
(904,'NIVEL_COMUNICACION','Nivel de Comunicación',10,'string',true,true,false,true,false,''),
(905,'ZONA_TARIFARIA','Zona Tarifaria',10,'string',true,true,false,true,false,'ZonaTarifaria'),
(906,'ORDENAMIENTO','Ordenamiento',10,'string',true,true,false,true,false,'');
/*
--considerarla necesidad de estas
(907,'SUPERFICIE','SUPERFICIE',11,'decimal',false,true,false,true,false,''),
(908,'NUMERO_ACTA','Número de Acta',15,'string',true,false,true,true,false,''),
(909,'DOMINIO_VEHICULO_INFRACCION','Dominio del Vehículo en Infracción',15,'string',true,false,true,true,false,''),
(910,'RECDESC_PORC_SH','Porcentaje de recargo descuento por Seguridad e Higiene',10,'string',true,true,false,true,false,''),
*/