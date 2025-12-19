import Recaudadora from '../entities/recaudadora';
import IRecaudadoraRepository from '../repositories/recaudadora-repository';
import { isValidString, isValidInteger,  } from '../../infraestructure/sdk/utils/validator';
import ValidationError from '../../infraestructure/sdk/error/validation-error';
import ProcessError from '../../infraestructure/sdk/error/process-error';
import ReferenceError from '../../infraestructure/sdk/error/reference-error';

export default class RecaudadoraService {

	recaudadoraRepository: IRecaudadoraRepository;

	constructor(recaudadoraRepository: IRecaudadoraRepository) {
		this.recaudadoraRepository = recaudadoraRepository;
	}

	async list() {
		return new Promise( async (resolve, reject) => {
			try {
				const result = await this.recaudadoraRepository.list();
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
				const result = await this.recaudadoraRepository.findById(id);
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
				const result = await this.recaudadoraRepository.findByCodigo(codigo);
				if (!result) {
					reject(new ReferenceError('No existe la Recaudadora'));
					return;
				}
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async add(recaudadora: Recaudadora) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidString(recaudadora.codigo, true) ||
					!isValidString(recaudadora.nombre, true) ||
					!isValidInteger(recaudadora.orden, true) ||
					!isValidString(recaudadora.codigoCliente, true) ||
					!isValidInteger(recaudadora.idLugarPago, true) ||
					!isValidInteger(recaudadora.idMetodoImportacion, true)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				recaudadora.id = null;
				const result = await this.recaudadoraRepository.add(recaudadora);
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async modify(id: number, recaudadora: Recaudadora) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidString(recaudadora.codigo, true) ||
					!isValidString(recaudadora.nombre, true) ||
					!isValidInteger(recaudadora.orden, true) ||
					!isValidString(recaudadora.codigoCliente, true) ||
					!isValidInteger(recaudadora.idLugarPago, true) ||
					!isValidInteger(recaudadora.idMetodoImportacion, true)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				const result = await this.recaudadoraRepository.modify(id, recaudadora);
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
				const result = await this.recaudadoraRepository.remove(id);
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
