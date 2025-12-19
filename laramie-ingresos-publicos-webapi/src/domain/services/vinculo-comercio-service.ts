import VinculoComercio from '../entities/vinculo-comercio';
import VinculoComercioState from '../dto/vinculo-comercio-state';
import IVinculoComercioRepository from '../repositories/vinculo-comercio-repository';
import { isValidInteger, isValidDate, isValidFloat } from '../../infraestructure/sdk/utils/validator';
import ValidationError from '../../infraestructure/sdk/error/validation-error';
import ProcessError from '../../infraestructure/sdk/error/process-error';
import ReferenceError from '../../infraestructure/sdk/error/reference-error';

export default class VinculoComercioService {

	vinculoComercioRepository: IVinculoComercioRepository;

	constructor(vinculoComercioRepository: IVinculoComercioRepository) {
		this.vinculoComercioRepository = vinculoComercioRepository;
	}

	async listByComercio(idComercio: number) {
		return new Promise( async (resolve, reject) => {
			try {
				const result = (await this.vinculoComercioRepository.listByComercio(idComercio) as Array<VinculoComercioState>).sort(
					(a, b) => (a.idTipoVinculoComercio !== b.idTipoVinculoComercio) ? a.idTipoVinculoComercio - b.idTipoVinculoComercio : a.id - b.id
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
				const result = await this.vinculoComercioRepository.findById(id);
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

	async add(vinculoComercio: VinculoComercio) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidInteger(vinculoComercio.idComercio, true) ||
					!isValidInteger(vinculoComercio.idTipoVinculoComercio, true) ||
					!isValidInteger(vinculoComercio.idPersona, true) ||
					!isValidInteger(vinculoComercio.idTipoInstrumento, false) ||
					!isValidDate(vinculoComercio.fechaInstrumentoDesde, false) ||
					!isValidDate(vinculoComercio.fechaInstrumentoHasta, false) ||
					!isValidFloat(vinculoComercio.porcentajeCondominio, false)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				vinculoComercio.id = null;
				if (vinculoComercio.idTipoInstrumento === 0) vinculoComercio.idTipoInstrumento = null;
				const result = await this.vinculoComercioRepository.add(vinculoComercio);
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async modify(id: number, vinculoComercio: VinculoComercio) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidInteger(vinculoComercio.idComercio, true) ||
					!isValidInteger(vinculoComercio.idTipoVinculoComercio, true) ||
					!isValidInteger(vinculoComercio.idPersona, true) ||
					!isValidInteger(vinculoComercio.idTipoInstrumento, false) ||
					!isValidDate(vinculoComercio.fechaInstrumentoDesde, false) ||
					!isValidDate(vinculoComercio.fechaInstrumentoHasta, false) ||
					!isValidFloat(vinculoComercio.porcentajeCondominio, false)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				if (vinculoComercio.idTipoInstrumento === 0) vinculoComercio.idTipoInstrumento = null;
				const result = await this.vinculoComercioRepository.modify(id, vinculoComercio);
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
				const result = await this.vinculoComercioRepository.remove(id);
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
				const result = await this.vinculoComercioRepository.removeByComercio(idComercio);
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

}
