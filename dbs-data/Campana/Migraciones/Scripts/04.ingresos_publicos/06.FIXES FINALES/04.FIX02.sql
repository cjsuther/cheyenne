UPDATE comercio
SET
	numero_cuit=p.numero_documento
FROM
(
	select id_comercio, min(id_persona) id_persona from vinculo_comercio where id_tipo_vinculo_comercio=61 group by id_comercio	
) vc
inner join persona p on p.id=vc.id_persona
where vc.id_comercio = comercio.id;
