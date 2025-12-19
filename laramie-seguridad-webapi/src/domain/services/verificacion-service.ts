import Verificacion from '../entities/verificacion';
import IVerificacionRepository from '../repositories/verificacion-repository';
import { isValidInteger, isValidString, isValidDate,  } from '../../infraestructure/sdk/utils/validator';
import ValidationError from '../../infraestructure/sdk/error/validation-error';
import ProcessError from '../../infraestructure/sdk/error/process-error';
import ReferenceError from '../../infraestructure/sdk/error/reference-error';

export default class VerificacionService {

	verificacionRepository: IVerificacionRepository;

	constructor(verificacionRepository: IVerificacionRepository) {
		this.verificacionRepository = verificacionRepository;
	}

	async list() {
		return new Promise( async (resolve, reject) => {
			try {
				const result = await this.verificacionRepository.list();
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

	async verifyPasswordToken(token: string) {
		return new Promise(async (resolve, reject) => {
			try {
				const result = await this.verificacionRepository.findByToken(token)
				if (!result)
					reject(new ReferenceError('No existe el registro'))
				else if (result.fechaHasta < Date.now())
					reject(new ValidationError('Token vencido'))
				else if (result.idEstadoVerificacion === 51)
					reject(new ValidationError('Token inactivo'))
				else resolve(result)
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error))
			}
		})
	}

	async add(verificacion: Verificacion) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidInteger(verificacion.idTipoVerificacion, true) ||
					!isValidInteger(verificacion.idEstadoVerificacion, true) ||
					!isValidInteger(verificacion.idUsuario, true) ||
					!isValidString(verificacion.codigo, false) ||
					!isValidDate(verificacion.fechaDesde, true) ||
					!isValidDate(verificacion.fechaHasta, true) ||
					!isValidString(verificacion.token, false) ||
					!isValidString(verificacion.detalle, false)
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
					!isValidInteger(verificacion.idTipoVerificacion, true) ||
					!isValidInteger(verificacion.idEstadoVerificacion, true) ||
					!isValidInteger(verificacion.idUsuario, true) ||
					!isValidString(verificacion.codigo, false) ||
					!isValidDate(verificacion.fechaDesde, true) ||
					!isValidDate(verificacion.fechaHasta, true) ||
					!isValidString(verificacion.token, false) ||
					!isValidString(verificacion.detalle, false)
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
