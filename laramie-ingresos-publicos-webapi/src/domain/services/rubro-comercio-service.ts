import RubroComercio from '../entities/rubro-comercio';
import RubroComercioState from '../dto/rubro-comercio-state';
import IRubroComercioRepository from '../repositories/rubro-comercio-repository';
import { isValidInteger, isValidString, isValidBoolean, isValidDate  } from '../../infraestructure/sdk/utils/validator';
import ValidationError from '../../infraestructure/sdk/error/validation-error';
import ProcessError from '../../infraestructure/sdk/error/process-error';
import ReferenceError from '../../infraestructure/sdk/error/reference-error';

export default class RubroComercioService {

	rubroComercioRepository: IRubroComercioRepository;

	constructor(rubroComercioRepository: IRubroComercioRepository) {
		this.rubroComercioRepository = rubroComercioRepository;
	}

	async listByComercio(idComercio: number) {
		return new Promise( async (resolve, reject) => {
			try {
				const result = (await this.rubroComercioRepository.listByComercio(idComercio) as Array<RubroComercioState>).sort((a, b) => a.id - b.id);
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
				const result = await this.rubroComercioRepository.findById(id);
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

	async add(rubroComercio: RubroComercio) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidInteger(rubroComercio.idComercio, true) ||
					!isValidInteger(rubroComercio.idTipoRubroComercio, true) ||
					!isValidInteger(rubroComercio.idUbicacionComercio, true) ||
					!isValidInteger(rubroComercio.idRubroLiquidacion, true) ||
					!isValidInteger(rubroComercio.idRubroProvincia, true) ||
					!isValidInteger(rubroComercio.idRubroBCRA, true) ||
					!isValidString(rubroComercio.descripcion, true) ||
					!isValidBoolean(rubroComercio.esDeOficio) ||
					!isValidBoolean(rubroComercio.esRubroPrincipal) ||
					!isValidBoolean(rubroComercio.esConDDJJ)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				rubroComercio.id = null;
				const result = await this.rubroComercioRepository.add(rubroComercio);
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async modify(id: number, rubroComercio: RubroComercio) {
		return new Promise( async (resolve, reject) => {
			try {				
				if (
					!isValidInteger(rubroComercio.idComercio, true) ||
					!isValidInteger(rubroComercio.idTipoRubroComercio, true) ||
					!isValidInteger(rubroComercio.idUbicacionComercio, true) ||
					!isValidInteger(rubroComercio.idRubroLiquidacion, true) ||
					!isValidInteger(rubroComercio.idRubroProvincia, true) ||
					!isValidInteger(rubroComercio.idRubroBCRA, true) ||
					!isValidString(rubroComercio.descripcion, true) ||
					!isValidBoolean(rubroComercio.esDeOficio) ||
					!isValidBoolean(rubroComercio.esRubroPrincipal) ||
					!isValidBoolean(rubroComercio.esConDDJJ)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				const result = await this.rubroComercioRepository.modify(id, rubroComercio);
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
				const result = await this.rubroComercioRepository.remove(id);
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

	async removeByComercio(idComercio: number) {
		return new Promise( async (resolve, reject) => {
			try {
				const list = (await this.rubroComercioRepository.listByComercio(idComercio) as Array<RubroComercioState>)
				for (let i=0; i<list.length; i++) {
					const row = list[i];
					await this.remove(row.id);
				}
				resolve(idComercio);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

}
