import Superficie from '../entities/superficie';
import SuperficieState from '../dto/superficie-state';
import ISuperficieRepository from '../repositories/superficie-repository';
import { isValidString, isValidInteger, isValidDate, isValidBoolean, isValidFloat,  } from '../../infraestructure/sdk/utils/validator';
import ValidationError from '../../infraestructure/sdk/error/validation-error';
import ProcessError from '../../infraestructure/sdk/error/process-error';
import ReferenceError from '../../infraestructure/sdk/error/reference-error';

export default class SuperficieService {

	superficieRepository: ISuperficieRepository;

	constructor(superficieRepository: ISuperficieRepository) {
		this.superficieRepository = superficieRepository;
	}

	async listByInmueble(idInmueble: number) {
		return new Promise( async (resolve, reject) => {
			try {
				const result = (await this.superficieRepository.listByInmueble(idInmueble) as Array<SuperficieState>).sort((a, b) => a.id - b.id);
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
				const result = await this.superficieRepository.findById(id);
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

	async add(superficie: Superficie) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidInteger(superficie.idInmueble, true) ||
					!isValidString(superficie.nroSuperficie, true) ||
					!isValidString(superficie.nroInterno, false) ||
					!isValidString(superficie.nroDeclaracionJurada, false) ||
					!isValidInteger(superficie.idTipoSuperficie, true) ||
					!isValidFloat(superficie.metros, true) ||
					!isValidString(superficie.plano, false) ||
					!isValidInteger(superficie.idGrupoSuperficie, false) ||
					!isValidInteger(superficie.idTipoObraSuperficie, false) ||
					!isValidInteger(superficie.idDestinoSuperficie, false) ||
					!isValidDate(superficie.fechaIntimacion, false) ||
					!isValidString(superficie.nroIntimacion, false) ||
					!isValidString(superficie.nroAnterior, false) ||
					!isValidDate(superficie.fechaPresentacion, false) ||
					!isValidDate(superficie.fechaVigenteDesde, false) ||
					!isValidDate(superficie.fechaRegistrado, false) ||
					!isValidDate(superficie.fechaPermisoProvisorio, false) ||
					!isValidDate(superficie.fechaAprobacion, false) ||
					!isValidBoolean(superficie.conformeObra) ||
					!isValidDate(superficie.fechaFinObra, false) ||
					!isValidString(superficie.ratificacion, false) ||
					!isValidString(superficie.derechos, false)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				superficie.id = null;
				const result = await this.superficieRepository.add(superficie);
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async modify(id: number, superficie: Superficie) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidInteger(superficie.idInmueble, true) ||
					!isValidString(superficie.nroSuperficie, true) ||
					!isValidString(superficie.nroInterno, false) ||
					!isValidString(superficie.nroDeclaracionJurada, false) ||
					!isValidInteger(superficie.idTipoSuperficie, true) ||
					!isValidFloat(superficie.metros, true) ||
					!isValidString(superficie.plano, false) ||
					!isValidInteger(superficie.idGrupoSuperficie, false) ||
					!isValidInteger(superficie.idTipoObraSuperficie, false) ||
					!isValidInteger(superficie.idDestinoSuperficie, false) ||
					!isValidDate(superficie.fechaIntimacion, false) ||
					!isValidString(superficie.nroIntimacion, false) ||
					!isValidString(superficie.nroAnterior, false) ||
					!isValidDate(superficie.fechaPresentacion, false) ||
					!isValidDate(superficie.fechaVigenteDesde, false) ||
					!isValidDate(superficie.fechaRegistrado, false) ||
					!isValidDate(superficie.fechaPermisoProvisorio, false) ||
					!isValidDate(superficie.fechaAprobacion, false) ||
					!isValidBoolean(superficie.conformeObra) ||
					!isValidDate(superficie.fechaFinObra, false) ||
					!isValidString(superficie.ratificacion, false) ||
					!isValidString(superficie.derechos, false)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				const result = await this.superficieRepository.modify(id, superficie);
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
				const result = await this.superficieRepository.remove(id);
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

	async removeByInmueble(idInmueble: number) {
		return new Promise( async (resolve, reject) => {
			try {
				const result = await this.superficieRepository.removeByInmueble(idInmueble);
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

}