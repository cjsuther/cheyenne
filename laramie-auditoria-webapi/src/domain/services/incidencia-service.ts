import Incidencia from '../entities/incidencia';
import IIncidenciaRepository from '../repositories/incidencia-repository';
import { isValidInteger, isValidDate, isValidString, isValidObject,  } from '../../infraestructure/sdk/utils/validator';
import ValidationError from '../../infraestructure/sdk/error/validation-error';
import ProcessError from '../../infraestructure/sdk/error/process-error';
import ReferenceError from '../../infraestructure/sdk/error/reference-error';

export default class IncidenciaService {

	incidenciaRepository: IIncidenciaRepository;

	constructor(incidenciaRepository: IIncidenciaRepository) {
		this.incidenciaRepository = incidenciaRepository;
	}

	async list() {
		return new Promise( async (resolve, reject) => {
			try {
				const result = await this.incidenciaRepository.list();
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
				const result = await this.incidenciaRepository.findById(id);
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

	async add(incidencia: Incidencia) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidString(incidencia.token, true) ||
					!isValidInteger(incidencia.idTipoIncidencia, true) ||
					!isValidInteger(incidencia.idNivelCriticidad, true) ||
					!isValidInteger(incidencia.idUsuario, true) ||
					!isValidDate(incidencia.fecha, true) ||
					!isValidInteger(incidencia.idModulo, true) ||
					!isValidString(incidencia.origen, true) ||
					!isValidString(incidencia.mensaje, true) ||
					!isValidObject(incidencia.error) ||
					!isValidObject(incidencia.data)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				incidencia.id = null;
				const result = await this.incidenciaRepository.add(incidencia);
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async modify(id: number, incidencia: Incidencia) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidString(incidencia.token, true) ||
					!isValidInteger(incidencia.idTipoIncidencia, true) ||
					!isValidInteger(incidencia.idNivelCriticidad, true) ||
					!isValidInteger(incidencia.idUsuario, true) ||
					!isValidDate(incidencia.fecha, true) ||
					!isValidInteger(incidencia.idModulo, true) ||
					!isValidString(incidencia.origen, true) ||
					!isValidString(incidencia.mensaje, true) ||
					!isValidObject(incidencia.error) ||
					!isValidObject(incidencia.data)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				const result = await this.incidenciaRepository.modify(id, incidencia);
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
				const result = await this.incidenciaRepository.remove(id);
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
