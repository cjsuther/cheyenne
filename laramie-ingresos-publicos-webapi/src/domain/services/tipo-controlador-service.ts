import TipoControlador from '../entities/tipo-controlador';
import ITipoControladorRepository from '../repositories/tipo-controlador-repository';
import { isValidString, isValidInteger, isValidBoolean,  } from '../../infraestructure/sdk/utils/validator';
import ValidationError from '../../infraestructure/sdk/error/validation-error';
import ProcessError from '../../infraestructure/sdk/error/process-error';
import ReferenceError from '../../infraestructure/sdk/error/reference-error';

export default class TipoControladorService {

	tipoControladorRepository: ITipoControladorRepository;

	constructor(tipoControladorRepository: ITipoControladorRepository) {
		this.tipoControladorRepository = tipoControladorRepository;
	}

	async list() {
		return new Promise( async (resolve, reject) => {
			try {
				const result = await this.tipoControladorRepository.list();
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
				const result = await this.tipoControladorRepository.findById(id);
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

	async add(tipoControlador: TipoControlador) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidString(tipoControlador.codigo, true) ||
					!isValidString(tipoControlador.nombre, true) ||
					!isValidInteger(tipoControlador.orden, true) ||
					!isValidBoolean(tipoControlador.esSupervisor) ||
					!isValidBoolean(tipoControlador.email) ||
					!isValidBoolean(tipoControlador.direccion)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				tipoControlador.id = null;
				const result = await this.tipoControladorRepository.add(tipoControlador);
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async modify(id: number, tipoControlador: TipoControlador) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidString(tipoControlador.codigo, true) ||
					!isValidString(tipoControlador.nombre, true) ||
					!isValidInteger(tipoControlador.orden, true) ||
					!isValidBoolean(tipoControlador.esSupervisor) ||
					!isValidBoolean(tipoControlador.email) ||
					!isValidBoolean(tipoControlador.direccion)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				const result = await this.tipoControladorRepository.modify(id, tipoControlador);
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
				const result = await this.tipoControladorRepository.remove(id);
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
