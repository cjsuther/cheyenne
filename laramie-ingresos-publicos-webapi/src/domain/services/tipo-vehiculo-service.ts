import TipoVehiculo from '../entities/tipo-vehiculo';
import ITipoVehiculoRepository from '../repositories/tipo-vehiculo-repository';
import { isValidString, isValidInteger,  } from '../../infraestructure/sdk/utils/validator';
import ValidationError from '../../infraestructure/sdk/error/validation-error';
import ProcessError from '../../infraestructure/sdk/error/process-error';
import ReferenceError from '../../infraestructure/sdk/error/reference-error';

export default class TipoVehiculoService {

	tipoVehiculoRepository: ITipoVehiculoRepository;

	constructor(tipoVehiculoRepository: ITipoVehiculoRepository) {
		this.tipoVehiculoRepository = tipoVehiculoRepository;
	}

	async list() {
		return new Promise( async (resolve, reject) => {
			try {
				const result = await this.tipoVehiculoRepository.list();
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
				const result = await this.tipoVehiculoRepository.findById(id);
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

	async add(tipoVehiculo: TipoVehiculo) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidString(tipoVehiculo.codigo, true) ||
					!isValidString(tipoVehiculo.nombre, true) ||
					!isValidInteger(tipoVehiculo.orden, true) ||
					!isValidInteger(tipoVehiculo.idIncisoVehiculo, true)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				tipoVehiculo.id = null;
				const result = await this.tipoVehiculoRepository.add(tipoVehiculo);
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async modify(id: number, tipoVehiculo: TipoVehiculo) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidString(tipoVehiculo.codigo, true) ||
					!isValidString(tipoVehiculo.nombre, true) ||
					!isValidInteger(tipoVehiculo.orden, true) ||
					!isValidInteger(tipoVehiculo.idIncisoVehiculo, true)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				const result = await this.tipoVehiculoRepository.modify(id, tipoVehiculo);
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
				const result = await this.tipoVehiculoRepository.remove(id);
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
