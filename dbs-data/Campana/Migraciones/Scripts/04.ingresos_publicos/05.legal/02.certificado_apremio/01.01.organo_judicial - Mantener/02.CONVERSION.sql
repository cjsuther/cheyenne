USE LARAMIE
GO

TRUNCATE TABLE LARAMIE.dbo.organo_judicial
GO

INSERT INTO dbo.organo_judicial
SELECT
	cod_OrganoJudicial id,
	Case When departamento_judicial is null then '' else departamento_judicial end departamento_judicial,
	Case When fuero is null then '' else fuero end fuero,
	Case When secretaria is null then '' else secretaria end secretaria
FROM MAJOR.dbo.OrganoJudicial
GO
