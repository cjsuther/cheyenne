CREATE TABLE dbo.DECLARACION_JURADA
(
    COD_TIPO_TRIBUTO              NUMERIC     NOT NULL,
    NUMERO_CUENTA                 VARCHAR(50) NOT NULL,
    COD_RUBRO                     NUMERIC     NOT NULL,
    PERIODO                       VARCHAR(50) NOT NULL,
    MES                           VARCHAR(50) NOT NULL,
    COD_CLASE                     VARCHAR(50) NOT NULL,
    COD_TIPO                      VARCHAR(50) NOT NULL,
    NUMERO                        VARCHAR(50),
    COD_ORIGEN_DECLARACION_JURADA NUMERIC,
    VALOR                         VARCHAR(50),
    RESOLUCION                    VARCHAR(50),
    FECHA_ALTA                    DATETIME,
    FECHA_BAJA                    DATETIME,
    FECHA_DECLARACION             DATETIME
)
go

CREATE TABLE dbo.CLASE (
    id INT IDENTITY(1,1) PRIMARY KEY,
    codigo VARCHAR(50) NOT NULL UNIQUE,
    nombre VARCHAR(100) NOT NULL
);

CREATE TABLE dbo.TIPO (
    id INT IDENTITY(1,1) PRIMARY KEY,
    codigo VARCHAR(50) NOT NULL,
    nombre VARCHAR(100) NOT NULL,
    cod_clase VARCHAR(50) NOT NULL,
    cod_tipo_dato VARCHAR(10) NOT NULL, -- Opciones de tipo dato: INT, DECIMAL, MONEY, OTHER
    FOREIGN KEY (cod_clase) REFERENCES CLASE(codigo)
);

INSERT INTO CLASE (codigo, nombre) VALUES ('TISH', N'Tasa de inspección de seguridad e higiene');
INSERT INTO CLASE (codigo, nombre) VALUES ('TISH_GENERAL', N'Tasa de inspección de seguridad e higiene - General');
INSERT INTO CLASE (codigo, nombre) VALUES ('MANT_VIAL', N'Mantenimiento Vial'); -- X
INSERT INTO CLASE (codigo, nombre) VALUES ('EXPLOTACION_CANTERAS', N'Derecho de explotación de canteras'); -- X
INSERT INTO CLASE (codigo, nombre) VALUES ('ENVASES_NR', N'Comercialización de envases no retornables y afines'); -- X
INSERT INTO CLASE (codigo, nombre) VALUES ('M2', N'Metros cuadrados afectados'); 
--INSERT INTO CLASE (codigo, nombre) VALUES ('GRG', N'Gestión de residuos a grandes generadores'); 
INSERT INTO CLASE (codigo, nombre) VALUES ('TAP', N'Tasa de alumbrado público'); --> Partida: m2 y base imponible

--- MANTENIMIENTO VIAL

INSERT INTO TIPO (codigo, nombre, cod_clase, cod_tipo_dato) VALUES ('GASOIL_GRADO_2', N'Gasoil grado 2', 'MANT_VIAL', 'DECIMAL');
INSERT INTO TIPO (codigo, nombre, cod_clase, cod_tipo_dato) VALUES ('GASOIL_GRADO_3', N'Gasoil grado 3', 'MANT_VIAL', 'DECIMAL');
INSERT INTO TIPO (codigo, nombre, cod_clase, cod_tipo_dato) VALUES ('NAFTA_SUPER', N'Nafta Super', 'MANT_VIAL', 'DECIMAL');
INSERT INTO TIPO (codigo, nombre, cod_clase, cod_tipo_dato) VALUES ('NAFTA_PREMIUM', N'Nafta Premium 2', 'MANT_VIAL', 'DECIMAL');
INSERT INTO TIPO (codigo, nombre, cod_clase, cod_tipo_dato) VALUES ('OTROS', N'Otros combustibles', 'MANT_VIAL', 'DECIMAL');

