import Procedimiento from '../entities/procedimiento';
import IProcedimientoRepository from '../repositories/procedimiento-repository';
import { isValidDate, isValidInteger, isValidString,  } from '../../infraestructure/sdk/utils/validator';
import ValidationError from '../../infraestructure/sdk/error/validation-error';
import ProcessError from '../../infraestructure/sdk/error/process-error';
import ReferenceError from '../../infraestructure/sdk/error/reference-error';
import { getDateNow } from '../../infraestructure/sdk/utils/convert';
import Archivo from '../entities/archivo';
import Observacion from '../entities/observacion';
import Etiqueta from '../entities/etiqueta';
import ArchivoState from '../dto/archivo-state';
import ObservacionState from '../dto/observacion-state';
import EtiquetaState from '../dto/etiqueta-state';
import ArchivoService from './archivo-service';
import ObservacionService from './observacion-service';
import EtiquetaService from './etiqueta-service';
import ProcedimientoDTO from '../dto/procedimiento-dto';
import ProcedimientoParametroService from './procedimiento-parametro-service';
import ProcedimientoParametroState from '../dto/procedimiento-parametro-state';
import ProcedimientoVariableService from './procedimiento-variable-service';
import ProcedimientoVariableState from '../dto/procedimiento-variable-state';
import ProcedimientoParametro from '../entities/procedimiento-parametro';
import ProcedimientoVariable from '../entities/procedimiento-variable';
import ProcedimientoFiltroService from './procedimiento-filtro-service';
import ProcedimientoFiltroState from '../dto/procedimiento-filtro-state';
import ProcedimientoFiltro from '../entities/procedimiento-filtro';

export default class ProcedimientoService {

	procedimientoRepository: IProcedimientoRepository;
	archivoService: ArchivoService;
    observacionService: ObservacionService;
	etiquetaService: EtiquetaService;
	procedimientoParametroService: ProcedimientoParametroService;
	procedimientoVariableService: ProcedimientoVariableService;
	procedimientoFiltroService: ProcedimientoFiltroService;

	constructor(procedimientoRepository: IProcedimientoRepository,
		archivoService: ArchivoService, observacionService: ObservacionService, etiquetaService: EtiquetaService,
		procedimientoParametroService: ProcedimientoParametroService,
		procedimientoVariableService: ProcedimientoVariableService,
		procedimientoFiltroService: ProcedimientoFiltroService) 
	{
		this.procedimientoRepository = procedimientoRepository;
		this.archivoService = archivoService;
        this.observacionService = observacionService;
		this.etiquetaService = etiquetaService;
		this.procedimientoParametroService = procedimientoParametroService;
		this.procedimientoVariableService = procedimientoVariableService;
		this.procedimientoFiltroService = procedimientoFiltroService;
	}

