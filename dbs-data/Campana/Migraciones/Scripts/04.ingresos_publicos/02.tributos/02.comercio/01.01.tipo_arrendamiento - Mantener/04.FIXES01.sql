update comercio
set id_tipo_ubicacion=2
where id in (select id_comercio from espacio_arrendado)
