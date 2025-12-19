USE LARAMIE_CAMPANA
GO

TRUNCATE TABLE superficie
GO

INSERT INTO superficie
SELECT 
	 (ROW_NUMBER() OVER (ORDER BY A.NUMERO_CUENTA,A.COD_TIPO_SUPERFICIE,A.NUMERO)) id
	,inm.ID id_inmueble
	,NUMERO nro_superficie
	,NUMERO_INTERNO nro_interno
	,NUMERO_DDJJ nro_declaracion_jurada
	,tsu.ID id_tipo_superficie
	,PLANO
	,gsu.ID id_grupo_superficie
	,tos.ID id_tipo_obra_superficie
	,des.ID id_destino_superficie
	,MAJOR_CAMPANA.dbo.GET_FECHA(A.FECHA_INTIMACION) fecha_intimacion
	,nro_intimacion
	,nro_anterior
	,MAJOR_CAMPANA.dbo.GET_FECHA(A.FECHA_PRESENTACION) fecha_presentacion
	,MAJOR_CAMPANA.dbo.GET_FECHA(A.FECHA_VIGENTE_DESDE) fecha_vigente_desde
	,MAJOR_CAMPANA.dbo.GET_FECHA(A.FECHA_REGISTRADO) fecha_registrado
	,MAJOR_CAMPANA.dbo.GET_FECHA(A.FECHA_PERMISO_PROVISORIO) fecha_permiso_provisorio
	,MAJOR_CAMPANA.dbo.GET_FECHA(A.FECHA_APROBACION) fecha_aprobacion
	,(case when CONFORME_OBRA='S' then 1 else 0 end) conforme_obra
	,MAJOR_CAMPANA.dbo.GET_FECHA(A.FECHA_FIN_OBRA) fecha_fin_obra
	,ratificacion
	,derechos
	,metros
FROM MAJOR_CAMPANA.dbo.SUPERFICIE A
	left join LARAMIE_CAMPANA.dbo.inmueble inm on inm.numero_cuenta=A.NUMERO_CUENTA
	left join LARAMIE_CAMPANA.dbo.tipo_superficie tsu on tsu.codigo=A.COD_TIPO_SUPERFICIE
	left join LARAMIE_CAMPANA.dbo.grupo_superficie gsu on gsu.codigo=A.COD_GRUPO_SUPERFICIE
	left join MAJOR_CAMPANA.dbo.LISTA tos on tos.NOMBRE='TipoObraSuperficie' and tos.CODIGO=A.COD_TIPO_OBRA_SUPERFICIE
	left join MAJOR_CAMPANA.dbo.LISTA des on des.NOMBRE='DestinoSuperficie' and des.CODIGO=A.COD_DESTINO_SUPERFICIE
ORDER BY id
GO
