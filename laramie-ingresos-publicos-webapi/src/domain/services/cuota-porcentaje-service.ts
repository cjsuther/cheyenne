import CuotaPorcentaje from '../entities/cuota-porcentaje';
import ICuotaPorcentajeRepository from '../repositories/cuota-porcentaje-repository';
import { isValidInteger, isValidString, isValidNumber, isValidFloat,  } from '../../infraestructure/sdk/utils/validator';
import ValidationError from '../../infraestructure/sdk/error/validation-error';
import ProcessError from '../../infraestructure/sdk/error/process-error';
import ReferenceError from '../../infraestructure/sdk/error/reference-error';

export default class CuotaPorcentajeService {

	cuotaPorcentajeRepository: ICuotaPorcentajeRepository;

	constructor(cuotaPorcentajeRepository: ICuotaPorcentajeRepository) {
		this.cuotaPorcentajeRepository = cuotaPorcentajeRepository;
	}

	async list() {
		return new Promise( async (resolve, reject) => {
			try {
				const result = await this.cuotaPorcentajeRepository.list();
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
				const result = await this.cuotaPorcentajeRepository.findById(id);
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

	async add(cuotaPorcentaje: CuotaPorcentaje) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidInteger(cuotaPorcentaje.idEmisionEjecucion, true) ||
					!isValidInteger(cuotaPorcentaje.idEmisionImputacionContableResultado, true) ||
					!isValidInteger(cuotaPorcentaje.idCuenta, true) ||
					!isValidInteger(cuotaPorcentaje.idTasa, true) ||
					!isValidInteger(cuotaPorcentaje.idSubTasa, true) ||
					!isValidString(cuotaPorcentaje.periodo, true) ||
					!isValidInteger(cuotaPorcentaje.cuota, true) ||
					!isValidInteger(cuotaPorcentaje.idTasaPorcentaje, true) ||
					!isValidInteger(cuotaPorcentaje.idSubTasaPorcentaje, true) ||
					!isValidFloat(cuotaPorcentaje.porcentaje, true) ||
					!isValidFloat(cuotaPorcentaje.importePorcentaje, true) ||
					!isValidString(cuotaPorcentaje.ejercicio, true)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				cuotaPorcentaje.id = null;
				const result = await this.cuotaPorcentajeRepository.add(cuotaPorcentaje);
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async addByBloque(rows: Array<CuotaPorcentaje>) {
		return new Promise( async (resolve, reject) => {
			try {
				const result = await this.cuotaPorcentajeRepository.addByBloque(rows);
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async modify(id: number, cuotaPorcentaje: CuotaPorcentaje) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidInteger(cuotaPorcentaje.idEmisionEjecucion, true) ||
					!isValidInteger(cuotaPorcentaje.idEmisionImputacionContableResultado, true) ||
					!isValidInteger(cuotaPorcentaje.idCuenta, true) ||
					!isValidInteger(cuotaPorcentaje.idTasa, true) ||
					!isValidInteger(cuotaPorcentaje.idSubTasa, true) ||
					!isValidString(cuotaPorcentaje.periodo, true) ||
					!isValidInteger(cuotaPorcentaje.cuota, true) ||
					!isValidInteger(cuotaPorcentaje.idTasaPorcentaje, true) ||
					!isValidInteger(cuotaPorcentaje.idSubTasaPorcentaje, true) ||
					!isValidFloat(cuotaPorcentaje.porcentaje, true) ||
					!isValidFloat(cuotaPorcentaje.importePorcentaje, true) ||
					!isValidString(cuotaPorcentaje.ejercicio, true)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				const result = await this.cuotaPorcentajeRepository.modify(id, cuotaPorcentaje);
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
				const result = await this.cuotaPorcentajeRepository.remove(id);
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
