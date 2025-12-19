import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import RegistroContableLote from '../entities/registro-contable-lote';
import IRegistroContableLoteRepository from '../repositories/registro-contable-lote-repository';
import { isValidString, isValidDate, isValidInteger, isValidFloat,  } from '../../infraestructure/sdk/utils/validator';
import ValidationError from '../../infraestructure/sdk/error/validation-error';
import ProcessError from '../../infraestructure/sdk/error/process-error';
import ReferenceError from '../../infraestructure/sdk/error/reference-error';
import { castPublicError, getDateId, getDateNow, getDateToString, precisionRound, truncateTime } from '../../infraestructure/sdk/utils/convert';
import MicroserviceError from '../../infraestructure/sdk/error/microservice-error';
import Recaudacion from '../entities/recaudacion';
import Recaudadora from '../entities/recaudadora';
import Lista from '../entities/lista';
import PublishService from './publish-service';
import RegistroContableService from './registro-contable-service';
import ReciboPublicacionService from './recibo-publicacion-service';
import RecaudacionService from './recaudacion-service';
import RecaudadoraService from './recaudadora-service';
import ListaService from './lista-service';
import ReciboPublicacion from '../entities/recibo-publicacion';
import RegistroContable from '../entities/registro-contable';
import TasaService from './tasa-service';
import SubTasaRequest from '../dto/sub-tasa-request';
import ReciboAperturaService from './recibo-apertura-service';
import ImputacionDTO from '../dto/imputacion-dto';
import CuentaContable from '../entities/cuenta-contable';
import SubTasaImputacion from '../entities/sub-tasa-imputacion';
import Jurisdiccion from '../entities/jurisdiccion';
import RecursoPorRubro from '../entities/recurso-por-rubro';
import ReciboAperturaAgrupado from '../dto/recibo-apertura-agrupado';
import { clearCache } from '../../infraestructure/sdk/utils/cache';
import config from '../../server/configuration/config';
import { ensureDirectoryExistence } from '../../infraestructure/sdk/utils/helper';

export default class RegistroContableLoteService {

	publishService: PublishService;
	registroContableLoteRepository: IRegistroContableLoteRepository;
	registroContableService: RegistroContableService;
	reciboPublicacionService: ReciboPublicacionService;
	reciboAperturaService: ReciboAperturaService;
	recaudacionService: RecaudacionService;
	recaudadoraService: RecaudadoraService;
	listaService: ListaService;
	tasaService: TasaService;

	constructor(publishService: PublishService,
				registroContableLoteRepository: IRegistroContableLoteRepository,
				registroContableService: RegistroContableService,
				reciboPublicacionService: ReciboPublicacionService,
				reciboAperturaService: ReciboAperturaService,
				recaudacionService: RecaudacionService,
				recaudadoraService: RecaudadoraService,
				listaService: ListaService,
				tasaService: TasaService
	) {
		this.publishService = publishService;
		this.registroContableLoteRepository = registroContableLoteRepository;
		this.registroContableService = registroContableService;
		this.reciboPublicacionService = reciboPublicacionService;
		this.reciboAperturaService = reciboAperturaService;
		this.recaudacionService = recaudacionService;
		this.recaudadoraService = recaudadoraService;
		this.listaService = listaService;
		this.tasaService = tasaService;
	}

