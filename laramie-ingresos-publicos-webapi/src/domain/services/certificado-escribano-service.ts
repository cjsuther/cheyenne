import CertificadoEscribano from '../entities/certificado-escribano';
import ICertificadoEscribanoRepository from '../repositories/certificado-escribano-repository';
import { isValidString, isValidInteger, isValidDate,  } from '../../infraestructure/sdk/utils/validator';
import ValidationError from '../../infraestructure/sdk/error/validation-error';
import ProcessError from '../../infraestructure/sdk/error/process-error';
import ReferenceError from '../../infraestructure/sdk/error/reference-error';
import CertificadoEscribanoFilter from '../dto/certificado-escribano-filter';

import Archivo from '../entities/archivo';
import Observacion from '../entities/observacion';
import Etiqueta from '../entities/etiqueta';
import ArchivoState from '../dto/archivo-state';
import ObservacionState from '../dto/observacion-state';
import EtiquetaState from '../dto/etiqueta-state';
import ArchivoService from './archivo-service';
import ObservacionService from './observacion-service';
import EtiquetaService from './etiqueta-service';
import CertificadoEscribanoDTO from '../dto/certificado-escribano-dto';

export default class CertificadoEscribanoService {

	certificadoEscribanoRepository: ICertificadoEscribanoRepository;
	archivoService: ArchivoService;
    observacionService: ObservacionService;
    etiquetaService: EtiquetaService;

	constructor(certificadoEscribanoRepository: ICertificadoEscribanoRepository,
				archivoService: ArchivoService, observacionService: ObservacionService, etiquetaService: EtiquetaService) {
		this.certificadoEscribanoRepository = certificadoEscribanoRepository;
		this.archivoService = archivoService;
        this.observacionService = observacionService;
        this.etiquetaService = etiquetaService;
	}

