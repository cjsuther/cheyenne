import fs from 'fs/promises';
import PublishService from './publish-service';
import MicroserviceError from '../../infraestructure/sdk/error/microservice-error';
import ReciboPublicacionLote from '../entities/recibo-publicacion-lote';
import ReciboPublicacionLoteService from './recibo-publicacion-lote-service';
import { castPublicError, getDateId, getDateNow, getDateToMajor, getDateToMajorAnsiSq, iifEmpty, precisionRound } from '../../infraestructure/sdk/utils/convert';
import config from '../../server/configuration/config';
import { CloneObject } from '../../infraestructure/sdk/utils/helper';
import ReciboApertura from '../entities/recibo-apertura';
import ReciboPublicacionMajor from '../dto/recibo-publicacion-major';
import ReciboPublicacion from '../entities/recibo-publicacion';
import requestSoapGetSystemToken from '../../infraestructure/sdk/templates/requestSoapGetSystemToken';
import { SendRequestSoap } from '../../infraestructure/sdk/utils/request';
import { APIS } from '../../server/configuration/apis';
import requestSoapPersistirLiquidacion from '../../infraestructure/sdk/templates/requestSoapPersistirLiquidacion';

export default class ReciboPublicacionService {

	publishService: PublishService;
	reciboPublicacionLoteService: ReciboPublicacionLoteService;

	constructor(publishService: PublishService, reciboPublicacionLoteService: ReciboPublicacionLoteService)
	{
		this.publishService = publishService;
		this.reciboPublicacionLoteService = reciboPublicacionLoteService;
	}

