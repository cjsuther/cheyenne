USE MAJOR_CAMPANA
GO

TRUNCATE TABLE LISTA
GO

INSERT INTO LISTA
SELECT A.nombre, A.codigo, A.valor, A.id
	from (
	select distinct l1.nombre, l1.codigo, l1.valor, CASE WHEN l2.id is null THEN (ROW_NUMBER() OVER (ORDER BY l1.nombre, l1.codigo))+3000 ELSE l2.id END id
	from (
			select 'LISTA_ESTATICA' tipo, nombre, codigo, valor from LISTA_ESTATICA
			union
			select 'LISTA_DINAMICA' tipo, nombre, codigo, valor from LISTA_DINAMICA
		) l1
		left join LISTA_LARAMIE l2 on l2.nombre=l1.nombre and l2.codigo=l1.codigo
	where
		l1.codigo<>'' and
		l1.codigo<>'0' and
		not l1.nombre in(
			'RegistroCivil',
			'TipoPersona',
			'InspeccionCertificadoApremio',
			'TipoInstrumento',
			'RubroBCRA',
			'RubroProvincia',
			'MotivoBajaComercio',
			'GrupoSuperficie',
			'TipoVinculo',
			'OrigenDeclaracionJurada',
			'TipoArrendamiento',
			'TipoMulta',
			'ZonaTarifaria')
	UNION
	SELECT nombre, codigo, valor, id FROM LISTA_LARAMIE
		WHERE NOMBRE IN (SELECT DISTINCT NOMBRE FROM LISTA_LARAMIE WHERE NOT NOMBRE IN (SELECT NOMBRE FROM LISTA))
		and NOT NOMBRE IN ('TipoTributo','TipoContacto','IngresosBrutos')
) A
ORDER BY A.nombre, A.codigo
GO
