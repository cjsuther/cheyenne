import ClaseElemento from '../entities/clase-elemento';
import IClaseElementoRepository from '../repositories/clase-elemento-repository';
import { isValidInteger, isValidString,  } from '../../infraestructure/sdk/utils/validator';
import ValidationError from '../../infraestructure/sdk/error/validation-error';
import ProcessError from '../../infraestructure/sdk/error/process-error';
import ReferenceError from '../../infraestructure/sdk/error/reference-error';

export default class ClaseElementoService {

	claseElementoRepository: IClaseElementoRepository;

	constructor(claseElementoRepository: IClaseElementoRepository) {
		this.claseElementoRepository = claseElementoRepository;
	}

	async list() {
		return new Promise( async (resolve, reject) => {
			try {
				const result = await this.claseElementoRepository.list();
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
				const result = await this.claseElementoRepository.findById(id);
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

	async add(claseElemento: ClaseElemento) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidString(claseElemento.codigo, true) ||
					!isValidString(claseElemento.nombre, true) ||
					!isValidInteger(claseElemento.orden, true) ||
					!isValidInteger(claseElemento.idTipoTributo, false)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				claseElemento.id = null;
				const result = await this.claseElementoRepository.add(claseElemento);
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async modify(id: number, claseElemento: ClaseElemento) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidString(claseElemento.codigo, true) ||
					!isValidString(claseElemento.nombre, true) ||
					!isValidInteger(claseElemento.orden, true) ||
					!isValidInteger(claseElemento.idTipoTributo, false)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				const result = await this.claseElementoRepository.modify(id, claseElemento);
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
				const result = await this.claseElementoRepository.remove(id);
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
