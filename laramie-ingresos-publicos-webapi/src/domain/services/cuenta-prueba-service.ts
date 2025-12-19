import CuentaPrueba from '../entities/cuenta-prueba';
import ICuentaPruebaRepository from '../repositories/cuenta-prueba-repository';
import { isValidInteger, isValidString } from '../../infraestructure/sdk/utils/validator';
import ValidationError from '../../infraestructure/sdk/error/validation-error';
import ProcessError from '../../infraestructure/sdk/error/process-error';
import ReferenceError from '../../infraestructure/sdk/error/reference-error';

export default class CuentaPruebaService {

	cuentaPruebaRepository: ICuentaPruebaRepository;

	constructor(cuentaPruebaRepository: ICuentaPruebaRepository) {
		this.cuentaPruebaRepository = cuentaPruebaRepository;
	}

	async list() {
		return new Promise( async (resolve, reject) => {
			try {
				const result = await this.cuentaPruebaRepository.list();
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
				const result = await this.cuentaPruebaRepository.findById(id);
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

	async add(cuentaPrueba: CuentaPrueba) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidInteger(cuentaPrueba.idTipoTributo, true) ||
					!isValidInteger(cuentaPrueba.idCuenta, true) ||
					!isValidString(cuentaPrueba.comentario, false)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				const existing = await this.cuentaPruebaRepository.findByCuenta(cuentaPrueba.idCuenta);
				if (existing) {
					reject(new ValidationError('Ya existe la cuenta de prueba'));
					return;
				}

				cuentaPrueba.id = null;
				const result = await this.cuentaPruebaRepository.add(cuentaPrueba);
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async modify(id: number, cuentaPrueba: CuentaPrueba) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidInteger(cuentaPrueba.idTipoTributo, true) ||
					!isValidInteger(cuentaPrueba.idCuenta, true) ||
					!isValidString(cuentaPrueba.comentario, false)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				const result = await this.cuentaPruebaRepository.modify(id, cuentaPrueba);
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
				const result = await this.cuentaPruebaRepository.remove(id);
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
