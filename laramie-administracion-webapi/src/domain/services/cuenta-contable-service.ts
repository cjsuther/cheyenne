import CuentaContable from '../entities/cuenta-contable';
import ICuentaContableRepository from '../repositories/cuenta-contable-repository';
import { isValidString, isValidInteger,  } from '../../infraestructure/sdk/utils/validator';
import ValidationError from '../../infraestructure/sdk/error/validation-error';
import ProcessError from '../../infraestructure/sdk/error/process-error';
import ReferenceError from '../../infraestructure/sdk/error/reference-error';

export default class CuentaContableService {

	cuentaContableRepository: ICuentaContableRepository;

	constructor(cuentaContableRepository: ICuentaContableRepository) {
		this.cuentaContableRepository = cuentaContableRepository;
	}

	async list() {
		return new Promise( async (resolve, reject) => {
			try {
				const result = await this.cuentaContableRepository.list();
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
				const result = await this.cuentaContableRepository.findById(id);
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

	async add(cuentaContable: CuentaContable) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidString(cuentaContable.codigo, true) ||
					!isValidString(cuentaContable.nombre, true) ||
					!isValidInteger(cuentaContable.orden, true) ||
					!isValidString(cuentaContable.agrupamiento, true)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				cuentaContable.id = null;
				const result = await this.cuentaContableRepository.add(cuentaContable);
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async modify(id: number, cuentaContable: CuentaContable) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidString(cuentaContable.codigo, true) ||
					!isValidString(cuentaContable.nombre, true) ||
					!isValidInteger(cuentaContable.orden, true) ||
					!isValidString(cuentaContable.agrupamiento, true)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				const result = await this.cuentaContableRepository.modify(id, cuentaContable);
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
				const result = await this.cuentaContableRepository.remove(id);
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
