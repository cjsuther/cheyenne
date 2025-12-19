import TipoMovimientoService from './tipo-movimiento-service';
import CuentaCorrienteItem from '../entities/cuenta-corriente-item';
import CuentaCorrienteItemFilter from '../dto/cuenta-corriente-item-filter';
import CuentaCorrienteItemDTO from '../dto/cuenta-corriente-item-dto';
import CuotaPorcentaje from '../entities/cuota-porcentaje';
import CuentaCorrienteItemDeudaDTO from '../dto/cuenta-corriente-item-deuda-dto';
import Cuenta from '../entities/cuenta';
import CuentaCorrienteCondicionEspecial from '../entities/cuenta-corriente-condicion-especial';
import CuentaCorrienteItemDeuda from '../dto/cuenta-corriente-item-deuda';
import CuentaPago from "../entities/cuenta-pago";
import CuentaPagoItem from "../entities/cuenta-pago-item";
import Configuracion from '../entities/configuracion';
import CuentaCorrienteItemRecibo from '../dto/cuenta-corriente-item-recibo';

import ICuentaCorrienteItemRepository from '../repositories/cuenta-corriente-item-repository';
import ICuentaRepository from '../repositories/cuenta-repository';
import NumeracionService from './numeracion-service';
import ConfiguracionService from './configuracion-service';
import IEmisionEjecucionCuentaRepository from '../repositories/emision-ejecucion-cuenta-repository';
import IEmisionEjecucionRepository from '../repositories/emision-ejecucion-repository';
import ICertificadoApremioRepository from '../repositories/certificado-apremio-repository';
import IRubroComercioRepository from '../repositories/rubro-comercio-repository';
import ICuentaCorrienteCondicionEspecialRepository from '../repositories/cuenta-corriente-condicion-especial-repository';
import ITasaRepository from '../repositories/tasa-repository';
import ISubTasaRepository from '../repositories/sub-tasa-repository';
import IEdesurClienteRepository from '../repositories/edesur-cliente-repository';
import ICuotaPorcentajeRepository from '../repositories/cuota-porcentaje-repository';
import CuentaPagoService from './cuenta-pago-service';
import CuentaPagoItemService from './cuenta-pago-item-service';
import ReciboEspecialService from './recibo-especial-service';
import EspecialService from './especial-service';
import VinculoEspecialService from './vinculo-especial-service';
import ContribuyenteService from './contribuyente-service';

import ValidationError from '../../infraestructure/sdk/error/validation-error';
import ProcessError from '../../infraestructure/sdk/error/process-error';
import ReferenceError from '../../infraestructure/sdk/error/reference-error';
import { getDateNow, getFormatNumber, iif } from '../../infraestructure/sdk/utils/convert';
import { isValidInteger, isValidString, isValidDate, isValidFloat,  } from '../../infraestructure/sdk/utils/validator';
import CuentaCorrienteItemPagoACuenta from '../dto/cuenta-corriente-item-pago-acuenta';
import TipoMovimiento from '../entities/tipo-movimiento';
import { GetDayOfYear, GetMonthDifference, GetNumeroCodigoBarras, distinctArray } from '../../infraestructure/sdk/utils/helper';
import { IMetodoInteres, MetodoFrances, MetodoSimple } from './tools/metodo-interes';
import CuentaCorrienteItemCreditoDTO from '../dto/cuenta-corriente-item-credito-dto';
import ReciboEspecialDTO from '../dto/recibo-especial-dto';
import ReciboEspecialConcepto from '../entities/recibo-especial-concepto';
import Numeracion from '../entities/numeracion';
import EspecialDTO from '../dto/especial-dto';
import PagoReciboEspecial from '../dto/pago-recibo-especial';
import PersonaMin from '../dto/persona-min';
import VinculoEspecialState from '../dto/vinculo-especial-state';


export default class CuentaCorrienteItemService {

	configuracionService: ConfiguracionService;
	numeracionService: NumeracionService;
	tipoMovimientoService: TipoMovimientoService;
	cuentaCorrienteItemRepository: ICuentaCorrienteItemRepository;
	emisionEjecucionCuentaRepository: IEmisionEjecucionCuentaRepository;
	emisionEjecucionRepository: IEmisionEjecucionRepository;
	certificadoApremioRepository: ICertificadoApremioRepository;
	cuentaRepository: ICuentaRepository;
	rubroComercioRepository: IRubroComercioRepository;
	cuentaCorrienteCondicionEspecialRepository: ICuentaCorrienteCondicionEspecialRepository;
	tasaRepository: ITasaRepository;
	subTasaRepository: ISubTasaRepository;
	edesurClienteRepository: IEdesurClienteRepository;
	cuotaPorcentajeRepository: ICuotaPorcentajeRepository;
	cuentaPagoService: CuentaPagoService;
	cuentaPagoItemService: CuentaPagoItemService;
	reciboEspecialService: ReciboEspecialService;
    especialService: EspecialService;
    vinculoEspecialService: VinculoEspecialService;
    contribuyenteService: ContribuyenteService;

