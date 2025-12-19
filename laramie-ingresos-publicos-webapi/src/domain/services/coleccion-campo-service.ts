import ColeccionCampo from '../entities/coleccion-campo';
import IColeccionCampoRepository from '../repositories/coleccion-campo-repository';
import { isValidInteger, isValidString,  } from '../../infraestructure/sdk/utils/validator';
import ValidationError from '../../infraestructure/sdk/error/validation-error';
import ProcessError from '../../infraestructure/sdk/error/process-error';
import ReferenceError from '../../infraestructure/sdk/error/reference-error';

export default class ColeccionCampoService {

	coleccionCampoRepository: IColeccionCampoRepository;

	constructor(coleccionCampoRepository: IColeccionCampoRepository) {
		this.coleccionCampoRepository = coleccionCampoRepository;
	}

	async listByColeccion(idColeccion: number) {
		return new Promise( async (resolve, reject) => {
			try {
				const result = await this.coleccionCampoRepository.listByColeccion(idColeccion) as Array<ColeccionCampo>;
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
				const result = await this.coleccionCampoRepository.findById(id);
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

	async add(coleccionCampo: ColeccionCampo) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidInteger(coleccionCampo.idColeccion, true) ||
					!isValidInteger(coleccionCampo.idTipoVariable, true) ||
					!isValidString(coleccionCampo.campo, true) ||
					!isValidString(coleccionCampo.codigo, true) ||
					!isValidString(coleccionCampo.nombre, true) ||
					!isValidString(coleccionCampo.tipoDato, true) ||
					!isValidInteger(coleccionCampo.orden, true)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				coleccionCampo.id = null;
				const result = await this.coleccionCampoRepository.add(coleccionCampo);
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async modify(id: number, coleccionCampo: ColeccionCampo) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidInteger(coleccionCampo.idColeccion, true) ||
					!isValidInteger(coleccionCampo.idTipoVariable, true) ||
					!isValidString(coleccionCampo.campo, true) ||
					!isValidString(coleccionCampo.codigo, true) ||
					!isValidString(coleccionCampo.nombre, true) ||
					!isValidString(coleccionCampo.tipoDato, true) ||
					!isValidInteger(coleccionCampo.orden, true)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				const result = await this.coleccionCampoRepository.modify(id, coleccionCampo);
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
				const result = await this.coleccionCampoRepository.remove(id);
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
