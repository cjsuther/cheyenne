import Verificacion from '../entities/verificacion';
import IVerificacionRepository from '../repositories/verificacion-repository';
import { isValidInteger, isValidDate, isValidString,  } from '../../infraestructure/sdk/utils/validator';
import ValidationError from '../../infraestructure/sdk/error/validation-error';
import ProcessError from '../../infraestructure/sdk/error/process-error';
import ReferenceError from '../../infraestructure/sdk/error/reference-error';

export default class VerificacionService {

	verificacionRepository: IVerificacionRepository;

	constructor(verificacionRepository: IVerificacionRepository) {
		this.verificacionRepository = verificacionRepository;
	}

	async listByInhumado(idInhumado: number) {
		return new Promise( async (resolve, reject) => {
			try {
				const result = await this.verificacionRepository.listByInhumado(idInhumado);
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
				const result = await this.verificacionRepository.findById(id);
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

	async add(verificacion: Verificacion) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidInteger(verificacion.idInhumado, true) ||
					!isValidDate(verificacion.fecha, true) ||
					!isValidString(verificacion.motivoVerificacion, true) ||
					!isValidInteger(verificacion.idTipoDocumentoVerificador, true) ||
					!isValidString(verificacion.numeroDocumentoVerificador, true) ||
					!isValidString(verificacion.apellidoVerificador, true) ||
					!isValidString(verificacion.nombreVerificador, true) ||
					!isValidInteger(verificacion.idResultadoVerificacion, true)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				verificacion.id = null;
				const result = await this.verificacionRepository.add(verificacion);
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async modify(id: number, verificacion: Verificacion) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidInteger(verificacion.idInhumado, true) ||
					!isValidDate(verificacion.fecha, true) ||
					!isValidString(verificacion.motivoVerificacion, true) ||
					!isValidInteger(verificacion.idTipoDocumentoVerificador, true) ||
					!isValidString(verificacion.numeroDocumentoVerificador, true) ||
					!isValidString(verificacion.apellidoVerificador, true) ||
					!isValidString(verificacion.nombreVerificador, true) ||
					!isValidInteger(verificacion.idResultadoVerificacion, true)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				const result = await this.verificacionRepository.modify(id, verificacion);
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
				const result = await this.verificacionRepository.remove(id);
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
