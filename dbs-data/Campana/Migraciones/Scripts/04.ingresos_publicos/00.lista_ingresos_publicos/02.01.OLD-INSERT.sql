USE LARAMIE_CAMPANA
GO

TRUNCATE TABLE lista_ingresos_publicos
GO

------------Listas Fijas de este microservicios (Reservado hasta id 499)------------------------

INSERT INTO lista_ingresos_publicos VALUES (1,'1','EstadoCuenta','Pendiente',1);
INSERT INTO lista_ingresos_publicos VALUES (2,'2','EstadoCuenta','Activa',2);
INSERT INTO lista_ingresos_publicos VALUES (3,'3','EstadoCuenta','Inactiva',3);

INSERT INTO lista_ingresos_publicos VALUES (10,'1','TipoTributo','Inmueble',1);
INSERT INTO lista_ingresos_publicos VALUES (11,'2','TipoTributo','Comercio',2);
INSERT INTO lista_ingresos_publicos VALUES (12,'5','TipoTributo','Veh�culo',3);
INSERT INTO lista_ingresos_publicos VALUES (13,'3','TipoTributo','Cementerios',4);
INSERT INTO lista_ingresos_publicos VALUES (14,'4','TipoTributo','Fondeaderos',5);
INSERT INTO lista_ingresos_publicos VALUES (15,'7','TipoTributo','Cuentas Especiales',6);

INSERT INTO lista_ingresos_publicos VALUES (20,'1','EstadoCarga','Incompleta',1);
INSERT INTO lista_ingresos_publicos VALUES (21,'2','EstadoCarga','Completa',2);

INSERT INTO lista_ingresos_publicos VALUES (40,'F','TipoLado','Frente',1);
INSERT INTO lista_ingresos_publicos VALUES (41,'L','TipoLado','Lado',2);
INSERT INTO lista_ingresos_publicos VALUES (42,'N','TipoLado','Fondo',3);
INSERT INTO lista_ingresos_publicos VALUES (43,'O','TipoLado','Ochava',4);

INSERT INTO lista_ingresos_publicos VALUES (50,'100','TipoVinculoInmueble','RESPONSABLE DE CUENTA',1);
INSERT INTO lista_ingresos_publicos VALUES (51,'1','TipoVinculoInmueble','TITULAR',2);
INSERT INTO lista_ingresos_publicos VALUES (52,'71','TipoVinculoInmueble','TITULAR EN TRIPARTITO',71);
INSERT INTO lista_ingresos_publicos VALUES (600,'2','TipoVinculoInmueble','DESTINATARIO',3);
INSERT INTO lista_ingresos_publicos VALUES (601,'3','TipoVinculoInmueble','PRESIDENTE',4);
INSERT INTO lista_ingresos_publicos VALUES (602,'10','TipoVinculoInmueble','REPRESENTANTE',5);
--INSERT INTO lista_ingresos_publicos VALUES (000,'11','TipoVinculoInmueble','CO-TITULAR',0);
INSERT INTO lista_ingresos_publicos VALUES (603,'20','TipoVinculoInmueble','RELEVAMIENTO VERIFICADORES',6);
INSERT INTO lista_ingresos_publicos VALUES (604,'21','TipoVinculoInmueble','C.U.I.T. / INGRESOS BRUTOS',7);
INSERT INTO lista_ingresos_publicos VALUES (605,'25','TipoVinculoInmueble','TITULAR ANTERIOR',8);
INSERT INTO lista_ingresos_publicos VALUES (606,'50','TipoVinculoInmueble','PERSONAL - TITULAR',9);
INSERT INTO lista_ingresos_publicos VALUES (607,'51','TipoVinculoInmueble','PERSONAL - INQUILINO',10);
INSERT INTO lista_ingresos_publicos VALUES (608,'52','TipoVinculoInmueble','PERSONAL - OTROS',11);
INSERT INTO lista_ingresos_publicos VALUES (609,'53','TipoVinculoInmueble','VINCULADO AL TRIBUTO',12);
INSERT INTO lista_ingresos_publicos VALUES (610,'54','TipoVinculoInmueble','FIRMANTE CONVENIO',13);

INSERT INTO lista_ingresos_publicos VALUES (60,'100','TipoVinculoComercio','RESPONSABLE DE CUENTA',1);
INSERT INTO lista_ingresos_publicos VALUES (61,'1','TipoVinculoComercio','TITULAR',2);
INSERT INTO lista_ingresos_publicos VALUES (620,'2','TipoVinculoComercio','DESTINATARIO',3);
INSERT INTO lista_ingresos_publicos VALUES (621,'3','TipoVinculoComercio','PRESIDENTE',4);
INSERT INTO lista_ingresos_publicos VALUES (622,'4','TipoVinculoComercio','GERENTE',5);
INSERT INTO lista_ingresos_publicos VALUES (623,'5','TipoVinculoComercio','APODERADO',6);
INSERT INTO lista_ingresos_publicos VALUES (624,'6','TipoVinculoComercio','DIRECTOR SUPLENTE',7);
INSERT INTO lista_ingresos_publicos VALUES (625,'7','TipoVinculoComercio','SOCIO',8);
INSERT INTO lista_ingresos_publicos VALUES (626,'8','TipoVinculoComercio','VICE PRESIDENTE',9);
INSERT INTO lista_ingresos_publicos VALUES (627,'9','TipoVinculoComercio','SOCIO GERENTE',10);
INSERT INTO lista_ingresos_publicos VALUES (628,'10','TipoVinculoComercio','REPRESENTANTE',11);
--INSERT INTO lista_ingresos_publicos VALUES (000,'11','TipoVinculoComercio','CO-TITULAR',0);
INSERT INTO lista_ingresos_publicos VALUES (629,'12','TipoVinculoComercio','DIRECTOR',12);
INSERT INTO lista_ingresos_publicos VALUES (630,'13','TipoVinculoComercio','DIRECTOR/A TECNICO/A',13);
INSERT INTO lista_ingresos_publicos VALUES (631,'15','TipoVinculoComercio','MARTILLERO / CORREDOR',14);
INSERT INTO lista_ingresos_publicos VALUES (632,'16','TipoVinculoComercio','PROVEEDOR MUNICIPAL',15);
INSERT INTO lista_ingresos_publicos VALUES (633,'17','TipoVinculoComercio','REPRESENTANTE LEGAL',16);
INSERT INTO lista_ingresos_publicos VALUES (634,'20','TipoVinculoComercio','RELEVAMIENTO VERIFICADORES',17);
INSERT INTO lista_ingresos_publicos VALUES (635,'21','TipoVinculoComercio','C.U.I.T. / INGRESOS BRUTOS',18);
INSERT INTO lista_ingresos_publicos VALUES (636,'22','TipoVinculoComercio','SUCESOR',19);
INSERT INTO lista_ingresos_publicos VALUES (637,'25','TipoVinculoComercio','TITULAR ANTERIOR',20);
INSERT INTO lista_ingresos_publicos VALUES (638,'50','TipoVinculoComercio','PERSONAL - TITULAR',21);
INSERT INTO lista_ingresos_publicos VALUES (639,'52','TipoVinculoComercio','PERSONAL - OTROS',22);
INSERT INTO lista_ingresos_publicos VALUES (640,'53','TipoVinculoComercio','VINCULADO AL TRIBUTO',23);
INSERT INTO lista_ingresos_publicos VALUES (641,'54','TipoVinculoComercio','FIRMANTE CONVENIO',24);
INSERT INTO lista_ingresos_publicos VALUES (642,'55','TipoVinculoComercio','RESPONSABLE DDJJ WEB',25);

