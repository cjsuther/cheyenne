import { v4 as uuidv4 } from 'uuid';
import ProcesoService from './proceso-service';
import TipoMovimientoService from './tipo-movimiento-service';
import TipoPlanPagoService from './tipo-plan-pago-service';
import PlanPagoDefinicionService from './plan-pago-definicion-service';
import IPlanPagoRepository from '../repositories/plan-pago-repository';
import IPlanPagoCuotaRepository from '../repositories/plan-pago-cuota-repository';
import ITipoVencimientoPlanPagoRepository from '../repositories/tipo-vencimiento-plan-pago-repository';
import CuentaCorrienteItemService from './cuenta-corriente-item-service';
import ICuentaRepository from '../repositories/cuenta-repository';
import ConfiguracionService from './configuracion-service';
import NumeracionService from './numeracion-service';
import CuentaPagoService from './cuenta-pago-service';
import CuentaPagoItemService from './cuenta-pago-item-service';
import ITasaRepository from '../repositories/tasa-repository';
import ISubTasaRepository from '../repositories/sub-tasa-repository';

import PlanPago from '../entities/plan-pago';
import PlanPagoCuota from '../entities/plan-pago-cuota';
import PlanPagoAdd from '../dto/plan-pago-add';
import PlanPagoDefinicion from '../entities/plan-pago-definicion';
import PlanPagoDefinicionCuotas from '../dto/plan-pago-definicion-cuotas';
import TipoVencimientoPlanPago from '../entities/tipo-vencimiento-plan-pago';
import Cuenta from '../entities/cuenta';
import PlanPagoDTO from '../dto/plan-pago-dto';
import CuentaPago from "../entities/cuenta-pago";
import CuentaPagoItem from "../entities/cuenta-pago-item";
import Configuracion from '../entities/configuracion';

import { isValidInteger, isValidString, isValidBoolean, isValidFloat, isValidDate, isNull,  } from '../../infraestructure/sdk/utils/validator';
import { getDateNow, getFormatNumber } from '../../infraestructure/sdk/utils/convert';
import ValidationError from '../../infraestructure/sdk/error/validation-error';
import ProcessError from '../../infraestructure/sdk/error/process-error';
import ReferenceError from '../../infraestructure/sdk/error/reference-error';
import { AddDays, GetDayOfYear, GetLastDayMonth, GetNumeroCodigoBarras } from '../../infraestructure/sdk/utils/helper';
import SubTasa from '../entities/sub-tasa';
import TipoPlanPago from '../entities/tipo-plan-pago';
import CuentaCorrienteItemRecibo from '../dto/cuenta-corriente-item-recibo';
import CuentaCorrienteItemFilter from '../dto/cuenta-corriente-item-filter';
import CuentaCorrienteItem from '../entities/cuenta-corriente-item';
import CuentaCorrienteItemDeuda from '../dto/cuenta-corriente-item-deuda';
import CuentaCorrienteItemDeudaDTO from '../dto/cuenta-corriente-item-deuda-dto';
import TipoMovimiento from '../entities/tipo-movimiento';
import Numeracion from '../entities/numeracion';
import PlanPagoDefinicionDTO from '../dto/plan-pago-definicion-dto';
import { PLAN_PAGO_CUOTA_STATE } from '../../infraestructure/sdk/consts/planPagoCuotaState';
import Proceso from '../entities/proceso';
import { PROCESO_STATE } from '../../infraestructure/sdk/consts/procesoState';
import config from '../../server/configuration/config';
import PlanPagoDefinicionValid from '../dto/plan-pago-definicion-valid';


export default class PlanPagoService {

	configuracionService: ConfiguracionService;
	numeracionService: NumeracionService;
	procesoService: ProcesoService;
	tipoMovimientoService: TipoMovimientoService;
	tipoPlanPagoService: TipoPlanPagoService;
	planPagoDefinicionService: PlanPagoDefinicionService;
	planPagoRepository: IPlanPagoRepository;
	planPagoCuotaRepository: IPlanPagoCuotaRepository;
	tipoVencimientoPlanPagoRepository: ITipoVencimientoPlanPagoRepository;
	cuentaCorrienteItemService: CuentaCorrienteItemService;
	cuentaRepository: ICuentaRepository;
	cuentaPagoService: CuentaPagoService;
	cuentaPagoItemService: CuentaPagoItemService;
	tasaRepository: ITasaRepository;
	subTasaRepository: ISubTasaRepository;

	constructor(configuracionService: ConfiguracionService,
				numeracionService: NumeracionService,
				procesoService: ProcesoService,
				tipoMovimientoService: TipoMovimientoService,
				tipoPlanPagoService: TipoPlanPagoService,
				planPagoDefinicionService: PlanPagoDefinicionService,
				planPagoRepository: IPlanPagoRepository,
				planPagoCuotaRepository: IPlanPagoCuotaRepository,
				tipoVencimientoPlanPagoRepository: ITipoVencimientoPlanPagoRepository,
				cuentaCorrienteItemService: CuentaCorrienteItemService,
				cuentaRepository: ICuentaRepository,
				cuentaPagoService: CuentaPagoService,
				cuentaPagoItemService: CuentaPagoItemService,
				tasaRepository: ITasaRepository,
				subTasaRepository: ISubTasaRepository)
	{
		this.configuracionService = configuracionService;
		this.numeracionService = numeracionService;
		this.procesoService = procesoService;
		this.tipoMovimientoService = tipoMovimientoService;
		this.tipoPlanPagoService = tipoPlanPagoService;
		this.planPagoDefinicionService = planPagoDefinicionService;
		this.planPagoRepository = planPagoRepository;
		this.planPagoCuotaRepository = planPagoCuotaRepository;
		this.tipoVencimientoPlanPagoRepository = tipoVencimientoPlanPagoRepository;
		this.cuentaCorrienteItemService = cuentaCorrienteItemService;
		this.cuentaRepository = cuentaRepository;
		this.cuentaPagoService = cuentaPagoService;
		this.cuentaPagoItemService = cuentaPagoItemService;
		this.tasaRepository = tasaRepository;
		this.subTasaRepository = subTasaRepository;
	}

