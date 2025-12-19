import CuentaPagoItem from '../entities/cuenta-pago-item';
import ICuentaPagoItemRepository from '../repositories/cuenta-pago-item-repository';
import { isValidInteger, isValidNumber, isValidDate, isValidString, isValidFloat,  } from '../../infraestructure/sdk/utils/validator';
import ValidationError from '../../infraestructure/sdk/error/validation-error';
import ProcessError from '../../infraestructure/sdk/error/process-error';
import ReferenceError from '../../infraestructure/sdk/error/reference-error';

export default class CuentaPagoItemService {

	cuentaPagoItemRepository: ICuentaPagoItemRepository;

	constructor(cuentaPagoItemRepository: ICuentaPagoItemRepository) {
		this.cuentaPagoItemRepository = cuentaPagoItemRepository;
	}

	async list() {
		return new Promise( async (resolve, reject) => {
			try {
				const result = await this.cuentaPagoItemRepository.list();
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async listByCuentaPago(idCuentaPago: number) {
		return new Promise( async (resolve, reject) => {
			try {
				const result = await this.cuentaPagoItemRepository.listByCuentaPago(idCuentaPago);
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
				const result = await this.cuentaPagoItemRepository.findById(id);
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

	async add(cuentaPagoItem: CuentaPagoItem) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidInteger(cuentaPagoItem.idCuentaPago, true) ||
					!isValidInteger(cuentaPagoItem.idCuenta, true) ||
					!isValidInteger(cuentaPagoItem.idTasa, true) ||
					!isValidInteger(cuentaPagoItem.idSubTasa, true) ||
					!isValidString(cuentaPagoItem.periodo, true) ||
					!isValidInteger(cuentaPagoItem.cuota, false) ||
					!isValidFloat(cuentaPagoItem.importeNominal, false) ||
					!isValidFloat(cuentaPagoItem.importeAccesorios, false) ||
					!isValidFloat(cuentaPagoItem.importeRecargos, false) ||
					!isValidFloat(cuentaPagoItem.importeMultas, false) ||
					!isValidFloat(cuentaPagoItem.importeHonorarios, false) ||
					!isValidFloat(cuentaPagoItem.importeAportes, false) ||
					!isValidFloat(cuentaPagoItem.importeTotal, false) ||
					!isValidFloat(cuentaPagoItem.importeNeto, false) ||
					!isValidFloat(cuentaPagoItem.importeDescuento, false) ||
					!isValidDate(cuentaPagoItem.fechaVencimientoTermino, true) ||
					!isValidInteger(cuentaPagoItem.item, true)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				cuentaPagoItem.id = null;
				const result = await this.cuentaPagoItemRepository.add(cuentaPagoItem);
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async addByBloque(rows: Array<CuentaPagoItem>) {
		return new Promise( async (resolve, reject) => {
			try {
				const result = await this.cuentaPagoItemRepository.addByBloque(rows);
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async modify(id: number, cuentaPagoItem: CuentaPagoItem) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidInteger(cuentaPagoItem.idCuentaPago, true) ||
					!isValidInteger(cuentaPagoItem.idCuenta, true) ||
					!isValidInteger(cuentaPagoItem.idTasa, true) ||
					!isValidInteger(cuentaPagoItem.idSubTasa, true) ||
					!isValidString(cuentaPagoItem.periodo, true) ||
					!isValidInteger(cuentaPagoItem.cuota, true) ||
					!isValidFloat(cuentaPagoItem.importeNominal, false) ||
					!isValidFloat(cuentaPagoItem.importeAccesorios, false) ||
					!isValidFloat(cuentaPagoItem.importeRecargos, false) ||
					!isValidFloat(cuentaPagoItem.importeMultas, false) ||
					!isValidFloat(cuentaPagoItem.importeHonorarios, false) ||
					!isValidFloat(cuentaPagoItem.importeAportes, false) ||
					!isValidFloat(cuentaPagoItem.importeTotal, false) ||
					!isValidFloat(cuentaPagoItem.importeNeto, false) ||
					!isValidFloat(cuentaPagoItem.importeDescuento, false) ||
					!isValidDate(cuentaPagoItem.fechaVencimientoTermino, true) ||
					!isValidInteger(cuentaPagoItem.item, true)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				const result = await this.cuentaPagoItemRepository.modify(id, cuentaPagoItem);
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
				const result = await this.cuentaPagoItemRepository.remove(id);
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