INSERT INTO lista_ingresos_publicos VALUES (70,'100','TipoVinculoVehiculo','RESPONSABLE DE CUENTA',1);
INSERT INTO lista_ingresos_publicos VALUES (71,'1','TipoVinculoVehiculo','TITULAR',2);
INSERT INTO lista_ingresos_publicos VALUES (650,'2','TipoVinculoVehiculo','DESTINATARIO',3);
INSERT INTO lista_ingresos_publicos VALUES (651,'4','TipoVinculoVehiculo','GERENTE',4);
INSERT INTO lista_ingresos_publicos VALUES (652,'9','TipoVinculoVehiculo','SOCIO GERENTE',5);
--INSERT INTO lista_ingresos_publicos VALUES (000,'11','TipoVinculoVehiculo','CO-TITULAR',0);
INSERT INTO lista_ingresos_publicos VALUES (653,'14','TipoVinculoVehiculo','AGENTE/AGENCIA PUBLICITARIO/A',6);
INSERT INTO lista_ingresos_publicos VALUES (654,'18','TipoVinculoVehiculo','TITULAR SUCERP',7);
INSERT INTO lista_ingresos_publicos VALUES (655,'21','TipoVinculoVehiculo','C.U.I.T. / INGRESOS BRUTOS',8);
INSERT INTO lista_ingresos_publicos VALUES (656,'25','TipoVinculoVehiculo','TITULAR ANTERIOR',9);
INSERT INTO lista_ingresos_publicos VALUES (657,'53','TipoVinculoVehiculo','VINCULADO AL TRIBUTO',10);
INSERT INTO lista_ingresos_publicos VALUES (658,'54','TipoVinculoVehiculo','FIRMANTE CONVENIO',11);

INSERT INTO lista_ingresos_publicos VALUES (80,'100','TipoVinculoCementerio','RESPONSABLE DE CUENTA',1);
INSERT INTO lista_ingresos_publicos VALUES (81,'1','TipoVinculoCementerio','TITULAR',2);
INSERT INTO lista_ingresos_publicos VALUES (660,'2','TipoVinculoCementerio','DESTINATARIO',3);
INSERT INTO lista_ingresos_publicos VALUES (661,'5','TipoVinculoCementerio','APODERADO',4);
INSERT INTO lista_ingresos_publicos VALUES (662,'10','TipoVinculoCementerio','REPRESENTANTE',5);
INSERT INTO lista_ingresos_publicos VALUES (663,'17','TipoVinculoCementerio','REPRESENTANTE LEGAL',6);
INSERT INTO lista_ingresos_publicos VALUES (664,'22','TipoVinculoCementerio','SUCESOR',7);
INSERT INTO lista_ingresos_publicos VALUES (665,'25','TipoVinculoCementerio','TITULAR ANTERIOR',8);
INSERT INTO lista_ingresos_publicos VALUES (666,'53','TipoVinculoCementerio','VINCULADO AL TRIBUTO',9);
INSERT INTO lista_ingresos_publicos VALUES (667,'54','TipoVinculoCementerio','FIRMANTE CONVENIO',10);
INSERT INTO lista_ingresos_publicos VALUES (668,'60','TipoVinculoCementerio','PERSONA ASOCIADA POR AUTOGEST.',11);

INSERT INTO lista_ingresos_publicos VALUES (90,'100','TipoVinculoFondeadero','RESPONSABLE DE CUENTA',1);
INSERT INTO lista_ingresos_publicos VALUES (91,'1','TipoVinculoFondeadero','TITULAR',2);
INSERT INTO lista_ingresos_publicos VALUES (670,'2','TipoVinculoFondeadero','DESTINATARIO',3);
INSERT INTO lista_ingresos_publicos VALUES (671,'5','TipoVinculoFondeadero','APODERADO',4);
INSERT INTO lista_ingresos_publicos VALUES (672,'10','TipoVinculoFondeadero','REPRESENTANTE',5);
INSERT INTO lista_ingresos_publicos VALUES (673,'17','TipoVinculoFondeadero','REPRESENTANTE LEGAL',6);
INSERT INTO lista_ingresos_publicos VALUES (674,'22','TipoVinculoFondeadero','SUCESOR',7);
INSERT INTO lista_ingresos_publicos VALUES (675,'25','TipoVinculoFondeadero','TITULAR ANTERIOR',8);
INSERT INTO lista_ingresos_publicos VALUES (676,'53','TipoVinculoFondeadero','VINCULADO AL TRIBUTO',9);
INSERT INTO lista_ingresos_publicos VALUES (677,'54','TipoVinculoFondeadero','FIRMANTE CONVENIO',10);
INSERT INTO lista_ingresos_publicos VALUES (678,'55','TipoVinculoFondeadero','RESPONSABLE DDJJ WEB',11);
INSERT INTO lista_ingresos_publicos VALUES (679,'60','TipoVinculoFondeadero','PERSONA ASOCIADA POR AUTOGEST.',12);

INSERT INTO lista_ingresos_publicos VALUES (100,'100','TipoVinculoEspecial','RESPONSABLE DE CUENTA',1);
INSERT INTO lista_ingresos_publicos VALUES (101,'1','TipoVinculoEspecial','TITULAR',2);

INSERT INTO lista_ingresos_publicos VALUES (110,'1','Ordenamiento','Sin definir',1);
INSERT INTO lista_ingresos_publicos VALUES (111,'2','Ordenamiento','Nomenclatura',2);
INSERT INTO lista_ingresos_publicos VALUES (112,'3','Ordenamiento','Nomenclatura parcial',3);
INSERT INTO lista_ingresos_publicos VALUES (113,'4','Ordenamiento','Domicilio',4);
INSERT INTO lista_ingresos_publicos VALUES (114,'5','Ordenamiento','Cuenta',5);
INSERT INTO lista_ingresos_publicos VALUES (115,'6','Ordenamiento','No ordenar',6);

INSERT INTO lista_ingresos_publicos VALUES (120,'1','OrdenamientoGeneral','Cuenta',1);
INSERT INTO lista_ingresos_publicos VALUES (121,'2','OrdenamientoGeneral','Nomenclatura',2);
INSERT INTO lista_ingresos_publicos VALUES (122,'3','OrdenamientoGeneral','Domicilio',3);
INSERT INTO lista_ingresos_publicos VALUES (123,'4','OrdenamientoGeneral','Domicilio (Par/Impar)',4);
INSERT INTO lista_ingresos_publicos VALUES (124,'5','OrdenamientoGeneral','Controlador-Domicilio',5);
INSERT INTO lista_ingresos_publicos VALUES (125,'6','OrdenamientoGeneral','Controlador-Domicilio (Par/Impar)',6);
INSERT INTO lista_ingresos_publicos VALUES (126,'7','OrdenamientoGeneral','Controlador-N�mero',7);