	async list() {
		return new Promise( async (resolve, reject) => {
			try {
				const result = await this.registroContableLoteRepository.list();
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
				const result = await this.registroContableService.listByLote(id) as RegistroContable[];
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
				const result = await this.registroContableLoteRepository.findById(id);
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

	async add(registroContableLote: RegistroContableLote) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidString(registroContableLote.numeroLote, true) ||
					!isValidDate(registroContableLote.fechaLote, true) ||
					!isValidInteger(registroContableLote.casos, true) ||
					!isValidFloat(registroContableLote.importeTotal, true) ||
					!isValidInteger(registroContableLote.idUsuarioProceso, true) ||
					!isValidDate(registroContableLote.fechaProceso, true) ||
					!isValidDate(registroContableLote.fechaConfirmacion, false) ||
					!isValidString(registroContableLote.pathArchivoRegistroContable, true)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				registroContableLote.id = null;
				const result = await this.registroContableLoteRepository.add(registroContableLote);
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async modify(id: number, registroContableLote: RegistroContableLote) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidString(registroContableLote.numeroLote, true) ||
					!isValidDate(registroContableLote.fechaLote, true) ||
					!isValidInteger(registroContableLote.casos, true) ||
					!isValidFloat(registroContableLote.importeTotal, true) ||
					!isValidInteger(registroContableLote.idUsuarioProceso, true) ||
					!isValidDate(registroContableLote.fechaProceso, true) ||
					!isValidDate(registroContableLote.fechaConfirmacion, false) ||
					!isValidString(registroContableLote.pathArchivoRegistroContable, true)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				const result = await this.registroContableLoteRepository.modify(id, registroContableLote);
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

				let lote = await this.registroContableLoteRepository.findByLote(numeroLote) as RegistroContableLote;
				if (!lote) {
					reject(new ReferenceError('No existe el lote'));
					return;
				}

				lote.numeroLote = numeroLote;
				lote.fechaConfirmacion = fechaConfirmacion;
				lote = await this.registroContableLoteRepository.modify(lote.id, lote);
				
				resolve(lote);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async modifyRegistroContable(token: string, idUsuario: number, idsRecaudadora: number[]) {
		const resultTransaction = this.registroContableLoteRepository.onTransaction( async () => { 
			return new Promise( async (resolve, reject) => {
				try {
					if (idsRecaudadora.length === 0) {
						reject(new ValidationError('Existen campos incompletos'));
						return;
					}

					const today = getDateNow(true);
					const recaudadoras = await this.recaudadoraService.list() as Recaudadora[];
					const lugaresPago = await this.listaService.list("LugarPago") as Lista[];
					const recaudaciones = await this.recaudacionService.listRegistroContable(idsRecaudadora) as Recaudacion[];
					//recorre las recaudaciones y genera un registro de registro contable por cada recaudacion (recibo)
					const registros: Array<[RegistroContable, Recaudacion]> = [];
					for (let r=0; r<recaudaciones.length; r++) {
						const recaudacion = recaudaciones[r];
						const recaudadora = recaudadoras.find(f => f.id === recaudacion.idRecaudadora);
						const lugarPago = lugaresPago.find(f => f.id === recaudadora.idLugarPago);
						const recibo = await this.reciboPublicacionService.findById(recaudacion.idReciboPublicacion) as ReciboPublicacion;
						const aperturas = await this.reciboAperturaService.listByReciboPublicacionAgrupado(token, recibo.id, false) as ReciboAperturaAgrupado[];
						let vencimiento = (recaudacion.fechaCobro.getTime() <= recibo.fechaVencimiento1.getTime()) ? 1 :
										  (recaudacion.fechaCobro.getTime() <= recibo.fechaVencimiento2.getTime()) ? 2 : 0;
						if (vencimiento == 0) {
							// reject(new ValidationError(`El recibo ${getNumeroRecibo_ObjectToIdentificador(recibo)} está vencido`));
							// return;
							// vamos a considerar el segundo vencimiento como base
							vencimiento = 2;
						}
						const importeVencimiento = (vencimiento === 1) ? recibo.importeVencimiento1 : recibo.importeVencimiento2;
						const coeficientePago = (recaudacion.importeCobro !== importeVencimiento) ? precisionRound(recaudacion.importeCobro / importeVencimiento,5) : 1;

						for (let a=0; a<aperturas.length; a++) {
							const apertura = aperturas[a];
							const imputacionDto = await this.tasaService.listSubTasaImputacion(token, [new SubTasaRequest(apertura.periodo, apertura.codigoTasa, apertura.codigoSubTasa)]) as ImputacionDTO;
							if (imputacionDto.relaciones.length === 0 || imputacionDto.relaciones.length > 1) {
								reject(new ValidationError(`La imputación contable de la tasa ${apertura.codigoTasa}/${apertura.codigoSubTasa} del ejercicio ${apertura.periodo} está mal definida`));
								return;
							}
							const relacion = imputacionDto.relaciones[0];
							const imputacion = relacion.imputacion as SubTasaImputacion;
							const cuentaContable = imputacion.idCuentaContable??0 > 0 ? imputacionDto.definicionesCuentaContable.find(f => f.id === imputacion.idCuentaContable) as CuentaContable : null;
							const jurisdiccion = imputacion.idJurisdiccionActual??0 > 0 ? imputacionDto.definicionesJurisdiccion.find(f => f.id === imputacion.idJurisdiccionActual) as Jurisdiccion : null;
							const recursoPorRubro = imputacion.idRecursoPorRubroActual??0 > 0 ? imputacionDto.definicionesRecursoPorRubro.find(f => f.id === imputacion.idRecursoPorRubroActual) as RecursoPorRubro : null;
							const importeApertura = (vencimiento === 1) ? apertura.importe1 : apertura.importe2;

							const registro = new RegistroContable();
							registro.idRecaudacion = recaudacion.id;
							registro.fechaIngreso = truncateTime(today);
							registro.codigoLugarPago = lugarPago.codigo;
							registro.ejercicio = apertura.periodo;
							registro.importe = (coeficientePago === 1) ? importeApertura : precisionRound(importeApertura*coeficientePago,2);

							registro.cuentaContable = cuentaContable ? `${cuentaContable.codigo} - ${cuentaContable.nombre}` : "";
							registro.jurisdiccion = jurisdiccion ? `${jurisdiccion.agrupamiento} - ${jurisdiccion.nombre}` : "";
							registro.recursoPorRubro = recursoPorRubro ? `${recursoPorRubro.agrupamiento} - ${recursoPorRubro.nombre}` : "";
							registro.codigoFormaPago = imputacion.codigoFormaPago;
							registro.codigoTipoRecuadacion = imputacion.codigoTipoRecaudacion;

							registros.push([registro, recaudacion]);
						}
					}

					//genera un SOLO lote de registro contable, ingresando su cabecera y detalle
					let importeTotal = 0;
					for (let r=0; r<registros.length; r++) {
						const registro = registros[r][0];
						importeTotal += registro.importe;
					}
					importeTotal = precisionRound(importeTotal,2);

					let registroContableLote = new RegistroContableLote();
					registroContableLote.numeroLote = uuidv4();
					registroContableLote.fechaLote = today;
					registroContableLote.casos = registros.length;
					registroContableLote.importeTotal = importeTotal;
					registroContableLote.idUsuarioProceso = idUsuario;
					registroContableLote.fechaProceso = today;
					registroContableLote.fechaConfirmacion = null;
					registroContableLote.pathArchivoRegistroContable = `registro-contable-lote-${registroContableLote.numeroLote}.txt`;
					registroContableLote = await this.add(registroContableLote) as RegistroContableLote;

					for (let r=0; r<registros.length; r++) {
						const registro = registros[r][0];
						const recaudacion = registros[r][1];
						registro.idRegistroContableLote = registroContableLote.id;
						recaudacion.idRegistroContableLote = registroContableLote.id;
						await this.registroContableService.add(registro);
						await this.recaudacionService.modify(recaudacion.id, recaudacion);
					}

					await clearCache();

					resolve({idsRegistroContableLote: [registroContableLote.id]}); //en este proceso se decide realizar un lote unificado
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

	async sendLoteRegistroContable(token: string, idUsuario: number, idRegistroContableLote: number) {
		return new Promise( async (resolve, reject) => {		   
			try {
				const lote = await this.registroContableLoteRepository.findById(idRegistroContableLote) as RegistroContableLote;
				const registros = await this.registroContableService.listByLote(idRegistroContableLote) as RegistroContable[];

				//se quitan las descripciones
				registros.forEach(registro => {
					registro.cuentaContable = registro.cuentaContable.split('-')[0].trim();
					registro.jurisdiccion = registro.jurisdiccion.split('-')[0].trim();
					registro.recursoPorRubro = registro.recursoPorRubro.split('-')[0].trim();
				});

				const sortConceptos = (a:RegistroContable,b:RegistroContable) => 
				(a.cuentaContable !== b.cuentaContable) ? a.cuentaContable.localeCompare(b.cuentaContable) :
					(a.jurisdiccion !== b.jurisdiccion) ? a.jurisdiccion.localeCompare(b.jurisdiccion) :
						(a.recursoPorRubro !== b.recursoPorRubro) ? a.recursoPorRubro.localeCompare(b.recursoPorRubro) :
							(a.ejercicio !== b.ejercicio) ? a.ejercicio.localeCompare(b.ejercicio) :
								(a.codigoLugarPago !== b.codigoLugarPago) ? a.codigoLugarPago.localeCompare(b.codigoLugarPago) :
									(a.codigoFormaPago !== b.codigoFormaPago) ? a.codigoFormaPago.localeCompare(b.codigoFormaPago) :
										a.codigoTipoRecuadacion.localeCompare(b.codigoTipoRecuadacion);
				registros.sort(sortConceptos);

				let importe = 0;
				const registrosAgrupado:RegistroContable[] = [];
				for (let i=0; i<registros.length; i++) {
					const registro = registros[i];
					importe += registro.importe;

					if (i === (registros.length - 1) || //ultimo
						importe + registros[i+1].importe > 99999999.99 || //si el proximo superaria el valor maximo del formato permitido
						registros[i].cuentaContable !== registros[i+1].cuentaContable ||
						registros[i].jurisdiccion !== registros[i+1].jurisdiccion ||
						registros[i].recursoPorRubro !== registros[i+1].recursoPorRubro ||
						registros[i].ejercicio !== registros[i+1].ejercicio ||
						registros[i].codigoLugarPago !== registros[i+1].codigoLugarPago ||
						registros[i].codigoFormaPago !== registros[i+1].codigoFormaPago ||
						registros[i].codigoTipoRecuadacion !== registros[i+1].codigoTipoRecuadacion)
					{
						const registroAgrupado = new RegistroContable();
						registroAgrupado.setFromObject(registro);
						registroAgrupado.importe = precisionRound(importe,2);
						registrosAgrupado.push(registroAgrupado);
						importe = 0;
					}
				}

				const parseDecimalToReport =(value: number) => {
					return parseInt(value.toString()).toString() + '.' + Math.round((value - Math.trunc(value)) * 100).toString().padStart(2,'0');
				}

				let content = '';
				for (let i=0; i<registrosAgrupado.length; i++) {
					const registroAgrupado = registrosAgrupado[i];
					if (registroAgrupado.importe.toString().length > 10) {
						reject(new ValidationError('La longitud del importe supera el máximo de caracteres permitido por la definición del formato del archivo'));
						return;
					}

					const jurisdiccionSinPuntos = (registroAgrupado.jurisdiccion.trim().length > 0) ? registroAgrupado.jurisdiccion.replace(/\./g,'').padEnd(10,'0') : '          ';
					const recursoPorRubroSinPuntos = (registroAgrupado.recursoPorRubro.trim().length > 0) ? registroAgrupado.recursoPorRubro.replace(/\./g,'').padEnd(7,'0') : '       ';
					const row = getDateToString(registroAgrupado.fechaIngreso) +
								jurisdiccionSinPuntos +
								registroAgrupado.codigoLugarPago.padStart(5,' ') +
								registroAgrupado.ejercicio +
								registroAgrupado.codigoTipoRecuadacion.substring(0,1) +
								recursoPorRubroSinPuntos.substring(0,2) +
								recursoPorRubroSinPuntos.substring(2,3) +
								recursoPorRubroSinPuntos.substring(3,4).replace('0',' ') +
								recursoPorRubroSinPuntos.substring(4,5) +
								recursoPorRubroSinPuntos.substring(5,6).replace('0',' ') +
								recursoPorRubroSinPuntos.substring(6,7) +
								registroAgrupado.cuentaContable.padStart(5,' ') +
								registroAgrupado.codigoFormaPago.substring(0,1) +
								parseDecimalToReport(registroAgrupado.importe).padStart(10,' ');
					content += `${row}\n`;
				}

				const folderPath = `${config.PATH.REGISTRO_CONTABLE}registro-contable-lote-${lote.numeroLote}.txt`;
				ensureDirectoryExistence(folderPath);
				await fs.writeFileSync(folderPath, content);

				resolve({result: true});
			}
			catch (error) {
				const origen = "laramie-tesoreria-webapi/RegistroContableLoteService/sendLoteIngresosPublicos";
				const data = {
					token: token,
					idTipoAlerta: 32, //Cuenta Corriente
					idUsuario: idUsuario,
					fecha: getDateNow(true),
					idModulo: 35,
					origen: origen,
					mensaje: "Error Registro Contable - Envío de Lote",
					data: {
						idRegistroContableLote: idRegistroContableLote,
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
				const result = await this.registroContableLoteRepository.remove(id);
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
