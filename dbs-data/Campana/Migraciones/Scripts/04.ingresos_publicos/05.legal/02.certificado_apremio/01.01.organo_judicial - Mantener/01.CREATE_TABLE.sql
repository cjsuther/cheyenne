USE LARAMIE_CAMPANA
GO

CREATE TABLE organo_judicial
(
	id bigint NOT NULL,
	codigo_organo_judicial character varying(20) NOT NULL,
    departamento_judicial character varying(250) NOT NULL,
    fuero character varying(250) NOT NULL,
    secretaria character varying(250) NOT NULL
)
GO