INSERT INTO lista_ingresos_publicos VALUES (130,'SUCERP','TipoArchivoImportacion','SUCERP',1);
INSERT INTO lista_ingresos_publicos VALUES (131,'SUGIT','TipoArchivoImportacion','Actas/Causas (SUGIT)',2);
INSERT INTO lista_ingresos_publicos VALUES (132,'ARBA_VEHICULO','TipoArchivoImportacion','ARBA Veh�culos',3);
INSERT INTO lista_ingresos_publicos VALUES (133,'ARBA_CATASTRO','TipoArchivoImportacion','ARBA Catastro',4);

INSERT INTO lista_ingresos_publicos VALUES (140,'1','TipoDatosArba','Datos Formales',1);
INSERT INTO lista_ingresos_publicos VALUES (141,'2','TipoDatosArba','Datos de Propietarios',2);
INSERT INTO lista_ingresos_publicos VALUES (142,'3','TipoDatosArba','Datos de Deuda',3);
INSERT INTO lista_ingresos_publicos VALUES (143,'4','TipoDatosArba','Datos de Denuncia',4);

INSERT INTO lista_ingresos_publicos VALUES (150,'1','TipoFondeadero','Fijos individuales',1);
INSERT INTO lista_ingresos_publicos VALUES (151,'2','TipoFondeadero','Fijos colectivos',2);
INSERT INTO lista_ingresos_publicos VALUES (152,'3','TipoFondeadero','Accidentales',3);
INSERT INTO lista_ingresos_publicos VALUES (153,'4','TipoFondeadero','Estacionamiento',4);

INSERT INTO lista_ingresos_publicos VALUES (160,'1','TipoMinimoAplicable','General',1);
INSERT INTO lista_ingresos_publicos VALUES (161,'2','TipoMinimoAplicable','Especial',2);

INSERT INTO lista_ingresos_publicos VALUES (210,'1','CategoriaFuncion','L�gica',1);
INSERT INTO lista_ingresos_publicos VALUES (211,'2','CategoriaFuncion','Matem�tica',2);
INSERT INTO lista_ingresos_publicos VALUES (212,'3','CategoriaFuncion','Conversi�n',3);
INSERT INTO lista_ingresos_publicos VALUES (213,'4','CategoriaFuncion','Formato',4);
INSERT INTO lista_ingresos_publicos VALUES (214,'5','CategoriaFuncion','Datos',5);

INSERT INTO lista_ingresos_publicos VALUES (230,'1','EstadoEmisionDefinicion','Activa',1);
INSERT INTO lista_ingresos_publicos VALUES (231,'2','EstadoEmisionDefinicion','Inactiva',2);

INSERT INTO lista_ingresos_publicos VALUES (240,'1','TipoEmisionCalculo','Auxiliar',1);
INSERT INTO lista_ingresos_publicos VALUES (241,'2','TipoEmisionCalculo','Parcial',2);
INSERT INTO lista_ingresos_publicos VALUES (242,'3','TipoEmisionCalculo','Resultado',3);

INSERT INTO lista_ingresos_publicos VALUES (250,'1','EstadoEmisionEjecucion','Pendiente',1);
INSERT INTO lista_ingresos_publicos VALUES (251,'2','EstadoEmisionEjecucion','Proceso',2);
INSERT INTO lista_ingresos_publicos VALUES (252,'3','EstadoEmisionEjecucion','Finalizada',3);
INSERT INTO lista_ingresos_publicos VALUES (253,'4','EstadoEmisionEjecucion','Cancelada',4);
INSERT INTO lista_ingresos_publicos VALUES (254,'5','EstadoEmisionEjecucion','Pausada',5);

INSERT INTO lista_ingresos_publicos VALUES (260,'1','EstadoEmisionEjecucionCuenta','Pendiente',1);
INSERT INTO lista_ingresos_publicos VALUES (261,'2','EstadoEmisionEjecucionCuenta','Proceso',2);
INSERT INTO lista_ingresos_publicos VALUES (262,'3','EstadoEmisionEjecucionCuenta','Finalizada',3);
INSERT INTO lista_ingresos_publicos VALUES (263,'4','EstadoEmisionEjecucionCuenta','Cancelada',4);
INSERT INTO lista_ingresos_publicos VALUES (264,'5','EstadoEmisionEjecucionCuenta','Error',5);

INSERT INTO lista_ingresos_publicos VALUES (270,'1','EstadoEmisionCalculoResultado','Calculado',1);
INSERT INTO lista_ingresos_publicos VALUES (271,'2','EstadoEmisionCalculoResultado','Error',2);

INSERT INTO lista_ingresos_publicos VALUES (280,'1','EstadoEmisionConceptoResultado','Calculado',1);
INSERT INTO lista_ingresos_publicos VALUES (281,'2','EstadoEmisionConceptoResultado','Error',2);

INSERT INTO lista_ingresos_publicos VALUES (290,'1','EstadoEmisionCuentaCorrienteResultado','Calculado',1);
INSERT INTO lista_ingresos_publicos VALUES (291,'2','EstadoEmisionCuentaCorrienteResultado','Error',2);

INSERT INTO lista_ingresos_publicos VALUES (300,'1','EstadoEmisionImputacionContableResultado','Calculado',1);
INSERT INTO lista_ingresos_publicos VALUES (301,'2','EstadoEmisionImputacionContableResultado','Error',2);

INSERT INTO lista_ingresos_publicos VALUES (320,'1','TipoValor','Pesos',1);
INSERT INTO lista_ingresos_publicos VALUES (321,'2','TipoValor','D�lar',2);

INSERT INTO lista_ingresos_publicos VALUES (330,'1','TipoConsumoElectrico','Medidor propio',1);
INSERT INTO lista_ingresos_publicos VALUES (331,'2','TipoConsumoElectrico','Medidor compartido',2);

INSERT INTO lista_ingresos_publicos VALUES (340,'1','EmisionProceso','TasaVencimiento',1);
INSERT INTO lista_ingresos_publicos VALUES (341,'2','EmisionProceso','ImputacionContable',2);
INSERT INTO lista_ingresos_publicos VALUES (342,'3','EmisionProceso','Concepto',3);
INSERT INTO lista_ingresos_publicos VALUES (343,'4','EmisionProceso','CuentaCorriente',4);
INSERT INTO lista_ingresos_publicos VALUES (344,'5','EmisionProceso','PublicacionDeuda',5);

INSERT INTO lista_ingresos_publicos VALUES (350,'1','EstadoAprobacion','Pendiente',1);
INSERT INTO lista_ingresos_publicos VALUES (351,'2','EstadoAprobacion','Aprobado',2);
INSERT INTO lista_ingresos_publicos VALUES (352,'3','EstadoAprobacion','Rechazado',3);

INSERT INTO lista_ingresos_publicos VALUES (360,'1','EstadoProceso','Pendiente',1);
INSERT INTO lista_ingresos_publicos VALUES (361,'2','EstadoProceso','Progreso',2);
INSERT INTO lista_ingresos_publicos VALUES (362,'3','EstadoProceso','Finalizado',3);
INSERT INTO lista_ingresos_publicos VALUES (363,'4','EstadoProceso','Error',4);
INSERT INTO lista_ingresos_publicos VALUES (364,'5','EstadoProceso','Cancelado',5);

