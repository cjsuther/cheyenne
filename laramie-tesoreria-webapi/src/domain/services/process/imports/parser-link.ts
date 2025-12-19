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

export default class parserLink implements IParser {

	constructor() {

	}

	async execute(idUsuario:number, nombre:string, content:string, municipioCodigo:string, recaudadora:Recaudadora) {
		return new Promise( async (resolve, reject) => {
			try {
				const parseDateFromLink = (value) => value.substring(0,4) + "-" + value.substring(4,6) + "-" + value.substring(6,8) + "T00:00:00"

				//#region Validacion del nombre del archivo
				const nombreFields = nombre;
				if (nombreFields.length !== 8 && nombreFields.substring(0,2) === 'li') { reject(new ValidationError('Nombre de archivo incorrecto')); return; }
				
				const fechaArchivo = "20" + nombreFields.substring(6,8) + nombreFields.substring(4,6) + nombreFields.substring(2,4);
				const fechaLote = parseDateFromLink(fechaArchivo);
				if (!isValidDate(fechaLote)) { reject(new ValidationError('Fecha de archivo incorrecta')); return; }

				//#endregion
				
				//#region Validacion de la consistencia del archivo
                const rows = content.split('\n');
				if (rows.length < 3) { reject(new ValidationError('Archivo incorreto: incompleto')); return; }
				//#endregion

				//#region Validacion de header
				const rowHeader = rows[0].trim();
				if (rowHeader.length !== 98) { reject(new ValidationError('Header: longitud incorrecta')); return; }
				if (rowHeader.substring(0,1) !== "0") { reject(new ValidationError('Header: Código de registro debe ser 0')); return; }
				if (rowHeader.substring(1,4) !== recaudadora.codigoCliente) { reject(new ValidationError('Header: Código de ente incorrecto')); return; }
				const fechaProceso = parseDateFromLink(rowHeader.substring(4,12));
				if (!isValidDate(fechaProceso,true)) { reject(new ValidationError(`Header: Fecha de proceso incorrecta`)); return; }
				//#endregion

				//#region Validacion de detalle
				let fechaAcreditacion = null;
				let importeAbonadoTotal = 0;
				const rowRecaudaciones = rows.slice(1,-1);
				const recaudaciones:Recaudacion[] = [];
				for (let i=0; i<rowRecaudaciones.length; i++) {
					const rowRecaudacion = rowRecaudaciones[i];
					if (rowRecaudacion.length !== 98) { reject(new ValidationError(`Registro ${i+1}: longitud incorrecta`)); return; }
					if (rowRecaudacion.substring(0,1) !== "1") { reject(new ValidationError(`Registro ${i+1}: Código de registro debe ser 1`)); return; }
					
					if (rowRecaudacion.substring(1,2) !== "0") { reject(new ValidationError(`Registro ${i+1}: Código de registro debe ser 0`)); return; }
					
					const mesDeuda = parseInt(rowRecaudacion.substring(2,4));
					const fechaDeuda = rowRecaudacion.substring(2,6);

					if (mesDeuda < 1 || mesDeuda > 12) { reject(new ValidationError(`Registro ${i+1}: Mes de deuda incorrecto`)); return; }

					if (rowRecaudacion.substring(6,9) !== "001") { reject(new ValidationError(`Registro ${i+1}: Valor fijo de registro debe ser 001`)); return; }

					const nroReferencia = rowRecaudacion.substring(9,28).trim();
					
					if (!isValidNumber(rowRecaudacion.substring(28,40),true)) { reject(new ValidationError(`Registro ${i+1}: Importe abonado incorrecto`)); return; }
					const importeAbonado = precisionRound((parseInt(rowRecaudacion.substring(28,40))/100),2);
					importeAbonadoTotal += importeAbonado;

					const fechaPago = parseDateFromLink(rowRecaudacion.substring(40,48));
					if (!isValidDate(fechaPago,true)) { reject(new ValidationError(`Registro ${i+1}: Fecha de pago incorrecta`)); return; }
							
					const codigoBarra = parseInt(rowRecaudacion.substring(48,98)).toString().trim();

					const recaudacion = new Recaudacion();
					recaudacion.idRecaudadora = recaudadora.id;
					recaudacion.numeroControl = "";
					recaudacion.numeroComprobante = "";
					recaudacion.numeroCuenta = nroReferencia;
					recaudacion.codigoDelegacion = "";
					recaudacion.numeroRecibo = 0;
					recaudacion.importeCobro = importeAbonado;
					recaudacion.fechaCobro = new Date(fechaPago);
					recaudacion.codigoBarras = codigoBarra;
					recaudaciones.push(recaudacion);
				}
				importeAbonadoTotal = precisionRound(importeAbonadoTotal,2);
				//#endregion

				//#region Validacion de trailer
				const rowTrailer = rows[rows.length-1].trim();
				if (rowTrailer.length !== 98) { reject(new ValidationError('Trailer: longitud incorrecta')); return; }
				if (rowTrailer.substring(0,1) !== "2") { reject(new ValidationError('Trailer: Código de registro debe ser 2')); return; }
				const cantidadRegistros = parseInt(rowTrailer.substring(1,7));
				if (cantidadRegistros !== rowRecaudaciones.length + 2) { reject(new ValidationError('Trailer: Cantidad de registros no coincide')); return; }
				if (!isValidNumber(rowTrailer.substring(8,23),true)) { reject(new ValidationError('Trailer: Importe total de las cobranzas en pesos incorrecta')); return; }
				const importeTotal = precisionRound((parseInt(rowTrailer.substring(8,23))/100),2);
				if (importeTotal !== importeAbonadoTotal) { reject(new ValidationError('Trailer: Importe total de las cobranzas en pesos no coincide')); return; }
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
