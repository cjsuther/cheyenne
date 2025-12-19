import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import container from '../../infraestructure/ioc/dependency-injection';

import Etiqueta from '../entities/etiqueta';
import Observacion from '../entities/observacion';
import Archivo from '../entities/archivo';
import EmisionDefinicion from '../entities/emision-definicion';
import EmisionDefinicionFilter from '../dto/emision-definicion-filter';
import EmisionDefinicionDTO from '../dto/emision-definicion-dto';
import ArchivoState from '../dto/archivo-state';
import ObservacionState from '../dto/observacion-state';
import EtiquetaState from '../dto/etiqueta-state';
import Procedimiento from '../entities/procedimiento';
import Funcion from '../entities/funcion';
import EmisionVariable from '../entities/emision-variable';
import EmisionCalculo from '../entities/emision-calculo';
import EmisionConcepto from '../entities/emision-concepto';
import EmisionCuentaCorriente from '../entities/emision-cuenta-corriente';
import EmisionImputacionContable from '../entities/emision-imputacion-contable';
import EmisionVariableState from '../dto/emision-variable-state';
import EmisionCalculoState from '../dto/emision-calculo-state';
import EmisionConceptoState from '../dto/emision-concepto-state';
import EmisionCuentaCorrienteState from '../dto/emision-cuenta-corriente-state';
import EmisionImputacionContableState from '../dto/emision-imputacion-contable-state';

import IEmisionDefinicionRepository from '../repositories/emision-definicion-repository';
import IEmisionEjecucionRepository from '../repositories/emision-ejecucion-repository';
import ArchivoService from './archivo-service';
import ObservacionService from './observacion-service';
import EtiquetaService from './etiqueta-service';
import ProcedimientoService from './procedimiento-service';
import FuncionService from './funcion-service';
import EmisionVariableService from './emision-variable-service';
import EmisionCalculoService from './emision-calculo-service';
import EmisionConceptoService from './emision-concepto-service';
import EmisionCuentaCorrienteService from './emision-cuenta-corriente-service';
import EmisionImputacionContableService from './emision-imputacion-contable-service';

import { isValidBoolean, isValidInteger, isValidString,  } from '../../infraestructure/sdk/utils/validator';
import ValidationError from '../../infraestructure/sdk/error/validation-error';
import ProcessError from '../../infraestructure/sdk/error/process-error';
import ReferenceError from '../../infraestructure/sdk/error/reference-error';
import config from '../../server/configuration/config';
import CodeGenerator from './process/emision/code-generator';
import { ensureDirectoryExistence } from '../../infraestructure/sdk/utils/helper';
import EmisionEjecucion from '../entities/emision-ejecucion';
import { EMISION_EJECUCION_STATE } from '../../infraestructure/sdk/consts/emisionEjecucionState';
import { truncateTime } from '../../infraestructure/sdk/utils/convert';


export default class EmisionDefinicionService {

	emisionDefinicionRepository: IEmisionDefinicionRepository;
	emisionEjecucionRepository: IEmisionEjecucionRepository;
	archivoService: ArchivoService;
    observacionService: ObservacionService;
    etiquetaService: EtiquetaService;
	procedimientoService: ProcedimientoService;
	funcionService: FuncionService;
	emisionVariableService: EmisionVariableService;
	emisionCalculoService: EmisionCalculoService;
	emisionConceptoService: EmisionConceptoService;
	emisionCuentaCorrienteService: EmisionCuentaCorrienteService;
	emisionImputacionContableService: EmisionImputacionContableService;
	

