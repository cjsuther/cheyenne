import { v4 as uuidv4 } from 'uuid';
import Proceso from '../entities/proceso';
import IProcesoRepository from '../repositories/proceso-repository';
import IEmisionAprobacionRepository from '../repositories/emision-aprobacion-repository';
import { isValidString, isValidInteger, isValidDate, isValidNumber, isValidFloat, isValidKey,  } from '../../infraestructure/sdk/utils/validator';
import ValidationError from '../../infraestructure/sdk/error/validation-error';
import ProcessError from '../../infraestructure/sdk/error/process-error';
import ReferenceError from '../../infraestructure/sdk/error/reference-error';
import { PROCESO_STATE } from '../../infraestructure/sdk/consts/procesoState';
import { SendRequest } from '../../infraestructure/sdk/utils/request';
import { getDateNow } from '../../infraestructure/sdk/utils/convert';
import EmisionAprobacion from '../entities/emision-aprobacion';
import IProcesoProgramacionRepository from '../repositories/proceso-programacion-repository';
import ProcesoProgramacion from '../entities/proceso-programacion';
import { PROCESO_PROGRAMMATION_TYPE } from '../../infraestructure/sdk/consts/procesoProgrammationType';
import { GetLastDayMonth } from '../../infraestructure/sdk/utils/helper';
import { UUIDV4 } from 'sequelize';

export default class ProcesoService {

	procesoRepository: IProcesoRepository;
	procesoProgramacionRepository: IProcesoProgramacionRepository;
	emisionAprobacionRepository: IEmisionAprobacionRepository;

	constructor(procesoRepository: IProcesoRepository,
				procesoProgramacionRepository: IProcesoProgramacionRepository,
				emisionAprobacionRepository: IEmisionAprobacionRepository) {
		this.procesoRepository = procesoRepository;
		this.procesoProgramacionRepository = procesoProgramacionRepository;
		this.emisionAprobacionRepository = emisionAprobacionRepository;
		
	}