--- TASA DE INSPECCIÓN DE SEGURIDAD E HIGIENE
INSERT INTO TIPO (codigo, nombre, cod_clase, cod_tipo_dato) VALUES ('MONTO_MENSUAL', N'Monto mensual', 'TISH', 'IMPORTE');
INSERT INTO TIPO (codigo, nombre, cod_clase, cod_tipo_dato) VALUES ('EMPLEADOS', N'Cantidad de empleados', 'TISH_GENERAL', 'ENTERO');
INSERT INTO TIPO (codigo, nombre, cod_clase, cod_tipo_dato) VALUES ('INGRESO_ANUAL', N'Ingreso anual total país', 'TISH_GENERAL', 'IMPORTE');

INSERT INTO TIPO (codigo, nombre, cod_clase, cod_tipo_dato) VALUES ('HABITACIONES', N'Cantidad de habitaciones', 'TISH', 'ENTERO');
INSERT INTO TIPO (codigo, nombre, cod_clase, cod_tipo_dato) VALUES ('COCHERAS', N'Cantidad de cocheras', 'TISH', 'ENTERO');
INSERT INTO TIPO (codigo, nombre, cod_clase, cod_tipo_dato) VALUES ('CANCHAS_FUTBOL_TENIS', N'Cantidad de canchas de futbol o tenis', 'TISH', 'ENTERO');
INSERT INTO TIPO (codigo, nombre, cod_clase, cod_tipo_dato) VALUES ('CANCHAS_PADDLE', N'Cantidad de canchas de paddle o squash', 'TISH', 'ENTERO');
INSERT INTO TIPO (codigo, nombre, cod_clase, cod_tipo_dato) VALUES ('PUESTOS_FERIA', N'Cantidad de puestos de feria americana', 'TISH', 'ENTERO');

INSERT INTO TIPO (codigo, nombre, cod_clase, cod_tipo_dato) VALUES ('M2', N'Metros cuadrados cubiertos afectados', 'M2', 'DECIMAL');
INSERT INTO TIPO (codigo, nombre, cod_clase, cod_tipo_dato) VALUES ('M2DESCUBIERTOS', N'Metros cuadrados descubiertos', 'TISH', 'DECIMAL');

--- DERECHO DE EXPLOTACIÓN DE CANTERAS

INSERT INTO TIPO (codigo, nombre, cod_clase, cod_tipo_dato) VALUES ('M3', N'Metros cúbicos', 'EXPLOTACION_CANTERAS', 'DECIMAL');

--- COMERCIALIZACIÓN DE ENVASES NO RETORNABLES Y AFINES
INSERT INTO TIPO (codigo, nombre, cod_clase, cod_tipo_dato) VALUES ('PET', N'PET', 'ENVASES_NR', 'INT');
INSERT INTO TIPO (codigo, nombre, cod_clase, cod_tipo_dato) VALUES ('MULTICAPA', N'Multicapa', 'ENVASES_NR', 'INT');
INSERT INTO TIPO (codigo, nombre, cod_clase, cod_tipo_dato) VALUES ('LATA_BEBIDA', N'Lata de bebida', 'ENVASES_NR', 'INT');
INSERT INTO TIPO (codigo, nombre, cod_clase, cod_tipo_dato) VALUES ('AEROSOL', N'Aerosol', 'ENVASES_NR', 'INT');
INSERT INTO TIPO (codigo, nombre, cod_clase, cod_tipo_dato) VALUES (N'PAÑAL_DESCARTABLE', N'Pañal descartable', 'ENVASES_NR', 'INT');

