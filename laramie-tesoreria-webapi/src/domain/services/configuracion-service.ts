import Configuracion from '../entities/configuracion';
import IConfiguracionRepository from '../repositories/configuracion-repository';
import { isValidString,  } from '../../infraestructure/sdk/utils/validator';
import ValidationError from '../../infraestructure/sdk/error/validation-error';
import ProcessError from '../../infraestructure/sdk/error/process-error';
import ReferenceError from '../../infraestructure/sdk/error/reference-error';


export default class ConfiguracionService {

	configuracionRepository: IConfiguracionRepository;

	constructor(configuracionRepository: IConfiguracionRepository) {
		this.configuracionRepository = configuracionRepository;
	}

	async list() {
		return new Promise( async (resolve, reject) => {
			try {
				const result = await this.configuracionRepository.list();
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
				const result = await this.configuracionRepository.findById(id);
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

	async findByNombre(nombre: string) {
		return new Promise( async (resolve, reject) => {
			try {			   
				let configuracion = await this.configuracionRepository.findByNombre(nombre) as Configuracion;
				if (!configuracion) {
					reject(new ReferenceError('No existe el registro'));
					return;
				}

				resolve(configuracion);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async add(configuracion: Configuracion) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidString(configuracion.nombre, true) ||
					!isValidString(configuracion.valor, true)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				configuracion.id = null;
				const result = await this.configuracionRepository.add(configuracion);
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async modify(id: number, configuracion: Configuracion) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidString(configuracion.nombre, true) ||
					!isValidString(configuracion.valor, true)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				const result = await this.configuracionRepository.modify(id, configuracion);
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
				const result = await this.configuracionRepository.remove(id);
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
