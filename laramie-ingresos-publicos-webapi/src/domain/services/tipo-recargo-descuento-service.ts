import TipoRecargoDescuento from '../entities/tipo-recargo-descuento';
import ITipoRecargoDescuentoRepository from '../repositories/tipo-recargo-descuento-repository';
import { isValidString, isValidInteger, isValidNumber, isValidBoolean, isValidDate, isValidFloat  } from '../../infraestructure/sdk/utils/validator';
import ValidationError from '../../infraestructure/sdk/error/validation-error';
import ProcessError from '../../infraestructure/sdk/error/process-error';
import ReferenceError from '../../infraestructure/sdk/error/reference-error';

export default class TipoRecargoDescuentoService {

	tipoRecargoDescuentoRepository: ITipoRecargoDescuentoRepository;

	constructor(tipoRecargoDescuentoRepository: ITipoRecargoDescuentoRepository) {
		this.tipoRecargoDescuentoRepository = tipoRecargoDescuentoRepository;
	}

	async list() {
		return new Promise( async (resolve, reject) => {
			try {
				const result = await this.tipoRecargoDescuentoRepository.list();
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
				const result = await this.tipoRecargoDescuentoRepository.findById(id);
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

	async add(tipoRecargoDescuento: TipoRecargoDescuento) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidString(tipoRecargoDescuento.codigo, true) ||
					!isValidString(tipoRecargoDescuento.nombre, true) ||
					!isValidInteger(tipoRecargoDescuento.orden, true) ||
					!isValidInteger(tipoRecargoDescuento.tipo, true) ||
					!isValidInteger(tipoRecargoDescuento.idTipoTributo, true) ||
					!isValidFloat(tipoRecargoDescuento.porcentaje, false) ||
					!isValidFloat(tipoRecargoDescuento.importe, false) ||
					!isValidBoolean(tipoRecargoDescuento.emiteSolicitud) ||
					!isValidBoolean(tipoRecargoDescuento.requiereOtrogamiento) ||
					!isValidDate(tipoRecargoDescuento.fechaDesde, false) ||
					!isValidDate(tipoRecargoDescuento.fechaHasta, false) ||
					!isValidString(tipoRecargoDescuento.procedimiento, true)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}
				if (tipoRecargoDescuento.importe === 0 && tipoRecargoDescuento.porcentaje === 0) {
					reject(new ValidationError('Debe ingresar importe o porcentaje'));
					return;
				}

				tipoRecargoDescuento.id = null;
				const result = await this.tipoRecargoDescuentoRepository.add(tipoRecargoDescuento);
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async modify(id: number, tipoRecargoDescuento: TipoRecargoDescuento) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidString(tipoRecargoDescuento.codigo, true) ||
					!isValidString(tipoRecargoDescuento.nombre, true) ||
					!isValidInteger(tipoRecargoDescuento.orden, true) ||
					!isValidInteger(tipoRecargoDescuento.tipo, true) ||
					!isValidInteger(tipoRecargoDescuento.idTipoTributo, true) ||
					!isValidFloat(tipoRecargoDescuento.porcentaje, false) ||
					!isValidFloat(tipoRecargoDescuento.importe, false) ||
					!isValidBoolean(tipoRecargoDescuento.emiteSolicitud) ||
					!isValidBoolean(tipoRecargoDescuento.requiereOtrogamiento) ||
					!isValidDate(tipoRecargoDescuento.fechaDesde, false) ||
					!isValidDate(tipoRecargoDescuento.fechaHasta, false) ||
					!isValidString(tipoRecargoDescuento.procedimiento, true)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}
				if (tipoRecargoDescuento.importe === 0 && tipoRecargoDescuento.porcentaje === 0) {
					reject(new ValidationError('Debe ingresar importe o porcentaje'));
					return;
				}

				const result = await this.tipoRecargoDescuentoRepository.modify(id, tipoRecargoDescuento);
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
				const result = await this.tipoRecargoDescuentoRepository.remove(id);
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
