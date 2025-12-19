USE LARAMIE_CAMPANA
GO

TRUNCATE TABLE zona_entrega
GO

INSERT INTO zona_entrega
SELECT
    (ROW_NUMBER() OVER (ORDER BY id_cuenta,id_tipo_controlador,email,direccion)) id
     ,id_cuenta, id_tipo_controlador, email, direccion
FROM (
         SELECT
             cue.ID id_cuenta
              ,100 id_tipo_controlador --TipoControlador: DOMICILIO ELECTRONICO
              ,EMAIL_ZONA_ENTREGA email
              ,'' direccion
         FROM (
                  SELECT NUMERO_CUENTA, COD_TIPO_CONTROLADOR_ZONA_ENTREGA, CALLE_ENTREGA,ALTURA_ENTREGA,PISO_ENTREGA,DEPTO_ENTREGA,CP_ENTREGA, LOCALIDAD_ENTREGA, PROVINCIA_ENTREGA, EMAIL_ZONA_ENTREGA, 10 id_tipo_tributo FROM MAJOR_CAMPANA.dbo.INMUEBLE
                  UNION
                  SELECT NUMERO_CUENTA, COD_TIPO_CONTROLADOR_ZONA_ENTREGA, CALLE_ENTREGA,NUMERO_ENTREGA,PISO_ENTREGA,DEPTO_ENTREGA,CP_ENTREGA, LOCALIDAD_ENTREGA, PROVINCIA_ENTREGA, EMAIL_ZONA_ENTREGA, 12 id_tipo_tributo FROM MAJOR_CAMPANA.dbo.VEHICULO
                  UNION
                  SELECT NUMERO_CUENTA, COD_TIPO_CONTROLADOR_ZONA_ENTREGA, CALLE_ENTREGA,ALTURA_ENTREGA,PISO_ENTREGA,DEPTO_ENTREGA,CP_ENTREGA, LOCALIDAD_ENTREGA, PROVINCIA_ENTREGA, EMAIL_ZONA_ENTREGA, 11 id_tipo_tributo FROM MAJOR_CAMPANA.dbo.COMERCIO
                  UNION
                  SELECT NUMERO_CUENTA, COD_TIPO_CONTROLADOR_ZONA_ENTREGA, CALLE_ENTREGA,ALTURA_ENTREGA,PISO_ENTREGA,DEPTO_ENTREGA,CP_ENTREGA, LOCALIDAD_ENTREGA, PROVINCIA_ENTREGA, EMAIL_ZONA_ENTREGA, 13 id_tipo_tributo FROM MAJOR_CAMPANA.dbo.CEMENTERIO
              ) A
                  left join LARAMIE_CAMPANA.dbo.cuenta cue on cue.numero_cuenta=A.NUMERO_CUENTA and cue.id_tipo_tributo=A.id_tipo_tributo
                  left join LARAMIE_CAMPANA.dbo.tipo_controlador tco on tco.codigo=A.COD_TIPO_CONTROLADOR_ZONA_ENTREGA
         WHERE LEN(REPLACE(A.NUMERO_CUENTA,'0',''))>0 and
             LEN(isnull(A.EMAIL_ZONA_ENTREGA,''))>0
         UNION
         SELECT
             cue.ID id_cuenta
              ,1 id_tipo_controlador --TipoControlador: CIRCUITO DE DISTRIBUCION
              ,'' email
              ,MAJOR_CAMPANA.dbo.GET_DOMICILIO(A.CALLE_ENTREGA,A.ALTURA_ENTREGA,A.PISO_ENTREGA,A.DEPTO_ENTREGA,A.CP_ENTREGA,
                                               case when L.IdLocalidad is null then 0 else L.IdLocalidad end,
                                               case when R.IdProvincia is null then 0 else R.IdProvincia end,
                                               case when R.IdProvincia is null then 0 else 1 end
               ) direccion
         FROM (
                  SELECT NUMERO_CUENTA, COD_TIPO_CONTROLADOR_ZONA_ENTREGA, CALLE_ENTREGA,ALTURA_ENTREGA,PISO_ENTREGA,DEPTO_ENTREGA,CP_ENTREGA, LOCALIDAD_ENTREGA, PROVINCIA_ENTREGA, EMAIL_ZONA_ENTREGA, 10 id_tipo_tributo FROM MAJOR_CAMPANA.dbo.INMUEBLE
                  UNION
                  SELECT NUMERO_CUENTA, COD_TIPO_CONTROLADOR_ZONA_ENTREGA, CALLE_ENTREGA,NUMERO_ENTREGA,PISO_ENTREGA,DEPTO_ENTREGA,CP_ENTREGA, LOCALIDAD_ENTREGA, PROVINCIA_ENTREGA, EMAIL_ZONA_ENTREGA, 12 id_tipo_tributo FROM MAJOR_CAMPANA.dbo.VEHICULO
                  UNION
                  SELECT NUMERO_CUENTA, COD_TIPO_CONTROLADOR_ZONA_ENTREGA, CALLE_ENTREGA,ALTURA_ENTREGA,PISO_ENTREGA,DEPTO_ENTREGA,CP_ENTREGA, LOCALIDAD_ENTREGA, PROVINCIA_ENTREGA, EMAIL_ZONA_ENTREGA, 11 id_tipo_tributo FROM MAJOR_CAMPANA.dbo.COMERCIO
                  UNION
                  SELECT NUMERO_CUENTA, COD_TIPO_CONTROLADOR_ZONA_ENTREGA, CALLE_ENTREGA,ALTURA_ENTREGA,PISO_ENTREGA,DEPTO_ENTREGA,CP_ENTREGA, LOCALIDAD_ENTREGA, PROVINCIA_ENTREGA, EMAIL_ZONA_ENTREGA, 13 id_tipo_tributo FROM MAJOR_CAMPANA.dbo.CEMENTERIO
              ) A
                  left join LARAMIE_CAMPANA.dbo.cuenta cue on cue.numero_cuenta=A.NUMERO_CUENTA and cue.id_tipo_tributo=A.id_tipo_tributo
                  left join LARAMIE_CAMPANA.dbo.tipo_controlador tco on tco.codigo=A.COD_TIPO_CONTROLADOR_ZONA_ENTREGA
                  LEFT JOIN MAJOR_CAMPANA_COMPLEMENTO.dbo.Provincias R ON TRIM(R.Descripcion)=TRIM(A.PROVINCIA_ENTREGA)
                  LEFT JOIN MAJOR_CAMPANA_COMPLEMENTO.dbo.LocalidadesAgrupado L ON TRIM(L.Descripcion)=TRIM(A.LOCALIDAD_ENTREGA) and L.IdProvincia=R.IdProvincia and A.LOCALIDAD_ENTREGA<>''
         WHERE LEN(REPLACE(A.NUMERO_CUENTA,'0',''))>0 and
             LEN(isnull(A.CALLE_ENTREGA,'')+REPLACE(isnull(A.ALTURA_ENTREGA,''),'0',''))>0
     ) T
ORDER BY
    id
GO
