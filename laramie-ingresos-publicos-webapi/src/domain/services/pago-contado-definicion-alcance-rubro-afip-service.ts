import PagoContadoDefinicionAlcanceRubroAfip from '../entities/pago-contado-definicion-alcance-rubro-afip';
import IPagoContadoDefinicionAlcanceRubroAfipRepository from '../repositories/pago-contado-definicion-alcance-rubro-afip-repository';
import { isValidInteger,  } from '../../infraestructure/sdk/utils/validator';
import ValidationError from '../../infraestructure/sdk/error/validation-error';
import ProcessError from '../../infraestructure/sdk/error/process-error';
import ReferenceError from '../../infraestructure/sdk/error/reference-error';

export default class PagoContadoDefinicionAlcanceRubroAfipService {

	pagoContadoDefinicionAlcanceRubroAfipRepository: IPagoContadoDefinicionAlcanceRubroAfipRepository;

	constructor(pagoContadoDefinicionAlcanceRubroAfipRepository: IPagoContadoDefinicionAlcanceRubroAfipRepository) {
		this.pagoContadoDefinicionAlcanceRubroAfipRepository = pagoContadoDefinicionAlcanceRubroAfipRepository;
	}

	async list() {
		return new Promise( async (resolve, reject) => {
			try {
				const result = await this.pagoContadoDefinicionAlcanceRubroAfipRepository.list();
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
				const result = (await this.pagoContadoDefinicionAlcanceRubroAfipRepository.listByPagoContadoDefinicion(idPagoContadoDefinicion) as Array<PagoContadoDefinicionAlcanceRubroAfip>).sort((a, b) => a.id - b.id);
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
				const result = await this.pagoContadoDefinicionAlcanceRubroAfipRepository.findById(id);
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

	async add(pagoContadoDefinicionAlcanceRubroAfip: PagoContadoDefinicionAlcanceRubroAfip) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidInteger(pagoContadoDefinicionAlcanceRubroAfip.idPagoContadoDefinicion, true) ||
					!isValidInteger(pagoContadoDefinicionAlcanceRubroAfip.idRubroAfip, true)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				pagoContadoDefinicionAlcanceRubroAfip.id = null;
				const result = await this.pagoContadoDefinicionAlcanceRubroAfipRepository.add(pagoContadoDefinicionAlcanceRubroAfip);
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async modify(id: number, pagoContadoDefinicionAlcanceRubroAfip: PagoContadoDefinicionAlcanceRubroAfip) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidInteger(pagoContadoDefinicionAlcanceRubroAfip.idPagoContadoDefinicion, true) ||
					!isValidInteger(pagoContadoDefinicionAlcanceRubroAfip.idRubroAfip, true)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				const result = await this.pagoContadoDefinicionAlcanceRubroAfipRepository.modify(id, pagoContadoDefinicionAlcanceRubroAfip);
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
				const result = await this.pagoContadoDefinicionAlcanceRubroAfipRepository.remove(id);
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
				const result = await this.pagoContadoDefinicionAlcanceRubroAfipRepository.removeByPagoContadoDefinicion(idPagoContadoDefinicion);
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

}
