import ICertificadoApremioRepository from '../repositories/certificado-apremio-repository';
import ICertificadoApremioItemRepository from '../repositories/certificado-apremio-item-repository';
import CertificadoApremioPersonaService from './certificado-apremio-persona-service';
import ArchivoService from './archivo-service';
import ObservacionService from './observacion-service';
import EtiquetaService from './etiqueta-service';
import NumeracionService from './numeracion-service';

import CertificadoApremioDTO from '../dto/certificado-apremio-dto';
import CertificadoApremioFilter from '../dto/certificado-apremio-filter';
import CertificadoApremio from '../entities/certificado-apremio';
import CertificadoApremioItem from '../entities/certificado-apremio-item';
import CertificadoApremioPersona from '../entities/certificado-apremio-persona';
import CertificadoApremioPersonaState from '../dto/certificado-apremio-persona-state';
import Archivo from '../entities/archivo';
import Observacion from '../entities/observacion';
import Etiqueta from '../entities/etiqueta';
import ArchivoState from '../dto/archivo-state';
import ObservacionState from '../dto/observacion-state';
import EtiquetaState from '../dto/etiqueta-state';
import CuentaCorrienteItem from '../entities/cuenta-corriente-item';

import { getDateNow } from '../../infraestructure/sdk/utils/convert';
import { isValidInteger, isValidString, isValidDate, isValidFloat } from '../../infraestructure/sdk/utils/validator';
import ValidationError from '../../infraestructure/sdk/error/validation-error';
import ProcessError from '../../infraestructure/sdk/error/process-error';
import ReferenceError from '../../infraestructure/sdk/error/reference-error';
import CuentaCorrienteItemService from './cuenta-corriente-item-service';
import CuentaCorrienteItemDeudaDTO from '../dto/cuenta-corriente-item-deuda-dto';
import CuentaCorrienteItemDTO from '../dto/cuenta-corriente-item-dto';


export default class CertificadoApremioService {

	certificadoApremioRepository: ICertificadoApremioRepository;
	certificadoApremioItemRepository: ICertificadoApremioItemRepository;
	certificadoApremioPersonaService: CertificadoApremioPersonaService;
	numeracionService: NumeracionService;
	archivoService: ArchivoService;
    observacionService: ObservacionService;
    etiquetaService: EtiquetaService;
	cuentaCorrienteItemService: CuentaCorrienteItemService;

	constructor(certificadoApremioRepository: ICertificadoApremioRepository, 
				certificadoApremioItemRepository: ICertificadoApremioItemRepository,
				certificadoApremioPersonaService: CertificadoApremioPersonaService,
				numeracionService: NumeracionService,
				archivoService: ArchivoService, observacionService: ObservacionService, etiquetaService: EtiquetaService,
				cuentaCorrienteItemService: CuentaCorrienteItemService) {
		this.certificadoApremioRepository = certificadoApremioRepository;
		this.certificadoApremioItemRepository = certificadoApremioItemRepository;
		this.certificadoApremioPersonaService = certificadoApremioPersonaService;
		this.numeracionService = numeracionService;
		this.archivoService = archivoService;
        this.observacionService = observacionService;
        this.etiquetaService = etiquetaService;
		this.cuentaCorrienteItemService = cuentaCorrienteItemService;
	}