INSERT INTO lista_ingresos_publicos VALUES (370,'1','TipoProgramacion','Diaria',1);
INSERT INTO lista_ingresos_publicos VALUES (371,'2','TipoProgramacion','Semanal',2);
INSERT INTO lista_ingresos_publicos VALUES (372,'3','TipoProgramacion','Mensual',3);

INSERT INTO lista_ingresos_publicos VALUES (380,'1','TipoPrestadorCementerio','Arrendatarios',1);
INSERT INTO lista_ingresos_publicos VALUES (381,'2','TipoPrestadorCementerio','Prestador de servicios',2);

INSERT INTO lista_ingresos_publicos VALUES (390,'1','PeriodicidadDeclaracionJurada','Mensual',1);
INSERT INTO lista_ingresos_publicos VALUES (391,'2','PeriodicidadDeclaracionJurada','Bimestral',2);
INSERT INTO lista_ingresos_publicos VALUES (392,'3','PeriodicidadDeclaracionJurada','Trimestral',3);
INSERT INTO lista_ingresos_publicos VALUES (393,'6','PeriodicidadDeclaracionJurada','Semestral',4);
INSERT INTO lista_ingresos_publicos VALUES (394,'12','PeriodicidadDeclaracionJurada','Anual',5);

INSERT INTO lista_ingresos_publicos VALUES (400,'1','EstadoCertificadoApremio','Calculado',1);
INSERT INTO lista_ingresos_publicos VALUES (401,'2','EstadoCertificadoApremio','Notificacdo',2);
INSERT INTO lista_ingresos_publicos VALUES (402,'3','EstadoCertificadoApremio','Recibido',3);
INSERT INTO lista_ingresos_publicos VALUES (403,'4','EstadoCertificadoApremio','Cancelado',4);

INSERT INTO lista_ingresos_publicos VALUES (410,'1','EstadoPlanPagoDefinicion','Activo',1);
INSERT INTO lista_ingresos_publicos VALUES (411,'2','EstadoPlanPagoDefinicion','Inactivo',2);

INSERT INTO lista_ingresos_publicos VALUES (420,'1','TipoAlcanceTemporal','Est�tico',1);
INSERT INTO lista_ingresos_publicos VALUES (421,'2','TipoAlcanceTemporal','Din�mico',2);

INSERT INTO lista_ingresos_publicos VALUES (430,'1','TipoCalculoInteres','M�todo Simple',1);
INSERT INTO lista_ingresos_publicos VALUES (431,'2','TipoCalculoInteres','M�todo Franc�s',2);

INSERT INTO lista_ingresos_publicos VALUES (440,'1','EstadoPlanPagoCuota','Pendiente',1);
INSERT INTO lista_ingresos_publicos VALUES (441,'2','EstadoPlanPagoCuota','Pagado',2);
INSERT INTO lista_ingresos_publicos VALUES (442,'3','EstadoPlanPagoCuota','Cancelado',3);

INSERT INTO lista_ingresos_publicos VALUES (450,'1','ViaConsolidacion','Web',1);
INSERT INTO lista_ingresos_publicos VALUES (451,'2','ViaConsolidacion','Presencial',2);
INSERT INTO lista_ingresos_publicos VALUES (452,'3','ViaConsolidacion','Ambas',3);

INSERT INTO lista_ingresos_publicos VALUES (460,'1','EstadoPagoContadoDefinicion','Activo',1);
INSERT INTO lista_ingresos_publicos VALUES (461,'2','EstadoPagoContadoDefinicion','Inactivo',2);

INSERT INTO lista_ingresos_publicos VALUES (470,'1','EstadoProcedimiento','Activo',1);
INSERT INTO lista_ingresos_publicos VALUES (471,'2','EstadoProcedimiento','Inactivo',2);

INSERT INTO lista_ingresos_publicos VALUES (480,'1','UnidadMedida','Unidades enteras',1);
INSERT INTO lista_ingresos_publicos VALUES (481,'2','UnidadMedida','Unidades decimales',2);
INSERT INTO lista_ingresos_publicos VALUES (482,'3','UnidadMedida','Importe',3);
INSERT INTO lista_ingresos_publicos VALUES (483,'4','UnidadMedida','Otros',4);

INSERT INTO lista_ingresos_publicos VALUES (490,'1','UnidadValor','Porcentaje',1);
INSERT INTO lista_ingresos_publicos VALUES (491,'2','UnidadValor','Importe',2);
INSERT INTO lista_ingresos_publicos VALUES (492,'3','UnidadValor','UF',3);
-- ORIGINAL TIGRE (POR AHORA QUEDA NUESTRA DEFINICION)
-- 1	IMPORTE
-- 2	APORTE JUS
-- 3	HONORARIOS JUS
-- 4	UNIDADES FIJAS

-------------Listas Libres de este microservicios-----------------------

INSERT INTO lista_ingresos_publicos VALUES (1001,'1','TipoObra','AGUA',1);
INSERT INTO lista_ingresos_publicos VALUES (1002,'2','TipoObra','CLOACAS',2);
INSERT INTO lista_ingresos_publicos VALUES (1003,'3','TipoObra','GAS',3);
INSERT INTO lista_ingresos_publicos VALUES (1004,'4','TipoObra','ASFALTO',4);
INSERT INTO lista_ingresos_publicos VALUES (1005,'5','TipoObra','PAVIMENTO',5);

INSERT INTO lista_ingresos_publicos VALUES (1011,'1','TipoObraSuperficie','SUBSISTENTE',1);
INSERT INTO lista_ingresos_publicos VALUES (1012,'2','TipoObraSuperficie','OBRA NUEVA',2);
INSERT INTO lista_ingresos_publicos VALUES (1013,'3','TipoObraSuperficie','MODIFICACIONES',3);
INSERT INTO lista_ingresos_publicos VALUES (1014,'4','TipoObraSuperficie','AMPLIACIONES',4);
INSERT INTO lista_ingresos_publicos VALUES (1015,'5','TipoObraSuperficie','DEMOLICIONES',5);
INSERT INTO lista_ingresos_publicos VALUES (1016,'6','TipoObraSuperficie','CONFORME A OBRA',6);

INSERT INTO lista_ingresos_publicos VALUES (1021,'1','DestinoSuperficie','VIVIENDA UNIFAMILIAR',1);
INSERT INTO lista_ingresos_publicos VALUES (1022,'2','DestinoSuperficie','VIVIENDA MULTIFAMILIAR',2);
INSERT INTO lista_ingresos_publicos VALUES (1023,'3','DestinoSuperficie','LOCAL Y OFICINAS',3);
INSERT INTO lista_ingresos_publicos VALUES (1024,'4','DestinoSuperficie','RERECREACI�N',4);
INSERT INTO lista_ingresos_publicos VALUES (1025,'5','DestinoSuperficie','GARAGES Y EST. DE SERVICIOS',5);
INSERT INTO lista_ingresos_publicos VALUES (1026,'6','DestinoSuperficie','INDUSTRIAS Y TALLERES',6);

INSERT INTO lista_ingresos_publicos VALUES (1040,'1','TipoValuacion','Valuaci�n Fiscal ARBA',1);

