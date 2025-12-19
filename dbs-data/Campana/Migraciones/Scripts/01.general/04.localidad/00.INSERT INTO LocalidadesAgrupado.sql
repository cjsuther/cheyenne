USE [MAJOR_CAMPANA_COMPLEMENTO]
GO

CREATE TABLE [dbo].[LocalidadesAgrupado](
	[IdLocalidad] [varchar](50) NULL,
	[Descripcion] [varchar](50) NULL,
	[IdProvincia] [varchar](50) NULL
) ON [PRIMARY]
GO

---------------------------------------------

TRUNCATE TABLE LocalidadesAgrupado;

INSERT INTO LocalidadesAgrupado
SELECT ROW_NUMBER() OVER (ORDER BY trim([Descripcion]))
      ,trim([Descripcion]) descripcion
      ,[IdProvincia]
  FROM [MAJOR_CAMPANA_COMPLEMENTO].[dbo].[Localidades]
  WHERE NOT [Descripcion] IN ('""','A','CA')
  GROUP BY
       trim([Descripcion])
      ,[IdProvincia]
  ORDER BY
	ROW_NUMBER() OVER (ORDER BY trim([Descripcion]))
