import NumeracionService from './numeracion-service';
import ConfiguracionService from './configuracion-service';
import ICuentaPagoRepository from '../repositories/cuenta-pago-repository';
import CuentaPagoItemService from './cuenta-pago-item-service';

import CuentaPago from '../entities/cuenta-pago';
import CuentaPagoItem from '../entities/cuenta-pago-item';
import Configuracion from '../entities/configuracion';

import { isValidInteger, isValidString,  } from '../../infraestructure/sdk/utils/validator';
import ValidationError from '../../infraestructure/sdk/error/validation-error';
import ProcessError from '../../infraestructure/sdk/error/process-error';
import ReferenceError from '../../infraestructure/sdk/error/reference-error';
import { getDateNow, getFormatNumber } from '../../infraestructure/sdk/utils/convert';
import { GetDayOfYear, GetNumeroCodigoBarras } from '../../infraestructure/sdk/utils/helper';
import Numeracion from '../entities/numeracion';

export default class CuentaPagoService {

	configuracionService: ConfiguracionService;
	numeracionService: NumeracionService;
	cuentaPagoRepository: ICuentaPagoRepository;
	cuentaPagoItemService: CuentaPagoItemService;

	constructor(configuracionService: ConfiguracionService,
				numeracionService: NumeracionService,
				cuentaPagoRepository: ICuentaPagoRepository,
				cuentaPagoItemService: CuentaPagoItemService)
	{
		this.configuracionService = configuracionService;
        this.numeracionService = numeracionService;
		this.cuentaPagoRepository = cuentaPagoRepository;
		this.cuentaPagoItemService = cuentaPagoItemService;
	}

	async list() {
		return new Promise( async (resolve, reject) => {
			try {
				const result = await this.cuentaPagoRepository.list();
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async listByEmisionEjecucion(idEmisionEjecucion: number) {
		return new Promise( async (resolve, reject) => {
			try {
				const result = await this.cuentaPagoRepository.listByEmisionEjecucion(idEmisionEjecucion);
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
				const result = await this.cuentaPagoRepository.listByPlanPago(idPlanPago);
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
				const result = await this.cuentaPagoRepository.findById(id);
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

	async add(cuentaPago: CuentaPago) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidInteger(cuentaPago.idCuenta, true) ||
					!isValidString(cuentaPago.codigoDelegacion, true) ||
					!isValidInteger(cuentaPago.numeroRecibo, true) ||
					!isValidString(cuentaPago.periodo, false) ||
					!isValidInteger(cuentaPago.cuota, false)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				cuentaPago.id = null;
				const result = await this.cuentaPagoRepository.add(cuentaPago);
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async addAnticipado(idCuenta: number, cuentaPagoItems: Array<CuentaPagoItem>) {
		const resultTransaction = this.cuentaPagoRepository.onTransaction( async () => { 
			return new Promise( async (resolve, reject) => {
				try {
					if (
						!isValidInteger(idCuenta, true) ||
						cuentaPagoItems.length === 0
					) {
						reject(new ValidationError('Existen campos incompletos'));
						return;
					}

					const codigoDelegacionRecibos:string = (await this.configuracionService.findByNombre('CuentaCorrienteCodigoDelegacionRecibos', true) as Configuracion).valor;
					const numeroRecibo:number = await this.numeracionService.findByProximo("CuentaCorrienteRecibos") as number;

					let numeracionPartida = await this.numeracionService.findByNombre("CuentaCorrientePartida") as Numeracion;
					let numeroPartida = numeracionPartida.valorProximo;
					numeracionPartida.valorProximo = numeracionPartida.valorProximo += cuentaPagoItems.length;
					await this.numeracionService.modifyByNombre("CuentaCorrientePartida", numeracionPartida);

					const toDay = getDateNow(false);
					const fechaVencimientoTermino = toDay;

					let indexCuentaPagoItem = 0;
					let cuentaPago: CuentaPago = null;
					for (let index=0; index < cuentaPagoItems.length; index++) {

						let item = cuentaPagoItems[index] as CuentaPagoItem;

						if (index === 0) {
							cuentaPago = new CuentaPago(
								null, //id
								null, //idEmisionEjecucion
								null, //idPlanPago
								idCuenta,
								codigoDelegacionRecibos,
								numeroRecibo, //numeroMovimiento,
								toDay.getFullYear().toString(), //periodo
								0, //cuota (*)
								0,
								0,
								fechaVencimientoTermino,
								null,
								"",
								true, //pagoAnticipado
								false //reciboEspecial
							);
							//(*) no se pone este dato porque no incluye uno especifico, esto se informa en el detalle)
							cuentaPago = await this.add(cuentaPago) as CuentaPago;
						}
						indexCuentaPagoItem++;

						let cuentaPagoItem = new CuentaPagoItem(
							null, //id
							null, //idEmisionEjecucion,
							null, //idEmisionConceptoResultado
							null, //idPlanPagoCuota
							cuentaPago.id, //idCuentaPago
							idCuenta,
							item.idTasa,
							item.idSubTasa,
							item.periodo,
							item.cuota,
							item.importeNominal,
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
					cuentaPago = await this.modify(cuentaPago.id, cuentaPago) as CuentaPago;

					resolve({idCuentaPago: cuentaPago.id});
				}
				catch(error) {
					reject(new ProcessError('Error procesando datos', error));
				}
			});
		});
		return resultTransaction;
	}

	async addByBloque(rows: Array<CuentaPago>) {
		return new Promise( async (resolve, reject) => {
			try {
				const result = await this.cuentaPagoRepository.addByBloque(rows);
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async modify(id: number, cuentaPago: CuentaPago) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidInteger(cuentaPago.idCuenta, true) ||
					!isValidString(cuentaPago.codigoDelegacion, true) ||
					!isValidInteger(cuentaPago.numeroRecibo, true) ||
					!isValidString(cuentaPago.periodo, false) ||
					!isValidInteger(cuentaPago.cuota, false)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				const result = await this.cuentaPagoRepository.modify(id, cuentaPago);
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
				const result = await this.cuentaPagoRepository.remove(id);
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

}
