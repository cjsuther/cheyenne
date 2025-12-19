import DebitoAutomatico from '../entities/debito-automatico';
import IDebitoAutomaticoRepository from '../repositories/debito-automatico-repository';
import { isValidInteger, isValidString, isValidDate,  } from '../../infraestructure/sdk/utils/validator';
import ValidationError from '../../infraestructure/sdk/error/validation-error';
import ProcessError from '../../infraestructure/sdk/error/process-error';
import ReferenceError from '../../infraestructure/sdk/error/reference-error';
import DebitoAutomaticoState from '../dto/debito-automatico-state';

export default class DebitoAutomaticoService {

	debitoAutomaticoRepository: IDebitoAutomaticoRepository;

	constructor(debitoAutomaticoRepository: IDebitoAutomaticoRepository) {
		this.debitoAutomaticoRepository = debitoAutomaticoRepository;
	}

	async listByCuenta(idCuenta: number) {
		return new Promise( async (resolve, reject) => {
			try {
				const result = (await this.debitoAutomaticoRepository.listByCuenta(idCuenta) as Array<DebitoAutomaticoState>).sort((a, b) => a.id - b.id);
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async listBySubTasa(idSubTasa: number) {
		return new Promise( async (resolve, reject) => {
			try {
				const result = (await this.debitoAutomaticoRepository.listBySubTasa(idSubTasa) as Array<DebitoAutomatico>);
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
				const result = await this.debitoAutomaticoRepository.findById(id);
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

	async add(debitoAutomatico: DebitoAutomatico) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidInteger(debitoAutomatico.idCuenta, true) ||
					!isValidInteger(debitoAutomatico.idCuenta, true) ||
					!isValidInteger(debitoAutomatico.idTasa, true) ||
					!isValidInteger(debitoAutomatico.idSubTasa, true) ||
					!isValidInteger(debitoAutomatico.idRubro, false) ||
					!isValidInteger(debitoAutomatico.idTipoSolicitudDebitoAutomatico, false) ||
					!isValidString(debitoAutomatico.numeroSolicitudDebitoAutomatico, false) ||
					!isValidInteger(debitoAutomatico.idMedioPago, true) ||
					!isValidDate(debitoAutomatico.fechaDesde, true) ||
					!isValidDate(debitoAutomatico.fechaAlta, true) ||
					!isValidDate(debitoAutomatico.fechaBaja, false)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				debitoAutomatico.id = null;
				const result = await this.debitoAutomaticoRepository.add(debitoAutomatico);
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async modify(id: number, debitoAutomatico: DebitoAutomatico) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidInteger(debitoAutomatico.idCuenta, true) ||
					!isValidInteger(debitoAutomatico.idCuenta, true) ||
					!isValidInteger(debitoAutomatico.idTasa, true) ||
					!isValidInteger(debitoAutomatico.idSubTasa, true) ||
					!isValidInteger(debitoAutomatico.idRubro, false) ||
					!isValidInteger(debitoAutomatico.idTipoSolicitudDebitoAutomatico, false) ||
					!isValidString(debitoAutomatico.numeroSolicitudDebitoAutomatico, false) ||
					!isValidInteger(debitoAutomatico.idMedioPago, true) ||
					!isValidDate(debitoAutomatico.fechaDesde, true) ||
					!isValidDate(debitoAutomatico.fechaAlta, true) ||
					!isValidDate(debitoAutomatico.fechaBaja, false)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				const result = await this.debitoAutomaticoRepository.modify(id, debitoAutomatico);
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
				const result = await this.debitoAutomaticoRepository.remove(id);
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
				const result = await this.debitoAutomaticoRepository.removeByCuenta(idCuenta);
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

}
