import ConvenioParametro from '../entities/convenio-parametro';
import IConvenioParametroRepository from '../repositories/convenio-parametro-repository';
import { isValidInteger, isValidString,  } from '../../infraestructure/sdk/utils/validator';
import ValidationError from '../../infraestructure/sdk/error/validation-error';
import ProcessError from '../../infraestructure/sdk/error/process-error';
import ReferenceError from '../../infraestructure/sdk/error/reference-error';

export default class ConvenioParametroService {

	convenioParametroRepository: IConvenioParametroRepository;

	constructor(convenioParametroRepository: IConvenioParametroRepository) {
		this.convenioParametroRepository = convenioParametroRepository;
	}

	async list() {
		return new Promise( async (resolve, reject) => {
			try {
				const result = await this.convenioParametroRepository.list();
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
				const result = await this.convenioParametroRepository.findById(id);
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

	async add(convenioParametro: ConvenioParametro) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidString(convenioParametro.codigo, true) ||
					!isValidString(convenioParametro.nombre, true) ||
					!isValidInteger(convenioParametro.orden, true)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				convenioParametro.id = null;
				const result = await this.convenioParametroRepository.add(convenioParametro);
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async modify(id: number, convenioParametro: ConvenioParametro) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidString(convenioParametro.codigo, true) ||
					!isValidString(convenioParametro.nombre, true) ||
					!isValidInteger(convenioParametro.orden, true)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				const result = await this.convenioParametroRepository.modify(id, convenioParametro);
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
				const result = await this.convenioParametroRepository.remove(id);
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
