import PersonaFisica from '../entities/persona-fisica';
import PersonaFisicaDTO from '../dto/persona-fisica-dto';
import PersonaFilter from '../dto/persona-filter';
import IPersonaFisicaRepository from '../repositories/persona-fisica-repository';
import { isValidInteger, isValidString, isValidDate, isValidBoolean  } from '../../infraestructure/sdk/utils/validator';
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

import ArchivoState from '../dto/archivo-state';
import ObservacionState from '../dto/observacion-state';
import EtiquetaState from '../dto/etiqueta-state';
import DocumentoState from '../dto/documento-state';
import ContactoState from '../dto/contacto-state';
import MedioPagoState from '../dto/medio-pago-state';

import DireccionService from './direccion-service';
import ArchivoService from './archivo-service';
import ObservacionService from './observacion-service';
import EtiquetaService from './etiqueta-service';
import DocumentoService from './documento-service';
import ContactoService from './contacto-service';
import MedioPagoService from './medio-pago-service';
import PublishService from './publish-service';


export default class PersonaFisicaService {

	publishService: PublishService;
	personaFisicaRepository: IPersonaFisicaRepository;
	direccionService: DireccionService;
	archivoService: ArchivoService;
    observacionService: ObservacionService;
    etiquetaService: EtiquetaService;
	documentoService: DocumentoService;
	contactoService: ContactoService;
	medioPagoService: MedioPagoService;

	constructor(publishService: PublishService,
				personaFisicaRepository: IPersonaFisicaRepository, direccionService: DireccionService,
				archivoService: ArchivoService, observacionService: ObservacionService, etiquetaService: EtiquetaService,
				documentoService: DocumentoService, contactoService: ContactoService, medioPagoService: MedioPagoService) {
		this.publishService = publishService;
		this.personaFisicaRepository = personaFisicaRepository;
		this.direccionService = direccionService;
		this.archivoService = archivoService;
        this.observacionService = observacionService;
        this.etiquetaService = etiquetaService;
		this.documentoService = documentoService;
		this.contactoService = contactoService;
		this.medioPagoService = medioPagoService;
	}

