import TemaExpediente from '../entities/tema-expediente';
import ITemaExpedienteRepository from '../repositories/tema-expediente-repository';
import { isValidString, isValidInteger, isValidDate,  } from '../../infraestructure/sdk/utils/validator';
import ValidationError from '../../infraestructure/sdk/error/validation-error';
import ProcessError from '../../infraestructure/sdk/error/process-error';
import ReferenceError from '../../infraestructure/sdk/error/reference-error';

export default class TemaExpedienteService {

	temaExpedienteRepository: ITemaExpedienteRepository;

	constructor(temaExpedienteRepository: ITemaExpedienteRepository) {
		this.temaExpedienteRepository = temaExpedienteRepository;
	}

	async list() {
		return new Promise( async (resolve, reject) => {
			try {
				const result = await this.temaExpedienteRepository.list();
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
				const result = await this.temaExpedienteRepository.findById(id);
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

	async add(temaExpediente: TemaExpediente) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidString(temaExpediente.codigo, true) ||
					!isValidString(temaExpediente.nombre, true) ||
					!isValidInteger(temaExpediente.orden, true) ||
					!isValidInteger(temaExpediente.ejercicioOficina, true) ||
					!isValidInteger(temaExpediente.oficina, true) ||
					!isValidString(temaExpediente.detalle, true) ||
					!isValidInteger(temaExpediente.plazo, true) ||
					!isValidDate(temaExpediente.fechaAlta, true) ||
					!isValidDate(temaExpediente.fechaBaja, true)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				temaExpediente.id = null;
				const result = await this.temaExpedienteRepository.add(temaExpediente);
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async modify(id: number, temaExpediente: TemaExpediente) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidString(temaExpediente.codigo, true) ||
					!isValidString(temaExpediente.nombre, true) ||
					!isValidInteger(temaExpediente.orden, true) ||
					!isValidInteger(temaExpediente.ejercicioOficina, true) ||
					!isValidInteger(temaExpediente.oficina, true) ||
					!isValidString(temaExpediente.detalle, true) ||
					!isValidInteger(temaExpediente.plazo, true) ||
					!isValidDate(temaExpediente.fechaAlta, true) ||
					!isValidDate(temaExpediente.fechaBaja, true)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				const result = await this.temaExpedienteRepository.modify(id, temaExpediente);
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
				const result = await this.temaExpedienteRepository.remove(id);
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
