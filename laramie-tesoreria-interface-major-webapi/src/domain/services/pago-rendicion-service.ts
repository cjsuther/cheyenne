import fs from 'fs/promises';
import PublishService from './publish-service';
import MicroserviceError from '../../infraestructure/sdk/error/microservice-error';
import PagoRendicionLote from '../entities/pago-rendicion-lote';
import PagoRendicionLoteService from './pago-rendicion-lote-service';
import { castPublicError, getDateFromId, getDateFromMajor, getDateFromMajorAnsiSql, getDateId, getDateNow, precisionRound, trimZero } from '../../infraestructure/sdk/utils/convert';
import config from '../../server/configuration/config';
import PagoRendicion from '../entities/pago-rendicion';
import ReciboApertura from '../entities/recibo-apertura';
import { isValidDate, isValidInteger, isValidNumber, isValidString } from '../../infraestructure/sdk/utils/validator';
import ValidationError from '../../infraestructure/sdk/error/validation-error';
import { getUsers } from '../../server/authorization/profile';

export default class PagoRendicionService {

	publishService: PublishService;
	pagoRendicionLoteService: PagoRendicionLoteService;

	constructor(publishService: PublishService, pagoRendicionLoteService: PagoRendicionLoteService)
	{
		this.publishService = publishService;
		this.pagoRendicionLoteService = pagoRendicionLoteService;
	}

	async modifyImport(token: string, idUsuario: number) {
		return new Promise( async (resolve, reject) => {
			try {
				const directoryPath = `${config.PATH.PAGO_RENDICION}pendientes${config.PATH.PATH_SEPARATOR}`;
				const files = await fs.readdir(directoryPath);

				for (let i=0; i < files.length; i++) {
					const fileName = files[i];
					await this.createPagoRendicion(token, idUsuario, fileName);
				}

				resolve({result: true});
			}
			catch(error) {
				if (error instanceof MicroserviceError) {
					reject(error);
				}

				const origen = "laramie-tesoreria-interface-major-webapi/pago-rendicion-service/modifyImport";
				const data = {
					token: token,
					idTipoAlerta: 32, //Cuenta Corriente
					idUsuario: idUsuario,
					fecha: getDateNow(true),
					idModulo: 30,
					origen: origen,
					mensaje: "Error Rendición Pago - Importación de Lote",
					data: {
						error: castPublicError(error)
					}
				};
				try {
					await this.publishService.sendMessage(origen, "AddAlerta", "0", data);
				}
				catch (error) {
					reject(new MicroserviceError('Error enviando AddAlerta', error, "AddAlerta", data));
					return;
				}

				resolve({result: false, error: castPublicError(error)});
			}
		});
	}

	async modifySend(token: string, idUsuario: number) {
		return new Promise( async (resolve, reject) => {
			try {
				const lotes = await this.pagoRendicionLoteService.listPendienteEnvio() as PagoRendicionLote[];
				lotes.sort((a,b) => a.fechaRendicion.getTime() - b.fechaRendicion.getTime());

				for (let i=0; i < lotes.length; i++) {
					const reciboPublicacionLote = lotes[i];
					await this.sendPagoRendicion(token, idUsuario, reciboPublicacionLote);
				}

				resolve({result: true});
			}
			catch(error) {
				if (error instanceof MicroserviceError) {
					reject(error);
				}

				const origen = "laramie-tesoreria-interface-major-webapi/recibo-publicacion-service/modifySend";
				const data = {
					token: token,
					idTipoAlerta: 32, //Cuenta Corriente
					idUsuario: idUsuario,
					fecha: getDateNow(true),
					idModulo: 30,
					origen: origen,
					mensaje: "Error Rendición Pago - Envío de Lote",
					data: {
						error: castPublicError(error)
					}
				};
				try {
					await this.publishService.sendMessage(origen, "AddAlerta", "0", data);
				}
				catch (error) {
					reject(new MicroserviceError('Error enviando AddAlerta', error, "AddAlerta", data));
					return;
				}

				resolve({result: false, error: castPublicError(error)});
			}
		});
	}

