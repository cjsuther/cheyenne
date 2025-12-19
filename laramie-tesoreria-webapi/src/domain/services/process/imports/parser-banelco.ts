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

export default class parserBanelco implements IParser {

	constructor() {

	}

	async execute(idUsuario:number, nombre:string, content:string, municipioCodigo:string, recaudadora:Recaudadora) {
		return new Promise( async (resolve, reject) => {
			try {
				const parseDateFromBanelco = (value) => value.substring(0,4) + "-" + value.substring(4,6) + "-" + value.substring(6,8) + "T00:00:00"

				//#region Validacion del nombre del archivo
				const nombreFields = nombre.split('.');
				if (nombreFields[0].length !== 7 || nombreFields[1].length !== 6) { reject(new ValidationError('Nombre de archivo incorrecto')); return; }
				
				const fechaArchivo = "20" + nombreFields[1].substring(4,6) + nombreFields[1].substring(2,4) + nombreFields[1].substring(0,2);
				const fechaLote = parseDateFromBanelco(fechaArchivo);
				if (!isValidDate(fechaLote)) { reject(new ValidationError('Fecha de archivo incorrecta')); return; }

				const codigoCliente = nombreFields[0].substring(3,7);
				if (codigoCliente !== recaudadora.codigoCliente) { reject(new ValidationError('Código de cliente incorrecto')); return; }
				//#endregion
				
				//#region Validacion de la consistencia del archivo
                const rows = content.split('\n');
				if (rows.length < 3) { reject(new ValidationError('Archivo incorreto: incompleto')); return; }
				//#endregion

				//#region Validacion de header
				const rowHeader = rows[0].trim();
				if (rowHeader.length !== 100) { reject(new ValidationError('Header: longitud incorrecta')); return; }
				if (rowHeader.substring(0,1) !== "0") { reject(new ValidationError('Header: Código de registro debe ser 0')); return; }
				if (rowHeader.substring(1,4) !== "400") { reject(new ValidationError('Header: Identificador Banelco debe ser 400')); return; }
				if (rowHeader.substring(4,8) !== codigoCliente) { reject(new ValidationError('Header: Código de Empresa no coincide')); return; }
				if (rowHeader.substring(8,16) !== fechaArchivo) { reject(new ValidationError('Header: Fecha de Archivo no coincide')); return; }
				//#endregion

				//#region Validacion de detalle
				let fechaAcreditacion = null;
				let importeAbonadoTotal = 0;
				const rowRecaudaciones = rows.slice(1,-1);
				const recaudaciones:Recaudacion[] = [];
				for (let i=0; i<rowRecaudaciones.length; i++) {
					const rowRecaudacion = rowRecaudaciones[i].trim();
					if (rowRecaudacion.length !== 100) { reject(new ValidationError(`Registro ${i+1}: longitud incorrecta`)); return; }
					if (rowRecaudacion.substring(0,1) !== "5") { reject(new ValidationError(`Registro ${i+1}: Código de registro debe ser 5`)); return; }
					const nroReferencia = rowRecaudacion.substring(1,20).trim();
					const idFactura = rowRecaudacion.substring(20,40).trim();
					const fechaVencimiento = parseDateFromBanelco(rowRecaudacion.substring(40,48));
					if (!isValidDate(fechaVencimiento,true)) { reject(new ValidationError(`Registro ${i+1}: Fecha de vencimiento incorrecta`)); return; }
					// const codigoMoneda = rowRecaudacion.substring(48,49);
					const fechaAplicacion = parseDateFromBanelco(rowRecaudacion.substring(49,57));
					if (!isValidDate(fechaAplicacion,true)) { reject(new ValidationError(`Registro ${i+1}: Fecha de aplicación incorrecta`)); return; }
					if (!isValidNumber(rowRecaudacion.substring(57,68),true)) { reject(new ValidationError(`Registro ${i+1}: Importe abonado incorrecto`)); return; }
					const importeAbonado = precisionRound((parseInt(rowRecaudacion.substring(57,68))/100),2);
					importeAbonadoTotal += importeAbonado;
					// const codigoMovimiento = rowRecaudacion.substring(68,69);
					if (rowRecaudacion.substring(69,77) !== fechaArchivo) { reject(new ValidationError(`Registro ${i+1}: Fecha de acreditación no coincide`)); return; }
					fechaAcreditacion = parseDateFromBanelco(rowRecaudacion.substring(69,77));
					if (!isValidDate(fechaAcreditacion,true)) { reject(new ValidationError(`Registro ${i+1}: Fecha de acreditación incorrecta`)); return; }
					// const canalPago = rowRecaudacion.substring(77,79);
					const nroControl = rowRecaudacion.substring(79,83);
					// const codigoProvincia = rowRecaudacion.substring(83,86);

					const recaudacion = new Recaudacion();
					recaudacion.idRecaudadora = recaudadora.id;
					recaudacion.numeroControl = nroControl;
					recaudacion.numeroComprobante = "";
					recaudacion.numeroCuenta = nroReferencia;
					recaudacion.codigoDelegacion = "";
					recaudacion.numeroRecibo = 0;
					recaudacion.importeCobro = importeAbonado;
					recaudacion.fechaCobro = new Date(fechaAplicacion);
					recaudacion.codigoBarras = idFactura;
					recaudaciones.push(recaudacion);
				}
				importeAbonadoTotal = precisionRound(importeAbonadoTotal,2);
				//#endregion

				//#region Validacion de trailer
				const rowTrailer = rows[rows.length-1].trim();
				if (rowTrailer.length !== 100) { reject(new ValidationError('Trailer: longitud incorrecta')); return; }
				if (rowTrailer.substring(0,1) !== "9") { reject(new ValidationError('Trailer: Código de registro debe ser 9')); return; }
				if (rowTrailer.substring(1,4) !== "400") { reject(new ValidationError('Trailer: Identificador Banelco debe ser 400')); return; }
				if (rowTrailer.substring(4,8) !== codigoCliente) { reject(new ValidationError('Trailer: Código de Empresa no coincide')); return; }
				if (rowTrailer.substring(8,16) !== fechaArchivo) { reject(new ValidationError('Trailer: Fecha de Archivo no coincide')); return; }
				if (!isValidNumber(rowTrailer.substring(16,23),true)) { reject(new ValidationError('Trailer: Cantidad de registros en pesos incorrecta')); return; }
				const cantidadRegistros = parseInt(rowTrailer.substring(16,23));
				if (cantidadRegistros !== rowRecaudaciones.length) { reject(new ValidationError('Trailer: Cantidad de registros en pesos no coincide')); return; }
				if (!isValidNumber(rowTrailer.substring(30,41),true)) { reject(new ValidationError('Trailer: Importe total de las cobranzas en pesos incorrecta')); return; }
				const importeTotal = precisionRound((parseInt(rowTrailer.substring(30,41))/100),2);
				if (importeTotal !== importeAbonadoTotal) { reject(new ValidationError('Trailer: Importe total de las cobranzas en pesos no coincide')); return; }
				//#endregion
				
				const recaudacionLote = new RecaudacionLote();
				recaudacionLote.fechaLote = new Date(fechaLote);
				recaudacionLote.casos = recaudaciones.length;
				recaudacionLote.idUsuarioProceso = idUsuario;
				recaudacionLote.fechaProceso = getDateNow(true);
				recaudacionLote.idOrigenRecaudacion = ORIGEN_RECAUDACION.ENTIDAD_RECAUDADORA;
				recaudacionLote.idRecaudadora = recaudadora.id;
				recaudacionLote.fechaAcreditacion = new Date(fechaAcreditacion);
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
