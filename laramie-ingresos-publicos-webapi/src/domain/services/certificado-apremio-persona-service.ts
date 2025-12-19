import CertificadoApremioPersona from '../entities/certificado-apremio-persona';
import CertificadoApremioPersonaState from '../dto/certificado-apremio-persona-state';
import ICertificadoApremioPersonaRepository from '../repositories/certificado-apremio-persona-repository';
import { isValidInteger, isValidDate, isValidString,  } from '../../infraestructure/sdk/utils/validator';
import ValidationError from '../../infraestructure/sdk/error/validation-error';
import ProcessError from '../../infraestructure/sdk/error/process-error';
import ReferenceError from '../../infraestructure/sdk/error/reference-error';

export default class CertificadoApremioPersonaService {

	certificadoApremioPersonaRepository: ICertificadoApremioPersonaRepository;

	constructor(certificadoApremioPersonaRepository: ICertificadoApremioPersonaRepository) {
		this.certificadoApremioPersonaRepository = certificadoApremioPersonaRepository;
	}

	async listByCertificadoApremio(idCertificadoApremio: number) {
		return new Promise( async (resolve, reject) => {
			try {
				const result = await this.certificadoApremioPersonaRepository.listByCertificadoApremio(idCertificadoApremio) as Array<CertificadoApremioPersonaState>;
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
				const result = await this.certificadoApremioPersonaRepository.findById(id);
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

	async add(certificadoApremioPersona: CertificadoApremioPersona) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidInteger(certificadoApremioPersona.idCertificadoApremio, true) ||
					!isValidInteger(certificadoApremioPersona.idTipoRelacionCertificadoApremioPersona, true) ||
					!isValidDate(certificadoApremioPersona.fechaDesde, false) ||
					!isValidDate(certificadoApremioPersona.fechaHasta, false) ||
					!isValidInteger(certificadoApremioPersona.idPersona, true) ||
					!isValidInteger(certificadoApremioPersona.idTipoPersona, true) ||
					!isValidString(certificadoApremioPersona.nombrePersona, true) ||
					!isValidInteger(certificadoApremioPersona.idTipoDocumento, true) ||
					!isValidString(certificadoApremioPersona.numeroDocumento, true)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				certificadoApremioPersona.id = null;
				const result = await this.certificadoApremioPersonaRepository.add(certificadoApremioPersona);
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async modify(id: number, certificadoApremioPersona: CertificadoApremioPersona) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidInteger(certificadoApremioPersona.idCertificadoApremio, true) ||
					!isValidInteger(certificadoApremioPersona.idTipoRelacionCertificadoApremioPersona, true) ||
					!isValidDate(certificadoApremioPersona.fechaDesde, false) ||
					!isValidDate(certificadoApremioPersona.fechaHasta, false) ||
					!isValidInteger(certificadoApremioPersona.idPersona, true) ||
					!isValidInteger(certificadoApremioPersona.idTipoPersona, true) ||
					!isValidString(certificadoApremioPersona.nombrePersona, true) ||
					!isValidInteger(certificadoApremioPersona.idTipoDocumento, true) ||
					!isValidString(certificadoApremioPersona.numeroDocumento, true)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				const result = await this.certificadoApremioPersonaRepository.modify(id, certificadoApremioPersona);
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
				const result = await this.certificadoApremioPersonaRepository.remove(id);
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

	async removeByCertificadoApremio(idCertificadoApremio: number) {
		return new Promise( async (resolve, reject) => {
			try {
				const result = await this.certificadoApremioPersonaRepository.removeByCertificadoApremio(idCertificadoApremio);
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

}
