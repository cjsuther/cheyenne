import LadoTerrenoObra from '../entities/lado-terreno-obra';
import ILadoTerrenoObraRepository from '../repositories/lado-terreno-obra-repository';
import { isValidInteger, isValidFloat, isValidDate } from '../../infraestructure/sdk/utils/validator';
import ValidationError from '../../infraestructure/sdk/error/validation-error';
import ProcessError from '../../infraestructure/sdk/error/process-error';
import ReferenceError from '../../infraestructure/sdk/error/reference-error';

export default class LadoTerrenoObraService {

	ladoTerrenoObraRepository: ILadoTerrenoObraRepository;

	constructor(ladoTerrenoObraRepository: ILadoTerrenoObraRepository) {
		this.ladoTerrenoObraRepository = ladoTerrenoObraRepository;
	}

	async listByLadoTerreno(idLadoTerreno: number) {
		return new Promise( async (resolve, reject) => {
			try {
				const result = await this.ladoTerrenoObraRepository.listByLadoTerreno(idLadoTerreno);
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
				const result = await this.ladoTerrenoObraRepository.findById(id);
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

	async add(ladoTerrenoObra: LadoTerrenoObra) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidInteger(ladoTerrenoObra.idLadoTerreno, true) ||
					!isValidInteger(ladoTerrenoObra.idObra, true) ||
					!isValidFloat(ladoTerrenoObra.importe, false) ||
					!isValidFloat(ladoTerrenoObra.reduccionMetros, false) ||
					!isValidFloat(ladoTerrenoObra.reduccionSuperficie, false) ||
					!isValidDate(ladoTerrenoObra.fecha, true)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				ladoTerrenoObra.id = null;
				const result = await this.ladoTerrenoObraRepository.add(ladoTerrenoObra);
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async modify(id: number, ladoTerrenoObra: LadoTerrenoObra) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidInteger(ladoTerrenoObra.idLadoTerreno, true) ||
					!isValidInteger(ladoTerrenoObra.idObra, true) ||
					!isValidFloat(ladoTerrenoObra.importe, false) ||
					!isValidFloat(ladoTerrenoObra.reduccionMetros, false) ||
					!isValidFloat(ladoTerrenoObra.reduccionSuperficie, false) ||
					!isValidDate(ladoTerrenoObra.fecha, true)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				const result = await this.ladoTerrenoObraRepository.modify(id, ladoTerrenoObra);
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
				const result = await this.ladoTerrenoObraRepository.remove(id);
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
