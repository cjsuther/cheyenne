import Filtro from '../entities/filtro';
import IFiltroRepository from '../repositories/filtro-repository';
import { isValidString, isValidInteger,  } from '../../infraestructure/sdk/utils/validator';
import ValidationError from '../../infraestructure/sdk/error/validation-error';
import ProcessError from '../../infraestructure/sdk/error/process-error';
import ReferenceError from '../../infraestructure/sdk/error/reference-error';

export default class FiltroService {

	filtroRepository: IFiltroRepository;

	constructor(filtroRepository: IFiltroRepository) {
		this.filtroRepository = filtroRepository;
	}

	async list() {
		return new Promise( async (resolve, reject) => {
			try {
				const result = await this.filtroRepository.list();
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
				const result = await this.filtroRepository.findById(id);
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

	async add(filtro: Filtro) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidString(filtro.codigo, true) ||
					!isValidString(filtro.nombre, true) ||
					!isValidInteger(filtro.orden, true) ||
					!isValidInteger(filtro.idTipoTributo, true) ||
					!isValidString(filtro.ejecucion, true)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				filtro.id = null;
				const result = await this.filtroRepository.add(filtro);
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async modify(id: number, filtro: Filtro) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidString(filtro.codigo, true) ||
					!isValidString(filtro.nombre, true) ||
					!isValidInteger(filtro.orden, true) ||
					!isValidInteger(filtro.idTipoTributo, true) ||
					!isValidString(filtro.ejecucion, true)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				const result = await this.filtroRepository.modify(id, filtro);
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
				const result = await this.filtroRepository.remove(id);
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

	async execute(filtro: Filtro) {
		return new Promise( async (resolve, reject) => {
			try {			   
				const result = await this.filtroRepository.execute(filtro);
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

}
