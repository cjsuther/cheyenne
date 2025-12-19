create or replace function migracion_ddjj()
returns table (
	id_cuenta bigint,
	id_declaracion_jurada bigint,
	id_declaracion_jurada_item bigint,
	id_modelo_declaracion_jurada bigint,
	id_clase_declaracion_jurada bigint,
	codigo_clase_declaracion_jurada varchar(50),
	id_tipo_declaracion_jurada bigint,
	codigo_tipo_declaracion_jurada varchar(50),
	id_rubro bigint,
	valor numeric(18,2),
	periodo int,
	numero int
) as $$
begin
	
	return query
		select
			ddjj.id_cuenta,
			ddjj.id_declaracion_jurada,
			ddjj.id_declaracion_jurada_item,
			ddjj.id_modelo_declaracion_jurada,
			ddjj.id_clase_declaracion_jurada,
			ddjj.codigo_clase_declaracion_jurada,
			ddjj.id_tipo_declaracion_jurada,
			ddjj.codigo_tipo_declaracion_jurada,
			ddjj.id_rubro,
			ddjj.valor,
			ddjj.periodo,
			ddjj.numero
		from (
			select
				djc.id_cuenta,
				djc.id id_declaracion_jurada,
				dji.id id_declaracion_jurada_item,
				djc.id_modelo_declaracion_jurada,
				dji.id_clase_declaracion_jurada,
				cdj.codigo codigo_clase_declaracion_jurada,
				dji.id_tipo_declaracion_jurada,
				tdj.codigo codigo_tipo_declaracion_jurada,
				dji.id_rubro,
				dji.valor,
				cast(djc.anio_declaracion||lpad(cast(djc.mes_declaracion as varchar),2,'0') as int) periodo,
				cast(djc.numero as int) numero
			from
				declaracion_jurada djc
				inner join declaracion_jurada_item dji on djc.id=dji.id_declaracion_jurada
				inner join clase_declaracion_jurada cdj on cdj.id=dji.id_clase_declaracion_jurada
				inner join tipo_declaracion_jurada tdj on tdj.id=dji.id_tipo_declaracion_jurada
			where
				djc.fecha_baja is null
		) ddjj
		inner join (
			select
				djc.id_cuenta,
				djc.id_modelo_declaracion_jurada,
				dji.id_clase_declaracion_jurada,
				dji.id_tipo_declaracion_jurada,
				MAX(cast(djc.anio_declaracion||lpad(cast(djc.mes_declaracion as varchar),2,'0') as int)) periodo
			from
				declaracion_jurada djc
				inner join declaracion_jurada_item dji on djc.id=dji.id_declaracion_jurada
			where
				djc.fecha_baja is null
			group by
				djc.id_cuenta,
				djc.id_modelo_declaracion_jurada,
				dji.id_clase_declaracion_jurada,
				dji.id_tipo_declaracion_jurada
		) ddjj_max on ddjj.id_cuenta=ddjj_max.id_cuenta and
					  ddjj.id_modelo_declaracion_jurada=ddjj_max.id_modelo_declaracion_jurada and
					  ddjj.id_clase_declaracion_jurada=ddjj_max.id_clase_declaracion_jurada and
					  ddjj.id_tipo_declaracion_jurada=ddjj_max.id_tipo_declaracion_jurada and
					  ddjj.periodo=ddjj_max.periodo
		order by
			ddjj.id_cuenta,
			ddjj.id_modelo_declaracion_jurada,
			ddjj.id_clase_declaracion_jurada,
			ddjj.id_tipo_declaracion_jurada;

end
$$ language plpgsql;