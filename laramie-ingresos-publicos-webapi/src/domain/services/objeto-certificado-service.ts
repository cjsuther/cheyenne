import ObjetoCertificado from '../entities/objeto-certificado';
import IObjetoCertificadoRepository from '../repositories/objeto-certificado-repository';
import { isValidString, isValidInteger, isValidBoolean } from '../../infraestructure/sdk/utils/validator';
import ValidationError from '../../infraestructure/sdk/error/validation-error';
import ProcessError from '../../infraestructure/sdk/error/process-error';
import ReferenceError from '../../infraestructure/sdk/error/reference-error';

export default class ObjetoCertificadoService {

	objetoCertificadoRepository: IObjetoCertificadoRepository;

	constructor(objetoCertificadoRepository: IObjetoCertificadoRepository) {
		this.objetoCertificadoRepository = objetoCertificadoRepository;
	}

	async list() {
		return new Promise( async (resolve, reject) => {
			try {
				const result = await this.objetoCertificadoRepository.list();
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
				const result = await this.objetoCertificadoRepository.findById(id);
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

	async add(objetoCertificado: ObjetoCertificado) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidString(objetoCertificado.codigo, true) ||
					!isValidString(objetoCertificado.nombre, true) ||
					!isValidInteger(objetoCertificado.orden, true) ||
					!isValidBoolean(objetoCertificado.actualizaPropietario)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				objetoCertificado.id = null;
				const result = await this.objetoCertificadoRepository.add(objetoCertificado);
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async modify(id: number, objetoCertificado: ObjetoCertificado) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidString(objetoCertificado.codigo, true) ||
					!isValidString(objetoCertificado.nombre, true) ||
					!isValidInteger(objetoCertificado.orden, true) ||
					!isValidBoolean(objetoCertificado.actualizaPropietario)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				const result = await this.objetoCertificadoRepository.modify(id, objetoCertificado);
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
				const result = await this.objetoCertificadoRepository.remove(id);
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
