import DeclaracionJurada from '../entities/declaracion-jurada';
import IDeclaracionJuradaRepository from '../repositories/declaracion-jurada-repository';
import { isValidInteger, isValidDate, isValidString, isValidNumber, isValidFloat  } from '../../infraestructure/sdk/utils/validator';
import ValidationError from '../../infraestructure/sdk/error/validation-error';
import ProcessError from '../../infraestructure/sdk/error/process-error';
import ReferenceError from '../../infraestructure/sdk/error/reference-error';
import DeclaracionJuradaState from '../dto/declaracion-jurada-state';

export default class DeclaracionJuradaService {

	declaracionJuradaRepository: IDeclaracionJuradaRepository;

	constructor(declaracionJuradaRepository: IDeclaracionJuradaRepository) {
		this.declaracionJuradaRepository = declaracionJuradaRepository;
	}

	async listByCuenta(idCuenta: number) {
		return new Promise( async (resolve, reject) => {
			try {
				const result = (await this.declaracionJuradaRepository.listByCuenta(idCuenta) as Array<DeclaracionJuradaState>).sort((a, b) => a.id - b.id);
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
				const result = await this.declaracionJuradaRepository.findById(id);
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

	async add(declaracionJurada: DeclaracionJurada) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidInteger(declaracionJurada.idCuenta, true) ||
					!isValidInteger(declaracionJurada.idTipoTributo, true) ||
					!isValidInteger(declaracionJurada.idTributo, true) ||
					!isValidInteger(declaracionJurada.idTasa, true) ||
					!isValidInteger(declaracionJurada.idSubTasa, true) ||
					!isValidDate(declaracionJurada.fechaPresentacionDDJJ, true) ||
					!isValidString(declaracionJurada.anioDeclaracion, true) ||
					!isValidInteger(declaracionJurada.mesDeclaracion, true) ||
					!isValidString(declaracionJurada.numero, true) ||
					!isValidInteger(declaracionJurada.idTipoDDJJ, true) ||
					!isValidFloat(declaracionJurada.valorDeclaracion, true) ||
					!isValidDate(declaracionJurada.fechaAlta, true) ||
					!isValidDate(declaracionJurada.fechaBaja, false) ||
					!isValidString(declaracionJurada.resolucion, true)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				declaracionJurada.id = null;
				const result = await this.declaracionJuradaRepository.add(declaracionJurada);
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async modify(id: number, declaracionJurada: DeclaracionJurada) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidInteger(declaracionJurada.idCuenta, true) ||
					!isValidInteger(declaracionJurada.idTipoTributo, true) ||
					!isValidInteger(declaracionJurada.idTributo, true) ||
					!isValidInteger(declaracionJurada.idTasa, true) ||
					!isValidInteger(declaracionJurada.idSubTasa, true) ||
					!isValidDate(declaracionJurada.fechaPresentacionDDJJ, true) ||
					!isValidString(declaracionJurada.anioDeclaracion, true) ||
					!isValidInteger(declaracionJurada.mesDeclaracion, true) ||
					!isValidString(declaracionJurada.numero, true) ||
					!isValidInteger(declaracionJurada.idTipoDDJJ, true) ||
					!isValidFloat(declaracionJurada.valorDeclaracion, true) ||
					!isValidDate(declaracionJurada.fechaAlta, true) ||
					!isValidDate(declaracionJurada.fechaBaja, false) ||
					!isValidString(declaracionJurada.resolucion, true)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				const result = await this.declaracionJuradaRepository.modify(id, declaracionJurada);
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
				const result = await this.declaracionJuradaRepository.remove(id);
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
