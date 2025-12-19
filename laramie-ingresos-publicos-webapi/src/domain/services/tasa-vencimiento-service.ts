import TasaVencimiento from '../entities/tasa-vencimiento';
import ITasaVencimientoRepository from '../repositories/tasa-vencimiento-repository';
import { isValidInteger, isValidString, isValidDate,  } from '../../infraestructure/sdk/utils/validator';
import ValidationError from '../../infraestructure/sdk/error/validation-error';
import ProcessError from '../../infraestructure/sdk/error/process-error';
import ReferenceError from '../../infraestructure/sdk/error/reference-error';

export default class TasaVencimientoService {

	tasaVencimientoRepository: ITasaVencimientoRepository;

	constructor(tasaVencimientoRepository: ITasaVencimientoRepository) {
		this.tasaVencimientoRepository = tasaVencimientoRepository;
	}

	async list() {
		return new Promise( async (resolve, reject) => {
			try {
				const result = await this.tasaVencimientoRepository.list();
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
				const result = await this.tasaVencimientoRepository.findById(id);
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

	async add(tasaVencimiento: TasaVencimiento) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidInteger(tasaVencimiento.idTasa, true) ||
					!isValidInteger(tasaVencimiento.idSubTasa, true) ||
					!isValidString(tasaVencimiento.periodo, true) ||
					!isValidInteger(tasaVencimiento.cuota, true) ||
					!isValidDate(tasaVencimiento.fechaVencimiento1, true) ||
					!isValidDate(tasaVencimiento.fechaVencimiento2, true) ||
					!isValidInteger(tasaVencimiento.idEmisionEjecucion, true)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				tasaVencimiento.id = null;
				const result = await this.tasaVencimientoRepository.add(tasaVencimiento);
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async addByBloque(rows: Array<TasaVencimiento>) {
		return new Promise( async (resolve, reject) => {
			try {
				const result = await this.tasaVencimientoRepository.addByBloque(rows);
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async modify(id: number, tasaVencimiento: TasaVencimiento) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidInteger(tasaVencimiento.idTasa, true) ||
					!isValidInteger(tasaVencimiento.idSubTasa, true) ||
					!isValidString(tasaVencimiento.periodo, true) ||
					!isValidInteger(tasaVencimiento.cuota, true) ||
					!isValidDate(tasaVencimiento.fechaVencimiento1, true) ||
					!isValidDate(tasaVencimiento.fechaVencimiento2, true) ||
					!isValidInteger(tasaVencimiento.idEmisionEjecucion, true)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				const result = await this.tasaVencimientoRepository.modify(id, tasaVencimiento);
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
				const result = await this.tasaVencimientoRepository.remove(id);
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