	async list() {
		return new Promise( async (resolve, reject) => {
			try {
				const result = await this.certificadoApremioRepository.list();
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async listByFilter(certificadoApremioFilter: CertificadoApremioFilter) {
		return new Promise( async (resolve, reject) => {
			try {
                const result = (await this.certificadoApremioRepository.listByFilter(certificadoApremioFilter) as Array<CertificadoApremio>).sort((a, b) => a.id - b.id);
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async listByApremio(idApremio: number) {
        return new Promise( async (resolve, reject) => {
            try {
                const result = await this.certificadoApremioRepository.listByApremio(idApremio);
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
				let certificadoApremioDTO = new CertificadoApremioDTO();
				certificadoApremioDTO.certificadoApremio = await this.certificadoApremioRepository.findById(id) as CertificadoApremio;
				if (!certificadoApremioDTO.certificadoApremio) {
					reject(new ReferenceError('No existe el registro'));
					return;
				}
				certificadoApremioDTO.certificadoApremioItems = await this.certificadoApremioItemRepository.listByCertificadoApremio(id) as Array<CertificadoApremioItem>;
				certificadoApremioDTO.certificadoApremioPersonas = await this.certificadoApremioPersonaService.listByCertificadoApremio(id) as Array<CertificadoApremioPersonaState>;
				certificadoApremioDTO.archivos = await this.archivoService.listByEntidad("CertificadoApremio", id) as Array<ArchivoState>;
                certificadoApremioDTO.observaciones = await this.observacionService.listByEntidad("CertificadoApremio", id) as Array<ObservacionState>;
                certificadoApremioDTO.etiquetas = await this.etiquetaService.listByEntidad("CertificadoApremio", id) as Array<EtiquetaState>;

				//calculo de recargo
				const today = getDateNow(false);
				const cuentaCorrienteItemDeuda = await this.cuentaCorrienteItemService.listByDeuda(certificadoApremioDTO.certificadoApremio.idCuenta, true, today) as CuentaCorrienteItemDeudaDTO;
				certificadoApremioDTO.certificadoApremioItems.forEach(item => {
					const itemDeuda = cuentaCorrienteItemDeuda.cuentaCorrienteItems.find(f => f.idCertificadoApremio = item.id);
					if (itemDeuda) {
						item.monto = itemDeuda.importeSaldo;
						item.montoRecargo = itemDeuda.importeAccesorios;
						item.montoTotal = itemDeuda.importeTotal;
					}
				});

				resolve(certificadoApremioDTO);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async add(idCuenta: number, partidas: Array <number>) {
		const resultTransaction = this.certificadoApremioRepository.onTransaction( async () => { 
			return new Promise( async (resolve, reject) => {
				try {
					let montoTotal = 0;
					let listCuentaCorrienteItem = [];
					for(let i=0; i < partidas.length; i++) {
						const numeroPartida = partidas[i];
						const cuentaCorrienteItemsPartida = await this.cuentaCorrienteItemService.listByPartida(numeroPartida) as Array<CuentaCorrienteItem>
						const cuentaCorrienteItemCabecera = cuentaCorrienteItemsPartida.find(f => f.tasaCabecera) as CuentaCorrienteItem;
						if (!cuentaCorrienteItemCabecera) {
							reject(new ValidationError(`No se pudo identificar la tasa cabecera de la partida ${numeroPartida}`));
							return;
						}

						let montoPartida = 0;
						cuentaCorrienteItemsPartida.forEach(item => {
							montoPartida += item.importeDebe - item.importeHaber;
						});
						montoTotal += montoPartida;

						listCuentaCorrienteItem.push({
							monto: montoPartida,
							cuentaCorrienteItem: cuentaCorrienteItemCabecera
						});
					}

					const numeroCertificadoApremio:number = await this.numeracionService.findByProximo("LegalNumeroCertificadoApremio") as number;

					let certificadoApremio = new CertificadoApremio();
				
					certificadoApremio.idApremio = null;
					certificadoApremio.idEstadoCertificadoApremio = 400; //Calculado
					certificadoApremio.numero = numeroCertificadoApremio.toString();
					certificadoApremio.idCuenta = idCuenta;
					certificadoApremio.idInspeccion = null;
					certificadoApremio.montoTotal = montoTotal;
					certificadoApremio.fechaCertificado = getDateNow(false);
					certificadoApremio.fechaCalculo = getDateNow(false);
					certificadoApremio.fechaNotificacion = null;
					certificadoApremio.fechaRecepcion = null;

					certificadoApremio = await this.certificadoApremioRepository.add(certificadoApremio);

					for(let i=0; i < listCuentaCorrienteItem.length; i++) {
						const montoPartida = listCuentaCorrienteItem[i].monto;
						const cuentaCorrienteItem = listCuentaCorrienteItem[i].cuentaCorrienteItem as CuentaCorrienteItem;

						let certificadoApremioItem  = new CertificadoApremioItem();

						certificadoApremioItem.idCertificadoApremio = certificadoApremio.id;
						certificadoApremioItem.idCuentaCorrienteItem = cuentaCorrienteItem.id;
						certificadoApremioItem.idTasa = cuentaCorrienteItem.idTasa;
						certificadoApremioItem.idSubTasa = cuentaCorrienteItem.idSubTasa;
						certificadoApremioItem.periodo = cuentaCorrienteItem.periodo;
						certificadoApremioItem.cuota = cuentaCorrienteItem.cuota;
						certificadoApremioItem.monto = montoPartida;
						certificadoApremioItem.montoRecargo = 0;
						certificadoApremioItem.montoTotal = (certificadoApremioItem.monto + certificadoApremioItem.montoRecargo);

						certificadoApremioItem = await this.certificadoApremioItemRepository.add(certificadoApremioItem);
						
						cuentaCorrienteItem.idCertificadoApremio = certificadoApremio.id;
						await this.cuentaCorrienteItemService.modify(cuentaCorrienteItem.id, cuentaCorrienteItem);
					}

					this.findById(certificadoApremio.id).then(resolve).catch(reject);
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

	async modify(id: number, idUsuario: number, certificadoApremioDTO: CertificadoApremioDTO) {
		const resultTransaction = this.certificadoApremioRepository.onTransaction( async () => {
			return new Promise( async (resolve, reject) => {
				try {
					let certificadoApremio = certificadoApremioDTO.certificadoApremio;
					if (
						!isValidInteger(certificadoApremio.idApremio, false) ||
						!isValidString(certificadoApremio.numero, true) ||
						!isValidInteger(certificadoApremio.idInspeccion, false) ||
						!isValidDate(certificadoApremio.fechaNotificacion, false) ||
						!isValidDate(certificadoApremio.fechaRecepcion, false)
					) {
						reject(new ValidationError('Existen campos incompletos'));
						return;
					}
					
					let certificadoApremioOriginal = await this.certificadoApremioRepository.findById(id) as CertificadoApremio;
					if (certificadoApremioOriginal.idEstadoCertificadoApremio == 403) { //Cancelado
						reject(new ValidationError('Certificado cancelado, no se podrá modificar'));
						return;
					}
					else if (certificadoApremioOriginal.idEstadoCertificadoApremio < 401 && certificadoApremio.fechaNotificacion) { //Notificacdo
						certificadoApremio.idEstadoCertificadoApremio = 401;
					}
					else if (certificadoApremioOriginal.idEstadoCertificadoApremio < 402 && certificadoApremio.fechaRecepcion) { //Recibido
						certificadoApremio.idEstadoCertificadoApremio = 402;
					}

					if (certificadoApremio.idApremio === 0) certificadoApremio.idApremio = null;
					if (certificadoApremio.idInspeccion === 0) certificadoApremio.idInspeccion = null;
					certificadoApremio = await this.certificadoApremioRepository.modify(id, certificadoApremio);
					if (!certificadoApremio) {
						reject(new ReferenceError('No existe el registro'));
						return;
					}

					certificadoApremioDTO.certificadoApremio = await this.certificadoApremioRepository.modify(id, certificadoApremioDTO.certificadoApremio) as CertificadoApremio;
                    
					let requests = [];
					
					certificadoApremioDTO.certificadoApremioPersonas.forEach(async row => {
                        if (row.state === 'a') {
                            requests.push(this.certificadoApremioPersonaService.add(row as CertificadoApremioPersona));
                        }
                        else if (row.state === 'm') {
                            requests.push(this.certificadoApremioPersonaService.modify(row.id, row as CertificadoApremioPersona));
                        }
                        else if (row.state === 'r') {
                            requests.push(this.certificadoApremioPersonaService.remove(row.id));
                        }
                    });

					//proceso los archivos, observaciones y etiquetas
					certificadoApremioDTO.archivos.forEach(async row => {
						if (row.state === 'a') {
							requests.push(this.archivoService.add(idUsuario, row as Archivo));
						}
						else if (row.state === 'r') {
							requests.push(this.archivoService.remove(row.id));
						}
					});
					certificadoApremioDTO.observaciones.forEach(async row => {
						if (row.state === 'a') {
							requests.push(this.observacionService.add(idUsuario, row as Observacion));
						}
						else if (row.state === 'r') {
							requests.push(this.observacionService.remove(row.id));
						}
					});
					certificadoApremioDTO.etiquetas.forEach(async row => {
						if (row.state === 'a') {
							requests.push(this.etiquetaService.add(row as Etiqueta));
						}
						else if (row.state === 'r') {
							requests.push(this.etiquetaService.remove(row.id));
						}
					});

					Promise.all(requests)
					.then(responses => {
						resolve(certificadoApremio);
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

	async modifyCancel(id: number, idUsuario: number) {
		const resultTransaction = this.certificadoApremioRepository.onTransaction( async () => {
			return new Promise( async (resolve, reject) => {
				try {
					let certificadoApremio = await this.certificadoApremioRepository.findById(id) as CertificadoApremio;
					if (!certificadoApremio) {
						reject(new ReferenceError('No existe el registro'));
						return;
					}

					//libero la cuenta corriente del certificado
					const certificadoApremioItems = await this.certificadoApremioItemRepository.listByCertificadoApremio(id) as Array<CertificadoApremioItem>;
					for (let i=0; i < certificadoApremioItems.length; i++) {
						const certificadoApremioItem = certificadoApremioItems[i];
						let cuentaCorrienteItem = (await this.cuentaCorrienteItemService.findById(certificadoApremioItem.idCuentaCorrienteItem) as CuentaCorrienteItemDTO).cuentaCorrienteItem;
						cuentaCorrienteItem.idCertificadoApremio = null;
						await this.cuentaCorrienteItemService.modify(cuentaCorrienteItem.id, cuentaCorrienteItem);
					}

					//cancelo el certificado y lebero el apremio
					certificadoApremio.idEstadoCertificadoApremio = 403; //Cancelado
					certificadoApremio.idApremio = null;
					certificadoApremio = await this.certificadoApremioRepository.modify(id, certificadoApremio);

					resolve(certificadoApremio);
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
        const resultTransaction = this.certificadoApremioRepository.onTransaction( async () => {
            return new Promise( async (resolve, reject) => {
                try {
                    const certificadoApremio = await this.certificadoApremioRepository.findById(id) as CertificadoApremio;
                    if (!certificadoApremio) {
                        reject(new ReferenceError('No existe el registro'));
                        return;
                    }

					await this.certificadoApremioPersonaService.removeByCertificadoApremio(id);
                    await this.certificadoApremioItemRepository.removeByCertificadoApremio(id);

                    const result = await this.certificadoApremioRepository.remove(id);
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
