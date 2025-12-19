import CategoriaVehiculo from '../entities/categoria-vehiculo';
import ICategoriaVehiculoRepository from '../repositories/categoria-vehiculo-repository';
import { isValidString, isValidInteger,  } from '../../infraestructure/sdk/utils/validator';
import ValidationError from '../../infraestructure/sdk/error/validation-error';
import ProcessError from '../../infraestructure/sdk/error/process-error';
import ReferenceError from '../../infraestructure/sdk/error/reference-error';

export default class CategoriaVehiculoService {

	categoriaVehiculoRepository: ICategoriaVehiculoRepository;

	constructor(categoriaVehiculoRepository: ICategoriaVehiculoRepository) {
		this.categoriaVehiculoRepository = categoriaVehiculoRepository;
	}

	async list() {
		return new Promise( async (resolve, reject) => {
			try {
				const result = await this.categoriaVehiculoRepository.list();
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
				const result = await this.categoriaVehiculoRepository.findById(id);
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

	async add(categoriaVehiculo: CategoriaVehiculo) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidString(categoriaVehiculo.codigo, true) ||
					!isValidString(categoriaVehiculo.nombre, true) ||
					!isValidInteger(categoriaVehiculo.orden, true) ||
					!isValidInteger(categoriaVehiculo.idIncisoVehiculo, true) ||
					!isValidInteger(categoriaVehiculo.limiteInferior, true) ||
					!isValidInteger(categoriaVehiculo.limiteSuperior, true)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				categoriaVehiculo.id = null;
				const result = await this.categoriaVehiculoRepository.add(categoriaVehiculo);
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async modify(id: number, categoriaVehiculo: CategoriaVehiculo) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidString(categoriaVehiculo.codigo, true) ||
					!isValidString(categoriaVehiculo.nombre, true) ||
					!isValidInteger(categoriaVehiculo.orden, true) ||
					!isValidInteger(categoriaVehiculo.idIncisoVehiculo, true) ||
					!isValidInteger(categoriaVehiculo.limiteInferior, true) ||
					!isValidInteger(categoriaVehiculo.limiteSuperior, true)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				const result = await this.categoriaVehiculoRepository.modify(id, categoriaVehiculo);
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
				const result = await this.categoriaVehiculoRepository.remove(id);
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
