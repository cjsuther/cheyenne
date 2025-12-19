import RecaudacionLote from '../../../entities/recaudacion-lote';
import { isValidDate, isValidNumber,  } from '../../../../infraestructure/sdk/utils/validator';
import ValidationError from '../../../../infraestructure/sdk/error/validation-error';
import ProcessError from '../../../../infraestructure/sdk/error/process-error';
import Recaudacion from '../../../entities/recaudacion';
import { getDateNow, precisionRound } from '../../../../infraestructure/sdk/utils/convert';
import RecaudacionLoteDto from '../../../dto/recaudacion-lote-dto';
import Recaudadora from '../../../entities/recaudadora';
import { ORIGEN_RECAUDACION } from '../../../../infraestructure/sdk/consts/origenRecaudacion';
import IParser from './i-parser';

export default class parserMonotasa implements IParser {

	constructor() {

	}

	async execute(idUsuario:number, nombre:string, content:string, municipioCodigo:string, recaudadora:Recaudadora) {
		return new Promise( async (resolve, reject) => {
			try {
				const parseDateMonotasaNombreArchivo = (value) => value.substring(0,4) + "-" + value.substring(4,6) + "-" + value.substring(6,8) + "T00:00:00"
				const parseDateMonotasaDetalle = (value) => value.substring(4,8) + "-" + value.substring(2,4) + "-" + value.substring(0,2) + "T00:00:00"

				//#region Validacion del nombre del archivo
				const nombreFields = nombre.split('.');
				if (nombreFields.length < 2 || nombreFields[1].length !== 8) { reject(new ValidationError('Nombre de archivo incorrecto')); return; }
				
				const fechaArchivo = nombreFields[1];
				const fechaLote = parseDateMonotasaNombreArchivo(fechaArchivo);
				if (!isValidDate(fechaLote)) { reject(new ValidationError('Fecha de archivo incorrecta')); return; }
				//#endregion
				
				//#region Validacion de la consistencia del archivo
                const rows = content.split('\n');
				if (rows.length === 0) { reject(new ValidationError('Archivo incorreto: incompleto')); return; }
				//#endregion

				//#region Validacion de detalle
				let fechaAcreditacion = null;
				let importeAbonadoTotal = 0;
				const rowRecaudaciones = rows.slice();
				const recaudaciones:Recaudacion[] = [];
				for (let i=0; i<rowRecaudaciones.length; i++) {
					const rowRecaudacion = rowRecaudaciones[i];
					if (rowRecaudacion.length < 163) { reject(new ValidationError(`Registro ${i+1}: longitud incorrecta`)); return; }
					
					//2 dígitos - Codigo interno banco
					const fechaCobro = parseDateMonotasaDetalle(rowRecaudacion.substring(2,10)); //8 dígitos - Fecha de vencimiento (DDMMAAAA)
					if (!isValidDate(fechaCobro,true)) { reject(new ValidationError(`Registro ${i+1}: Fecha de cobro incorrecta`)); return; }
					//6 dígitos - Codigo empresa banco - Valor fijo seis ceros
					const identificacodCuenta = rowRecaudacion.substring(16,26).trim(); //10 dígitos - Identificador de cuenta (con ceros a la izquierda)
					//12 dígitos - Valor fijo espacios en blanco
					//1 digito  - Tipo de moneda - Valor fijo 'P'
					//8 dígitos - CBU bloque 1
					//14 dígitos - CBU bloque 2
					const importe = `${rowRecaudacion.substring(61,69)}.${rowRecaudacion.substring(69,71)}`; //10 dígitos - Importe
					if (!isValidNumber(importe,true)) { reject(new ValidationError(`Registro ${i+1}: Importe abonado incorrecto`)); return; }
					const importeAbonado =	precisionRound(importe);
					importeAbonadoTotal += importeAbonado;
					//11 dígitos - Cuit Municipalidad
					//10 dígitos - Descripción de presentación
					const identificadorFacturaParcial = rowRecaudacion.substring(92,107).trim(); //15 dígitos - Valor de referencia de Laramie (con ceros a la izquierda)
					const identificadorFactura = `${municipioCodigo.padStart(5,'0')}${identificadorFacturaParcial.substring(2)}`;
					//15 dígitos - Valor fijo espacios en blanco.
					//22 dígitos - Nuevo id cliente.
					const codigoRechazo =  rowRecaudacion.substring(144,147).trim(); //3 dígitos - Codigo de rechazo en caso de ser necesario
					const nombreEmpresa = rowRecaudacion.substring(147,163).trim(); //16 digitos - Nombre de empresa
					//if (nombreEmpresa !== 'MUNI DE CAMPANA') { reject(new ValidationError(`Registro ${i+1}: Nombre empresa incorrecto`)); return; }

					if (codigoRechazo.length === 0) {
						const recaudacion = new Recaudacion();
						recaudacion.idRecaudadora = recaudadora.id;
						recaudacion.numeroControl = "";
						recaudacion.numeroComprobante = "";
						recaudacion.numeroCuenta = identificacodCuenta;
						recaudacion.codigoDelegacion = "";
						recaudacion.numeroRecibo = 0;
						recaudacion.importeCobro = importeAbonado;
						recaudacion.fechaCobro = new Date(fechaCobro);
						recaudacion.codigoBarras = identificadorFactura;
						recaudaciones.push(recaudacion);
					}
				}
				importeAbonadoTotal = precisionRound(importeAbonadoTotal,2);
				//#endregion
		
				const recaudacionLote = new RecaudacionLote();
				recaudacionLote.fechaLote = new Date(fechaLote);
				recaudacionLote.casos = recaudaciones.length;
				recaudacionLote.idUsuarioProceso = idUsuario;
				recaudacionLote.fechaProceso = getDateNow(true);
				recaudacionLote.idOrigenRecaudacion = ORIGEN_RECAUDACION.ENTIDAD_RECAUDADORA;
				recaudacionLote.idRecaudadora = recaudadora.id;
				recaudacionLote.fechaAcreditacion = fechaAcreditacion;
				recaudacionLote.importeTotal = importeAbonadoTotal;

				const data = new RecaudacionLoteDto();
				data.recaudacionLote = recaudacionLote;
				data.recaudaciones = recaudaciones;
				data.nombre = nombre;

				resolve(data);
			}
			catch(error) {
				if (error instanceof ValidationError) {
					reject(error);
				}
				else {
					reject(new ProcessError('Error importando datos', error));
				}
			}
		});
	}


}
