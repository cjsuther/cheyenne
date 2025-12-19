import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import RecaudacionLote from '../entities/recaudacion-lote';
import IRecaudacionLoteRepository from '../repositories/recaudacion-lote-repository';
import { isValidString, isValidDate, isValidInteger, isValidFloat } from '../../infraestructure/sdk/utils/validator';
import ValidationError from '../../infraestructure/sdk/error/validation-error';
import ProcessError from '../../infraestructure/sdk/error/process-error';
import ReferenceError from '../../infraestructure/sdk/error/reference-error';
import RecaudacionService from './recaudacion-service';
import Recaudacion from '../entities/recaudacion';
import RecaudacionRow from '../dto/recaudacion-row';
import { distinctArray, ensureDirectoryExistence, getNumeroRecibo_IdentificadorFacturaToObject, getNumeroRecibo_ObjectToIdentificador } from '../../infraestructure/sdk/utils/helper';
import { getDateNow, precisionRound } from '../../infraestructure/sdk/utils/convert';
import PagoRendicionLoteService from './pago-rendicion-lote-service';
import MicroserviceError from '../../infraestructure/sdk/error/microservice-error';
import RegistroContableLoteService from './registro-contable-lote-service';
import RecaudacionLoteDto from '../dto/recaudacion-lote-dto';
import config from '../../server/configuration/config';
import RecaudadoraService from './recaudadora-service';
import Recaudadora from '../entities/recaudadora';
import IParser from './process/imports/i-parser';
import ParserFactory from './process/imports/parser-factory';
import ReciboPublicacion from '../entities/recibo-publicacion';
import ReciboPublicacionService from './recibo-publicacion-service';
import RecaudacionLoteConciliacion from '../dto/recaudacion-lote-conciliacion';
import { ORIGEN_RECAUDACION } from '../../infraestructure/sdk/consts/origenRecaudacion';
import ConfiguracionService from './configuracion-service';
import Configuracion from '../entities/configuracion';
import IdentificadorFactura from '../dto/identificador-factura';
import CajaAsignacionService from './caja-asignacion-service';
import CajaAsignacion from '../entities/caja-asignacion';

export default class RecaudacionLoteService {

	configuracionService: ConfiguracionService;
	recaudacionLoteRepository: IRecaudacionLoteRepository;
	recaudacionService: RecaudacionService;
	pagoRendicionLoteService: PagoRendicionLoteService;
	registroContableLoteService: RegistroContableLoteService;
	reciboPublicacionService: ReciboPublicacionService;
	recaudadoraService: RecaudadoraService;
	cajaAsignacionService: CajaAsignacionService;
	

	constructor(configuracionService: ConfiguracionService,
				recaudacionLoteRepository: IRecaudacionLoteRepository,
				recaudacionService: RecaudacionService,
				pagoRendicionLoteService: PagoRendicionLoteService,
				registroContableLoteService: RegistroContableLoteService,
				reciboPublicacionService: ReciboPublicacionService,
				recaudadoraService: RecaudadoraService,
				cajaAsignacionService: CajaAsignacionService) {
		this.configuracionService = configuracionService;
		this.recaudacionLoteRepository = recaudacionLoteRepository;
		this.recaudacionService = recaudacionService;
		this.pagoRendicionLoteService = pagoRendicionLoteService;
		this.registroContableLoteService = registroContableLoteService;
		this.reciboPublicacionService = reciboPublicacionService;
		this.recaudadoraService = recaudadoraService;
		this.cajaAsignacionService = cajaAsignacionService;
	}

