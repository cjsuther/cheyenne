import { v4 as uuidv4 } from 'uuid';
import container from '../../infraestructure/ioc/dependency-injection';

import Cuenta from '../entities/cuenta';
import Etiqueta from '../entities/etiqueta';
import Observacion from '../entities/observacion';
import Archivo from '../entities/archivo';
import Proceso from '../entities/proceso';
import EmisionDefinicion from '../entities/emision-definicion';
import EmisionEjecucion from '../entities/emision-ejecucion';
import EmisionEjecucionCuenta from '../entities/emision-ejecucion-cuenta';
import EmisionEjecucionCuota from '../entities/emision-ejecucion-cuota';
import EmisionAprobacion from '../entities/emision-aprobacion';
import EmisionNumeracion from '../entities/emision-numeracion';
import EmisionEjecucionFilter from '../dto/emision-ejecucion-filter';
import EmisionEjecucionDTO from '../dto/emision-ejecucion-dto';
import ArchivoState from '../dto/archivo-state';
import ObservacionState from '../dto/observacion-state';
import EtiquetaState from '../dto/etiqueta-state';
import Procedimiento from '../entities/procedimiento';
import Funcion from '../entities/funcion';
import EmisionVariableState from '../dto/emision-variable-state';
import EmisionProcedimientoParametro from '../entities/emision-procedimiento-parametro';
import EmisionCuota from '../entities/emision-cuota';
import EmisionProcedimientoParametroState from '../dto/emision-procedimiento-parametro-state';
import EmisionCuotaState from '../dto/emision-cuota-state';

import IEmisionDefinicionRepository from '../repositories/emision-definicion-repository';
import IEmisionEjecucionRepository from '../repositories/emision-ejecucion-repository';
import ConfiguracionService from './configuracion-service';
import NumeracionService from './numeracion-service';
import ProcesoService from './proceso-service';
import EmisionEjecucionCuentaService from './emision-ejecucion-cuenta-service';
import EmisionEjecucionCuotaService from "./emision-ejecucion-cuota-service";
import EmisionAprobacionService from "./emision-aprobacion-service";
import EmisionNumeracionService from "./emision-numeracion-service";
import EmisionVariableService from './emision-variable-service';
import EmisionProcedimientoParametroService from './emision-procedimiento-parametro-service';
import EmisionCuotaService from './emision-cuota-service';
import EmisionCuentaCorrienteService from './emision-cuenta-corriente-service';
import CuentaService from './cuenta-service';
import ArchivoService from './archivo-service';
import ObservacionService from './observacion-service';
import EtiquetaService from './etiqueta-service';
import ProcedimientoService from './procedimiento-service';
import FuncionService from './funcion-service';
import CondicionEspecialService from './condicion-especial-service';
import CuentaCorrienteItemService from './cuenta-corriente-item-service';
import CuentaPruebaService from './cuenta-prueba-service';
import EmisionExecute from './process/emision/emision-execute';

import config from '../../server/configuration/config';
import { isValidBoolean, isValidDate, isValidInteger, isValidString,  } from '../../infraestructure/sdk/utils/validator';
import ValidationError from '../../infraestructure/sdk/error/validation-error';
import ProcessError from '../../infraestructure/sdk/error/process-error';
import ReferenceError from '../../infraestructure/sdk/error/reference-error';
import { getDateNow } from '../../infraestructure/sdk/utils/convert';
import { EMISION_EJECUCION_STATE } from '../../infraestructure/sdk/consts/emisionEjecucionState';
import { PROCESO_STATE } from '../../infraestructure/sdk/consts/procesoState';
import Configuracion from '../entities/configuracion';
import CondicionEspecial from '../entities/condicion-especial';
import EmisionCuentaCorriente from '../entities/emision-cuenta-corriente';
import CuentaCorrienteItem from '../entities/cuenta-corriente-item';
import { distinctArray } from '../../infraestructure/sdk/utils/helper';
import CuentaPrueba from '../entities/cuenta-prueba';
import CustomError from '../../infraestructure/sdk/error/custom-error';
import ProcedimientoDTO from '../dto/procedimiento-dto';
import FiltroService from './filtro-service';
import Filtro from '../entities/filtro';


export default class EmisionEjecucionService {

	emisionDefinicionRepository: IEmisionDefinicionRepository;
	emisionEjecucionRepository: IEmisionEjecucionRepository;
	configuracionService: ConfiguracionService;
	numeracionService: NumeracionService;
	procesoService: ProcesoService;
	emisionEjecucionCuentaService: EmisionEjecucionCuentaService;
	emisionEjecucionCuotaService: EmisionEjecucionCuotaService;
	emisionAprobacionService: EmisionAprobacionService;
	emisionNumeracionService: EmisionNumeracionService;
	cuentaService: CuentaService;
	archivoService: ArchivoService;
    observacionService: ObservacionService;
    etiquetaService: EtiquetaService;
	procedimientoService: ProcedimientoService;
	filtroService: FiltroService;
	funcionService: FuncionService;
	emisionVariableService: EmisionVariableService;
	emisionProcedimientoParametroService: EmisionProcedimientoParametroService;
	emisionCuotaService: EmisionCuotaService;
	condicionEspecialService: CondicionEspecialService;
	emisionCuentaCorrienteService: EmisionCuentaCorrienteService;
	cuentaCorrienteItemService: CuentaCorrienteItemService;
	cuentaPruebaService: CuentaPruebaService;

