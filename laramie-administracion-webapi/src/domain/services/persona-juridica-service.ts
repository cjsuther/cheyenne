import PersonaJuridica from '../entities/persona-juridica';
import PersonaJuridicaDTO from '../dto/persona-juridica-dto';
import PersonaFilter from '../dto/persona-filter';
import IPersonaJuridicaRepository from '../repositories/persona-juridica-repository';
import { isValidInteger, isValidString, isValidDate,  } from '../../infraestructure/sdk/utils/validator';
import { findEntitySync } from '../../infraestructure/sdk/utils/helper';
import ValidationError from '../../infraestructure/sdk/error/validation-error';
import ProcessError from '../../infraestructure/sdk/error/process-error';
import ReferenceError from '../../infraestructure/sdk/error/reference-error';

import Direccion from '../entities/direccion';
import Archivo from '../entities/archivo';
import Observacion from '../entities/observacion';
import Etiqueta from '../entities/etiqueta';
import Documento from '../entities/documento';
import Contacto from '../entities/contacto';
import MedioPago from '../entities/medio-pago';
import Lista from '../entities/lista';

import ArchivoState from '../dto/archivo-state';
import ObservacionState from '../dto/observacion-state';
import EtiquetaState from '../dto/etiqueta-state';
import DocumentoState from '../dto/documento-state';
import ContactoState from '../dto/contacto-state';
import MedioPagoState from '../dto/medio-pago-state';
import ListaState from '../dto/lista-state';

import DireccionService from './direccion-service';
import ArchivoService from './archivo-service';
import ObservacionService from './observacion-service';
import EtiquetaService from './etiqueta-service';
import DocumentoService from './documento-service';
import ContactoService from './contacto-service';
import MedioPagoService from './medio-pago-service';
import ListaService from './lista-service';
import PublishService from './publish-service';


export default class PersonaJuridicaService {

	publishService: PublishService;
	personaJuridicaRepository: IPersonaJuridicaRepository;
	direccionService: DireccionService;
	archivoService: ArchivoService;
    observacionService: ObservacionService;
    etiquetaService: EtiquetaService;
	documentoService: DocumentoService;
	contactoService: ContactoService;
	medioPagoService: MedioPagoService;
	listaService: ListaService;

	constructor(publishService: PublishService,
				personaJuridicaRepository: IPersonaJuridicaRepository, direccionService: DireccionService,
				archivoService: ArchivoService, observacionService: ObservacionService, etiquetaService: EtiquetaService,
				documentoService: DocumentoService, contactoService: ContactoService, medioPagoService: MedioPagoService,
				listaService: ListaService) {
		this.publishService = publishService;
		this.personaJuridicaRepository = personaJuridicaRepository;
		this.direccionService = direccionService;
		this.archivoService = archivoService;
        this.observacionService = observacionService;
        this.etiquetaService = etiquetaService;
		this.documentoService = documentoService;
		this.contactoService = contactoService;
		this.medioPagoService = medioPagoService;
		this.listaService = listaService;
	}

