import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import container from '../../infraestructure/ioc/dependency-injection';

import ConfiguracionService from './configuracion-service';
import IEmisionAprobacionRepository from '../repositories/emision-aprobacion-repository';
import IEmisionEjecucionRepository from '../repositories/emision-ejecucion-repository';
import IEmisionEjecucionCuentaRepository from '../repositories/emision-ejecucion-cuenta-repository';
import ProcesoService from './proceso-service';
import ReportEmisionAprobacionCalculo from './reports/report-emision-aprobacion-calculo';
import ReportEmisionAprobacionOrdenamiento from './reports/report-emision-aprobacion-ordenamiento';
import ReportEmisionAprobacionControlRecibos from './reports/report-emision-aprobacion-control-recibos';
import ReportEmisionRecibos from './reports/report-emision-recibos';
import ArchivoService from './archivo-service';

import Configuracion from '../entities/configuracion';
import EmisionAprobacion from '../entities/emision-aprobacion';
import EmisionEjecucion from '../entities/emision-ejecucion';
import EmisionEjecucionCuenta from '../entities/emision-ejecucion-cuenta';
import Proceso from '../entities/proceso';
import Archivo from '../entities/archivo';
import CodigoBarrasExecute from './process/codigo-barras/codigo-barras-execute';
import CuentaCorrienteExecute from './process/cuenta-corriente/cuenta-corriente-execute';
import OrdenamientoExecute from './process/ordenamiento/ordenamiento-execute';
import SorterCuenta from './process/ordenamiento/sorter-cuenta';
import SorterNomenclatura from './process/ordenamiento/sorter-nomenclatura';
import SorterDomicilio from './process/ordenamiento/sorter-domicilio';
import SorterDomicilioParImpar from './process/ordenamiento/sorter-domicilio-par-impar';
import SorterControladorDomicilio from './process/ordenamiento/sorter-controlador-domicilio';
import SorterControladorDomicilioParImpar from './process/ordenamiento/sorter-controlador-domicilio-par-impar';

import { isValidInteger, isValidDate,  } from '../../infraestructure/sdk/utils/validator';
import ValidationError from '../../infraestructure/sdk/error/validation-error';
import ProcessError from '../../infraestructure/sdk/error/process-error';
import ReferenceError from '../../infraestructure/sdk/error/reference-error';
import config from '../../server/configuration/config';
import { getDateId, getDateNow } from '../../infraestructure/sdk/utils/convert';
import { APROBACION_STATE } from '../../infraestructure/sdk/consts/aprobacionState';
import { EMISION_EJECUCION_STATE } from '../../infraestructure/sdk/consts/emisionEjecucionState';
import { PROCESO_STATE } from '../../infraestructure/sdk/consts/procesoState';
import { ORDENAMIENTO_GENERAL } from '../../infraestructure/sdk/consts/ordenamiento-general';
import { ensureDirectoryExistence } from '../../infraestructure/sdk/utils/helper';


export default class EmisionAprobacionService {

	configuracionService: ConfiguracionService;
	emisionAprobacionRepository: IEmisionAprobacionRepository;
	emisionEjecucionRepository: IEmisionEjecucionRepository;
	emisionEjecucionCuentaRepository: IEmisionEjecucionCuentaRepository;
	procesoService: ProcesoService;
	reportEmisionAprobacionCalculo: ReportEmisionAprobacionCalculo;
	reportEmisionAprobacionOrdenamiento: ReportEmisionAprobacionOrdenamiento;
	reportEmisionAprobacionControlRecibos: ReportEmisionAprobacionControlRecibos;
	reportEmisionRecibos: ReportEmisionRecibos;
	archivoService: ArchivoService;

