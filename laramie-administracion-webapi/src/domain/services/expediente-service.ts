import Expediente from '../entities/expediente';
import IExpedienteRepository from '../repositories/expediente-repository';
import { isValidString, isValidInteger, isValidDate } from '../../infraestructure/sdk/utils/validator';
import ValidationError from '../../infraestructure/sdk/error/validation-error';
import ProcessError from '../../infraestructure/sdk/error/process-error';
import ReferenceError from '../../infraestructure/sdk/error/reference-error';
import ExpedienteDTO from '../dto/expediente-dto';
import ExpedienteFilter from '../dto/expediente-filter';

import Archivo from '../entities/archivo';
import Observacion from '../entities/observacion';
import Etiqueta from '../entities/etiqueta';
import ArchivoState from '../dto/archivo-state';
import ObservacionState from '../dto/observacion-state';
import EtiquetaState from '../dto/etiqueta-state';
import ArchivoService from './archivo-service';
import ObservacionService from './observacion-service';
import EtiquetaService from './etiqueta-service';

export default class ExpedienteService {

	expedienteRepository: IExpedienteRepository;
	archivoService: ArchivoService;
    observacionService: ObservacionService;
    etiquetaService: EtiquetaService;

	constructor(expedienteRepository: IExpedienteRepository,
				archivoService: ArchivoService, observacionService: ObservacionService, etiquetaService: EtiquetaService) {
		this.expedienteRepository = expedienteRepository;
		this.archivoService = archivoService;
        this.observacionService = observacionService;
        this.etiquetaService = etiquetaService;
	}

	async list() {
		return new Promise( async (resolve, reject) => {
			try {
				const result = await this.expedienteRepository.list();
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async listByFilter(expedienteFilter: ExpedienteFilter) {
		return new Promise( async (resolve, reject) => {
			try {
                const result = (await this.expedienteRepository.listByFilter(expedienteFilter) as Array<Expediente>).sort((a, b) => a.id - b.id);
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
				let expedienteDTO = new ExpedienteDTO();
				expedienteDTO.expediente = await this.expedienteRepository.findById(id) as Expediente;
				if (!expedienteDTO.expediente) {
					reject(new ReferenceError('No existe el registro'));
					return;
				}
				expedienteDTO.archivos = await this.archivoService.listByEntidad("Expediente", id) as Array<ArchivoState>;
                expedienteDTO.observaciones = await this.observacionService.listByEntidad("Expediente", id) as Array<ObservacionState>;
                expedienteDTO.etiquetas = await this.etiquetaService.listByEntidad("Expediente", id) as Array<EtiquetaState>;

				resolve(expedienteDTO);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async add(idUsuario: number, expedienteDTO: ExpedienteDTO) {
		const resultTransaction = this.expedienteRepository.onTransaction( async () => {
			return new Promise( async (resolve, reject) => {
				try {
					let expediente = expedienteDTO.expediente;
					if (
						!isValidString(expediente.matricula, true) ||
						!isValidString(expediente.ejercicio, true) ||
						!isValidString(expediente.numero, true) ||
						!isValidString(expediente.letra, true) ||
						!isValidInteger(expediente.idProvincia, true) ||
						!isValidInteger(expediente.idTipoExpediente, true) ||
						!isValidString(expediente.subnumero, true) ||
						!isValidInteger(expediente.idTemaExpediente, false) ||
						//!isValidString(expediente.referenciaExpediente, true) ||
						!isValidDate(expediente.fechaCreacion, true)
					) {
						reject(new ValidationError('Existen campos incompletos'));
						return;
					}

					expediente.id = null;
					if (expediente.idTemaExpediente === 0) expediente.idTemaExpediente = null;
					expediente = await this.expedienteRepository.add(expediente);

					//proceso los archivos, observaciones y etiquetas
					let executesInfo = [];
					expedienteDTO.archivos.forEach(async row => {
						if (row.state === 'a') {
							row.idEntidad = expediente.id;
							executesInfo.push(this.archivoService.add(idUsuario, row as Archivo));
						}
					});
					expedienteDTO.observaciones.forEach(async row => {
						if (row.state === 'a') {
							row.idEntidad = expediente.id;
							executesInfo.push(this.observacionService.add(idUsuario, row as Observacion));
						}
					});
					expedienteDTO.etiquetas.forEach(async row => {
						if (row.state === 'a') {
							row.idEntidad = expediente.id;
							executesInfo.push(this.etiquetaService.add(row as Etiqueta));
						}
					});

					Promise.all(executesInfo)
					.then(responses => {
						resolve(expediente);
					})
					.catch((error) => {
						reject(error);
					});
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

	async modify(id: number, idUsuario: number, expedienteDTO: ExpedienteDTO) {
		const resultTransaction = this.expedienteRepository.onTransaction( async () => {
			return new Promise( async (resolve, reject) => {
				try {
					let expediente = expedienteDTO.expediente;
					if (
						!isValidString(expediente.matricula, true) ||
						!isValidString(expediente.ejercicio, true) ||
						!isValidString(expediente.numero, true) ||
						!isValidString(expediente.letra, true) ||
						!isValidInteger(expediente.idProvincia, true) ||
						!isValidInteger(expediente.idTipoExpediente, true) ||
						!isValidString(expediente.subnumero, true) ||
						!isValidInteger(expediente.idTemaExpediente, false) ||
						//!isValidString(expediente.referenciaExpediente, true) ||
						!isValidDate(expediente.fechaCreacion, true)
					) {
						reject(new ValidationError('Existen campos incompletos'));
						return;
					}

					if (expediente.idTemaExpediente === 0) expediente.idTemaExpediente = null;
					expediente = await this.expedienteRepository.modify(id, expediente);
					if (!expediente) {
						reject(new ReferenceError('No existe el registro'));
						return;
					}

					//proceso los archivos, observaciones y etiquetas
					let executesInfo = [];
					expedienteDTO.archivos.forEach(async row => {
						if (row.state === 'a') {
							executesInfo.push(this.archivoService.add(idUsuario, row as Archivo));
						}
						else if (row.state === 'r') {
							executesInfo.push(this.archivoService.remove(row.id));
						}
					});
					expedienteDTO.observaciones.forEach(async row => {
						if (row.state === 'a') {
							executesInfo.push(this.observacionService.add(idUsuario, row as Observacion));
						}
						else if (row.state === 'r') {
							executesInfo.push(this.observacionService.remove(row.id));
						}
					});
					expedienteDTO.etiquetas.forEach(async row => {
						if (row.state === 'a') {
							executesInfo.push(this.etiquetaService.add(row as Etiqueta));
						}
						else if (row.state === 'r') {
							executesInfo.push(this.etiquetaService.remove(row.id));
						}
					});

					Promise.all(executesInfo)
					.then(responses => {
						resolve(expediente);
					})
					.catch((error) => {
						reject(error);
					});
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
				const result = await this.expedienteRepository.remove(id);
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
