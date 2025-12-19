import TipoInstrumento from '../entities/tipo-instrumento';
import ITipoInstrumentoRepository from '../repositories/tipo-instrumento-repository';
import { isValidString, isValidInteger } from '../../infraestructure/sdk/utils/validator';
import ValidationError from '../../infraestructure/sdk/error/validation-error';
import ProcessError from '../../infraestructure/sdk/error/process-error';
import ReferenceError from '../../infraestructure/sdk/error/reference-error';

export default class TipoInstrumentoService {

	tipoInstrumentoRepository: ITipoInstrumentoRepository;

	constructor(tipoInstrumentoRepository: ITipoInstrumentoRepository) {
		this.tipoInstrumentoRepository = tipoInstrumentoRepository;
	}

	async list() {
		return new Promise( async (resolve, reject) => {
			try {
				const result = await this.tipoInstrumentoRepository.list();
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
				const result = await this.tipoInstrumentoRepository.findById(id);
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

	async add(tipoInstrumento: TipoInstrumento) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidString(tipoInstrumento.codigo, true) ||
					!isValidString(tipoInstrumento.nombre, true) ||
					!isValidInteger(tipoInstrumento.orden, true)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				tipoInstrumento.id = null;
				const result = await this.tipoInstrumentoRepository.add(tipoInstrumento);
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async modify(id: number, tipoInstrumento: TipoInstrumento) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidString(tipoInstrumento.codigo, true) ||
					!isValidString(tipoInstrumento.nombre, true) ||
					!isValidInteger(tipoInstrumento.orden, true)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				const result = await this.tipoInstrumentoRepository.modify(id, tipoInstrumento);
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
				const result = await this.tipoInstrumentoRepository.remove(id);
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
