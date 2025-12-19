import EdesurCliente from '../entities/edesur-cliente';
import IEdesurClienteRepository from '../repositories/edesur-cliente-repository';
import { isValidInteger, isValidString, isValidDate,  } from '../../infraestructure/sdk/utils/validator';
import ValidationError from '../../infraestructure/sdk/error/validation-error';
import ProcessError from '../../infraestructure/sdk/error/process-error';
import ReferenceError from '../../infraestructure/sdk/error/reference-error';

export default class EdesurClienteService {

	edesurClienteRepository: IEdesurClienteRepository;

	constructor(edesurClienteRepository: IEdesurClienteRepository) {
		this.edesurClienteRepository = edesurClienteRepository;
	}

	async listByEdesur(idEdesur: number) {
		return new Promise( async (resolve, reject) => {
			try {
				const result = await this.edesurClienteRepository.listByEdesur(idEdesur);
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
				const result = await this.edesurClienteRepository.findById(id);
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

	async add(edesurCliente: EdesurCliente) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidInteger(edesurCliente.idEdesur, true) ||
					!isValidInteger(edesurCliente.idPersona, true) ||
					!isValidInteger(edesurCliente.idTipoPersona, true) ||
					!isValidString(edesurCliente.nombrePersona, true) ||
					!isValidInteger(edesurCliente.idTipoDocumento, true) ||
					!isValidString(edesurCliente.numeroDocumento, true) ||
					!isValidString(edesurCliente.codigoCliente, true) ||
					!isValidDate(edesurCliente.fechaDesde, true) ||
					!isValidDate(edesurCliente.fechaHasta, false)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				edesurCliente.id = null;
				const result = await this.edesurClienteRepository.add(edesurCliente);
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async modify(id: number, edesurCliente: EdesurCliente) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidInteger(edesurCliente.idEdesur, true) ||
					!isValidInteger(edesurCliente.idPersona, true) ||
					!isValidInteger(edesurCliente.idTipoPersona, true) ||
					!isValidString(edesurCliente.nombrePersona, true) ||
					!isValidInteger(edesurCliente.idTipoDocumento, true) ||
					!isValidString(edesurCliente.numeroDocumento, true) ||
					!isValidString(edesurCliente.codigoCliente, true) ||
					!isValidDate(edesurCliente.fechaDesde, true) ||
					!isValidDate(edesurCliente.fechaHasta, false)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				const result = await this.edesurClienteRepository.modify(id, edesurCliente);
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
				const result = await this.edesurClienteRepository.remove(id);
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
