import Elemento from '../entities/elemento';
import IElementoRepository from '../repositories/elemento-repository';
import { isValidInteger, isValidDate,  } from '../../infraestructure/sdk/utils/validator';
import ValidationError from '../../infraestructure/sdk/error/validation-error';
import ProcessError from '../../infraestructure/sdk/error/process-error';
import ReferenceError from '../../infraestructure/sdk/error/reference-error';

export default class ElementoService {

	elementoRepository: IElementoRepository;

	constructor(elementoRepository: IElementoRepository) {
		this.elementoRepository = elementoRepository;
	}

	async list() {
		return new Promise( async (resolve, reject) => {
			try {
				const result = await this.elementoRepository.list();
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
				const result = (await this.elementoRepository.listByCuenta(idCuenta) as Array<Elemento>)
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
				const result = await this.elementoRepository.findById(id);
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

	async add(elemento: Elemento) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidInteger(elemento.idClaseElemento, true) ||
					!isValidInteger(elemento.idTipoElemento, true) ||
					!isValidInteger(elemento.idCuenta, true) ||
					!isValidInteger(elemento.cantidad, true) ||
					!isValidDate(elemento.fechaAlta, true) ||
					!isValidDate(elemento.fechaBaja, false)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				elemento.id = null;
				const result = await this.elementoRepository.add(elemento);
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async modify(id: number, elemento: Elemento) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidInteger(elemento.idClaseElemento, true) ||
					!isValidInteger(elemento.idTipoElemento, true) ||
					!isValidInteger(elemento.idCuenta, true) ||
					!isValidInteger(elemento.cantidad, true) ||
					!isValidDate(elemento.fechaAlta, true) ||
					!isValidDate(elemento.fechaBaja, false)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				const result = await this.elementoRepository.modify(id, elemento);
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
				const result = await this.elementoRepository.remove(id);
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