INSERT INTO lista_ingresos_publicos VALUES (1090, '1','FrecuenciaFacturacion', 'Mensual', 1);
INSERT INTO lista_ingresos_publicos VALUES (1091, '2','FrecuenciaFacturacion', 'Bimestral', 2);
INSERT INTO lista_ingresos_publicos VALUES (1092, '3','FrecuenciaFacturacion', 'Trimestral', 3);
INSERT INTO lista_ingresos_publicos VALUES (1093, '4','FrecuenciaFacturacion', 'Semestral', 4);
INSERT INTO lista_ingresos_publicos VALUES (1094, '5','FrecuenciaFacturacion', 'Anual', 5);

INSERT INTO lista_ingresos_publicos VALUES (1100, '1', 'TipoSolicitudDebitoAutomatico', 'Alta', 1);
INSERT INTO lista_ingresos_publicos VALUES (1101, '2', 'TipoSolicitudDebitoAutomatico', 'Modificaci�n', 2);

INSERT INTO lista_ingresos_publicos VALUES (1130,'1','OrigenFabricacion','Nacional',1);
INSERT INTO lista_ingresos_publicos VALUES (1131,'2','OrigenFabricacion','Importado',2);

INSERT INTO lista_ingresos_publicos VALUES (1140,'N','Combustible','NAFTA',1);
INSERT INTO lista_ingresos_publicos VALUES (1141,'D','Combustible','DIESEL',2);
INSERT INTO lista_ingresos_publicos VALUES (1142,'G','Combustible','GNC-NAFTA',3);
INSERT INTO lista_ingresos_publicos VALUES (1143,'F','Combustible','GNC-DIESEL',4);

INSERT INTO lista_ingresos_publicos VALUES (1150,'1','FinalidadVehiculo','USO PARTICULAR',1);
INSERT INTO lista_ingresos_publicos VALUES (1151,'2','FinalidadVehiculo','USO COMERCIAL',2);

INSERT INTO lista_ingresos_publicos VALUES (1190,'1','MotivoInspeccion','ACTA CLAUSURA',1);
INSERT INTO lista_ingresos_publicos VALUES (1191,'2','MotivoInspeccion','VERIFICACI�N',2);
INSERT INTO lista_ingresos_publicos VALUES (1192,'3','MotivoInspeccion','FALTA PRESENTACI�N DDJJ',3);
INSERT INTO lista_ingresos_publicos VALUES (1193,'4','MotivoInspeccion','CRUCE DE INFORMACI�N',4);
INSERT INTO lista_ingresos_publicos VALUES (1194,'5','MotivoInspeccion','RELEVAMIENTO',5);
INSERT INTO lista_ingresos_publicos VALUES (1195,'6','MotivoInspeccion','O. I.',6);

INSERT INTO lista_ingresos_publicos VALUES (1170,'1','MotivoFallecimiento','TRAUMATICO',1);
INSERT INTO lista_ingresos_publicos VALUES (1171,'2','MotivoFallecimiento','NO TRAUMATICO',2);
INSERT INTO lista_ingresos_publicos VALUES (1172,'9999','MotivoFallecimiento','DESCONOCIDO',3);

INSERT INTO lista_ingresos_publicos VALUES (1210,'1','ResultadoVerificacion','REDUCIDO',1);
INSERT INTO lista_ingresos_publicos VALUES (1211,'2','ResultadoVerificacion','CENIZAS',2);
INSERT INTO lista_ingresos_publicos VALUES (1212,'3','ResultadoVerificacion','EN CARNE',3);

INSERT INTO lista_ingresos_publicos VALUES (1270,'1','TipoCuota','EMISION',1);

INSERT INTO lista_ingresos_publicos VALUES (1280,'1','Numeracion','Emisi�n Inmuebles',1);
INSERT INTO lista_ingresos_publicos VALUES (1281,'2','Numeracion','Emisi�n Comercios',2);
INSERT INTO lista_ingresos_publicos VALUES (1282,'3','Numeracion','Emisi�n Veh�culos',3);
INSERT INTO lista_ingresos_publicos VALUES (1283,'4','Numeracion','Emisi�n Cementerios',4);
INSERT INTO lista_ingresos_publicos VALUES (1284,'5','Numeracion','Emisi�n Fondeaderos',5);
INSERT INTO lista_ingresos_publicos VALUES (1285,'6','Numeracion','Emisi�n Cuentas Especiales',6);

INSERT INTO lista_ingresos_publicos VALUES (1300,'0','TipoCitacion','NORMAL',1);
INSERT INTO lista_ingresos_publicos VALUES (1301,'1','TipoCitacion','FEHACIENTE',2);
INSERT INTO lista_ingresos_publicos VALUES (1302,'2','TipoCitacion','EDICTO',3);

--------LISTAS DE VARIABLES-------------------------------------------------

INSERT INTO lista_ingresos_publicos VALUES (1310,'0','CategoriaVivienda','SIN TIPO VIVIENDA',1);
INSERT INTO lista_ingresos_publicos VALUES (1311,'1','CategoriaVivienda','EDIFICADO',2);
INSERT INTO lista_ingresos_publicos VALUES (1312,'2','CategoriaVivienda','NEGOCIO',3);
INSERT INTO lista_ingresos_publicos VALUES (1313,'4','CategoriaVivienda','INDUSTRIA',4);
INSERT INTO lista_ingresos_publicos VALUES (1314,'5','CategoriaVivienda','EDIFICIOS EN ALTURA',5);
INSERT INTO lista_ingresos_publicos VALUES (1315,'6','CategoriaVivienda','EXPLOTACI�N TUR�STICA',6);
INSERT INTO lista_ingresos_publicos VALUES (1316,'7','CategoriaVivienda','AREA COM�N PRORRATEADA',7);
INSERT INTO lista_ingresos_publicos VALUES (1317,'8','CategoriaVivienda','BALDIO',8);
INSERT INTO lista_ingresos_publicos VALUES (1318,'10','CategoriaVivienda','EXENTO',9);

