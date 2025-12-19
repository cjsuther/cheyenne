import ProcesoService from './proceso-service';
import PagoContadoDefinicionService from './pago-contado-definicion-service';
import CuentaCorrienteItemService from './cuenta-corriente-item-service';
import ICuentaRepository from '../repositories/cuenta-repository';
import ConfiguracionService from './configuracion-service';
import NumeracionService from './numeracion-service';
import CuentaPagoService from './cuenta-pago-service';
import CuentaPagoItemService from './cuenta-pago-item-service';
import ITasaRepository from '../repositories/tasa-repository';
import ISubTasaRepository from '../repositories/sub-tasa-repository';

import PagoContadoAdd from '../dto/pago-contado-add';
import PagoContadoDefinicion from '../entities/pago-contado-definicion';
import CuentaPago from "../entities/cuenta-pago";
import CuentaPagoItem from "../entities/cuenta-pago-item";
import Configuracion from '../entities/configuracion';

import { isValidInteger } from '../../infraestructure/sdk/utils/validator';
import { getDateNow, getFormatNumber } from '../../infraestructure/sdk/utils/convert';
import ValidationError from '../../infraestructure/sdk/error/validation-error';
import ProcessError from '../../infraestructure/sdk/error/process-error';
import { GetDayOfYear, GetNumeroCodigoBarras } from '../../infraestructure/sdk/utils/helper';
import CuentaCorrienteItemDeuda from '../dto/cuenta-corriente-item-deuda';
import CuentaCorrienteItemDeudaDTO from '../dto/cuenta-corriente-item-deuda-dto';
import PagoContadoDefinicionValid from '../dto/pago-contado-definicion-valid';
import IPagoContadoDefinicionRepository from '../repositories/pago-contado-definicion-repository';


export default class PagoContadoService {

	pagoContadoDefinicionRepository: IPagoContadoDefinicionRepository;
	pagoContadoDefinicionService: PagoContadoDefinicionService;
	configuracionService: ConfiguracionService;
	numeracionService: NumeracionService;
	procesoService: ProcesoService;
	cuentaCorrienteItemService: CuentaCorrienteItemService;
	cuentaRepository: ICuentaRepository;
	cuentaPagoService: CuentaPagoService;
	cuentaPagoItemService: CuentaPagoItemService;
	tasaRepository: ITasaRepository;
	subTasaRepository: ISubTasaRepository;

	constructor(pagoContadoDefinicionRepository: IPagoContadoDefinicionRepository,
				pagoContadoDefinicionService: PagoContadoDefinicionService,
				configuracionService: ConfiguracionService,
				numeracionService: NumeracionService,
				procesoService: ProcesoService,
				cuentaCorrienteItemService: CuentaCorrienteItemService,
				cuentaRepository: ICuentaRepository,
				cuentaPagoService: CuentaPagoService,
				cuentaPagoItemService: CuentaPagoItemService,
				tasaRepository: ITasaRepository,
				subTasaRepository: ISubTasaRepository)
	{
		this.pagoContadoDefinicionRepository = pagoContadoDefinicionRepository;
		this.pagoContadoDefinicionService = pagoContadoDefinicionService;
		this.configuracionService = configuracionService;
		this.numeracionService = numeracionService;
		this.procesoService = procesoService;
		this.cuentaCorrienteItemService = cuentaCorrienteItemService;
		this.cuentaRepository = cuentaRepository;
		this.cuentaPagoService = cuentaPagoService;
		this.cuentaPagoItemService = cuentaPagoItemService;
		this.tasaRepository = tasaRepository;
		this.subTasaRepository = subTasaRepository;
	}

	async add(idUsuario: number, pagoContadoAdd: PagoContadoAdd) {
		const resultTransaction = this.pagoContadoDefinicionRepository.onTransaction( async () => { 
			return new Promise( async (resolve, reject) => {
				try {
					if (
						!isValidInteger(pagoContadoAdd.idPagoContadoDefinicion, true) ||
						!isValidInteger(pagoContadoAdd.idCuenta, true)
					) {
						reject(new ValidationError('Existen campos incompletos'));
						return;
					}

					const validList = await this.pagoContadoDefinicionService.listByCuenta(pagoContadoAdd.idCuenta, pagoContadoAdd.items) as Array<PagoContadoDefinicionValid>;
					if (!validList.find(f => f.id === pagoContadoAdd.idPagoContadoDefinicion && f.valid)) {
						reject(new ValidationError('El recibo especial no es compatible con los parámetros ingresados'));
						return;
					}

					const toDay = getDateNow(false);
					const fechaVencimientoTermino = toDay;
					const cuentaCorrienteItemDeudaDTO = await this.cuentaCorrienteItemService.listByDeuda(pagoContadoAdd.idCuenta, false, fechaVencimientoTermino) as CuentaCorrienteItemDeudaDTO;
					const cuentaCorrienteItems = cuentaCorrienteItemDeudaDTO.cuentaCorrienteItems as Array<CuentaCorrienteItemDeuda>;
					const items = pagoContadoAdd.items;

					const pagoContadoDefinicion = await this.pagoContadoDefinicionRepository.findById(pagoContadoAdd.idPagoContadoDefinicion) as PagoContadoDefinicion;

					const codigoDelegacionPagoContado:string = (await this.configuracionService.findByNombre('CuentaCorrienteCodigoDelegacionPagoContado', true) as Configuracion).valor;
					const numeroRecibo:number = await this.numeracionService.findByProximo("CuentaCorrienteRecibosPagoContado") as number;

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
									null, //idPagoContado
									item.idCuenta,
									codigoDelegacionPagoContado,
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

							const importeQuitaRecargos = (item.importeRecargos * pagoContadoDefinicion.porcentajeQuitaRecargos / 100);
							const importeQuitaMultaInfracciones = (item.importeMultas * pagoContadoDefinicion.porcentajeQuitaMultaInfracciones / 100);
							const importeQuitaHonorarios = (item.importeHonorarios * pagoContadoDefinicion.porcentajeQuitaHonorarios / 100);		
							const importeQuitaAportes = (item.importeAportes * pagoContadoDefinicion.porcentajeQuitaAportes / 100);
							const importeQuita = (importeQuitaRecargos + importeQuitaMultaInfracciones + importeQuitaHonorarios + importeQuitaAportes);

							let cuentaPagoItem = new CuentaPagoItem(
								null, //id
								null, //idEmisionEjecucion,
								null, //idEmisionConceptoResultado
								null, //idPagoContadoCuota
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
								(item.importeTotal - importeQuita),
								(item.importeTotal - importeQuita), //importeNeto = importeTotal
								importeQuita,
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
					reject(new ProcessError('Error procesando datos', error));
				}
			});
		});
		return resultTransaction;
	}

}
