import FuncionParametro from '../entities/funcion-parametro';
import IFuncionParametroRepository from '../repositories/funcion-parametro-repository';
import { isValidInteger, isValidString,  } from '../../infraestructure/sdk/utils/validator';
import ValidationError from '../../infraestructure/sdk/error/validation-error';
import ProcessError from '../../infraestructure/sdk/error/process-error';
import ReferenceError from '../../infraestructure/sdk/error/reference-error';

export default class FuncionParametroService {

	funcionParametroRepository: IFuncionParametroRepository;

	constructor(funcionParametroRepository: IFuncionParametroRepository) {
		this.funcionParametroRepository = funcionParametroRepository;
	}

	async list() {
		return new Promise( async (resolve, reject) => {
			try {
				const result = await this.funcionParametroRepository.list();
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async listByFuncion(idFuncion: number) {
		return new Promise( async (resolve, reject) => {
			try {
				const result = await this.funcionParametroRepository.listByFuncion(idFuncion).sort((a, b) => a.orden - b.orden);
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
				const result = await this.funcionParametroRepository.findById(id);
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

	async add(funcionParametro: FuncionParametro) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidInteger(funcionParametro.idFuncion, true) ||
					!isValidString(funcionParametro.codigo, true) ||
					!isValidString(funcionParametro.nombre, true) ||
					!isValidString(funcionParametro.tipoDato, true) ||
					!isValidInteger(funcionParametro.orden, true)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				funcionParametro.id = null;
				const result = await this.funcionParametroRepository.add(funcionParametro);
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async modify(id: number, funcionParametro: FuncionParametro) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidInteger(funcionParametro.idFuncion, true) ||
					!isValidString(funcionParametro.codigo, true) ||
					!isValidString(funcionParametro.nombre, true) ||
					!isValidString(funcionParametro.tipoDato, true) ||
					!isValidInteger(funcionParametro.orden, true)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				const result = await this.funcionParametroRepository.modify(id, funcionParametro);
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
				const result = await this.funcionParametroRepository.remove(id);
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
