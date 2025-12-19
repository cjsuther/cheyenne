import CertificadoApremioItem from '../entities/certificado-apremio-item';
import ICertificadoApremioItemRepository from '../repositories/certificado-apremio-item-repository';
import { isValidInteger, isValidString, isValidNumber,  } from '../../infraestructure/sdk/utils/validator';
import ValidationError from '../../infraestructure/sdk/error/validation-error';
import ProcessError from '../../infraestructure/sdk/error/process-error';
import ReferenceError from '../../infraestructure/sdk/error/reference-error';

export default class CertificadoApremioItemService {

	certificadoApremioItemRepository: ICertificadoApremioItemRepository;

	constructor(certificadoApremioItemRepository: ICertificadoApremioItemRepository) {
		this.certificadoApremioItemRepository = certificadoApremioItemRepository;
	}

	async list() {
		return new Promise( async (resolve, reject) => {
			try {
				const result = await this.certificadoApremioItemRepository.list();
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async listByCertificadoApremio(idCertificadoApremio: number) {
        return new Promise( async (resolve, reject) => {
            try {
                const result = await this.certificadoApremioItemRepository.listByCertificadoApremio(idCertificadoApremio);
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
				const result = await this.certificadoApremioItemRepository.findById(id);
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

	async add(certificadoApremioItem: CertificadoApremioItem) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidInteger(certificadoApremioItem.idCertificadoApremio, true) ||
					!isValidInteger(certificadoApremioItem.idCuentaCorrienteItem, true) ||
					!isValidInteger(certificadoApremioItem.idTasa, true) ||
					!isValidInteger(certificadoApremioItem.idSubTasa, true) ||
					!isValidString(certificadoApremioItem.periodo, true) ||
					!isValidInteger(certificadoApremioItem.cuota, true) ||
					!isValidNumber(certificadoApremioItem.monto, true) ||
					!isValidNumber(certificadoApremioItem.montoRecargo, true) ||
					!isValidNumber(certificadoApremioItem.montoTotal, true)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				certificadoApremioItem.id = null;
				const result = await this.certificadoApremioItemRepository.add(certificadoApremioItem);
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async modify(id: number, certificadoApremioItem: CertificadoApremioItem) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidInteger(certificadoApremioItem.idCertificadoApremio, true) ||
					!isValidInteger(certificadoApremioItem.idCuentaCorrienteItem, true) ||
					!isValidInteger(certificadoApremioItem.idTasa, true) ||
					!isValidInteger(certificadoApremioItem.idSubTasa, true) ||
					!isValidString(certificadoApremioItem.periodo, true) ||
					!isValidInteger(certificadoApremioItem.cuota, true) ||
					!isValidNumber(certificadoApremioItem.monto, true) ||
					!isValidNumber(certificadoApremioItem.montoRecargo, true) ||
					!isValidNumber(certificadoApremioItem.montoTotal, true)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				const result = await this.certificadoApremioItemRepository.modify(id, certificadoApremioItem);
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
				const result = await this.certificadoApremioItemRepository.remove(id);
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
				const result = await this.certificadoApremioItemRepository.removeByCertificadoApremio(idCertificadoApremio);
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

}