	async list() {
		return new Promise( async (resolve, reject) => {
			try {
				const result = await this.personaJuridicaRepository.list();
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async listByFilter(personaFilter: PersonaFilter) {
		return new Promise( async (resolve, reject) => {
			try {
                const result = (await this.personaJuridicaRepository.listByFilter(personaFilter) as Array<PersonaJuridica>).sort((a, b) => a.id - b.id);
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
				let personaJuridicaDTO = new PersonaJuridicaDTO();
				personaJuridicaDTO.persona = await this.personaJuridicaRepository.findById(id) as PersonaJuridica;
				if (!personaJuridicaDTO.persona) {
					reject(new ReferenceError('No existe el registro'));
					return;
				}
                personaJuridicaDTO.domicilioLegal = await this.direccionService.findByEntidad("PersonaJuridicaDomicilioLegal", id) as Direccion;
                personaJuridicaDTO.domicilioFiscal = await this.direccionService.findByEntidad("PersonaJuridicaDomicilioFiscal", id) as Direccion;
				personaJuridicaDTO.archivos = await this.archivoService.listByPersonaJuridica(id) as Array<ArchivoState>;
                personaJuridicaDTO.observaciones = await this.observacionService.listByPersonaJuridica(id) as Array<ObservacionState>;
                personaJuridicaDTO.etiquetas = await this.etiquetaService.listByPersonaJuridica(id) as Array<EtiquetaState>;
				personaJuridicaDTO.documentos = await this.documentoService.listByPersona(501, id) as Array<DocumentoState>; //501: PersonaJuridica
				personaJuridicaDTO.contactos = await this.contactoService.listByEntidad("PersonaJuridica", id) as Array<ContactoState>;
				personaJuridicaDTO.mediosPago = await this.medioPagoService.listByPersona(501, id) as Array<MedioPagoState>; //501: PersonaJuridica
				personaJuridicaDTO.rubrosAfip = await this.listaService.listRubroAfipByPersonaJuridica(id) as Array<ListaState>;

				resolve(personaJuridicaDTO);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async add(idUsuario: number, personaJuridicaDTO: PersonaJuridicaDTO) {
		const resultTransaction = this.personaJuridicaRepository.onTransaction( async () => {
			return new Promise( async (resolve, reject) => {
				try {
					let personaJuridica = personaJuridicaDTO.persona;
					if (
						!isValidInteger(personaJuridica.idTipoDocumento, true) ||
						!isValidString(personaJuridica.numeroDocumento, true) ||
						!isValidString(personaJuridica.denominacion, true) ||
						!isValidString(personaJuridica.nombreFantasia, true) ||
						!isValidInteger(personaJuridica.idFormaJuridica, true) ||
						!isValidInteger(personaJuridica.idJurisdiccion, true) ||
						!isValidDate(personaJuridica.fechaConstitucion, true) ||
						!isValidInteger(personaJuridica.mesCierre, false) ||
						!isValidString(personaJuridica.logo, false)
					) {
						reject(new ValidationError('Existen campos incompletos'));
						return;
					}
					
					let logAddSync = []; //se usa por el alta de la entidad base
					let logAddAsync = [];
					let requestAdd = [];

					//alta de persona
					logAddSync.push({entity: 'PersonaJuridica', idSource: personaJuridicaDTO.persona.id});
					personaJuridica.id = null;
					personaJuridica = await this.personaJuridicaRepository.add(personaJuridica);
					logAddSync[0].idTarget = personaJuridica.id;

					//alta del domicilio legal
					personaJuridicaDTO.domicilioLegal.idEntidad = personaJuridica.id;
					logAddAsync.push({entity: 'Direccion_DomicilioLegal', idSource: personaJuridicaDTO.domicilioLegal.id});
					requestAdd.push(this.direccionService.add(personaJuridicaDTO.domicilioLegal));

					//alta del domicilio fiscal
					personaJuridicaDTO.domicilioFiscal.idEntidad = personaJuridica.id;
					logAddAsync.push({entity: 'Direccion_DomicilioFiscal', idSource: personaJuridicaDTO.domicilioFiscal.id});
					requestAdd.push(this.direccionService.add(personaJuridicaDTO.domicilioFiscal));

					personaJuridicaDTO.documentos.forEach(async row => {
						row.idPersona = personaJuridica.id;
						logAddAsync.push({entity: 'Documento', idSource: row.id});
						requestAdd.push(this.documentoService.add(row as Documento));
					});

					personaJuridicaDTO.contactos.forEach(async row => {
						row.idEntidad = personaJuridica.id;
						logAddAsync.push({entity: 'Contacto', idSource: row.id});
						requestAdd.push(this.contactoService.add(row as Contacto));
					});

					personaJuridicaDTO.mediosPago.forEach(async row => {
						row.idPersona = personaJuridica.id;
						logAddAsync.push({entity: 'MedioPago', idSource: row.id});
						requestAdd.push(this.medioPagoService.add(row as MedioPago));
					});

					const rubrosAfipAdd = personaJuridicaDTO.rubrosAfip.map(row => Math.abs(row.id));
					logAddAsync.push({entity: 'RubroAfip', idSource: personaJuridica.id});
					requestAdd.push(this.personaJuridicaRepository.bindRubrosAfip(personaJuridica.id, rubrosAfipAdd));
					
					Promise.all(requestAdd)
					.then(responses => {
						//actualizo las id definitivas (para las altas)
						for(let i=0; i<responses.length; i++) {
							logAddAsync[i].idTarget = responses[i].id;
						}
						//unifico los logs
						const logAdd = logAddAsync.concat(logAddSync);
						//proceso los archivos, observaciones y etiquetas
						let requestInfo = [];
						personaJuridicaDTO.archivos.forEach(async row => {
							//como la entidad origen fue recien dada de alta, tengo que buscar su id definitiva
							const log = findEntitySync(logAdd, row.entidad, row.idEntidad, "entity", "idSource");
							if (log) row.idEntidad = log.idTarget;
							if(row.idEntidad > 0) {
								requestInfo.push(this.archivoService.add(idUsuario, row as Archivo));
							}
						});
						personaJuridicaDTO.observaciones.forEach(async row => {
							//como la entidad origen fue recien dada de alta, tengo que buscar su id definitiva
							const log = findEntitySync(logAdd, row.entidad, row.idEntidad, "entity", "idSource");
							if (log) row.idEntidad = log.idTarget;
							if(row.idEntidad > 0) {
								requestInfo.push(this.observacionService.add(idUsuario, row as Observacion));
							}
						});
						personaJuridicaDTO.etiquetas.forEach(async row => {
							//como la entidad origen fue recien dada de alta, tengo que buscar su id definitiva
							const log = findEntitySync(logAdd, row.entidad, row.idEntidad, "entity", "idSource");
							if (log) row.idEntidad = log.idTarget;
							if(row.idEntidad > 0) {
								requestInfo.push(this.etiquetaService.add(row as Etiqueta));
							}
						});

						Promise.all(requestInfo)
						.then(responses => {
							this.findById(personaJuridica.id).then(resolve).catch(reject);
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
					reject(new ProcessError('Error procesando datos', error));
				}
			});
		});
		return resultTransaction;
	}

	async modify(id: number, idUsuario: number, personaJuridicaDTO: PersonaJuridicaDTO) {
		const resultTransaction = this.personaJuridicaRepository.onTransaction( async () => {
			return new Promise( async (resolve, reject) => {
				try {
					let personaJuridica = personaJuridicaDTO.persona;
					if (
						!isValidInteger(personaJuridica.idTipoDocumento, true) ||
						!isValidString(personaJuridica.numeroDocumento, true) ||
						!isValidString(personaJuridica.denominacion, true) ||
						!isValidString(personaJuridica.nombreFantasia, true) ||
						!isValidInteger(personaJuridica.idFormaJuridica, true) ||
						!isValidInteger(personaJuridica.idJurisdiccion, true) ||
						!isValidDate(personaJuridica.fechaConstitucion, true) ||
						!isValidInteger(personaJuridica.mesCierre, false) ||
						!isValidString(personaJuridica.logo, false)
					) {
						reject(new ValidationError('Existen campos incompletos'));
						return;
					}

					let logAddAsync = [];
					let requestAdd = [];
					let requestOther = [];

					personaJuridica = await this.personaJuridicaRepository.modify(id, personaJuridica);
					if (!personaJuridica) {
						reject(new ReferenceError('No existe el registro'));
						return;
					}

					//modificacion del domicilio legal
					personaJuridicaDTO.domicilioLegal.idEntidad = personaJuridica.id;
					requestOther.push(this.direccionService.modify(personaJuridicaDTO.domicilioLegal.id, personaJuridicaDTO.domicilioLegal));

					//modificacion del domicilio fiscal
					personaJuridicaDTO.domicilioFiscal.idEntidad = personaJuridica.id;
					requestOther.push(this.direccionService.modify(personaJuridicaDTO.domicilioFiscal.id, personaJuridicaDTO.domicilioFiscal));

					personaJuridicaDTO.documentos.forEach(async row => {
						if (row.state === 'a') {
							logAddAsync.push({entity: 'Documento', idSource: row.id});
							requestAdd.push(this.documentoService.add(row as Documento));
						}
						else if (row.state === 'm') {
							requestOther.push(this.documentoService.modify(row.id, row as Documento));
						}
						else if (row.state === 'r') {
							requestOther.push(this.documentoService.remove(row.id));
						}
					});

					personaJuridicaDTO.contactos.forEach(async row => {
						if (row.state === 'a') {
							logAddAsync.push({entity: 'Contacto', idSource: row.id});
							requestAdd.push(this.contactoService.add(row as Contacto));
						}
						else if (row.state === 'm') {
							requestOther.push(this.contactoService.modify(row.id, row as Contacto));
						}
						else if (row.state === 'r') {
							requestOther.push(this.contactoService.remove(row.id));
						}
					});

					personaJuridicaDTO.mediosPago.forEach(async row => {
						if (row.state === 'a') {
							logAddAsync.push({entity: 'MedioPago', idSource: row.id});
							requestAdd.push(this.medioPagoService.add(row as MedioPago));
						}
						else if (row.state === 'm') {
							requestOther.push(this.medioPagoService.modify(row.id, row as MedioPago));
						}
						else if (row.state === 'r') {
							requestOther.push(this.medioPagoService.remove(row.id));
						}
					});

					const rubrosAfipAdd = personaJuridicaDTO.rubrosAfip.filter(f => f.state === 'a').map(row => Math.abs(row.id));
					requestOther.push(this.personaJuridicaRepository.bindRubrosAfip(personaJuridica.id, rubrosAfipAdd));

					const rubrosAfipRemove = personaJuridicaDTO.rubrosAfip.filter(f => f.state === 'r').map(row => row.id);
					requestOther.push(this.personaJuridicaRepository.unbindRubrosAfip(personaJuridica.id, rubrosAfipRemove));

					//primero se ejecutan solo altas
					Promise.all(requestAdd)
					.then(responses => {
						//actualizo las id definitivas (para las altas)
						for(let i=0; i<responses.length; i++) {
							logAddAsync[i].idTarget = responses[i].id;
						}

						Promise.all(requestOther)
						.then(responses => {
							//unifico los logs
							const logAdd = logAddAsync;
							//proceso los archivos, observaciones y etiquetas
							let requestInfo = [];
							personaJuridicaDTO.archivos.forEach(async row => {
								if (row.state === 'a') {
									//si la entidad origen fue recien dada de alta, tengo que buscar su id definitiva
									if(row.idEntidad < 0) {
										const log = findEntitySync(logAdd, row.entidad, row.idEntidad, "entity", "idSource");
										if (log) row.idEntidad = log.idTarget;
									}
									if(row.idEntidad > 0) {
										requestInfo.push(this.archivoService.add(idUsuario, row as Archivo));
									}
								}
								else if (row.state === 'r') {
									requestInfo.push(this.archivoService.remove(row.id));
								}
							});
							personaJuridicaDTO.observaciones.forEach(async row => {
								if (row.state === 'a') {
									//si la entidad origen fue recien dada de alta, tengo que buscar su id definitiva
									if(row.idEntidad < 0) {
										const log = findEntitySync(logAdd, row.entidad, row.idEntidad, "entity", "idSource");
										if (log) row.idEntidad = log.idTarget;
									}
									if(row.idEntidad > 0) {
										requestInfo.push(this.observacionService.add(idUsuario, row as Observacion));
									}
								}
								else if (row.state === 'r') {
									requestInfo.push(this.observacionService.remove(row.id));
								}
							});
							personaJuridicaDTO.etiquetas.forEach(async row => {
								if (row.state === 'a') {
									//si la entidad origen fue recien dada de alta, tengo que buscar su id definitiva
									if(row.idEntidad < 0) {
										const log = findEntitySync(logAdd, row.entidad, row.idEntidad, "entity", "idSource");
										if (log) row.idEntidad = log.idTarget;
									}
									if(row.idEntidad > 0) {
										requestInfo.push(this.etiquetaService.add(row as Etiqueta));
									}
								}
								else if (row.state === 'r') {
									requestInfo.push(this.etiquetaService.remove(row.id));
								}
							});

							Promise.all(requestInfo)
							.then(responses => {
								this.publishService.sendMessage("major-laramie-administracion-webapi/persona-juridica-service/modify", "ModifyPersonaJuridica", idUsuario.toString(), personaJuridica)
								.then(response => {
									this.findById(personaJuridica.id).then(resolve).catch(reject);
								})
								.catch(reject);
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
					reject(new ProcessError('Error procesando datos', error));
				}
			});
		});
		return resultTransaction;
	}

	async remove(id: number) {
		const resultTransaction = this.personaJuridicaRepository.onTransaction( async () => {
			return new Promise( async (resolve, reject) => {
				try {
					await this.personaJuridicaRepository.unbindAllRubrosAfip(id);
					await this.documentoService.removeByPersona(501, id);
					await this.medioPagoService.removeByPersona(501, id);
					await this.contactoService.removeByEntidad('PersonaJuridica', id);
					await this.direccionService.removeByEntidad('PersonaJuridicaDomicilioLegal', id);
					await this.direccionService.removeByEntidad('PersonaJuridicaDomicilioFiscal', id);
					const result = await this.personaJuridicaRepository.remove(id);
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
		});
		return resultTransaction;
	}

}
