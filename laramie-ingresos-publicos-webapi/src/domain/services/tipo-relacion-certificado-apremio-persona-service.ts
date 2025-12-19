import TipoRelacionCertificadoApremioPersona from '../entities/tipo-relacion-certificado-apremio-persona';
import ITipoRelacionCertificadoApremioPersonaRepository from '../repositories/tipo-relacion-certificado-apremio-persona-repository';
import { isValidString, isValidInteger } from '../../infraestructure/sdk/utils/validator';
import ValidationError from '../../infraestructure/sdk/error/validation-error';
import ProcessError from '../../infraestructure/sdk/error/process-error';
import ReferenceError from '../../infraestructure/sdk/error/reference-error';

export default class TipoRelacionCertificadoApremioPersonaService {

	tipoRelacionCertificadoApremioPersonaRepository: ITipoRelacionCertificadoApremioPersonaRepository;

	constructor(tipoRelacionCertificadoApremioPersonaRepository: ITipoRelacionCertificadoApremioPersonaRepository) {
		this.tipoRelacionCertificadoApremioPersonaRepository = tipoRelacionCertificadoApremioPersonaRepository;
	}

	async list() {
		return new Promise( async (resolve, reject) => {
			try {
				const result = await this.tipoRelacionCertificadoApremioPersonaRepository.list();
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
				const result = await this.tipoRelacionCertificadoApremioPersonaRepository.findById(id);
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

	async add(tipoRelacionCertificadoApremioPersona: TipoRelacionCertificadoApremioPersona) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidString(tipoRelacionCertificadoApremioPersona.codigo, true) ||
					!isValidString(tipoRelacionCertificadoApremioPersona.descripcion, true) ||
					!isValidInteger(tipoRelacionCertificadoApremioPersona.idTipoControlador, false)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				tipoRelacionCertificadoApremioPersona.id = null;
				if (tipoRelacionCertificadoApremioPersona.idTipoControlador === 0) tipoRelacionCertificadoApremioPersona.idTipoControlador = null;
				const result = await this.tipoRelacionCertificadoApremioPersonaRepository.add(tipoRelacionCertificadoApremioPersona);
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async modify(id: number, tipoRelacionCertificadoApremioPersona: TipoRelacionCertificadoApremioPersona) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidString(tipoRelacionCertificadoApremioPersona.codigo, true) ||
					!isValidString(tipoRelacionCertificadoApremioPersona.descripcion, true) ||
					!isValidInteger(tipoRelacionCertificadoApremioPersona.idTipoControlador, false)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				if (tipoRelacionCertificadoApremioPersona.idTipoControlador === 0) tipoRelacionCertificadoApremioPersona.idTipoControlador = null;
				const result = await this.tipoRelacionCertificadoApremioPersonaRepository.modify(id, tipoRelacionCertificadoApremioPersona);
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
				const result = await this.tipoRelacionCertificadoApremioPersonaRepository.remove(id);
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