	async list() {
		return new Promise( async (resolve, reject) => {
			try {
				const result = await this.planPagoRepository.list();
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
                const result = await this.planPagoRepository.listByCuenta(idCuenta);
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
				let result = new PlanPagoDTO();
							
				result.planPago = await this.planPagoRepository.findById(id);
				if (!result.planPago) {
					reject(new ReferenceError('No existe el registro'));
					return;
				}
				const dto = await this.planPagoDefinicionService.findById(result.planPago.idPlanPagoDefinicion) as PlanPagoDefinicionDTO;
				result.planPagoDefinicion = dto.planPagoDefinicion as PlanPagoDefinicion;
				result.tipoPlanPago = result.planPagoDefinicion.tipoPlanPago;
				result.planPagoCuotas = (await this.planPagoCuotaRepository.listByPlanPago(result.planPago.id) as Array<PlanPagoCuota>).sort((a, b) => a.numero - b.numero);

				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async add(idUsuario: number, planPagoAdd: PlanPagoAdd) {
		const resultTransaction = this.planPagoRepository.onTransaction( async () => { 
			return new Promise( async (resolve, reject) => {
				try {
					if (
						!isValidInteger(planPagoAdd.idPlanPagoDefinicion, true) ||
						!isValidInteger(planPagoAdd.idCuenta, true) ||
						!isValidInteger(planPagoAdd.idTipoVinculoCuenta, true) ||
						!isValidInteger(planPagoAdd.idVinculoCuenta, true) ||
						!isValidInteger(planPagoAdd.cantidadCuotas, true)
					) {
						reject(new ValidationError('Existen campos incompletos'));
						return;
					}

					const validList = await this.planPagoDefinicionService.listByCuenta(planPagoAdd.idCuenta, planPagoAdd.items) as Array<PlanPagoDefinicionValid>;
					if (!validList.find(f => f.id === planPagoAdd.idPlanPagoDefinicion && f.valid)) {
						reject(new ValidationError('El plan de pagos no es compatible con los parámetros ingresados'));
						return;
					}

					const cuenta = await this.cuentaRepository.findById(planPagoAdd.idCuenta) as Cuenta;
					const dto = await this.planPagoDefinicionService.findById(planPagoAdd.idPlanPagoDefinicion) as PlanPagoDefinicionDTO;
					const planPagoDefinicion = dto.planPagoDefinicion as PlanPagoDefinicion;
					const planPagoDefinicionCuotas = await this.planPagoDefinicionService.listByCuotas(planPagoAdd.idPlanPagoDefinicion, planPagoAdd.idCuenta, planPagoAdd.items) as PlanPagoDefinicionCuotas;
					const opcionCuotas = planPagoDefinicionCuotas.opcionCuotas.find(f => f.cantidadCuotas === planPagoAdd.cantidadCuotas);

					const tipoVencimientoAnticipo = await this.tipoVencimientoPlanPagoRepository.findById(planPagoDefinicion.idTipoVencimientoAnticipo) as TipoVencimientoPlanPago;
					const tipoVencimientoCuota1 = await this.tipoVencimientoPlanPagoRepository.findById(planPagoDefinicion.idTipoVencimientoCuota1) as TipoVencimientoPlanPago;
					const tipoVencimientoCuotas = await this.tipoVencimientoPlanPagoRepository.findById(planPagoDefinicion.idTipoVencimientoCuotas) as TipoVencimientoPlanPago;
					const numero:number = await this.numeracionService.findByProximo("PlanPagoNumero") as number;


					let numeracionPartida = await this.numeracionService.findByNombre("CuentaCorrientePartida") as Numeracion;
					let numeroPartida = numeracionPartida.valorProximo;
					numeracionPartida.valorProximo = numeracionPartida.valorProximo += opcionCuotas.cuotas.length;
					await this.numeracionService.modifyByNombre("CuentaCorrientePartida", numeracionPartida);
					const partidas = opcionCuotas.cuotas.map(cuota => {
						return {
							numeroCuota: cuota.numeroCuota,
							numeroPartida: numeroPartida++
						}
					});
					
					let planPago = new PlanPago();
					planPago.numero = numero;
					planPago.idPlanPagoDefinicion = planPagoDefinicion.id;
					planPago.idTipoPlanPago = planPagoDefinicion.idTipoPlanPago;
					planPago.idTipoTributo = planPagoDefinicion.idTipoTributo;
					planPago.idSubTasaPlanPago = planPagoDefinicion.idSubTasaPlanPago;
					planPago.idSubTasaInteres = planPagoDefinicion.idSubTasaInteres;
					planPago.idSubTasaSellados = planPagoDefinicion.idSubTasaSellados;
					planPago.idSubTasaGastosCausidicos = planPagoDefinicion.idSubTasaGastosCausidicos;
					planPago.codigo = planPagoDefinicion.codigo;
					planPago.descripcion = planPagoDefinicion.descripcion;

					planPago.idCuenta = cuenta.id;
					planPago.idTributo = cuenta.idTributo;

					planPago.idTipoVinculoCuenta = planPagoAdd.idTipoVinculoCuenta;
					planPago.idVinculoCuenta = planPagoAdd.idVinculoCuenta;

					planPago.importeNominal = opcionCuotas.importeNominal;
					planPago.importeAccesorios = opcionCuotas.importeAccesorios;
					planPago.importeCapital = opcionCuotas.importeCapital;
					planPago.importeIntereses = opcionCuotas.importeIntereses;
					planPago.importeSellados = opcionCuotas.importeSellados;
					planPago.importeGastosCausidicos = 0; //TODO: falta resolver
					planPago.importeQuita = opcionCuotas.importeQuita;
					planPago.importeQuitaDevengar = (opcionCuotas.importeQuita / planPagoAdd.cantidadCuotas);
					planPago.importePlanPago = opcionCuotas.importePlanPago;

					planPago.idUsuarioFirmante = idUsuario;
					planPago.idUsuarioRegistro = idUsuario;
					planPago.fechaRegistro = getDateNow(true);

					planPago = await this.planPagoRepository.add(planPago);

					let request = [];
					opcionCuotas.cuotas.forEach(cuota => {
						let planPagoCuota = new PlanPagoCuota();
						planPagoCuota.idPlanPago = planPago.id;
						planPagoCuota.idEstadoPlanPagoCuota = PLAN_PAGO_CUOTA_STATE.PENDIENTE,
						planPagoCuota.esAnticipo = (cuota.numeroCuota === 0);
						planPagoCuota.numero = cuota.numeroCuota;
						planPagoCuota.importeCapital = cuota.importeCapital;
						planPagoCuota.importeIntereses = cuota.importeIntereses;
						planPagoCuota.importeSellados = cuota.importeSellados;
						planPagoCuota.importeGastosCausidicos = 0; //TODO: falta resolver
						planPagoCuota.importeCuota = cuota.importeCuota;

						const tipoVencimiento = (cuota.numeroCuota === 0) ? tipoVencimientoAnticipo : (cuota.numeroCuota === 1) ? tipoVencimientoCuota1 : tipoVencimientoCuotas;
						planPagoCuota.fechaVencimiento = this.processVencimiento(tipoVencimiento, planPagoDefinicion.peridiocidad, cuota.numeroCuota);

						request.push(this.planPagoCuotaRepository.add(planPagoCuota));
					});

					Promise.all(request)
					.then(responses => {
						this.addReciboCuentaCorriente(idUsuario, planPago.id, partidas, planPagoAdd.items)
						.then(responses => {
							this.addReciboPlanPago(planPago.id, partidas)
							.then(responses => {
								resolve(planPago);
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
	//se debe utilizar dentor de otra transaccion
	async addReciboPlanPago(id: number, partidas: any[]) {
		return new Promise( async (resolve, reject) => {
			try {
				const planPagoDTO = await this.findById(id) as PlanPagoDTO;
				const planPagoDefinicion = planPagoDTO.planPagoDefinicion as PlanPagoDefinicion;
				const planPago = planPagoDTO.planPago as PlanPago;
				const planPagoCuotas = planPagoDTO.planPagoCuotas as Array<PlanPagoCuota>;
				
				const subTasaPlanPago = await this.subTasaRepository.findById(planPagoDefinicion.idSubTasaPlanPago) as SubTasa;
				const codigoDelegacionRecibos:string = (await this.configuracionService.findByNombre('CuentaCorrienteCodigoDelegacionRecibos', true) as Configuracion).valor;
				
				const toDay = getDateNow(false);
				const periodo = toDay.getFullYear().toString();

				for (let index=0; index < planPagoCuotas.length; index++) {
					const cuota = planPagoCuotas[index];

					const numeroRecibo:number = await this.numeracionService.findByProximo("CuentaCorrienteRecibos") as number;
					
					const municipioPagoFacil:string = (await this.configuracionService.findByNombre("MunicipioPagoFacil") as Configuracion).valor;                
					const codigoBarras = GetNumeroCodigoBarras(
						municipioPagoFacil,
						getFormatNumber(cuota.importeCuota,2).toString().replace(',','').replace('.',''),
						cuota.fechaVencimiento.getFullYear().toString().substring(2),
						GetDayOfYear(cuota.fechaVencimiento).toString(),
						getFormatNumber(cuota.importeCuota,2).toString().replace(',','').replace('.',''),
						"0",
						codigoDelegacionRecibos,
						numeroRecibo.toString()
					);
					let cuentaPago = new CuentaPago(
						null, //id
						null, //idEmisionEjecucion
						planPago.id, //idPlanPago
						planPago.idCuenta,
						codigoDelegacionRecibos,
						numeroRecibo, //numeroMovimiento,
						periodo,
						cuota.numero,
						cuota.importeCuota,
						0,
						cuota.fechaVencimiento,
						null,
						codigoBarras,
						false, //pagoAnticipado
						false //reciboEspecial
					);
					//(*) no aplica
					cuentaPago = await this.cuentaPagoService.add(cuentaPago) as CuentaPago;

					const numeroPartidaPlanPago:number = partidas.find(f => f.numeroCuota == cuota.numero).numeroPartida;
					let cuentaPagoItem = new CuentaPagoItem(
						null, //id
						null, //idEmisionEjecucion,
						null, //idEmisionConceptoResultado
						cuota.id, //idPlanPagoCuota
						cuentaPago.id, //idCuentaPago
						planPago.idCuenta,
						subTasaPlanPago.idTasa,
						subTasaPlanPago.id,
						periodo,
						cuota.numero, //cuota
						cuota.importeCuota, //importeNominal = importeTotal
						0, 0, 0, 0, 0,
						cuota.importeCuota, //importeTotal
						cuota.importeCuota, //importeNeto = importeTotal
						0, //importeDescuento
						cuota.fechaVencimiento, //fechaVencimientoTermino
						null, //fechaCobro
						null, //idEdesurCliente,
						1, //item
						numeroPartidaPlanPago
					);
					cuentaPagoItem = await this.cuentaPagoItemService.add(cuentaPagoItem) as CuentaPagoItem;
				}

				resolve({idPlanPago: id});
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
	//se debe utilizar dentor de otra transaccion
	async addReciboCuentaCorriente(idUsuario: number, id: number, partidas: any[], items: CuentaCorrienteItemRecibo[]) {
		return new Promise( async (resolve, reject) => {
			try {
				const idTipoMovimientoCodigo12:number = (await this.tipoMovimientoService.findByCodigo('12') as TipoMovimiento).id; //PLAN DE PAGO
				const idTipoMovimientoCodigo63:number = (await this.tipoMovimientoService.findByCodigo('63') as TipoMovimiento).id; //CANCELADO POR CONVENIO
				// const idTipoMovimientoCodigo64:number = (await this.tipoMovimientoService.findByCodigo('64') as TipoMovimiento).id; //BONIFICADO POR CONVENIO
				// const idTipoMovimientoCodigo65:number = (await this.tipoMovimientoService.findByCodigo('65') as TipoMovimiento).id; //ACCESORIO GENERADO POR CONVENIO
				// const idTipoMovimientoCodigo67:number = (await this.tipoMovimientoService.findByCodigo('67') as TipoMovimiento).id; //DEUDA ORIGEN CONVENIO

				const planPagoDTO = await this.findById(id) as PlanPagoDTO;
				const planPago = planPagoDTO.planPago as PlanPago;
				const planPagoCuotas = planPagoDTO.planPagoCuotas as Array<PlanPagoCuota>;
				const planPagoDefinicion = planPagoDTO.planPagoDefinicion as PlanPagoDefinicion;
				const tipoPlanPago = planPagoDTO.tipoPlanPago as TipoPlanPago;

				const toDay = getDateNow(false);
				const toDayWithHour = getDateNow(true);
				const numeroConvenio = planPago.numero;

				// const idSubTasaHonorarios:string = (await this.configuracionService.findByNombre('CuentaCorrienteSubTasaHonorarios', true) as Configuracion).valor;
				// const idSubTasaAportes:string = (await this.configuracionService.findByNombre('CuentaCorrienteSubTasaAportes', true) as Configuracion).valor;
				// const idSubTasaRecargos:string = (await this.configuracionService.findByNombre('CuentaCorrienteSubTasaRecargos', true) as Configuracion).valor;

				// const subTasaHonorarios = await this.subTasaRepository.findById(parseInt(idSubTasaHonorarios)) as SubTasa;
				// const subTasaAportes = await this.subTasaRepository.findById(parseInt(idSubTasaAportes)) as SubTasa;
				// const subTasaRecargos = await this.subTasaRepository.findById(parseInt(idSubTasaRecargos)) as SubTasa;
				const subTasaPlanPago = await this.subTasaRepository.findById(planPagoDefinicion.idSubTasaPlanPago) as SubTasa;
				// const subTasaInteres = await this.subTasaRepository.findById(planPagoDefinicion.idSubTasaInteres) as SubTasa;

				// const cuentaCorrienteItemDeudaDTO = await this.cuentaCorrienteItemService.listByDeuda(planPago.idCuenta, false) as CuentaCorrienteItemDeudaDTO;
				// const itemsDeuda = cuentaCorrienteItemDeudaDTO.cuentaCorrienteItems as Array<CuentaCorrienteItemDeuda>;

				//Calculo de honorarios, aportes y recargo
				// let importeMultas = 0;
				// let importeRecargos = 0;
				// let importeHonorarios = 0;
				// let importeAportes = 0;
				// for (let index=0; index < itemsDeuda.length; index++) {
				// 	const item = itemsDeuda[index];
				// 	if (items.find(f => item.numeroPartida === f.numeroPartida)
				// 	) {
				// 		importeMultas += item.importeMultas;
				// 		importeRecargos += item.importeRecargos;
				// 		importeHonorarios += item.importeHonorarios;
				// 		importeAportes += item.importeAportes;
				// 	}
				// }

				//Cancelacion de la deuda original
				// let importeDeudaOriginal = 0;
				// let vencimientoOriginal = null;
				for (let index=0; index < items.length; index++) {
					const item = items[index];

					let filter = new CuentaCorrienteItemFilter();
					filter.idCuenta = planPago.idCuenta;
					filter.numeroPartida = item.numeroPartida;
					const cuentaCorrienteItems = (await this.cuentaCorrienteItemService.listByFilter(filter)) as Array<CuentaCorrienteItem>;
					
					if (cuentaCorrienteItems.length > 0) {
						const cuentaCorrienteBase = cuentaCorrienteItems[0]; //para tomar de base

						const itemMax = Math.max.apply(null, cuentaCorrienteItems.map(x => x.item));
						let importeDeuda = 0;
						cuentaCorrienteItems.forEach(itemDeuda => importeDeuda += (itemDeuda.importeDebe - itemDeuda.importeHaber));
						let itemCancelacion = new CuentaCorrienteItem();
						//campos copiados
						itemCancelacion.idCuenta = cuentaCorrienteBase.idCuenta;
						itemCancelacion.idEmisionEjecucion = cuentaCorrienteBase.idEmisionEjecucion;
						itemCancelacion.idCertificadoApremio = cuentaCorrienteBase.idCertificadoApremio;
						itemCancelacion.idTasa = cuentaCorrienteBase.idTasa;
						itemCancelacion.idSubTasa = cuentaCorrienteBase.idSubTasa;
						itemCancelacion.periodo = cuentaCorrienteBase.periodo;
						itemCancelacion.cuota = cuentaCorrienteBase.cuota;
						itemCancelacion.idTipoValor = cuentaCorrienteBase.idTipoValor;
						itemCancelacion.idLugarPago = cuentaCorrienteBase.idLugarPago;
						itemCancelacion.fechaOrigen = cuentaCorrienteBase.fechaOrigen;
						itemCancelacion.fechaVencimiento1 = cuentaCorrienteBase.fechaVencimiento1;
						itemCancelacion.fechaVencimiento2 = cuentaCorrienteBase.fechaVencimiento2;
						itemCancelacion.cantidad = cuentaCorrienteBase.cantidad;
						itemCancelacion.idEdesurCliente = cuentaCorrienteBase.idEdesurCliente;
						itemCancelacion.detalle = cuentaCorrienteBase.detalle;
						itemCancelacion.numeroPartida = cuentaCorrienteBase.numeroPartida;
						//campos reemplazados
						itemCancelacion.idEmisionCuentaCorrienteResultado = null;
						itemCancelacion.idPlanPago = planPago.id;
						itemCancelacion.idPlanPagoCuota = null;
						itemCancelacion.tasaCabecera = false;
						itemCancelacion.fechaMovimiento = toDay;
						itemCancelacion.idTipoMovimiento = idTipoMovimientoCodigo63; //Cancelado por Convenio
						itemCancelacion.importeDebe = 0;
						itemCancelacion.importeHaber = importeDeuda;
						itemCancelacion.codigoDelegacion = '00';
						itemCancelacion.numeroMovimiento = planPago.numero;
						itemCancelacion.item = (itemMax + 1);
						itemCancelacion.fechaRegistro = toDayWithHour;
						itemCancelacion.idUsuarioRegistro = idUsuario;

						await this.cuentaCorrienteItemService.add(itemCancelacion) as CuentaCorrienteItem;
						
						// importeDeudaOriginal += importeDeuda;
						// if (!vencimientoOriginal) vencimientoOriginal = cuentaCorrienteBase.fechaVencimiento2;
					}
				}

				// //agrupo todos los registros en una misma partida para la deuda consolidada
				// const numeroPartidaDeudaConsolidada:number = await this.numeracionService.findByProximo("CuentaCorrientePartida") as number;
				// //Cancelacion de la deuda consolidada
				// let itemMovimiento = new CuentaCorrienteItem();
				// itemMovimiento.numeroPartida = numeroPartidaDeudaConsolidada;
				// if (vencimientoOriginal > 0) {
				// 	itemMovimiento.idEmisionEjecucion = null;
				// 	itemMovimiento.idEmisionCuentaCorrienteResultado = null;
				// 	itemMovimiento.idPlanPago = planPago.id;
				// 	itemMovimiento.idPlanPagoCuota = null;
				// 	itemMovimiento.idCertificadoApremio = null;
				// 	itemMovimiento.idCuenta = planPago.idCuenta;
				// 	itemMovimiento.idTasa = subTasaPlanPago.idTasa;
				// 	itemMovimiento.idSubTasa = subTasaPlanPago.id;
				// 	itemMovimiento.periodo = numeroConvenio.toString();
				// 	itemMovimiento.cuota = -1;
				// 	itemMovimiento.codigoDelegacion = "00";
				// 	itemMovimiento.idTipoMovimiento = idTipoMovimientoCodigo67; //Deuda origen Convenio
				// 	itemMovimiento.numeroMovimiento = planPago.numero;
				// 	itemMovimiento.tasaCabecera = false;
				// 	itemMovimiento.idTipoValor = 320; //pesos
				// 	itemMovimiento.importeDebe = importeDeudaOriginal;
				// 	itemMovimiento.importeHaber = 0;
				// 	itemMovimiento.idLugarPago = null;
				// 	itemMovimiento.fechaOrigen = toDay;
				// 	itemMovimiento.fechaMovimiento = toDay;
				// 	itemMovimiento.fechaVencimiento1 = vencimientoOriginal;
				// 	itemMovimiento.fechaVencimiento2 = vencimientoOriginal;
				// 	itemMovimiento.cantidad = 0;
				// 	itemMovimiento.idEdesurCliente = null;
				// 	itemMovimiento.item = 0;
				// 	itemMovimiento.idUsuarioRegistro = idUsuario;
				// 	itemMovimiento.fechaRegistro = toDayWithHour;
				// 	await this.cuentaCorrienteItemService.add(itemMovimiento) as CuentaCorrienteItem;

				// 	itemMovimiento.idTipoMovimiento = idTipoMovimientoCodigo63; //Cancelado por Convenio
				// 	itemMovimiento.importeHaber = itemMovimiento.importeDebe;
				// 	itemMovimiento.importeDebe = 0;
				// 	await this.cuentaCorrienteItemService.add(itemMovimiento) as CuentaCorrienteItem;
				// }

				// //Cancelacion de honorarios, aportes y recargo
				// itemMovimiento.tasaCabecera = false;
				// itemMovimiento.fechaVencimiento1 = toDay;
				// itemMovimiento.fechaVencimiento2 = toDay;
				// itemMovimiento.cuota = -2;
				// if (importeHonorarios > 0) {
				// 	itemMovimiento.idTasa = subTasaHonorarios.idTasa;
				// 	itemMovimiento.idSubTasa = subTasaHonorarios.id;
				// 	itemMovimiento.cuota = -2;

				// 	itemMovimiento.idTipoMovimiento = idTipoMovimientoCodigo65; //Accesorio generado por Convenio
				// 	itemMovimiento.importeDebe = importeHonorarios;
				// 	itemMovimiento.importeHaber = 0;
				// 	await this.cuentaCorrienteItemService.add(itemMovimiento) as CuentaCorrienteItem;

				// 	itemMovimiento.idTipoMovimiento = idTipoMovimientoCodigo63; //Cancelado por Convenio
				// 	itemMovimiento.importeDebe = 0;
				// 	itemMovimiento.importeHaber = importeHonorarios;
				// 	await this.cuentaCorrienteItemService.add(itemMovimiento) as CuentaCorrienteItem;
				// }
				// if (importeAportes > 0) {
				// 	itemMovimiento.idTasa = subTasaAportes.idTasa;
				// 	itemMovimiento.idSubTasa = subTasaAportes.id;

				// 	itemMovimiento.idTipoMovimiento = idTipoMovimientoCodigo65; //Accesorio generado por Convenio
				// 	itemMovimiento.importeDebe = importeAportes;
				// 	itemMovimiento.importeHaber = 0;
				// 	await this.cuentaCorrienteItemService.add(itemMovimiento) as CuentaCorrienteItem;

				// 	itemMovimiento.idTipoMovimiento = idTipoMovimientoCodigo63; //Cancelado por Convenio
				// 	itemMovimiento.importeDebe = 0;
				// 	itemMovimiento.importeHaber = importeAportes;
				// 	await this.cuentaCorrienteItemService.add(itemMovimiento) as CuentaCorrienteItem;
				// }
				// if (importeRecargos > 0) {
				// 	itemMovimiento.idTasa = subTasaRecargos.idTasa;
				// 	itemMovimiento.idSubTasa = subTasaRecargos.id;

				// 	itemMovimiento.idTipoMovimiento = idTipoMovimientoCodigo65; //Accesorio generado por Convenio
				// 	itemMovimiento.importeDebe = importeRecargos;
				// 	itemMovimiento.importeHaber = 0;
				// 	await this.cuentaCorrienteItemService.add(itemMovimiento) as CuentaCorrienteItem;

				// 	itemMovimiento.idTipoMovimiento = idTipoMovimientoCodigo63; //Cancelado por Convenio
				// 	itemMovimiento.importeDebe = 0;
				// 	itemMovimiento.importeHaber = (importeRecargos / 2);
				// 	await this.cuentaCorrienteItemService.add(itemMovimiento) as CuentaCorrienteItem;

				// 	itemMovimiento.idTipoMovimiento = idTipoMovimientoCodigo64; //Bonificado por Convenio
				// 	itemMovimiento.importeDebe = 0;
				// 	itemMovimiento.importeHaber = (importeRecargos / 2);
				// 	await this.cuentaCorrienteItemService.add(itemMovimiento) as CuentaCorrienteItem;
				// }

				// //Cancelacion de interes financiero
				// itemMovimiento.cuota = -3;
				// if (planPago.importeIntereses > 0) {
				// 	itemMovimiento.idTasa = subTasaInteres.idTasa;
				// 	itemMovimiento.idSubTasa = subTasaInteres.id;

				// 	itemMovimiento.idTipoMovimiento = idTipoMovimientoCodigo65; //Accesorio generado por Convenio
				// 	itemMovimiento.importeDebe = planPago.importeIntereses;
				// 	itemMovimiento.importeHaber = 0;
				// 	await this.cuentaCorrienteItemService.add(itemMovimiento) as CuentaCorrienteItem;

				// 	itemMovimiento.idTipoMovimiento = idTipoMovimientoCodigo63; //Cancelado por Convenio
				// 	itemMovimiento.importeDebe = 0;
				// 	itemMovimiento.importeHaber = planPago.importeIntereses;
				// 	await this.cuentaCorrienteItemService.add(itemMovimiento) as CuentaCorrienteItem;
				// }

				//Movimientos por el propio Plan de Pagos
				if (planPagoCuotas.length > 0) {
					let itemMovimiento = new CuentaCorrienteItem();
					itemMovimiento.idEmisionEjecucion = null;
					itemMovimiento.idEmisionCuentaCorrienteResultado = null;
					itemMovimiento.idPlanPago = planPago.id;
					itemMovimiento.idPlanPagoCuota = null;
					itemMovimiento.idCertificadoApremio = null;
					itemMovimiento.idCuenta = planPago.idCuenta;
					itemMovimiento.idTasa = subTasaPlanPago.idTasa;
					itemMovimiento.idSubTasa = subTasaPlanPago.id;
					itemMovimiento.periodo = numeroConvenio.toString();
					itemMovimiento.codigoDelegacion = "00";
					itemMovimiento.idTipoMovimiento = idTipoMovimientoCodigo12; //Plan de Pago
					itemMovimiento.numeroMovimiento = planPago.numero;
					itemMovimiento.tasaCabecera = true;
					itemMovimiento.idTipoValor = 320; //pesos
					itemMovimiento.importeHaber = 0;
					itemMovimiento.idLugarPago = null;
					itemMovimiento.fechaOrigen = toDay;
					itemMovimiento.fechaMovimiento = toDay;
					itemMovimiento.cantidad = 0;
					itemMovimiento.idEdesurCliente = null;
					itemMovimiento.item = 0;
					itemMovimiento.idUsuarioRegistro = idUsuario;
					itemMovimiento.fechaRegistro = toDayWithHour;

					for(let index=0; index < planPagoCuotas.length; index++) {
						const planPagoCuota = planPagoCuotas[index];
						//cada cuota es una partida nueva
						const numeroPartidaPlanPago:number = partidas.find(f => f.numeroCuota == planPagoCuota.numero).numeroPartida;
						itemMovimiento.idPlanPagoCuota = planPagoCuota.id;
						itemMovimiento.cuota = planPagoCuota.numero;
						itemMovimiento.importeDebe = planPagoCuota.importeCuota;
						itemMovimiento.fechaVencimiento1 = planPagoCuota.fechaVencimiento;
						itemMovimiento.fechaVencimiento2 = planPagoCuota.fechaVencimiento;
						itemMovimiento.numeroPartida = numeroPartidaPlanPago;
						await this.cuentaCorrienteItemService.add(itemMovimiento) as CuentaCorrienteItem;
					}
				}

				resolve({idPlanPago: id});
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
	//se debe utilizar dentor de otra transaccion
	async cancelReciboCuentaCorriente(idUsuario: number, id: number) {
		return new Promise( async (resolve, reject) => {
			try {
				const idTipoMovimientoCodigo63:number = (await this.tipoMovimientoService.findByCodigo('63') as TipoMovimiento).id; //CANCELADO POR CONVENIO
				const idTipoMovimientoCodigo67:number = (await this.tipoMovimientoService.findByCodigo('67') as TipoMovimiento).id; //DEUDA ORIGEN CONVENIO

				const planPagoDTO = await this.findById(id) as PlanPagoDTO;
				const planPago = planPagoDTO.planPago as PlanPago;
				const planPagoCuotas = planPagoDTO.planPagoCuotas as Array<PlanPagoCuota>;
				const items = (await this.cuentaCorrienteItemService.listByPlanPago(id)) as Array<CuentaCorrienteItem>;
				const itemsCancelacion = items.filter(f => isNull(f.idPlanPagoCuota) && f.idTipoMovimiento === idTipoMovimientoCodigo63 && f.item > 0); //Cancelado por Convenio sobre deuda original (items > 0)

				const toDay = getDateNow(false);
				const toDayWithHour = getDateNow(true);

				//Movimientos de cancelacion por el propio Plan de Pagos
				let importePagado = 0;
				for(let index=0; index < planPagoCuotas.length; index++) {
					const planPagoCuota = planPagoCuotas[index];
					const itemMovimientoCuota = items.find(f => f.idPlanPagoCuota === planPagoCuota.id);
					if (planPagoCuota.idEstadoPlanPagoCuota === PLAN_PAGO_CUOTA_STATE.PAGADO) {
						importePagado += planPagoCuota.importeCuota;
					}
					else if (planPagoCuota.idEstadoPlanPagoCuota === PLAN_PAGO_CUOTA_STATE.CANCELADO) {
						let itemMovimiento = new CuentaCorrienteItem();
						itemMovimiento.setFromObject(itemMovimientoCuota);
						//campos reemplazados
						itemMovimiento.idTipoMovimiento = idTipoMovimientoCodigo67; //DEUDA ORIGEN CONVENIO
						itemMovimiento.tasaCabecera = false;
						itemMovimiento.fechaMovimiento = toDay;
						itemMovimiento.importeHaber = itemMovimiento.importeDebe;
						itemMovimiento.importeDebe = 0;
						itemMovimiento.idUsuarioRegistro = idUsuario;
						itemMovimiento.fechaRegistro = toDayWithHour;
						await this.cuentaCorrienteItemService.add(itemMovimiento) as CuentaCorrienteItem;
					}
				}

				//calculo de importe pagado NO capital
				const importePagadoNoCapital = (planPago.importeIntereses + planPago.importeAccesorios);
				//calculo de importe pagado capital
				let importePagadoCapital = (importePagado > importePagadoNoCapital) ?
										   (importePagado - importePagadoNoCapital) : 0;

				//Recuperacion de la deuda original
				for (let index=0; index < itemsCancelacion.length; index++) {
					const itemCancelacion = itemsCancelacion[index];

					if (importePagadoCapital < itemCancelacion.importeHaber) { //el capital pagado NO cubre esta deuda					
						let filter = new CuentaCorrienteItemFilter();
						filter.idCuenta = planPago.idCuenta;
						filter.numeroPartida = itemCancelacion.numeroPartida;
						const cuentaCorrienteItems = (await this.cuentaCorrienteItemService.listByFilter(filter)) as Array<CuentaCorrienteItem>;
						const itemMax = Math.max.apply(null, cuentaCorrienteItems.map(x => x.item));

						let itemRecuperacion = new CuentaCorrienteItem();
						itemRecuperacion.setFromObject(itemCancelacion);

						//campos reemplazados
						itemRecuperacion.idTipoMovimiento = idTipoMovimientoCodigo67; //DEUDA ORIGEN CONVENIO
						itemRecuperacion.fechaMovimiento = toDay;
						itemRecuperacion.importeDebe = (itemCancelacion.importeHaber - importePagadoCapital);
						itemRecuperacion.importeHaber = 0;
						itemRecuperacion.item = (itemMax + 1);
						itemRecuperacion.fechaRegistro = toDayWithHour;
						itemRecuperacion.idUsuarioRegistro = idUsuario;

						await this.cuentaCorrienteItemService.add(itemRecuperacion) as CuentaCorrienteItem;
					}

					importePagadoCapital = (importePagadoCapital > itemCancelacion.importeHaber) ?
										   (importePagadoCapital - itemCancelacion.importeHaber) : 0;
				}

				resolve({idPlanPago: id});
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

	async modify(id: number, planPago: PlanPago) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidInteger(planPago.idTipoPlanPago, true) ||
					!isValidInteger(planPago.idTipoTributo, true) ||
					!isValidInteger(planPago.idSubTasaPlanPago, true) ||
					!isValidInteger(planPago.idSubTasaInteres, true) ||
					!isValidInteger(planPago.idSubTasaSellados, true) ||
					!isValidInteger(planPago.idSubTasaGastosCausidicos, true) ||
					!isValidString(planPago.codigo, true) ||
					!isValidString(planPago.descripcion, true) ||
					!isValidInteger(planPago.numero, true) ||
					!isValidInteger(planPago.idPlanPagoDefinicion, true) ||
					!isValidInteger(planPago.idTributo, true) ||
					!isValidInteger(planPago.idCuenta, true) ||
					!isValidInteger(planPago.idTipoVinculoCuenta, true) ||
					!isValidInteger(planPago.idVinculoCuenta, true) ||
					!isValidFloat(planPago.importeNominal, true) ||
					!isValidFloat(planPago.importeAccesorios, true) ||
					!isValidFloat(planPago.importeCapital, true) ||
					!isValidFloat(planPago.importeIntereses, true) ||
					!isValidFloat(planPago.importeSellados, true) ||
					!isValidFloat(planPago.importeGastosCausidicos, true) ||
					!isValidFloat(planPago.importeQuita, true) ||
					!isValidFloat(planPago.importeQuitaDevengar, true) ||
					!isValidFloat(planPago.importePlanPago, true) ||
					!isValidInteger(planPago.idUsuarioFirmante, true) ||
					!isValidInteger(planPago.idUsuarioRegistro, true) ||
					!isValidDate(planPago.fechaRegistro, true)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				const result = await this.planPagoRepository.modify(id, planPago);
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

	async modifyCaducidad(idUsuario: number) {
        const resultTransaction = this.planPagoRepository.onTransaction( async () => {
            return new Promise( async (resolve, reject) => {
                try {
					const millisecondsXDay = 1000 * 60 * 60 * 24;
					const toDay = getDateNow(false);
					let cuotasPendientes = await this.planPagoCuotaRepository.listByPendiente() as Array<PlanPagoCuota>;
					cuotasPendientes.sort((a, b) => (a.idPlanPago === b.idPlanPago) ? a.numero - b.numero : a.idPlanPago - b.idPlanPago);

					let lastIdPlanPago = 0;
					let lastNumeroCuota = -1;
					let ultimaCuotaImpaga = false;
					let tieneAnticipoImpago = false;
					let tieneDiasVencimientoImpago = false;
					let tieneCuotasConsecutivasImpagas = false;
					let tieneCuotasNoConsecutivasImpagas = false;
					let cuotasConsecutivasImpagas = 0;
					let cuotasNoConsecutivasImpagas = 0;
					let planPago: PlanPago = null;
					let planPagoDefinicion: PlanPagoDefinicion = null;

					let planesPagoCaducados = [];
					for (let i=0; i < cuotasPendientes.length; i++) {
						const cuota = cuotasPendientes[i];

						//inicializaciones
						if (cuota.idPlanPago !== lastIdPlanPago) {
							lastNumeroCuota = -1;
							ultimaCuotaImpaga = false;
							tieneAnticipoImpago = false;
							tieneDiasVencimientoImpago = false;
							tieneCuotasConsecutivasImpagas = false;
							tieneCuotasNoConsecutivasImpagas = false;
							cuotasConsecutivasImpagas = 0;
							cuotasNoConsecutivasImpagas = 0;
							planPago = null;
							planPagoDefinicion = null;
						}
						if (!ultimaCuotaImpaga || (lastNumeroCuota + 1 !== cuota.numero)) cuotasConsecutivasImpagas = 0;

						//carga de datos
						if (planPago === null) {
							planPago = await this.planPagoRepository.findById(cuota.idPlanPago) as PlanPago;
							planPagoDefinicion = await this.planPagoDefinicionService.planPagoDefinicionRepository.findById(planPago.idPlanPagoDefinicion) as PlanPagoDefinicion;
						}

						 //verificacion de cuota vencida
						if (cuota.fechaVencimiento.getTime() < toDay.getTime()) {
							cuotasConsecutivasImpagas++;
							cuotasNoConsecutivasImpagas++;

							//anticipo impago
							if (planPagoDefinicion.caducidadAnticipoImpago && cuota.numero === 0) {
								tieneAnticipoImpago = true;
							}
							//cantidad maxima de dias vencidos superada
							const caducidadCantidadMilisegundosVencimiento = planPagoDefinicion.caducidadCantidadDiasVencimiento * millisecondsXDay;
							if (cuota.fechaVencimiento.getTime() + caducidadCantidadMilisegundosVencimiento < toDay.getTime()) {
								tieneDiasVencimientoImpago = true;
							}
							//cantidad de cuotas consecutivas impagas superada
							if (cuotasConsecutivasImpagas >= planPagoDefinicion.caducidadCantidadCuotasConsecutivas) {
								tieneCuotasConsecutivasImpagas = true;
							}
							//cantidad de cuotas NO consecutivas impagas superada
							if (cuotasNoConsecutivasImpagas >= planPagoDefinicion.caducidadCantidadCuotasNoConsecutivas) {
								tieneCuotasNoConsecutivasImpagas = true;
							}

							ultimaCuotaImpaga = true;
						}
						else {
							cuotasConsecutivasImpagas = 0;
							ultimaCuotaImpaga = false;
						}
						
						//registro de caducidad (verifica cuando cambia el corte plan de pago o en el ultimo registro)
						if ((i + 1 === cuotasPendientes.length) || (cuota.idPlanPago !== cuotasPendientes[i + 1].idPlanPago)) {
							if (tieneAnticipoImpago || tieneDiasVencimientoImpago || tieneCuotasConsecutivasImpagas || tieneCuotasNoConsecutivasImpagas) {
								planesPagoCaducados.push({
									idPlanPago: cuota.idPlanPago,
									tieneAnticipoImpago: tieneAnticipoImpago,
									tieneDiasVencimientoImpago: tieneDiasVencimientoImpago,
									tieneCuotasConsecutivasImpagas: tieneCuotasConsecutivasImpagas,
									tieneCuotasNoConsecutivasImpagas: tieneCuotasNoConsecutivasImpagas
								});
							}
						}
						
						lastIdPlanPago = cuota.idPlanPago;
						lastNumeroCuota = cuota.numero;
					}

					let requests = [];
					planesPagoCaducados.forEach(planPagoCaducado => {
						const proceso = new Proceso(
							null,
							uuidv4(),
							`PlanPago:${planPagoCaducado.idPlanPago}`,
							null,
							PROCESO_STATE.PENDIENTE,
							null,
							null,
							null,
							"Caducidad de Plan de Pago",
							"",
							0,
							"plan-pago-service",
							idUsuario,
							getDateNow(true),
							`DELETE|${config.DOMAIN}:${config.PORT}/api/plan-pago|/${planPagoCaducado.idPlanPago}/caducidad`
						);
						requests.push(this.procesoService.add(proceso));
					});

					Promise.all(requests)
					.then(response => {
						resolve(planesPagoCaducados);
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

	async removeCaducidad(idUsuario: number, id: number) {
		const resultTransaction = this.planPagoRepository.onTransaction( async () => {
			return new Promise( async (resolve, reject) => {
				try {
					let planPagoDTO = await this.findById(id) as PlanPagoDTO;

					let requests = [];
					planPagoDTO.planPagoCuotas.forEach(cuota => {
						if (cuota.idEstadoPlanPagoCuota === PLAN_PAGO_CUOTA_STATE.PENDIENTE) {
							cuota.idEstadoPlanPagoCuota = PLAN_PAGO_CUOTA_STATE.CANCELADO;
							requests.push(this.planPagoCuotaRepository.modify(cuota.id, cuota));
						}
					});

					Promise.all(requests)
					.then(async responses => {
						this.cancelReciboCuentaCorriente(idUsuario, id)
						.then(response => resolve(planPagoDTO.planPago))
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
		return new Promise( async (resolve, reject) => {
			try {
				const result = await this.planPagoRepository.remove(id);
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

	processVencimiento(tipoVencimientoPlanPago: TipoVencimientoPlanPago, peridiocidad: number, numeroCuota: number) {
		const toDay = getDateNow(false);
		//tomo el mes de base
		const baseMes = toDay.getMonth() + (peridiocidad * numeroCuota) + tipoVencimientoPlanPago.meses;
		//tomo el dia de base
		const baseDia = (tipoVencimientoPlanPago.baseDiaActual) ? toDay.getDate() :
						(tipoVencimientoPlanPago.baseDiaFinMes) ? GetLastDayMonth(new Date(toDay.getFullYear(), baseMes, 1)) : 1;
		//fecha base
		let fecha = new Date(toDay.getFullYear(), baseMes, baseDia);
		//sumo dias
		if (tipoVencimientoPlanPago.dias > 0) {
			fecha.setDate(0);
			if (tipoVencimientoPlanPago.habiles) {
				let diasHabiles = tipoVencimientoPlanPago.dias;
				while (diasHabiles > 0) {
					fecha = AddDays(fecha, 1);
					if ([1,2,3,4,5].includes(fecha.getDay())) {
						diasHabiles--;
					}
				}
			}
			else {
				fecha = AddDays(fecha, tipoVencimientoPlanPago.dias);
			}
		}
		//corrimiento proximo dia habil
		if (tipoVencimientoPlanPago.proximoHabil) {
			while (![1,2,3,4,5].includes(fecha.getDay())) {
				fecha = AddDays(fecha, 1);
			}
		}
		//corrimiento antrerior dia habil
		if (tipoVencimientoPlanPago.proximoHabil) {
			while (![1,2,3,4,5].includes(fecha.getDay())) {
				fecha = AddDays(fecha, -1);
			}
		}

		return fecha;
	}

}
