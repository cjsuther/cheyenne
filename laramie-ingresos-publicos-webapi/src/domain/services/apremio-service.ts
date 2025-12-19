import IApremioRepository from '../repositories/apremio-repository';
import ICertificadoApremioRepository from '../repositories/certificado-apremio-repository';
import TipoActoProcesalService from './tipo-acto-procesal-service';
import NumeracionService from './numeracion-service';
import InformacionAdicionalService from './informacion-adicional-service';

import ApremioDTO from '../dto/apremio-dto';
import ApremioFilter from '../dto/apremio-filter';
import Apremio from '../entities/apremio';
import Archivo from '../entities/archivo';
import Observacion from '../entities/observacion';
import Etiqueta from '../entities/etiqueta';
import JuicioCitacion from '../entities/juicio-citacion';
import ActoProcesal from '../entities/acto-procesal';
import ArchivoState from '../dto/archivo-state';
import ObservacionState from '../dto/observacion-state';
import EtiquetaState from '../dto/etiqueta-state';
import JuicioCitacionState from '../dto/juicio-citacion-state';
import ActoProcesalState from '../dto/acto-procesal-state';
import ArchivoService from './archivo-service';
import ObservacionService from './observacion-service';
import EtiquetaService from './etiqueta-service';
import JuicioCitacionService from './juicio-citacion-service';
import ActoProcesalService from './acto-procesal-service';

import { isValidString, isValidInteger, isValidDate,  } from '../../infraestructure/sdk/utils/validator';
import ValidationError from '../../infraestructure/sdk/error/validation-error';
import ProcessError from '../../infraestructure/sdk/error/process-error';
import ReferenceError from '../../infraestructure/sdk/error/reference-error';
import CertificadoApremio from '../entities/certificado-apremio';
import InformacionAdicionalDTO from '../dto/informacion-adicional-dto';
import TipoActoProcesal from '../entities/tipo-acto-procesal';


export default class ApremioService {

	apremioRepository: IApremioRepository;
	certificadoApremioRepository: ICertificadoApremioRepository;
	tipoActoProcesalService: TipoActoProcesalService;
	numeracionService: NumeracionService;
	informacionAdicionalService: InformacionAdicionalService;
	archivoService: ArchivoService;
    observacionService: ObservacionService;
    etiquetaService: EtiquetaService;
	juicioCitacionService: JuicioCitacionService;
	actoProcesalService: ActoProcesalService;

	constructor(apremioRepository: IApremioRepository, certificadoApremioRepository: ICertificadoApremioRepository, tipoActoProcesalService: TipoActoProcesalService,
				informacionAdicionalService: InformacionAdicionalService, numeracionService: NumeracionService,
				archivoService: ArchivoService, observacionService: ObservacionService, etiquetaService: EtiquetaService,
				juicioCitacionService: JuicioCitacionService, actoProcesalService: ActoProcesalService) {
		this.apremioRepository = apremioRepository;
		this.certificadoApremioRepository = certificadoApremioRepository;
		this.tipoActoProcesalService = tipoActoProcesalService;
		this.informacionAdicionalService = informacionAdicionalService;
		this.numeracionService = numeracionService;
		this.archivoService = archivoService;
        this.observacionService = observacionService;
        this.etiquetaService = etiquetaService;
		this.juicioCitacionService = juicioCitacionService;
		this.actoProcesalService = actoProcesalService;
	}