	constructor(emisionDefinicionRepository: IEmisionDefinicionRepository, emisionEjecucionRepository: IEmisionEjecucionRepository,
				archivoService: ArchivoService, observacionService: ObservacionService, etiquetaService: EtiquetaService,
				procedimientoService: ProcedimientoService, funcionService: FuncionService,
				emisionVariableService: EmisionVariableService, emisionCalculoService: EmisionCalculoService,
				emisionConceptoService: EmisionConceptoService, emisionCuentaCorrienteService: EmisionCuentaCorrienteService, emisionImputacionContableService: EmisionImputacionContableService
	) {
		this.emisionDefinicionRepository = emisionDefinicionRepository;
		this.emisionEjecucionRepository = emisionEjecucionRepository;
		this.archivoService = archivoService;
        this.observacionService = observacionService;
        this.etiquetaService = etiquetaService;
		this.procedimientoService = procedimientoService;
		this.funcionService = funcionService;
		this.emisionVariableService = emisionVariableService;
		this.emisionCalculoService = emisionCalculoService;
		this.emisionConceptoService = emisionConceptoService;
		this.emisionCuentaCorrienteService = emisionCuentaCorrienteService;
		this.emisionImputacionContableService = emisionImputacionContableService;
	}

	async list() {
		return new Promise( async (resolve, reject) => {
			try {
				const result = await this.emisionDefinicionRepository.list();
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async listByFilter(emisionDefinicionFilter: EmisionDefinicionFilter) {
		return new Promise( async (resolve, reject) => {
			try {
                const result = (await this.emisionDefinicionRepository.listByFilter(emisionDefinicionFilter) as Array<EmisionDefinicion>).sort((a, b) => (a.idTipoTributo === b.idTipoTributo) ? a.numero.localeCompare(b.numero) : a.idTipoTributo - b.idTipoTributo);
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
				let emisionDefinicionDTO = new EmisionDefinicionDTO();    	   
				emisionDefinicionDTO.emisionDefinicion = await this.emisionDefinicionRepository.findById(id) as EmisionDefinicion;
				if (!emisionDefinicionDTO.emisionDefinicion) {
					reject(new ReferenceError('No existe el registro'));
					return;
				}

                emisionDefinicionDTO.archivos = await this.archivoService.listByEntidad('EmisionDefinicion', id) as Array<ArchivoState>;
                emisionDefinicionDTO.observaciones = await this.observacionService.listByEntidad('EmisionDefinicion', id) as Array<ObservacionState>;
                emisionDefinicionDTO.etiquetas = await this.etiquetaService.listByEntidad('EmisionDefinicion', id) as Array<EtiquetaState>;
				emisionDefinicionDTO.procedimientos = await this.procedimientoService.list() as Array<Procedimiento>;
				emisionDefinicionDTO.funciones = await this.funcionService.list() as Array<Funcion>;
                emisionDefinicionDTO.emisionVariables = await this.emisionVariableService.listByEmisionDefinicion(id) as Array<EmisionVariableState>;
				emisionDefinicionDTO.emisionCalculos = await this.emisionCalculoService.listByEmisionDefinicion(id) as Array<EmisionCalculoState>;
				emisionDefinicionDTO.emisionConceptos = await this.emisionConceptoService.listByEmisionDefinicion(id) as Array<EmisionConceptoState>;
				emisionDefinicionDTO.emisionCuentasCorrientes = await this.emisionCuentaCorrienteService.listByEmisionDefinicion(id) as Array<EmisionCuentaCorrienteState>;
				emisionDefinicionDTO.emisionImputacionesContables = await this.emisionImputacionContableService.listByEmisionDefinicion(id) as Array<EmisionImputacionContableState>;

				resolve(emisionDefinicionDTO);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async findByNumero(numero:string) {
		return new Promise( async (resolve, reject) => {
			try {			   
				const result = await this.emisionDefinicionRepository.findByNumero(numero);
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async cloneById(idEmisionDefinicion: number) {
		const resultTransaction = this.emisionDefinicionRepository.onTransaction( async () => {
			return new Promise( async (resolve, reject) => {
				this.cloneEmisionDefinicion(idEmisionDefinicion, false).then(resolve).catch(reject);
			});
		});
		return resultTransaction;
	}

	async add(idUsuario: number, emisionDefinicionDTO: EmisionDefinicionDTO) {
		const resultTransaction = this.emisionDefinicionRepository.onTransaction( async () => {
			return new Promise( async (resolve, reject) => {
				try {
					if (
						!isValidString(emisionDefinicionDTO.emisionDefinicion.periodo, true) ||
						!isValidInteger(emisionDefinicionDTO.emisionDefinicion.idTipoTributo, true) ||
						!isValidInteger(emisionDefinicionDTO.emisionDefinicion.idNumeracion, true) ||
						!isValidInteger(emisionDefinicionDTO.emisionDefinicion.idEstadoEmisionDefinicion, true) ||
						!isValidInteger(emisionDefinicionDTO.emisionDefinicion.idEmisionDefinicionBase, false) ||
						!isValidString(emisionDefinicionDTO.emisionDefinicion.numero, true) ||
						!isValidString(emisionDefinicionDTO.emisionDefinicion.descripcion, true) ||
						!isValidString(emisionDefinicionDTO.emisionDefinicion.codigoDelegacion, true) ||
						!isValidInteger(emisionDefinicionDTO.emisionDefinicion.idProcedimiento, true)
					) {
						reject(new ValidationError('Existen campos incompletos'));
						return;
					}

					try {
						if (parseInt(emisionDefinicionDTO.emisionDefinicion.numero) <= 0) {
							reject(new ValidationError('El campo Número debe ser mayor a cero'));
							return;
						}
					}
					catch {
						reject(new ValidationError('El campo Número debe tener un formato correcto'));
						return;
					}

					const entidadExistente = await this.findByNumero(emisionDefinicionDTO.emisionDefinicion.numero) as EmisionDefinicion;
					if (entidadExistente) {
						reject(new ValidationError('El campo Número ya fue utilizado'));
						return;
					}

					if (emisionDefinicionDTO.emisionDefinicion.calculoPagoAnticipado && !emisionDefinicionDTO.emisionDefinicion.idEmisionDefinicionBase) {
						reject(new ValidationError('Debe definir la emisión de base para el cálculo de pago anticipado'));
						return;
					}

					if (emisionDefinicionDTO.emisionDefinicion.calculoPagoAnticipado) {
						const emisionDefinicionNueva = await this.cloneEmisionDefinicion(emisionDefinicionDTO.emisionDefinicion.idEmisionDefinicionBase, true) as EmisionDefinicion;
						emisionDefinicionNueva.codigoDelegacion = emisionDefinicionDTO.emisionDefinicion.codigoDelegacion;
						emisionDefinicionNueva.numero = emisionDefinicionDTO.emisionDefinicion.numero;
						emisionDefinicionNueva.descripcion = emisionDefinicionDTO.emisionDefinicion.descripcion;
						emisionDefinicionNueva.idEstadoEmisionDefinicion = emisionDefinicionDTO.emisionDefinicion.idEstadoEmisionDefinicion;
						emisionDefinicionNueva.calculoPagoAnticipado = true;
						emisionDefinicionNueva.calculoMostradorWeb = false;
						emisionDefinicionNueva.calculoMasivo = true;
						emisionDefinicionNueva.idEmisionDefinicionBase = emisionDefinicionDTO.emisionDefinicion.idEmisionDefinicionBase;
						emisionDefinicionDTO.emisionDefinicion = emisionDefinicionNueva;
						await this.emisionDefinicionRepository.modify(emisionDefinicionDTO.emisionDefinicion.id, emisionDefinicionDTO.emisionDefinicion);
					}
					else {
						emisionDefinicionDTO.emisionDefinicion.id = null;
						emisionDefinicionDTO.emisionDefinicion = await this.emisionDefinicionRepository.add(emisionDefinicionDTO.emisionDefinicion);
					}

					this.findById(emisionDefinicionDTO.emisionDefinicion.id).then(resolve).catch(reject);
				}
				catch(error) {
					reject(new ProcessError('Error procesando datos', error));
				}
			});
		});
		return resultTransaction;
	}

	async modify(id: number, idUsuario: number, emisionDefinicionDTO: EmisionDefinicionDTO) {
		const resultTransaction = this.emisionDefinicionRepository.onTransaction( async () => {
			return new Promise( async (resolve, reject) => {
				try {
					if (
						!isValidString(emisionDefinicionDTO.emisionDefinicion.periodo, true) ||
						!isValidInteger(emisionDefinicionDTO.emisionDefinicion.idTipoTributo, true) ||
						!isValidInteger(emisionDefinicionDTO.emisionDefinicion.idNumeracion, true) ||
						!isValidInteger(emisionDefinicionDTO.emisionDefinicion.idEstadoEmisionDefinicion, true) ||
						!isValidInteger(emisionDefinicionDTO.emisionDefinicion.idEmisionDefinicionBase, false) ||
						!isValidString(emisionDefinicionDTO.emisionDefinicion.numero, true) ||
						!isValidString(emisionDefinicionDTO.emisionDefinicion.descripcion, true) ||
						!isValidString(emisionDefinicionDTO.emisionDefinicion.codigoDelegacion, true) ||
						!isValidBoolean(emisionDefinicionDTO.emisionDefinicion.calculoMasivo) ||
						!isValidBoolean(emisionDefinicionDTO.emisionDefinicion.calculoMostradorWeb) ||
						!isValidBoolean(emisionDefinicionDTO.emisionDefinicion.calculoPagoAnticipado) ||
						!isValidInteger(emisionDefinicionDTO.emisionDefinicion.idProcedimiento, true)
					) {
						reject(new ValidationError('Existen campos incompletos'));
						return;
					}

					if (!emisionDefinicionDTO.emisionDefinicion.calculoMasivo && !emisionDefinicionDTO.emisionDefinicion.calculoMostradorWeb) {
						reject(new ValidationError('Debe admitir al menos un tipo de cálculo (Masivo o Mostrador/Web)'));
						return;
					}

					try {
						if (parseInt(emisionDefinicionDTO.emisionDefinicion.numero) <= 0) {
							reject(new ValidationError('El campo Número debe ser mayor a cero'));
							return;
						}
					}
					catch {
						reject(new ValidationError('El campo Número debe tener un formato correcto'));
						return;
					}

					const entidadExistente = await this.findByNumero(emisionDefinicionDTO.emisionDefinicion.numero) as EmisionDefinicion;
					if (entidadExistente && entidadExistente.id !== emisionDefinicionDTO.emisionDefinicion.id) {
						reject(new ValidationError('El campo Número ya fue utilizado'));
						return;
					}

					const ejecuciones = await this.emisionEjecucionRepository.listByEmisionDefinicion(id) as Array<EmisionEjecucion>;
					if (ejecuciones.filter(f => [EMISION_EJECUCION_STATE.PAUSADA, EMISION_EJECUCION_STATE.PROCESO, EMISION_EJECUCION_STATE.FINALIZADA].includes(f.idEstadoEmisionEjecucion)).length > 0) {
						reject(new ValidationError('La Definición ya tiene Ejecuciones en curso, NO podrá ser modificada'));
						return;
					}

					emisionDefinicionDTO.emisionDefinicion = await this.emisionDefinicionRepository.modify(id, emisionDefinicionDTO.emisionDefinicion);

					let request = [];

					emisionDefinicionDTO.emisionVariables.forEach(async row => {
                        if (row.state === 'a') {
                            request.push(this.emisionVariableService.add(row as EmisionVariable));
                        }
                        else if (row.state === 'r') {
                            request.push(this.emisionVariableService.remove(row.id));
                        }
                    });

					emisionDefinicionDTO.emisionCalculos.forEach(async row => {
                        if (row.state === 'a') {
                            request.push(this.emisionCalculoService.add(row as EmisionCalculo));
                        }
                        else if (row.state === 'm') {
                            request.push(this.emisionCalculoService.modify(row.id, row as EmisionCalculo));
                        }
                        else if (row.state === 'r') {
                            request.push(this.emisionCalculoService.remove(row.id));
                        }
                    });

					emisionDefinicionDTO.emisionConceptos.forEach(async row => {
                        if (row.state === 'a') {
                            request.push(this.emisionConceptoService.add(row as EmisionConcepto));
                        }
                        else if (row.state === 'm') {
                            request.push(this.emisionConceptoService.modify(row.id, row as EmisionConcepto));
                        }
                        else if (row.state === 'r') {
                            request.push(this.emisionConceptoService.remove(row.id));
                        }
                    });

					emisionDefinicionDTO.emisionCuentasCorrientes.forEach(async row => {
                        if (row.state === 'a') {
                            request.push(this.emisionCuentaCorrienteService.add(row as EmisionCuentaCorriente));
                        }
                        else if (row.state === 'm') {
                            request.push(this.emisionCuentaCorrienteService.modify(row.id, row as EmisionCuentaCorriente));
                        }
                        else if (row.state === 'r') {
                            request.push(this.emisionCuentaCorrienteService.remove(row.id));
                        }
                    });

					emisionDefinicionDTO.emisionImputacionesContables.forEach(async row => {
                        if (row.state === 'a') {
                            request.push(this.emisionImputacionContableService.add(row as EmisionImputacionContable));
                        }
                        else if (row.state === 'm') {
                            request.push(this.emisionImputacionContableService.modify(row.id, row as EmisionImputacionContable));
                        }
                        else if (row.state === 'r') {
                            request.push(this.emisionImputacionContableService.remove(row.id));
                        }
                    });

					emisionDefinicionDTO.archivos.forEach(async row => {
						if (row.state === 'a') {
							request.push(this.archivoService.add(idUsuario, row as Archivo));
						}
						else if (row.state === 'r') {
							request.push(this.archivoService.remove(row.id));
						}
					});
					emisionDefinicionDTO.observaciones.forEach(async row => {
						if (row.state === 'a') {
							request.push(this.observacionService.add(idUsuario, row as Observacion));
						}
						else if (row.state === 'r') {
							request.push(this.observacionService.remove(row.id));
						}
					});
					emisionDefinicionDTO.etiquetas.forEach(async row => {
						if (row.state === 'a') {
							request.push(this.etiquetaService.add(row as Etiqueta));
						}
						else if (row.state === 'r') {
							request.push(this.etiquetaService.remove(row.id));
						}
					});

					Promise.all(request)
					.then(responses => {
						if (emisionDefinicionDTO.emisionCalculos.length > 0 ||
							emisionDefinicionDTO.emisionConceptos.length > 0 ||
							emisionDefinicionDTO.emisionCuentasCorrientes.length > 0 ||
							emisionDefinicionDTO.emisionImputacionesContables.length > 0) {
							//si cambio algun calculo, tengo que regenerar el modulo
							this.modifyModule(id)
							.then(response => {
								this.findById(id).then(resolve).catch(reject);	
							})
							.catch((error) => {
								reject(error);
							});
						}
						else {
							this.findById(id).then(resolve).catch(reject);
						}
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
		const resultTransaction = this.emisionDefinicionRepository.onTransaction( async () => {
			return new Promise( async (resolve, reject) => {
				try {
					const ejecuciones = await this.emisionEjecucionRepository.listByEmisionDefinicion(id);
					if (ejecuciones.length > 0) {
						reject(new ReferenceError('No se puede borrar la definición porque existen ejecuciones vinculadas'));
						return;
					}

					await this.emisionVariableService.removeByEmisionDefinicion(id);
					await this.emisionCalculoService.removeByEmisionDefinicion(id);
					await this.emisionConceptoService.removeByEmisionDefinicion(id);
					await this.emisionCuentaCorrienteService.removeByEmisionDefinicion(id);
					await this.emisionImputacionContableService.removeByEmisionDefinicion(id);

					const result = await this.emisionDefinicionRepository.remove(id);
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


	private async modifyModule(id: number) {
		return new Promise( async (resolve, reject) => {
			try {
				const emisionDefinicion = await this.emisionDefinicionRepository.findById(id);
				if (!emisionDefinicion) {
					reject(new ReferenceError('No existe el registro'));
					return;
				}

				const codeGenerator = container.resolve('codeGenerator') as CodeGenerator;
				const moduloCode = (await codeGenerator.generateModule(emisionDefinicion.id)) as string;

				const fileName = `${uuidv4()}.js`;
				const filePath = `${config.PATH.MODULES}${fileName}`;
				ensureDirectoryExistence(filePath);
				emisionDefinicion.modulo = fileName;
				fs.writeFile(filePath, moduloCode, async (err) => {
					if (err) {
						reject(new ProcessError('Error escribiendo archivo', err));
					}
					else {
						const result = await this.emisionDefinicionRepository.modify(id, emisionDefinicion);
						resolve(result);
					}
				});
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	private async cloneEmisionDefinicion(idEmisionDefinicion: number, soloLectura: boolean) {
		return new Promise( async (resolve, reject) => {
			try {	
				const idEmisionDefinicionOriginal = idEmisionDefinicion;
		
				let emisionDefinicion = await this.emisionDefinicionRepository.findById(idEmisionDefinicionOriginal) as EmisionDefinicion;
				emisionDefinicion.id = null;
				emisionDefinicion.idEstadoEmisionDefinicion = 230; //Activa
				emisionDefinicion.descripcion += " (COPIA)";
				emisionDefinicion.numero = "0";
			
				emisionDefinicion = await this.emisionDefinicionRepository.add(emisionDefinicion) as EmisionDefinicion;
				const idEmisionDefinicionNueva = emisionDefinicion.id;
			
				let emisionesVariable = await this.emisionVariableService.listByEmisionDefinicion(idEmisionDefinicionOriginal) as Array<EmisionVariable>;
				for (let h=0; h < emisionesVariable.length; h++)
				{
					let emisionVariable = emisionesVariable[h];
					
					emisionVariable.id = null;
					emisionVariable.idEmisionDefinicion = idEmisionDefinicionNueva;
					await this.emisionVariableService.add(emisionVariable);
				}

				let emisionesCalculo = await this.emisionCalculoService.listByEmisionDefinicion(idEmisionDefinicionOriginal) as Array<EmisionCalculo>;
				for (let h=0; h < emisionesCalculo.length; h++)
				{
					let emisionCalculo = emisionesCalculo[h];
					
					emisionCalculo.id = null;
					emisionCalculo.idEmisionDefinicion = idEmisionDefinicionNueva;
					emisionCalculo.soloLectura = soloLectura;
					await this.emisionCalculoService.add(emisionCalculo);
				}

				let emisionesConcepto = await this.emisionConceptoService.listByEmisionDefinicion(idEmisionDefinicionOriginal) as Array<EmisionConcepto>;
				for (let h=0; h < emisionesConcepto.length; h++)
				{
					let emisionConcepto = emisionesConcepto[h];
					
					emisionConcepto.id = null;
					emisionConcepto.idEmisionDefinicion = idEmisionDefinicionNueva;
					emisionConcepto.soloLectura = soloLectura;
					await this.emisionConceptoService.add(emisionConcepto);
				}

				let emisionesCuentaCorriente = await this.emisionCuentaCorrienteService.listByEmisionDefinicion(idEmisionDefinicionOriginal) as Array<EmisionCuentaCorriente>;
				for (let h=0; h < emisionesCuentaCorriente.length; h++)
				{
					let emisionCuentaCorriente = emisionesCuentaCorriente[h];
					
					emisionCuentaCorriente.id = null;
					emisionCuentaCorriente.idEmisionDefinicion = idEmisionDefinicionNueva;
					emisionCuentaCorriente.soloLectura = soloLectura;
					await this.emisionCuentaCorrienteService.add(emisionCuentaCorriente);
				}

				let emisionesImputacionContable = await this.emisionImputacionContableService.listByEmisionDefinicion(idEmisionDefinicionOriginal) as Array<EmisionImputacionContable>;
				for (let h=0; h < emisionesImputacionContable.length; h++)
				{
					let emisionImputacionContable = emisionesImputacionContable[h];
					
					emisionImputacionContable.id = null;
					emisionImputacionContable.idEmisionDefinicion = idEmisionDefinicionNueva;
					emisionImputacionContable.soloLectura = soloLectura;
					await this.emisionImputacionContableService.add(emisionImputacionContable);
				}

				this.modifyModule(idEmisionDefinicionNueva).then(resolve).catch(reject);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

}
