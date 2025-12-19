import TipoElemento from '../entities/tipo-elemento';
import ITipoElementoRepository from '../repositories/tipo-elemento-repository';
import { isValidString, isValidInteger, isValidFloat } from '../../infraestructure/sdk/utils/validator';
import ValidationError from '../../infraestructure/sdk/error/validation-error';
import ProcessError from '../../infraestructure/sdk/error/process-error';
import ReferenceError from '../../infraestructure/sdk/error/reference-error';

export default class TipoElementoService {

	tipoElementoRepository: ITipoElementoRepository;

	constructor(tipoElementoRepository: ITipoElementoRepository) {
		this.tipoElementoRepository = tipoElementoRepository;
	}

	async list() {
		return new Promise( async (resolve, reject) => {
			try {
				const result = await this.tipoElementoRepository.list();
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async listByClaseElemento(idClaseElemento: number) {
		return new Promise( async (resolve, reject) => {
			try {
				const result = (await this.tipoElementoRepository.listByClaseElemento(idClaseElemento) as Array<TipoElemento>)
									.sort((a, b) => a.orden - b.orden);
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
				const result = await this.tipoElementoRepository.findById(id);
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

	async add(tipoElemento: TipoElemento) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidString(tipoElemento.codigo, true) ||
					!isValidString(tipoElemento.nombre, true) ||
					!isValidInteger(tipoElemento.orden, true) ||
					!isValidInteger(tipoElemento.idClaseElemento, true) ||
					!isValidInteger(tipoElemento.idUnidadMedida, true) ||
					!isValidFloat(tipoElemento.valor, true)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				tipoElemento.id = null;
				const result = await this.tipoElementoRepository.add(tipoElemento);
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async modify(id: number, tipoElemento: TipoElemento) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidString(tipoElemento.codigo, true) ||
					!isValidString(tipoElemento.nombre, true) ||
					!isValidInteger(tipoElemento.orden, true) ||
					!isValidInteger(tipoElemento.idClaseElemento, true) ||
					!isValidInteger(tipoElemento.idUnidadMedida, true) ||
					!isValidFloat(tipoElemento.valor, true)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				const result = await this.tipoElementoRepository.modify(id, tipoElemento);
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
				const result = await this.tipoElementoRepository.remove(id);
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