	private async createPagoRendicion(token: string, idUsuario: number, fileName:string) {
		return new Promise( async (resolve, reject) => {
			try {
				const today = getDateNow(true);
				const delim = config.CHAR_DELIMITER;

				const filePath = `${config.PATH.PAGO_RENDICION}pendientes${config.PATH.PATH_SEPARATOR}${fileName}`;
				const data = await fs.readFile(filePath);
				const rows = data.toString().trim().split('\n');

				const headRow = rows[0].trim().split(delim);
				if (headRow.length < 3 ||
					!isValidDate(headRow[0],true) ||
					!isValidNumber(headRow[1],false) ||
					!isValidNumber(headRow[2],true) ||
					parseInt(headRow[2]) !== (rows.length-1)
				) {
					throw new ValidationError("Cabecera incorrecta");
				}
				const fechaIngresoId = getDateId(getDateFromMajorAnsiSql(headRow[0]));
				const complementaria = headRow[1];

				const pagoRendicionLote = new PagoRendicionLote();
				pagoRendicionLote.numeroLoteRendicion = `${fechaIngresoId}-${complementaria}`;
				pagoRendicionLote.fechaRendicion = today;
				pagoRendicionLote.observacionEnvio = `Nombre del Archivo de Lote de Pagos: ${fileName}`;

				let importePago = 0;
				let firstRow = rows[1].trim().split(delim);
				let lastKey = `${firstRow[0]}|${firstRow[1]}|${firstRow[11]}|${firstRow[12]}`; //canc_FechaIngreso - canc_Complementaria - canc_CodigoDelegacion - canc_Numero
				let aperturas: ReciboApertura[] = [];
				for (let i=1; i < rows.length; i++) {
					if (!isValidString(rows[i],true)) continue;
					
					const row = rows[i].trim().split(delim);
					let currentKey = `${row[0]}|${row[1]}|${row[11]}|${row[12]}`; //canc_FechaIngreso - canc_Complementaria - canc_CodigoDelegacion - canc_Numero

					const apertura = new ReciboApertura();
					apertura.codigoRubro = trimZero(row[5]); //rubl_Codigo
					apertura.codigoTasa = trimZero(row[6]); //ttas_Tasa
					apertura.codigoSubTasa = trimZero(row[7]); //ttas_SubTasa
					apertura.codigoTipoMovimiento = this.getTipoMovimientoCodigo(trimZero(row[10])); //tcuo_Codigo
					apertura.periodo = trimZero(row[8]); //canc_Periodo
					apertura.cuota = parseInt(row[9]); //canc_Cuota
					apertura.importeCancelar = precisionRound(parseFloat(row[20])); //canc_aCancelar
					apertura.importeImputacionContable = 0;
					apertura.ejercicio = ""; //N/A
					apertura.periodoImputacion = ""; //N/A
					apertura.item = 0; //N/A (canc_Item)
					apertura.codigoEdesurCliente = ""; //N/A
					apertura.numeroCertificadoApremio = ""; //N/A
					apertura.vencimiento = 0;
					apertura.fechaVencimiento = getDateFromMajorAnsiSql(row[15]); //canc_Vencimiento
					apertura.numeroEmision = ""; //N/A
					apertura.tipoNovedad = row[2].trim(); //canc_Tipo
					aperturas.push(apertura);
					
					if (this.acreditaPago(apertura.codigoTipoMovimiento)) {
						importePago += apertura.importeCancelar;
					}

					if (lastKey !== currentKey || i === rows.length - 1) {
						const pagoRendicion = new PagoRendicion();
						pagoRendicion.idCuentaPago = 0;
						pagoRendicion.codigoDelegacion = trimZero(row[11]); //canc_CodigoDelegacion
						pagoRendicion.numeroRecibo = parseInt(row[12]); //canc_Numero
						pagoRendicion.codigoLugarPago = trimZero(row[14]); //luga_Codigo
						pagoRendicion.importePago = importePago;
						pagoRendicion.fechaPago = getDateFromMajorAnsiSql(row[16]); //canc_FechaOrigen
						pagoRendicion.fechaProceso = getDateFromMajorAnsiSql(row[0]); //canc_FechaIngreso
						pagoRendicion.idUsuarioProceso = this.getUsuarioProcesoId(row[21].trim()); //user_Id
						pagoRendicion.codigoBarras = ""; //N/A
						pagoRendicion.recibosApertura = aperturas;
						pagoRendicionLote.pagosRendicion.push(pagoRendicion);

						aperturas = [];
						importePago = 0;
					}

					lastKey = currentKey;
				}
				
				const lote = await this.pagoRendicionLoteService.findByLote(pagoRendicionLote.numeroLoteRendicion);
				if (lote) {
					const origen = "laramie-tesoreria-interface-major-webapi/pago-rendicion/createPagoRendicion";
					const data = {
						token: token,
						idTipoAlerta: 32, //Cuenta Corriente
						idUsuario: idUsuario,
						fecha: getDateNow(true),
						idModulo: 30,
						origen: origen,
						mensaje: "Error Rendición Pago - Ingreso de Lote - Lote Existente",
						data: {
							fileName: fileName,
						}
					};
					try {
						await this.publishService.sendMessage(origen, "AddAlerta", "0", data);
					}
					catch (error) {
						reject(new MicroserviceError('Error enviando AddAlerta', error, "AddAlerta", data));
						return;
					}
				}

				await this.pagoRendicionLoteService.add(pagoRendicionLote);

				const newFilePath = `${config.PATH.PAGO_RENDICION}procesados${config.PATH.PATH_SEPARATOR}${fileName}`;
				fs.rename(filePath, newFilePath);

				//TODO: ENVIO DE CONFIRMACION A MAJOR

				resolve({result: true});
			}
			catch(error) {
				try {
					const filePath = `${config.PATH.PAGO_RENDICION}pendientes${config.PATH.PATH_SEPARATOR}${fileName}`;
					const newFilePath = `${config.PATH.PAGO_RENDICION}erroneos${config.PATH.PATH_SEPARATOR}${fileName}`;
					fs.rename(filePath, newFilePath);
				}
				catch {}

				const origen = "laramie-tesoreria-interface-major-webapi/pago-rendicion/createPagoRendicion";
				const data = {
					token: token,
					idTipoAlerta: 32, //Cuenta Corriente
					idUsuario: idUsuario,
					fecha: getDateNow(true),
					idModulo: 30,
					origen: origen,
					mensaje: "Error Rendición Pago - Ingreso de Lote",
					data: {
						fileName: fileName,
						error: castPublicError(error)
					}
				};
				try {
					await this.publishService.sendMessage(origen, "AddAlerta", "0", data);
				}
				catch (error) {
					reject(new MicroserviceError('Error enviando AddAlerta', error, "AddAlerta", data));
					return;
				}

				resolve({result: false});
			}
		});
	}