	constructor(emisionDefinicionRepository: IEmisionDefinicionRepository, emisionEjecucionRepository: IEmisionEjecucionRepository,
				configuracionService: ConfiguracionService, numeracionService: NumeracionService, procesoService: ProcesoService,
				emisionEjecucionCuentaService: EmisionEjecucionCuentaService, emisionEjecucionCuotaService: EmisionEjecucionCuotaService,
				emisionAprobacionService: EmisionAprobacionService, emisionNumeracionService: EmisionNumeracionService,
				cuentaService: CuentaService, archivoService: ArchivoService, observacionService: ObservacionService, etiquetaService: EtiquetaService,
				procedimientoService: ProcedimientoService, filtroService: FiltroService, funcionService: FuncionService,
				emisionVariableService: EmisionVariableService, emisionProcedimientoParametroService: EmisionProcedimientoParametroService,
				emisionCuotaService: EmisionCuotaService, condicionEspecialService: CondicionEspecialService,
				emisionCuentaCorrienteService: EmisionCuentaCorrienteService, cuentaCorrienteItemService: CuentaCorrienteItemService, cuentaPruebaService: CuentaPruebaService
	) {
		this.emisionDefinicionRepository = emisionDefinicionRepository;
		this.emisionEjecucionRepository = emisionEjecucionRepository;
		this.configuracionService = configuracionService;
		this.numeracionService = numeracionService;
		this.procesoService = procesoService;
		this.emisionEjecucionCuentaService = emisionEjecucionCuentaService;
		this.emisionEjecucionCuotaService = emisionEjecucionCuotaService;
		this.emisionAprobacionService = emisionAprobacionService;
		this.emisionNumeracionService = emisionNumeracionService;
		this.cuentaService = cuentaService;
		this.archivoService = archivoService;
        this.observacionService = observacionService;
        this.etiquetaService = etiquetaService;
		this.procedimientoService = procedimientoService;
		this.filtroService = filtroService;
		this.funcionService = funcionService;
		this.emisionVariableService = emisionVariableService;
		this.emisionProcedimientoParametroService = emisionProcedimientoParametroService;
		this.emisionCuotaService = emisionCuotaService;
		this.condicionEspecialService = condicionEspecialService;
		this.emisionCuentaCorrienteService = emisionCuentaCorrienteService;
		this.cuentaCorrienteItemService = cuentaCorrienteItemService;
		this.cuentaPruebaService = cuentaPruebaService;
	}

