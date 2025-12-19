import TipoMovimiento from '../entities/tipo-movimiento';
import ITipoMovimientoRepository from '../repositories/tipo-movimiento-repository';
import { isValidString, isValidInteger, isValidBoolean,  } from '../../infraestructure/sdk/utils/validator';
import ValidationError from '../../infraestructure/sdk/error/validation-error';
import ProcessError from '../../infraestructure/sdk/error/process-error';
import ReferenceError from '../../infraestructure/sdk/error/reference-error';

export default class TipoMovimientoService {

	tipoMovimientoRepository: ITipoMovimientoRepository;

	constructor(tipoMovimientoRepository: ITipoMovimientoRepository) {
		this.tipoMovimientoRepository = tipoMovimientoRepository;
	}

	async list() {
		return new Promise( async (resolve, reject) => {
			try {
				const result = await this.tipoMovimientoRepository.list();
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
				const result = await this.tipoMovimientoRepository.findById(id);
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

	async findByCodigo(codigo: string) {
		return new Promise( async (resolve, reject) => {
			try {			   
				const result = await this.tipoMovimientoRepository.findByCodigo(codigo);
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

	async add(tipoMovimiento: TipoMovimiento) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidString(tipoMovimiento.codigo, true) ||
					!isValidString(tipoMovimiento.nombre, true) ||
					!isValidInteger(tipoMovimiento.orden, false) ||
					!isValidBoolean(tipoMovimiento.actEmitido) ||
					!isValidBoolean(tipoMovimiento.automatico) ||
					!isValidBoolean(tipoMovimiento.autonumerado) ||
					!isValidInteger(tipoMovimiento.numero, false) ||
					!isValidString(tipoMovimiento.imputacion, true) ||
					!isValidString(tipoMovimiento.tipo, true)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				tipoMovimiento.id = null;
				const result = await this.tipoMovimientoRepository.add(tipoMovimiento);
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async modify(id: number, tipoMovimiento: TipoMovimiento) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidString(tipoMovimiento.codigo, true) ||
					!isValidString(tipoMovimiento.nombre, true) ||
					!isValidInteger(tipoMovimiento.orden, false) ||
					!isValidBoolean(tipoMovimiento.actEmitido) ||
					!isValidBoolean(tipoMovimiento.automatico) ||
					!isValidBoolean(tipoMovimiento.autonumerado) ||
					!isValidInteger(tipoMovimiento.numero, false) ||
					!isValidString(tipoMovimiento.imputacion, true) ||
					!isValidString(tipoMovimiento.tipo, true)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				const result = await this.tipoMovimientoRepository.modify(id, tipoMovimiento);
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
				const result = await this.tipoMovimientoRepository.remove(id);
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
