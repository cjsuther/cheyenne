--da de baja todas las ddjj que tuvieron rectificativa
update declaracion_jurada
set fecha_baja=now()
where id in
(
select ddjj.id
from
	declaracion_jurada ddjj
	inner join (
		select
			djc.id_cuenta,
			djc.anio_declaracion,
			djc.mes_declaracion,
			djc.id_modelo_declaracion_jurada,
			max(djc.numero) numero
		from
			declaracion_jurada djc
		group by
			djc.id_cuenta,
			djc.anio_declaracion,
			djc.mes_declaracion,
			djc.id_modelo_declaracion_jurada
	) ddjj_max on
		ddjj_max.id_cuenta=ddjj.id_cuenta and
		ddjj_max.anio_declaracion=ddjj.anio_declaracion and
		ddjj_max.mes_declaracion=ddjj.mes_declaracion and
		ddjj_max.id_modelo_declaracion_jurada=ddjj.id_modelo_declaracion_jurada and
		ddjj_max.numero>ddjj.numero
);
