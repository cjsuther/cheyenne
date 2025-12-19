import VinculoEspecial from '../entities/vinculo-especial';
import VinculoEspecialState from '../dto/vinculo-especial-state';
import IVinculoEspecialRepository from '../repositories/vinculo-especial-repository';
import { isValidInteger, isValidDate, isValidFloat } from '../../infraestructure/sdk/utils/validator';
import ValidationError from '../../infraestructure/sdk/error/validation-error';
import ProcessError from '../../infraestructure/sdk/error/process-error';
import ReferenceError from '../../infraestructure/sdk/error/reference-error';

export default class VinculoEspecialService {

	vinculoEspecialRepository: IVinculoEspecialRepository;

	constructor(vinculoEspecialRepository: IVinculoEspecialRepository) {
		this.vinculoEspecialRepository = vinculoEspecialRepository;
	}

	async listByEspecial(idEspecial: number) {
		return new Promise( async (resolve, reject) => {
			try {
				const result = (await this.vinculoEspecialRepository.listByEspecial(idEspecial) as Array<VinculoEspecialState>).sort(
					(a, b) => (a.idTipoVinculoEspecial !== b.idTipoVinculoEspecial) ? a.idTipoVinculoEspecial - b.idTipoVinculoEspecial : a.id - b.id
				);
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
				const result = await this.vinculoEspecialRepository.findById(id);
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

	async add(vinculoEspecial: VinculoEspecial) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidInteger(vinculoEspecial.idEspecial, true) ||
					!isValidInteger(vinculoEspecial.idTipoVinculoEspecial, true) ||
					!isValidInteger(vinculoEspecial.idPersona, true) ||
					!isValidInteger(vinculoEspecial.idTipoInstrumento, false) ||
					!isValidDate(vinculoEspecial.fechaInstrumentoDesde, false) ||
					!isValidDate(vinculoEspecial.fechaInstrumentoHasta, false) ||
					!isValidFloat(vinculoEspecial.porcentajeCondominio, false)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				vinculoEspecial.id = null;
				if (vinculoEspecial.idTipoInstrumento === 0) vinculoEspecial.idTipoInstrumento = null;
				const result = await this.vinculoEspecialRepository.add(vinculoEspecial);
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async modify(id: number, vinculoEspecial: VinculoEspecial) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidInteger(vinculoEspecial.idEspecial, true) ||
					!isValidInteger(vinculoEspecial.idTipoVinculoEspecial, true) ||
					!isValidInteger(vinculoEspecial.idPersona, true) ||
					!isValidInteger(vinculoEspecial.idTipoInstrumento, false) ||
					!isValidDate(vinculoEspecial.fechaInstrumentoDesde, false) ||
					!isValidDate(vinculoEspecial.fechaInstrumentoHasta, false) ||
					!isValidFloat(vinculoEspecial.porcentajeCondominio, false)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				if (vinculoEspecial.idTipoInstrumento === 0) vinculoEspecial.idTipoInstrumento = null;
				const result = await this.vinculoEspecialRepository.modify(id, vinculoEspecial);
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
				const result = await this.vinculoEspecialRepository.remove(id);
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

	async removeByEspecial(idEspecial: number) {
		return new Promise( async (resolve, reject) => {
			try {
				const result = await this.vinculoEspecialRepository.removeByEspecial(idEspecial);
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

}
