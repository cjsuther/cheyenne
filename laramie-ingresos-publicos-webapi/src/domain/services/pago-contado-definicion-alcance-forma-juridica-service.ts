import PagoContadoDefinicionAlcanceFormaJuridica from '../entities/pago-contado-definicion-alcance-forma-juridica';
import IPagoContadoDefinicionAlcanceFormaJuridicaRepository from '../repositories/pago-contado-definicion-alcance-forma-juridica-repository';
import { isValidInteger,  } from '../../infraestructure/sdk/utils/validator';
import ValidationError from '../../infraestructure/sdk/error/validation-error';
import ProcessError from '../../infraestructure/sdk/error/process-error';
import ReferenceError from '../../infraestructure/sdk/error/reference-error';

export default class PagoContadoDefinicionAlcanceFormaJuridicaService {

	pagoContadoDefinicionAlcanceFormaJuridicaRepository: IPagoContadoDefinicionAlcanceFormaJuridicaRepository;

	constructor(pagoContadoDefinicionAlcanceFormaJuridicaRepository: IPagoContadoDefinicionAlcanceFormaJuridicaRepository) {
		this.pagoContadoDefinicionAlcanceFormaJuridicaRepository = pagoContadoDefinicionAlcanceFormaJuridicaRepository;
	}

	async list() {
		return new Promise( async (resolve, reject) => {
			try {
				const result = await this.pagoContadoDefinicionAlcanceFormaJuridicaRepository.list();
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
				const result = (await this.pagoContadoDefinicionAlcanceFormaJuridicaRepository.listByPagoContadoDefinicion(idPagoContadoDefinicion) as Array<PagoContadoDefinicionAlcanceFormaJuridica>).sort((a, b) => a.id - b.id);
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
				const result = await this.pagoContadoDefinicionAlcanceFormaJuridicaRepository.findById(id);
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

	async add(pagoContadoDefinicionAlcanceFormaJuridica: PagoContadoDefinicionAlcanceFormaJuridica) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidInteger(pagoContadoDefinicionAlcanceFormaJuridica.idPagoContadoDefinicion, true) ||
					!isValidInteger(pagoContadoDefinicionAlcanceFormaJuridica.idFormaJuridica, true)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				pagoContadoDefinicionAlcanceFormaJuridica.id = null;
				const result = await this.pagoContadoDefinicionAlcanceFormaJuridicaRepository.add(pagoContadoDefinicionAlcanceFormaJuridica);
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async modify(id: number, pagoContadoDefinicionAlcanceFormaJuridica: PagoContadoDefinicionAlcanceFormaJuridica) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidInteger(pagoContadoDefinicionAlcanceFormaJuridica.idPagoContadoDefinicion, true) ||
					!isValidInteger(pagoContadoDefinicionAlcanceFormaJuridica.idFormaJuridica, true)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				const result = await this.pagoContadoDefinicionAlcanceFormaJuridicaRepository.modify(id, pagoContadoDefinicionAlcanceFormaJuridica);
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
				const result = await this.pagoContadoDefinicionAlcanceFormaJuridicaRepository.remove(id);
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
				const result = await this.pagoContadoDefinicionAlcanceFormaJuridicaRepository.removeByPagoContadoDefinicion(idPagoContadoDefinicion);
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

}
