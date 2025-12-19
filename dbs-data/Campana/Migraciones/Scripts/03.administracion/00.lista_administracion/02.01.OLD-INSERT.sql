--Listas Fijas: 'EstadoFirma','MarcaTarjeta','RubroAfip','TipoExpediente','TipoFirma','TipoGeoreferencia','TipoMedioPago','TipoPersona','TipoTarjeta'
USE LARAMIE_CAMPANA
GO

TRUNCATE TABLE lista_administracion
GO

INSERT INTO lista_administracion VALUES(650,'1','EstadoFirma','Pendiente',1);
INSERT INTO lista_administracion VALUES(651,'2','EstadoFirma','Firmado',2);
INSERT INTO lista_administracion VALUES(652,'3','EstadoFirma','Rechazado',3);
INSERT INTO lista_administracion VALUES(630,'1','MarcaTarjeta','Visa',1);
INSERT INTO lista_administracion VALUES(631,'2','MarcaTarjeta','MasterCard',2);
INSERT INTO lista_administracion VALUES(632,'3','MarcaTarjeta','American Express',3);
--INSERT INTO lista_administracion VALUES(520,'1','TipoContacto','TELÉFONO',1);
--INSERT INTO lista_administracion VALUES(521,'10','TipoContacto','CELULAR',2);
--INSERT INTO lista_administracion VALUES(522,'9','TipoContacto','E-Mail',3);
--INSERT INTO lista_administracion VALUES(523,'2','TipoContacto','FAX',4);
--INSERT INTO lista_administracion VALUES(524,'3','TipoContacto','TELEX',5);
--INSERT INTO lista_administracion VALUES(525,'4','TipoContacto','SITIO WEB',6);
--INSERT INTO lista_administracion VALUES(526,'5','TipoContacto','BOLETA ELECTRONICA',7);
--INSERT INTO lista_administracion VALUES(527,'11','TipoContacto','E-MAIL INSTITUCIONAL',8);
--INSERT INTO lista_administracion VALUES(528,'12','TipoContacto','E-MAIL E-LEGAJO',9);
--INSERT INTO lista_administracion VALUES(529,'13','TipoContacto','E-MAIL PORTAL',10);
INSERT INTO lista_administracion VALUES(2000,'1','TipoExpediente','Externo',1);
INSERT INTO lista_administracion VALUES(2001,'2','TipoExpediente','Interno',2);
INSERT INTO lista_administracion VALUES(2002,'3','TipoExpediente','Con característica',3);
INSERT INTO lista_administracion VALUES(2003,'4','TipoExpediente','Expediente civil',4);
INSERT INTO lista_administracion VALUES(2004,'5','TipoExpediente','Alcance',5);
INSERT INTO lista_administracion VALUES(2005,'6','TipoExpediente','Expediente D.O.P',6);
INSERT INTO lista_administracion VALUES(2006,'7','TipoExpediente','Carpeta de obra',7);
INSERT INTO lista_administracion VALUES(660,'1','TipoFirma','Título Ejecutivo',1);
INSERT INTO lista_administracion VALUES(661,'2','TipoFirma','Certificado Libre Deuda Automotor',2);
INSERT INTO lista_administracion VALUES(662,'3','TipoFirma','Certificado Baja Automotor',3);
INSERT INTO lista_administracion VALUES(663,'4','TipoFirma','Certificado de Deuda Inmueble',4);
INSERT INTO lista_administracion VALUES(664,'5','TipoFirma','Certificado Catastral',5);
INSERT INTO lista_administracion VALUES(530,'1','TipoGeoreferencia','Open Street Map',1);
INSERT INTO lista_administracion VALUES(531,'2','TipoGeoreferencia','Google Street View',2);
INSERT INTO lista_administracion VALUES(533,'4','TipoGeoreferencia','Carga por Zona',3);
INSERT INTO lista_administracion VALUES(534,'5','TipoGeoreferencia','Carga Manual',4);
INSERT INTO lista_administracion VALUES(532,'3','TipoGeoreferencia','API Local',5);
INSERT INTO lista_administracion VALUES(535,'6','TipoGeoreferencia','Carga directa',6);
INSERT INTO lista_administracion VALUES(610,'1','TipoMedioPago','Tarjeta Crédito/Débito',1);
INSERT INTO lista_administracion VALUES(611,'2','TipoMedioPago','CBU/CVU',2);
INSERT INTO lista_administracion VALUES(500,'1','TipoPersona','Física',1);
INSERT INTO lista_administracion VALUES(501,'2','TipoPersona','Jurídica',2);
INSERT INTO lista_administracion VALUES(620,'1','TipoTarjeta','Tarjeta Crédito',1);
INSERT INTO lista_administracion VALUES(621,'2','TipoTarjeta','Tarjeta Débito',2);
GO