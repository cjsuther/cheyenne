import PagoContadoDefinicionAlcanceTasa from '../entities/pago-contado-definicion-alcance-tasa';
import IPagoContadoDefinicionAlcanceTasaRepository from '../repositories/pago-contado-definicion-alcance-tasa-repository';
import { isValidInteger,  } from '../../infraestructure/sdk/utils/validator';
import ValidationError from '../../infraestructure/sdk/error/validation-error';
import ProcessError from '../../infraestructure/sdk/error/process-error';
import ReferenceError from '../../infraestructure/sdk/error/reference-error';

export default class PagoContadoDefinicionAlcanceTasaService {

	pagoContadoDefinicionAlcanceTasaRepository: IPagoContadoDefinicionAlcanceTasaRepository;

	constructor(pagoContadoDefinicionAlcanceTasaRepository: IPagoContadoDefinicionAlcanceTasaRepository) {
		this.pagoContadoDefinicionAlcanceTasaRepository = pagoContadoDefinicionAlcanceTasaRepository;
	}

	async list() {
		return new Promise( async (resolve, reject) => {
			try {
				const result = await this.pagoContadoDefinicionAlcanceTasaRepository.list();
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async listByPagoContadoDefinicion(idPagoContadoDefinicion: number) {
		return new Promise( async (resolve, reject) => {
			try {
				const result = (await this.pagoContadoDefinicionAlcanceTasaRepository.listByPagoContadoDefinicion(idPagoContadoDefinicion) as Array<PagoContadoDefinicionAlcanceTasa>).sort((a, b) => a.id - b.id);
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
				const result = await this.pagoContadoDefinicionAlcanceTasaRepository.findById(id);
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

	async add(pagoContadoDefinicionAlcanceTasa: PagoContadoDefinicionAlcanceTasa) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidInteger(pagoContadoDefinicionAlcanceTasa.idPagoContadoDefinicion, true) ||
					!isValidInteger(pagoContadoDefinicionAlcanceTasa.idTasa, true) ||
					!isValidInteger(pagoContadoDefinicionAlcanceTasa.idSubTasa, true)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				pagoContadoDefinicionAlcanceTasa.id = null;
				const result = await this.pagoContadoDefinicionAlcanceTasaRepository.add(pagoContadoDefinicionAlcanceTasa);
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async modify(id: number, pagoContadoDefinicionAlcanceTasa: PagoContadoDefinicionAlcanceTasa) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidInteger(pagoContadoDefinicionAlcanceTasa.idPagoContadoDefinicion, true) ||
					!isValidInteger(pagoContadoDefinicionAlcanceTasa.idTasa, true) ||
					!isValidInteger(pagoContadoDefinicionAlcanceTasa.idSubTasa, true)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				const result = await this.pagoContadoDefinicionAlcanceTasaRepository.modify(id, pagoContadoDefinicionAlcanceTasa);
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
				const result = await this.pagoContadoDefinicionAlcanceTasaRepository.remove(id);
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

	async removeByPagoContadoDefinicion(idPagoContadoDefinicion: number) {
		return new Promise( async (resolve, reject) => {
			try {
				const result = await this.pagoContadoDefinicionAlcanceTasaRepository.removeByPagoContadoDefinicion(idPagoContadoDefinicion);
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

}