	async modifyExport(token: string, idUsuario: number, modo: string) {
		return new Promise( async (resolve, reject) => {
			try {
				const lotes = await this.reciboPublicacionLoteService.listPendienteEnvio() as ReciboPublicacionLote[];
				lotes.sort((a,b) => a.fechaPublicacion.getTime() - b.fechaPublicacion.getTime());

				for (let i=0; i < lotes.length; i++) {
					const reciboPublicacionLote = lotes[i];
					if (modo === 'batch' && reciboPublicacionLote.masivo) {
						await this.createReciboPublicacionBatch(token, idUsuario, reciboPublicacionLote);
					}
					else if (modo === 'online' && !reciboPublicacionLote.masivo) {
						await this.createReciboPublicacionOnLine(token, idUsuario, reciboPublicacionLote);
					}
				}

				resolve({result: true});
			}
			catch(error) {
				if (error instanceof MicroserviceError) {
					reject(error);
				}

				const origen = "laramie-tesoreria-interface-major-webapi/recibo-publicacion-service/modifyExport";
				const data = {
					token: token,
					idTipoAlerta: 32, //Cuenta Corriente
					idUsuario: idUsuario,
					fecha: getDateNow(true),
					idModulo: 30,
					origen: origen,
					mensaje: "Error Publicación Recibo - Exportación de Lote",
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

	async modifyExportByLote(token: string, idUsuario: number, numeroLotePublicacion: string) {
		return new Promise( async (resolve, reject) => {
			try {
				const reciboPublicacionLote = await this.reciboPublicacionLoteService.findByLote(numeroLotePublicacion) as ReciboPublicacionLote;
				if (reciboPublicacionLote.masivo) {
					await this.createReciboPublicacionBatch(token, idUsuario, reciboPublicacionLote);
				}
				else {
					await this.createReciboPublicacionOnLine(token, idUsuario, reciboPublicacionLote);
				}

				resolve({result: true});
			}
			catch(error) {
				if (error instanceof MicroserviceError) {
					reject(error);
				}

				const origen = "laramie-tesoreria-interface-major-webapi/recibo-publicacion-service/modifyExport";
				const data = {
					token: token,
					idTipoAlerta: 32, //Cuenta Corriente
					idUsuario: idUsuario,
					fecha: getDateNow(true),
					idModulo: 30,
					origen: origen,
					mensaje: "Error Publicación Recibo - Exportación de Lote",
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

	async modifyConfirmacion(token: string, idUsuario: number, numeroLotePublicacion:string) {
		return new Promise( async (resolve, reject) => {
			try {
				const today = getDateNow(true);
				await this.reciboPublicacionLoteService.modifyConfirmacion(numeroLotePublicacion, today, "");

				resolve({result: true});
			}
			catch(error) {
				try {
					await this.reciboPublicacionLoteService.modifyError(numeroLotePublicacion, "Error en modifyConfirmacion");
				}
				catch {}

				const origen = "laramie-tesoreria-interface-major-webapi/queue-message-execute/modifyConfirmacionReciboPublicacion";
				const data = {
					token: token,
					idTipoAlerta: 32, //Cuenta Corriente
					idUsuario: idUsuario,
					fecha: getDateNow(true),
					idModulo: 30,
					origen: origen,
					mensaje: "Error Publicación Recibo - Confirmación de Lote",
					data: {
						numeroLotePublicacion: numeroLotePublicacion,
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


	private async createReciboPublicacionBatch(token: string, idUsuario: number, reciboPublicacionLote:ReciboPublicacionLote) {
		return new Promise( async (resolve, reject) => {
			try {
				const today = getDateNow(true);
				const delim = config.CHAR_DELIMITER;

				let fillNulls = Array(22).fill("NULL").join(delim);
				let data = `${reciboPublicacionLote.numeroLotePublicacion}${delim}${reciboPublicacionLote.recibosPublicacion.length}${delim}${fillNulls}\n`;
				for (let r=0; r < reciboPublicacionLote.recibosPublicacion.length; r++) {
					const recibo = reciboPublicacionLote.recibosPublicacion[r];
					const itemsMajor = this.getItemsMajor(recibo) as ReciboPublicacionMajor[];
					data += itemsMajor.map(x => x.getRow(recibo.codigoDelegacion, recibo.numeroRecibo.toString(), delim)).join('\n') + '\n';
				}

				const fileName = `ReciboPublicacion_${reciboPublicacionLote.numeroLotePublicacion}_${getDateId()}.csv`;
				const filePath = `${config.PATH.RECIBO_PUBLICACION}pendientes${config.PATH.PATH_SEPARATOR}${fileName}`;
				await fs.writeFile(filePath, data);

				await this.reciboPublicacionLoteService.modifyEnvio(reciboPublicacionLote.numeroLotePublicacion, today, `Nombre del Archivo de Lote de Recibos: ${fileName}`);

				resolve({result: true});
			}
			catch(error) {
				try {
					await this.reciboPublicacionLoteService.modifyError(reciboPublicacionLote.numeroLotePublicacion, "Error en createReciboPublicacion");
				}
				catch {}

				const origen = "laramie-tesoreria-interface-major-webapi/queue-message-execute/addReciboPublicacion";
				const data = {
					token: token,
					idTipoAlerta: 32, //Cuenta Corriente
					idUsuario: idUsuario,
					fecha: getDateNow(true),
					idModulo: 30,
					origen: origen,
					mensaje: "Error Publicación Recibo - Envío de Lote",
					data: {
						lote: reciboPublicacionLote,
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

	private async createReciboPublicacionOnLine(token: string, idUsuario: number, reciboPublicacionLote:ReciboPublicacionLote) {
		return new Promise( async (resolve, reject) => {
			try {
				const today = getDateNow(true);

				let liquidaciones:any[] = []
				for (let r=0; r < reciboPublicacionLote.recibosPublicacion.length; r++) {
					const recibo = reciboPublicacionLote.recibosPublicacion[r];
					const liquidacionDetalles = this.getItemsMajor(recibo) as ReciboPublicacionMajor[];
					liquidaciones.push({
						pagoCodigoDelegacion: parseInt(recibo.codigoDelegacion),
						pagoNumero: recibo.numeroRecibo,
						liquidacionDetalles: liquidacionDetalles
					});
				}
				const liquidacionData = {
					cabecera: {
						numeroLote: reciboPublicacionLote.numeroLotePublicacion,
						cantidadLiquidaciones: reciboPublicacionLote.recibosPublicacion.length
					},
					liquidaciones: liquidaciones
				}
				const serializedLiquidacionData = JSON.stringify(liquidacionData);

				await this.reciboPublicacionLoteService.modifyEnvio(reciboPublicacionLote.numeroLotePublicacion, today, serializedLiquidacionData);

				let bodyGetSystemToken = requestSoapGetSystemToken();
				bodyGetSystemToken = bodyGetSystemToken.replace('[[USUARIO]]', config.ACCESS_MAJOR.USR);
				bodyGetSystemToken = bodyGetSystemToken.replace('[[PASSWORD]]', config.ACCESS_MAJOR.PSW);
				const responseGetSystemToken = await SendRequestSoap('?op=GetSystemToken', bodyGetSystemToken, APIS.URLS.MAJOR_SERVICE) as any;
				if (responseGetSystemToken.code !== 200) {
					const origen = "laramie-tesoreria-interface-major-webapi/recibo-publicacion-service/createReciboPublicacionOnLine";
					const data = {
						token: token,
						idTipoAlerta: 32, //Cuenta Corriente
						idUsuario: idUsuario,
						fecha: getDateNow(true),
						idModulo: 30,
						origen: origen,
						mensaje: "Error Publicación Recibo - Registro de Lote - Ejecutando GetSystemToken",
						data: {
							lote: reciboPublicacionLote,
							response: responseGetSystemToken
						}
					};
					try {
						await this.publishService.sendMessage(origen, "AddAlerta", "0", data);
					}
					catch (error) {
						reject(new MicroserviceError('Error enviando AddAlerta', error, "AddAlerta", data));
						return;
					}

					await this.reciboPublicacionLoteService.modifyError(reciboPublicacionLote.numeroLotePublicacion, `Error GetSystemToken: ${responseGetSystemToken.code}: ${responseGetSystemToken.descripcion}`);
					resolve({result: false});
					return;
				}

				let bodyPersistirLiquidacion = requestSoapPersistirLiquidacion();
				bodyPersistirLiquidacion = bodyPersistirLiquidacion.replace('[[USUARIO]]', config.ACCESS_MAJOR.USR);
				bodyPersistirLiquidacion = bodyPersistirLiquidacion.replace('[[TOKEN]]', responseGetSystemToken.token);
				bodyPersistirLiquidacion = bodyPersistirLiquidacion.replace('[[DATA]]', serializedLiquidacionData);
				const responsePersistirLiquidacion = await SendRequestSoap('?op=PersistirLiquidacion', bodyPersistirLiquidacion, APIS.URLS.MAJOR_SERVICE) as any;
				if (responsePersistirLiquidacion.code !== 200) {
					const origen = "laramie-tesoreria-interface-major-webapi/recibo-publicacion-service/createReciboPublicacionOnLine";
					const data = {
						token: token,
						idTipoAlerta: 32, //Cuenta Corriente
						idUsuario: idUsuario,
						fecha: getDateNow(true),
						idModulo: 30,
						origen: origen,
						mensaje: "Error Publicación Recibo - Registro de Lote - Ejecutando PersistirLiquidacion",
						data: {
							lote: reciboPublicacionLote,
							response: responsePersistirLiquidacion
						}
					};
					try {
						await this.publishService.sendMessage(origen, "AddAlerta", "0", data);
					}
					catch (error) {
						reject(new MicroserviceError('Error enviando AddAlerta', error, "AddAlerta", data));
						return;
					}

					await this.reciboPublicacionLoteService.modifyError(reciboPublicacionLote.numeroLotePublicacion, `Error PersistirLiquidacion: ${responsePersistirLiquidacion.code}: ${responsePersistirLiquidacion.descripcion}`);
					resolve({result: false});
					return;
				}

				await this.reciboPublicacionLoteService.modifyConfirmacion(reciboPublicacionLote.numeroLotePublicacion, today, responsePersistirLiquidacion.descripcion);

				resolve({result: true});
			}
			catch(error) {
				try {
					await this.reciboPublicacionLoteService.modifyError(reciboPublicacionLote.numeroLotePublicacion, "Error en createReciboPublicacion");
				}
				catch {}

				const origen = "laramie-tesoreria-interface-major-webapi/recibo-publicacion-service/createReciboPublicacionOnLine";
				const data = {
					token: token,
					idTipoAlerta: 32, //Cuenta Corriente
					idUsuario: idUsuario,
					fecha: getDateNow(true),
					idModulo: 30,
					origen: origen,
					mensaje: "Error Publicación Recibo - Envío de Lote",
					data: {
						lote: reciboPublicacionLote,
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


	private procesoPerGen(items:ReciboApertura[], fechaVencimiento1:Date, fechaVencimiento2:Date) {
		const itemsPerGen = [];
		const codigoTipoMovimientoTCuo = ["602","500"];
		const tieneVencimiento2 = (fechaVencimiento1.getTime() !== fechaVencimiento2.getTime());
		for (let i=0; i < items.length; i++) {
			const item = items[i];
			if (codigoTipoMovimientoTCuo.includes(item.codigoTipoMovimiento)) {
				const itemsTasaBase = items.filter(f => f.periodo === item.periodo && f.cuota === item.cuota &&
														f.codigoTasa === item.codigoTasa && f.codigoSubTasa === item.codigoSubTasa && f.codigoRubro === item.codigoRubro);
				const itemsTasaBaseSinTCuo = itemsTasaBase.filter(f => !codigoTipoMovimientoTCuo.includes(f.codigoTipoMovimiento));
				let itemMax = Math.max(...itemsTasaBase.map(x => x.item));
				itemsTasaBaseSinTCuo.forEach(itemTasaBase => {
					if (tieneVencimiento2) {
						//para compensar lo que se desconto en la tasa en 1er venc, cuando aplica 2do venc
						const itemTasaCompensacion = CloneObject(item);
						itemTasaCompensacion.codigoTipoMovimiento = "0";
						itemTasaCompensacion.fechaVencimiento = fechaVencimiento2;
						itemTasaCompensacion.item = ++itemMax;
						itemsPerGen.push(itemTasaCompensacion);
					}
					//para descontar en la tasa, cuando aplica 1er venc
					itemTasaBase.importeCancelar = precisionRound(itemTasaBase.importeCancelar - item.importeCancelar);
					itemTasaBase.importeImputacionContable = precisionRound(itemTasaBase.importeImputacionContable - item.importeImputacionContable);
				});
				if (tieneVencimiento2) {
					//para compensar el descuento del 1er venc, cuando aplica 2do venc
					const itemDescCompensacion = CloneObject(item);
					itemDescCompensacion.importeCancelar = (-1)*itemDescCompensacion.importeCancelar;
					itemDescCompensacion.importeImputacionContable = 0;
					itemDescCompensacion.fechaVencimiento = fechaVencimiento2;
					itemDescCompensacion.item = ++itemMax;
					itemsPerGen.push(itemDescCompensacion);
				}
				item.importeImputacionContable = 0;
			}
			else {
				item.codigoTipoMovimiento = "0";
			}
			itemsPerGen.push(item);
		}

		return itemsPerGen;
	}

	private getTCuoCodigo(codigoTipoMovimiento:string) {
		const codigoTipoMovimientoTCuo = ["602","500"];
		if (codigoTipoMovimientoTCuo.includes(codigoTipoMovimiento))
			return parseInt(codigoTipoMovimiento);
		else
			return 0;
	}

	private getItemsMajor(recibo: ReciboPublicacion) {
		const digitoVerificador = recibo.codigoBarras.charAt(47);
		const aperturas = this.procesoPerGen(recibo.recibosApertura, recibo.fechaVencimiento1, recibo.fechaVencimiento2) as ReciboApertura[];
		
		const itemsMajor:ReciboPublicacionMajor[] = [];
		for (let i=0; i < aperturas.length; i++) {
			const item = aperturas[i];

			const emiPeri = parseInt(iifEmpty(item.numeroEmision,"1"));
			const perGen = item.periodoImputacion !== item.periodo ? parseInt(item.periodoImputacion) : 0;

			const itemMajor = new ReciboPublicacionMajor();
			itemMajor.pagoItem = item.item;
			itemMajor.edesCliente = parseInt(iifEmpty(item.codigoEdesurCliente,"0"));
			itemMajor.juceNumero = parseInt(iifEmpty(item.numeroCertificadoApremio,"0"));
			itemMajor.lugaCodigo = 0;
			itemMajor.cajaCodigo = 0;
			itemMajor.dtriCodigo = parseInt(recibo.codigoTipoTributo);
			itemMajor.tribCuenta = recibo.numeroCuenta;
			itemMajor.rublCodigo = iifEmpty(item.codigoRubro,"000000");
			itemMajor.ttasTasa = parseInt(item.codigoTasa);
			itemMajor.ttasSubTasa = parseInt(item.codigoSubTasa);
			itemMajor.tcuoCodigo = this.getTCuoCodigo(item.codigoTipoMovimiento);
			itemMajor.pagoNumeroCartel = 0;
			itemMajor.pagoPeriodo = parseInt(item.periodo);
			itemMajor.pagoCuota = item.cuota.toString().padStart(4,'0');
			itemMajor.pagoImporte = item.importeImputacionContable;
			itemMajor.pagoACancelar = item.importeCancelar;
			itemMajor.pagoVtoTermino = getDateToMajorAnsiSq(item.fechaVencimiento);
			itemMajor.pagoDigitoVerificador = parseInt(digitoVerificador);
			itemMajor.pagoEmiPeri = emiPeri;
			itemMajor.pagoEmiNro = parseInt(iifEmpty(item.numeroEmision,"0"));
			itemMajor.pagoPerGen = perGen;
			itemMajor.pagoFechaCobro = getDateToMajorAnsiSq(null);

			itemsMajor.push(itemMajor);
		}

		return itemsMajor;
	}

}
