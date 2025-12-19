import VinculoInmueble from '../entities/vinculo-inmueble';
import VinculoInmuebleState from '../dto/vinculo-inmueble-state';
import IVinculoInmuebleRepository from '../repositories/vinculo-inmueble-repository';
import { isValidInteger, isValidDate, isValidFloat } from '../../infraestructure/sdk/utils/validator';
import ValidationError from '../../infraestructure/sdk/error/validation-error';
import ProcessError from '../../infraestructure/sdk/error/process-error';
import ReferenceError from '../../infraestructure/sdk/error/reference-error';

export default class VinculoInmuebleService {

	vinculoInmuebleRepository: IVinculoInmuebleRepository;

	constructor(vinculoInmuebleRepository: IVinculoInmuebleRepository) {
		this.vinculoInmuebleRepository = vinculoInmuebleRepository;
	}

	async listByInmueble(idInmueble: number) {
		return new Promise( async (resolve, reject) => {
			try {
				const result = (await this.vinculoInmuebleRepository.listByInmueble(idInmueble) as Array<VinculoInmuebleState>).sort(
					(a, b) => (a.idTipoVinculoInmueble !== b.idTipoVinculoInmueble) ? a.idTipoVinculoInmueble - b.idTipoVinculoInmueble : a.id - b.id
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
				const result = await this.vinculoInmuebleRepository.findById(id);
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

	async add(vinculoInmueble: VinculoInmueble) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidInteger(vinculoInmueble.idInmueble, true) ||
					!isValidInteger(vinculoInmueble.idTipoVinculoInmueble, true) ||
					!isValidInteger(vinculoInmueble.idPersona, true) ||
					!isValidInteger(vinculoInmueble.idTipoInstrumento, false) ||
					!isValidDate(vinculoInmueble.fechaInstrumentoDesde, false) ||
					!isValidDate(vinculoInmueble.fechaInstrumentoHasta, false) ||
					!isValidFloat(vinculoInmueble.porcentajeCondominio, false)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				vinculoInmueble.id = null;
				if (vinculoInmueble.idTipoInstrumento === 0) vinculoInmueble.idTipoInstrumento = null;
				const result = await this.vinculoInmuebleRepository.add(vinculoInmueble);
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async modify(id: number, vinculoInmueble: VinculoInmueble) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidInteger(vinculoInmueble.idInmueble, true) ||
					!isValidInteger(vinculoInmueble.idTipoVinculoInmueble, true) ||
					!isValidInteger(vinculoInmueble.idPersona, true) ||
					!isValidInteger(vinculoInmueble.idTipoInstrumento, false) ||
					!isValidDate(vinculoInmueble.fechaInstrumentoDesde, false) ||
					!isValidDate(vinculoInmueble.fechaInstrumentoHasta, false) ||
					!isValidFloat(vinculoInmueble.porcentajeCondominio, false)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				if (vinculoInmueble.idTipoInstrumento === 0) vinculoInmueble.idTipoInstrumento = null;
				const result = await this.vinculoInmuebleRepository.modify(id, vinculoInmueble);
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
				const result = await this.vinculoInmuebleRepository.remove(id);
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

	async removeByInmueble(idInmueble: number) {
		return new Promise( async (resolve, reject) => {
			try {
				const result = await this.vinculoInmuebleRepository.removeByInmueble(idInmueble);
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

}