	constructor(configuracionService: ConfiguracionService,
				numeracionService: NumeracionService,
				tipoMovimientoService: TipoMovimientoService,
				cuentaCorrienteItemRepository: ICuentaCorrienteItemRepository,
				emisionEjecucionCuentaRepository: IEmisionEjecucionCuentaRepository,
				emisionEjecucionRepository: IEmisionEjecucionRepository,
				certificadoApremioRepository: ICertificadoApremioRepository,
				cuentaRepository: ICuentaRepository,
				rubroComercioRepository: IRubroComercioRepository,
				cuentaCorrienteCondicionEspecialRepository: ICuentaCorrienteCondicionEspecialRepository,
				tasaRepository: ITasaRepository,
				subTasaRepository: ISubTasaRepository,
				edesurClienteRepository: IEdesurClienteRepository,
				cuotaPorcentajeRepository: ICuotaPorcentajeRepository,
				cuentaPagoService: CuentaPagoService,
				cuentaPagoItemService: CuentaPagoItemService,
				reciboEspecialService: ReciboEspecialService,
				especialService: EspecialService,
				vinculoEspecialService: VinculoEspecialService,
				contribuyenteService: ContribuyenteService
	) {
		this.configuracionService = configuracionService;
        this.numeracionService = numeracionService;
		this.tipoMovimientoService = tipoMovimientoService;
		this.cuentaCorrienteItemRepository = cuentaCorrienteItemRepository;
		this.emisionEjecucionCuentaRepository = emisionEjecucionCuentaRepository;
		this.emisionEjecucionRepository = emisionEjecucionRepository;
		this.certificadoApremioRepository = certificadoApremioRepository;
		this.cuentaRepository = cuentaRepository;
		this.rubroComercioRepository = rubroComercioRepository;
		this.cuentaCorrienteCondicionEspecialRepository = cuentaCorrienteCondicionEspecialRepository;
		this.tasaRepository = tasaRepository;
		this.subTasaRepository = subTasaRepository;
		this.edesurClienteRepository = edesurClienteRepository;
		this.cuotaPorcentajeRepository = cuotaPorcentajeRepository;
		this.cuentaPagoService = cuentaPagoService;
		this.cuentaPagoItemService = cuentaPagoItemService;
		this.reciboEspecialService = reciboEspecialService;
		this.especialService = especialService;
		this.vinculoEspecialService = vinculoEspecialService;
		this.contribuyenteService = contribuyenteService;
	}

