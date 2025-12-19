import VinculoCementerio from '../entities/vinculo-cementerio';
import VinculoCementerioState from '../dto/vinculo-cementerio-state';
import IVinculoCementerioRepository from '../repositories/vinculo-cementerio-repository';
import { isValidInteger, isValidDate, isValidFloat } from '../../infraestructure/sdk/utils/validator';
import ValidationError from '../../infraestructure/sdk/error/validation-error';
import ProcessError from '../../infraestructure/sdk/error/process-error';
import ReferenceError from '../../infraestructure/sdk/error/reference-error';

export default class VinculoCementerioService {

	vinculoCementerioRepository: IVinculoCementerioRepository;

	constructor(vinculoCementerioRepository: IVinculoCementerioRepository) {
		this.vinculoCementerioRepository = vinculoCementerioRepository;
	}

	async listByCementerio(idCementerio: number) {
		return new Promise( async (resolve, reject) => {
			try {
				const result = (await this.vinculoCementerioRepository.listByCementerio(idCementerio) as Array<VinculoCementerioState>).sort(
					(a, b) => (a.idTipoVinculoCementerio !== b.idTipoVinculoCementerio) ? a.idTipoVinculoCementerio - b.idTipoVinculoCementerio : a.id - b.id
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
				const result = await this.vinculoCementerioRepository.findById(id);
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

	async add(vinculoCementerio: VinculoCementerio) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidInteger(vinculoCementerio.idCementerio, true) ||
					!isValidInteger(vinculoCementerio.idTipoVinculoCementerio, true) ||
					!isValidInteger(vinculoCementerio.idPersona, true) ||
					!isValidInteger(vinculoCementerio.idTipoInstrumento, false) ||
					!isValidDate(vinculoCementerio.fechaInstrumentoDesde, false) ||
					!isValidDate(vinculoCementerio.fechaInstrumentoHasta, false) ||
					!isValidFloat(vinculoCementerio.porcentajeCondominio, false)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				vinculoCementerio.id = null;
				if (vinculoCementerio.idTipoInstrumento === 0) vinculoCementerio.idTipoInstrumento = null;
				const result = await this.vinculoCementerioRepository.add(vinculoCementerio);
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async modify(id: number, vinculoCementerio: VinculoCementerio) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidInteger(vinculoCementerio.idCementerio, true) ||
					!isValidInteger(vinculoCementerio.idTipoVinculoCementerio, true) ||
					!isValidInteger(vinculoCementerio.idPersona, true) ||
					!isValidInteger(vinculoCementerio.idTipoInstrumento, false) ||
					!isValidDate(vinculoCementerio.fechaInstrumentoDesde, false) ||
					!isValidDate(vinculoCementerio.fechaInstrumentoHasta, false) ||
					!isValidFloat(vinculoCementerio.porcentajeCondominio, false)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				if (vinculoCementerio.idTipoInstrumento === 0) vinculoCementerio.idTipoInstrumento = null;
				const result = await this.vinculoCementerioRepository.modify(id, vinculoCementerio);
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
				const result = await this.vinculoCementerioRepository.remove(id);
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

	async removeByCementerio(idCementerio: number) {
		return new Promise( async (resolve, reject) => {
			try {
				const result = await this.vinculoCementerioRepository.removeByCementerio(idCementerio);
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

}
