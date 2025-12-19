import ActoProcesal from '../entities/acto-procesal';
import ActoProcesalState from '../dto/acto-procesal-state';
import IActoProcesalRepository from '../repositories/acto-procesal-repository';
import { isValidInteger, isValidDate, isValidString } from '../../infraestructure/sdk/utils/validator';
import ValidationError from '../../infraestructure/sdk/error/validation-error';
import ProcessError from '../../infraestructure/sdk/error/process-error';
import ReferenceError from '../../infraestructure/sdk/error/reference-error';

export default class ActoProcesalService {

	actoProcesalRepository: IActoProcesalRepository;

	constructor(actoProcesalRepository: IActoProcesalRepository) {
		this.actoProcesalRepository = actoProcesalRepository;
	}

	async listByApremio(idApremio: number) {
		return new Promise( async (resolve, reject) => {
			try {
				const result = await this.actoProcesalRepository.listByApremio(idApremio) as Array<ActoProcesalState>;
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
				const result = await this.actoProcesalRepository.findById(id);
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

	async add(actoProcesal: ActoProcesal) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidInteger(actoProcesal.idApremio, true) ||
					!isValidInteger(actoProcesal.idTipoActoProcesal, true) ||
					!isValidDate(actoProcesal.fechaDesde, true) ||
					!isValidDate(actoProcesal.fechaHasta, true) ||
					!isValidString(actoProcesal.observacion, false)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				actoProcesal.id = null;
				const result = await this.actoProcesalRepository.add(actoProcesal);
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async modify(id: number, actoProcesal: ActoProcesal) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidInteger(actoProcesal.idApremio, true) ||
					!isValidInteger(actoProcesal.idTipoActoProcesal, true) ||
					!isValidDate(actoProcesal.fechaDesde, true) ||
					!isValidDate(actoProcesal.fechaHasta, true) ||
					!isValidString(actoProcesal.observacion, false)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				const result = await this.actoProcesalRepository.modify(id, actoProcesal);
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
				const result = await this.actoProcesalRepository.remove(id);
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

	async removeByApremio(idApremio: number) {
		return new Promise( async (resolve, reject) => {
			try {
				const result = await this.actoProcesalRepository.removeByApremio(idApremio);
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

}
