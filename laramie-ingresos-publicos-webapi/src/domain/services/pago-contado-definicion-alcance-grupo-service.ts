import PagoContadoDefinicionAlcanceGrupo from '../entities/pago-contado-definicion-alcance-grupo';
import IPagoContadoDefinicionAlcanceGrupoRepository from '../repositories/pago-contado-definicion-alcance-grupo-repository';
import { isValidInteger,  } from '../../infraestructure/sdk/utils/validator';
import ValidationError from '../../infraestructure/sdk/error/validation-error';
import ProcessError from '../../infraestructure/sdk/error/process-error';
import ReferenceError from '../../infraestructure/sdk/error/reference-error';

export default class PagoContadoDefinicionAlcanceGrupoService {

	pagoContadoDefinicionAlcanceGrupoRepository: IPagoContadoDefinicionAlcanceGrupoRepository;

	constructor(pagoContadoDefinicionAlcanceGrupoRepository: IPagoContadoDefinicionAlcanceGrupoRepository) {
		this.pagoContadoDefinicionAlcanceGrupoRepository = pagoContadoDefinicionAlcanceGrupoRepository;
	}

	async list() {
		return new Promise( async (resolve, reject) => {
			try {
				const result = await this.pagoContadoDefinicionAlcanceGrupoRepository.list();
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
				const result = (await this.pagoContadoDefinicionAlcanceGrupoRepository.listByPagoContadoDefinicion(idPagoContadoDefinicion) as Array<PagoContadoDefinicionAlcanceGrupo>).sort((a, b) => a.id - b.id);
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
				const result = await this.pagoContadoDefinicionAlcanceGrupoRepository.findById(id);
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

	async add(pagoContadoDefinicionAlcanceGrupo: PagoContadoDefinicionAlcanceGrupo) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidInteger(pagoContadoDefinicionAlcanceGrupo.idPagoContadoDefinicion, true) ||
					!isValidInteger(pagoContadoDefinicionAlcanceGrupo.idGrupo, true)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				pagoContadoDefinicionAlcanceGrupo.id = null;
				const result = await this.pagoContadoDefinicionAlcanceGrupoRepository.add(pagoContadoDefinicionAlcanceGrupo);
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async modify(id: number, pagoContadoDefinicionAlcanceGrupo: PagoContadoDefinicionAlcanceGrupo) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidInteger(pagoContadoDefinicionAlcanceGrupo.idPagoContadoDefinicion, true) ||
					!isValidInteger(pagoContadoDefinicionAlcanceGrupo.idGrupo, true)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				const result = await this.pagoContadoDefinicionAlcanceGrupoRepository.modify(id, pagoContadoDefinicionAlcanceGrupo);
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
				const result = await this.pagoContadoDefinicionAlcanceGrupoRepository.remove(id);
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
				const result = await this.pagoContadoDefinicionAlcanceGrupoRepository.removeByPagoContadoDefinicion(idPagoContadoDefinicion);
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

}
