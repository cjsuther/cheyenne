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

export default class parserBapro implements IParser {

	constructor() {

	}

	async execute(idUsuario:number, nombre:string, content:string, municipioCodigo:string, recaudadora:Recaudadora) {
		return new Promise( async (resolve, reject) => {
			try {
				const parseDateFromBAPRO = (value) => value.substring(0,4) + "-" + value.substring(4,6) + "-" + value.substring(6,8) + "T00:00:00"
				const nombreArchivo = 'MUNCAMPANA';
				//#region Validacion del nombre del archivo
				// se reemplaza MunCampana por vacio
				const nombreFields = nombre.toUpperCase().replace(nombreArchivo, '').split('.');
				if (nombreFields.length < 2 || nombreFields[0].length !== 8 ) { reject(new ValidationError('Nombre de archivo incorrecto')); return; }
				
				const fechaArchivo = nombreFields[0].substring(4,8) + nombreFields[0].substring(2,4) + nombreFields[0].substring(0,2);
				const fechaLote = parseDateFromBAPRO(fechaArchivo);
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
					if (rowRecaudacion.length !== 279) { reject(new ValidationError(`Registro ${i+1}: longitud incorrecta`)); return; }

					// importe
					if (!isValidNumber(rowRecaudacion.substring(77,88),true)) { reject(new ValidationError(`Registro ${i+1}: Importe abonado incorrecto`)); return; }
					const importeAbonado = precisionRound((parseInt(rowRecaudacion.substring(77,88))/100),2);
					importeAbonadoTotal += importeAbonado;

					// codigo de barras
					const codigoBarras = rowRecaudacion.substring(168,186).trim();
					
					// fecha de pago
					const fechaCobro = parseDateFromBAPRO('20' + rowRecaudacion.substring(224,226)+rowRecaudacion.substring(226,228)+rowRecaudacion.substring(228,230));
					if (!isValidDate(fechaCobro,true)) { reject(new ValidationError(`Registro ${i+1}: Fecha de cobro incorrecta`)); return; }
					
					const codigoMovimiento = rowRecaudacion.substring(8,58).trim();
					
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