	async list() {
		return new Promise( async (resolve, reject) => {
			try {
				const result = await this.procesoRepository.list();
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async listByEntidad(entidad: string) {
		return new Promise( async (resolve, reject) => {
			try {
				const result = await this.procesoRepository.listByEntidad(entidad);
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async listByEstadoProceso(idEstadoProceso: number) {
		return new Promise( async (resolve, reject) => {
			try {
				const result = await this.procesoRepository.listByEstadoProceso(idEstadoProceso);
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async listReady() {
		return new Promise( async (resolve, reject) => {
			try {
				const result = await this.procesoRepository.listReady();
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async listByEmisionEjecucion(idEmisionEjecucion: number) {
		return new Promise( async (resolve, reject) => {
			try {
				let requests = [];
				requests.push(this.procesoRepository.listByEntidad(`EmisionEjecucion:${idEmisionEjecucion}`));
				requests.push(this.procesoRepository.listByEntidad(`EmisionAprobacionCalculo:${idEmisionEjecucion}`));
				requests.push(this.procesoRepository.listByEntidad(`ProcesoOrdenamiento:${idEmisionEjecucion}`));
				requests.push(this.procesoRepository.listByEntidad(`EmisionAprobacionOrdenamiento:${idEmisionEjecucion}`));
				requests.push(this.procesoRepository.listByEntidad(`AprobacionCodigoBarras:${idEmisionEjecucion}`));
				requests.push(this.procesoRepository.listByEntidad(`ProcesoCuentaCorriente:${idEmisionEjecucion}`));
				requests.push(this.procesoRepository.listByEntidad(`ProcesoImpresion:${idEmisionEjecucion}`));

				Promise.all(requests)
				.then(responses => {
					let procesos = [];
					responses.forEach(response => {
						procesos = procesos.concat(response);
					});
					resolve(procesos);
				})
				.catch(reject)
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async findById(id: number) {
		return new Promise( async (resolve, reject) => {
			try {			   
				const result = await this.procesoRepository.findById(id);
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

	async findByIdentificador(identificador: string) {
		return new Promise( async (resolve, reject) => {
			try {			   
				const result = await this.procesoRepository.findByIdentificador(identificador);
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

	async add(proceso: Proceso) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidString(proceso.identificador, true) ||
					!isValidString(proceso.entidad, true) ||
					!isValidKey(proceso.idProcesoProgramacion, false) ||
					!isValidInteger(proceso.idEstadoProceso, true) ||
					!isValidDate(proceso.fechaProceso, false) ||
					!isValidDate(proceso.fechaInicio, false) ||
					!isValidDate(proceso.fechaFin, false) ||
					!isValidString(proceso.descripcion, true) ||
					!isValidString(proceso.observacion, false) ||
					!isValidFloat(proceso.avance, false) ||
					!isValidString(proceso.origen, true) ||
					!isValidInteger(proceso.idUsuarioCreacion, false) ||
					!isValidDate(proceso.fechaCreacion, true) ||
					!isValidString(proceso.urlEjecucion, true)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				proceso.id = null;
				const result = await this.procesoRepository.add(proceso);
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async addByProcesoProgramacion(idUsuario:number) {
		return new Promise( async (resolve, reject) => {
			try {
				const toDay = getDateNow(true);
				let data = await this.procesoProgramacionRepository.list() as Array<ProcesoProgramacion>;
				let actives = data.filter(f => f.activa);

				const checkProceso = (fechaProceso:Date, programacion:ProcesoProgramacion) => {
					if (fechaProceso.getTime() > programacion.fechaUltimaProgramacion.getTime() && //no fue ejecutado antes
						fechaProceso.getTime() <= toDay.getTime() //ya es hora de ejecutarlo
					) {
						const proceso = new Proceso(
							null,
							uuidv4(),
							programacion.entidad,
							programacion.id,
							PROCESO_STATE.PENDIENTE,
							fechaProceso,
							null,
							null,
							programacion.descripcion,
							"",
							0,
							"scheduler",
							idUsuario,
							toDay,
							programacion.urlEjecucion
						);
						requests.push(this.procesoRepository.add(proceso));
					}
				}

				let requests = [];
				for (let i=0; i < actives.length; i++) {
					const programacion = actives[i];
					switch(programacion.idTipoProgramacion) {

						case PROCESO_PROGRAMMATION_TYPE.DIARIA:
							programacion.diasProgramacion.split('|').forEach(time => {
								if (time.length > 0) {
									const datetime = new DateTime(time);
									const fechaProceso = new Date(toDay.getFullYear(), toDay.getMonth(), toDay.getDate(), datetime.hour, datetime.minutes);
									checkProceso(fechaProceso, programacion);
								}
							});
							break;

						case PROCESO_PROGRAMMATION_TYPE.SEMANAL:
							programacion.diasProgramacion.split('|').forEach(time => {
								if (time.length > 0) {
									const datetime = new DateTime(time);
									const weekDay = datetime.day;
									if (weekDay === toDay.getDay()) {
										const fechaProceso = new Date(toDay.getFullYear(), toDay.getMonth(), toDay.getDate(), datetime.hour, datetime.minutes);
										checkProceso(fechaProceso, programacion);
									}
								}
							});
							break;

						case PROCESO_PROGRAMMATION_TYPE.MENSUAL:
							programacion.diasProgramacion.split('|').forEach(time => {
								if (time.length > 0) {
									const datetime = new DateTime(time);
									const monthDay = datetime.day;
									if (monthDay === toDay.getDate()) {
										const datetime = new DateTime(time);
										const fechaProceso = new Date(toDay.getFullYear(), toDay.getMonth(), toDay.getDate(), datetime.hour, datetime.minutes);
										checkProceso(fechaProceso, programacion);
									}
								}
							});
							break;

						default:
							break;
					}
					programacion.fechaUltimaProgramacion = toDay;
					requests.push(this.procesoProgramacionRepository.modify(programacion.id, programacion));
				}

				Promise.all(requests).then(resolve).catch(reject);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async modify(id: number, proceso: Proceso) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidString(proceso.identificador, true) ||
					!isValidString(proceso.entidad, true) ||
					!isValidKey(proceso.idProcesoProgramacion, false) ||
					!isValidInteger(proceso.idEstadoProceso, true) ||
					!isValidDate(proceso.fechaProceso, false) ||
					!isValidDate(proceso.fechaInicio, false) ||
					!isValidDate(proceso.fechaFin, false) ||
					!isValidString(proceso.descripcion, true) ||
					!isValidString(proceso.observacion, false) ||
					!isValidFloat(proceso.avance, false) ||
					!isValidString(proceso.origen, true) ||
					!isValidInteger(proceso.idUsuarioCreacion, false) ||
					!isValidDate(proceso.fechaCreacion, true) ||
					!isValidString(proceso.urlEjecucion, true)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				const result = await this.procesoRepository.modify(id, proceso);
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

	async modifyVerify(idUsuario:number, token: string) {
		return new Promise( async (resolve, reject) => {
			try {
				//agrega procesos programados como pendientes de ejecucion
				await this.addByProcesoProgramacion(idUsuario);
				//obtienen los procesos listos para ejecutar (pendientes y en fecha)
				let procesos = await this.listReady() as Array<Proceso>;

				const requests = [];
				while (procesos.length > 0) {				
					const request = new Promise((resolve2, reject2) => {
						this.execute(token, procesos.pop())
						.then(response => {
							resolve2({result: true, response});
						})
						.catch(error => {
							resolve2({result: false, error});
						});
					});
					requests.push(request);
				}

				Promise.all(requests)
				.then(async responses => {
					resolve({
						processesSucceed: responses.filter(f => f.result).length,
						processedError: responses.filter(f => !f.result).length
					});
				})
				.catch((error) => {
					reject(error);
				});
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async modifyExecute(token: string, identificador: string) {
		return new Promise( async (resolve, reject) => {
			let proceso: Proceso = null;
			try {
				proceso = await this.findByIdentificador(identificador) as Proceso;
				this.execute(token, proceso).then(resolve).catch(reject);
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
	}

	async modifyCancel(token: string, identificador: string) {
		return new Promise( async (resolve, reject) => {
			let proceso: Proceso = null;
			try {
				proceso = await this.findByIdentificador(identificador) as Proceso;
				this.cancel(token, proceso).then(resolve).catch(reject);
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
	}

	async remove(id: number) {
		return new Promise( async (resolve, reject) => {
			try {
				const result = await this.procesoRepository.remove(id);
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


	async execute(token: string, proceso: Proceso) {
		return new Promise( async (resolve, reject) => {
			try {
				if (proceso.idEstadoProceso !== PROCESO_STATE.PENDIENTE) {
					reject(new ReferenceError('Estado incorrecto de proceso'));
					return;
				}

				const urlEjecucion = proceso.urlEjecucion.split('|');
				const requestMethod = urlEjecucion[0];
				const apiUrl = urlEjecucion[1];
				const paramsUrl = urlEjecucion[2];

				proceso.fechaInicio = getDateNow(true);
				proceso.idEstadoProceso = PROCESO_STATE.PROGRESO;
				proceso.avance = 0;
				await this.modify(proceso.id, proceso);

				const result = await SendRequest(token, paramsUrl, null, requestMethod, apiUrl) as any;

				proceso.fechaFin = getDateNow(true);
				proceso.idEstadoProceso = PROCESO_STATE.FINALIZADO;
				proceso.avance = 100;
				await this.modify(proceso.id, proceso);

				resolve(result);
			}
			catch(error) {
				if (proceso) {
					try {
						proceso.fechaFin = getDateNow(true);
						proceso.idEstadoProceso = PROCESO_STATE.ERROR;
						proceso.avance = 0;
						proceso.observacion = error.message;
						await this.modify(proceso.id, proceso);
					}
					catch(error2) {
						console.log(error2);
						reject(new ProcessError('Error procesando fallo en proceso', error2));
						return;
					}
				}
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
	}

	async cancel(token: string, proceso: Proceso) {
		return new Promise( async (resolve, reject) => {
			try {
				if (proceso.idEstadoProceso !== PROCESO_STATE.PENDIENTE && proceso.idEstadoProceso !== PROCESO_STATE.PROGRESO) {
					reject(new ReferenceError('Estado incorrecto de proceso'));
					return;
				}

				if (!proceso.fechaInicio) proceso.fechaInicio = getDateNow(true);
				proceso.fechaFin = getDateNow(true);
				proceso.idEstadoProceso = PROCESO_STATE.CANCELADO;
				proceso.avance = 0;
				proceso.observacion = "Proceso cancelado";
				const result = await this.modify(proceso.id, proceso);

				resolve(result);
			}
			catch(error) {
				if (proceso) {
					try {
						proceso.fechaFin = getDateNow(true);
						proceso.idEstadoProceso = PROCESO_STATE.ERROR;
						proceso.avance = 0;
						proceso.observacion = error.message;
						await this.modify(proceso.id, proceso);
					}
					catch(error2) {
						console.log(error2);
						reject(new ProcessError('Error procesando fallo en proceso', error2));
						return;
					}
				}
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
	}

}



class DateTime {

	day: number = 0;
	hour: number = 0;
	minutes: number = 0;

	constructor(datetime) {
		if (datetime.length > 0) {
			this.day = parseInt(datetime.substring(0,2));
			this.hour = parseInt(datetime.substring(2,4));
			this.minutes = parseInt(datetime.substring(4,6));
		}

	}

}
