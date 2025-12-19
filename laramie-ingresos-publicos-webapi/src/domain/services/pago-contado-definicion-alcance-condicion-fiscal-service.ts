import PagoContadoDefinicionAlcanceCondicionFiscal from '../entities/pago-contado-definicion-alcance-condicion-fiscal';
import IPagoContadoDefinicionAlcanceCondicionFiscalRepository from '../repositories/pago-contado-definicion-alcance-condicion-fiscal-repository';
import { isValidInteger,  } from '../../infraestructure/sdk/utils/validator';
import ValidationError from '../../infraestructure/sdk/error/validation-error';
import ProcessError from '../../infraestructure/sdk/error/process-error';
import ReferenceError from '../../infraestructure/sdk/error/reference-error';

export default class PagoContadoDefinicionAlcanceCondicionFiscalService {

	pagoContadoDefinicionAlcanceCondicionFiscalRepository: IPagoContadoDefinicionAlcanceCondicionFiscalRepository;

	constructor(pagoContadoDefinicionAlcanceCondicionFiscalRepository: IPagoContadoDefinicionAlcanceCondicionFiscalRepository) {
		this.pagoContadoDefinicionAlcanceCondicionFiscalRepository = pagoContadoDefinicionAlcanceCondicionFiscalRepository;
	}

	async list() {
		return new Promise( async (resolve, reject) => {
			try {
				const result = await this.pagoContadoDefinicionAlcanceCondicionFiscalRepository.list();
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
				const result = (await this.pagoContadoDefinicionAlcanceCondicionFiscalRepository.listByPagoContadoDefinicion(idPagoContadoDefinicion) as Array<PagoContadoDefinicionAlcanceCondicionFiscal>).sort((a, b) => a.id - b.id);
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
				const result = await this.pagoContadoDefinicionAlcanceCondicionFiscalRepository.findById(id);
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

	async add(pagoContadoDefinicionAlcanceCondicionFiscal: PagoContadoDefinicionAlcanceCondicionFiscal) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidInteger(pagoContadoDefinicionAlcanceCondicionFiscal.idPagoContadoDefinicion, true) ||
					!isValidInteger(pagoContadoDefinicionAlcanceCondicionFiscal.idCondicionFiscal, true)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				pagoContadoDefinicionAlcanceCondicionFiscal.id = null;
				const result = await this.pagoContadoDefinicionAlcanceCondicionFiscalRepository.add(pagoContadoDefinicionAlcanceCondicionFiscal);
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async modify(id: number, pagoContadoDefinicionAlcanceCondicionFiscal: PagoContadoDefinicionAlcanceCondicionFiscal) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidInteger(pagoContadoDefinicionAlcanceCondicionFiscal.idPagoContadoDefinicion, true) ||
					!isValidInteger(pagoContadoDefinicionAlcanceCondicionFiscal.idCondicionFiscal, true)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				const result = await this.pagoContadoDefinicionAlcanceCondicionFiscalRepository.modify(id, pagoContadoDefinicionAlcanceCondicionFiscal);
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
				const result = await this.pagoContadoDefinicionAlcanceCondicionFiscalRepository.remove(id);
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
				const result = await this.pagoContadoDefinicionAlcanceCondicionFiscalRepository.removeByPagoContadoDefinicion(idPagoContadoDefinicion);
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

}
