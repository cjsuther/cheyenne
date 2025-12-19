import VinculoFondeadero from '../entities/vinculo-fondeadero';
import VinculoFondeaderoState from '../dto/vinculo-fondeadero-state';
import IVinculoFondeaderoRepository from '../repositories/vinculo-fondeadero-repository';
import { isValidInteger, isValidDate, isValidFloat } from '../../infraestructure/sdk/utils/validator';
import ValidationError from '../../infraestructure/sdk/error/validation-error';
import ProcessError from '../../infraestructure/sdk/error/process-error';
import ReferenceError from '../../infraestructure/sdk/error/reference-error';

export default class VinculoFondeaderoService {

	vinculoFondeaderoRepository: IVinculoFondeaderoRepository;

	constructor(vinculoFondeaderoRepository: IVinculoFondeaderoRepository) {
		this.vinculoFondeaderoRepository = vinculoFondeaderoRepository;
	}

	async listByFondeadero(idFondeadero: number) {
		return new Promise( async (resolve, reject) => {
			try {
				const result = (await this.vinculoFondeaderoRepository.listByFondeadero(idFondeadero) as Array<VinculoFondeaderoState>).sort(
					(a, b) => (a.idTipoVinculoFondeadero !== b.idTipoVinculoFondeadero) ? a.idTipoVinculoFondeadero - b.idTipoVinculoFondeadero : a.id - b.id
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
				const result = await this.vinculoFondeaderoRepository.findById(id);
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

	async add(vinculoFondeadero: VinculoFondeadero) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidInteger(vinculoFondeadero.idFondeadero, true) ||
					!isValidInteger(vinculoFondeadero.idTipoVinculoFondeadero, true) ||
					!isValidInteger(vinculoFondeadero.idPersona, true) ||
					!isValidInteger(vinculoFondeadero.idTipoInstrumento, false) ||
					!isValidDate(vinculoFondeadero.fechaInstrumentoDesde, false) ||
					!isValidDate(vinculoFondeadero.fechaInstrumentoHasta, false) ||
					!isValidFloat(vinculoFondeadero.porcentajeCondominio, false)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				vinculoFondeadero.id = null;
				if (vinculoFondeadero.idTipoInstrumento === 0) vinculoFondeadero.idTipoInstrumento = null;
				const result = await this.vinculoFondeaderoRepository.add(vinculoFondeadero);
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async modify(id: number, vinculoFondeadero: VinculoFondeadero) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidInteger(vinculoFondeadero.idFondeadero, true) ||
					!isValidInteger(vinculoFondeadero.idTipoVinculoFondeadero, true) ||
					!isValidInteger(vinculoFondeadero.idPersona, true) ||
					!isValidInteger(vinculoFondeadero.idTipoInstrumento, false) ||
					!isValidDate(vinculoFondeadero.fechaInstrumentoDesde, false) ||
					!isValidDate(vinculoFondeadero.fechaInstrumentoHasta, false) ||
					!isValidFloat(vinculoFondeadero.porcentajeCondominio, false)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				if (vinculoFondeadero.idTipoInstrumento === 0) vinculoFondeadero.idTipoInstrumento = null;
				const result = await this.vinculoFondeaderoRepository.modify(id, vinculoFondeadero);
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
				const result = await this.vinculoFondeaderoRepository.remove(id);
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

	async removeByFondeadero(idFondeadero: number) {
		return new Promise( async (resolve, reject) => {
			try {
				const result = await this.vinculoFondeaderoRepository.removeByFondeadero(idFondeadero);
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

}
