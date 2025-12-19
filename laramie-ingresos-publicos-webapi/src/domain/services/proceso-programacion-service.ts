import ProcesoProgramacion from '../entities/proceso-programacion';
import IProcesoProgramacionRepository from '../repositories/proceso-programacion-repository';
import { isValidString, isValidInteger, isValidDate, isValidBoolean } from '../../infraestructure/sdk/utils/validator';
import ValidationError from '../../infraestructure/sdk/error/validation-error';
import ProcessError from '../../infraestructure/sdk/error/process-error';
import ReferenceError from '../../infraestructure/sdk/error/reference-error';

export default class ProcesoProgramacionService {

	procesoProgramacionRepository: IProcesoProgramacionRepository;

	constructor(procesoProgramacionRepository: IProcesoProgramacionRepository) {
		this.procesoProgramacionRepository = procesoProgramacionRepository;
	}

	async list() {
		return new Promise( async (resolve, reject) => {
			try {
				const result = await this.procesoProgramacionRepository.list();
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
				const result = await this.procesoProgramacionRepository.findById(id);
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

	async add(procesoProgramacion: ProcesoProgramacion) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidString(procesoProgramacion.entidad, true) ||
					!isValidString(procesoProgramacion.descripcion, true) ||
					!isValidString(procesoProgramacion.urlEjecucion, true) ||
					!isValidInteger(procesoProgramacion.idTipoProgramacion, true) ||
					!isValidString(procesoProgramacion.diasProgramacion, true) ||
					!isValidDate(procesoProgramacion.fechaUltimaProgramacion, true) ||
					!isValidBoolean(procesoProgramacion.activa)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				procesoProgramacion.id = null;
				const result = await this.procesoProgramacionRepository.add(procesoProgramacion);
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async modify(id: number, procesoProgramacion: ProcesoProgramacion) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidString(procesoProgramacion.entidad, true) ||
					!isValidString(procesoProgramacion.descripcion, true) ||
					!isValidString(procesoProgramacion.urlEjecucion, true) ||
					!isValidInteger(procesoProgramacion.idTipoProgramacion, true) ||
					!isValidString(procesoProgramacion.diasProgramacion, true) ||
					!isValidDate(procesoProgramacion.fechaUltimaProgramacion, true) ||
					!isValidBoolean(procesoProgramacion.activa)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				const result = await this.procesoProgramacionRepository.modify(id, procesoProgramacion);
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

	async remove(id: number) {
		return new Promise( async (resolve, reject) => {
			try {
				const result = await this.procesoProgramacionRepository.remove(id);
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
