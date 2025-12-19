USE MAJOR_CAMPANA
GO

CREATE OR ALTER FUNCTION [dbo].[GET_DOMICILIO]
(
	@CALLE nvarchar(255),
	@ALTURA nvarchar(50),
	@PISO nvarchar(10),
	@DEPTO nvarchar(10),
	@CP nvarchar(10),
	@ID_LOCALIDAD bigint,
	@ID_PROVINCIA bigint,
	@ID_PAIS bigint
)
RETURNS nvarchar(255)
AS
BEGIN
	DECLARE @DOMICILIO nvarchar(255)

	SET @DOMICILIO = '['+ltrim(rtrim(isnull(@CALLE,'')))+']' + '['+ltrim(rtrim(isnull(@ALTURA,'')))+']' +
					 '['+ltrim(rtrim(isnull(@PISO,'')))+']' + '['+ltrim(rtrim(isnull(@DEPTO,'')))+']' + '['+ltrim(rtrim(isnull(@CP,'')))+']' +
					 '['+cast(@ID_LOCALIDAD as varchar)+']' + '['+cast(@ID_PROVINCIA as varchar)+']' + '['+cast(@ID_PAIS as varchar)+']'

	RETURN @DOMICILIO
END
GO
