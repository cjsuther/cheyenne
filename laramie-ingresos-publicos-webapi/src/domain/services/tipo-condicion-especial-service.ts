import TipoCondicionEspecial from '../entities/tipo-condicion-especial';
import ITipoCondicionEspecialRepository from '../repositories/tipo-condicion-especial-repository';
import { isValidString, isValidInteger, isValidBoolean } from '../../infraestructure/sdk/utils/validator';
import ValidationError from '../../infraestructure/sdk/error/validation-error';
import ProcessError from '../../infraestructure/sdk/error/process-error';
import ReferenceError from '../../infraestructure/sdk/error/reference-error';

export default class TipoCondicionEspecialService {

	tipoCondicionEspecialRepository: ITipoCondicionEspecialRepository;

	constructor(tipoCondicionEspecialRepository: ITipoCondicionEspecialRepository) {
		this.tipoCondicionEspecialRepository = tipoCondicionEspecialRepository;
	}

	async list() {
		return new Promise( async (resolve, reject) => {
			try {
				const result = await this.tipoCondicionEspecialRepository.list();
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
				const result = await this.tipoCondicionEspecialRepository.findById(id);
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

	async findByCodigo(codigo: string) {
		return new Promise( async (resolve, reject) => {
			try {			   
				const result = await this.tipoCondicionEspecialRepository.findByCodigo(codigo);
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

	async add(tipoCondicionEspecial: TipoCondicionEspecial) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidString(tipoCondicionEspecial.codigo, true) ||
					!isValidString(tipoCondicionEspecial.nombre, true) ||
					!isValidInteger(tipoCondicionEspecial.orden, true) ||
					!isValidInteger(tipoCondicionEspecial.idTipoTributo, false) ||
					!isValidString(tipoCondicionEspecial.tipo, true) ||
					!isValidString(tipoCondicionEspecial.color, true) ||
					!isValidBoolean(tipoCondicionEspecial.inhibicion)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				tipoCondicionEspecial.id = null;
				const result = await this.tipoCondicionEspecialRepository.add(tipoCondicionEspecial);
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async modify(id: number, tipoCondicionEspecial: TipoCondicionEspecial) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidString(tipoCondicionEspecial.codigo, true) ||
					!isValidString(tipoCondicionEspecial.nombre, true) ||
					!isValidInteger(tipoCondicionEspecial.orden, true) ||
					!isValidInteger(tipoCondicionEspecial.idTipoTributo, false) ||
					!isValidString(tipoCondicionEspecial.tipo, true) ||
					!isValidString(tipoCondicionEspecial.color, true) ||
					!isValidBoolean(tipoCondicionEspecial.inhibicion)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				const result = await this.tipoCondicionEspecialRepository.modify(id, tipoCondicionEspecial);
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
				const result = await this.tipoCondicionEspecialRepository.remove(id);
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
