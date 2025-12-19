import SubTasa from '../entities/sub-tasa';
import Archivo from '../entities/archivo';
import Observacion from '../entities/observacion';
import Etiqueta from '../entities/etiqueta';
import SubTasaImputacion from '../entities/sub-tasa-imputacion';

import SubTasaDTO from '../dto/sub-tasa-dto';
import SubTasaFilter from '../dto/sub-tasa-filter';
import InformacionAdicionalDTO from '../dto/informacion-adicional-dto';
import ArchivoState from '../dto/archivo-state';
import ObservacionState from '../dto/observacion-state';
import EtiquetaState from '../dto/etiqueta-state';
import SubTasaImputacionState from '../dto/sub-tasa-imputacion-state';

import ISubTasaRepository from '../repositories/sub-tasa-repository';
import InformacionAdicionalService from './informacion-adicional-service';
import ArchivoService from './archivo-service';
import ObservacionService from './observacion-service';
import EtiquetaService from './etiqueta-service';
import SubTasaImputacionService from './sub-tasa-imputacion-service';

import { isValidInteger, isValidString, isValidDate, isValidBoolean, isValidFloat  } from '../../infraestructure/sdk/utils/validator';
import ValidationError from '../../infraestructure/sdk/error/validation-error';
import ProcessError from '../../infraestructure/sdk/error/process-error';
import ReferenceError from '../../infraestructure/sdk/error/reference-error';


export default class SubTasaService {

	subTasaRepository: ISubTasaRepository;
    informacionAdicionalService: InformacionAdicionalService;
	archivoService: ArchivoService;
    observacionService: ObservacionService;
    etiquetaService: EtiquetaService;
	subTasaImputacionService: SubTasaImputacionService;

	constructor(subTasaRepository: ISubTasaRepository, informacionAdicionalService: InformacionAdicionalService,
				archivoService: ArchivoService, observacionService: ObservacionService, etiquetaService: EtiquetaService,
				subTasaImputacionService: SubTasaImputacionService) {
		this.subTasaRepository = subTasaRepository;
        this.informacionAdicionalService = informacionAdicionalService;
		this.archivoService = archivoService;
        this.observacionService = observacionService;
        this.etiquetaService = etiquetaService;
		this.subTasaImputacionService = subTasaImputacionService;
	}

