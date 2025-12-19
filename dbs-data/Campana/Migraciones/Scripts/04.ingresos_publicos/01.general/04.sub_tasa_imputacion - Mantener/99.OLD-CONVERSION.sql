USE LARAMIE_CAMPANA
GO

TRUNCATE TABLE sub_tasa_imputacion
GO

INSERT INTO sub_tasa_imputacion
SELECT 
	 0 id_tasa
    ,0 id_sub_tasa
    ,'2024' ejercicio
    ,1270 id_tipo_cuota
    ,NULL id_cuenta_contable
    ,NULL id_cuenta_contable_anterior
    ,NULL id_cuenta_contable_futura
    ,NULL id_jurisdiccion_actual
    ,NULL id_recurso_por_rubro_actual
    ,NULL id_jurisdiccion_anterior
    ,NULL id_recurso_por_rubro_anterior
    ,NULL id_jurisdiccion_futura
    ,NULL id_recurso_por_rubro_futura	
	,ttas_Tasa cod_tasa
    ,ttas_SubTasa cod_sub_tasa
    ,(case when cuenta_contable_Codigo_ACTUAL = '[0000][00000000]' then NULL else cuenta_contable_Codigo_ACTUAL end) cod_cuenta_contable
    ,(case when cuenta_contable_Codigo_ANTERIOR = '[0000][00000000]' then NULL else cuenta_contable_Codigo_ANTERIOR end) cod_cuenta_contable_anterior
    ,(case when cuenta_contable_Codigo_FUTURA = '[0000][00000000]' then NULL else cuenta_contable_Codigo_FUTURA end) cod_cuenta_contable_futura
    ,(case when jurisdiccion_Codigo_ACTUAL = '[0000][ ]' then NULL else jurisdiccion_Codigo_ACTUAL end) cod_jurisdiccion_actual
    ,(case when recurso_por_rubro_Codigo_ACTUAL = '[0000][ ]' then NULL else recurso_por_rubro_Codigo_ACTUAL end) cod_recurso_por_rubro_actual
    ,(case when jurisdiccion_Codigo_ANTERIOR = '[0000][ ]' then NULL else jurisdiccion_Codigo_ANTERIOR end) cod_jurisdiccion_anterior
	,(case when recurso_por_rubro_Codigo_ANTERIOR = '[0000][ ]' then NULL else recurso_por_rubro_Codigo_ANTERIOR end) cod_recurso_por_rubro_anterior
    ,(case when jurisdiccion_Codigo_FUTURA = '[0000][ ]' then NULL else jurisdiccion_Codigo_FUTURA end) cod_jurisdiccion_futura
    ,(case when recurso_por_rubro_Codigo_FUTURA = '[0000][ ]' then NULL else recurso_por_rubro_Codigo_FUTURA end) cod_recurso_por_rubro_futura
FROM MAJOR.dbo.relaciones_TASA
WHERE ttas_Tasa <> 0
GO


--Actualizo el id_tasa con los datos reales de tasa
UPDATE sub_tasa_imputacion
SET id_tasa=t.id
FROM
sub_tasa_imputacion si INNER JOIN tasa t on si.cod_tasa=t.codigo
GO
--Actualizo el id_sub_tasa con los datos reales de sub_tasa
UPDATE sub_tasa_imputacion
SET id_sub_tasa=s.id
FROM
sub_tasa_imputacion si INNER JOIN sub_tasa s on si.cod_sub_tasa=s.codigo and si.cod_tasa=s.cod_tasa
GO


--Actualizo el id_cuenta_contable con los datos reales de cuenta_contable
UPDATE sub_tasa_imputacion
SET id_cuenta_contable=cc.id
FROM
sub_tasa_imputacion si INNER JOIN cuenta_contable cc on si.cod_cuenta_contable=cc.cod_cuenta_contable
GO
--Actualizo el id_cuenta_contable_anterior con los datos reales de cuenta_contable
UPDATE sub_tasa_imputacion
SET id_cuenta_contable_anterior=cc.id
FROM
sub_tasa_imputacion si INNER JOIN cuenta_contable cc on si.cod_cuenta_contable_anterior=cc.cod_cuenta_contable
GO
--Actualizo el id_cuenta_contable_futura con los datos reales de cuenta_contable
UPDATE sub_tasa_imputacion
SET id_cuenta_contable_futura=cc.id
FROM
sub_tasa_imputacion si INNER JOIN cuenta_contable cc on si.cod_cuenta_contable_futura=cc.cod_cuenta_contable
GO