INSERT INTO lista_ingresos_publicos VALUES (1320,' ','Zonificacion','SIN ZONIFICACION',1);
INSERT INTO lista_ingresos_publicos VALUES (1321,'#','Zonificacion','DOBLE ZONIFICACION',2);
INSERT INTO lista_ingresos_publicos VALUES (1322,'*','Zonificacion','*',3);
INSERT INTO lista_ingresos_publicos VALUES (1323,'**','Zonificacion','DOBLE ZONIFICACION',4);
INSERT INTO lista_ingresos_publicos VALUES (1324,'***','Zonificacion','TRIPLE ZONIFICACION',5);
INSERT INTO lista_ingresos_publicos VALUES (1325,'A1','Zonificacion','A1',6);
INSERT INTO lista_ingresos_publicos VALUES (1326,'A1A','Zonificacion','A1A',7);
INSERT INTO lista_ingresos_publicos VALUES (1327,'A2','Zonificacion','A2 (PRIMERA SECCION ISLAS)',8);
INSERT INTO lista_ingresos_publicos VALUES (1328,'C1','Zonificacion','C1',9);
INSERT INTO lista_ingresos_publicos VALUES (1329,'C2A','Zonificacion','C2A',10);
INSERT INTO lista_ingresos_publicos VALUES (1330,'C2B','Zonificacion','C2B',11);
INSERT INTO lista_ingresos_publicos VALUES (1331,'C3','Zonificacion','C3',12);
INSERT INTO lista_ingresos_publicos VALUES (1332,'C4','Zonificacion','C4',13);
INSERT INTO lista_ingresos_publicos VALUES (1333,'C4A','Zonificacion','C4A',14);
INSERT INTO lista_ingresos_publicos VALUES (1334,'C4B','Zonificacion','C4B',15);
INSERT INTO lista_ingresos_publicos VALUES (1335,'C4C','Zonificacion','C4C',16);
INSERT INTO lista_ingresos_publicos VALUES (1336,'C5','Zonificacion','C5',17);
INSERT INTO lista_ingresos_publicos VALUES (1337,'C6','Zonificacion','C6',18);
INSERT INTO lista_ingresos_publicos VALUES (1338,'CC','Zonificacion','CC',19);
INSERT INTO lista_ingresos_publicos VALUES (1339,'CCA','Zonificacion','CCA',20);
INSERT INTO lista_ingresos_publicos VALUES (1340,'CCC','Zonificacion','CCC',21);
INSERT INTO lista_ingresos_publicos VALUES (1341,'CCE','Zonificacion','CCE',22);
INSERT INTO lista_ingresos_publicos VALUES (1342,'E','Zonificacion','E',23);
INSERT INTO lista_ingresos_publicos VALUES (1343,'EC','Zonificacion','EC',24);
INSERT INTO lista_ingresos_publicos VALUES (1344,'EG','Zonificacion','EG',25);
INSERT INTO lista_ingresos_publicos VALUES (1345,'I1','Zonificacion','I1',26);
INSERT INTO lista_ingresos_publicos VALUES (1346,'I1E','Zonificacion','I1E',27);
INSERT INTO lista_ingresos_publicos VALUES (1347,'I2','Zonificacion','I2',28);
INSERT INTO lista_ingresos_publicos VALUES (1348,'I2E','Zonificacion','I2E',29);
INSERT INTO lista_ingresos_publicos VALUES (1349,'I2I','Zonificacion','I2I',30);
INSERT INTO lista_ingresos_publicos VALUES (1350,'I3','Zonificacion','I3',31);
INSERT INTO lista_ingresos_publicos VALUES (1351,'I3B','Zonificacion','I3B',32);
INSERT INTO lista_ingresos_publicos VALUES (1352,'I4','Zonificacion','I4',33);
INSERT INTO lista_ingresos_publicos VALUES (1353,'IP','Zonificacion','IP',34);
INSERT INTO lista_ingresos_publicos VALUES (1354,'IPC','Zonificacion','IPC',35);
INSERT INTO lista_ingresos_publicos VALUES (1355,'IPD','Zonificacion','IPD',36);
INSERT INTO lista_ingresos_publicos VALUES (1356,'NNU','Zonificacion','NUEVO NUCLEO URBANO',37);
INSERT INTO lista_ingresos_publicos VALUES (1357,'P','Zonificacion','P',38);
INSERT INTO lista_ingresos_publicos VALUES (1358,'R1A','Zonificacion','R1A',39);
INSERT INTO lista_ingresos_publicos VALUES (1359,'R1B','Zonificacion','R1B',40);
INSERT INTO lista_ingresos_publicos VALUES (1360,'R1C','Zonificacion','R1C',41);
INSERT INTO lista_ingresos_publicos VALUES (1361,'R1U','Zonificacion','R1U',42);
INSERT INTO lista_ingresos_publicos VALUES (1362,'R2A','Zonificacion','R2A',43);
INSERT INTO lista_ingresos_publicos VALUES (1363,'R2B','Zonificacion','R2B',44);
INSERT INTO lista_ingresos_publicos VALUES (1364,'R2C','Zonificacion','R2C',45);
INSERT INTO lista_ingresos_publicos VALUES (1365,'R2D','Zonificacion','R2D',46);
INSERT INTO lista_ingresos_publicos VALUES (1366,'R2E','Zonificacion','R2E',47);
INSERT INTO lista_ingresos_publicos VALUES (1367,'R2F','Zonificacion','R2F',48);
INSERT INTO lista_ingresos_publicos VALUES (1368,'R2G','Zonificacion','R2G',49);
INSERT INTO lista_ingresos_publicos VALUES (1369,'R3A','Zonificacion','R3A',50);
INSERT INTO lista_ingresos_publicos VALUES (1370,'R3B','Zonificacion','R3B',51);
INSERT INTO lista_ingresos_publicos VALUES (1371,'R3C','Zonificacion','R3C',52);
INSERT INTO lista_ingresos_publicos VALUES (1372,'R3D','Zonificacion','R3D',53);
INSERT INTO lista_ingresos_publicos VALUES (1373,'R3E','Zonificacion','R3E',54);
INSERT INTO lista_ingresos_publicos VALUES (1374,'R4','Zonificacion','R4',55);
INSERT INTO lista_ingresos_publicos VALUES (1375,'R4U','Zonificacion','R4U',56);
INSERT INTO lista_ingresos_publicos VALUES (1376,'R5','Zonificacion','R5',57);
INSERT INTO lista_ingresos_publicos VALUES (1377,'R5A','Zonificacion','R5A',58);
INSERT INTO lista_ingresos_publicos VALUES (1378,'R6','Zonificacion','R6',59);
INSERT INTO lista_ingresos_publicos VALUES (1379,'R7','Zonificacion','R7',60);
INSERT INTO lista_ingresos_publicos VALUES (1380,'R8','Zonificacion','R8',61);
INSERT INTO lista_ingresos_publicos VALUES (1381,'RM1','Zonificacion','RM1',62);
INSERT INTO lista_ingresos_publicos VALUES (1382,'RPA','Zonificacion','RPA',63);
INSERT INTO lista_ingresos_publicos VALUES (1383,'RPB','Zonificacion','RPB',64);
INSERT INTO lista_ingresos_publicos VALUES (1384,'RPC','Zonificacion','RPC',65);
INSERT INTO lista_ingresos_publicos VALUES (1385,'RPG','Zonificacion','RPG',66);
INSERT INTO lista_ingresos_publicos VALUES (1386,'TC','Zonificacion','TC',67);
INSERT INTO lista_ingresos_publicos VALUES (1387,'TCA','Zonificacion','TCA',68);
INSERT INTO lista_ingresos_publicos VALUES (1388,'TR','Zonificacion','TR',69);
INSERT INTO lista_ingresos_publicos VALUES (1389,'UE','Zonificacion','UE',70);
INSERT INTO lista_ingresos_publicos VALUES (1390,'UEA','Zonificacion','UEA',71);
INSERT INTO lista_ingresos_publicos VALUES (1391,'UEE','Zonificacion','UEE',72);
INSERT INTO lista_ingresos_publicos VALUES (1392,'ZZZ','Zonificacion','ZONIFICACION ERRONEA',73);

