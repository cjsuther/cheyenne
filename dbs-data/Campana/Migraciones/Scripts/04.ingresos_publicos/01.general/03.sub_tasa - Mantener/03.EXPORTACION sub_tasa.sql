USE LARAMIE_CAMPANA
GO

SELECT st.id
      ,st.id_tasa
      ,st.codigo
      ,st.descripcion
      ,st.impuesto_nacional
      ,st.impuesto_provincial
      ,st.ctas_ctes
      ,st.timbrados_extras
      ,st.descripcion_reducida
      ,st.fecha_desde
      ,st.fecha_hasta
      ,st.rubro_generico
      ,st.liquidable_cta_cte
      ,st.liquidable_ddjj
      ,st.actualizacion
      ,st.accesorios
      ,st.internet_ddjj
      ,st.imput_x_porc
 FROM sub_tasa st
	inner join tasa t on t.id=st.id_tasa
 ORDER BY id