--- TASA DE ALUMBRADO PÚBLICO
INSERT INTO TIPO (codigo, nombre, cod_clase, cod_tipo_dato) VALUES ('PARTIDA_1', N'Partida', 'TAP', 'VARCHAR');
INSERT INTO TIPO (codigo, nombre, cod_clase, cod_tipo_dato) VALUES ('MTS_PRODUCTIVOS_1', N'Metros productivos', 'TAP', 'DECIMAL');
INSERT INTO TIPO (codigo, nombre, cod_clase, cod_tipo_dato) VALUES ('BASE_IMPONIBLE_1', N'Base imponible', 'TAP', 'DECIMAL');
INSERT INTO TIPO (codigo, nombre, cod_clase, cod_tipo_dato) VALUES ('PARTIDA_2', N'Partida', 'TAP', 'VARCHAR');
INSERT INTO TIPO (codigo, nombre, cod_clase, cod_tipo_dato) VALUES ('MTS_PRODUCTIVOS_2', N'Metros productivos', 'TAP', 'DECIMAL');
INSERT INTO TIPO (codigo, nombre, cod_clase, cod_tipo_dato) VALUES ('BASE_IMPONIBLE_2', N'Base imponible', 'TAP', 'DECIMAL');
INSERT INTO TIPO (codigo, nombre, cod_clase, cod_tipo_dato) VALUES ('PARTIDA_3', N'Partida', 'TAP', 'VARCHAR');
INSERT INTO TIPO (codigo, nombre, cod_clase, cod_tipo_dato) VALUES ('MTS_PRODUCTIVOS_3', N'Metros productivos', 'TAP', 'DECIMAL');
INSERT INTO TIPO (codigo, nombre, cod_clase, cod_tipo_dato) VALUES ('BASE_IMPONIBLE_3', N'Base imponible', 'TAP', 'DECIMAL');
INSERT INTO TIPO (codigo, nombre, cod_clase, cod_tipo_dato) VALUES ('PARTIDA_4', N'Partida', 'TAP', 'VARCHAR');
INSERT INTO TIPO (codigo, nombre, cod_clase, cod_tipo_dato) VALUES ('MTS_PRODUCTIVOS_4', N'Metros productivos', 'TAP', 'DECIMAL');
INSERT INTO TIPO (codigo, nombre, cod_clase, cod_tipo_dato) VALUES ('BASE_IMPONIBLE_4', N'Base imponible', 'TAP', 'DECIMAL');
INSERT INTO TIPO (codigo, nombre, cod_clase, cod_tipo_dato) VALUES ('PARTIDA_5', N'Partida', 'TAP', 'VARCHAR');
INSERT INTO TIPO (codigo, nombre, cod_clase, cod_tipo_dato) VALUES ('MTS_PRODUCTIVOS_5', N'Metros productivos', 'TAP', 'DECIMAL');
INSERT INTO TIPO (codigo, nombre, cod_clase, cod_tipo_dato) VALUES ('BASE_IMPONIBLE_5', N'Base imponible', 'TAP', 'DECIMAL');
INSERT INTO TIPO (codigo, nombre, cod_clase, cod_tipo_dato) VALUES ('PARTIDA_6', N'Partida', 'TAP', 'VARCHAR');
INSERT INTO TIPO (codigo, nombre, cod_clase, cod_tipo_dato) VALUES ('MTS_PRODUCTIVOS_6', N'Metros productivos', 'TAP', 'DECIMAL');
INSERT INTO TIPO (codigo, nombre, cod_clase, cod_tipo_dato) VALUES ('BASE_IMPONIBLE_6', N'Base imponible', 'TAP', 'DECIMAL');
INSERT INTO TIPO (codigo, nombre, cod_clase, cod_tipo_dato) VALUES ('PARTIDA_7', N'Partida', 'TAP', 'VARCHAR');
INSERT INTO TIPO (codigo, nombre, cod_clase, cod_tipo_dato) VALUES ('MTS_PRODUCTIVOS_7', N'Metros productivos', 'TAP', 'DECIMAL');
INSERT INTO TIPO (codigo, nombre, cod_clase, cod_tipo_dato) VALUES ('BASE_IMPONIBLE_7', N'Base imponible', 'TAP', 'DECIMAL');
INSERT INTO TIPO (codigo, nombre, cod_clase, cod_tipo_dato) VALUES ('PARTIDA_8', N'Partida', 'TAP', 'VARCHAR');
INSERT INTO TIPO (codigo, nombre, cod_clase, cod_tipo_dato) VALUES ('MTS_PRODUCTIVOS_8', N'Metros productivos', 'TAP', 'DECIMAL');
INSERT INTO TIPO (codigo, nombre, cod_clase, cod_tipo_dato) VALUES ('BASE_IMPONIBLE_8', N'Base imponible', 'TAP', 'DECIMAL');
INSERT INTO TIPO (codigo, nombre, cod_clase, cod_tipo_dato) VALUES ('PARTIDA_9', N'Partida', 'TAP', 'VARCHAR');
INSERT INTO TIPO (codigo, nombre, cod_clase, cod_tipo_dato) VALUES ('MTS_PRODUCTIVOS_9', N'Metros productivos', 'TAP', 'DECIMAL');
INSERT INTO TIPO (codigo, nombre, cod_clase, cod_tipo_dato) VALUES ('BASE_IMPONIBLE_9', N'Base imponible', 'TAP', 'DECIMAL');
INSERT INTO TIPO (codigo, nombre, cod_clase, cod_tipo_dato) VALUES ('PARTIDA_10', N'Partida', 'TAP', 'VARCHAR');
INSERT INTO TIPO (codigo, nombre, cod_clase, cod_tipo_dato) VALUES ('MTS_PRODUCTIVOS_10', N'Metros productivos', 'TAP', 'DECIMAL');
INSERT INTO TIPO (codigo, nombre, cod_clase, cod_tipo_dato) VALUES ('BASE_IMPONIBLE_10', N'Base imponible', 'TAP', 'DECIMAL');
INSERT INTO TIPO (codigo, nombre, cod_clase, cod_tipo_dato) VALUES ('PARTIDA_11', N'Partida', 'TAP', 'VARCHAR');
INSERT INTO TIPO (codigo, nombre, cod_clase, cod_tipo_dato) VALUES ('MTS_PRODUCTIVOS_11', N'Metros productivos', 'TAP', 'DECIMAL');
INSERT INTO TIPO (codigo, nombre, cod_clase, cod_tipo_dato) VALUES ('BASE_IMPONIBLE_11', N'Base imponible', 'TAP', 'DECIMAL');
INSERT INTO TIPO (codigo, nombre, cod_clase, cod_tipo_dato) VALUES ('PARTIDA_12', N'Partida', 'TAP', 'VARCHAR');
INSERT INTO TIPO (codigo, nombre, cod_clase, cod_tipo_dato) VALUES ('MTS_PRODUCTIVOS_12', N'Metros productivos', 'TAP', 'DECIMAL');
INSERT INTO TIPO (codigo, nombre, cod_clase, cod_tipo_dato) VALUES ('BASE_IMPONIBLE_12', N'Base imponible', 'TAP', 'DECIMAL');
INSERT INTO TIPO (codigo, nombre, cod_clase, cod_tipo_dato) VALUES ('PARTIDA_13', N'Partida', 'TAP', 'VARCHAR');
INSERT INTO TIPO (codigo, nombre, cod_clase, cod_tipo_dato) VALUES ('MTS_PRODUCTIVOS_13', N'Metros productivos', 'TAP', 'DECIMAL');
INSERT INTO TIPO (codigo, nombre, cod_clase, cod_tipo_dato) VALUES ('BASE_IMPONIBLE_13', N'Base imponible', 'TAP', 'DECIMAL');
INSERT INTO TIPO (codigo, nombre, cod_clase, cod_tipo_dato) VALUES ('PARTIDA_14', N'Partida', 'TAP', 'VARCHAR');
INSERT INTO TIPO (codigo, nombre, cod_clase, cod_tipo_dato) VALUES ('MTS_PRODUCTIVOS_14', N'Metros productivos', 'TAP', 'DECIMAL');
INSERT INTO TIPO (codigo, nombre, cod_clase, cod_tipo_dato) VALUES ('BASE_IMPONIBLE_14', N'Base imponible', 'TAP', 'DECIMAL');
INSERT INTO TIPO (codigo, nombre, cod_clase, cod_tipo_dato) VALUES ('PARTIDA_15', N'Partida', 'TAP', 'VARCHAR');
INSERT INTO TIPO (codigo, nombre, cod_clase, cod_tipo_dato) VALUES ('MTS_PRODUCTIVOS_15', N'Metros productivos', 'TAP', 'DECIMAL');
INSERT INTO TIPO (codigo, nombre, cod_clase, cod_tipo_dato) VALUES ('BASE_IMPONIBLE_15', N'Base imponible', 'TAP', 'DECIMAL');
INSERT INTO TIPO (codigo, nombre, cod_clase, cod_tipo_dato) VALUES ('PARTIDA_16', N'Partida', 'TAP', 'VARCHAR');
INSERT INTO TIPO (codigo, nombre, cod_clase, cod_tipo_dato) VALUES ('MTS_PRODUCTIVOS_16', N'Metros productivos', 'TAP', 'DECIMAL');
INSERT INTO TIPO (codigo, nombre, cod_clase, cod_tipo_dato) VALUES ('BASE_IMPONIBLE_16', N'Base imponible', 'TAP', 'DECIMAL');
INSERT INTO TIPO (codigo, nombre, cod_clase, cod_tipo_dato) VALUES ('PARTIDA_17', N'Partida', 'TAP', 'VARCHAR');
INSERT INTO TIPO (codigo, nombre, cod_clase, cod_tipo_dato) VALUES ('MTS_PRODUCTIVOS_17', N'Metros productivos', 'TAP', 'DECIMAL');
INSERT INTO TIPO (codigo, nombre, cod_clase, cod_tipo_dato) VALUES ('BASE_IMPONIBLE_17', N'Base imponible', 'TAP', 'DECIMAL');
INSERT INTO TIPO (codigo, nombre, cod_clase, cod_tipo_dato) VALUES ('PARTIDA_18', N'Partida', 'TAP', 'VARCHAR');
INSERT INTO TIPO (codigo, nombre, cod_clase, cod_tipo_dato) VALUES ('MTS_PRODUCTIVOS_18', N'Metros productivos', 'TAP', 'DECIMAL');
INSERT INTO TIPO (codigo, nombre, cod_clase, cod_tipo_dato) VALUES ('BASE_IMPONIBLE_18', N'Base imponible', 'TAP', 'DECIMAL');
INSERT INTO TIPO (codigo, nombre, cod_clase, cod_tipo_dato) VALUES ('PARTIDA_19', N'Partida', 'TAP', 'VARCHAR');
INSERT INTO TIPO (codigo, nombre, cod_clase, cod_tipo_dato) VALUES ('MTS_PRODUCTIVOS_19', N'Metros productivos', 'TAP', 'DECIMAL');
INSERT INTO TIPO (codigo, nombre, cod_clase, cod_tipo_dato) VALUES ('BASE_IMPONIBLE_19', N'Base imponible', 'TAP', 'DECIMAL');
INSERT INTO TIPO (codigo, nombre, cod_clase, cod_tipo_dato) VALUES ('PARTIDA_20', N'Partida', 'TAP', 'VARCHAR');
INSERT INTO TIPO (codigo, nombre, cod_clase, cod_tipo_dato) VALUES ('MTS_PRODUCTIVOS_20', N'Metros productivos', 'TAP', 'DECIMAL');
INSERT INTO TIPO (codigo, nombre, cod_clase, cod_tipo_dato) VALUES ('BASE_IMPONIBLE_20', N'Base imponible', 'TAP', 'DECIMAL');
INSERT INTO TIPO (codigo, nombre, cod_clase, cod_tipo_dato) VALUES ('PARTIDA_21', N'Partida', 'TAP', 'VARCHAR');
INSERT INTO TIPO (codigo, nombre, cod_clase, cod_tipo_dato) VALUES ('MTS_PRODUCTIVOS_21', N'Metros productivos', 'TAP', 'DECIMAL');
INSERT INTO TIPO (codigo, nombre, cod_clase, cod_tipo_dato) VALUES ('BASE_IMPONIBLE_21', N'Base imponible', 'TAP', 'DECIMAL');
INSERT INTO TIPO (codigo, nombre, cod_clase, cod_tipo_dato) VALUES ('PARTIDA_22', N'Partida', 'TAP', 'VARCHAR');
INSERT INTO TIPO (codigo, nombre, cod_clase, cod_tipo_dato) VALUES ('MTS_PRODUCTIVOS_22', N'Metros productivos', 'TAP', 'DECIMAL');
INSERT INTO TIPO (codigo, nombre, cod_clase, cod_tipo_dato) VALUES ('BASE_IMPONIBLE_22', N'Base imponible', 'TAP', 'DECIMAL');
INSERT INTO TIPO (codigo, nombre, cod_clase, cod_tipo_dato) VALUES ('PARTIDA_23', N'Partida', 'TAP', 'VARCHAR');
INSERT INTO TIPO (codigo, nombre, cod_clase, cod_tipo_dato) VALUES ('MTS_PRODUCTIVOS_23', N'Metros productivos', 'TAP', 'DECIMAL');
INSERT INTO TIPO (codigo, nombre, cod_clase, cod_tipo_dato) VALUES ('BASE_IMPONIBLE_23', N'Base imponible', 'TAP', 'DECIMAL');
INSERT INTO TIPO (codigo, nombre, cod_clase, cod_tipo_dato) VALUES ('PARTIDA_24', N'Partida', 'TAP', 'VARCHAR');
INSERT INTO TIPO (codigo, nombre, cod_clase, cod_tipo_dato) VALUES ('MTS_PRODUCTIVOS_24', N'Metros productivos', 'TAP', 'DECIMAL');
INSERT INTO TIPO (codigo, nombre, cod_clase, cod_tipo_dato) VALUES ('BASE_IMPONIBLE_24', N'Base imponible', 'TAP', 'DECIMAL');
INSERT INTO TIPO (codigo, nombre, cod_clase, cod_tipo_dato) VALUES ('PARTIDA_25', N'Partida', 'TAP', 'VARCHAR');
INSERT INTO TIPO (codigo, nombre, cod_clase, cod_tipo_dato) VALUES ('MTS_PRODUCTIVOS_25', N'Metros productivos', 'TAP', 'DECIMAL');
INSERT INTO TIPO (codigo, nombre, cod_clase, cod_tipo_dato) VALUES ('BASE_IMPONIBLE_25', N'Base imponible', 'TAP', 'DECIMAL');
INSERT INTO TIPO (codigo, nombre, cod_clase, cod_tipo_dato) VALUES ('PARTIDA_26', N'Partida', 'TAP', 'VARCHAR');
INSERT INTO TIPO (codigo, nombre, cod_clase, cod_tipo_dato) VALUES ('MTS_PRODUCTIVOS_26', N'Metros productivos', 'TAP', 'DECIMAL');
INSERT INTO TIPO (codigo, nombre, cod_clase, cod_tipo_dato) VALUES ('BASE_IMPONIBLE_26', N'Base imponible', 'TAP', 'DECIMAL');
INSERT INTO TIPO (codigo, nombre, cod_clase, cod_tipo_dato) VALUES ('PARTIDA_27', N'Partida', 'TAP', 'VARCHAR');
INSERT INTO TIPO (codigo, nombre, cod_clase, cod_tipo_dato) VALUES ('MTS_PRODUCTIVOS_27', N'Metros productivos', 'TAP', 'DECIMAL');
INSERT INTO TIPO (codigo, nombre, cod_clase, cod_tipo_dato) VALUES ('BASE_IMPONIBLE_27', N'Base imponible', 'TAP', 'DECIMAL');
INSERT INTO TIPO (codigo, nombre, cod_clase, cod_tipo_dato) VALUES ('PARTIDA_28', N'Partida', 'TAP', 'VARCHAR');
INSERT INTO TIPO (codigo, nombre, cod_clase, cod_tipo_dato) VALUES ('MTS_PRODUCTIVOS_28', N'Metros productivos', 'TAP', 'DECIMAL');
INSERT INTO TIPO (codigo, nombre, cod_clase, cod_tipo_dato) VALUES ('BASE_IMPONIBLE_28', N'Base imponible', 'TAP', 'DECIMAL');
INSERT INTO TIPO (codigo, nombre, cod_clase, cod_tipo_dato) VALUES ('PARTIDA_29', N'Partida', 'TAP', 'VARCHAR');
INSERT INTO TIPO (codigo, nombre, cod_clase, cod_tipo_dato) VALUES ('MTS_PRODUCTIVOS_29', N'Metros productivos', 'TAP', 'DECIMAL');
INSERT INTO TIPO (codigo, nombre, cod_clase, cod_tipo_dato) VALUES ('BASE_IMPONIBLE_29', N'Base imponible', 'TAP', 'DECIMAL');
INSERT INTO TIPO (codigo, nombre, cod_clase, cod_tipo_dato) VALUES ('PARTIDA_30', N'Partida', 'TAP', 'VARCHAR');
INSERT INTO TIPO (codigo, nombre, cod_clase, cod_tipo_dato) VALUES ('MTS_PRODUCTIVOS_30', N'Metros productivos', 'TAP', 'DECIMAL');
INSERT INTO TIPO (codigo, nombre, cod_clase, cod_tipo_dato) VALUES ('BASE_IMPONIBLE_30', N'Base imponible', 'TAP', 'DECIMAL');

--- GESTIÓN DE RESIDUOS A GRANDES GENERADORES
--- Pendiente de definición de tipos


