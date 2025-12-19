USE LARAMIE
GO

--clase_elemento
SELECT id
      ,codigo
      ,nombre
      ,orden
      ,id_tipo_tributo
      ,ejecucion_periodica
FROM LARAMIE.dbo.clase_elemento
--FONDEADERO (NO APLICA)
--WHERE id IN (SELECT id_clase_elemento FROM LARAMIE.dbo.elemento WHERE id_tipo_tributo=14 and cod_tasa='4046' and cod_subtasa in ())
--COMERCIO
WHERE id IN (SELECT id_clase_elemento FROM LARAMIE.dbo.elemento WHERE id_tipo_tributo=11 and (
	cod_tasa='2002' and cod_subtasa in ('10','11') OR
	cod_tasa='2003' and cod_subtasa in ('14','15','17','46','48','53','56','57','60','61','62','67') OR
	cod_tasa='2006' and cod_subtasa in ('39') OR
	cod_tasa='2009' and cod_subtasa in ('70') OR
	cod_tasa='2013' and cod_subtasa in ('1','2','3','4','5','6','11') OR
	cod_tasa='2014' and cod_subtasa in ('4','5') OR
	cod_tasa='2015' and cod_subtasa in ('10') OR
	cod_tasa='2050' and cod_subtasa in ('1','2') OR
	cod_tasa='2140' and cod_subtasa in ('1','2','3','7')
))
ORDER BY id
GO

--clase_declaracion_jurada
SELECT id
      ,codigo
      ,nombre
      ,orden
      ,0 aplica_rubro
	  ,0 regimen_general
      ,1 obligatorio
	  ,'' observacion
	  ,0 aplica_rubro_principal
	  ,0 aplica_generico
FROM LARAMIE.dbo.clase_elemento
--FONDEADERO
--WHERE id IN (SELECT id_clase_elemento FROM LARAMIE.dbo.elemento WHERE id_tipo_tributo=14 and cod_tasa='4046' and cod_subtasa in ('31','21','30','20','32','22','37','27','36','26','11','10','12','17','16','15','35','25'))
--COMERCIO
WHERE id IN (SELECT id_clase_elemento FROM LARAMIE.dbo.elemento WHERE id_tipo_tributo=11 and (
	cod_tasa='1302' and cod_subtasa in ('1') OR
	cod_tasa='2001' and cod_subtasa in ('1','2','4','12','39','40','43','44','46','47','48') OR
	cod_tasa='2004' and cod_subtasa in ('17') OR
	cod_tasa='2006' and cod_subtasa in ('35','36','37','38') OR
	cod_tasa='2007' and cod_subtasa in ('39','40','41','42','43','44') OR
	cod_tasa='2009' and cod_subtasa in ('1') OR
	cod_tasa='2012' and cod_subtasa in ('1','2','3') OR
	cod_tasa='2015' and cod_subtasa in ('0','1','2','4','7','8','9','12','13','38','39','40','43','44','45','46','47','48','49','50','51','52','53') OR
	cod_tasa='2033' and cod_subtasa in ('1','2','3','4','5','101','102','103') OR
	cod_tasa='2050' and cod_subtasa in ('3','4','5','6','7','103','104','105','106','107')
))
ORDER BY id
GO