	async list() {
		return new Promise( async (resolve, reject) => {
			try {
				const result = await this.apremioRepository.list();
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async listByFilter(apremioFilter: ApremioFilter) {
		return new Promise( async (resolve, reject) => {
			try {
                const result = (await this.apremioRepository.listByFilter(apremioFilter) as Array<Apremio>).sort((a, b) => a.id - b.id);
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
				let apremioDTO = new ApremioDTO();
				apremioDTO.apremio = await this.apremioRepository.findById(id) as Apremio;
				if (!apremioDTO.apremio) {
					reject(new ReferenceError('No existe el registro'));
					return;
				}

				apremioDTO.certificadosApremio = await this.certificadoApremioRepository.listByApremio(id) as Array<CertificadoApremio>;
				apremioDTO.juicioCitaciones = await this.juicioCitacionService.listByApremio(id) as Array<JuicioCitacionState>;
				apremioDTO.actosProcesales = await this.actoProcesalService.listByApremio(id) as Array<ActoProcesalState>;

				let archivos = await this.archivoService.listByEntidad("Apremio", id) as Array<ArchivoState>;
                let observaciones = await this.observacionService.listByEntidad("Apremio", id) as Array<ObservacionState>;
                let etiquetas = await this.etiquetaService.listByEntidad("Apremio", id) as Array<EtiquetaState>;

				for(let i=0; i<apremioDTO.juicioCitaciones.length; i++) {
					const juicioCitacion_archivos = await this.archivoService.listByEntidad("JuicioCitacion", apremioDTO.juicioCitaciones[i].id) as Array<ArchivoState>;
					const juicioCitacion_observaciones = await this.observacionService.listByEntidad("JuicioCitacion", apremioDTO.juicioCitaciones[i].id) as Array<ObservacionState>;
					const juicioCitacion_etiquetas = await this.etiquetaService.listByEntidad("JuicioCitacion", apremioDTO.juicioCitaciones[i].id) as Array<EtiquetaState>;
					if (juicioCitacion_archivos.length > 0) archivos = archivos.concat(juicioCitacion_archivos);
					if (juicioCitacion_observaciones.length > 0) observaciones = observaciones.concat(juicioCitacion_observaciones);
					if (juicioCitacion_etiquetas.length > 0) etiquetas = etiquetas.concat(juicioCitacion_etiquetas);
				}

				for(let i=0; i<apremioDTO.actosProcesales.length; i++) {
					const actoProcesal_archivos = await this.archivoService.listByEntidad("ActoProcesal", apremioDTO.actosProcesales[i].id) as Array<ArchivoState>;
					const actoProcesal_observaciones = await this.observacionService.listByEntidad("ActoProcesal", apremioDTO.actosProcesales[i].id) as Array<ObservacionState>;
					const actoProcesal_etiquetas = await this.etiquetaService.listByEntidad("ActoProcesal", apremioDTO.actosProcesales[i].id) as Array<EtiquetaState>;
					if (actoProcesal_archivos.length > 0) archivos = archivos.concat(actoProcesal_archivos);
					if (actoProcesal_observaciones.length > 0) observaciones = observaciones.concat(actoProcesal_observaciones);
					if (actoProcesal_etiquetas.length > 0) etiquetas = etiquetas.concat(actoProcesal_etiquetas);
				}
				
				apremioDTO.archivos = archivos;
                apremioDTO.observaciones = observaciones;
                apremioDTO.etiquetas = etiquetas;

				resolve(apremioDTO);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async add(idCertificadoApremio: number, idUsuario: number, apremioDTO: ApremioDTO) {
		const resultTransaction = this.apremioRepository.onTransaction( async () => {
			return new Promise( async (resolve, reject) => {
				try {
					let apremio = apremioDTO.apremio;
					if (
						!isValidInteger(apremio.idExpediente, true) ||
						!isValidInteger(apremio.idOrganismoJudicial, true) ||
						!isValidDate(apremio.fechaInicioDemanda, true) ||
						!isValidString(apremio.carpeta, true) ||
						!isValidString(apremio.caratula, true)
					) {
						reject(new ValidationError('Existen campos incompletos'));
						return;
					}

					let certificadoApremio = this.certificadoApremioRepository.findById(idCertificadoApremio) as CertificadoApremio;
					if (!certificadoApremio) {
						reject(new ReferenceError('No existe el registro'));
						return;
					}

					const numeroApremio:number = await this.numeracionService.findByProximo("LegalNumeroApremio") as number;

					apremio.id = null;
					apremio.numero = numeroApremio.toString();
					apremio.estado = "DEMANDA INICIADA";
					apremio = await this.apremioRepository.add(apremio);

					//actualizo el id padre al certificado que le dio origen al apremio
					certificadoApremio.idApremio = apremio.id;
					await this.certificadoApremioRepository.modify(idCertificadoApremio, certificadoApremio);

					//proceso los archivos, observaciones y etiquetas
					let requests = [];
					apremioDTO.archivos.forEach(async row => {
						if (row.state === 'a') {
							row.idEntidad = apremio.id;
							requests.push(this.archivoService.add(idUsuario, row as Archivo));
						}
					});
					apremioDTO.observaciones.forEach(async row => {
						if (row.state === 'a') {
							row.idEntidad = apremio.id;
							requests.push(this.observacionService.add(idUsuario, row as Observacion));
						}
					});
					apremioDTO.etiquetas.forEach(async row => {
						if (row.state === 'a') {
							row.idEntidad = apremio.id;
							requests.push(this.etiquetaService.add(row as Etiqueta));
						}
					});

					Promise.all(requests)
					.then(responses => {
						this.findById(apremio.id).then(resolve).catch(reject);
					})
					.catch((error) => {
						reject(error);
					});
				}
				catch(error) {
					if (error instanceof ValidationError ||
						error instanceof ProcessError ||
						error instanceof ReferenceError) {
						reject(error);
					}
					else {
						reject(new ProcessError('Error procesando datos', error));
					}
				}
			});
		});
		return resultTransaction;
	}

	async modify(id: number, idUsuario: number, apremioDTO: ApremioDTO) {
		const resultTransaction = this.apremioRepository.onTransaction( async () => {
			return new Promise( async (resolve, reject) => {
				try {
					let apremio = apremioDTO.apremio;
					if (
						!isValidInteger(apremio.idExpediente, true) ||
						!isValidInteger(apremio.idOrganismoJudicial, true) ||
						!isValidDate(apremio.fechaInicioDemanda, true) ||
						!isValidString(apremio.carpeta, true) ||
						!isValidString(apremio.caratula, true)
					) {
						reject(new ValidationError('Existen campos incompletos'));
						return;
					}

					apremio = await this.apremioRepository.modify(id, apremio);
					if (!apremio) {
						reject(new ReferenceError('No existe el registro'));
						return;
					}

					apremioDTO.apremio = await this.apremioRepository.modify(id, apremioDTO.apremio) as Apremio;

                    let logAddAsyncPrimario = [];
					let requestAdd = [];
					let requestOther = [];

					apremioDTO.juicioCitaciones.forEach(async row => {
                        if (row.state === 'a') {
                            logAddAsyncPrimario.push({entity: 'JuicioCitacion', idSource: row.id});
                            requestAdd.push(this.juicioCitacionService.add(row as JuicioCitacion));
                        }
                        else if (row.state === 'm') {
                            requestOther.push(this.juicioCitacionService.modify(row.id, row as JuicioCitacion));
                        }
                        else if (row.state === 'r') {
                            requestOther.push(this.juicioCitacionService.remove(row.id));
                        }
                    });

					apremioDTO.actosProcesales.forEach(async row => {
                        if (row.state === 'a') {
                            logAddAsyncPrimario.push({entity: 'ActoProcesal', idSource: row.id});
                            requestAdd.push(this.actoProcesalService.add(row as ActoProcesal));
                        }
                        else if (row.state === 'm') {
                            requestOther.push(this.actoProcesalService.modify(row.id, row as ActoProcesal));
                        }
                        else if (row.state === 'r') {
                            requestOther.push(this.actoProcesalService.remove(row.id));
                        }
                    });

					Promise.all(requestAdd)
					.then(responses => {
                        //actualizo las id definitivas (para las altas)
                        for(let i=0; i<responses.length; i++) {
                            logAddAsyncPrimario[i].idTarget = responses[i].id;
                        }

                        Promise.all(requestOther)
                        .then(async responses => {
							//actualizo el estado del apremio en base al ultimo acto procesal (si hubo cambios)
							if (apremioDTO.actosProcesales.length > 0) {
								const actosProcesales = await this.actoProcesalService.listByApremio(id) as Array<ActoProcesal>;
								const ultimoActoProcesal = actosProcesales.sort((a,b) => b.id - a.id)[0] as ActoProcesal;
								const tipoActoProcesal = await this.tipoActoProcesalService.findById(ultimoActoProcesal.idTipoActoProcesal) as TipoActoProcesal;
								apremioDTO.apremio.estado = tipoActoProcesal.descripcion;
								apremioDTO.apremio = await this.apremioRepository.modify(id, apremioDTO.apremio) as Apremio;
							}

                            //unifico los logs
                            const logAdd = logAddAsyncPrimario;
                            //proceso los archivos, observaciones y etiquetas
                            let informacionAdicionalDTO = new InformacionAdicionalDTO(apremioDTO.archivos, apremioDTO.observaciones, apremioDTO.etiquetas);
                            this.informacionAdicionalService.modifyFixId(idUsuario, informacionAdicionalDTO, logAdd)
                            .then(responses => {
                                this.findById(id).then(resolve).catch(reject);
                            })
                            .catch((error) => {
                                reject(error);
                            });

                        })
                        .catch((error) => {
                            reject(error);
                        });
					})
					.catch((error) => {
						reject(error);
					});

				}
				catch(error) {
					if (error instanceof ValidationError ||
						error instanceof ProcessError ||
						error instanceof ReferenceError) {
						reject(error);
					}
					else {
						reject(new ProcessError('Error procesando datos', error));
					}
				}
			});
		});
		return resultTransaction;
	}

	async remove(id: number) {
        const resultTransaction = this.apremioRepository.onTransaction( async () => {
            return new Promise( async (resolve, reject) => {
                try {
                    const apremio = await this.apremioRepository.findById(id) as Apremio;
                    if (!apremio) {
                        reject(new ReferenceError('No existe el registro'));
                        return;
                    }

					await this.juicioCitacionService.removeByApremio(id);
                    await this.actoProcesalService.removeByApremio(id);

                    const result = await this.apremioRepository.remove(id);
					resolve(result);
                }
                catch(error) {
                    if (error instanceof ValidationError ||
                        error instanceof ProcessError ||
                        error instanceof ReferenceError) {
                        reject(error);
                    }
                    else {
                        reject(new ProcessError('Error procesando datos', error));
                    }
                }
            });
		});
		return resultTransaction;
    }

}
