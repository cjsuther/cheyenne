import PagoContadoDefinicionAlcanceZonaTarifaria from '../entities/pago-contado-definicion-alcance-zona-tarifaria';
import IPagoContadoDefinicionAlcanceZonaTarifariaRepository from '../repositories/pago-contado-definicion-alcance-zona-tarifaria-repository';
import { isValidInteger,  } from '../../infraestructure/sdk/utils/validator';
import ValidationError from '../../infraestructure/sdk/error/validation-error';
import ProcessError from '../../infraestructure/sdk/error/process-error';
import ReferenceError from '../../infraestructure/sdk/error/reference-error';

export default class PagoContadoDefinicionAlcanceZonaTarifariaService {

	pagoContadoDefinicionAlcanceZonaTarifariaRepository: IPagoContadoDefinicionAlcanceZonaTarifariaRepository;

	constructor(pagoContadoDefinicionAlcanceZonaTarifariaRepository: IPagoContadoDefinicionAlcanceZonaTarifariaRepository) {
		this.pagoContadoDefinicionAlcanceZonaTarifariaRepository = pagoContadoDefinicionAlcanceZonaTarifariaRepository;
	}

	async list() {
		return new Promise( async (resolve, reject) => {
			try {
				const result = await this.pagoContadoDefinicionAlcanceZonaTarifariaRepository.list();
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
				const result = (await this.pagoContadoDefinicionAlcanceZonaTarifariaRepository.listByPagoContadoDefinicion(idPagoContadoDefinicion) as Array<PagoContadoDefinicionAlcanceZonaTarifaria>).sort((a, b) => a.id - b.id);
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
				const result = await this.pagoContadoDefinicionAlcanceZonaTarifariaRepository.findById(id);
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

	async add(pagoContadoDefinicionAlcanceZonaTarifaria: PagoContadoDefinicionAlcanceZonaTarifaria) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidInteger(pagoContadoDefinicionAlcanceZonaTarifaria.idPagoContadoDefinicion, true) ||
					!isValidInteger(pagoContadoDefinicionAlcanceZonaTarifaria.idZonaTarifaria, true)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				pagoContadoDefinicionAlcanceZonaTarifaria.id = null;
				const result = await this.pagoContadoDefinicionAlcanceZonaTarifariaRepository.add(pagoContadoDefinicionAlcanceZonaTarifaria);
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async modify(id: number, pagoContadoDefinicionAlcanceZonaTarifaria: PagoContadoDefinicionAlcanceZonaTarifaria) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidInteger(pagoContadoDefinicionAlcanceZonaTarifaria.idPagoContadoDefinicion, true) ||
					!isValidInteger(pagoContadoDefinicionAlcanceZonaTarifaria.idZonaTarifaria, true)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				const result = await this.pagoContadoDefinicionAlcanceZonaTarifariaRepository.modify(id, pagoContadoDefinicionAlcanceZonaTarifaria);
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
				const result = await this.pagoContadoDefinicionAlcanceZonaTarifariaRepository.remove(id);
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
				const result = await this.pagoContadoDefinicionAlcanceZonaTarifariaRepository.removeByPagoContadoDefinicion(idPagoContadoDefinicion);
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

}
