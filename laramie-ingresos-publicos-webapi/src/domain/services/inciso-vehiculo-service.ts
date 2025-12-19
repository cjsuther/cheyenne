import IncisoVehiculo from '../entities/inciso-vehiculo';
import IIncisoVehiculoRepository from '../repositories/inciso-vehiculo-repository';
import { isValidString, isValidInteger, isValidBoolean } from '../../infraestructure/sdk/utils/validator';
import ValidationError from '../../infraestructure/sdk/error/validation-error';
import ProcessError from '../../infraestructure/sdk/error/process-error';
import ReferenceError from '../../infraestructure/sdk/error/reference-error';

export default class IncisoVehiculoService {

	incisoVehiculoRepository: IIncisoVehiculoRepository;

	constructor(incisoVehiculoRepository: IIncisoVehiculoRepository) {
		this.incisoVehiculoRepository = incisoVehiculoRepository;
	}

	async list() {
		return new Promise( async (resolve, reject) => {
			try {
				const result = await this.incisoVehiculoRepository.list();
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
				const result = await this.incisoVehiculoRepository.findById(id);
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

	async add(incisoVehiculo: IncisoVehiculo) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidString(incisoVehiculo.codigo, true) ||
					!isValidString(incisoVehiculo.nombre, true) ||
					!isValidInteger(incisoVehiculo.orden, true) ||
					!isValidBoolean(incisoVehiculo.vehiculoMenor)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				incisoVehiculo.id = null;
				const result = await this.incisoVehiculoRepository.add(incisoVehiculo);
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async modify(id: number, incisoVehiculo: IncisoVehiculo) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidString(incisoVehiculo.codigo, true) ||
					!isValidString(incisoVehiculo.nombre, true) ||
					!isValidInteger(incisoVehiculo.orden, true) ||
					!isValidBoolean(incisoVehiculo.vehiculoMenor)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				const result = await this.incisoVehiculoRepository.modify(id, incisoVehiculo);
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
				const result = await this.incisoVehiculoRepository.remove(id);
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
