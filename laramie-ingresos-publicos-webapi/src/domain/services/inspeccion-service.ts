import Inspeccion from '../entities/inspeccion';
import InspeccionState from '../dto/inspeccion-state';
import IInspeccionRepository from '../repositories/inspeccion-repository';
import { isValidInteger, isValidString, isValidDate, isValidNumber, isValidBoolean, isValidFloat,  } from '../../infraestructure/sdk/utils/validator';
import ValidationError from '../../infraestructure/sdk/error/validation-error';
import ProcessError from '../../infraestructure/sdk/error/process-error';
import ReferenceError from '../../infraestructure/sdk/error/reference-error';

export default class InspeccionService {

	inspeccionRepository: IInspeccionRepository;

	constructor(inspeccionRepository: IInspeccionRepository) {
		this.inspeccionRepository = inspeccionRepository;
	}

	async listByComercio(idComercio: number) {
		return new Promise( async (resolve, reject) => {
			try {
				const result = (await this.inspeccionRepository.listByComercio(idComercio) as Array<InspeccionState>);
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
				const result = await this.inspeccionRepository.findById(id);
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

	async add(inspeccion: Inspeccion) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidInteger(inspeccion.idComercio, true) ||
					!isValidString(inspeccion.numero, true) ||
					!isValidInteger(inspeccion.idMotivoInspeccion, true) ||
					!isValidInteger(inspeccion.idSupervisor, true) ||
					!isValidInteger(inspeccion.idInspector, true) ||
					!isValidDate(inspeccion.fechaInicio, false) ||
					!isValidDate(inspeccion.fechaFinalizacion, false) ||
					!isValidDate(inspeccion.fechaNotificacion, false) ||
					!isValidDate(inspeccion.fechaBaja, false) ||
					!isValidString(inspeccion.anioDesde, true) ||
					!isValidString(inspeccion.mesDesde, true) ||
					!isValidString(inspeccion.anioHasta, true) ||
					!isValidString(inspeccion.mesHasta, true) ||
					!isValidString(inspeccion.numeroResolucion, true) ||
					!isValidString(inspeccion.letraResolucion, true) ||
					!isValidString(inspeccion.anioResolucion, true) ||
					!isValidDate(inspeccion.fechaResolucion, false) ||
					!isValidString(inspeccion.numeroLegajillo, true) ||
					!isValidString(inspeccion.letraLegajillo, true) ||
					!isValidString(inspeccion.anioLegajillo, true) ||
					!isValidString(inspeccion.activo, true) ||
					!isValidFloat(inspeccion.porcentajeMulta, true) ||
					!isValidString(inspeccion.emiteConstancia, true) ||
					!isValidBoolean(inspeccion.pagaPorcentaje) ||
					!isValidInteger(inspeccion.idExpediente, true)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				inspeccion.id = null;
				const result = await this.inspeccionRepository.add(inspeccion);
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async modify(id: number, inspeccion: Inspeccion) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidInteger(inspeccion.idComercio, true) ||
					!isValidString(inspeccion.numero, true) ||
					!isValidInteger(inspeccion.idMotivoInspeccion, true) ||
					!isValidInteger(inspeccion.idSupervisor, true) ||
					!isValidInteger(inspeccion.idInspector, true) ||
					!isValidDate(inspeccion.fechaInicio, false) ||
					!isValidDate(inspeccion.fechaFinalizacion, false) ||
					!isValidDate(inspeccion.fechaNotificacion, false) ||
					!isValidDate(inspeccion.fechaBaja, false) ||
					!isValidString(inspeccion.anioDesde, true) ||
					!isValidString(inspeccion.mesDesde, true) ||
					!isValidString(inspeccion.anioHasta, true) ||
					!isValidString(inspeccion.mesHasta, true) ||
					!isValidString(inspeccion.numeroResolucion, true) ||
					!isValidString(inspeccion.letraResolucion, true) ||
					!isValidString(inspeccion.anioResolucion, true) ||
					!isValidDate(inspeccion.fechaResolucion, false) ||
					!isValidString(inspeccion.numeroLegajillo, true) ||
					!isValidString(inspeccion.letraLegajillo, true) ||
					!isValidString(inspeccion.anioLegajillo, true) ||
					!isValidString(inspeccion.activo, true) ||
					!isValidFloat(inspeccion.porcentajeMulta, true) ||
					!isValidString(inspeccion.emiteConstancia, true) ||
					!isValidBoolean(inspeccion.pagaPorcentaje) ||
					!isValidInteger(inspeccion.idExpediente, true)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				const result = await this.inspeccionRepository.modify(id, inspeccion);
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
				const result = await this.inspeccionRepository.remove(id);
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

	async removeByComercio(idComercio: number) {
		return new Promise( async (resolve, reject) => {
			try {
				const result = await this.inspeccionRepository.removeByComercio(idComercio);
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

}