	private async sendPagoRendicion(token: string, idUsuario: number, pagoRendicionLote:PagoRendicionLote) {
		return new Promise( async (resolve, reject) => {
			try {
				const today = getDateNow(true);
				const origen = "laramie-tesoreria-interface-major-webapi/pago-rendicion/sendPagoRendicion";

				try {
					await this.publishService.sendMessage(origen, "AddPagoRendicion", idUsuario.toString(), pagoRendicionLote);
				}
				catch(error) {
					reject(new MicroserviceError('Error enviando AddPagoRendicion', error, "AddPagoRendicion", pagoRendicionLote));
					return;
				}

				await this.pagoRendicionLoteService.modifyEnvio(pagoRendicionLote.numeroLoteRendicion, today, pagoRendicionLote.observacionEnvio);

				resolve({result: true});
			}
			catch(error) {
				try {
					await this.pagoRendicionLoteService.modifyError(pagoRendicionLote.numeroLoteRendicion, "Error en sendPagoRendicion");
				}
				catch {}

				const origen = "laramie-tesoreria-interface-major-webapi/pago-rendicion/sendPagoRendicion";
				const data = {
					token: token,
					idTipoAlerta: 32, //Cuenta Corriente
					idUsuario: idUsuario,
					fecha: getDateNow(true),
					idModulo: 30,
					origen: origen,
					mensaje: "Error Rendición Pago - Envío de Lote",
					data: {
						lote: pagoRendicionLote,
						error: castPublicError(error)
					}
				};
				try {
					await this.publishService.sendMessage(origen, "AddAlerta", "0", data);
				}
				catch (error) {
					reject(new MicroserviceError('Error enviando AddAlerta', error, "AddAlerta", data));
					return;
				}

				resolve({result: false});
			}
		});
	}

	private getUsuarioProcesoId(usuarioProceso:string) {
		const users = getUsers() as any[];
		const user = users.find(f => f.codigo.toLocaleLowerCase() === usuarioProceso.toLocaleLowerCase());
		return user ? user.id : 0;
	}

	private getTipoMovimientoCodigo(TCuoCodigo:string) {
		return TCuoCodigo;
	}

	private acreditaPago(codigoTipoMovimiento) {
		return ["116","800"].includes(codigoTipoMovimiento);
	}

}
