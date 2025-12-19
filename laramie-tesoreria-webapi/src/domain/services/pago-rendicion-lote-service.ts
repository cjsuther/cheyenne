import { v4 as uuidv4 } from 'uuid';
import PagoRendicionLote from '../entities/pago-rendicion-lote';
import IPagoRendicionLoteRepository from '../repositories/pago-rendicion-lote-repository';
import { isValidString, isValidDate, isValidInteger, isValidFloat,  } from '../../infraestructure/sdk/utils/validator';
import ValidationError from '../../infraestructure/sdk/error/validation-error';
import ProcessError from '../../infraestructure/sdk/error/process-error';
import ReferenceError from '../../infraestructure/sdk/error/reference-error';
import { castPublicError, getDateNow, precisionRound } from '../../infraestructure/sdk/utils/convert';
import PagoRendicionService from './pago-rendicion-service';
import ReciboPublicacionService from './recibo-publicacion-service';
import RecaudadoraService from './recaudadora-service';
import ListaService from './lista-service';
import RecaudacionService from './recaudacion-service';
import PagoRendicion from '../entities/pago-rendicion';
import Recaudacion from '../entities/recaudacion';
import Recaudadora from '../entities/recaudadora';
import Lista from '../entities/lista';
import ReciboPublicacion from '../entities/recibo-publicacion';
import MicroserviceError from '../../infraestructure/sdk/error/microservice-error';
import PublishService from './publish-service';

export default class PagoRendicionLoteService {

	publishService: PublishService;
	pagoRendicionLoteRepository: IPagoRendicionLoteRepository;
	pagoRendicionService: PagoRendicionService;
	reciboPublicacionService: ReciboPublicacionService;
	recaudacionService: RecaudacionService;
	recaudadoraService: RecaudadoraService;
	listaService: ListaService;

	constructor(publishService: PublishService,
				pagoRendicionLoteRepository: IPagoRendicionLoteRepository,
				pagoRendicionService: PagoRendicionService,
				reciboPublicacionService: ReciboPublicacionService,
				recaudacionService: RecaudacionService,
				recaudadoraService: RecaudadoraService,
				listaService: ListaService
	) {
		this.publishService = publishService;
		this.pagoRendicionLoteRepository = pagoRendicionLoteRepository;
		this.pagoRendicionService = pagoRendicionService;
		this.reciboPublicacionService = reciboPublicacionService;
		this.recaudacionService = recaudacionService;
		this.recaudadoraService = recaudadoraService;
		this.listaService = listaService;
	}