	async list() {
		return new Promise( async (resolve, reject) => {
			try {
				const result = await this.procedimientoRepository.list();
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
				const result = await this.procedimientoRepository.findById(id);
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

	async findFullById(id: number) {
		return new Promise( async (resolve, reject) => {
			try {			   
				let procedimientoDTO = new ProcedimientoDTO();    	   
				procedimientoDTO.procedimiento = await this.procedimientoRepository.findById(id) as Procedimiento;
				if (!procedimientoDTO.procedimiento) {
					reject(new ReferenceError('No existe el registro'));
					return;
				}

				procedimientoDTO.archivos = await this.archivoService.listByEntidad('Procedimiento', id) as Array<ArchivoState>;
                procedimientoDTO.observaciones = await this.observacionService.listByEntidad('Procedimiento', id) as Array<ObservacionState>;
                procedimientoDTO.etiquetas = await this.etiquetaService.listByEntidad('Procedimiento', id) as Array<EtiquetaState>;
				procedimientoDTO.procedimientoParametros = await this.procedimientoParametroService.listByProcedimiento(id) as Array<ProcedimientoParametroState>;
				procedimientoDTO.procedimientoVariables = await this.procedimientoVariableService.listByProcedimiento(id) as Array<ProcedimientoVariableState>;
				procedimientoDTO.procedimientoFiltros = await this.procedimientoFiltroService.listByProcedimiento(id) as Array<ProcedimientoFiltroState>;

				resolve(procedimientoDTO);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async add(idUsuario: number, procedimientoDTO: ProcedimientoDTO) {
		return new Promise( async (resolve, reject) => {
			let procedimiento = procedimientoDTO.procedimiento;
			try {
				if (
					!isValidInteger(procedimiento.idEstadoProcedimiento, true) ||
					!isValidInteger(procedimiento.idTipoTributo, true) ||
					!isValidString(procedimiento.nombre, true) ||
					!isValidString(procedimiento.descripcion, true)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}
				
				procedimiento.id = null;
				procedimiento.idUsuarioCreacion = idUsuario;
				procedimiento.fechaCreacion = getDateNow(true);
				
				procedimientoDTO.procedimiento = await this.procedimientoRepository.add(procedimientoDTO.procedimiento);
				resolve(procedimientoDTO);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async modify(id: number, idUsuario: number, procedimientoDTO: ProcedimientoDTO) {
		const resultTransaction = this.procedimientoRepository.onTransaction( async () => {
			return new Promise( async (resolve, reject) => {
				try {
					let procedimiento = procedimientoDTO.procedimiento;
					if (
						!isValidInteger(procedimiento.idEstadoProcedimiento, true) ||
						!isValidInteger(procedimiento.idTipoTributo, true) ||
						!isValidString(procedimiento.nombre, true) ||
						!isValidString(procedimiento.descripcion, true)
					) {
						reject(new ValidationError('Existen campos incompletos'));
						return;
					}

					procedimientoDTO.procedimiento = await this.procedimientoRepository.modify(id, procedimientoDTO.procedimiento);
					if (!procedimientoDTO) {
						reject(new ReferenceError('No existe el registro'));
						return;
					}

					//proceso los archivos, observaciones y etiquetas
					let executes = [];

					procedimientoDTO.procedimientoParametros.forEach(async row => {
                        if (row.state === 'a') {
                            executes.push(this.procedimientoParametroService.add(row as ProcedimientoParametro));
                        }
                        else if (row.state === 'm') {
                            executes.push(this.procedimientoParametroService.modify(row.id, row as ProcedimientoParametro));
                        }
                        else if (row.state === 'r') {
                            executes.push(this.procedimientoParametroService.remove(row.id));
                        }
                    });

					procedimientoDTO.procedimientoVariables.forEach(async row => {
                        if (row.state === 'a') {
                            executes.push(this.procedimientoVariableService.add(row as ProcedimientoVariable));
                        }
                        else if (row.state === 'm') {
                            executes.push(this.procedimientoVariableService.modify(row.id, row as ProcedimientoVariable));
                        }
                        else if (row.state === 'r') {
                            executes.push(this.procedimientoVariableService.remove(row.id));
                        }
                    });

					procedimientoDTO.procedimientoFiltros.forEach(async row => {
                        if (row.state === 'a') {
                            executes.push(this.procedimientoFiltroService.add(row as ProcedimientoFiltro));
                        }
                        else if (row.state === 'm') {
                            executes.push(this.procedimientoFiltroService.modify(row.id, row as ProcedimientoFiltro));
                        }
                        else if (row.state === 'r') {
                            executes.push(this.procedimientoFiltroService.remove(row.id));
                        }
                    });

					procedimientoDTO.archivos.forEach(async row => {
						if (row.state === 'a') {
							row.idEntidad = procedimiento.id;
							executes.push(this.archivoService.add(idUsuario, row as Archivo));
						}
						else if (row.state === 'r') {
							executes.push(this.archivoService.remove(row.id));
						}
					});
					procedimientoDTO.observaciones.forEach(async row => {
						if (row.state === 'a') {
							row.idEntidad = procedimiento.id;
							executes.push(this.observacionService.add(idUsuario, row as Observacion));
						}
						else if (row.state === 'r') {
							executes.push(this.observacionService.remove(row.id));
						}
					});
					procedimientoDTO.etiquetas.forEach(async row => {
						if (row.state === 'a') {
							row.idEntidad = procedimiento.id;
							executes.push(this.etiquetaService.add(row as Etiqueta));
						}
						else if (row.state === 'r') {
							executes.push(this.etiquetaService.remove(row.id));
						}
					});

					Promise.all(executes)
					.then(responses => {
						this.findFullById(id).then(resolve).catch(reject);
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
        const resultTransaction = this.procedimientoRepository.onTransaction( async () => {
            return new Promise( async (resolve, reject) => {
                try {      
                    const procedimiento = await this.procedimientoRepository.findById(id) as Procedimiento;
                    if (!procedimiento) {
                        reject(new ReferenceError('No existe el registro'));
                        return;
                    }

                    await this.procedimientoParametroService.removeByProcedimiento(id);
					await this.procedimientoVariableService.removeByProcedimiento(id);
					await this.procedimientoFiltroService.removeByProcedimiento(id);
					
					const result = await this.procedimientoRepository.remove(id);
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