	constructor(configuracionService: ConfiguracionService,
				emisionAprobacionRepository: IEmisionAprobacionRepository,
				emisionEjecucionRepository: IEmisionEjecucionRepository,
				emisionEjecucionCuentaRepository: IEmisionEjecucionCuentaRepository,
				procesoService: ProcesoService,
				reportEmisionAprobacionCalculo: ReportEmisionAprobacionCalculo,
				reportEmisionAprobacionOrdenamiento: ReportEmisionAprobacionOrdenamiento,
				reportEmisionAprobacionControlRecibos: ReportEmisionAprobacionControlRecibos,
				reportEmisionRecibos: ReportEmisionRecibos,
				archivoService: ArchivoService) {
		this.configuracionService = configuracionService;
		this.emisionAprobacionRepository = emisionAprobacionRepository;
		this.emisionEjecucionRepository = emisionEjecucionRepository;
		this.emisionEjecucionCuentaRepository = emisionEjecucionCuentaRepository;
		this.procesoService = procesoService;
		this.reportEmisionAprobacionCalculo = reportEmisionAprobacionCalculo;
		this.reportEmisionAprobacionOrdenamiento = reportEmisionAprobacionOrdenamiento;
		this.reportEmisionAprobacionControlRecibos = reportEmisionAprobacionControlRecibos;
		this.reportEmisionRecibos = reportEmisionRecibos;
		this.archivoService = archivoService;
	}