	async list() {
		return new Promise( async (resolve, reject) => {
			try {
				const result = await this.recaudacionLoteRepository.list();
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
				const result = await this.recaudacionService.listByLote(id) as Recaudacion[];
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async listControl() {
		return new Promise( async (resolve, reject) => {
			try {
				const result = await this.recaudacionLoteRepository.listControl();
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async listConciliacion() {
		return new Promise( async (resolve, reject) => {
			try {
				const lotes = await this.recaudacionLoteRepository.listConciliacion() as RecaudacionLoteConciliacion[];
				for (let i=0; i<lotes.length; i++) {
					const lote = lotes[0];
					const recaudaciones = await this.recaudacionService.listByLote(lote.id) as Recaudacion[];
					lote.casosNoConciliados = recaudaciones.filter(f => !f.fechaConciliacion).length;
				}

				resolve(lotes);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async listIngresosPublicos() {
		return new Promise( async (resolve, reject) => {
			try {
				const recaudaciones = await this.recaudacionService.listIngresosPublicos() as Recaudacion[];

				const recaudadoras = distinctArray(recaudaciones.map(x => x.idRecaudadora))
									.map(idRecaudadora => new RecaudacionRow(idRecaudadora)) as RecaudacionRow[];
				
				for (let i=0; i<recaudadoras.length; i++) {
					const recaudadora = recaudadoras[i];
					const recaudacionesXRecaudadora = recaudaciones.filter(f => f.idRecaudadora === recaudadora.idRecaudadora);
					recaudadora.casos = recaudacionesXRecaudadora.length;
					recaudadora.importeTotal = 0;
					for (let r=0; r<recaudacionesXRecaudadora.length; r++) {
						const recaudacion = recaudacionesXRecaudadora[r];
						recaudadora.importeTotal += recaudacion.importeCobro;
					}
					recaudadora.importeTotal = precisionRound(recaudadora.importeTotal,2);
				}

				resolve(recaudadoras);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async listRegistroContable() {
		return new Promise( async (resolve, reject) => {
			try {
				const recaudaciones = await this.recaudacionService.listRegistroContable() as Recaudacion[];

				const recaudadoras = distinctArray(recaudaciones.map(x => x.idRecaudadora))
									.map(idRecaudadora => new RecaudacionRow(idRecaudadora)) as RecaudacionRow[];
				
				for (let i=0; i<recaudadoras.length; i++) {
					const recaudadora = recaudadoras[i];
					const recaudacionesXRecaudadora = recaudaciones.filter(f => f.idRecaudadora === recaudadora.idRecaudadora);
					recaudadora.casos = recaudacionesXRecaudadora.length;
					recaudadora.importeTotal = 0;
					for (let r=0; r<recaudacionesXRecaudadora.length; r++) {
						const recaudacion = recaudacionesXRecaudadora[r];
						recaudadora.importeTotal += recaudacion.importeCobro;
					}
					recaudadora.importeTotal = precisionRound(recaudadora.importeTotal,2);
				}

				resolve(recaudadoras);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async findById(id: number) {
		return new Promise( async (resolve, reject) => {
			try {			   
				const result = await this.recaudacionLoteRepository.findById(id);
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

	async add(recaudacionLote: RecaudacionLote) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidString(recaudacionLote.numeroLote, true) ||
					!isValidDate(recaudacionLote.fechaLote, true) ||
					!isValidInteger(recaudacionLote.casos, false) ||
					!isValidInteger(recaudacionLote.idUsuarioProceso, true) ||
					!isValidDate(recaudacionLote.fechaProceso, true) ||
					!isValidInteger(recaudacionLote.idOrigenRecaudacion, true) ||
					!isValidInteger(recaudacionLote.idRecaudadora, true) ||
					!isValidDate(recaudacionLote.fechaAcreditacion, false) ||
					!isValidDate(recaudacionLote.fechaControl, false) ||
					!isValidDate(recaudacionLote.fechaConciliacion, false) ||
					!isValidFloat(recaudacionLote.importeTotal, false) ||
					!isValidFloat(recaudacionLote.importeNeto, false) ||
					!isValidString(recaudacionLote.pathArchivoRecaudacion, false) ||
					!isValidString(recaudacionLote.nombreArchivoRecaudacion, false)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				recaudacionLote.id = null;
				if (recaudacionLote.idUsuarioControl === 0) recaudacionLote.idUsuarioControl = null;
				if (recaudacionLote.idUsuarioConciliacion === 0) recaudacionLote.idUsuarioConciliacion = null;
				const result = await this.recaudacionLoteRepository.add(recaudacionLote);
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async addImportacionPreview(idUsuario:number, idRecaudadora:number, nombre:string, path:string) {
		return new Promise( async (resolve, reject) => {
			try {
				if (!isValidInteger(idRecaudadora, true) ||
					!isValidString(nombre, true) ||
					!isValidString(path, true)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				const pathFileSource = `${config.PATH.TEMP}${path}`;
				let content = fs.readFileSync(pathFileSource, { encoding: 'utf8', flag: 'r' });
				//se quitan enter al final
				while (content.length > 1 && content[content.length - 1] === '\n') {
					content = content.substring(0, content.length - 1);
				}

				const configMunicipioCodigo = await this.configuracionService.findByNombre("MunicipioCodigo") as Configuracion;
				const recaudadora = await this.recaudadoraService.findById(idRecaudadora) as Recaudadora;
				const parserFactory = new ParserFactory();
				const parser:IParser = parserFactory.getParser(recaudadora.codigoCliente);
				if (!parser) {
					reject(new ValidationError('No se pudo identificar el código de cliente'));
					return;
				}
				const data = await parser.execute(idUsuario, nombre, content, configMunicipioCodigo.valor, recaudadora) as RecaudacionLoteDto;
				data.nombre = nombre;
				data.path = path;

				resolve(data);
			}
			catch(error) {
				if (error instanceof ValidationError ||
					error instanceof ProcessError) {
					reject(error);
				}
				else {
					reject(new ProcessError('Error procesando datos', error));
				}
			}
		});
	}

	async addImportacionConfirmacion(idUsuario:number, idRecaudadora:number, nombre:string, path:string) {
		const resultTransaction = this.recaudacionLoteRepository.onTransaction( async () => { 
			return new Promise( async (resolve, reject) => {
				try {
					if (!isValidInteger(idRecaudadora, true) ||
						!isValidString(nombre, true) ||
						!isValidString(path, true)
					) {
						reject(new ValidationError('Existen campos incompletos'));
						return;
					}

					const today = getDateNow(true);
					const configMunicipioCodigo = await this.configuracionService.findByNombre("MunicipioCodigo") as Configuracion;
					const recaudadora = await this.recaudadoraService.findById(idRecaudadora) as Recaudadora;
					
					const nombreArchivoRecaudacion = `${recaudadora.codigoCliente}_${nombre}`;
					let loteExistente = await this.recaudacionLoteRepository.findByNombreArchivoRecaudacion(nombreArchivoRecaudacion) as RecaudacionLote;
					if (loteExistente) {
						reject(new ValidationError('El lote ya fue importado'));
						return;
					}

					const pathFileSource = `${config.PATH.TEMP}${path}`;
					let content = fs.readFileSync(pathFileSource, { encoding: 'utf8', flag: 'r' });
					//se quitan enter al final
					while (content.length > 1 && content[content.length - 1] === '\n') {
						content = content.substring(0, content.length - 1);
					}

					const parserFactory = new ParserFactory();
					const parser:IParser = parserFactory.getParser(recaudadora.codigoCliente);
					const data = await parser.execute(idUsuario, nombre, content, configMunicipioCodigo.valor, recaudadora) as RecaudacionLoteDto;

					let recaudacionLote = data.recaudacionLote;
					recaudacionLote.id = null;
					recaudacionLote.numeroLote = uuidv4();
					// usamos la fecha original si viene en el lote
					recaudacionLote.fechaLote = recaudacionLote.fechaLote??today;
					recaudacionLote.pathArchivoRecaudacion = path;
					recaudacionLote.nombreArchivoRecaudacion = nombreArchivoRecaudacion;
					recaudacionLote.idUsuarioControl = null;
					recaudacionLote.fechaControl = null;
					recaudacionLote.idUsuarioConciliacion = null;
					recaudacionLote.fechaConciliacion = null;
					recaudacionLote.importeNeto = 0;
					recaudacionLote = await this.add(recaudacionLote) as RecaudacionLote;

					for (let r=0; r<data.recaudaciones.length; r++) {
						const recaudacion = data.recaudaciones[r] as Recaudacion;
						recaudacion.id = null;
						recaudacion.idRecaudacionLote = recaudacionLote.id;
						recaudacion.idReciboPublicacion = null;
						recaudacion.idRegistroContableLote = null;
						recaudacion.idPagoRendicionLote = null;
						recaudacion.idUsuarioConciliacion = null;
						recaudacion.fechaConciliacion = null;
						recaudacion.observacion = "";
						await this.recaudacionService.add(recaudacion);
					}

					const pathFileTarget = `${config.PATH.IMPORTS}${path}`;
					ensureDirectoryExistence(pathFileTarget);
					fs.rename(pathFileSource, pathFileTarget, (err) => {
					    if (err) {
					        reject(new ProcessError('Error moviendo archivo', err));
					        return;
					    }
					});

					resolve(data);
				}
				catch(error) {
					if (error instanceof ValidationError ||
						error instanceof ProcessError) {
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

	async addImportacionIngresosPublicos(data:RecaudacionLoteDto) {
		const resultTransaction = this.recaudacionLoteRepository.onTransaction( async () => { 
			return new Promise( async (resolve, reject) => {
				try {
					if (!isValidString(data.codigoRecaudadora, true)
					) {
						reject(new ValidationError('Existen campos incompletos'));
						return;
					}

					const today = getDateNow(true);
					const recaudadora = await this.recaudadoraService.findByCodigo(data.codigoRecaudadora) as Recaudadora;

					const nombreArchivoRecaudacion = `${recaudadora.codigoCliente}_${data.nombre}`;
					let loteExistente = await this.recaudacionLoteRepository.findByNombreArchivoRecaudacion(nombreArchivoRecaudacion) as RecaudacionLote;
					if (loteExistente) {
						reject(new ValidationError('El lote ya fue importado'));
						return;
					}

					let recaudacionLote = data.recaudacionLote;
					recaudacionLote.id = null;
					recaudacionLote.numeroLote = uuidv4();
					// usamos la fecha original si viene en el lote
					recaudacionLote.fechaLote = recaudacionLote.fechaLote??today;
			        recaudacionLote.idOrigenRecaudacion = ORIGEN_RECAUDACION.INGRESOS_PUBLICOS;
					recaudacionLote.idRecaudadora = recaudadora.id;
					recaudacionLote.pathArchivoRecaudacion = data.path;
					recaudacionLote.nombreArchivoRecaudacion = nombreArchivoRecaudacion;
					recaudacionLote = await this.add(recaudacionLote) as RecaudacionLote;

					for (let r=0; r<data.recaudaciones.length; r++) {
						const recaudacion = data.recaudaciones[r] as Recaudacion;
						recaudacion.id = null;
						recaudacion.idRecaudacionLote = recaudacionLote.id;
						recaudacion.idRecaudadora = recaudadora.id;
						await this.recaudacionService.add(recaudacion);
					}

					resolve(data);
				}
				catch(error) {
					if (error instanceof ValidationError ||
						error instanceof ProcessError) {
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

	async modify(id: number, recaudacionLote: RecaudacionLote) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidString(recaudacionLote.numeroLote, true) ||
					!isValidDate(recaudacionLote.fechaLote, true) ||
					!isValidInteger(recaudacionLote.casos, false) ||
					!isValidInteger(recaudacionLote.idUsuarioProceso, true) ||
					!isValidDate(recaudacionLote.fechaProceso, true) ||
					!isValidInteger(recaudacionLote.idOrigenRecaudacion, true) ||
					!isValidInteger(recaudacionLote.idRecaudadora, true) ||
					!isValidDate(recaudacionLote.fechaAcreditacion, false) ||
					!isValidDate(recaudacionLote.fechaControl, false) ||
					!isValidDate(recaudacionLote.fechaConciliacion, false) ||
					!isValidFloat(recaudacionLote.importeTotal, false) ||
					!isValidFloat(recaudacionLote.importeNeto, false) ||
					!isValidString(recaudacionLote.pathArchivoRecaudacion, false) ||
					!isValidString(recaudacionLote.nombreArchivoRecaudacion, false)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				if (recaudacionLote.idUsuarioControl === 0) recaudacionLote.idUsuarioControl = null;
				if (recaudacionLote.idUsuarioConciliacion === 0) recaudacionLote.idUsuarioConciliacion = null;
				const result = await this.recaudacionLoteRepository.modify(id, recaudacionLote);
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

	async modifyControl(idUsuario: number, id: number, importeNeto: number) {
		const resultTransaction = this.recaudacionLoteRepository.onTransaction( async () => { 
			return new Promise( async (resolve, reject) => {
				try {
					if (!isValidFloat(importeNeto, true)) {
						reject(new ValidationError('Existen campos incompletos'));
						return;
					}

					const configMunicipioCodigo = await this.configuracionService.findByNombre("MunicipioCodigo") as Configuracion;
					if (!configMunicipioCodigo) {
						reject(new ValidationError('No se pudo obtener el código del municipio'));
						return;
					}
					const municipioCodigo = configMunicipioCodigo.valor;

					const today = getDateNow(true);
					let recaudacionLote = await this.findById(id) as RecaudacionLote;
					if (!recaudacionLote) {
						reject(new ReferenceError('No existe el registro'));
						return;
					}

					//se marca el lote como controlado
					recaudacionLote.idUsuarioControl = idUsuario;
					recaudacionLote.fechaControl = today;
					recaudacionLote.importeNeto = importeNeto;

					//se realiza la conciliacion masiva
					const recaudacionesConciliacion:Recaudacion[] = await this.recaudacionService.listByLote(id) as Recaudacion[];
					for (let i=0; i<recaudacionesConciliacion.length; i++) {
						const recaudacion = recaudacionesConciliacion[i];
						if (!isValidInteger(recaudacion.numeroRecibo, false) && !isValidString(recaudacion.codigoBarras, false)
						) {
							reject(new ValidationError('Falta un identificador para el recibo (código de barras o número de recibo)'));
							return;
						}
						
						let recibo:ReciboPublicacion = null;
						//busqueda por numero de recibo predeterminado
						if (recaudacion.codigoDelegacion.length > 0 && recaudacion.numeroRecibo > 0) {
							try {
								recibo = await this.reciboPublicacionService.findByNumero(recaudacion.codigoDelegacion, recaudacion.numeroRecibo) as ReciboPublicacion;
							}
							catch(error) {
								if (error instanceof ReferenceError) {
									recibo = null;
								}
								else {
									reject(error);
									return;
								}
							}
						}
						//busqueda por identificadorFactura
						if (!recibo && recaudacion.codigoBarras.length > 0 && recaudacion.codigoBarras.substring(0,5) === municipioCodigo.padStart(5,"0")) {
							try {
								const identificadorFactura = getNumeroRecibo_IdentificadorFacturaToObject(recaudacion.codigoBarras) as IdentificadorFactura;
								if (identificadorFactura) {
									recaudacion.codigoDelegacion = identificadorFactura.codigoDelegacion;
									recaudacion.numeroRecibo = identificadorFactura.numeroRecibo;
									recibo = await this.reciboPublicacionService.findByNumero(recaudacion.codigoDelegacion, recaudacion.numeroRecibo) as ReciboPublicacion;
								}
							}
							catch(error) {
								if (error instanceof ReferenceError) {
									recibo = null;
								}
								else {
									reject(error);
									return;
								}
							}
						}
						//busqueda por codigo de barras cliente
						if (!recibo && recaudacion.codigoBarras.length > 0) {
							try {
								recibo = await this.reciboPublicacionService.findByCodigoBarrasCliente(recaudacion.codigoBarras) as ReciboPublicacion;
							}
							catch(error) {
								if (error instanceof ReferenceError) {
									recibo = null;
								}
								else {
									reject(error);
									return;
								}
							}
						}

						this.conciliarRecaudacion(idUsuario, today, recaudacion, recibo); //el proceso modifica recaudacion
						await this.recaudacionService.modify(recaudacion.id, recaudacion);
					}

					//si no hay recaudaciones sin conciliar, entonces marco el lote completo como conciliado
					if (!recaudacionesConciliacion.some(f => !f.fechaConciliacion)) {
						recaudacionLote.idUsuarioConciliacion = idUsuario;
						recaudacionLote.fechaConciliacion = today;
					}
					recaudacionLote = await this.recaudacionLoteRepository.modify(id, recaudacionLote);
					
					resolve(recaudacionLote);
				}
				catch(error) {
					reject(new ProcessError('Error procesando datos', error));
				}
			});
		});
		return resultTransaction;
	}

	async modifyConciliacionManual(idUsuario: number, idRecaudacion: number) {
		const resultTransaction = this.recaudacionLoteRepository.onTransaction( async () => { 
			return new Promise( async (resolve, reject) => {
				try {
					const today = getDateNow(true);
					let recaudacion = await this.recaudacionService.findById(idRecaudacion) as Recaudacion;
					if (!recaudacion) {
						reject(new ReferenceError('No existe el registro de recaudación'));
						return;
					}
					let recaudacionLote = await this.findById(recaudacion.idRecaudacionLote) as RecaudacionLote;
					if (!recaudacionLote) {
						reject(new ReferenceError('No existe el registro de recaudación lote'));
						return;
					}
					if (!recaudacion.idReciboPublicacion) {
						reject(new ReferenceError('La recaudación no está asociada a una publicación'));
						return;
					}

					recaudacion.idUsuarioConciliacion = idUsuario;
					recaudacion.fechaConciliacion = today;
					await this.recaudacionService.modify(recaudacion.id, recaudacion);
					
					const recaudacionesConciliacion:Recaudacion[] = await this.recaudacionService.listByLote(recaudacionLote.id) as Recaudacion[];
					//si no hay recaudaciones sin conciliar, entonces marco el lote completo como conciliado
					if (!recaudacionesConciliacion.some(f => !f.fechaConciliacion)) {
						recaudacionLote.idUsuarioConciliacion = idUsuario;
						recaudacionLote.fechaConciliacion = today;
						recaudacionLote = await this.recaudacionLoteRepository.modify(recaudacionLote.id, recaudacionLote);
					}

					resolve(recaudacion);
				}
				catch(error) {
					reject(new ProcessError('Error procesando datos', error));
				}
			});
		});
		return resultTransaction;
	}

	async modifyIngresosPublicos(token: string, idUsuario: number, idsRecaudadora: number[]) {
		return new Promise( async (resolve, reject) => {
			try {
				//genera la rendicion en tesoreria
				const lotes = await this.pagoRendicionLoteService.modifyIngresosPublicos(token, idUsuario, idsRecaudadora);
				//envia lotes a ingresos publicos
				for (let i=0; i<lotes.idsPagoRendicionLote.length; i++) {
					const idPagoRendicionLote = lotes.idsPagoRendicionLote[i];
					await this.pagoRendicionLoteService.sendLoteIngresosPublicos(token, idUsuario, idPagoRendicionLote);
				}

				resolve({idsPagoRendicionLote: lotes.idsPagoRendicionLote});
			}
			catch(error) {
				if (error instanceof MicroserviceError ||
					error instanceof ValidationError ||
					error instanceof ProcessError ||
					error instanceof ReferenceError) {
					reject(error);
				}
				else {
					reject(new ProcessError('Error procesando datos', error));
				}
			}
		});
	}

	async modifyRegistroContable(token: string, idUsuario: number, idsRecaudadora: number[]) {
		return new Promise( async (resolve, reject) => {
			try {
				//genera la rendicion en tesoreria
				const lotes = await this.registroContableLoteService.modifyRegistroContable(token, idUsuario, idsRecaudadora);
				//envia lotes a registro contable
				for (let i=0; i<lotes.idsRegistroContableLote.length; i++) {
					const idRegistroContableLote = lotes.idsRegistroContableLote[i];
					await this.registroContableLoteService.sendLoteRegistroContable(token, idUsuario, idRegistroContableLote);
				}

				resolve({idsRegistroContableLote: lotes.idsRegistroContableLote});
			}
			catch(error) {
				if (error instanceof MicroserviceError ||
					error instanceof ValidationError ||
					error instanceof ProcessError ||
					error instanceof ReferenceError) {
					reject(error);
				}
				else {
					reject(new ProcessError('Error procesando datos', error));
				}
			}
		});
	}

	async remove(id: number) {
		const resultTransaction = this.recaudacionLoteRepository.onTransaction( async () => { 
			return new Promise( async (resolve, reject) => {
				try {
					const recaudaciones = await this.recaudacionService.listByLote(id) as Recaudacion[];
					if (recaudaciones.some(f => f.idPagoRendicionLote || f.idRegistroContableLote)) {
						reject(new ValidationError('No se podrá eliminar la recaudación porque tiene rendiciones asociadas'));
						return;
					}
					await this.recaudacionService.removeByLote(id);

					// quito el el lote a los cierres de caja
					const cajaAsignaciones = await this.cajaAsignacionService.listByRecaudacionLote(id) as CajaAsignacion[];
					for (let i=0; i<cajaAsignaciones.length; i++) {
						const cajaAsignacion = cajaAsignaciones[i];
						cajaAsignacion.idRecaudacionLote = null;
						await this.cajaAsignacionService.modify(cajaAsignacion.id, cajaAsignacion);
					}

					const result = await this.recaudacionLoteRepository.remove(id);
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
		});
		return resultTransaction;
	}

	//funciones extra
	private conciliarRecaudacion(idUsuarioConciliacion:number, fechaConciliacion:Date, recaudacion:Recaudacion, recibo:ReciboPublicacion) {
		if (recibo) {
			recaudacion.idReciboPublicacion = recibo.id;
			recaudacion.codigoDelegacion = recibo.codigoDelegacion;
			recaudacion.numeroRecibo = recibo.numeroRecibo;
			recaudacion.codigoTipoTributo = recibo.codigoTipoTributo;
			recaudacion.numeroCuenta = recibo.numeroCuenta;
			recaudacion.codigoBarras = recibo.codigoBarras;
			const vencimiento = recaudacion.fechaCobro.getTime() <= recibo.fechaVencimiento1.getTime() ? 1 :
								recaudacion.fechaCobro.getTime() <= recibo.fechaVencimiento2.getTime() ? 2 : 0;
			if (vencimiento === 0) {
				recaudacion.observacion = `El recibo ${getNumeroRecibo_ObjectToIdentificador(recaudacion)} está vencido`;
			}
			else {
				const importeVencimiento = vencimiento === 1 ? recibo.importeVencimiento1 : recibo.importeVencimiento2;
				if (recaudacion.importeCobro < importeVencimiento) {
					recaudacion.observacion = `El recibo ${getNumeroRecibo_ObjectToIdentificador(recaudacion)} tiene un importe de cobro inferior`;		
				}
				else if (recaudacion.importeCobro > importeVencimiento) {
					recaudacion.observacion = `El recibo ${getNumeroRecibo_ObjectToIdentificador(recaudacion)} tiene un importe de cobro superior`;		
				}
				else { //CORRECTO
					recaudacion.idUsuarioConciliacion = idUsuarioConciliacion;
					recaudacion.fechaConciliacion = fechaConciliacion;
				}
			}
		}
		else {
			if (recaudacion.numeroRecibo > 0) {
				recaudacion.observacion = `El recibo ${getNumeroRecibo_ObjectToIdentificador(recaudacion)} no tiene una publicación asociada`;
			}
			else {
				recaudacion.observacion = `El identificador ${recaudacion.codigoBarras} no tiene una publicación asociada`;
			}
		}
	}

}
