import RegistroCivil from '../entities/registro-civil';
import IRegistroCivilRepository from '../repositories/registro-civil-repository';
import { isValidString, isValidInteger } from '../../infraestructure/sdk/utils/validator';
import ValidationError from '../../infraestructure/sdk/error/validation-error';
import ProcessError from '../../infraestructure/sdk/error/process-error';
import ReferenceError from '../../infraestructure/sdk/error/reference-error';

export default class RegistroCivilService {

	registroCivilRepository: IRegistroCivilRepository;

	constructor(registroCivilRepository: IRegistroCivilRepository) {
		this.registroCivilRepository = registroCivilRepository;
	}

	async list() {
		return new Promise( async (resolve, reject) => {
			try {
				const result = await this.registroCivilRepository.list();
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
				const result = await this.registroCivilRepository.findById(id);
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

	async add(registroCivil: RegistroCivil) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidString(registroCivil.codigo, true) ||
					!isValidString(registroCivil.nombre, true) ||
					!isValidInteger(registroCivil.orden, true)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				registroCivil.id = null;
				const result = await this.registroCivilRepository.add(registroCivil);
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async modify(id: number, registroCivil: RegistroCivil) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidString(registroCivil.codigo, true) ||
					!isValidString(registroCivil.nombre, true) ||
					!isValidInteger(registroCivil.orden, true)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				const result = await this.registroCivilRepository.modify(id, registroCivil);
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
				const result = await this.registroCivilRepository.remove(id);
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