	async list() {
		return new Promise( async (resolve, reject) => {
			try {
				const result = await this.cuentaCorrienteItemRepository.list();
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async listByFilter(cuentaCorrienteItemFilter: CuentaCorrienteItemFilter) {
		return new Promise( async (resolve, reject) => {
			try {
                const result = (await this.cuentaCorrienteItemRepository.listByFilter(cuentaCorrienteItemFilter) as Array<CuentaCorrienteItem>).sort((a, b) => a.id - b.id);
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async listByCuenta(idCuenta: number) {
		return new Promise( async (resolve, reject) => {
			try {
                const result = (await this.cuentaCorrienteItemRepository.listByCuenta(idCuenta) as Array<CuentaCorrienteItem>).sort((a, b) => a.id - b.id);
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async listByTasa(idTasa:number, idSubTasa:number, periodo:string, cuota:number, idCuenta:number = null) {
		return new Promise( async (resolve, reject) => {
			try {
                const result = (await this.cuentaCorrienteItemRepository.listByTasa(idTasa, idSubTasa, periodo, cuota, idCuenta) as Array<CuentaCorrienteItem>).sort((a, b) => a.id - b.id);
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async listByPartida(numeroPartida: number) {
		return new Promise( async (resolve, reject) => {
			try {
                const result = (await this.cuentaCorrienteItemRepository.listByPartida(numeroPartida) as Array<CuentaCorrienteItem>).sort((a, b) => a.id - b.id);
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async listByPlanPago(idPlanPago: number) {
		return new Promise( async (resolve, reject) => {
			try {
                const result = (await this.cuentaCorrienteItemRepository.listByPlanPago(idPlanPago) as Array<CuentaCorrienteItem>).sort((a, b) => a.id - b.id);
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async listByContribuyente(idContribuyente: number) {
		return new Promise( async (resolve, reject) => {
			try {
				const cuentas = await this.cuentaRepository.listByContribuyente(idContribuyente);

				const requests = [];
				cuentas.forEach(cuenta => {
					requests.push(this.cuentaCorrienteItemRepository.listByCuenta(cuenta.id));
				});

				Promise.all(requests)
				.then(responses => {
					let result: Array<CuentaCorrienteItem> = [];
					responses.forEach(response => {
						result = result.concat(response as Array<CuentaCorrienteItem>);
					});
					
					resolve(result);
				})
				.catch(reject);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async listByCredito(idCuenta: number) {
		return new Promise( async (resolve, reject) => {
			try {
				const cuenta = await this.cuentaRepository.findById(idCuenta) as Cuenta;
				if (!cuenta) {
					reject(new ReferenceError('No existe el registro'));
					return;
				}

				let toDay = getDateNow(false);

				const sortItems = (a,b) => 
					(a.numeroPartida === b.numeroPartida) ?
						(a.tasaCabecera === b.tasaCabecera) ?
							(a.idTasa === b.idTasa) ?
								(a.idSubTasa === b.idSubTasa) ?
									(a.item - b.item) :
								(a.idSubTasa - b.idSubTasa) :
							(a.idTasa - b.idTasa) :
						(a.tasaCabecera ? 1 : -1) :
					(a.numeroPartida - b.numeroPartida);

                const items = (await this.cuentaCorrienteItemRepository.listByCuenta(idCuenta) as Array<CuentaCorrienteItem>).sort(sortItems);

				let cuentaCorrienteItems = new Array<CuentaCorrienteItemDeuda>;
				if (items.length > 0) {
					let importeCredito = 0;
					let indexMovimiento = 0;
					for (let index = 0; index < items.length; index++) {
						const item = items[index];
						importeCredito += (item.importeHaber-item.importeDebe);
						//si es el ultimo o distinto al siguiente lo guardo
						if (index === items.length - 1  ||
							item.numeroPartida !== items[index+1].numeroPartida ||
							item.idTasa !== items[index+1].idTasa ||
							item.idSubTasa !== items[index+1].idSubTasa)
						{
							//si tiene deuda lo agrego
							if (importeCredito > 0) {
								let cuentaCorrienteItem = new CuentaCorrienteItemDeuda(
									indexMovimiento,
									item.idCertificadoApremio,
									item.idCuenta,
									item.idTasa,
									item.idSubTasa,
									item.codigoDelegacion,
									item.numeroMovimiento,
									item.numeroPartida,
									item.tasaCabecera,
									item.periodo,
									item.cuota,
									importeCredito,
									0, 0, 0, 0, 0, 0, 0,
									item.fechaMovimiento,
									item.fechaVencimiento1,
									item.fechaVencimiento2,
									(item.idPlanPago !== null)
								);
								//este proceso le agrega la deuda al momento a cada item
								cuentaCorrienteItems.push(cuentaCorrienteItem);
							}
	
							importeCredito = 0;
							indexMovimiento++;
						}
					}
				}

				let cuentaCorrienteItemCredito = new CuentaCorrienteItemCreditoDTO();
				cuentaCorrienteItemCredito.cuentaCorrienteItemsCredito = cuentaCorrienteItems;
				cuentaCorrienteItemCredito.cuentaCorrienteItemsSaldo = (await this.listByDeuda(idCuenta, true, toDay) as CuentaCorrienteItemDeudaDTO).cuentaCorrienteItems;

				resolve(cuentaCorrienteItemCredito);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}
	
	async listByDeuda(idCuenta: number, soloTasaCabecera: boolean, fechaVencimiento: Date = null) {
		return new Promise( async (resolve, reject) => {
			try {
				const cuenta = await this.cuentaRepository.findById(idCuenta) as Cuenta;
				if (!cuenta) {
					reject(new ReferenceError('No existe el registro'));
					return;
				}

				let toDay = getDateNow(false);
				let fechaVencimientoDeuda = (fechaVencimiento) ? fechaVencimiento : toDay;
				let cuentaCorrienteItemDeuda = new CuentaCorrienteItemDeudaDTO();

				const sortItems = (a,b) => 
					(a.numeroPartida === b.numeroPartida) ?
						(!soloTasaCabecera || a.tasaCabecera === b.tasaCabecera) ?
							(a.idTasa === b.idTasa) ?
								(a.idSubTasa === b.idSubTasa) ?
									(a.item - b.item) :
								(a.idSubTasa - b.idSubTasa) :
							(a.idTasa - b.idTasa) :
						(a.tasaCabecera ? 1 : -1) :
					(a.numeroPartida - b.numeroPartida);

                const items = (await this.cuentaCorrienteItemRepository.listByCuenta(idCuenta) as Array<CuentaCorrienteItem>).sort(sortItems);

				let cuentaCorrienteItems = new Array<CuentaCorrienteItemDeuda>;
				if (items.length > 0) {
					let importeSaldo = 0;
					let indexMovimiento = 0;
					for (let index = 0; index < items.length; index++) {
						const item = items[index];
						importeSaldo += (item.importeDebe-item.importeHaber);
						//si es el ultimo o distinto al siguiente lo guardo
						if (index === items.length - 1  ||
							item.numeroPartida !== items[index+1].numeroPartida ||
							!soloTasaCabecera && item.idTasa !== items[index+1].idTasa ||
							!soloTasaCabecera && item.idSubTasa !== items[index+1].idSubTasa)
						{
							//si tiene deuda lo agrego
							if (importeSaldo > 0) {
								let cuentaCorrienteItem = new CuentaCorrienteItemDeuda(
									indexMovimiento,
									item.idCertificadoApremio,
									item.idCuenta,
									item.idTasa,
									item.idSubTasa,
									item.codigoDelegacion,
									item.numeroMovimiento,
									item.numeroPartida,
									item.tasaCabecera,
									item.periodo,
									item.cuota,
									importeSaldo,
									0, 0, 0, 0, 0, 0, 0,
									item.fechaMovimiento,
									item.fechaVencimiento1,
									item.fechaVencimiento2,
									(item.idPlanPago !== null)
								);
								//este proceso le agrega la deuda al momento a cada item
								await this.processCuentaCorrienteItemDeuda(cuentaCorrienteItem, fechaVencimientoDeuda);
								cuentaCorrienteItems.push(cuentaCorrienteItem);
							}
	
							importeSaldo = 0;
							indexMovimiento++;
						}
					}
				}
				cuentaCorrienteItemDeuda.cuentaCorrienteItems = cuentaCorrienteItems;

				cuentaCorrienteItemDeuda.certificadosApremio = await this.certificadoApremioRepository.listByCuenta(idCuenta);
				if (cuenta.idTipoTributo === 11) { //Comercio
					cuentaCorrienteItemDeuda.rubrosComercio = await this.rubroComercioRepository.listByComercio(cuenta.idTributo);
				}
				cuentaCorrienteItemDeuda.condicionesEspeciales = (await this.cuentaCorrienteCondicionEspecialRepository.listByCuenta(idCuenta) as Array<CuentaCorrienteCondicionEspecial>)
																  .filter(f => f.fechaDesde <= toDay && f.fechaHasta >= toDay);

				resolve(cuentaCorrienteItemDeuda);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async listByPagoACuenta(parametros: CuentaCorrienteItemPagoACuenta) {
		return new Promise( async (resolve, reject) => {
			try {
				const cuenta = await this.cuentaRepository.findById(parametros.idCuenta) as Cuenta;
				if (!cuenta) {
					reject(new ReferenceError('No existe el registro'));
					return;
				}

				const cuentaCorrienteItemDeudaDTO = await this.listByDeuda(parametros.idCuenta, true, parametros.fechaVencimiento) as CuentaCorrienteItemDeudaDTO;
				let cuentaCorrienteItems = cuentaCorrienteItemDeudaDTO.cuentaCorrienteItems.filter(item => {
					if (item.fechaMovimiento.getTime() <= parametros.fechaVencimiento.getTime()) {
						if (parametros.items.find(f => item.numeroPartida === f.numeroPartida)
						) {
							return true;
						}
						else {
							return false;
						}
					}
					else {
						return false;
					}
				});

				let importeACuenta = parametros.importe;
				for(let i=0; i < cuentaCorrienteItems.length; i++)
				{
					let item = cuentaCorrienteItems[i];

					if (importeACuenta === 0) { //sin cubrir
						item.importeACancelar = 0;
					}
					else if (importeACuenta >= item.importeTotal) { //total
						importeACuenta -= item.importeTotal;
						item.importeACancelar = item.importeTotal;
					}
					else { //parcial
						item.importeACancelar = importeACuenta;
						importeACuenta = 0;
					}
				}

				resolve(cuentaCorrienteItems);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async findById(id: number) {
		return new Promise( async (resolve, reject) => {
			try {	
				let result = new CuentaCorrienteItemDTO();

				result.cuentaCorrienteItem = await this.cuentaCorrienteItemRepository.findById(id);
				if (!result.cuentaCorrienteItem) {
					reject(new ReferenceError('No existe el registro'));
					return;
				}

				if (result.cuentaCorrienteItem.idEmisionEjecucion) {
					result.emisionEjecucion = await this.emisionEjecucionRepository.findById(result.cuentaCorrienteItem.idEmisionEjecucion);
					result.cuotaPorcentajes = await this.cuotaPorcentajeRepository.listByEmisionEjecucionCuenta(result.cuentaCorrienteItem.idEmisionEjecucion, result.cuentaCorrienteItem.idCuenta) as Array<CuotaPorcentaje>;
					result.cuotaPorcentajes = result.cuotaPorcentajes.filter(f => f.cuota === result.cuentaCorrienteItem.cuota);
				}

				if (result.cuentaCorrienteItem.idCertificadoApremio) {
					result.certificadoApremio = await this.certificadoApremioRepository.findById(result.cuentaCorrienteItem.idCertificadoApremio);
				}

				result.cuenta = await this.cuentaRepository.findById(result.cuentaCorrienteItem.idCuenta);

				result.tasa = await this.tasaRepository.findById(result.cuentaCorrienteItem.idTasa);

				result.subTasa = await this.subTasaRepository.findById(result.cuentaCorrienteItem.idSubTasa);

				if (result.cuentaCorrienteItem.idEdesurCliente) {
					result.edesurCliente = await this.edesurClienteRepository.findById(result.cuentaCorrienteItem.idEdesurCliente);
				}			

				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async add(cuentaCorrienteItem: CuentaCorrienteItem) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidInteger(cuentaCorrienteItem.idCuenta, true) ||
					!isValidInteger(cuentaCorrienteItem.idTasa, true) ||
					!isValidInteger(cuentaCorrienteItem.idSubTasa, true) ||
					!isValidString(cuentaCorrienteItem.periodo, true) ||
					!isValidInteger(cuentaCorrienteItem.cuota, false) ||
					!isValidString(cuentaCorrienteItem.codigoDelegacion, true) ||
					!isValidInteger(cuentaCorrienteItem.idTipoMovimiento, true) ||
					!isValidInteger(cuentaCorrienteItem.numeroMovimiento, true) ||
					!isValidInteger(cuentaCorrienteItem.numeroPartida, true) ||
					!isValidInteger(cuentaCorrienteItem.idTipoValor, true) ||
					!isValidFloat(cuentaCorrienteItem.importeDebe, false) ||
					!isValidFloat(cuentaCorrienteItem.importeHaber, false) ||
					!isValidDate(cuentaCorrienteItem.fechaOrigen, true) ||
					!isValidDate(cuentaCorrienteItem.fechaMovimiento, true) ||
					!isValidDate(cuentaCorrienteItem.fechaVencimiento1, true) ||
					!isValidDate(cuentaCorrienteItem.fechaVencimiento2, true) ||
					!isValidInteger(cuentaCorrienteItem.cantidad, false) ||
					!isValidInteger(cuentaCorrienteItem.item, false) ||
					!isValidInteger(cuentaCorrienteItem.idUsuarioRegistro, true) ||
					!isValidDate(cuentaCorrienteItem.fechaRegistro, true)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				cuentaCorrienteItem.id = null;
				if (cuentaCorrienteItem.idEmisionEjecucion === 0) cuentaCorrienteItem.idEmisionEjecucion = null;
				if (cuentaCorrienteItem.idEmisionCuentaCorrienteResultado === 0) cuentaCorrienteItem.idEmisionCuentaCorrienteResultado = null;
				if (cuentaCorrienteItem.idPlanPago === 0) cuentaCorrienteItem.idPlanPago = null;
				if (cuentaCorrienteItem.idPlanPagoCuota === 0) cuentaCorrienteItem.idPlanPagoCuota = null;
				if (cuentaCorrienteItem.idCertificadoApremio === 0) cuentaCorrienteItem.idCertificadoApremio = null;
				if (cuentaCorrienteItem.idEdesurCliente === 0) cuentaCorrienteItem.idEdesurCliente = null;
				if (cuentaCorrienteItem.idLugarPago === 0) cuentaCorrienteItem.idLugarPago = null;

				const result = await this.cuentaCorrienteItemRepository.add(cuentaCorrienteItem);
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}
	
	async addReciboComun(idCuenta: number, fechaVencimiento: Date, items: Array<CuentaCorrienteItemRecibo>) {
		const resultTransaction = this.cuentaCorrienteItemRepository.onTransaction( async () => { 
			return new Promise( async (resolve, reject) => {
				try {
					const toDay = getDateNow(false);
					const fechaVencimientoTermino = fechaVencimiento;

					const cuentaCorrienteItemDeudaDTO = await this.listByDeuda(idCuenta, false, fechaVencimientoTermino) as CuentaCorrienteItemDeudaDTO;
					const cuentaCorrienteItems = cuentaCorrienteItemDeudaDTO.cuentaCorrienteItems as Array<CuentaCorrienteItemDeuda>;
					
					const codigoDelegacionRecibos:string = (await this.configuracionService.findByNombre('CuentaCorrienteCodigoDelegacionRecibos', true) as Configuracion).valor;
					const numeroRecibo:number = await this.numeracionService.findByProximo("CuentaCorrienteRecibos") as number;

					let indexCuentaPagoItem = 0;
					let cuentaPago: CuentaPago = null;
					for (let index=0; index < cuentaCorrienteItems.length; index++) {
						const item = cuentaCorrienteItems[index];
						if (items.find(f => item.numeroPartida === f.numeroPartida)
						) {
							if (indexCuentaPagoItem === 0) {
								cuentaPago = new CuentaPago(
									null, //id
									null, //idEmisionEjecucion
									null, //idPlanPago
									item.idCuenta,
									codigoDelegacionRecibos,
									numeroRecibo, //numeroMovimiento,
									toDay.getFullYear().toString(), //periodo
									0, //cuota (*)
									0,
									0,
									fechaVencimientoTermino,
									null,
									"",
									false, //pagoAnticipado
									false //reciboEspecial
								);
								//(*) no se pone este dato porque no incluye uno especifico, esto se informa en el detalle)
								cuentaPago = await this.cuentaPagoService.add(cuentaPago) as CuentaPago;
							}
							indexCuentaPagoItem++;

							let cuentaPagoItem = new CuentaPagoItem(
								null, //id
								null, //idEmisionEjecucion,
								null, //idEmisionConceptoResultado
								null, //idPlanPagoCuota
								cuentaPago.id, //idCuentaPago
								item.idCuenta,
								item.idTasa,
								item.idSubTasa,
								item.periodo,
								item.cuota,
								item.importeSaldo,
								item.importeAccesorios,
								item.importeRecargos,
								item.importeMultas,
								item.importeHonorarios,
								item.importeAportes,
								item.importeTotal,
								item.importeTotal, //importeNeto = importeTotal
								0, //importeDescuento
								fechaVencimientoTermino,
								null, //fechaCobro
								null, //idEdesurCliente,
								indexCuentaPagoItem, //item
								item.numeroPartida
							);
							cuentaPago.importeVencimiento1 += cuentaPagoItem.importeTotal;
							cuentaPagoItem = await this.cuentaPagoItemService.add(cuentaPagoItem) as CuentaPagoItem;
						}
					}
					const municipioPagoFacil:string = (await this.configuracionService.findByNombre("MunicipioPagoFacil") as Configuracion).valor;
					cuentaPago.codigoBarras = GetNumeroCodigoBarras(
						municipioPagoFacil,
						getFormatNumber(cuentaPago.importeVencimiento1,2).toString().replace(',','').replace('.',''),
						cuentaPago.fechaVencimiento1.getFullYear().toString().substring(2),
						GetDayOfYear(cuentaPago.fechaVencimiento1).toString(),
						getFormatNumber(cuentaPago.importeVencimiento1,2).toString().replace(',','').replace('.',''),
						"0",
						cuentaPago.codigoDelegacion,
						cuentaPago.numeroRecibo.toString()
					);
					cuentaPago = await this.cuentaPagoService.modify(cuentaPago.id, cuentaPago) as CuentaPago;

					if (indexCuentaPagoItem === 0) {
						reject(new ValidationError('No se pudieron identificar items para procesar'));
						return;
					}

					resolve({idCuentaPago: cuentaPago.id});
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

	async addPagoReciboEspecial(idUsuario: number, pagoReciboEspecial: PagoReciboEspecial) {
		const resultTransaction = this.cuentaCorrienteItemRepository.onTransaction( async () => { 
			return new Promise( async (resolve, reject) => {
				try {
					if (pagoReciboEspecial.idCuenta === 0) {
						if (pagoReciboEspecial.idPersona === 0) {
							reject(new ValidationError('No se pudo identificar al contribuyente'));
							return;
						}
						const persona = new PersonaMin(); persona.setFromObject(pagoReciboEspecial);
						const cuenta = await this.addCuentaPersona(idUsuario, persona) as Cuenta;
						pagoReciboEspecial.idCuenta = cuenta.id;
					}

					const fechaVencimientoTermino = pagoReciboEspecial.fechaVencimiento;
					const valorUF:number = parseFloat(iif((await this.configuracionService.findByNombre('CuentaCorrienteValorUF', true) as Configuracion).valor, "", "0"));
					const reciboEspecialDTO = await this.reciboEspecialService.findById(pagoReciboEspecial.idReciboEspecial) as ReciboEspecialDTO;
					
					const codigoDelegacionRecibos:string = (await this.configuracionService.findByNombre('CuentaCorrienteCodigoDelegacionRecibos', true) as Configuracion).valor;
					const numeroRecibo:number = await this.numeracionService.findByProximo("CuentaCorrienteRecibos") as number;

					let numeracionPartida = await this.numeracionService.findByNombre("CuentaCorrientePartida") as Numeracion;
					let numeroPartida = numeracionPartida.valorProximo;
					numeracionPartida.valorProximo = numeracionPartida.valorProximo += reciboEspecialDTO.recibosEspecialConcepto.length;
					await this.numeracionService.modifyByNombre("CuentaCorrientePartida", numeracionPartida);

					let indexCuentaPagoItem = 0;
					let cuentaPago: CuentaPago = null;
					for (let index=0; index < reciboEspecialDTO.recibosEspecialConcepto.length; index++) {
						const item = reciboEspecialDTO.recibosEspecialConcepto[index] as ReciboEspecialConcepto;
						if (indexCuentaPagoItem === 0) {
							cuentaPago = new CuentaPago(
								null, //id
								null, //idEmisionEjecucion
								null, //idPlanPago
								pagoReciboEspecial.idCuenta,
								codigoDelegacionRecibos,
								numeroRecibo, //numeroMovimiento,
								pagoReciboEspecial.periodo, //periodo
								pagoReciboEspecial.cuota,
								0,
								0,
								fechaVencimientoTermino,
								null,
								"",
								false, //pagoAnticipado
								true //reciboEspecial
							);
							//(*) no se pone este dato porque no incluye uno especifico, esto se informa en el detalle)
							cuentaPago = await this.cuentaPagoService.add(cuentaPago) as CuentaPago;
						}
						indexCuentaPagoItem++;

						const importeItem = (reciboEspecialDTO.reciboEspecial.aplicaValorUF) ? (item.valor * valorUF) : item.valor;
						let cuentaPagoItem = new CuentaPagoItem(
							null, //id
							null, //idEmisionEjecucion,
							null, //idEmisionConceptoResultado
							null, //idPlanPagoCuota
							cuentaPago.id, //idCuentaPago
							pagoReciboEspecial.idCuenta,
							item.idTasa,
							item.idSubTasa,
							pagoReciboEspecial.periodo,
							pagoReciboEspecial.cuota,
							importeItem, //importeNominal,
							0, //importeAccesorios,
							0, //importeRecargos,
							0, //importeMultas,
							0, //importeHonorarios,
							0, //importeAportes,
							importeItem, //importeTotal,
							importeItem, //importeNeto = importeTotal
							0, //importeDescuento
							fechaVencimientoTermino,
							null, //fechaCobro
							null, //idEdesurCliente,
							indexCuentaPagoItem, //item
							numeroPartida++
						);
						cuentaPago.importeVencimiento1 += cuentaPagoItem.importeTotal;
						cuentaPagoItem = await this.cuentaPagoItemService.add(cuentaPagoItem) as CuentaPagoItem;
					}
					const municipioPagoFacil:string = (await this.configuracionService.findByNombre("MunicipioPagoFacil") as Configuracion).valor;
					cuentaPago.codigoBarras = GetNumeroCodigoBarras(
						municipioPagoFacil,
						getFormatNumber(cuentaPago.importeVencimiento1,2).toString().replace(',','').replace('.',''),
						cuentaPago.fechaVencimiento1.getFullYear().toString().substring(2),
						GetDayOfYear(cuentaPago.fechaVencimiento1).toString(),
						getFormatNumber(cuentaPago.importeVencimiento1,2).toString().replace(',','').replace('.',''),
						"0",
						cuentaPago.codigoDelegacion,
						cuentaPago.numeroRecibo.toString()
					);
					cuentaPago = await this.cuentaPagoService.modify(cuentaPago.id, cuentaPago) as CuentaPago;

					if (indexCuentaPagoItem === 0) {
						reject(new ValidationError('No se pudieron identificar items para procesar'));
						return;
					}

					resolve({idCuentaPago: cuentaPago.id});
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

	async addByBloque(rows: Array<CuentaCorrienteItem>) {
		return new Promise( async (resolve, reject) => {
			try {
				const result = await this.cuentaCorrienteItemRepository.addByBloque(rows);
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async addByPagoACuenta(parametros: CuentaCorrienteItemPagoACuenta) {
		const resultTransaction = this.cuentaCorrienteItemRepository.onTransaction( async () => { 
			return new Promise( async (resolve, reject) => {
				try {
					const toDay = getDateNow(false);
					const fechaVencimientoTermino = parametros.fechaVencimiento;

					const cuentaCorrienteItems = await this.listByPagoACuenta(parametros) as Array<CuentaCorrienteItemDeuda>;
					
					const codigoDelegacionRecibos:string = (await this.configuracionService.findByNombre('CuentaCorrienteCodigoDelegacionRecibos', true) as Configuracion).valor;
					const numeroRecibo:number = await this.numeracionService.findByProximo("CuentaCorrienteRecibos") as number;

					let indexCuentaPagoItem = 0;
					let cuentaPago: CuentaPago = null;
					for (let index=0; index < cuentaCorrienteItems.length; index++) {
						const item = cuentaCorrienteItems[index];
						if (item.importeACancelar > 0) {

							if (indexCuentaPagoItem === 0) {
								cuentaPago = new CuentaPago(
									null, //id
									null, //idEmisionEjecucion
									null, //idPlanPago
									item.idCuenta,
									codigoDelegacionRecibos,
									numeroRecibo, //numeroMovimiento,
									toDay.getFullYear().toString(), //periodo
									0, //cuota (*)
									0,
									0,
									fechaVencimientoTermino,
									null,
									"",
									false, //pagoAnticipado
									false //reciboEspecial
								);
								//(*) no se pone este dato porque no incluye uno especifico, esto se informa en el detalle)
								cuentaPago = await this.cuentaPagoService.add(cuentaPago) as CuentaPago;
							}
							indexCuentaPagoItem++;

							let cuentaPagoItem = new CuentaPagoItem(
								null, //id
								null, //idEmisionEjecucion,
								null, //idEmisionConceptoResultado
								null, //idPlanPagoCuota
								cuentaPago.id, //idCuentaPago
								item.idCuenta,
								item.idTasa,
								item.idSubTasa,
								item.periodo,
								item.cuota,
								item.importeSaldo,
								item.importeAccesorios,
								item.importeRecargos,
								item.importeMultas,
								item.importeHonorarios,
								item.importeAportes,
								item.importeACancelar,
								//(item.importeACancelar > item.importeAccesorios) ? (item.importeACancelar - item.importeAccesorios) : 0, //importeNeto
								item.importeACancelar, //importeNeto = importeTotal
								0, //importeDescuento
								fechaVencimientoTermino,
								null, //fechaCobro
								null, //idEdesurCliente,
								indexCuentaPagoItem, //item
								item.numeroPartida
							);
							cuentaPago.importeVencimiento1 += cuentaPagoItem.importeTotal;
							cuentaPagoItem = await this.cuentaPagoItemService.add(cuentaPagoItem) as CuentaPagoItem;
						}
					}
					const municipioPagoFacil:string = (await this.configuracionService.findByNombre("MunicipioPagoFacil") as Configuracion).valor;
					cuentaPago.codigoBarras = GetNumeroCodigoBarras(
						municipioPagoFacil,
						getFormatNumber(cuentaPago.importeVencimiento1,2).toString().replace(',','').replace('.',''),
						cuentaPago.fechaVencimiento1.getFullYear().toString().substring(2),
						GetDayOfYear(cuentaPago.fechaVencimiento1).toString(),
						getFormatNumber(cuentaPago.importeVencimiento1,2).toString().replace(',','').replace('.',''),
						"0",
						cuentaPago.codigoDelegacion,
						cuentaPago.numeroRecibo.toString()
					);
					cuentaPago = await this.cuentaPagoService.modify(cuentaPago.id, cuentaPago) as CuentaPago;

					if (indexCuentaPagoItem === 0) {
						reject(new ValidationError('No se pudieron identificar items para procesar'));
						return;
					}

					resolve({idCuentaPago: cuentaPago.id});
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

	async addCredito(idUsuario: number, idCuenta: number, numeroPartidaOrigen: number, numeroPartidaDestino: number, detalle: string) {
		const resultTransaction = this.cuentaCorrienteItemRepository.onTransaction( async () => { 
			return new Promise( async (resolve, reject) => {
				try {
					if (
						!isValidInteger(idCuenta, true) ||
						!isValidInteger(numeroPartidaOrigen, true) ||
						!isValidInteger(numeroPartidaDestino, true)
					) {
						reject(new ValidationError('Existen campos incompletos'));
						return;
					}

					const cuentaCorrienteItemCreditoDTO = await this.listByCredito(idCuenta) as CuentaCorrienteItemCreditoDTO;
					const itemCredito = cuentaCorrienteItemCreditoDTO.cuentaCorrienteItemsCredito.find(f => f.numeroPartida === numeroPartidaOrigen);
					const itemSaldo = cuentaCorrienteItemCreditoDTO.cuentaCorrienteItemsSaldo.find(f => f.numeroPartida === numeroPartidaDestino);
					if (!itemCredito || !itemSaldo) {
						reject(new ValidationError('No se pudo identificar los movimientos'));
						return;
					}
					const importe = (itemCredito.importeSaldo <= itemSaldo.importeSaldo) ? itemCredito.importeSaldo : itemSaldo.importeSaldo;

					const idTipoMovimientoCodigo300:number = (await this.tipoMovimientoService.findByCodigo('300') as TipoMovimiento).id; //APLICACION DE CREDITO
					const itemBaseOrigen = (await this.listByPartida(numeroPartidaOrigen) as Array<CuentaCorrienteItem>).find(f => f.tasaCabecera);
					const itemBaseDestino = (await this.listByPartida(numeroPartidaDestino) as Array<CuentaCorrienteItem>).find(f => f.tasaCabecera);
					if (!itemBaseOrigen || !itemBaseDestino) {
						reject(new ValidationError('No se pudo identificar los movimientos'));
						return;
					}

					const tipoMovimiento = await this.tipoMovimientoService.findById(idTipoMovimientoCodigo300) as TipoMovimiento;
					let numeroMovimiento = tipoMovimiento.numero;
					tipoMovimiento.numero++;
					await this.tipoMovimientoService.modify(tipoMovimiento.id, tipoMovimiento);

					const toDay = getDateNow();
					const toDayWithHour = getDateNow(true);

					const itemOrigen = new CuentaCorrienteItem(
						null, //id
						null, //idEmisionEjecucion,
						null, //idEmisionCuentaCorrienteResultado
						null, //idPlanPago
						null, //idPlanPagoCuota
						null, //idCertificadoApremio
						idCuenta,
						itemBaseOrigen.idTasa,
						itemBaseOrigen.idSubTasa,
						itemBaseOrigen.periodo,
						itemBaseOrigen.cuota,
						"00", //codigoDelegacion
						idTipoMovimientoCodigo300,
						numeroMovimiento,
						itemBaseOrigen.numeroPartida,
						false,
						itemBaseOrigen.idTipoValor,
						importe, //importeDebe
						0, //importeHaber
						null, //idLugarPago
						toDay, //fechaOrigen
						toDay, //fechaMovimiento
						itemBaseOrigen.fechaVencimiento1,
						itemBaseOrigen.fechaVencimiento2,
						0, //cantidad,
						null, //idEdesurCliente
						detalle, //detalle
						1, //item
						idUsuario, //idUsuarioRegistro
						toDayWithHour //fechaRegistro
					);

					const itemDestino = new CuentaCorrienteItem(
						null, //id
						null, //idEmisionEjecucion,
						null, //idEmisionCuentaCorrienteResultado
						null, //idPlanPago
						null, //idPlanPagoCuota
						null, //idCertificadoApremio
						idCuenta,
						itemBaseDestino.idTasa,
						itemBaseDestino.idSubTasa,
						itemBaseDestino.periodo,
						itemBaseDestino.cuota,
						"00", //codigoDelegacion
						idTipoMovimientoCodigo300,
						numeroMovimiento,
						itemBaseDestino.numeroPartida,
						false,
						itemBaseDestino.idTipoValor,
						0, //importeDebe
						importe, //importeHaber
						null, //idLugarPago
						toDay, //fechaOrigen
						toDay, //fechaMovimiento
						itemBaseDestino.fechaVencimiento1,
						itemBaseDestino.fechaVencimiento2,
						0, //cantidad,
						null, //idEdesurCliente
						detalle, //detalle
						1, //item
						idUsuario, //idUsuarioRegistro
						toDayWithHour //fechaRegistro
					);

					await this.cuentaCorrienteItemRepository.add(itemOrigen);
					await this.cuentaCorrienteItemRepository.add(itemDestino);

					resolve({idCuenta: idCuenta});
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

	async addByDebitoCredito(idUsuario: number, idCuenta: number, cuentaCorrienteItems: Array<CuentaCorrienteItem>) {
		const resultTransaction = this.cuentaCorrienteItemRepository.onTransaction( async () => { 
			return new Promise( async (resolve, reject) => {
				try {
					if (
						!isValidInteger(idCuenta, true) ||
						cuentaCorrienteItems.length === 0
					) {
						reject(new ValidationError('Existen campos incompletos'));
						return;
					}
					const itemBase = cuentaCorrienteItems[0];
					const tipoMovimiento = await this.tipoMovimientoService.findById(itemBase.idTipoMovimiento) as TipoMovimiento;
					let numeroMovimiento = itemBase.numeroMovimiento;
					if (tipoMovimiento.autonumerado) {
						numeroMovimiento = tipoMovimiento.numero;
						tipoMovimiento.numero++;
						await this.tipoMovimientoService.modify(tipoMovimiento.id, tipoMovimiento);
					}

					const toDay = getDateNow();
					const toDayWithHour = getDateNow(true);

					let indexCuentaCorrienteItem = 0;
					for (let index=0; index < cuentaCorrienteItems.length; index++) {
						const item = cuentaCorrienteItems[index];
						if (item.idEmisionEjecucion === 0) item.idEmisionEjecucion = null;
						if (item.idCertificadoApremio === 0) item.idCertificadoApremio = null;
						if (item.idEdesurCliente === 0) item.idEdesurCliente = null;
						if (item.idLugarPago === 0) item.idLugarPago = null;

						let itemsExistentes =  await this.listByTasa(item.idTasa, item.idSubTasa, item.periodo, item.cuota, idCuenta) as Array<CuentaCorrienteItem>;
						if (item.idEmisionEjecucion !== null) {
							itemsExistentes = itemsExistentes.filter(f => f.idEmisionEjecucion === itemBase.idEmisionEjecucion);
						}
						const numerosPartidas = distinctArray(itemsExistentes.map(x => x.numeroPartida));
						if (numerosPartidas.length === 0) {
							reject(new ValidationError(`El movimiento ${index+1} no pudo ser asociado a la cuenta corriente. No existe el periodo-cuota para esa tasa`));
							return;
						}
						else if (numerosPartidas.length > 1) {
							reject(new ValidationError(`El movimiento ${index+1} no pudo ser asociado a la cuenta corriente. Hay más de un periodo-cuota identificado para esa tasa`));
							return;
						}
						const numeroPartida = numerosPartidas[0]; //el numero de partido debe ser identificado univocamente

						indexCuentaCorrienteItem++;

						let cuentaCorrienteItem = new CuentaCorrienteItem(
                            null, //id
                            item.idEmisionEjecucion,
                            null, //idEmisionCuentaCorrienteResultado
                            null, //idPlanPago
                            null, //idPlanPagoCuota
                            item.idCertificadoApremio,
                            idCuenta,
                            item.idTasa,
                            item.idSubTasa,
                            item.periodo,
                            item.cuota,
                            item.codigoDelegacion,
                            item.idTipoMovimiento,
                            numeroMovimiento,
							numeroPartida,
                            false,
                            item.idTipoValor,
                            item.importeDebe,
                            item.importeHaber,
                            item.idLugarPago,
                            toDay, //fechaOrigen
                            toDay, //fechaMovimiento
                            item.fechaVencimiento1,
                            item.fechaVencimiento2,
                            item.cantidad, //cantidad,
                            item.idEdesurCliente, //idEdesurCliente,
                            item.detalle, //detalle
                            indexCuentaCorrienteItem, //item
                            idUsuario, //idUsuarioRegistro
                            toDayWithHour //fechaRegistro
						);
						await this.cuentaCorrienteItemRepository.add(cuentaCorrienteItem);
					}

					resolve({idCuenta: idCuenta});
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

	async modify(id: number, cuentaCorrienteItem: CuentaCorrienteItem) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidInteger(cuentaCorrienteItem.idCuenta, true) ||
					!isValidInteger(cuentaCorrienteItem.cantidad, false) ||
					!isValidInteger(cuentaCorrienteItem.idUsuarioRegistro, true) ||
					!isValidDate(cuentaCorrienteItem.fechaRegistro, true)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				const result = await this.cuentaCorrienteItemRepository.modify(id, cuentaCorrienteItem);
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
				const result = await this.cuentaCorrienteItemRepository.remove(id);
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

	async processCuentaCorrienteItemDeuda(cuentaCorrienteItem: CuentaCorrienteItemDeuda, fechaVencimientoDeuda: Date) {
		const sInteresRecargos:string = (await this.configuracionService.findByNombre("CuentaCorrienteInteresRecargos", true) as Configuracion).valor;
		const sPorcentajeHonorarios:string = (await this.configuracionService.findByNombre("CuentaCorrientePorcentajeHonorarios", true) as Configuracion).valor;
		const sPorcentajeAportes:string = (await this.configuracionService.findByNombre("CuentaCorrientePorcentajeAportes", true) as Configuracion).valor;
		const interesRecargos = parseFloat(sInteresRecargos);
		const porcentajeHonorarios = parseFloat(sPorcentajeHonorarios);
		const porcentajeAportes = parseFloat(sPorcentajeAportes);

		if (cuentaCorrienteItem.fechaVencimiento2.getTime() < fechaVencimientoDeuda.getTime()) {
			const monthDifference = GetMonthDifference(cuentaCorrienteItem.fechaVencimiento2, fechaVencimientoDeuda);
			const countMonth = monthDifference + 1; //agrego otro mes por segundo vencimiento
			const metodoInteres:IMetodoInteres = new MetodoFrances(cuentaCorrienteItem.importeSaldo, interesRecargos, countMonth);
			cuentaCorrienteItem.importeRecargos = metodoInteres.getImporteInteresTotal();
		}
		else {
			cuentaCorrienteItem.importeRecargos = 0;
		}

		if (cuentaCorrienteItem.idCertificadoApremio > 0) {
			cuentaCorrienteItem.importeHonorarios = (cuentaCorrienteItem.importeSaldo * porcentajeHonorarios / 100);
		}
		else {
			cuentaCorrienteItem.importeHonorarios = 0;
		}

		cuentaCorrienteItem.importeAportes = (cuentaCorrienteItem.importeHonorarios * porcentajeAportes / 100);

		cuentaCorrienteItem.importeMultas = 0;

		cuentaCorrienteItem.importeAccesorios= (cuentaCorrienteItem.importeMultas + cuentaCorrienteItem.importeRecargos +
												cuentaCorrienteItem.importeHonorarios + cuentaCorrienteItem.importeAportes);
												
		cuentaCorrienteItem.importeTotal = (cuentaCorrienteItem.importeSaldo + cuentaCorrienteItem.importeAccesorios);

		return cuentaCorrienteItem;
	}


	private async addCuentaPersona(idUsuario: number, persona: PersonaMin) {
		return new Promise( async (resolve, reject) => {
			try {
				let especialDTO = new EspecialDTO();

				especialDTO.especial.idEstadoCarga = 20; //Incompleta
				especialDTO = await this.especialService.add(especialDTO);

				const vinculo = new VinculoEspecialState();
				vinculo.setFromObject(persona);
				vinculo.idEspecial = especialDTO.especial.id;
				vinculo.idTipoVinculoEspecial = 100; //Responsable de Cuenta (Cuentas Especiales)
				vinculo.state = "a";
				especialDTO.vinculosEspecial.push(vinculo);

				especialDTO.especial.idEstadoCarga == 21; //Completa
				especialDTO = await this.especialService.modify(especialDTO.especial.id, idUsuario, especialDTO);

				resolve(especialDTO.cuenta);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

}
