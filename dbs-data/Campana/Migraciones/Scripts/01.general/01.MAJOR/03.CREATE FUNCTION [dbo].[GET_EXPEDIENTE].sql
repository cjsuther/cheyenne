USE MAJOR_CAMPANA
GO

CREATE OR ALTER FUNCTION [dbo].[GET_EXPEDIENTE]
(
	@EJERCICIO int,
	@NUMERO int,
	@SUBNUMERO int,
	@LETRA varchar(20),
	@MATRICULA varchar(50),
	@TIPO varchar(20)
)
RETURNS nvarchar(255)
AS
BEGIN
	DECLARE @EXPEDIENTE nvarchar(255)

	IF ISNULL(@EJERCICIO,0)=0 AND ISNULL(@NUMERO,0)=0 RETURN ''

	SET @EXPEDIENTE = '['+cast(@EJERCICIO as varchar)+']' + '['+cast(@NUMERO as varchar)+']' + '['+cast(@SUBNUMERO as varchar)+']' +
					  '['+ltrim(rtrim(isnull(@LETRA,'')))+']' + '['+ltrim(rtrim(isnull(@MATRICULA,'')))+']' + '['+ltrim(rtrim(isnull(@TIPO,'')))+']'

	RETURN @EXPEDIENTE
END
GO
