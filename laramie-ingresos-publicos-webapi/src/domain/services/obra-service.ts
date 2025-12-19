import Obra from '../entities/obra';
import IObraRepository from '../repositories/obra-repository';
import { isValidString, isValidInteger, isValidNumber, isValidFloat } from '../../infraestructure/sdk/utils/validator';
import ValidationError from '../../infraestructure/sdk/error/validation-error';
import ProcessError from '../../infraestructure/sdk/error/process-error';
import ReferenceError from '../../infraestructure/sdk/error/reference-error';

export default class ObraService {

	obraRepository: IObraRepository;

	constructor(obraRepository: IObraRepository) {
		this.obraRepository = obraRepository;
	}

	async list() {
		return new Promise( async (resolve, reject) => {
			try {
				const result = await this.obraRepository.list();
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
				const result = await this.obraRepository.findById(id);
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

	async add(obra: Obra) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidString(obra.codigo, true) ||
					!isValidString(obra.nombre, true) ||
					!isValidInteger(obra.orden, true) ||
					!isValidFloat(obra.importe, true)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				obra.id = null;
				const result = await this.obraRepository.add(obra);
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async modify(id: number, obra: Obra) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidString(obra.codigo, true) ||
					!isValidString(obra.nombre, true) ||
					!isValidInteger(obra.orden, true) ||
					!isValidFloat(obra.importe, true)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				const result = await this.obraRepository.modify(id, obra);
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
				const result = await this.obraRepository.remove(id);
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
