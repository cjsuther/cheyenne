SELECT [COD_TIPO_PERSONA]
       [NUMERO_DOCUMENTO]
      ,[NOMBRE]
      ,[APELLIDO]

      ,[PROVINCIA]
      ,[LOCALIDAD]
      ,[CP]
      ,[CALLE]
      ,[ALTURA]
      ,[PISO]
      ,[DEPTO]
	  --,L.IdLocalidad, L.Descripcion
  FROM [MAJOR_CAMPANA].[dbo].[PERSONA] P --WHERE P.LOCALIDAD<>''
  INNER JOIN MAJOR_CAMPANA_COMPLEMENTO.dbo.Localidades L ON TRIM(L.Descripcion)=TRIM(P.LOCALIDAD)
  INNER JOIN MAJOR_CAMPANA_COMPLEMENTO.dbo.Provincias R ON TRIM(R.Descripcion)=TRIM(P.PROVINCIA)
  WHERE L.IdProvincia=R.IdProvincia