	async list() {
		return new Promise( async (resolve, reject) => {
			try {
				const result = await this.emisionAprobacionRepository.list();
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async findByEmisionEjecucion(idEmisionEjecucion: number) {
		return new Promise( async (resolve, reject) => {
			try {			   
				const result = await this.emisionAprobacionRepository.findByEmisionEjecucion(idEmisionEjecucion);
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

	async findById(id: number) {
		return new Promise( async (resolve, reject) => {
			try {			   
				const result = await this.emisionAprobacionRepository.findById(id);
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

	async add(emisionAprobacion: EmisionAprobacion) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidInteger(emisionAprobacion.idEmisionEjecucion, true) ||
					!isValidInteger(emisionAprobacion.idEstadoAprobacionCalculo, true) ||
					!isValidInteger(emisionAprobacion.idUsuarioAprobacionCalculo, false) ||
					!isValidDate(emisionAprobacion.fechaAprobacionCalculo, false) ||
					!isValidInteger(emisionAprobacion.idEstadoAprobacionOrdenamiento, true) ||
					!isValidInteger(emisionAprobacion.idUsuarioAprobacionOrdenamiento, false) ||
					!isValidDate(emisionAprobacion.fechaAprobacionOrdenamiento, false) ||
					!isValidInteger(emisionAprobacion.idEstadoAprobacionControlRecibos, true) ||
					!isValidInteger(emisionAprobacion.idUsuarioAprobacionControlRecibos, false) ||
					!isValidDate(emisionAprobacion.fechaAprobacionControlRecibos, false) ||
					!isValidInteger(emisionAprobacion.idEstadoAprobacionCodigoBarras, true) ||
					!isValidInteger(emisionAprobacion.idUsuarioAprobacionCodigoBarras, false) ||
					!isValidDate(emisionAprobacion.fechaAprobacionCodigoBarras, false) ||
					!isValidInteger(emisionAprobacion.idEstadoProcesoCuentaCorriente, true) ||
					!isValidInteger(emisionAprobacion.idUsuarioProcesoCuentaCorriente, false) ||
					!isValidDate(emisionAprobacion.fechaProcesoCuentaCorriente, false) ||
					!isValidInteger(emisionAprobacion.idEstadoProcesoImpresion, true) ||
					!isValidInteger(emisionAprobacion.idUsuarioProcesoImpresion, false) ||
					!isValidDate(emisionAprobacion.fechaProcesoImpresion, false)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				emisionAprobacion.id = null;
				const result = await this.emisionAprobacionRepository.add(emisionAprobacion);
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async modify(id: number, emisionAprobacion: EmisionAprobacion) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidInteger(emisionAprobacion.idEmisionEjecucion, true) ||
					!isValidInteger(emisionAprobacion.idEstadoAprobacionCalculo, true) ||
					!isValidInteger(emisionAprobacion.idUsuarioAprobacionCalculo, false) ||
					!isValidDate(emisionAprobacion.fechaAprobacionCalculo, false) ||
					!isValidInteger(emisionAprobacion.idEstadoAprobacionOrdenamiento, true) ||
					!isValidInteger(emisionAprobacion.idUsuarioAprobacionOrdenamiento, false) ||
					!isValidDate(emisionAprobacion.fechaAprobacionOrdenamiento, false) ||
					!isValidInteger(emisionAprobacion.idEstadoAprobacionControlRecibos, true) ||
					!isValidInteger(emisionAprobacion.idUsuarioAprobacionControlRecibos, false) ||
					!isValidDate(emisionAprobacion.fechaAprobacionControlRecibos, false) ||
					!isValidInteger(emisionAprobacion.idEstadoAprobacionCodigoBarras, true) ||
					!isValidInteger(emisionAprobacion.idUsuarioAprobacionCodigoBarras, false) ||
					!isValidDate(emisionAprobacion.fechaAprobacionCodigoBarras, false) ||
					!isValidInteger(emisionAprobacion.idEstadoProcesoCuentaCorriente, true) ||
					!isValidInteger(emisionAprobacion.idUsuarioProcesoCuentaCorriente, false) ||
					!isValidDate(emisionAprobacion.fechaProcesoCuentaCorriente, false) ||
					!isValidInteger(emisionAprobacion.idEstadoProcesoImpresion, true) ||
					!isValidInteger(emisionAprobacion.idUsuarioProcesoImpresion, false) ||
					!isValidDate(emisionAprobacion.fechaProcesoImpresion, false)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				const result = await this.emisionAprobacionRepository.modify(id, emisionAprobacion);
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

	async modifyAction(id: number, idUsuario: number, action: string) {
		const resultTransaction = this.emisionAprobacionRepository.onTransaction( async () => {
			return new Promise( async (resolve, reject) => {
				try {
					const today = getDateNow(true);
					let emisionAprobacion: EmisionAprobacion = await this.emisionAprobacionRepository.findById(id);
					if (!emisionAprobacion) {
						reject(new ReferenceError('No existe el registro'));
						return;
					}

					switch(action) {
						case "EmisionAprobacionCalculo": {
							const { buffer, fileExtension } = await this.reportEmisionAprobacionCalculo.generateReport(emisionAprobacion.idEmisionEjecucion);
							const path = uuidv4();
							const pathFile = `${config.PATH.TEMP}${path}`;
							ensureDirectoryExistence(pathFile);
							await fs.writeFileSync(pathFile, buffer);

							const archivo = new Archivo(
								null,
								"EmisionEjecucion",
								emisionAprobacion.idEmisionEjecucion,
								`EmisionAprobacionCalculo.${fileExtension}`,
								path,
								"Informe de Cálculo"
							);
							await this.archivoService.add(idUsuario, archivo);
							break;
						}
						case "AprobacionCalculo": {
							if (emisionAprobacion.idEstadoAprobacionCalculo !== APROBACION_STATE.PENDIENTE) {
								reject(new ReferenceError('Estado incorrecto'));
								return;
							}

							emisionAprobacion.idEstadoAprobacionCalculo = APROBACION_STATE.APROBADO;
							emisionAprobacion.idUsuarioAprobacionCalculo = idUsuario;
							emisionAprobacion.fechaAprobacionCalculo = today;

							const emisionEjecucion = await this.emisionEjecucionRepository.findById(emisionAprobacion.idEmisionEjecucion) as EmisionEjecucion;
							if (!emisionEjecucion) {
								reject(new ReferenceError('No existe el registro'));
								return;
							}
							if (emisionEjecucion.calculoPrueba) {
								reject(new ReferenceError('Un cálculo de prueba no puede ser aprobado'));
								return;
							}
							//si no imprimer recibos, entonces todas las etapas se dan por aprobadas
							if (!emisionEjecucion.imprimeRecibosEmision) {
								emisionAprobacion.idEstadoAprobacionOrdenamiento = APROBACION_STATE.APROBADO;
								emisionAprobacion.idUsuarioAprobacionOrdenamiento = idUsuario;
								emisionAprobacion.fechaAprobacionOrdenamiento = today;
								emisionAprobacion.idEstadoAprobacionControlRecibos = APROBACION_STATE.APROBADO;
								emisionAprobacion.idUsuarioAprobacionControlRecibos = idUsuario;
								emisionAprobacion.fechaAprobacionControlRecibos = today;
								emisionAprobacion.idEstadoAprobacionCodigoBarras = APROBACION_STATE.APROBADO;
								emisionAprobacion.idUsuarioAprobacionCodigoBarras = idUsuario;
								emisionAprobacion.fechaAprobacionCodigoBarras = today;
							}
							//si es calculo mostrador/web, entonces el proceso de cuenta corriente no requiere aprobacion
							if (emisionEjecucion.calculoMostradorWeb) {
								emisionAprobacion.idEstadoProcesoCuentaCorriente = PROCESO_STATE.FINALIZADO;
								emisionAprobacion.idUsuarioProcesoCuentaCorriente = idUsuario;
								emisionAprobacion.fechaProcesoCuentaCorriente = today;
								await this.modifyCuentaCorriente(idUsuario, emisionAprobacion.idEmisionEjecucion);
							}
							break;
						}
						case "ProcesoOrdenamiento": {
							if (emisionAprobacion.idEstadoAprobacionCalculo !== APROBACION_STATE.APROBADO || emisionAprobacion.idEstadoAprobacionOrdenamiento !== APROBACION_STATE.PENDIENTE) {
								reject(new ReferenceError('Estado incorrecto'));
								return;
							}

							await this.modifyOrdenamiento(emisionAprobacion.idEmisionEjecucion);

							break;
						}
						case "EmisionAprobacionOrdenamiento": {
							if (emisionAprobacion.idEstadoAprobacionCalculo !== APROBACION_STATE.APROBADO) {
								reject(new ReferenceError('Estado incorrecto'));
								return;
							}
							
							const { buffer, fileExtension } = await this.reportEmisionAprobacionOrdenamiento.generateReport(emisionAprobacion.idEmisionEjecucion);
							const path = uuidv4();
							const pathFile = `${config.PATH.TEMP}${path}`;
							ensureDirectoryExistence(pathFile);
							await fs.writeFileSync(pathFile, buffer);

							const archivo = new Archivo(
								null,
								"EmisionEjecucion",
								emisionAprobacion.idEmisionEjecucion,
								`EmisionAprobacionOrdenamiento.${fileExtension}`,
								path,
								"Informe de Ordenamiento"
							);
							await this.archivoService.add(idUsuario, archivo);
							break;
						}
						case "AprobacionOrdenamiento": {
							if (emisionAprobacion.idEstadoAprobacionCalculo !== APROBACION_STATE.APROBADO || emisionAprobacion.idEstadoAprobacionOrdenamiento !== APROBACION_STATE.PENDIENTE) {
								reject(new ReferenceError('Estado incorrecto'));
								return;
							}
							
							emisionAprobacion.idEstadoAprobacionOrdenamiento = APROBACION_STATE.APROBADO;
							emisionAprobacion.idUsuarioAprobacionOrdenamiento = idUsuario;
							emisionAprobacion.fechaAprobacionOrdenamiento = today;
							break;
						}
						case "AprobacionControlRecibos": {
							if (emisionAprobacion.idEstadoAprobacionOrdenamiento !== APROBACION_STATE.APROBADO || emisionAprobacion.idEstadoAprobacionControlRecibos !== APROBACION_STATE.PENDIENTE) {
								reject(new ReferenceError('Estado incorrecto'));
								return;
							}

							emisionAprobacion.idEstadoAprobacionControlRecibos = APROBACION_STATE.APROBADO;
							emisionAprobacion.idUsuarioAprobacionControlRecibos = idUsuario;
							emisionAprobacion.fechaAprobacionControlRecibos = today;
							break;
						}
						case "AprobacionCodigoBarras": {
							if (emisionAprobacion.idEstadoAprobacionControlRecibos !== APROBACION_STATE.APROBADO || emisionAprobacion.idEstadoAprobacionCodigoBarras !== APROBACION_STATE.PENDIENTE) {
								reject(new ReferenceError('Estado incorrecto'));
								return;
							}

							await this.modifyCodigoBarras(emisionAprobacion.idEmisionEjecucion);

							emisionAprobacion.idEstadoAprobacionCodigoBarras = APROBACION_STATE.APROBADO;
							emisionAprobacion.idUsuarioAprobacionCodigoBarras = idUsuario;
							emisionAprobacion.fechaAprobacionCodigoBarras = today;
							break;
						}
						case "ProcesoCuentaCorriente": {
							if (emisionAprobacion.idEstadoAprobacionCodigoBarras !== APROBACION_STATE.APROBADO || emisionAprobacion.idEstadoProcesoCuentaCorriente !== PROCESO_STATE.PENDIENTE) {
								reject(new ReferenceError('Estado incorrecto'));
								return;
							}

							await this.modifyCuentaCorriente(idUsuario, emisionAprobacion.idEmisionEjecucion);

							emisionAprobacion.idEstadoProcesoCuentaCorriente = PROCESO_STATE.FINALIZADO;
							emisionAprobacion.idUsuarioProcesoCuentaCorriente = idUsuario;
							emisionAprobacion.fechaProcesoCuentaCorriente = today;
							break;
						}
						case "ProcesoImpresion": {
							if (emisionAprobacion.idEstadoProcesoCuentaCorriente !== PROCESO_STATE.FINALIZADO) {
								reject(new ReferenceError('Estado incorrecto'));
								return;
							}

							await this.modifyImpresion(idUsuario, emisionAprobacion.idEmisionEjecucion);

							emisionAprobacion.idEstadoProcesoImpresion = PROCESO_STATE.FINALIZADO;
							emisionAprobacion.idUsuarioProcesoImpresion = idUsuario;
							emisionAprobacion.fechaProcesoImpresion = today;
							break;
						}
						default: {
							reject(new ReferenceError('Acción no reconocida'));
							return;
						}
					}

					emisionAprobacion = await this.emisionAprobacionRepository.modify(id, emisionAprobacion);
					resolve(emisionAprobacion);
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

	async modifyActionAsync(id: number, idUsuario: number, action: string, fechaProceso: Date) {
		const resultTransaction = this.emisionAprobacionRepository.onTransaction( async () => {
			return new Promise( async (resolve, reject) => {
				try {
					let emisionAprobacion: EmisionAprobacion = await this.emisionAprobacionRepository.findById(id);
					if (!emisionAprobacion) {
						reject(new ReferenceError('No existe el registro'));
						return;
					}
					const procesos = await this.procesoService.listByEntidad(`${action}:${id}`) as Array<Proceso>;
					if (procesos.filter(f => [PROCESO_STATE.PENDIENTE, PROCESO_STATE.PROGRESO].includes(f.idEstadoProceso)).length > 0) {
						reject(new ReferenceError('Ya existe un proceso pendiente o en proceso'));
						return;
					}
					if (procesos.filter(f => [PROCESO_STATE.FINALIZADO].includes(f.idEstadoProceso)).length > 0 && !["EmisionAprobacionCalculo", "EmisionAprobacionOrdenamiento", "ProcesoOrdenamiento", "ProcesoImpresion"].includes(action)) {
						reject(new ReferenceError('Ya existe un proceso finalizado'));
						return;
					}

					let proceso: Proceso = null;
					switch(action) {
						case "EmisionAprobacionCalculo": {
							proceso = new Proceso(
								null,
								uuidv4(),
								`EmisionAprobacionCalculo:${emisionAprobacion.idEmisionEjecucion}`,
								null,
								PROCESO_STATE.PENDIENTE,
								fechaProceso,
								null,
								null,
								"Emisión de Informe de Cálculo",
								"",
								0,
								"emision-aprobacion-service",
								idUsuario,
								getDateNow(true),
								`PUT|${config.DOMAIN}:${config.PORT}/api/emision-aprobacion|/${id}/EmisionAprobacionCalculo`
							);
							break;
						}
						case "ProcesoOrdenamiento": {
							if (emisionAprobacion.idEstadoAprobacionCalculo !== APROBACION_STATE.APROBADO || emisionAprobacion.idEstadoAprobacionOrdenamiento !== APROBACION_STATE.PENDIENTE) {
								reject(new ReferenceError('Estado incorrecto'));
								return;
							}
							
							proceso = new Proceso(
								null,
								uuidv4(),
								`ProcesoOrdenamiento:${emisionAprobacion.idEmisionEjecucion}`,
								null,
								PROCESO_STATE.PENDIENTE,
								fechaProceso,
								null,
								null,
								"Proceso de Ordenamiento",
								"",
								0,
								"emision-aprobacion-service",
								idUsuario,
								getDateNow(true),
								`PUT|${config.DOMAIN}:${config.PORT}/api/emision-aprobacion|/${id}/ProcesoOrdenamiento`
							);
							break;
						}
						case "EmisionAprobacionOrdenamiento": {
							if (emisionAprobacion.idEstadoAprobacionCalculo !== APROBACION_STATE.APROBADO) {
								reject(new ReferenceError('Estado incorrecto'));
								return;
							}

							proceso = new Proceso(
								null,
								uuidv4(),
								`EmisionAprobacionOrdenamiento:${emisionAprobacion.idEmisionEjecucion}`,
								null,
								PROCESO_STATE.PENDIENTE,
								fechaProceso,
								null,
								null,
								"Emisión de Informe de Ordenamiento",
								"",
								0,
								"emision-aprobacion-service",
								idUsuario,
								getDateNow(true),
								`PUT|${config.DOMAIN}:${config.PORT}/api/emision-aprobacion|/${id}/EmisionAprobacionOrdenamiento`
							);
							break;	
						}
						case "AprobacionCodigoBarras": {
							if (emisionAprobacion.idEstadoAprobacionControlRecibos !== APROBACION_STATE.APROBADO || emisionAprobacion.idEstadoAprobacionCodigoBarras !== APROBACION_STATE.PENDIENTE) {
								reject(new ReferenceError('Estado incorrecto'));
								return;
							}

							proceso = new Proceso(
								null,
								uuidv4(),
								`AprobacionCodigoBarras:${emisionAprobacion.idEmisionEjecucion}`,
								null,
								PROCESO_STATE.PENDIENTE,
								fechaProceso,
								null,
								null,
								"Aprobación de Código de Barras",
								"",
								0,
								"emision-aprobacion-service",
								idUsuario,
								getDateNow(true),
								`PUT|${config.DOMAIN}:${config.PORT}/api/emision-aprobacion|/${id}/AprobacionCodigoBarras`
							);
							break;
						}
						case "ProcesoCuentaCorriente": {
							if (emisionAprobacion.idEstadoAprobacionCodigoBarras !== APROBACION_STATE.APROBADO || emisionAprobacion.idEstadoProcesoCuentaCorriente !== PROCESO_STATE.PENDIENTE) {
								reject(new ReferenceError('Estado incorrecto'));
								return;
							}

							proceso = new Proceso(
								null,
								uuidv4(),
								`ProcesoCuentaCorriente:${emisionAprobacion.idEmisionEjecucion}`,
								null,
								PROCESO_STATE.PENDIENTE,
								fechaProceso,
								null,
								null,
								"Proceso de Cuenta Corriente",
								"",
								0,
								"emision-aprobacion-service",
								idUsuario,
								getDateNow(true),
								`PUT|${config.DOMAIN}:${config.PORT}/api/emision-aprobacion|/${id}/ProcesoCuentaCorriente`
							);
							break;
						}
						case "ProcesoImpresion": {
							if (emisionAprobacion.idEstadoProcesoCuentaCorriente !== PROCESO_STATE.FINALIZADO) {
								reject(new ReferenceError('Estado incorrecto'));
								return;
							}

							proceso = new Proceso(
								null,
								uuidv4(),
								`ProcesoImpresion:${emisionAprobacion.idEmisionEjecucion}`,
								null,
								PROCESO_STATE.PENDIENTE,
								fechaProceso,
								null,
								null,
								"Proceso de Impresión",
								"",
								0,
								"emision-aprobacion-service",
								idUsuario,
								getDateNow(true),
								`PUT|${config.DOMAIN}:${config.PORT}/api/emision-aprobacion|/${id}/ProcesoImpresion`
							);
							break;
						}
						default: {
							reject(new ReferenceError('Acción no reconocida'));
							return;
						}
					}

					await this.procesoService.add(proceso);
					resolve({identificador: proceso.identificador});
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

	async remove(id: number) {
		return new Promise( async (resolve, reject) => {
			try {
				const result = await this.emisionAprobacionRepository.remove(id);
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

	async removeByEmisionEjecucion(idEmisionEjecucion: number) {
		return new Promise( async (resolve, reject) => {
			try {
				const result = await this.emisionAprobacionRepository.removeByEmisionEjecucion(idEmisionEjecucion);
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


	async modifyOrdenamiento(idEmisionEjecucion: number) {
		return new Promise( async (resolve, reject) => {
			try {
				const emisionEjecucion = await this.emisionEjecucionRepository.findById(idEmisionEjecucion) as EmisionEjecucion;
				if (!emisionEjecucion) {
					reject(new ReferenceError('No existe el registro'));
					return;
				}
				if (emisionEjecucion.idEstadoEmisionEjecucion !== EMISION_EJECUCION_STATE.FINALIZADA) {
					reject(new ValidationError('Estado incorrecto'));
					return;
				}

				const emisionAprobacion = await this.findByEmisionEjecucion(idEmisionEjecucion) as EmisionAprobacion;
				if (!emisionAprobacion) {
					reject(new ReferenceError('No existe el registro'));
					return;
				}
				if (emisionAprobacion.idEstadoAprobacionCalculo !== APROBACION_STATE.APROBADO) {
					reject(new ValidationError('Estado de proceso de cálculo incorrecto para esta acción'));
					return;
				}
				if (emisionAprobacion.idEstadoAprobacionOrdenamiento !== APROBACION_STATE.PENDIENTE) {
					reject(new ValidationError('Estado de proceso de ordenamiento incorrecto para esta acción'));
					return;
				}

				let sorter = null;
				const ordenamientoGeneral:string = (await this.configuracionService.findByNombre("OrdenamientoGeneral") as Configuracion).valor;
				switch(parseInt(ordenamientoGeneral))
				{
					case ORDENAMIENTO_GENERAL.CUENTA: {
						sorter = new SorterCuenta();
						break;
					}
					case ORDENAMIENTO_GENERAL.NOMENCLATURA: {
						sorter = new SorterNomenclatura();
						break;
					}
					case ORDENAMIENTO_GENERAL.DOMICILIO: {
						sorter = new SorterDomicilio();
						break;
					}
					case ORDENAMIENTO_GENERAL.DOMICILIO_PAR_IMPAR: {
						sorter = new SorterDomicilioParImpar();
						break;
					}
					case ORDENAMIENTO_GENERAL.CONTROLADOR_DOMICILIO: {
						sorter = new SorterControladorDomicilio();
						break;
					}
					case ORDENAMIENTO_GENERAL.CONTROLADOR_DOMICILIO_PAR_IMPAR: {
						sorter = new SorterControladorDomicilioParImpar();
						break;
					}
					default: {
						reject(new ValidationError('Criterio de ordenamiento indefinido'));
						return;
					}
				}

				const ordenamientoExecute = container.resolve("ordenamientoExecute") as OrdenamientoExecute;		
				await ordenamientoExecute.execute(idEmisionEjecucion, sorter);

				resolve(emisionAprobacion);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async modifyCodigoBarras(idEmisionEjecucion: number) {
		return new Promise( async (resolve, reject) => {
			try {
				const emisionEjecucion = await this.emisionEjecucionRepository.findById(idEmisionEjecucion) as EmisionEjecucion;
				if (!emisionEjecucion) {
					reject(new ReferenceError('No existe el registro'));
					return;
				}
				if (emisionEjecucion.idEstadoEmisionEjecucion !== EMISION_EJECUCION_STATE.FINALIZADA) {
					reject(new ValidationError('Estado incorrecto'));
					return;
				}

				const emisionAprobacion = await this.findByEmisionEjecucion(idEmisionEjecucion) as EmisionAprobacion;
				if (!emisionAprobacion) {
					reject(new ReferenceError('No existe el registro'));
					return;
				}
				if (emisionAprobacion.idEstadoAprobacionControlRecibos !== APROBACION_STATE.APROBADO) {
					reject(new ValidationError('Estado de proceso de ordenamiento incorrecto para esta acción'));
					return;
				}
				if (emisionAprobacion.idEstadoAprobacionCodigoBarras !== APROBACION_STATE.PENDIENTE) {
					reject(new ValidationError('Estado de proceso de códigos de barras incorrecto para esta acción'));
					return;
				}

				const codigoBarrasExecute = container.resolve("codigoBarrasExecute") as CodigoBarrasExecute;		
				await codigoBarrasExecute.execute(idEmisionEjecucion);

				resolve(emisionAprobacion);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async modifyCuentaCorriente(idUsuario: number, idEmisionEjecucion: number) {
		return new Promise( async (resolve, reject) => {
			try {
				const emisionEjecucion = await this.emisionEjecucionRepository.findById(idEmisionEjecucion) as EmisionEjecucion;
				if (!emisionEjecucion) {
					reject(new ReferenceError('No existe el registro'));
					return;
				}
				if (emisionEjecucion.idEstadoEmisionEjecucion !== EMISION_EJECUCION_STATE.FINALIZADA) {
					reject(new ValidationError('Estado incorrecto'));
					return;
				}

				const emisionAprobacion = await this.findByEmisionEjecucion(idEmisionEjecucion) as EmisionAprobacion;
				if (!emisionAprobacion) {
					reject(new ReferenceError('No existe el registro'));
					return;
				}
				if (emisionAprobacion.idEstadoProcesoCuentaCorriente !== PROCESO_STATE.PENDIENTE) {
					reject(new ValidationError('Estado de proceso de cuenta corriente incorrecto para esta acción'));
					return;
				}

				const cuentaCorrienteExecute = container.resolve("cuentaCorrienteExecute") as CuentaCorrienteExecute;		
				await cuentaCorrienteExecute.execute(idUsuario, idEmisionEjecucion);

				resolve(emisionAprobacion);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async modifyImpresion(idUsuario: number, idEmisionEjecucion: number) {
		return new Promise( async (resolve, reject) => {
			try {
				const emisionEjecucion = await this.emisionEjecucionRepository.findById(idEmisionEjecucion) as EmisionEjecucion;
				if (!emisionEjecucion) {
					reject(new ReferenceError('No existe el registro'));
					return;
				}

				const path = getDateId();

				const emisionEjecucionCuentas = (await this.emisionEjecucionCuentaRepository.listByEmisionEjecucion(idEmisionEjecucion) as Array<EmisionEjecucionCuenta>).sort((a,b) => a.numero-b.numero);
				for (let i=0; i < emisionEjecucionCuentas.length; i++) {
					const emisionEjecucionCuenta = emisionEjecucionCuentas[i];

					let buffer = await this.reportEmisionRecibos.generateReport(idEmisionEjecucion, emisionEjecucionCuenta.idCuenta) as Buffer;
					
					const pathFile = `${config.PATH.DOCS}impresion-recibos-${path}${config.PATH.PATH_SEPARATOR}recibo-${i}.pdf`;
					ensureDirectoryExistence(pathFile);
					await fs.writeFileSync(pathFile, buffer);
				}

				resolve(emisionEjecucion);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

}
