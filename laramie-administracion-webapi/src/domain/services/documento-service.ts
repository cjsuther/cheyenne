import Documento from '../entities/documento';
import IDocumentoRepository from '../repositories/documento-repository';
import { isValidInteger, isValidString, isValidBoolean } from '../../infraestructure/sdk/utils/validator';
import ValidationError from '../../infraestructure/sdk/error/validation-error';
import ProcessError from '../../infraestructure/sdk/error/process-error';
import ReferenceError from '../../infraestructure/sdk/error/reference-error';
import DocumentoState from '../dto/documento-state';

export default class DocumentoService {

	documentoRepository: IDocumentoRepository;

	constructor(documentoRepository: IDocumentoRepository) {
		this.documentoRepository = documentoRepository;
	}

	async list() {
		return new Promise( async (resolve, reject) => {
			try {
				const result = await this.documentoRepository.list();
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
				const result = (await this.documentoRepository.listByPersona(idTipoPersona, idPersona) as Array<DocumentoState>).sort((a, b) => a.id - b.id);
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
				const result = await this.documentoRepository.findById(id);
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

	async add(documento: Documento) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidInteger(documento.idTipoPersona, true) ||
					!isValidInteger(documento.idPersona, true) ||
					!isValidInteger(documento.idTipoDocumento, true) ||
					!isValidString(documento.numeroDocumento, true) ||
					!isValidBoolean(documento.principal)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				documento.id = null;
				const result = await this.documentoRepository.add(documento);
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async modify(id: number, documento: Documento) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidInteger(documento.idTipoPersona, true) ||
					!isValidInteger(documento.idPersona, true) ||
					!isValidInteger(documento.idTipoDocumento, true) ||
					!isValidString(documento.numeroDocumento, true) ||
					!isValidBoolean(documento.principal)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				const result = await this.documentoRepository.modify(id, documento);
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
				const result = await this.documentoRepository.remove(id);
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
				const result = await this.documentoRepository.removeByPersona(idTipoPersona, idPersona);
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

}