--INSERT INTO lista_ingresos_publicos VALUES (1400,'1','BloqueoEmision','SIN BLOQUEO',1);
INSERT INTO lista_ingresos_publicos VALUES (1401,'2','BloqueoEmision','NO EMITE - LOTEOS',2);
INSERT INTO lista_ingresos_publicos VALUES (1402,'3','BloqueoEmision','NO EMITE - INCOBRABLES',3);
INSERT INTO lista_ingresos_publicos VALUES (1403,'4','BloqueoEmision','LOTEOS INCOBRABLES',4);
INSERT INTO lista_ingresos_publicos VALUES (1404,'5','BloqueoEmision','NO INTIMAR',5);
INSERT INTO lista_ingresos_publicos VALUES (1405,'6','BloqueoEmision','NO EMITE - BLOQUEADO TASAS INMOBILIARIAS',6);
INSERT INTO lista_ingresos_publicos VALUES (1406,'7','BloqueoEmision','BLOQUEO POR DENUNCIA VENTA VEH�CULO',7);
INSERT INTO lista_ingresos_publicos VALUES (1407,'8','BloqueoEmision','BLOQUEO DE TITULAR',8);
INSERT INTO lista_ingresos_publicos VALUES (1408,'9','BloqueoEmision','SEPULTURAS INDIGENTES',9);
INSERT INTO lista_ingresos_publicos VALUES (1409,'10','BloqueoEmision','SEPULTURAS PARA REASIGNAR',10);
INSERT INTO lista_ingresos_publicos VALUES (1410,'11','BloqueoEmision','BEBIDAS ALCOHOLICAS Y CIGARRILLOS',11);
INSERT INTO lista_ingresos_publicos VALUES (1411,'12','BloqueoEmision','NO EMITE - PUBLICIDAD Y PROPAGANDA',12);

INSERT INTO lista_ingresos_publicos VALUES (1430,'1','NivelSocioEconomico','BAJO',1);
INSERT INTO lista_ingresos_publicos VALUES (1431,'2','NivelSocioEconomico','MEDIO-BAJO',2);
INSERT INTO lista_ingresos_publicos VALUES (1432,'3','NivelSocioEconomico','MEDIO',3);
INSERT INTO lista_ingresos_publicos VALUES (1433,'4','NivelSocioEconomico','MEDIO-ALTO',4);
INSERT INTO lista_ingresos_publicos VALUES (1434,'5','NivelSocioEconomico','ALTO',5);
INSERT INTO lista_ingresos_publicos VALUES (1435,'88','NivelSocioEconomico',' ',6);
INSERT INTO lista_ingresos_publicos VALUES (1436,'9999','NivelSocioEconomico','DESCONOCIDO',7);

INSERT INTO lista_ingresos_publicos VALUES (1440,'1','NivelComunicacion','CERCANO(300 A 500M)',1);
INSERT INTO lista_ingresos_publicos VALUES (1441,'2','NivelComunicacion','INMEDIATO(0 A 300M)',2);
INSERT INTO lista_ingresos_publicos VALUES (1442,'3','NivelComunicacion','ALEJADO(500 A 1000MTS)',3);
INSERT INTO lista_ingresos_publicos VALUES (1443,'4','NivelComunicacion','AISLADO(+ DE 1000MTS)',4);
INSERT INTO lista_ingresos_publicos VALUES (1444,'9999','NivelComunicacion','DESCONOCIDO',5);

INSERT INTO lista_ingresos_publicos VALUES (1450,' ','ZonaTarifaria','SIN ZONA TARIFARIA',1);
INSERT INTO lista_ingresos_publicos VALUES (1451,'A','ZonaTarifaria','A',2);
INSERT INTO lista_ingresos_publicos VALUES (1452,'B','ZonaTarifaria','B',3);
INSERT INTO lista_ingresos_publicos VALUES (1453,'C','ZonaTarifaria','C',4);
INSERT INTO lista_ingresos_publicos VALUES (1454,'D','ZonaTarifaria','D',5);
INSERT INTO lista_ingresos_publicos VALUES (1455,'E','ZonaTarifaria','E',6);
INSERT INTO lista_ingresos_publicos VALUES (1456,'F','ZonaTarifaria','HUMILDES',7);
INSERT INTO lista_ingresos_publicos VALUES (1457,'G','ZonaTarifaria','G',8);
INSERT INTO lista_ingresos_publicos VALUES (1458,'H','ZonaTarifaria','H',9);
INSERT INTO lista_ingresos_publicos VALUES (1459,'I','ZonaTarifaria','I',10);
INSERT INTO lista_ingresos_publicos VALUES (1460,'N','ZonaTarifaria','N',11);
INSERT INTO lista_ingresos_publicos VALUES (1461,'O1','ZonaTarifaria','O1',12);
INSERT INTO lista_ingresos_publicos VALUES (1462,'O2','ZonaTarifaria','O2',13);
INSERT INTO lista_ingresos_publicos VALUES (1463,'O3','ZonaTarifaria','O3',14);
INSERT INTO lista_ingresos_publicos VALUES (1464,'P','ZonaTarifaria','RURAL > 2500 M2',15);
INSERT INTO lista_ingresos_publicos VALUES (1465,'Q','ZonaTarifaria','FRACCIONES RURALES',16);
INSERT INTO lista_ingresos_publicos VALUES (1466,'R','ZonaTarifaria','CAMAS NAUTICAS',17);
INSERT INTO lista_ingresos_publicos VALUES (1467,'S','ZonaTarifaria','S',18);
INSERT INTO lista_ingresos_publicos VALUES (1468,'T','ZonaTarifaria','T',19);
INSERT INTO lista_ingresos_publicos VALUES (1469,'U','ZonaTarifaria','U',20);
INSERT INTO lista_ingresos_publicos VALUES (1470,'X','ZonaTarifaria','X',21);
INSERT INTO lista_ingresos_publicos VALUES (1471,'Y','ZonaTarifaria','Y',22);
INSERT INTO lista_ingresos_publicos VALUES (1472,'Z','ZonaTarifaria','Z',23);

INSERT INTO lista_ingresos_publicos VALUES (1580,'P','TipoPropiedad','Propio',1);
INSERT INTO lista_ingresos_publicos VALUES (1581,'T','TipoPropiedad','De tercero',2);

INSERT INTO lista_ingresos_publicos VALUES (1590,'1','TipoProductoPublicitado','General',1);
INSERT INTO lista_ingresos_publicos VALUES (1591,'2','TipoProductoPublicitado','Tabaquer�a',2);
INSERT INTO lista_ingresos_publicos VALUES (1592,'3','TipoProductoPublicitado','Alcohol',3);
INSERT INTO lista_ingresos_publicos VALUES (1593,'4','TipoProductoPublicitado','Apuestas',4);

INSERT INTO lista_ingresos_publicos VALUES (1600,'1','TipoPlantillaDocumento','Plantilla G�nerica',1);

