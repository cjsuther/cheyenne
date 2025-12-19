--id_direccion_entrega
update cuenta
set
	id_direccion_entrega=dr.id
from
	zona_entrega ze
	inner join tipo_controlador tc on tc.id=ze.id_tipo_controlador and tc.direccion=true
	inner join direccion dr on dr.entidad='ZonaEntrega' and dr.id_entidad=ze.id
where
	ze.id_cuenta=cuenta.id;

--id_direccion_principal
update cuenta
set
	id_direccion_principal=dr.id
from
	lado_terreno lt
	inner join direccion dr on dr.entidad='LadoTerreno' and dr.id_entidad=lt.id
where
	lt.id_inmueble=cuenta.id_tributo and cuenta.id_tipo_tributo=10 and
	lt.id_tipo_lado=40; --frente
	
--id_contribuyente_principal
UPDATE cuenta
SET id_contribuyente_principal=cc.id_contribuyente
FROM
(
	select
		cc.id_cuenta,
		cc.id_contribuyente,
		co.id_persona
	from
		contribuyente_cuenta cc
		inner join contribuyente co on co.id=cc.id_contribuyente
) cc
inner join (
	select 10 id_tipo_tributo, id_inmueble id_tributo, min(id_persona) id_persona from vinculo_inmueble where id_tipo_vinculo_inmueble=51 group by id_inmueble
	union
	select 11 id_tipo_tributo, id_comercio id_tributo, min(id_persona) id_persona from vinculo_comercio where id_tipo_vinculo_comercio=61 group by id_comercio
	union
	select 12 id_tipo_tributo, id_vehiculo id_tributo, min(id_persona) id_persona from vinculo_vehiculo where id_tipo_vinculo_vehiculo=71 group by id_vehiculo
	union
	select 13 id_tipo_tributo, id_cementerio id_tributo, min(id_persona) id_persona from vinculo_cementerio where id_tipo_vinculo_cementerio=81 group by id_cementerio
	union
	select 14 id_tipo_tributo, id_fondeadero id_tributo, min(id_persona) id_persona from vinculo_fondeadero where id_tipo_vinculo_fondeadero=91 group by id_fondeadero
) vc on vc.id_persona=cc.id_persona
WHERE
	cc.id_cuenta=cuenta.id and
	vc.id_tipo_tributo=cuenta.id_tipo_tributo and
	vc.id_tributo=cuenta.id_tributo;
	
--fecha_carga_fin
update inmueble set fecha_carga_fin=now() where fecha_carga_fin is null;
update comercio set fecha_carga_fin=now() where fecha_carga_fin is null;
update vehiculo set fecha_carga_fin=now() where fecha_carga_fin is null;
update cementerio set fecha_carga_fin=now() where fecha_carga_fin is null;
update fondeadero set fecha_carga_fin=now() where fecha_carga_fin is null;