	async list() {
		return new Promise( async (resolve, reject) => {
			try {
				const result = await this.emisionEjecucionRepository.list();
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async listByFilter(emisionEjecucionFilter: EmisionEjecucionFilter) {
		return new Promise( async (resolve, reject) => {
			try {
                const result = (await this.emisionEjecucionRepository.listByFilter(emisionEjecucionFilter) as Array<EmisionEjecucion>).sort((a, b) => a.id - b.id);
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async listByEmisionDefinicion(idEmisionDefinicion: number) {
		return new Promise( async (resolve, reject) => {
			try {
				const result = await this.emisionEjecucionRepository.listByEmisionDefinicion(idEmisionDefinicion);
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
				let emisionEjecucionDTO = new EmisionEjecucionDTO();    	   
				emisionEjecucionDTO.emisionEjecucion = await this.emisionEjecucionRepository.findById(id) as EmisionEjecucion;
				if (!emisionEjecucionDTO.emisionEjecucion) {
					reject(new ReferenceError('No existe el registro'));
					return;
				}
				emisionEjecucionDTO.emisionDefinicion = await this.emisionDefinicionRepository.findById(emisionEjecucionDTO.emisionEjecucion.idEmisionDefinicion) as EmisionDefinicion;
				if (!emisionEjecucionDTO.emisionDefinicion) {
					reject(new ReferenceError('No existe el registro'));
					return;
				}
				emisionEjecucionDTO.emisionAprobacion = await this.emisionAprobacionService.findByEmisionEjecucion(id) as EmisionAprobacion;
				if (!emisionEjecucionDTO.emisionAprobacion) {
					reject(new ReferenceError('No existe el registro'));
					return;
				}

				emisionEjecucionDTO.procedimiento = await this.procedimientoService.findById(emisionEjecucionDTO.emisionDefinicion.idProcedimiento) as Procedimiento;
				if (!emisionEjecucionDTO.procedimiento) {
					reject(new ReferenceError('No existe el registro'));
					return;
				}

                emisionEjecucionDTO.archivos = await this.archivoService.listByEntidad('EmisionEjecucion', id) as Array<ArchivoState>;
                emisionEjecucionDTO.observaciones = await this.observacionService.listByEntidad('EmisionEjecucion', id) as Array<ObservacionState>;
                emisionEjecucionDTO.etiquetas = await this.etiquetaService.listByEntidad('EmisionEjecucion', id) as Array<EtiquetaState>;
				emisionEjecucionDTO.funciones = await this.funcionService.list() as Array<Funcion>;
                emisionEjecucionDTO.emisionVariables = await this.emisionVariableService.listByEmisionDefinicion(emisionEjecucionDTO.emisionEjecucion.idEmisionDefinicion) as Array<EmisionVariableState>;
				emisionEjecucionDTO.emisionProcedimientoParametros = await this.emisionProcedimientoParametroService.listByEmisionEjecucion(id) as Array<EmisionProcedimientoParametroState>;
				emisionEjecucionDTO.emisionCuotas = await this.emisionCuotaService.listByEmisionEjecucion(id) as Array<EmisionCuotaState>;

				resolve(emisionEjecucionDTO);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async findByNumero(numero:string, calculoMasivo:boolean) {
		return new Promise( async (resolve, reject) => {
			try {			   
				const result = await this.emisionEjecucionRepository.findByNumero(numero, calculoMasivo);
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async add(emisionEjecucionDTO: EmisionEjecucionDTO) {
		const resultTransaction = this.emisionEjecucionRepository.onTransaction( async () => {
			return new Promise( async (resolve, reject) => {
				try {
					if (
						!isValidInteger(emisionEjecucionDTO.emisionEjecucion.idEmisionDefinicion, true) ||
						!isValidString(emisionEjecucionDTO.emisionEjecucion.numero, true) ||
						!isValidString(emisionEjecucionDTO.emisionEjecucion.descripcion, true) ||
						!isValidString(emisionEjecucionDTO.emisionEjecucion.descripcionAbreviada, true)
					) {
						reject(new ValidationError('Existen campos incompletos'));
						return;
					}

					try {
						if (parseInt(emisionEjecucionDTO.emisionEjecucion.numero) <= 0) {
							reject(new ValidationError('El campo Número debe ser mayor a cero'));
							return;
						}
					}
					catch {
						reject(new ValidationError('El campo Número debe tener un formato correcto'));
						return;
					}
	
					const entidadExistente = await this.findByNumero(emisionEjecucionDTO.emisionEjecucion.numero, emisionEjecucionDTO.emisionEjecucion.calculoMasivo) as EmisionDefinicion;
					if (entidadExistente) {
						reject(new ValidationError('El campo Número ya fue utilizado'));
						return;
					}

					emisionEjecucionDTO.emisionDefinicion = await this.emisionDefinicionRepository.findById(emisionEjecucionDTO.emisionEjecucion.idEmisionDefinicion) as EmisionDefinicion;
					if (!emisionEjecucionDTO.emisionDefinicion) {
						reject(new ReferenceError('No existe la definición de emisión'));
						return;
					}
					if (!emisionEjecucionDTO.emisionDefinicion.calculoMasivo) {
						reject(new ReferenceError('La definición de emisión no admite cálculo masivo'));
						return;
					}

					const procedimiento = await this.procedimientoService.findById(emisionEjecucionDTO.emisionDefinicion.idProcedimiento) as Procedimiento;

					emisionEjecucionDTO.emisionEjecucion.id = null;
					emisionEjecucionDTO.emisionEjecucion.idEstadoEmisionEjecucion = EMISION_EJECUCION_STATE.PENDIENTE;
					emisionEjecucionDTO.emisionEjecucion.fechaEjecucionInicio = null;
					emisionEjecucionDTO.emisionEjecucion.fechaEjecucionFin = null;
					emisionEjecucionDTO.emisionEjecucion.periodo = emisionEjecucionDTO.emisionDefinicion.periodo;
					emisionEjecucionDTO.emisionEjecucion.calculoMasivo = true;
					emisionEjecucionDTO.emisionEjecucion.calculoMostradorWeb = false;
					emisionEjecucionDTO.emisionEjecucion.calculoPagoAnticipado = emisionEjecucionDTO.emisionDefinicion.calculoPagoAnticipado;
					emisionEjecucionDTO.emisionEjecucion.imprimeRecibosEmision = emisionEjecucionDTO.emisionDefinicion.calculoPagoAnticipado;
					emisionEjecucionDTO.emisionEjecucion = await this.emisionEjecucionRepository.add(emisionEjecucionDTO.emisionEjecucion);
					const idEmisionEjecucion = emisionEjecucionDTO.emisionEjecucion.id;

					let request = [];

					let emisionAprobacion = new EmisionAprobacion();
					emisionAprobacion.idEmisionEjecucion = idEmisionEjecucion;
					emisionAprobacion.idEstadoAprobacionCalculo = 350; //Pendiente
					emisionAprobacion.idEstadoAprobacionOrdenamiento = 350; //Pendiente
					emisionAprobacion.idEstadoAprobacionControlRecibos = 350; //Pendiente
					emisionAprobacion.idEstadoAprobacionCodigoBarras = 350; //Pendiente
					emisionAprobacion.idEstadoProcesoCuentaCorriente = 360; //Pendiente
					emisionAprobacion.idEstadoProcesoImpresion = 360; //Pendiente
					request.push(this.emisionAprobacionService.add(emisionAprobacion));

					procedimiento.procedimientoParametros.forEach((procedimientoParametro, index) => {
						let emisionProcedimientoParametro = new EmisionProcedimientoParametro();
						emisionProcedimientoParametro.idEmisionEjecucion = idEmisionEjecucion;
						emisionProcedimientoParametro.idProcedimientoParametro = procedimientoParametro.id;
						emisionProcedimientoParametro.valor = '';
						request.push(this.emisionProcedimientoParametroService.add(emisionProcedimientoParametro));
					});

					Promise.all(request)
					.then(responses => {
						resolve(emisionEjecucionDTO);
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

	async addMostradorWeb(idCuenta: number, emisionEjecucionDTO: EmisionEjecucionDTO) {
		const resultTransaction = this.emisionEjecucionRepository.onTransaction( async () => {
			return new Promise( async (resolve, reject) => {
				try {
					if (
						!isValidInteger(emisionEjecucionDTO.emisionEjecucion.idEmisionDefinicion, true)
					) {
						reject(new ValidationError('Existen campos incompletos'));
						return;
					}
	
					emisionEjecucionDTO.emisionDefinicion = await this.emisionDefinicionRepository.findById(emisionEjecucionDTO.emisionEjecucion.idEmisionDefinicion) as EmisionDefinicion;
					if (!emisionEjecucionDTO.emisionDefinicion) {
						reject(new ReferenceError('No existe la definición de emisión'));
						return;
					}
					if (!emisionEjecucionDTO.emisionDefinicion.calculoMostradorWeb) {
						reject(new ReferenceError('La definición de emisión no admite cálculo mostrador/web'));
						return;
					}

					let request = [];
					const numeroEmisionMostrador:number = await this.numeracionService.findByProximo("EmisionMostrador") as number;

					emisionEjecucionDTO.emisionEjecucion.id = null;
					emisionEjecucionDTO.emisionEjecucion.idEstadoEmisionEjecucion = EMISION_EJECUCION_STATE.PENDIENTE;
					emisionEjecucionDTO.emisionEjecucion.numero = numeroEmisionMostrador.toString();
					emisionEjecucionDTO.emisionEjecucion.periodo = emisionEjecucionDTO.emisionDefinicion.periodo;
					emisionEjecucionDTO.emisionEjecucion.calculoMostradorWeb = true;
					emisionEjecucionDTO.emisionEjecucion.calculoMasivo = false;
					emisionEjecucionDTO.emisionEjecucion.calculoPagoAnticipado = false;
					emisionEjecucionDTO.emisionEjecucion.descripcion = emisionEjecucionDTO.emisionDefinicion.descripcion;
					emisionEjecucionDTO.emisionEjecucion.imprimeRecibosEmision = false;
					emisionEjecucionDTO.emisionEjecucion.descripcionAbreviada = `${emisionEjecucionDTO.emisionEjecucion.periodo}-${emisionEjecucionDTO.emisionEjecucion.numero}`;
					emisionEjecucionDTO.emisionEjecucion.fechaEjecucionInicio = null;
					emisionEjecucionDTO.emisionEjecucion.fechaEjecucionFin = null;

					emisionEjecucionDTO.emisionEjecucion = await this.emisionEjecucionRepository.add(emisionEjecucionDTO.emisionEjecucion);
					const idEmisionEjecucion = emisionEjecucionDTO.emisionEjecucion.id;

					let emisionAprobacion = new EmisionAprobacion();
					emisionAprobacion.idEmisionEjecucion = idEmisionEjecucion;
					emisionAprobacion.idEstadoAprobacionCalculo = 350; //Pendiente
					emisionAprobacion.idEstadoAprobacionOrdenamiento = 350; //Pendiente
					emisionAprobacion.idEstadoAprobacionControlRecibos = 350; //Pendiente
					emisionAprobacion.idEstadoAprobacionCodigoBarras = 350; //Pendiente
					emisionAprobacion.idEstadoProcesoCuentaCorriente = 360; //Pendiente
					emisionAprobacion.idEstadoProcesoImpresion = 360; //Pendiente
					await this.emisionAprobacionService.add(emisionAprobacion);

					emisionEjecucionDTO.emisionProcedimientoParametros.forEach(async row => {
						row.idEmisionEjecucion = idEmisionEjecucion;
                    	request.push(this.emisionProcedimientoParametroService.add(row as EmisionProcedimientoParametro));
                    });

					emisionEjecucionDTO.emisionCuotas.forEach(async row => {
						row.idEmisionEjecucion = idEmisionEjecucion;
                        request.push(this.emisionCuotaService.add(row as EmisionCuota));
                    });

					Promise.all(request)
					.then(responses => {
						this.modifyExecuteMostradorWeb(idEmisionEjecucion, idCuenta).then(resolve).catch(reject);
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

	async modifyExecuteMostradorWeb(id: number, idCuenta: number) {
		return new Promise( async (resolve, reject) => {
			try {
				const emisionEjecucion = await this.emisionEjecucionRepository.findById(id) as EmisionEjecucion;
				if (!emisionEjecucion) {
					reject(new ReferenceError('No existe el registro'));
					return;
				}
				const emisionDefinicion = await this.emisionDefinicionRepository.findById(emisionEjecucion.idEmisionDefinicion) as EmisionDefinicion;
				const emisionNumeracion = await this.emisionNumeracionService.findById(emisionDefinicion.idNumeracion) as EmisionNumeracion;
				
				if (emisionNumeracion.idEmisionEjecucionBloqueo && emisionNumeracion.idEmisionEjecucionBloqueo !== emisionEjecucion.id) {
					reject(new ReferenceError('La númeración esta bloqueada por otra emisión activa'));
					return;
				}
				let numeroRecibo: number = emisionNumeracion.valorProximo;

				let emisionEjecucionCuenta = new EmisionEjecucionCuenta();
				emisionEjecucionCuenta.idEmisionEjecucion = id;
				emisionEjecucionCuenta.idCuenta = idCuenta;
				emisionEjecucionCuenta.idEstadoEmisionEjecucionCuenta = 260; //Pendiente
				emisionEjecucionCuenta.numeroBloque = 1; //es un solo bloque
				emisionEjecucionCuenta.numero = 1; //es una sola cuenta
				emisionEjecucionCuenta.observacion = '';
				//ingreso la relacion con la cuenta
				this.emisionEjecucionCuentaService.add(emisionEjecucionCuenta)
				.then(async (ejecucionCuenta:EmisionEjecucionCuenta) => {
					//obtengo sub tasa cabecera
					const emisionCuentasCorrientes = await this.emisionCuentaCorrienteService.listByEmisionDefinicion(emisionEjecucion.idEmisionDefinicion) as Array<EmisionCuentaCorriente>;
					const emisionCuentaCorrienteCabecera = emisionCuentasCorrientes.find(f => f.tasaCabecera);
					const idTasaCabecera = (emisionCuentaCorrienteCabecera) ? emisionCuentaCorrienteCabecera.idTasa : 0;
					const idSubTasaCabecera = (emisionCuentaCorrienteCabecera) ? emisionCuentaCorrienteCabecera.idSubTasa : 0;
					//consulto las cuotas
					const emisionCuotas = (await this.emisionCuotaService.listByEmisionEjecucion(emisionEjecucion.id) as Array<EmisionCuotaState>).sort((a, b) => a.orden - b.orden);
					//consulto cuentas ya emitidas para esta cuota
					let cuentasEmitidasXCuota = [];
					for (let i = 0; i < emisionCuotas.length; i++) {
						const cuota = emisionCuotas[i];
						const idsCuentasEmitidas = distinctArray((await this.cuentaCorrienteItemService.listByTasa(idTasaCabecera, idSubTasaCabecera, emisionEjecucion.periodo, parseInt(cuota.cuota), idCuenta) as Array<CuentaCorrienteItem>).map(x => x.idCuenta));
						cuentasEmitidasXCuota.push(idsCuentasEmitidas);
					}

					//ingreso la relacion con las cuotas por bloques
					let usaReciboNuevo = false;
					let emisionEjecucionCuotas = [];
					for (let i = 0; i < emisionCuotas.length; i++) {
						const cuota = emisionCuotas[i];
						let emisionEjecucionCuota = new EmisionEjecucionCuota();
						emisionEjecucionCuota.idEmisionEjecucion = emisionEjecucion.id;
						emisionEjecucionCuota.idEmisionEjecucionCuenta = ejecucionCuenta.id;
						emisionEjecucionCuota.idEmisionCuota = cuota.id;
						emisionEjecucionCuota.idPlanPagoCuota = null; //TO DO: falta agregar los PLANES DE PAGO
						emisionEjecucionCuota.codigoBarras = "";
						emisionEjecucionCuota.orden = cuota.orden;
						if (!cuentasEmitidasXCuota[i].includes(ejecucionCuenta.idCuenta)) {
							emisionEjecucionCuota.numeroRecibo = numeroRecibo;
							numeroRecibo++;
							usaReciboNuevo = true;
						}
						else {
							emisionEjecucionCuota.numeroRecibo = 0;
						}
						emisionEjecucionCuotas.push(emisionEjecucionCuota);
					}
					numeroRecibo--;

					this.emisionEjecucionCuotaService.addByBloque(emisionEjecucionCuotas)
					.then(async response => {
						try {
							//actualizo numeracion
							if (usaReciboNuevo) {
								emisionNumeracion.idEmisionEjecucionBloqueo = emisionEjecucion.id;
								emisionNumeracion.valorReservadoDesde = emisionNumeracion.valorProximo;
								emisionNumeracion.valorReservadoHasta = numeroRecibo;
								await this.emisionNumeracionService.modify(emisionNumeracion.id, emisionNumeracion);
							}
							//dejo la ejecucion en proceso
							emisionEjecucion.fechaEjecucionInicio = null;
							emisionEjecucion.fechaEjecucionFin = null;
							emisionEjecucion.idEstadoEmisionEjecucion = EMISION_EJECUCION_STATE.PROCESO;
							await this.emisionEjecucionRepository.modify(id, emisionEjecucion);
							//disparo la ejecucion sincronicamente (es solo una cuenta)
							this.modifyExecute(id)
							.then(response => {
								this.findById(id).then(resolve).catch(reject);
							})
							.catch(reject);
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
					})
					.catch(reject);
				})
				.catch(reject);
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
	}

	async modify(id: number, idUsuario: number, emisionEjecucionDTO: EmisionEjecucionDTO) {
		const resultTransaction = this.emisionEjecucionRepository.onTransaction( async () => {
			return new Promise( async (resolve, reject) => {
				try {
					if (
						!isValidInteger(emisionEjecucionDTO.emisionEjecucion.idEmisionDefinicion, true) ||
						!isValidInteger(emisionEjecucionDTO.emisionEjecucion.idEstadoEmisionEjecucion, true) ||
						!isValidString(emisionEjecucionDTO.emisionEjecucion.numero, true) ||
						!isValidString(emisionEjecucionDTO.emisionEjecucion.descripcion, true) ||
						!isValidString(emisionEjecucionDTO.emisionEjecucion.descripcionAbreviada, true) ||
						!isValidBoolean(emisionEjecucionDTO.emisionEjecucion.imprimeRecibosEmision) ||
						!isValidBoolean(emisionEjecucionDTO.emisionEjecucion.aplicaDebitoAutomatico) ||
						!isValidBoolean(emisionEjecucionDTO.emisionEjecucion.calculoPrueba) ||
						!isValidBoolean(emisionEjecucionDTO.emisionEjecucion.calculoPagoAnticipado) ||
						!isValidDate(emisionEjecucionDTO.emisionEjecucion.fechaPagoAnticipadoVencimiento1, emisionEjecucionDTO.emisionEjecucion.calculoPagoAnticipado) ||
						!isValidDate(emisionEjecucionDTO.emisionEjecucion.fechaPagoAnticipadoVencimiento2, emisionEjecucionDTO.emisionEjecucion.calculoPagoAnticipado) ||
						!isValidDate(emisionEjecucionDTO.emisionEjecucion.fechaEjecucionInicio, false) ||
						!isValidDate(emisionEjecucionDTO.emisionEjecucion.fechaEjecucionFin, false)
					) {
						reject(new ValidationError('Existen campos incompletos'));
						return;
					}

					try {
						if (parseInt(emisionEjecucionDTO.emisionEjecucion.numero) <= 0) {
							reject(new ValidationError('El campo Número debe ser mayor a cero'));
							return;
						}
					}
					catch {
						reject(new ValidationError('El campo Número debe tener un formato correcto'));
						return;
					}

					const entidadExistente = await this.findByNumero(emisionEjecucionDTO.emisionEjecucion.numero, emisionEjecucionDTO.emisionEjecucion.calculoMasivo) as EmisionDefinicion;
					if (entidadExistente && entidadExistente.id !== emisionEjecucionDTO.emisionEjecucion.id) {
						reject(new ValidationError('El campo Número ya fue utilizado'));
						return;
					}

					emisionEjecucionDTO.emisionEjecucion = await this.emisionEjecucionRepository.modify(id, emisionEjecucionDTO.emisionEjecucion);

					let request = [];

					emisionEjecucionDTO.emisionProcedimientoParametros.forEach(async row => {
                        if (row.state === 'm') {
                            request.push(this.emisionProcedimientoParametroService.modify(row.id, row as EmisionProcedimientoParametro));
                        }
                    });

					emisionEjecucionDTO.emisionCuotas.forEach(async row => {
						if (emisionEjecucionDTO.emisionEjecucion.calculoPagoAnticipado) {
							if (row.state === 'o') row.state = 'm';
							if (row.state === 'a' || row.state === 'm') {
								row.fechaVencimiento1 = emisionEjecucionDTO.emisionEjecucion.fechaPagoAnticipadoVencimiento1;
								row.fechaVencimiento2 = emisionEjecucionDTO.emisionEjecucion.fechaPagoAnticipadoVencimiento2;
							}
						}
                        if (row.state === 'a') {
                            request.push(this.emisionCuotaService.add(row as EmisionCuota));
                        }
                        else if (row.state === 'm') {
                            request.push(this.emisionCuotaService.modify(row.id, row as EmisionCuota));
                        }
                        else if (row.state === 'r') {
                            request.push(this.emisionCuotaService.remove(row.id));
                        }
                    });

					emisionEjecucionDTO.archivos.forEach(async row => {
						if (row.state === 'a') {
							request.push(this.archivoService.add(idUsuario, row as Archivo));
						}
						else if (row.state === 'r') {
							request.push(this.archivoService.remove(row.id));
						}
					});
					emisionEjecucionDTO.observaciones.forEach(async row => {
						if (row.state === 'a') {
							request.push(this.observacionService.add(idUsuario, row as Observacion));
						}
						else if (row.state === 'r') {
							request.push(this.observacionService.remove(row.id));
						}
					});
					emisionEjecucionDTO.etiquetas.forEach(async row => {
						if (row.state === 'a') {
							request.push(this.etiquetaService.add(row as Etiqueta));
						}
						else if (row.state === 'r') {
							request.push(this.etiquetaService.remove(row.id));
						}
					});

					Promise.all(request)
					.then(responses => {
						this.findById(id).then(resolve).catch(reject);
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


	async modifyExecute(id: number) {
		// const resultTransaction = this.emisionEjecucionRepository.onTransaction( async () => {
			return new Promise( async (resolve, reject) => {
				try {
					const emisionEjecucion = await this.emisionEjecucionRepository.findById(id) as EmisionEjecucion;
					if (!emisionEjecucion) {
						reject(new ReferenceError('No existe el registro'));
						return;
					}
					if (emisionEjecucion.idEstadoEmisionEjecucion !== EMISION_EJECUCION_STATE.PROCESO) {
						reject(new ValidationError('Estado incorrecto'));
						return;
					}
					const emisionDefinicion = await this.emisionDefinicionRepository.findById(emisionEjecucion.idEmisionDefinicion) as EmisionDefinicion;
					const emisionNumeracion = await this.emisionNumeracionService.findById(emisionDefinicion.idNumeracion) as EmisionNumeracion;
					if (emisionNumeracion.idEmisionEjecucionBloqueo && emisionNumeracion.idEmisionEjecucionBloqueo !== emisionEjecucion.id) {
						reject(new ReferenceError('La númeración esta bloqueada por otra emisión activa'));
						return;
					}
					
					emisionEjecucion.fechaEjecucionInicio = getDateNow(true);
					emisionEjecucion.fechaEjecucionFin = null;
					await this.emisionEjecucionRepository.modify(id, emisionEjecucion);

					const emisionExecute = container.resolve('emisionExecute') as EmisionExecute;
					try {
						await emisionExecute.execute(emisionEjecucion.id);
						//libero la numeracion
						emisionNumeracion.valorProximo = emisionNumeracion.valorReservadoHasta + 1;
						emisionNumeracion.valorReservadoDesde= null;
						emisionNumeracion.valorReservadoHasta = null;
						emisionNumeracion.idEmisionEjecucionBloqueo = null;
						//actualizo el estado de la ejecucion
						emisionEjecucion.fechaEjecucionFin = getDateNow(true);
						emisionEjecucion.idEstadoEmisionEjecucion = EMISION_EJECUCION_STATE.FINALIZADA;
						await this.emisionNumeracionService.modify(emisionNumeracion.id, emisionNumeracion);
						const result = await this.emisionEjecucionRepository.modify(id, emisionEjecucion);
						resolve(result);
					}
					catch(error) {
						if (error instanceof CustomError) {
							//actualizo el estado de la ejecucion
							emisionEjecucion.fechaEjecucionFin = getDateNow(true);
							emisionEjecucion.idEstadoEmisionEjecucion = EMISION_EJECUCION_STATE.PAUSADA;
							const result = await this.emisionEjecucionRepository.modify(id, emisionEjecucion);
							resolve(result);
						}
						else {
							//libero la numeracion
							emisionNumeracion.valorReservadoDesde= null;
							emisionNumeracion.valorReservadoHasta = null;
							emisionNumeracion.idEmisionEjecucionBloqueo = null;
							await this.emisionNumeracionService.modify(emisionNumeracion.id, emisionNumeracion);
							//actualizo el estado de la ejecucion
							emisionEjecucion.idEstadoEmisionEjecucion = EMISION_EJECUCION_STATE.CANCELADA;
							await this.emisionEjecucionRepository.modify(id, emisionEjecucion);
							reject(error);
						}
					}
				}
				catch(error) {
					reject(new ProcessError('Error procesando datos', error));
				}
			});
		// });
		// return resultTransaction;
	}

	async modifyStart(id: number, idUsuario: number, partial: boolean) {
		const resultTransaction = this.emisionEjecucionRepository.onTransaction( async () => {
			return new Promise( async (resolve, reject) => {
				try {
					const emisionEjecucion = await this.emisionEjecucionRepository.findById(id) as EmisionEjecucion;
					if (!emisionEjecucion) {
						reject(new ReferenceError('No existe el registro'));
						return;
					}
					const emisionDefinicion = await this.emisionDefinicionRepository.findById(emisionEjecucion.idEmisionDefinicion) as EmisionDefinicion;
					const emisionNumeracion = await this.emisionNumeracionService.findById(emisionDefinicion.idNumeracion) as EmisionNumeracion;					

					if (!emisionEjecucion.calculoMasivo) {
						reject(new ReferenceError('La definición de emisión no admite cálculo masivo'));
						return;
					}
					if (emisionNumeracion.idEmisionEjecucionBloqueo && emisionNumeracion.idEmisionEjecucionBloqueo !== emisionEjecucion.id) {
						reject(new ReferenceError('La númeración esta bloqueada por otra emisión activa'));
						return;
					}
					let numeroRecibo: number = emisionNumeracion.valorProximo;

					let request = [];
					if (!partial) {
						const today = getDateNow(false);
						//borro todas las relaciones con las cuentas para regenar
						await this.emisionEjecucionCuentaService.removeByEmisionEjecucion(id);

						//consulto condiciones especiales de baja provisoria
						const TipoCondicionEspecial_CodigoBajaProvisoria:string = (await this.configuracionService.findByNombre("TipoCondicionEspecialCodigoBajaProvisoria") as Configuracion).valor;
						const condicionesEspeciales = await this.condicionEspecialService.listByTipoCondicionEspecial(TipoCondicionEspecial_CodigoBajaProvisoria) as Array<CondicionEspecial>;
						const condicionesEspecialesActivas = condicionesEspeciales.filter(f => f.fechaDesde.getTime() <= today.getTime() && f.fechaHasta.getTime() >= today.getTime());
						const idsCuentasBajaProvisoria = condicionesEspecialesActivas.map(x => x.idCuenta).sort((a, b) => a - b);

						//consulto las cuentas activas y del tipo de tributo correspondiente (FIX FILTRO CUENTAS)
						let cuentas = (await this.cuentaService.listByTipoTributo(emisionDefinicion.idTipoTributo) as Array<Cuenta>)
										.filter(f => f.idEstadoCuenta === 2 && !idsCuentasBajaProvisoria.includes(f.id)); //Activa y sin baja provisoria
						cuentas.sort((a,b) => a.numeroCuenta.localeCompare(b.numeroCuenta));

						//aplica filtros por procedimiento
						const procedimiento = await this.procedimientoService.findFullById(emisionDefinicion.idProcedimiento) as ProcedimientoDTO;
						for (let f=0; f < procedimiento.procedimientoFiltros.length; f++) {
							const filtro = await this.filtroService.findById(procedimiento.procedimientoFiltros[f].idFiltro) as Filtro;
							const idsCuentas = await this.filtroService.execute(filtro) as Array<number>;
							cuentas = cuentas.filter(f => idsCuentas.includes(f.id));
						}

						//aplica filtros por calculo de prueba
						if (emisionEjecucion.calculoPrueba) {
							const cuentasPruebas = (await this.cuentaPruebaService.list() as Array<CuentaPrueba>).map(x => x.idCuenta);
							cuentas = cuentas.filter(f => cuentasPruebas.includes(f.id));
						}

						//ingreso la relacion con las cuentas por bloques
						let numeroBloque: number = 1;
						let emisionEjecucionCuentas = [];
						cuentas.forEach((cuenta, index) => {
							let emisionEjecucionCuenta = new EmisionEjecucionCuenta();
							emisionEjecucionCuenta.idEmisionEjecucion = emisionEjecucion.id;
							emisionEjecucionCuenta.idCuenta = cuenta.id;
							emisionEjecucionCuenta.idEstadoEmisionEjecucionCuenta = 260; //Pendiente
							emisionEjecucionCuenta.numeroBloque = numeroBloque;
							emisionEjecucionCuenta.numero = (index + 1);
							emisionEjecucionCuenta.observacion = '';
							emisionEjecucionCuentas.push(emisionEjecucionCuenta);

							if ((index > 0 && index % 50 === 0) || (index === cuentas.length - 1)) {
								request.push(this.emisionEjecucionCuentaService.addByBloque(numeroBloque, emisionEjecucionCuentas));
								emisionEjecucionCuentas = [];
								numeroBloque++;
							}
						});
					}

					Promise.all(request)
					.then(async responses => {
						let request2 = [];
						let request3 = [];
						if (!partial) {			
							//obtengo sub tasa cabecera
							const emisionCuentasCorrientes = await this.emisionCuentaCorrienteService.listByEmisionDefinicion(emisionEjecucion.idEmisionDefinicion) as Array<EmisionCuentaCorriente>;
							const emisionCuentaCorrienteCabecera = emisionCuentasCorrientes.find(f => f.tasaCabecera);
							const idTasaCabecera = (emisionCuentaCorrienteCabecera) ? emisionCuentaCorrienteCabecera.idTasa : 0;
							const idSubTasaCabecera = (emisionCuentaCorrienteCabecera) ? emisionCuentaCorrienteCabecera.idSubTasa : 0;
							//consulto las cuotas
							const emisionCuotas = (await this.emisionCuotaService.listByEmisionEjecucion(emisionEjecucion.id) as Array<EmisionCuotaState>).sort((a, b) => a.orden - b.orden);
							//consulto cuentas ya emitidas para esta cuota
							let cuentasEmitidasXCuota = [];
							for (let i = 0; i < emisionCuotas.length; i++) {
								const cuota = emisionCuotas[i];
								const idsCuentasEmitidas = distinctArray((await this.cuentaCorrienteItemService.listByTasa(idTasaCabecera, idSubTasaCabecera, emisionEjecucion.periodo, parseInt(cuota.cuota)) as Array<CuentaCorrienteItem>).map(x => x.idCuenta));
								cuentasEmitidasXCuota.push(idsCuentasEmitidas);
							}

							//consulto por las ejecuciones-cuenta recien ingresadas
							const emisionEjecuionesCuentas: Array<EmisionEjecucionCuenta> = (await this.emisionEjecucionCuentaService.listByEmisionEjecucion(emisionEjecucion.id) as Array<EmisionEjecucionCuenta>).sort((a, b) => a.numero - b.numero);
							//ingreso la relacion con las cuotas por bloques
							let emisionEjecucionCuotas = [];
							for (let index = 0; index < emisionEjecuionesCuentas.length; index++) {
								const ejecucionCuenta = emisionEjecuionesCuentas[index];
								let cantidadCuotasParaEmitir = 0;
								for (let i = 0; i < emisionCuotas.length; i++) {
									const cuota = emisionCuotas[i];
									if (emisionEjecucion.calculoPagoAnticipado || !cuentasEmitidasXCuota[i].includes(ejecucionCuenta.idCuenta)) {
										let emisionEjecucionCuota = new EmisionEjecucionCuota();
										emisionEjecucionCuota.idEmisionEjecucion = emisionEjecucion.id;
										emisionEjecucionCuota.idEmisionEjecucionCuenta = ejecucionCuenta.id;
										emisionEjecucionCuota.idEmisionCuota = cuota.id;
										emisionEjecucionCuota.idPlanPagoCuota = null; //TO DO: falta agregar los PLANES DE PAGO
										emisionEjecucionCuota.numeroRecibo = numeroRecibo;
										emisionEjecucionCuota.codigoBarras = "";
										emisionEjecucionCuota.orden = cuota.orden;
										emisionEjecucionCuotas.push(emisionEjecucionCuota);
										if (!emisionEjecucion.calculoPagoAnticipado) numeroRecibo++;
										cantidadCuotasParaEmitir++;
									}
								}
								if (cantidadCuotasParaEmitir === 0) request3.push(this.emisionEjecucionCuentaService.remove(ejecucionCuenta.id));
								if (emisionEjecucion.calculoPagoAnticipado) numeroRecibo++;

								if ((index > 0 && index % 50 === 0) || (index === emisionEjecuionesCuentas.length - 1)) {
									request2.push(this.emisionEjecucionCuotaService.addByBloque(emisionEjecucionCuotas));
									emisionEjecucionCuotas = [];
								}
							}
							numeroRecibo--;
						}

						Promise.all(request2.concat(request3))
						.then(async responses => {
							if (!partial) {
								emisionEjecucion.fechaEjecucionInicio = null;
								emisionEjecucion.fechaEjecucionFin = null;
								
								emisionNumeracion.idEmisionEjecucionBloqueo = emisionEjecucion.id;
								emisionNumeracion.valorReservadoDesde = emisionNumeracion.valorProximo;
								emisionNumeracion.valorReservadoHasta = numeroRecibo;
								request.push(this.emisionNumeracionService.modify(emisionNumeracion.id, emisionNumeracion));
							}
							emisionEjecucion.idEstadoEmisionEjecucion = EMISION_EJECUCION_STATE.PROCESO;
							await this.emisionEjecucionRepository.modify(id, emisionEjecucion);
	
							//envio la ejecucion de manera asincronica
							const proceso = new Proceso(
								null,
								uuidv4(),
								`EmisionEjecucion:${id}`,
								null,
								PROCESO_STATE.PENDIENTE,
								null,
								null,
								null,
								"Ejecución de Emisión",
								"",
								0,
								"emision-ejecucion-service",
								idUsuario,
								getDateNow(true),
								`PUT|${config.DOMAIN}:${config.PORT}/api/emision-ejecucion|/execute/${id}`
							);
							await this.procesoService.add(proceso);

							this.findById(id).then(resolve).catch(reject);
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

	async modifyStop(id: number) {
		const resultTransaction = this.emisionEjecucionRepository.onTransaction( async () => {
			return new Promise( async (resolve, reject) => {
				try {
					const emisionEjecucion = await this.emisionEjecucionRepository.findById(id) as EmisionEjecucion;
					if (!emisionEjecucion) {
						reject(new ReferenceError('No existe el registro'));
						return;
					}
					const emisionDefinicion = await this.emisionDefinicionRepository.findById(emisionEjecucion.idEmisionDefinicion) as EmisionDefinicion;
					const emisionNumeracion = await this.emisionNumeracionService.findById(emisionDefinicion.idNumeracion) as EmisionNumeracion;
					if (emisionNumeracion.idEmisionEjecucionBloqueo === emisionEjecucion.id) {
						//libero la numeracion
						emisionNumeracion.valorReservadoDesde= null;
						emisionNumeracion.valorReservadoHasta = null;
						emisionNumeracion.idEmisionEjecucionBloqueo = null;
						await this.emisionNumeracionService.modify(emisionNumeracion.id, emisionNumeracion);
					}

					//borro todas las relaciones con las cuentas para regenar
					await this.emisionEjecucionCuentaService.removeByEmisionEjecucion(id);
					
					emisionEjecucion.fechaEjecucionInicio = null;
					emisionEjecucion.fechaEjecucionFin = null;
					emisionEjecucion.idEstadoEmisionEjecucion = EMISION_EJECUCION_STATE.CANCELADA;
					await this.emisionEjecucionRepository.modify(id, emisionEjecucion);
					this.findById(id).then(resolve).catch(reject);
				}
				catch(error) {
					reject(new ProcessError('Error procesando datos', error));
				}
			});
		});
		return resultTransaction;
	}

	async modifyPause(id: number) {
		const resultTransaction = this.emisionEjecucionRepository.onTransaction( async () => {
			return new Promise( async (resolve, reject) => {
				try {
					const emisionEjecucion = await this.emisionEjecucionRepository.findById(id) as EmisionEjecucion;
					if (!emisionEjecucion) {
						reject(new ReferenceError('No existe el registro'));
						return;
					}
					
					emisionEjecucion.idEstadoEmisionEjecucion = EMISION_EJECUCION_STATE.PAUSADA;
					await this.emisionEjecucionRepository.modify(id, emisionEjecucion);
					this.findById(id).then(resolve).catch(reject);
				}
				catch(error) {
					reject(new ProcessError('Error procesando datos', error));
				}
			});
		});
		return resultTransaction;
	}

	
	async remove(id: number) {
		const resultTransaction = this.emisionEjecucionRepository.onTransaction( async () => {
			return new Promise( async (resolve, reject) => {
				try {
					const emisionEjecucion = await this.emisionEjecucionRepository.findById(id) as EmisionEjecucion;
					if (emisionEjecucion.idEstadoEmisionEjecucion !== EMISION_EJECUCION_STATE.PENDIENTE &&
						emisionEjecucion.idEstadoEmisionEjecucion !== EMISION_EJECUCION_STATE.CANCELADA)
					{
						reject(new ReferenceError('No se puede eliminar el registro, existe una ejecución en curso o finalizada'));
						return;
					}

					await this.emisionAprobacionService.removeByEmisionEjecucion(id);
					await this.emisionProcedimientoParametroService.removeByEmisionEjecucion(id);
					await this.emisionEjecucionCuentaService.removeByEmisionEjecucion(id);
					await this.emisionCuotaService.removeByEmisionEjecucion(id);

					const result = await this.emisionEjecucionRepository.remove(id);
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