--Actualizo el id_jurisdiccion_actual con los datos reales de jurisdiccion
UPDATE sub_tasa_imputacion
SET id_jurisdiccion_actual=j.id
FROM
sub_tasa_imputacion si INNER JOIN jurisdiccion j on si.cod_jurisdiccion_actual=j.cod_jurisdiccion
GO
--Actualizo el id_jurisdiccion_anterior con los datos reales de jurisdiccion
UPDATE sub_tasa_imputacion
SET id_jurisdiccion_anterior=j.id
FROM
sub_tasa_imputacion si INNER JOIN jurisdiccion j on si.cod_jurisdiccion_anterior=j.cod_jurisdiccion
GO
--Actualizo el id_jurisdiccion_futura con los datos reales de jurisdiccion
UPDATE sub_tasa_imputacion
SET id_jurisdiccion_futura=j.id
FROM
sub_tasa_imputacion si INNER JOIN jurisdiccion j on si.cod_jurisdiccion_futura=j.cod_jurisdiccion
GO


--Actualizo el id_recurso_por_rubro_actual con los datos reales de recurso_por_rubro
UPDATE sub_tasa_imputacion
SET id_recurso_por_rubro_actual=r.id
FROM
sub_tasa_imputacion si INNER JOIN recurso_por_rubro r on si.cod_recurso_por_rubro_actual=r.cod_recurso_por_rubro
GO
--Actualizo el id_recurso_por_rubro_anterior con los datos reales de recurso_por_rubro
UPDATE sub_tasa_imputacion
SET id_recurso_por_rubro_anterior=r.id
FROM
sub_tasa_imputacion si INNER JOIN recurso_por_rubro r on si.cod_recurso_por_rubro_anterior=r.cod_recurso_por_rubro
GO
--Actualizo el id_recurso_por_rubro_futura con los datos reales de recurso_por_rubro
UPDATE sub_tasa_imputacion
SET id_recurso_por_rubro_futura=r.id
FROM
sub_tasa_imputacion si INNER JOIN recurso_por_rubro r on si.cod_recurso_por_rubro_futura=r.cod_recurso_por_rubro
GO


--Actualizo ejercicio
UPDATE sub_tasa_imputacion
SET ejercicio= case when not cc.ejercicio is null then cc.ejercicio
					when not j.ejercicio is null then j.ejercicio
					when not r.ejercicio is null then r.ejercicio
					else '' end
FROM
sub_tasa_imputacion si
LEFT JOIN cuenta_contable cc on si.cod_cuenta_contable=cc.cod_cuenta_contable
LEFT JOIN jurisdiccion j on si.cod_jurisdiccion_actual=j.cod_jurisdiccion
LEFT JOIN recurso_por_rubro r on si.cod_recurso_por_rubro_actual=r.cod_recurso_por_rubro
GO


--Se borran las relaciones rotas
DELETE FROM sub_tasa_imputacion
WHERE
(
   id_cuenta_contable IS NULL
and NOT cod_cuenta_contable = '[0000][00000000]'
or id_cuenta_contable_anterior IS NULL
and NOT cod_cuenta_contable_anterior = '[0000][00000000]'
or id_cuenta_contable_futura IS NULL
and NOT cod_cuenta_contable_futura = '[0000][00000000]'
or id_jurisdiccion_actual IS NULL
and NOT cod_jurisdiccion_actual = '[0000][]'
or id_jurisdiccion_anterior IS NULL
and NOT cod_jurisdiccion_anterior = '[0000][]'
or id_jurisdiccion_futura IS NULL
and NOT cod_jurisdiccion_futura = '[0000][]'
or id_recurso_por_rubro_actual IS NULL
and NOT cod_recurso_por_rubro_actual = '[0000][]'
or id_recurso_por_rubro_anterior IS NULL
and NOT cod_recurso_por_rubro_anterior = '[0000][]'
or id_recurso_por_rubro_futura IS NULL
and NOT cod_recurso_por_rubro_futura = '[0000][]'
)
or
(
	   id_cuenta_contable IS NULL
	and id_cuenta_contable_anterior IS NULL
	and id_cuenta_contable_futura IS NULL
	and id_jurisdiccion_actual IS NULL
	and id_jurisdiccion_anterior IS NULL
	and id_jurisdiccion_futura IS NULL
	and id_recurso_por_rubro_actual IS NULL
	and id_recurso_por_rubro_anterior IS NULL
	and id_recurso_por_rubro_futura IS NULL
)
GO
