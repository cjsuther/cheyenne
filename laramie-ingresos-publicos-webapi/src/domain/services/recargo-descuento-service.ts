import RecargoDescuento from '../entities/recargo-descuento';
import IRecargoDescuentoRepository from '../repositories/recargo-descuento-repository';
import { isValidInteger, isValidDate, isValidString, isValidFloat,  } from '../../infraestructure/sdk/utils/validator';
import ValidationError from '../../infraestructure/sdk/error/validation-error';
import ProcessError from '../../infraestructure/sdk/error/process-error';
import ReferenceError from '../../infraestructure/sdk/error/reference-error';
import RecargoDescuentoState from '../dto/recargo-descuento-state';

export default class RecargoDescuentoService {

	recargoDescuentoRepository: IRecargoDescuentoRepository;

	constructor(recargoDescuentoRepository: IRecargoDescuentoRepository) {
		this.recargoDescuentoRepository = recargoDescuentoRepository;
	}

	async listByCuenta(idCuenta: number) {
		return new Promise( async (resolve, reject) => {
			try {
				const result = (await this.recargoDescuentoRepository.listByCuenta(idCuenta) as Array<RecargoDescuentoState>).sort((a, b) => a.id - b.id);
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
				const result = await this.recargoDescuentoRepository.findById(id);
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

	async add(recargoDescuento: RecargoDescuento) {
		return new Promise( async (resolve, reject) => {
			try {
				console.log(recargoDescuento);
				if (
					!isValidInteger(recargoDescuento.idTipoRecargoDescuento, true) ||
					!isValidInteger(recargoDescuento.idCuenta, true) ||
					!isValidInteger(recargoDescuento.idTasa, true) ||
					!isValidInteger(recargoDescuento.idSubTasa, true) ||
					!isValidInteger(recargoDescuento.idRubro, false) ||
					!isValidDate(recargoDescuento.fechaDesde, true) ||
					!isValidDate(recargoDescuento.fechaHasta, true) ||
					!isValidDate(recargoDescuento.fechaOtorgamiento, false) ||
					!isValidString(recargoDescuento.numeroSolicitud, false) ||
					!isValidFloat(recargoDescuento.porcentaje, false) ||
					!isValidFloat(recargoDescuento.importe, false) ||
					!isValidInteger(recargoDescuento.idPersona, true) ||
					!isValidString(recargoDescuento.numeroDDJJ, false) ||
					!isValidString(recargoDescuento.letraDDJJ, false) ||
					!isValidString(recargoDescuento.ejercicioDDJJ, false) ||
					!isValidString(recargoDescuento.numeroDecreto, false) ||
					!isValidString(recargoDescuento.letraDecreto, false) ||
					!isValidString(recargoDescuento.ejercicioDecreto, false) ||
					!isValidInteger(recargoDescuento.idExpediente, false) ||
					!isValidString(recargoDescuento.detalleExpediente, false)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				recargoDescuento.id = null;
				if (recargoDescuento.idRubro === 0) recargoDescuento.idRubro = null;
				if (recargoDescuento.idExpediente === 0) recargoDescuento.idExpediente = null;
				const result = await this.recargoDescuentoRepository.add(recargoDescuento);
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async modify(id: number, recargoDescuento: RecargoDescuento) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidInteger(recargoDescuento.idTipoRecargoDescuento, true) ||
					!isValidInteger(recargoDescuento.idCuenta, true) ||
					!isValidInteger(recargoDescuento.idTasa, true) ||
					!isValidInteger(recargoDescuento.idSubTasa, true) ||
					!isValidInteger(recargoDescuento.idRubro, false) ||
					!isValidDate(recargoDescuento.fechaDesde, true) ||
					!isValidDate(recargoDescuento.fechaHasta, true) ||
					!isValidDate(recargoDescuento.fechaOtorgamiento, false) ||
					!isValidString(recargoDescuento.numeroSolicitud, false) ||
					!isValidFloat(recargoDescuento.porcentaje, false) ||
					!isValidFloat(recargoDescuento.importe, false) ||
					!isValidInteger(recargoDescuento.idPersona, true) ||
					!isValidString(recargoDescuento.numeroDDJJ, false) ||
					!isValidString(recargoDescuento.letraDDJJ, false) ||
					!isValidString(recargoDescuento.ejercicioDDJJ, false) ||
					!isValidString(recargoDescuento.numeroDecreto, false) ||
					!isValidString(recargoDescuento.letraDecreto, false) ||
					!isValidString(recargoDescuento.ejercicioDecreto, false) ||
					!isValidInteger(recargoDescuento.idExpediente, false) ||
					!isValidString(recargoDescuento.detalleExpediente, false)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				if (recargoDescuento.idRubro === 0) recargoDescuento.idRubro = null;
				if (recargoDescuento.idExpediente === 0) recargoDescuento.idExpediente = null;
				const result = await this.recargoDescuentoRepository.modify(id, recargoDescuento);
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
				const result = await this.recargoDescuentoRepository.remove(id);
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

	async removeByCuenta(idCuenta: number) {
		return new Promise( async (resolve, reject) => {
			try {
				const result = await this.recargoDescuentoRepository.removeByCuenta(idCuenta);
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

}
