import DeclaracionJuradaComercio from '../entities/declaracion-jurada-comercio';
import IDeclaracionJuradaComercioRepository from '../repositories/declaracion-jurada-comercio-repository';
import { isValidInteger, isValidDate, isValidString, isValidFloat,  } from '../../infraestructure/sdk/utils/validator';
import ValidationError from '../../infraestructure/sdk/error/validation-error';
import ProcessError from '../../infraestructure/sdk/error/process-error';
import ReferenceError from '../../infraestructure/sdk/error/reference-error';

export default class DeclaracionJuradaComercioService {

	declaracionJuradaComercioRepository: IDeclaracionJuradaComercioRepository;

	constructor(declaracionJuradaComercioRepository: IDeclaracionJuradaComercioRepository) {
		this.declaracionJuradaComercioRepository = declaracionJuradaComercioRepository;
	}

	async list() {
		return new Promise( async (resolve, reject) => {
			try {
				const result = await this.declaracionJuradaComercioRepository.list();
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async listByCuenta(idCuenta: number) {
		return new Promise( async (resolve, reject) => {
			try {
				//ordenado por fecha
				const result = (await this.declaracionJuradaComercioRepository.listByCuenta(idCuenta) as Array<DeclaracionJuradaComercio>)
									.sort((a, b) => (b.fechaAlta < a.fechaAlta) ? -1 : (b.fechaAlta < a.fechaAlta) ? 1 : 0);
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
				const result = await this.declaracionJuradaComercioRepository.findById(id);
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

	async add(declaracionJuradaComercio: DeclaracionJuradaComercio) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidInteger(declaracionJuradaComercio.idCuenta, true) ||
					!isValidDate(declaracionJuradaComercio.fechaPresentacionDDJJ, true) ||
					!isValidString(declaracionJuradaComercio.anioDeclaracion, true) ||
					!isValidInteger(declaracionJuradaComercio.mesDeclaracion, true) ||
					!isValidInteger(declaracionJuradaComercio.numero, true) ||
					!isValidInteger(declaracionJuradaComercio.idTipoDDJJ, true) ||
					!isValidDate(declaracionJuradaComercio.fechaAlta, true) ||
					!isValidDate(declaracionJuradaComercio.fechaBaja, true) ||
					!isValidString(declaracionJuradaComercio.resolucion, true) ||
					!isValidInteger(declaracionJuradaComercio.titulares, true) ||
					!isValidInteger(declaracionJuradaComercio.dependientes, true) ||
					!isValidFloat(declaracionJuradaComercio.importeExportaciones, true) ||
					!isValidFloat(declaracionJuradaComercio.importeTotalPais, true)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				declaracionJuradaComercio.id = null;
				const result = await this.declaracionJuradaComercioRepository.add(declaracionJuradaComercio);
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async modify(id: number, declaracionJuradaComercio: DeclaracionJuradaComercio) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidInteger(declaracionJuradaComercio.idCuenta, true) ||
					!isValidDate(declaracionJuradaComercio.fechaPresentacionDDJJ, true) ||
					!isValidString(declaracionJuradaComercio.anioDeclaracion, true) ||
					!isValidInteger(declaracionJuradaComercio.mesDeclaracion, true) ||
					!isValidInteger(declaracionJuradaComercio.numero, true) ||
					!isValidInteger(declaracionJuradaComercio.idTipoDDJJ, true) ||
					!isValidDate(declaracionJuradaComercio.fechaAlta, true) ||
					!isValidDate(declaracionJuradaComercio.fechaBaja, true) ||
					!isValidString(declaracionJuradaComercio.resolucion, true) ||
					!isValidInteger(declaracionJuradaComercio.titulares, true) ||
					!isValidInteger(declaracionJuradaComercio.dependientes, true) ||
					!isValidFloat(declaracionJuradaComercio.importeExportaciones, true) ||
					!isValidFloat(declaracionJuradaComercio.importeTotalPais, true)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				const result = await this.declaracionJuradaComercioRepository.modify(id, declaracionJuradaComercio);
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
				const result = await this.declaracionJuradaComercioRepository.remove(id);
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