	async list() {
		return new Promise( async (resolve, reject) => {
			try {
				const result = await this.personaFisicaRepository.list();
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
                const result = (await this.personaFisicaRepository.listByFilter(personaFilter) as Array<PersonaFisica>).sort((a, b) => a.id - b.id);
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
				let personaFisicaDTO = new PersonaFisicaDTO();
				personaFisicaDTO.persona = await this.personaFisicaRepository.findById(id) as PersonaFisica;
				if (!personaFisicaDTO.persona) {
					reject(new ReferenceError('No existe el registro'));
					return;
				}
                personaFisicaDTO.direccion = await this.direccionService.findByEntidad("PersonaFisica", id) as Direccion;
				personaFisicaDTO.archivos = await this.archivoService.listByPersonaFisica(id) as Array<ArchivoState>;
                personaFisicaDTO.observaciones = await this.observacionService.listByPersonaFisica(id) as Array<ObservacionState>;
                personaFisicaDTO.etiquetas = await this.etiquetaService.listByPersonaFisica(id) as Array<EtiquetaState>;
				personaFisicaDTO.documentos = await this.documentoService.listByPersona(500, id) as Array<DocumentoState>; //500: PersonaFisica
				personaFisicaDTO.contactos = await this.contactoService.listByEntidad("PersonaFisica", id) as Array<ContactoState>;
				personaFisicaDTO.mediosPago = await this.medioPagoService.listByPersona(500, id) as Array<MedioPagoState>; //500: PersonaFisica

				resolve(personaFisicaDTO);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async add(idUsuario: number, personaFisicaDTO: PersonaFisicaDTO) {
		const resultTransaction = this.personaFisicaRepository.onTransaction( async () => {
			return new Promise( async (resolve, reject) => {
				try {
					let personaFisica = personaFisicaDTO.persona;
					if (
						!isValidInteger(personaFisica.idTipoDocumento, true) ||
						!isValidString(personaFisica.numeroDocumento, true) ||
						!isValidInteger(personaFisica.idNacionalidad, true) ||
						!isValidString(personaFisica.nombre, true) ||
						!isValidString(personaFisica.apellido, true) ||
						!isValidInteger(personaFisica.idGenero, true) ||
						!isValidInteger(personaFisica.idEstadoCivil, false) ||
						!isValidInteger(personaFisica.idNivelEstudio, false) ||
						!isValidString(personaFisica.profesion, false) ||
						!isValidString(personaFisica.matricula, false) ||
						!isValidDate(personaFisica.fechaNacimiento, true) ||
						!isValidDate(personaFisica.fechaDefuncion, false) ||
						!isValidBoolean(personaFisica.discapacidad) ||
						!isValidInteger(personaFisica.idCondicionFiscal, false) ||
						!isValidInteger(personaFisica.idIngresosBrutos, false) ||
						!isValidBoolean(personaFisica.ganancias) ||
						!isValidString(personaFisica.pin, false) ||
						!isValidString(personaFisica.foto, false)
					) {
						reject(new ValidationError('Existen campos incompletos'));
						return;
					}

					let logAddSync = []; //se usa por el alta de la entidad base
					let logAddAsync = [];
					let requestAdd = [];

					//alta de persona
					logAddSync.push({entity: 'PersonaFisica', idSource: personaFisicaDTO.persona.id});
					personaFisica.id = null;
					if (personaFisica.idEstadoCivil === 0) personaFisica.idEstadoCivil = null;
					if (personaFisica.idNivelEstudio === 0) personaFisica.idNivelEstudio = null;
					if (personaFisica.idCondicionFiscal === 0) personaFisica.idCondicionFiscal = null;
					if (personaFisica.idIngresosBrutos === 0) personaFisica.idIngresosBrutos = null;
					personaFisica = await this.personaFisicaRepository.add(personaFisica);
					logAddSync[0].idTarget = personaFisica.id;

					//alta del domicilio personal
					personaFisicaDTO.direccion.idEntidad = personaFisica.id;
					logAddAsync.push({entity: 'Direccion', idSource: personaFisicaDTO.direccion.id});
					requestAdd.push(this.direccionService.add(personaFisicaDTO.direccion));

					personaFisicaDTO.documentos.forEach(async row => {
						row.idPersona = personaFisica.id;
						logAddAsync.push({entity: 'Documento', idSource: row.id});
						requestAdd.push(this.documentoService.add(row as Documento));
					});

					personaFisicaDTO.contactos.forEach(async row => {
						row.idEntidad = personaFisica.id;
						logAddAsync.push({entity: 'Contacto', idSource: row.id});
						requestAdd.push(this.contactoService.add(row as Contacto));
					});

					personaFisicaDTO.mediosPago.forEach(async row => {
						row.idPersona = personaFisica.id;
						logAddAsync.push({entity: 'MedioPago', idSource: row.id});
						requestAdd.push(this.medioPagoService.add(row as MedioPago));
					});
					
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
						personaFisicaDTO.archivos.forEach(async row => {
							//como la entidad origen fue recien dada de alta, tengo que buscar su id definitiva
							const log = findEntitySync(logAdd, row.entidad, row.idEntidad, "entity", "idSource");
							if (log) row.idEntidad = log.idTarget;
							if(row.idEntidad > 0) {
								requestInfo.push(this.archivoService.add(idUsuario, row as Archivo));
							}
						});
						personaFisicaDTO.observaciones.forEach(async row => {
							//como la entidad origen fue recien dada de alta, tengo que buscar su id definitiva
							const log = findEntitySync(logAdd, row.entidad, row.idEntidad, "entity", "idSource");
							if (log) row.idEntidad = log.idTarget;
							if(row.idEntidad > 0) {
								requestInfo.push(this.observacionService.add(idUsuario, row as Observacion));
							}
						});
						personaFisicaDTO.etiquetas.forEach(async row => {
							//como la entidad origen fue recien dada de alta, tengo que buscar su id definitiva
							const log = findEntitySync(logAdd, row.entidad, row.idEntidad, "entity", "idSource");
							if (log) row.idEntidad = log.idTarget;
							if(row.idEntidad > 0) {
								requestInfo.push(this.etiquetaService.add(row as Etiqueta));
							}
						});

						Promise.all(requestInfo)
						.then(responses => {
							this.findById(personaFisica.id).then(resolve).catch(reject);
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

	async modify(id: number, idUsuario: number, personaFisicaDTO: PersonaFisicaDTO) {
		const resultTransaction = this.personaFisicaRepository.onTransaction( async () => {
			return new Promise( async (resolve, reject) => {
				try {
					let personaFisica = personaFisicaDTO.persona;
					if (
						!isValidInteger(personaFisica.idTipoDocumento, true) ||
						!isValidString(personaFisica.numeroDocumento, true) ||
						!isValidInteger(personaFisica.idNacionalidad, true) ||
						!isValidString(personaFisica.nombre, true) ||
						!isValidString(personaFisica.apellido, true) ||
						!isValidInteger(personaFisica.idGenero, true) ||
						!isValidInteger(personaFisica.idEstadoCivil, false) ||
						!isValidInteger(personaFisica.idNivelEstudio, false) ||
						!isValidString(personaFisica.profesion, false) ||
						!isValidString(personaFisica.matricula, false) ||
						!isValidDate(personaFisica.fechaNacimiento, true) ||
						!isValidDate(personaFisica.fechaDefuncion, false) ||
						!isValidBoolean(personaFisica.discapacidad) ||
						!isValidInteger(personaFisica.idCondicionFiscal, false) ||
						!isValidInteger(personaFisica.idIngresosBrutos, false) ||
						!isValidBoolean(personaFisica.ganancias) ||
						!isValidString(personaFisica.pin, false) ||
						!isValidString(personaFisica.foto, false)
					) {
						reject(new ValidationError('Existen campos incompletos'));
						return;
					}

					let logAddAsync = [];
					let requestAdd = [];
					let requestOther = [];

					if (personaFisica.idEstadoCivil === 0) personaFisica.idEstadoCivil = null;
					if (personaFisica.idNivelEstudio === 0) personaFisica.idNivelEstudio = null;
					if (personaFisica.idCondicionFiscal === 0) personaFisica.idCondicionFiscal = null;
					if (personaFisica.idIngresosBrutos === 0) personaFisica.idIngresosBrutos = null;
					personaFisica = await this.personaFisicaRepository.modify(id, personaFisica) as PersonaFisica;
					if (!personaFisica) {
						reject(new ReferenceError('No existe el registro'));
						return;
					}

					//modificacion de la direccion
					personaFisicaDTO.direccion.idEntidad = personaFisica.id;
					requestOther.push(this.direccionService.modify(personaFisicaDTO.direccion.id, personaFisicaDTO.direccion));

					personaFisicaDTO.documentos.forEach(async row => {
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

					personaFisicaDTO.contactos.forEach(async row => {
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

					personaFisicaDTO.mediosPago.forEach(async row => {
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
							personaFisicaDTO.archivos.forEach(async row => {
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
							personaFisicaDTO.observaciones.forEach(async row => {
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
							personaFisicaDTO.etiquetas.forEach(async row => {
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
								this.publishService.sendMessage("major-laramie-administracion-webapi/persona-fisica-service/modify", "ModifyPersonaFisica", idUsuario.toString(), personaFisica)
								.then(response => {
									this.findById(personaFisica.id).then(resolve).catch(reject);
								})
								.catch(reject);
							})
							.catch(reject);

						})
						.catch(reject);

					})
					.catch(reject);
					
				}
				catch(error) {
					reject(new ProcessError('Error procesando datos', error));
				}
			});
		});
		return resultTransaction;
	}

	async remove(id: number) {
		const resultTransaction = this.personaFisicaRepository.onTransaction( async () => {
			return new Promise( async (resolve, reject) => {
				try {
					await this.documentoService.removeByPersona(500, id);
					await this.medioPagoService.removeByPersona(500, id);
					await this.contactoService.removeByEntidad('PersonaFisica', id);
					await this.direccionService.removeByEntidad('PersonaFisica', id);
					const result = await this.personaFisicaRepository.remove(id);
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
