import CodigoBarrasCliente from '../entities/codigo-barras-cliente';
import ICodigoBarrasClienteRepository from '../repositories/codigo-barras-cliente-repository';
import { isValidInteger, isValidString,  } from '../../infraestructure/sdk/utils/validator';
import ValidationError from '../../infraestructure/sdk/error/validation-error';
import ProcessError from '../../infraestructure/sdk/error/process-error';
import ReferenceError from '../../infraestructure/sdk/error/reference-error';

export default class CodigoBarrasClienteService {

	codigoBarrasClienteRepository: ICodigoBarrasClienteRepository;

	constructor(codigoBarrasClienteRepository: ICodigoBarrasClienteRepository) {
		this.codigoBarrasClienteRepository = codigoBarrasClienteRepository;
	}

	async list() {
		return new Promise( async (resolve, reject) => {
			try {
				const result = await this.codigoBarrasClienteRepository.list();
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async listByCodigoBarras(codigoBarras:string) {
		return new Promise( async (resolve, reject) => {
			try {
				const result = await this.codigoBarrasClienteRepository.listByCodigoBarras(codigoBarras) as CodigoBarrasCliente[];
				result.sort((a,b) => a.id - b.id);
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
				const result = await this.codigoBarrasClienteRepository.findById(id);
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

	async findByCodigoBarrasCliente(codigoBarrasCliente:string) {
		return new Promise( async (resolve, reject) => {
			try {			   
				const result = await this.codigoBarrasClienteRepository.findByCodigoBarrasCliente(codigoBarrasCliente);
				if (!result) {
					reject(new ReferenceError('No existe el código de barras'));
					return;
				}
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async add(codigoBarrasCliente: CodigoBarrasCliente) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidInteger(codigoBarrasCliente.idTipoCodigoBarras, true) ||
					!isValidString(codigoBarrasCliente.codigoBarras, true) ||
					!isValidString(codigoBarrasCliente.codigoBarrasCliente, true)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				codigoBarrasCliente.id = null;
				const result = await this.codigoBarrasClienteRepository.add(codigoBarrasCliente);
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async modify(id: number, codigoBarrasCliente: CodigoBarrasCliente) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidInteger(codigoBarrasCliente.idTipoCodigoBarras, true) ||
					!isValidString(codigoBarrasCliente.codigoBarras, true) ||
					!isValidString(codigoBarrasCliente.codigoBarrasCliente, true)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				const result = await this.codigoBarrasClienteRepository.modify(id, codigoBarrasCliente);
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
				const result = await this.codigoBarrasClienteRepository.remove(id);
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