	async list() {
		return new Promise( async (resolve, reject) => {
			try {
				const result = await this.subTasaRepository.list();
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async listByFilter(subTasaFilter: SubTasaFilter) {
		return new Promise( async (resolve, reject) => {
			try {
				let result = null;
                let data = (await this.subTasaRepository.listByFilter(subTasaFilter) as Array<SubTasa>).sort((a, b) => a.id - b.id);
				if (subTasaFilter.etiqueta.length > 0) {
					const etiquetas = (await this.etiquetaService.listByCodigo(subTasaFilter.etiqueta) as Array<Etiqueta>).filter(f => f.entidad === "SubTasa");
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
				let subTasaDTO = new SubTasaDTO();
				subTasaDTO.subTasa = await this.subTasaRepository.findById(id) as SubTasa;
				if (!subTasaDTO.subTasa) {
					reject(new ReferenceError('No existe el registro'));
					return;
				}
				subTasaDTO.subTasaImputaciones = await this.subTasaImputacionService.listBySubTasa(id) as Array<SubTasaImputacionState>;

				let archivos = await this.archivoService.listByEntidad("SubTasa", id) as Array<ArchivoState>;
                let observaciones = await this.observacionService.listByEntidad("SubTasa", id) as Array<ObservacionState>;
                let etiquetas = await this.etiquetaService.listByEntidad("SubTasa", id) as Array<EtiquetaState>;

				for(let i=0; i<subTasaDTO.subTasaImputaciones.length; i++) {
					const subTasaImputacion_archivos = await this.archivoService.listByEntidad("SubTasaImputacion", subTasaDTO.subTasaImputaciones[i].id) as Array<ArchivoState>;
					const subTasaImputacion_observaciones = await this.observacionService.listByEntidad("SubTasaImputacion", subTasaDTO.subTasaImputaciones[i].id) as Array<ObservacionState>;
					const subTasaImputacion_etiquetas = await this.etiquetaService.listByEntidad("SubTasaImputacion", subTasaDTO.subTasaImputaciones[i].id) as Array<EtiquetaState>;
					if (subTasaImputacion_archivos.length > 0) archivos = archivos.concat(subTasaImputacion_archivos);
					if (subTasaImputacion_observaciones.length > 0) observaciones = observaciones.concat(subTasaImputacion_observaciones);
					if (subTasaImputacion_etiquetas.length > 0) etiquetas = etiquetas.concat(subTasaImputacion_etiquetas);
				}
				
				subTasaDTO.archivos = archivos;
                subTasaDTO.observaciones = observaciones;
                subTasaDTO.etiquetas = etiquetas;

				resolve(subTasaDTO);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async add(idUsuario: number, subTasaDTO: SubTasaDTO) {
		const resultTransaction = this.subTasaRepository.onTransaction( async () => {
			return new Promise( async (resolve, reject) => {
				try {
					let subTasa = subTasaDTO.subTasa;
					if (
						!isValidInteger(subTasa.idTasa, true) ||
						!isValidString(subTasa.codigo, true) ||
						!isValidString(subTasa.descripcion, true) ||
						!isValidFloat(subTasa.impuestoNacional,  false) ||
						!isValidFloat(subTasa.impuestoProvincial, false) ||
						!isValidFloat(subTasa.ctasCtes, false) ||
						!isValidFloat(subTasa.timbradosExtras, false) ||
						!isValidString(subTasa.descripcionReducida, false) ||
						!isValidDate(subTasa.fechaDesde, false) ||
						!isValidDate(subTasa.fechaHasta, false) ||
						!isValidBoolean(subTasa.rubroGenerico) ||
						!isValidBoolean(subTasa.liquidableCtaCte) ||
						!isValidBoolean(subTasa.liquidableDDJJ) ||
						!isValidBoolean(subTasa.actualizacion) ||
						!isValidBoolean(subTasa.accesorios) ||
						!isValidBoolean(subTasa.internetDDJJ) ||
						!isValidBoolean(subTasa.imputXPorc)
					) {
						reject(new ValidationError('Existen campos incompletos'));
						return;
					}

					subTasa.id = null;
					subTasa = await this.subTasaRepository.add(subTasaDTO.subTasa) as SubTasa;

					//proceso los archivos, observaciones y etiquetas
					let executesInfo = [];
					subTasaDTO.archivos.forEach(async row => {
						if (row.state === 'a') {
							row.idEntidad = subTasa.id;
							executesInfo.push(this.archivoService.add(idUsuario, row as Archivo));
						}
					});
					subTasaDTO.observaciones.forEach(async row => {
						if (row.state === 'a') {
							row.idEntidad = subTasa.id;
							executesInfo.push(this.observacionService.add(idUsuario, row as Observacion));
						}
					});
					subTasaDTO.etiquetas.forEach(async row => {
						if (row.state === 'a') {
							row.idEntidad = subTasa.id;
							executesInfo.push(this.etiquetaService.add(row as Etiqueta));
						}
					});

					Promise.all(executesInfo)
					.then(responses => {
						this.findById(subTasa.id).then(resolve).catch(reject);
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

	async modify(id: number, idUsuario: number, subTasaDTO: SubTasaDTO) {
		const resultTransaction = this.subTasaRepository.onTransaction( async () => {
			return new Promise( async (resolve, reject) => {
				try {
					let subTasa = subTasaDTO.subTasa;
					if (
						!isValidInteger(subTasa.idTasa, true) ||
						!isValidString(subTasa.codigo, true) ||
						!isValidString(subTasa.descripcion, true) ||
						!isValidFloat(subTasa.impuestoNacional,  false) ||
						!isValidFloat(subTasa.impuestoProvincial, false) ||
						!isValidFloat(subTasa.ctasCtes, false) ||
						!isValidFloat(subTasa.timbradosExtras, false) ||
						!isValidString(subTasa.descripcionReducida, false) ||
						!isValidDate(subTasa.fechaDesde, false) ||
						!isValidDate(subTasa.fechaHasta, false) ||
						!isValidBoolean(subTasa.rubroGenerico) ||
						!isValidBoolean(subTasa.liquidableCtaCte) ||
						!isValidBoolean(subTasa.liquidableDDJJ) ||
						!isValidBoolean(subTasa.actualizacion) ||
						!isValidBoolean(subTasa.accesorios) ||
						!isValidBoolean(subTasa.internetDDJJ) ||
						!isValidBoolean(subTasa.imputXPorc)
					) {
						reject(new ValidationError('Existen campos incompletos'));
						return;
					}

					subTasaDTO.subTasa = await this.subTasaRepository.modify(id, subTasaDTO.subTasa) as SubTasa;

					let logAddAsyncPrimario = [];
					let requestAdd = [];
					let requestOther = [];

					subTasaDTO.subTasaImputaciones.forEach(async row => {
                        if (row.state === 'a') {
							logAddAsyncPrimario.push({entity: 'SubTasaImputacion', idSource: row.id});
                            requestAdd.push(this.subTasaImputacionService.add(row as SubTasaImputacion));
                        }
                        else if (row.state === 'm') {
                            requestOther.push(this.subTasaImputacionService.modify(row.id, row as SubTasaImputacion));
                        }
                        else if (row.state === 'r') {
                            requestOther.push(this.subTasaImputacionService.remove(row.id));
                        }
                    });

					Promise.all(requestAdd)
					.then(responses => {
                        //actualizo las id definitivas (para las altas)
                        for(let i=0; i<responses.length; i++) {
                            logAddAsyncPrimario[i].idTarget = responses[i].id;
                        }

                        Promise.all(requestOther)
                        .then(responses => {
                            //unifico los logs
                            const logAdd = logAddAsyncPrimario;
                            //proceso los archivos, observaciones y etiquetas
                            let informacionAdicionalDTO = new InformacionAdicionalDTO(subTasaDTO.archivos, subTasaDTO.observaciones, subTasaDTO.etiquetas);
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
        const resultTransaction = this.subTasaRepository.onTransaction( async () => {
            return new Promise( async (resolve, reject) => {
                try {
                    const subTasa = await this.subTasaRepository.findById(id) as SubTasa;
                    if (!subTasa) {
                        reject(new ReferenceError('No existe el registro'));
                        return;
                    }

                    await this.subTasaImputacionService.removeBySubTasa(id);

                    const result = await this.subTasaRepository.remove(id);
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
