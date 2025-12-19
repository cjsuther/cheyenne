TRUNCATE TABLE contribuyente CASCADE;

INSERT INTO contribuyente(id, id_persona, fecha_alta)
 SELECT id_persona, id_persona, now()
 FROM (
	 SELECT id_persona FROM vinculo_inmueble WHERE id_tipo_vinculo_inmueble in (50,51) UNION
	 SELECT id_persona FROM vinculo_comercio WHERE id_tipo_vinculo_comercio in (60,61) UNION
	 SELECT id_persona FROM vinculo_vehiculo WHERE id_tipo_vinculo_vehiculo in (70,71) UNION
	 SELECT id_persona FROM vinculo_cementerio WHERE id_tipo_vinculo_cementerio in (80,81) UNION
	 SELECT id_persona FROM vinculo_fondeadero WHERE id_tipo_vinculo_fondeadero in (90,91)
 )
 ORDER BY id_persona;
 
INSERT INTO contribuyente_cuenta(id_contribuyente, id_cuenta)
 SELECT v.id_persona, c.id_cuenta FROM vinculo_inmueble v inner join inmueble c on c.id=v.id_inmueble
 WHERE v.id_tipo_vinculo_inmueble in (50,51)
UNION
 SELECT v.id_persona, c.id_cuenta FROM vinculo_comercio v inner join comercio c on c.id=v.id_comercio
 WHERE v.id_tipo_vinculo_comercio in (60,61)
UNION
 SELECT v.id_persona, c.id_cuenta FROM vinculo_vehiculo v inner join vehiculo c on c.id=v.id_vehiculo
 WHERE v.id_tipo_vinculo_vehiculo in (70,71)
UNION
 SELECT v.id_persona, c.id_cuenta FROM vinculo_cementerio v inner join cementerio c on c.id=v.id_cementerio
 WHERE v.id_tipo_vinculo_cementerio in (80,81)
UNION
 SELECT v.id_persona, c.id_cuenta FROM vinculo_fondeadero v inner join fondeadero c on c.id=v.id_fondeadero
 WHERE v.id_tipo_vinculo_fondeadero in (90,91);