	async list() {
		return new Promise( async (resolve, reject) => {
			try {
				const result = await this.pagoRendicionLoteRepository.list();
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async listDetalle(id: number) {
		return new Promise( async (resolve, reject) => {
			try {
				const result = await this.pagoRendicionService.listByLote(id) as PagoRendicion[];
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async findById(id: number) {
		return new Promise( async (resolve, reject) => {
			try {			   
				const result = await this.pagoRendicionLoteRepository.findById(id);
				if (!result) {
					reject(new ReferenceError('No existe el registro'));
					return;
				}
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async add(pagoRendicionLote: PagoRendicionLote) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidString(pagoRendicionLote.numeroLote, true) ||
					!isValidDate(pagoRendicionLote.fechaLote, true) ||
					!isValidInteger(pagoRendicionLote.casos, true) ||
					!isValidFloat(pagoRendicionLote.importeTotal, true) ||
					!isValidInteger(pagoRendicionLote.idUsuarioProceso, true) ||
					!isValidDate(pagoRendicionLote.fechaProceso, true) ||
					!isValidDate(pagoRendicionLote.fechaConfirmacion, false)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				pagoRendicionLote.id = null;
				const result = await this.pagoRendicionLoteRepository.add(pagoRendicionLote);
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async modify(id: number, pagoRendicionLote: PagoRendicionLote) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidString(pagoRendicionLote.numeroLote, true) ||
					!isValidDate(pagoRendicionLote.fechaLote, true) ||
					!isValidInteger(pagoRendicionLote.casos, true) ||
					!isValidFloat(pagoRendicionLote.importeTotal, true) ||
					!isValidInteger(pagoRendicionLote.idUsuarioProceso, true) ||
					!isValidDate(pagoRendicionLote.fechaProceso, true) ||
					!isValidDate(pagoRendicionLote.fechaConfirmacion, false)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				const result = await this.pagoRendicionLoteRepository.modify(id, pagoRendicionLote);
				if (!result) {
					reject(new ReferenceError('No existe el registro'));
					return;
				}
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async modifyConfirmacion(numeroLote:string, fechaConfirmacion:Date) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidString(numeroLote, true) ||
					!isValidDate(fechaConfirmacion, true)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				let lote = await this.pagoRendicionLoteRepository.findByLote(numeroLote) as PagoRendicionLote;
				if (!lote) {
					reject(new ReferenceError('No existe el lote'));
					return;
				}

				lote.numeroLote = numeroLote;
				lote.fechaConfirmacion = fechaConfirmacion;
				lote = await this.pagoRendicionLoteRepository.modify(lote.id, lote);
				
				resolve(lote);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async modifyIngresosPublicos(token: string, idUsuario: number, idsRecaudadora: number[]) {
		const resultTransaction = this.pagoRendicionLoteRepository.onTransaction( async () => { 
			return new Promise( async (resolve, reject) => {
				try {
					if (idsRecaudadora.length === 0) {
						reject(new ValidationError('Existen campos incompletos'));
						return;
					}

					const today = getDateNow(true);
					const recaudadoras = await this.recaudadoraService.list() as Recaudadora[];
					const lugaresPago = await this.listaService.list("LugarPago") as Lista[];
					const recaudaciones = await this.recaudacionService.listIngresosPublicos(idsRecaudadora) as Recaudacion[];
					//recorre las recaudaciones y genera un registro de rendicion por cada recaudacion (recibo)
					const rendiciones: Array<[PagoRendicion, Recaudacion, ReciboPublicacion]> = [];
					for (let r=0; r<recaudaciones.length; r++) {
						const recaudacion = recaudaciones[r];
						const recaudadora = recaudadoras.find(f => f.id === recaudacion.idRecaudadora);
						const lugarPago = lugaresPago.find(f => f.id === recaudadora.idLugarPago);
						const recibo = await this.reciboPublicacionService.findById(recaudacion.idReciboPublicacion) as ReciboPublicacion;
						
						const rendicion = new PagoRendicion();
						rendicion.idCuentaPago = recibo.idCuentaPago;
						rendicion.codigoDelegacion = recaudacion.codigoDelegacion;
						rendicion.numeroRecibo = recaudacion.numeroRecibo;
						rendicion.codigoLugarPago = lugarPago.codigo;
						rendicion.importePago = recaudacion.importeCobro;
						rendicion.fechaPago = recaudacion.fechaCobro;
						rendicion.codigoBarras = recaudacion.codigoBarras;
						rendiciones.push([rendicion, recaudacion, recibo]);
					}

					//por cada recaudadora genera un lote de rendicion, ingresando su cabecera y detalle
					const pagoRendicionesLote: PagoRendicionLote[] = [];
					for (let i=0; i<idsRecaudadora.length; i++) {
						const idRecaudadora = idsRecaudadora[i];
						const rendicionesXRecaudadora = rendiciones.filter(f => f[1].idRecaudadora === idRecaudadora);

						let importeTotal = 0;
						for (let r=0; r<rendicionesXRecaudadora.length; r++) {
							const rendicion = rendicionesXRecaudadora[r][0];
							importeTotal += rendicion.importePago;
						}
						importeTotal = precisionRound(importeTotal,2);

						let pagoRendicionLote = new PagoRendicionLote();
						pagoRendicionLote.numeroLote = uuidv4();
						pagoRendicionLote.fechaLote = today;
						pagoRendicionLote.casos = rendicionesXRecaudadora.length;
						pagoRendicionLote.importeTotal = importeTotal;
						pagoRendicionLote.idUsuarioProceso = idUsuario;
						pagoRendicionLote.fechaProceso = today;
						pagoRendicionLote.fechaConfirmacion = null;
						pagoRendicionLote = await this.add(pagoRendicionLote) as PagoRendicionLote;

						for (let r=0; r<rendicionesXRecaudadora.length; r++) {
							let rendicion = rendicionesXRecaudadora[r][0];
							const recaudacion = rendicionesXRecaudadora[r][1];
							const recibo = rendicionesXRecaudadora[r][2];
							rendicion.idPagoRendicionLote = pagoRendicionLote.id;
							recaudacion.idPagoRendicionLote = pagoRendicionLote.id;
							rendicion = await this.pagoRendicionService.add(rendicion) as PagoRendicion;
							recibo.idPagoRendicion = rendicion.id;
							await this.recaudacionService.modify(recaudacion.id, recaudacion);
							await this.reciboPublicacionService.modify(recibo.id, recibo);
						}
						pagoRendicionesLote.push(pagoRendicionLote);
					}

					resolve({idsPagoRendicionLote: pagoRendicionesLote.map(x => x.id)});
				}
				catch(error) {
					if (error instanceof ValidationError ||
						error instanceof ProcessError ||
						error instanceof ReferenceError) {
						reject(error);
					}
					else {
						reject(new ProcessError('Error procesando datos', error));
					}
				}
			});
		});
		return resultTransaction;
	}

	async sendLoteIngresosPublicos(token: string, idUsuario: number, idPagoRendicionLote: number) {
		return new Promise( async (resolve, reject) => {		   
			try {
				const today = getDateNow(true);
				const origen = "laramie-tesoreria-webapi/PagoRendicionLoteService/sendLoteIngresosPublicos";

				const lote = await this.pagoRendicionLoteRepository.findById(idPagoRendicionLote) as PagoRendicionLote;
				const rendiciones = await this.pagoRendicionService.listByLote(idPagoRendicionLote) as PagoRendicion[];
				const data = {
					numeroLoteRendicion: lote.numeroLote,
					fechaRendicion: lote.fechaProceso,
					fechaEnvio: today,
					observacionEnvio: `Id del registro de Lote de Pagos: ${idPagoRendicionLote}`,
					pagosRendicion: rendiciones.map(rendicion => {
						return {...rendicion,
							idUsuarioProceso: lote.idUsuarioProceso,
							fechaProceso: lote.fechaProceso,
							recibosApertura: [] //por el momento no se informa este detalle
						};
					})
				}

				await this.publishService.sendMessage(origen, "AddPagoRendicion", idUsuario.toString(), data);

				resolve({result: true});
			}
			catch (error) {
				const origen = "laramie-tesoreria-webapi/PagoRendicionLoteService/sendLoteIngresosPublicos";
				const data = {
					token: token,
					idTipoAlerta: 32, //Cuenta Corriente
					idUsuario: idUsuario,
					fecha: getDateNow(true),
					idModulo: 35,
					origen: origen,
					mensaje: "Error Rendición Pago - Envío de Lote",
					data: {
						idPagoRendicionLote: idPagoRendicionLote,
						error: castPublicError(error)
					}
				};
				try {
					await this.publishService.sendMessage(origen, "AddAlerta", idUsuario.toString(), data);
				}
				catch (error) {
					reject(new MicroserviceError('Error enviando AddAlerta', error, "AddAlerta", data));
					return;
				}
	
				resolve({result: false, error: castPublicError(error)});
			}
		});
	}

	async remove(id: number) {
		return new Promise( async (resolve, reject) => {
			try {
				const result = await this.pagoRendicionLoteRepository.remove(id);
				if (!result) {
					reject(new ReferenceError('No existe el registro'));
					return;
				}
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

}
