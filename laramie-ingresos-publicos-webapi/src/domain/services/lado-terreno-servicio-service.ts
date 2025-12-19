import LadoTerrenoServicio from '../entities/lado-terreno-servicio';
import ILadoTerrenoServicioRepository from '../repositories/lado-terreno-servicio-repository';
import { isValidInteger, isValidDate,  } from '../../infraestructure/sdk/utils/validator';
import ValidationError from '../../infraestructure/sdk/error/validation-error';
import ProcessError from '../../infraestructure/sdk/error/process-error';
import ReferenceError from '../../infraestructure/sdk/error/reference-error';

export default class LadoTerrenoServicioService {

	ladoTerrenoServicioRepository: ILadoTerrenoServicioRepository;

	constructor(ladoTerrenoServicioRepository: ILadoTerrenoServicioRepository) {
		this.ladoTerrenoServicioRepository = ladoTerrenoServicioRepository;
	}
	
	async listByLadoTerreno(idLadoTerreno: number) {
		return new Promise( async (resolve, reject) => {
			try {
				const result = await this.ladoTerrenoServicioRepository.listByLadoTerreno(idLadoTerreno);
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
				const result = await this.ladoTerrenoServicioRepository.findById(id);
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

	async add(ladoTerrenoServicio: LadoTerrenoServicio) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidInteger(ladoTerrenoServicio.idLadoTerreno, true) ||
					!isValidInteger(ladoTerrenoServicio.idTasa, true) ||
					!isValidInteger(ladoTerrenoServicio.idSubTasa, true) ||
					!isValidDate(ladoTerrenoServicio.fechaDesde, true) ||
					!isValidDate(ladoTerrenoServicio.fechaHasta, false)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				ladoTerrenoServicio.id = null;
				const result = await this.ladoTerrenoServicioRepository.add(ladoTerrenoServicio);
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async modify(id: number, ladoTerrenoServicio: LadoTerrenoServicio) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidInteger(ladoTerrenoServicio.idLadoTerreno, true) ||
					!isValidInteger(ladoTerrenoServicio.idTasa, true) ||
					!isValidInteger(ladoTerrenoServicio.idSubTasa, true) ||
					!isValidDate(ladoTerrenoServicio.fechaDesde, true) ||
					!isValidDate(ladoTerrenoServicio.fechaHasta, false)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				const result = await this.ladoTerrenoServicioRepository.modify(id, ladoTerrenoServicio);
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
				const result = await this.ladoTerrenoServicioRepository.remove(id);
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

}