	async list() {
		return new Promise( async (resolve, reject) => {
			try {
				const result = await this.certificadoEscribanoRepository.list();
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async listByFilter(certificadoEscribanoFilter: CertificadoEscribanoFilter) {
		return new Promise( async (resolve, reject) => {
			try {
				let result = null;
                let data = (await this.certificadoEscribanoRepository.listByFilter(certificadoEscribanoFilter) as Array<CertificadoEscribano>).sort((a, b) => a.id - b.id);
				if (certificadoEscribanoFilter.etiqueta.length > 0) {
					const etiquetas = (await this.etiquetaService.listByCodigo(certificadoEscribanoFilter.etiqueta) as Array<Etiqueta>).filter(f => f.entidad === "CertificadoEscribano");
					const ids = etiquetas.map(x => x.idEntidad);
					result = data.filter(f => ids.includes(f.id));
				}
				else {
					result = data;
				}
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
				let certificadoEscribanoDTO = new CertificadoEscribanoDTO();
				certificadoEscribanoDTO.certificadoEscribano = await this.certificadoEscribanoRepository.findById(id) as CertificadoEscribano;
				if (!certificadoEscribanoDTO.certificadoEscribano) {
					reject(new ReferenceError('No existe el registro'));
					return;
				}
				certificadoEscribanoDTO.archivos = await this.archivoService.listByEntidad("CertificadoEscribano", id) as Array<ArchivoState>;
                certificadoEscribanoDTO.observaciones = await this.observacionService.listByEntidad("CertificadoEscribano", id) as Array<ObservacionState>;
                certificadoEscribanoDTO.etiquetas = await this.etiquetaService.listByEntidad("CertificadoEscribano", id) as Array<EtiquetaState>;

				resolve(certificadoEscribanoDTO);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async add(idUsuario: number, certificadoEscribanoDTO: CertificadoEscribanoDTO) {
		const resultTransaction = this.certificadoEscribanoRepository.onTransaction( async () => {
			return new Promise( async (resolve, reject) => {
				try {
					let certificadoEscribano = certificadoEscribanoDTO.certificadoEscribano;
					if (
						!isValidString(certificadoEscribano.anioCertificado, true) ||
						!isValidString(certificadoEscribano.numeroCertificado, true) ||
						!isValidInteger(certificadoEscribano.idTipoCertificado, true) ||
						!isValidInteger(certificadoEscribano.idObjetoCertificado, true) ||
						!isValidInteger(certificadoEscribano.idEscribano, true) ||
						!isValidString(certificadoEscribano.transferencia, true) ||
						!isValidInteger(certificadoEscribano.idCuenta, true) ||
						!isValidString(certificadoEscribano.vendedor, true) ||
						!isValidString(certificadoEscribano.partida, true) ||
						!isValidString(certificadoEscribano.direccion, true) ||
						!isValidInteger(certificadoEscribano.idPersonaIntermediario, true) ||
						!isValidInteger(certificadoEscribano.idTipoPersonaIntermediario, true) ||
						!isValidString(certificadoEscribano.nombrePersonaIntermediario, true) ||
						!isValidInteger(certificadoEscribano.idTipoDocumentoIntermediario, true) ||
						!isValidString(certificadoEscribano.numeroDocumentoIntermediario, true) ||
						!isValidInteger(certificadoEscribano.idPersonaRetiro, true) ||
						!isValidInteger(certificadoEscribano.idTipoPersonaRetiro, true) ||
						!isValidString(certificadoEscribano.nombrePersonaRetiro, true) ||
						!isValidInteger(certificadoEscribano.idTipoDocumentoRetiro, true) ||
						!isValidString(certificadoEscribano.numeroDocumentoRetiro, true) ||
						!isValidDate(certificadoEscribano.fechaEntrada, false) ||
						!isValidDate(certificadoEscribano.fechaSalida, false) ||
						!isValidDate(certificadoEscribano.fechaEntrega, false)
					) {
						reject(new ValidationError('Existen campos incompletos'));
						return;
					}

					certificadoEscribano.id = null;
					certificadoEscribano = await this.certificadoEscribanoRepository.add(certificadoEscribano);
					if (!certificadoEscribano) {
						reject(new ReferenceError('No existe el registro'));
						return;
					}

					//proceso los archivos, observaciones y etiquetas
					let executesInfo = [];
					certificadoEscribanoDTO.archivos.forEach(async row => {
						if (row.state === 'a') {
							row.idEntidad = certificadoEscribano.id;
							executesInfo.push(this.archivoService.add(idUsuario, row as Archivo));
						}
					});
					certificadoEscribanoDTO.observaciones.forEach(async row => {
						if (row.state === 'a') {
							row.idEntidad = certificadoEscribano.id;
							executesInfo.push(this.observacionService.add(idUsuario, row as Observacion));
						}
					});
					certificadoEscribanoDTO.etiquetas.forEach(async row => {
						if (row.state === 'a') {
							row.idEntidad = certificadoEscribano.id;
							executesInfo.push(this.etiquetaService.add(row as Etiqueta));
						}
					});

					Promise.all(executesInfo)
					.then(responses => {
						resolve(certificadoEscribano);
					})
					.catch((error) => {
						reject(error);
					});

				}
				catch(error) {
					reject(new ProcessError('Error procesando datos', error));
				}
			});
		});
		return resultTransaction;
	}

	async modify(id: number, idUsuario: number, certificadoEscribanoDTO: CertificadoEscribanoDTO) {
		const resultTransaction = this.certificadoEscribanoRepository.onTransaction( async () => {
			return new Promise( async (resolve, reject) => {
				try {
					let certificadoEscribano = certificadoEscribanoDTO.certificadoEscribano;
					if (
						!isValidString(certificadoEscribano.anioCertificado, true) ||
						!isValidString(certificadoEscribano.numeroCertificado, true) ||
						!isValidInteger(certificadoEscribano.idTipoCertificado, true) ||
						!isValidInteger(certificadoEscribano.idObjetoCertificado, true) ||
						!isValidInteger(certificadoEscribano.idEscribano, true) ||
						!isValidString(certificadoEscribano.transferencia, true) ||
						!isValidInteger(certificadoEscribano.idCuenta, true) ||
						!isValidString(certificadoEscribano.vendedor, true) ||
						!isValidString(certificadoEscribano.partida, true) ||
						!isValidString(certificadoEscribano.direccion, true) ||
						!isValidInteger(certificadoEscribano.idPersonaIntermediario, true) ||
						!isValidInteger(certificadoEscribano.idTipoPersonaIntermediario, true) ||
						!isValidString(certificadoEscribano.nombrePersonaIntermediario, true) ||
						!isValidInteger(certificadoEscribano.idTipoDocumentoIntermediario, true) ||
						!isValidString(certificadoEscribano.numeroDocumentoIntermediario, true) ||
						!isValidInteger(certificadoEscribano.idPersonaRetiro, true) ||
						!isValidInteger(certificadoEscribano.idTipoPersonaRetiro, true) ||
						!isValidString(certificadoEscribano.nombrePersonaRetiro, true) ||
						!isValidInteger(certificadoEscribano.idTipoDocumentoRetiro, true) ||
						!isValidString(certificadoEscribano.numeroDocumentoRetiro, true) ||
						!isValidDate(certificadoEscribano.fechaEntrada, false) ||
						!isValidDate(certificadoEscribano.fechaSalida, false) ||
						!isValidDate(certificadoEscribano.fechaEntrega, false)
					) {
						reject(new ValidationError('Existen campos incompletos'));
						return;
					}

					certificadoEscribano.id = null;
					certificadoEscribano = await this.certificadoEscribanoRepository.modify(id, certificadoEscribano);
					if (!certificadoEscribano) {
						reject(new ReferenceError('No existe el registro'));
						return;
					}

					//proceso los archivos, observaciones y etiquetas
					let executesInfo = [];
					certificadoEscribanoDTO.archivos.forEach(async row => {
						if (row.state === 'a') {
							executesInfo.push(this.archivoService.add(idUsuario, row as Archivo));
						}
						else if (row.state === 'r') {
							executesInfo.push(this.archivoService.remove(row.id));
						}
					});
					certificadoEscribanoDTO.observaciones.forEach(async row => {
						if (row.state === 'a') {
							executesInfo.push(this.observacionService.add(idUsuario, row as Observacion));
						}
						else if (row.state === 'r') {
							executesInfo.push(this.observacionService.remove(row.id));
						}
					});
					certificadoEscribanoDTO.etiquetas.forEach(async row => {
						if (row.state === 'a') {
							executesInfo.push(this.etiquetaService.add(row as Etiqueta));
						}
						else if (row.state === 'r') {
							executesInfo.push(this.etiquetaService.remove(row.id));
						}
					});

					Promise.all(executesInfo)
					.then(responses => {
						resolve(certificadoEscribano);
					})
					.catch((error) => {
						reject(error);
					});

				}
				catch(error) {
					reject(new ProcessError('Error procesando datos', error));
				}
			});
		});
		return resultTransaction;
	}

	async remove(id: number) {
		return new Promise( async (resolve, reject) => {
			try {
				const result = await this.certificadoEscribanoRepository.remove(id);
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
