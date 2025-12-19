import ZonaTarifaria from '../entities/zona-tarifaria';
import IZonaTarifariaRepository from '../repositories/zona-tarifaria-repository';
import { isValidString, isValidInteger } from '../../infraestructure/sdk/utils/validator';
import ValidationError from '../../infraestructure/sdk/error/validation-error';
import ProcessError from '../../infraestructure/sdk/error/process-error';
import ReferenceError from '../../infraestructure/sdk/error/reference-error';

export default class ZonaTarifariaService {

	zonaTarifariaRepository: IZonaTarifariaRepository;

	constructor(zonaTarifariaRepository: IZonaTarifariaRepository) {
		this.zonaTarifariaRepository = zonaTarifariaRepository;
	}

	async list() {
		return new Promise( async (resolve, reject) => {
			try {
				const result = await this.zonaTarifariaRepository.list();
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
				const result = await this.zonaTarifariaRepository.findById(id);
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

	async add(zonaTarifaria: ZonaTarifaria) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidString(zonaTarifaria.codigo, true) ||
					!isValidString(zonaTarifaria.nombre, true) ||
					!isValidInteger(zonaTarifaria.orden, true)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				zonaTarifaria.id = null;
				const result = await this.zonaTarifariaRepository.add(zonaTarifaria);
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async modify(id: number, zonaTarifaria: ZonaTarifaria) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidString(zonaTarifaria.codigo, true) ||
					!isValidString(zonaTarifaria.nombre, true) ||
					!isValidInteger(zonaTarifaria.orden, true)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				const result = await this.zonaTarifariaRepository.modify(id, zonaTarifaria);
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
				const result = await this.zonaTarifariaRepository.remove(id);
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
