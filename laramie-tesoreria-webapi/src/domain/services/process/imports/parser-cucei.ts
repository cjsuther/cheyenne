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

export default class parserCucei implements IParser {

	constructor() {

	}

	async execute(idUsuario:number, nombre:string, content:string, municipioCodigo:string, recaudadora:Recaudadora) {
		return new Promise( async (resolve, reject) => {
			try {
				const parseDateFromCUCEI = (value) => value.substring(0,4) + "-" + value.substring(4,6) + "-" + value.substring(6,8) + "T00:00:00"

				//#region Validacion del nombre del archivo
				const nombreFields = nombre.split('.');
				if (nombreFields.length < 2 || nombreFields[0].length !== 8 || nombreFields[1] !== 'MUN') { reject(new ValidationError('Nombre de archivo incorrecto')); return; }
				
				const fechaArchivo = nombreFields[0].substring(0,4) + nombreFields[0].substring(4,6) + nombreFields[0].substring(6,8);
				const fechaLote = parseDateFromCUCEI(fechaArchivo);
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
					const rowRecaudacion = rowRecaudaciones[i].trim();
					if (rowRecaudacion.length !== 47) { reject(new ValidationError(`Registro ${i+1}: longitud incorrecta`)); return; }
					
					const codigoBarras = rowRecaudacion.substring(0,18).trim();
					const fechaCobro = parseDateFromCUCEI(rowRecaudacion.substring(22,26)+rowRecaudacion.substring(20,22)+rowRecaudacion.substring(18,20));
					if (!isValidDate(fechaCobro,true)) { reject(new ValidationError(`Registro ${i+1}: Fecha de cobro incorrecta`)); return; }
					
					const codigoMovimiento = rowRecaudacion.substring(26,32).trim();
					if (!isValidNumber(rowRecaudacion.substring(32,43),true)) { reject(new ValidationError(`Registro ${i+1}: Importe abonado incorrecto`)); return; }
					const importeAbonado =	precisionRound(rowRecaudacion.substring(32,43));
					importeAbonadoTotal += importeAbonado;

					if (rowRecaudacion.substring(43,47) !== "CUCE") { reject(new ValidationError(`Registro ${i+1}: Código de registro debe ser CUCE`)); return; }
					
					const recaudacion = new Recaudacion();
					recaudacion.idRecaudadora = recaudadora.id;
					recaudacion.numeroControl = codigoMovimiento;
					recaudacion.numeroComprobante = "";
					recaudacion.numeroCuenta = "";
					recaudacion.codigoDelegacion = "";
					recaudacion.numeroRecibo = 0;
					recaudacion.importeCobro = importeAbonado;
					recaudacion.fechaCobro = new Date(fechaCobro);
					recaudacion.codigoBarras = codigoBarras;
					recaudaciones.push(recaudacion);
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
