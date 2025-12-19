import MedioPago from '../entities/medio-pago';
import MedioPagoState from '../dto/medio-pago-state';
import IMedioPagoRepository from '../repositories/medio-pago-repository';
import { isValidInteger, isValidString, isValidDate,  } from '../../infraestructure/sdk/utils/validator';
import ValidationError from '../../infraestructure/sdk/error/validation-error';
import ProcessError from '../../infraestructure/sdk/error/process-error';
import ReferenceError from '../../infraestructure/sdk/error/reference-error';
import { EncryptedString } from '../../infraestructure/sdk/utils/cryptograph';
import { DecryptedString } from '../../infraestructure/sdk/utils/cryptograph';

export default class MedioPagoService {

	medioPagoRepository: IMedioPagoRepository;

	constructor(medioPagoRepository: IMedioPagoRepository) {
		this.medioPagoRepository = medioPagoRepository;
	}

	async list() {
		return new Promise( async (resolve, reject) => {
			try {
				const result = await this.medioPagoRepository.list();

				result.forEach(async row => {
					if (row.cvv.length > 0) row.cvv = DecryptedString(row.cvv);
				});		

				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async listByPersona(idTipoPersona: number, idPersona: number) {
		return new Promise( async (resolve, reject) => {
			try {
				const result = (await this.medioPagoRepository.listByPersona(idTipoPersona, idPersona) as Array<MedioPagoState>).sort((a, b) => a.id - b.id);
				
				result.forEach(async row => {
					if (row.cvv.length > 0) row.cvv = DecryptedString(row.cvv);
				});						
				
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
				const result = await this.medioPagoRepository.findById(id);
				if (result.cvv.length > 0) result.cvv = DecryptedString(result.cvv);
				
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

	async add(medioPago: MedioPago) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidInteger(medioPago.idTipoPersona, true) ||
					!isValidInteger(medioPago.idPersona, true) ||
					!isValidInteger(medioPago.idTipoMedioPago, true) ||
					!isValidString(medioPago.titular, true) ||
					!isValidString(medioPago.numero, true) ||
					!isValidString(medioPago.banco, false) ||
					!isValidString(medioPago.alias, false) ||
					!isValidInteger(medioPago.idTipoTarjeta, false) ||
					!isValidInteger(medioPago.idMarcaTarjeta, false) ||
					!isValidDate(medioPago.fechaVencimiento, false) ||
					!isValidString(medioPago.cvv, false)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				medioPago.id = null;
                if (medioPago.idTipoTarjeta === 0) medioPago.idTipoTarjeta = null;
				if (medioPago.idMarcaTarjeta === 0) medioPago.idMarcaTarjeta = null;
				if (medioPago.cvv.length > 0) medioPago.cvv = EncryptedString(medioPago.cvv);
				
				const result = await this.medioPagoRepository.add(medioPago);
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async modify(id: number, medioPago: MedioPago) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidInteger(medioPago.idTipoPersona, true) ||
					!isValidInteger(medioPago.idPersona, true) ||
					!isValidInteger(medioPago.idTipoMedioPago, true) ||
					!isValidString(medioPago.titular, true) ||
					!isValidString(medioPago.numero, true) ||
					!isValidString(medioPago.banco, false) ||
					!isValidString(medioPago.alias, false) ||
					!isValidInteger(medioPago.idTipoTarjeta, false) ||
					!isValidInteger(medioPago.idMarcaTarjeta, false) ||
					!isValidDate(medioPago.fechaVencimiento, false) ||
					!isValidString(medioPago.cvv, false)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				if (medioPago.idTipoTarjeta === 0) medioPago.idTipoTarjeta = null;
				if (medioPago.idMarcaTarjeta === 0) medioPago.idMarcaTarjeta = null;
				if (medioPago.cvv.length > 0) medioPago.cvv = EncryptedString(medioPago.cvv);

				const result = await this.medioPagoRepository.modify(id, medioPago);
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
				const result = await this.medioPagoRepository.remove(id);
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

	async removeByPersona(idTipoPersona: number, idPersona: number) {
		return new Promise( async (resolve, reject) => {
			try {
				const result = await this.medioPagoRepository.removeByPersona(idTipoPersona, idPersona);
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

}
