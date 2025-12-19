import EmisionCalculo from '../entities/emision-calculo';
import IEmisionCalculoRepository from '../repositories/emision-calculo-repository';
import { isValidInteger, isValidString, isValidBoolean,  } from '../../infraestructure/sdk/utils/validator';
import ValidationError from '../../infraestructure/sdk/error/validation-error';
import ProcessError from '../../infraestructure/sdk/error/process-error';
import ReferenceError from '../../infraestructure/sdk/error/reference-error';

export default class EmisionCalculoService {

	emisionCalculoRepository: IEmisionCalculoRepository;

	constructor(emisionCalculoRepository: IEmisionCalculoRepository) {
		this.emisionCalculoRepository = emisionCalculoRepository;
	}

	async list() {
		return new Promise( async (resolve, reject) => {
			try {
				const result = await this.emisionCalculoRepository.list();
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async listByEmisionDefinicion(idEmisionDefinicion: number) {
		return new Promise( async (resolve, reject) => {
			try {
				const result = (await this.emisionCalculoRepository.listByEmisionDefinicion(idEmisionDefinicion) as Array<EmisionCalculo>).sort((a, b) => a.orden - b.orden);
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
				const result = await this.emisionCalculoRepository.findById(id);
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

	async add(emisionCalculo: EmisionCalculo) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidInteger(emisionCalculo.idEmisionDefinicion, true) ||
					!isValidInteger(emisionCalculo.idTipoEmisionCalculo, true) ||
					!isValidString(emisionCalculo.codigo, true) ||
					!isValidString(emisionCalculo.nombre, true) ||
					!isValidString(emisionCalculo.descripcion, true) ||
					!isValidBoolean(emisionCalculo.guardaValor) ||
					!isValidString(emisionCalculo.formula, true) ||
					!isValidInteger(emisionCalculo.orden, true)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				emisionCalculo.id = null;
				const result = await this.emisionCalculoRepository.add(emisionCalculo);
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async modify(id: number, emisionCalculo: EmisionCalculo) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidInteger(emisionCalculo.idEmisionDefinicion, true) ||
					!isValidInteger(emisionCalculo.idTipoEmisionCalculo, true) ||
					!isValidString(emisionCalculo.codigo, true) ||
					!isValidString(emisionCalculo.nombre, true) ||
					!isValidString(emisionCalculo.descripcion, true) ||
					!isValidBoolean(emisionCalculo.guardaValor) ||
					!isValidString(emisionCalculo.formula, true) ||
					!isValidInteger(emisionCalculo.orden, true)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				const result = await this.emisionCalculoRepository.modify(id, emisionCalculo);
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
				const result = await this.emisionCalculoRepository.remove(id);
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

	async removeByEmisionDefinicion(idEmisionDefinicion: number) {
		return new Promise( async (resolve, reject) => {
			try {
				const result = await this.emisionCalculoRepository.removeByEmisionDefinicion(idEmisionDefinicion);
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

}
