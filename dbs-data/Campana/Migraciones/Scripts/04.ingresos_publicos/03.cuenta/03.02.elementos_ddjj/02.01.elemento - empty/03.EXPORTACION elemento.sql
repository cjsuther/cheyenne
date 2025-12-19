USE LARAMIE
GO

SELECT id
      ,id_clase_elemento
      ,id_tipo_elemento
      ,id_cuenta
      ,cantidad
      ,fecha_alta
      ,fecha_baja
      ,activo
FROM LARAMIE.dbo.elemento
--FONDEADERO (NO APLICA)
--WHERE id_tipo_tributo=14 and cod_tasa='4046' and cod_subtasa in ()
--COMERCIO
WHERE id_tipo_tributo=11 and (
	cod_tasa='2002' and cod_subtasa in ('10','11') OR
	cod_tasa='2003' and cod_subtasa in ('14','15','17','46','48','53','56','57','60','61','62','67') OR
	cod_tasa='2006' and cod_subtasa in ('39') OR
	cod_tasa='2009' and cod_subtasa in ('70') OR
	cod_tasa='2013' and cod_subtasa in ('1','2','3','4','5','6','11') OR
	cod_tasa='2014' and cod_subtasa in ('4','5') OR
	cod_tasa='2015' and cod_subtasa in ('10') OR
	cod_tasa='2050' and cod_subtasa in ('1','2') OR
	cod_tasa='2140' and cod_subtasa in ('1','2','3','7')
)
ORDER BY id
GO