INSERT INTO lista_ingresos_publicos VALUES (1610,'1','LugarPago','DEBITO AUTOMATICO MASTER',1);
INSERT INTO lista_ingresos_publicos VALUES (1611,'2','LugarPago','PAGO FACIL',2);
INSERT INTO lista_ingresos_publicos VALUES (1612,'3','LugarPago','DEBITO BCO.PCIA.',3);
INSERT INTO lista_ingresos_publicos VALUES (1613,'4','LugarPago','DEBITO AUTOMATICO VISA',4);
INSERT INTO lista_ingresos_publicos VALUES (1614,'5','LugarPago','DEBITO AUTOMATICO AMERICAN EXPRESS',5);
INSERT INTO lista_ingresos_publicos VALUES (1615,'6','LugarPago','GIRE',6);
INSERT INTO lista_ingresos_publicos VALUES (1616,'7','LugarPago','DEBITO AUTOMATICO PAGO DIRECTO',7);
INSERT INTO lista_ingresos_publicos VALUES (1617,'8','LugarPago','DEBITO AUTOMATICO DINERS',8);
INSERT INTO lista_ingresos_publicos VALUES (1618,'9','LugarPago','DEBITO AUTOMATICO CABAL',9);
INSERT INTO lista_ingresos_publicos VALUES (1619,'10','LugarPago','BANELCO',10);
INSERT INTO lista_ingresos_publicos VALUES (1620,'11','LugarPago','BCO.PROVINCIA BS.AS.',11);
INSERT INTO lista_ingresos_publicos VALUES (1621,'12','LugarPago','HOSPITAL DE TIGRE',12);
INSERT INTO lista_ingresos_publicos VALUES (1622,'13','LugarPago','BCO. PCIA. SUC. PACHECO',13);
INSERT INTO lista_ingresos_publicos VALUES (1623,'14','LugarPago','BCO. PCIA. SUC. TORCUATO',14);
INSERT INTO lista_ingresos_publicos VALUES (1624,'15','LugarPago','RAPIPAGO',15);
INSERT INTO lista_ingresos_publicos VALUES (1625,'16','LugarPago','BAPRO PAGOS',16);
INSERT INTO lista_ingresos_publicos VALUES (1626,'17','LugarPago','BCO.PCIA. SAM2000',17);
INSERT INTO lista_ingresos_publicos VALUES (1627,'18','LugarPago','LINK',18);
INSERT INTO lista_ingresos_publicos VALUES (1628,'19','LugarPago','SERVICIO PAGOS VISA',19);
INSERT INTO lista_ingresos_publicos VALUES (1629,'21','LugarPago','BCO. RIO',20);
INSERT INTO lista_ingresos_publicos VALUES (1630,'22','LugarPago','BCO. BUEN AYRE',21);
INSERT INTO lista_ingresos_publicos VALUES (1631,'31','LugarPago','TESORERIA MUNICIPAL',22);
INSERT INTO lista_ingresos_publicos VALUES (1632,'32','LugarPago','DELEG. PACHECO',23);
INSERT INTO lista_ingresos_publicos VALUES (1633,'33','LugarPago','DELEG. TORCUATO OESTE',24);
INSERT INTO lista_ingresos_publicos VALUES (1634,'34','LugarPago','DELEG. TALAR',25);
INSERT INTO lista_ingresos_publicos VALUES (1635,'35','LugarPago','DELEG. BENAVIDEZ',26);
INSERT INTO lista_ingresos_publicos VALUES (1636,'36','LugarPago','DELEG. DIQUE LUJAN',27);
INSERT INTO lista_ingresos_publicos VALUES (1637,'37','LugarPago','BCO. CREDICOOP',28);
INSERT INTO lista_ingresos_publicos VALUES (1638,'38','LugarPago','COOPERATIVA PACHECO',29);
INSERT INTO lista_ingresos_publicos VALUES (1639,'39','LugarPago','DELEG. T. DEL TALAR',30);
INSERT INTO lista_ingresos_publicos VALUES (1640,'40','LugarPago','LIBRETAS SANITARIAS',31);
INSERT INTO lista_ingresos_publicos VALUES (1641,'41','LugarPago','DELEG. RICARDO ROJAS',32);
INSERT INTO lista_ingresos_publicos VALUES (1642,'42','LugarPago','MUSEO DE ARTE',33);
INSERT INTO lista_ingresos_publicos VALUES (1643,'43','LugarPago','PUERTO DE FRUTOS',34);
INSERT INTO lista_ingresos_publicos VALUES (1644,'44','LugarPago','DELEG. RINCON DE MILBERG',35);
INSERT INTO lista_ingresos_publicos VALUES (1645,'45','LugarPago','DELEG. TORCUATO ESTE',36);
INSERT INTO lista_ingresos_publicos VALUES (1646,'46','LugarPago','CEMENTERIOS',37);
INSERT INTO lista_ingresos_publicos VALUES (1647,'47','LugarPago','SECRETARIA DE GOBIERNO',38);
INSERT INTO lista_ingresos_publicos VALUES (1648,'48','LugarPago','BANCO GALICIA',39);
INSERT INTO lista_ingresos_publicos VALUES (1649,'49','LugarPago','HOSPITAL ODONTOLOGICO',40);
INSERT INTO lista_ingresos_publicos VALUES (1650,'50','LugarPago','P.T. MASTERCARD',41);
INSERT INTO lista_ingresos_publicos VALUES (1651,'51','LugarPago','P.T. VISA',42);
INSERT INTO lista_ingresos_publicos VALUES (1652,'52','LugarPago','P.T. AMERICAN EXPRESS',43);
INSERT INTO lista_ingresos_publicos VALUES (1653,'53','LugarPago','P.T. DINERS CLUB',44);
INSERT INTO lista_ingresos_publicos VALUES (1654,'54','LugarPago','P.T. CABAL',45);
INSERT INTO lista_ingresos_publicos VALUES (1655,'55','LugarPago','VISA INTERNET',46);
INSERT INTO lista_ingresos_publicos VALUES (1656,'56','LugarPago','AMERICAN INTERNET',47);
INSERT INTO lista_ingresos_publicos VALUES (1657,'57','LugarPago','DINERS INTERNET',48);
INSERT INTO lista_ingresos_publicos VALUES (1658,'58','LugarPago','MASTERCARD INTERNET',49);
INSERT INTO lista_ingresos_publicos VALUES (1659,'59','LugarPago','DEBITO AUTOMATICO HABERES',50);
INSERT INTO lista_ingresos_publicos VALUES (1660,'60','LugarPago','INTERBANKING',51);
INSERT INTO lista_ingresos_publicos VALUES (1661,'61','LugarPago','SUCERP',52);
INSERT INTO lista_ingresos_publicos VALUES (1662,'62','LugarPago','AMARRAS HUGO DEL CARRIL',53);
INSERT INTO lista_ingresos_publicos VALUES (1663,'63','LugarPago','QUIWI',54);
INSERT INTO lista_ingresos_publicos VALUES (1664,'64','LugarPago','HOSPITAL OFTALMOLOGICO',55);
INSERT INTO lista_ingresos_publicos VALUES (1665,'65','LugarPago','VISA INTERNET - SPS DECIDIR',56);
INSERT INTO lista_ingresos_publicos VALUES (1666,'66','LugarPago','CENTRO DIAGNOSTICO POR IMAGENES',57);
INSERT INTO lista_ingresos_publicos VALUES (1667,'67','LugarPago','AMARRAS RODOLFO WALSH',58);
INSERT INTO lista_ingresos_publicos VALUES (1668,'68','LugarPago','CANCELACION DE CHEQUE DIFERIDO',59);
INSERT INTO lista_ingresos_publicos VALUES (1669,'69','LugarPago','TRANSITO',60);
INSERT INTO lista_ingresos_publicos VALUES (1670,'70','LugarPago','MACRO CLICK DE PAGOS',61);
INSERT INTO lista_ingresos_publicos VALUES (1671,'125','LugarPago','MERCADOPAGO',62);

