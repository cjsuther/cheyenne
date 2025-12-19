import { v4 as uuidv4 } from 'uuid';
import Caja from '../entities/caja';
import ICajaRepository from '../repositories/caja-repository';
import { isValidString, isValidInteger, isValidFloat,  } from '../../infraestructure/sdk/utils/validator';
import ValidationError from '../../infraestructure/sdk/error/validation-error';
import ProcessError from '../../infraestructure/sdk/error/process-error';
import ReferenceError from '../../infraestructure/sdk/error/reference-error';
import MovimientoCobranzaDto from '../dto/movimiento-cobranza-dto';
import CajaAsignacionService from './caja-asignacion-service';
import CajaAsignacion from '../entities/caja-asignacion';
import { getDateNow, precisionRound, truncateTime } from '../../infraestructure/sdk/utils/convert';
import MovimientoCajaService from './movimiento-caja-service';
import MovimientoMedioPagoService from './movimiento-medio-pago-service';
import MovimientoReciboPublicacionService from './movimiento-recibo-publicacion-service';
import MovimientoCaja from '../entities/movimiento-caja';
import ReciboPublicacion from '../entities/recibo-publicacion';
import ReciboPublicacionService from './recibo-publicacion-service';
import MovimientoReciboPublicacion from '../entities/movimiento-recibo-publicacion';
import { ESTADOS_CAJA } from '../../infraestructure/sdk/consts/estadoCaja';
import { TIPO_MOVIMIENTO_CAJA } from '../../infraestructure/sdk/consts/tipoMovimientoCaja';
import { MEDIO_PAGO } from '../../infraestructure/sdk/consts/medioPago';
import CajaDto from '../dto/caja-dto';
import MovimientoCajaDto from '../dto/movimiento-caja-dto';
import Recaudacion from '../entities/recaudacion';
import RecaudacionLote from '../entities/recaudacion-lote';
import { ORIGEN_RECAUDACION } from '../../infraestructure/sdk/consts/origenRecaudacion';
import { distinctArray, getNumeroRecibo_ObjectToIdentificador } from '../../infraestructure/sdk/utils/helper';
import RecaudacionLoteService from './recaudacion-lote-service';
import RecaudacionService from './recaudacion-service';
import MovimientoMedioPago from '../entities/movimiento-medio-pago';

export default class CajaService {

	cajaRepository: ICajaRepository;
	cajaAsignacionService: CajaAsignacionService;
	movimientoCajaService: MovimientoCajaService;
	movimientoMedioPagoService: MovimientoMedioPagoService;
	movimientoReciboPublicacionService: MovimientoReciboPublicacionService;
	reciboPublicacionService: ReciboPublicacionService;
	recaudacionLoteService: RecaudacionLoteService;
	recaudacionService: RecaudacionService;

	constructor(cajaRepository: ICajaRepository,
				cajaAsignacionService: CajaAsignacionService,
				movimientoCajaService: MovimientoCajaService,
				movimientoMedioPagoService: MovimientoMedioPagoService,
				movimientoReciboPublicacionService: MovimientoReciboPublicacionService,
				reciboPublicacionService: ReciboPublicacionService,
				recaudacionLoteService: RecaudacionLoteService,
				recaudacionService: RecaudacionService) {
		this.cajaRepository = cajaRepository;
		this.cajaAsignacionService = cajaAsignacionService;
		this.movimientoCajaService = movimientoCajaService;
		this.movimientoMedioPagoService = movimientoMedioPagoService;
		this.movimientoReciboPublicacionService = movimientoReciboPublicacionService;
		this.reciboPublicacionService = reciboPublicacionService;
		this.recaudacionLoteService = recaudacionLoteService;
		this.recaudacionService = recaudacionService;
	}

	async list() {
		return new Promise( async (resolve, reject) => {
			try {
				const result = await this.cajaRepository.list();
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async listByDependencia(idDependencia: number) {
		return new Promise( async (resolve, reject) => {
			try {			   
				const result = await this.cajaRepository.listByDependencia(idDependencia);
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

	async listCierreTesoreria() {
		return new Promise( async (resolve, reject) => {
			try {			   
				const cajaAsignaciones = await this.cajaAsignacionService.listCierreTesoreria() as CajaAsignacion[];
				const cajas = cajaAsignaciones.map(cajaAsignacion => {
					const caja = cajaAsignacion.caja;
					caja.idCajaAsignacionActual = null;
					cajaAsignacion.caja = null;
					caja.cajaAsignacion = cajaAsignacion;
					return caja;
				}) as Caja[];

				resolve(cajas);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async findById(id: number) {
		return new Promise( async (resolve, reject) => {
			try {			   
				const result = await this.cajaRepository.findById(id);
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

	async findByUsuario(idUsuario: number) {
		return new Promise( async (resolve, reject) => {
			try {			   
				const result = await this.cajaRepository.findByUsuario(idUsuario);
				if (result) {
					resolve(result);
				}
				else {
					resolve(new Caja());
				}
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async findResumenById(id: number) {
		return new Promise( async (resolve, reject) => {
			try {			   
				const caja = await this.cajaRepository.findById(id);
				if (!caja) {
					reject(new ReferenceError('No existe el registro'));
					return;
				}

				let cajaAsignacionActual:CajaAsignacion = null;
				const movimientosDto:MovimientoCajaDto[] = [];
				if (caja.idCajaAsignacionActual) {
					cajaAsignacionActual = await this.cajaAsignacionService.findById(caja.idCajaAsignacionActual) as CajaAsignacion;
					const movimientos = await this.movimientoCajaService.listByCajaAsignacion(cajaAsignacionActual.id) as MovimientoCaja[];
					for (let m=0; m<movimientos.length; m++) {
						const movimiento = movimientos[m];
						const mediosPagoXmovimiento = await this.movimientoMedioPagoService.listByMovimientoCaja(movimiento.id) as MovimientoMedioPago[];
						const recibosXmovimiento = await this.movimientoReciboPublicacionService.listByMovimientoCaja(movimiento.id) as MovimientoReciboPublicacion[];
						const recibos:ReciboPublicacion[] = [];
						for (let r=0; r<recibosXmovimiento.length; r++) {
							const recibo = await this.reciboPublicacionService.findById(recibosXmovimiento[r].idReciboPublicacion) as ReciboPublicacion;
							recibos.push(recibo);
						}
						const movimientoDto = new MovimientoCajaDto();
						movimientoDto.setFromObject(movimiento);
						movimientoDto.mediosPagos = mediosPagoXmovimiento;
						movimientoDto.recibos = recibos;
						movimientosDto.push(movimientoDto);
					}
				}
				else {
					cajaAsignacionActual = new CajaAsignacion();
				}

				const cajaDto = new CajaDto();
				cajaDto.caja = caja;
				cajaDto.asignacion = cajaAsignacionActual;
				cajaDto.movimientos = movimientosDto;

				resolve(cajaDto);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async listCajaAsignacion() {
		return new Promise( async (resolve, reject) => {
			try {
				const result = await this.cajaAsignacionService.list();
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async listCajaAsignacionByIdCaja(idCaja: number) {
		return new Promise( async (resolve, reject) => {
			try {
				const result = await this.cajaAsignacionService.listByCaja(idCaja);
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async findResumenByCajaAsignacion(idCajaAsignacion: number) {
		return new Promise( async (resolve, reject) => {
			try {			   
				const cajaAsignacion = await this.cajaAsignacionService.findById(idCajaAsignacion) as CajaAsignacion;
				if (!cajaAsignacion) {
					reject(new ReferenceError('No existe el registro'));
					return;
				}
				const caja = await this.cajaRepository.findById(cajaAsignacion.idCaja);
				if (!caja) {
					reject(new ReferenceError('No existe el registro'));
					return;
				}

				const movimientosDto:MovimientoCajaDto[] = [];
				const movimientos = await this.movimientoCajaService.listByCajaAsignacion(cajaAsignacion.id) as MovimientoCaja[];
				for (let m=0; m<movimientos.length; m++) {
					const movimiento = movimientos[m];
					const mediosPagoXmovimiento = await this.movimientoMedioPagoService.listByMovimientoCaja(movimiento.id) as MovimientoMedioPago[];
					const recibosXmovimiento = await this.movimientoReciboPublicacionService.listByMovimientoCaja(movimiento.id) as MovimientoReciboPublicacion[];
					const recibos:ReciboPublicacion[] = [];
					for (let r=0; r<recibosXmovimiento.length; r++) {
						const recibo = await this.reciboPublicacionService.findById(recibosXmovimiento[r].idReciboPublicacion) as ReciboPublicacion;
						recibos.push(recibo);
					}
					const movimientoDto = new MovimientoCajaDto();
					movimientoDto.setFromObject(movimiento);
					movimientoDto.mediosPagos = mediosPagoXmovimiento;
					movimientoDto.recibos = recibos;
					movimientosDto.push(movimientoDto);
				}

				const cajaDto = new CajaDto();
				cajaDto.caja = caja;
				cajaDto.asignacion = cajaAsignacion;
				cajaDto.movimientos = movimientosDto;

				resolve(cajaDto);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async add(caja: Caja) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidString(caja.codigo, true) ||
					!isValidString(caja.nombre, true) ||
					!isValidInteger(caja.orden, true) ||
					!isValidInteger(caja.idDependencia, true) ||
					!isValidInteger(caja.idRecaudadora, true)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				caja.id = null;
				caja.idEstadoCaja = ESTADOS_CAJA.INACTIVA;
				caja.idUsuarioActual = null;
				caja.idCajaAsignacionActual = null;
				const result = await this.cajaRepository.add(caja);
				resolve(result);
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async modify(id: number, caja: Caja) {
		return new Promise( async (resolve, reject) => {
			try {
				if (
					!isValidString(caja.codigo, true) ||
					!isValidString(caja.nombre, true) ||
					!isValidInteger(caja.orden, true) ||
					!isValidInteger(caja.idEstadoCaja, true) ||
					!isValidInteger(caja.idDependencia, true) ||
					!isValidInteger(caja.idRecaudadora, true)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				const cajaOriginal = await this.findById(id) as Caja;
				if (cajaOriginal.idEstadoCaja === ESTADOS_CAJA.ABIERTA) {
					reject(new ValidationError('No se puede editar una caja abierta'));
					return;
				}
				if (!(cajaOriginal.idEstadoCaja === caja.idEstadoCaja ||
					  cajaOriginal.idEstadoCaja === ESTADOS_CAJA.INACTIVA && caja.idEstadoCaja === ESTADOS_CAJA.CERRADA ||
					  cajaOriginal.idEstadoCaja === ESTADOS_CAJA.CERRADA && caja.idEstadoCaja === ESTADOS_CAJA.INACTIVA)) {
					reject(new ValidationError('Cambio de estado no permitido')); //los cambios permitidos son entre cerrada e inactiva
					return;
				}

				//estos campos no se actualizan directamente
				caja.idUsuarioActual = cajaOriginal.idUsuarioActual;
				caja.idCajaAsignacionActual = cajaOriginal.idCajaAsignacionActual;

				const result = await this.cajaRepository.modify(id, caja);
				if (!result) {
					reject(new ReferenceError('No existe el registro'));
					return;
				}
				resolve(result);
			}
			catch(error) {
				if (error instanceof ReferenceError) {
					reject(error);
				}
				else {
					reject(new ProcessError('Error procesando datos', error));
				}
			}
		});
	}

	async modifyApertura(id: number, idUsuario: number) {
		const resultTransaction = this.cajaRepository.onTransaction( async () => { 
			return new Promise( async (resolve, reject) => {
				try {
					if (!isValidInteger(id, true) ||
						!isValidInteger(idUsuario, true)
					) {
						reject(new ValidationError('Existen campos incompletos'));
						return;
					}

					let caja = await this.findById(id) as Caja;
					if (!caja) {
						reject(new ReferenceError('No existe la caja'));
						return;
					}
					if (caja.idEstadoCaja === ESTADOS_CAJA.ABIERTA) {
						reject(new ValidationError('La caja ya está abierta'));
						return;
					}
					else if (caja.idEstadoCaja === ESTADOS_CAJA.INACTIVA) {
						reject(new ValidationError('La caja está inactiva'));
						return;
					}

					let cajaAsignacionActual:CajaAsignacion = null;
					if (caja.idCajaAsignacionActual) {
						cajaAsignacionActual = await this.cajaAsignacionService.findById(caja.idCajaAsignacionActual) as CajaAsignacion;
						if (!cajaAsignacionActual.fechaCierre) {
							reject(new ValidationError('La caja tiene un cierre pendiente'));
							return;
						}
					}
					else {
						cajaAsignacionActual = new CajaAsignacion();
					}

					let cajaAsignacionNuevo = new CajaAsignacion();
					cajaAsignacionNuevo.idCaja = caja.id;
					cajaAsignacionNuevo.idUsuario = idUsuario;
					cajaAsignacionNuevo.fechaApertura = getDateNow(true);
					cajaAsignacionNuevo.fechaCierre = null;
					cajaAsignacionNuevo.importeSaldoInicial = cajaAsignacionActual.importeSaldoFinal;
					cajaAsignacionNuevo.importeSaldoFinal = 0;
					cajaAsignacionNuevo.idRecaudacionLote = null;
					cajaAsignacionNuevo = await this.cajaAsignacionService.add(cajaAsignacionNuevo) as CajaAsignacion;

					caja.idEstadoCaja = ESTADOS_CAJA.ABIERTA;
					caja.idUsuarioActual = idUsuario;
					caja.idCajaAsignacionActual = cajaAsignacionNuevo.id;
					caja = await this.cajaRepository.modify(id, caja);

					resolve({idCajaAsignacion: cajaAsignacionNuevo.id});
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

	async modifyCierre(id: number) {
		const resultTransaction = this.cajaRepository.onTransaction( async () => { 
			return new Promise( async (resolve, reject) => {
				try {
					if (!isValidInteger(id, true)) {
						reject(new ValidationError('Existen campos incompletos'));
						return;
					}

					let caja = await this.findById(id) as Caja;
					if (!caja) {
						reject(new ReferenceError('No existe la caja'));
						return;
					}
					if (caja.idEstadoCaja !== ESTADOS_CAJA.ABIERTA) {
						reject(new ValidationError('La caja no está abierta'));
						return;
					}
					if (!caja.idCajaAsignacionActual) {
						reject(new ValidationError('La caja no tiene asignación abierta'));
						return;
					}

					let cajaAsignacionActual = await this.cajaAsignacionService.findById(caja.idCajaAsignacionActual) as CajaAsignacion;
					if (cajaAsignacionActual.fechaCierre) {
						reject(new ValidationError('La caja ya tiene un cierre'));
						return;
					}

					let importeCobro = 0;
					let importeCobroEfectivo = 0;
					let importeSaldoFinal = cajaAsignacionActual.importeSaldoInicial;
					const movimientosCaja = await this.movimientoCajaService.listByCajaAsignacion(cajaAsignacionActual.id) as MovimientoCaja[];
					for (let m=0; m<movimientosCaja.length; m++) {
						const movimientoCaja = movimientosCaja[m];

						const mediosPagos = await this.movimientoMedioPagoService.listByMovimientoCaja(movimientoCaja.id) as MovimientoMedioPago[];
						const mediosPagosEfectivo = mediosPagos.filter(f => f.idMedioPago === MEDIO_PAGO.EFECTIVO);

						if (movimientoCaja.idTipoMovimientoCaja === TIPO_MOVIMIENTO_CAJA.COBRANZA) {
							for (let e=0; e<mediosPagosEfectivo.length; e++) {
								const medioPagoEfectivo = mediosPagosEfectivo[e];
								if (medioPagoEfectivo.idMedioPago === MEDIO_PAGO.EFECTIVO) {
									importeSaldoFinal += medioPagoEfectivo.importeCobro;
									importeCobroEfectivo += medioPagoEfectivo.importeCobro;
								}
							}
							importeCobro += movimientoCaja.importeCobro;
						}
						else if (movimientoCaja.idTipoMovimientoCaja === TIPO_MOVIMIENTO_CAJA.RETIRO) {
							importeSaldoFinal -= movimientoCaja.importeCobro;
						}
						else if (movimientoCaja.idTipoMovimientoCaja === TIPO_MOVIMIENTO_CAJA.INGRESO) {
							importeSaldoFinal += movimientoCaja.importeCobro;
						}
					}

					cajaAsignacionActual.fechaCierre = getDateNow(true);
					cajaAsignacionActual.importeSaldoFinal = precisionRound(importeSaldoFinal,2);
					cajaAsignacionActual.importeCobro = precisionRound(importeCobro,2);
					cajaAsignacionActual.importeCobroEfectivo = precisionRound(importeCobroEfectivo,2);
					cajaAsignacionActual = await this.cajaAsignacionService.modify(cajaAsignacionActual.id, cajaAsignacionActual) as CajaAsignacion;

					caja.idUsuarioActual = null;
					caja.idEstadoCaja = ESTADOS_CAJA.CERRADA;
					caja = await this.cajaRepository.modify(id, caja);

					resolve({idCajaAsignacion: cajaAsignacionActual.id});
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

	async modifyCierreTesoreria(idUsuario: number, idsCajaAsignacion: number[]) {
		const resultTransaction = this.cajaRepository.onTransaction( async () => { 
			return new Promise( async (resolve, reject) => {
				try {
					if (idsCajaAsignacion.length === 0) {
						reject(new ValidationError('Existen campos incompletos'));
						return;
					}

					const today = getDateNow(true);
					//recorre los movimientos y genera un registro de recaudacion por cada recibo, tambien determina las recaudadoras involucradas en el proceso
					let idsRecaudadora: number[] = [];
					const recaudaciones: Recaudacion[] = [];
					for (let i=0; i<idsCajaAsignacion.length; i++) {
						const cajaAsignacion = await this.cajaAsignacionService.findById(idsCajaAsignacion[i]) as CajaAsignacion;
						const caja = await this.cajaRepository.findById(cajaAsignacion.idCaja) as Caja;
						idsRecaudadora.push(caja.idRecaudadora);

						const movimientosCaja = await this.movimientoCajaService.listByCajaAsignacion(cajaAsignacion.id) as MovimientoCaja[];
						for (let m=0; m<movimientosCaja.length; m++) {
							const movimientoCaja = movimientosCaja[m];

							const mediosPagos = await this.movimientoMedioPagoService.listByMovimientoCaja(movimientoCaja.id) as MovimientoMedioPago[];
							const medioPagoTarjeta = mediosPagos.find(f => [MEDIO_PAGO.TARJETA_CREDITO, MEDIO_PAGO.TARJETA_DEBITO].includes(f.idMedioPago));
							const medioPagoCheque = mediosPagos.find(f => f.idMedioPago === MEDIO_PAGO.CHEQUE);

							const movimientosRecibo = await this.movimientoReciboPublicacionService.listByMovimientoCaja(movimientoCaja.id) as MovimientoReciboPublicacion[];
							for (let r=0; r<movimientosRecibo.length; r++) {
								const movimientoRecibo = movimientosRecibo[r];
								const recibo = await this.reciboPublicacionService.findById(movimientoRecibo.idReciboPublicacion) as ReciboPublicacion;
								const recaudacion = new Recaudacion();
								recaudacion.idReciboPublicacion = recibo.id;
								recaudacion.idRegistroContableLote = null;
								recaudacion.idPagoRendicionLote = null;
								recaudacion.numeroCuenta = recibo.numeroCuenta;
								recaudacion.codigoDelegacion = recibo.codigoDelegacion;
								recaudacion.numeroRecibo = recibo.numeroRecibo;
								recaudacion.codigoBarras = recibo.codigoBarras;
								recaudacion.idRecaudadora = caja.idRecaudadora;
								recaudacion.numeroControl =  medioPagoTarjeta ? medioPagoTarjeta.numeroMedioPago : "";
								recaudacion.numeroComprobante = medioPagoCheque ? medioPagoCheque.numeroMedioPago : "";
								recaudacion.importeCobro = movimientoRecibo.importeCobro;
								recaudacion.fechaCobro = truncateTime(movimientoCaja.fechaCobro);
								recaudacion.idUsuarioConciliacion = idUsuario;
								recaudacion.fechaConciliacion = today;
								recaudacion.observacion = "";
								recaudaciones.push(recaudacion);
							}
						}
					}
					idsRecaudadora = distinctArray(idsRecaudadora);

					//por cada recaudadora genera un lote de recaudacion, ingresando su cabecera y detalle
					const recaudacionesLote: RecaudacionLote[] = [];
					for (let i=0; i<idsRecaudadora.length; i++) {
						const idRecaudadora = idsRecaudadora[i];
						const recaudacionesXRecaudadora = recaudaciones.filter(x => x.idRecaudadora === idRecaudadora);

						let importeCobro = 0;
						for (let r=0; r<recaudacionesXRecaudadora.length; r++) {
							const recaudacion = recaudacionesXRecaudadora[r];
							importeCobro += recaudacion.importeCobro;
						}
						importeCobro = precisionRound(importeCobro,2);

						let recaudacionLote = new RecaudacionLote();
						recaudacionLote.numeroLote = uuidv4();
						recaudacionLote.fechaLote = today;
						recaudacionLote.casos = recaudacionesXRecaudadora.length;
						recaudacionLote.idUsuarioProceso = idUsuario;
						recaudacionLote.fechaProceso = today;
						recaudacionLote.idOrigenRecaudacion = ORIGEN_RECAUDACION.CAJA;
						recaudacionLote.idRecaudadora = idRecaudadora;
						recaudacionLote.fechaAcreditacion = today;
						recaudacionLote.idUsuarioControl = idUsuario;
						recaudacionLote.fechaControl = today;
						recaudacionLote.idUsuarioConciliacion = idUsuario;
						recaudacionLote.fechaConciliacion = today;
						recaudacionLote.importeTotal = importeCobro;
						recaudacionLote.importeNeto = importeCobro;
						recaudacionLote.pathArchivoRecaudacion = "";
						recaudacionLote = await this.recaudacionLoteService.add(recaudacionLote) as RecaudacionLote;

						for (let r=0; r<recaudacionesXRecaudadora.length; r++) {
							const recaudacion = recaudacionesXRecaudadora[r];
							recaudacion.idRecaudacionLote = recaudacionLote.id;
							await this.recaudacionService.add(recaudacion);
						}
						recaudacionesLote.push(recaudacionLote);
					}

					//por cada asignacion de caja se coloca el lote de recaudacion involucrado (cerrando el proceso para esa asignacion de caja)
					for (let i=0; i<idsCajaAsignacion.length; i++) {
						const cajaAsignacion = await this.cajaAsignacionService.findById(idsCajaAsignacion[i]) as CajaAsignacion;
						const caja = await this.cajaRepository.findById(cajaAsignacion.idCaja) as Caja;
						const recaudacionLote = recaudacionesLote.find(f => f.idRecaudadora === caja.idRecaudadora);
						cajaAsignacion.idRecaudacionLote = recaudacionLote.id;
						await this.cajaAsignacionService.modify(cajaAsignacion.id, cajaAsignacion);
					}

					resolve({idsRecaudacionLote: recaudacionesLote.map(x => x.id)});
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

	async modifyMovimientoCobranza(id: number, movimientoCobranzaDto: MovimientoCobranzaDto) {
		const resultTransaction = this.cajaRepository.onTransaction( async () => { 
			return new Promise( async (resolve, reject) => {
				try {
					if (!isValidInteger(id, true) ||
						!isValidString(movimientoCobranzaDto.observacion, false) ||
						!movimientoCobranzaDto.mediosPagos || movimientoCobranzaDto.mediosPagos.length === 0 ||
						!movimientoCobranzaDto.recibos || movimientoCobranzaDto.recibos.length === 0
					) {
						reject(new ValidationError('Existen campos incompletos'));
						return;
					}

					let caja = await this.findById(id) as Caja;
					if (!caja) {
						reject(new ReferenceError('No existe la caja'));
						return;
					}
					if (caja.idEstadoCaja !== ESTADOS_CAJA.ABIERTA) {
						reject(new ValidationError('La caja no está abierta'));
						return;
					}
					if (!caja.idCajaAsignacionActual) {
						reject(new ValidationError('La caja no tiene asignación abierta'));
						return;
					}

					let cajaAsignacionActual = await this.cajaAsignacionService.findById(caja.idCajaAsignacionActual) as CajaAsignacion;
					if (cajaAsignacionActual.fechaCierre) {
						reject(new ValidationError('La caja ya tiene un cierre'));
						return;
					}

					const fechaCobro = getDateNow(false);
					let importeCobro = 0;
					const movimientosRecibos: MovimientoReciboPublicacion[] = [];
					for(let r=0; r<movimientoCobranzaDto.recibos.length; r++) {
						const idReciboPublicacion = movimientoCobranzaDto.recibos[r];
						const reciboPublicacion = await this.reciboPublicacionService.findById(idReciboPublicacion) as ReciboPublicacion;

						let importeVencimiento = 0;
						if (fechaCobro.getTime() <= reciboPublicacion.fechaVencimiento1.getTime()) {
							importeVencimiento = reciboPublicacion.importeVencimiento1;
						}
						else if (fechaCobro.getTime() <= reciboPublicacion.fechaVencimiento2.getTime()) {
							importeVencimiento = reciboPublicacion.importeVencimiento2;
						}
						else {
							reject(new ValidationError(`El recibo ${getNumeroRecibo_ObjectToIdentificador(reciboPublicacion)} está vencido`));
							return;
						}
						if (reciboPublicacion.idPagoRendicion) {
							reject(new ValidationError(`El recibo ${getNumeroRecibo_ObjectToIdentificador(reciboPublicacion)} ya fue cobrado y rendido a ingresos públicos`));
							return;
						}

						const movimientoExistente = await this.movimientoReciboPublicacionService.findByReciboPublicacion(reciboPublicacion.id) as MovimientoReciboPublicacion;
						if (movimientoExistente) {
							reject(new ValidationError(`El recibo ${getNumeroRecibo_ObjectToIdentificador(reciboPublicacion)} ya fue cobrado por caja`));
							return;
						}

						const movimientoRecibo = new MovimientoReciboPublicacion();
						movimientoRecibo.idReciboPublicacion = reciboPublicacion.id;
						movimientoRecibo.importeCobro = importeVencimiento;
						movimientosRecibos.push(movimientoRecibo);

						importeCobro += movimientoRecibo.importeCobro;
					}

					let movimientoCaja = new MovimientoCaja();
					movimientoCaja.idCaja = caja.id;
					movimientoCaja.idCajaAsignacion = cajaAsignacionActual.id;
					movimientoCaja.idTipoMovimientoCaja = TIPO_MOVIMIENTO_CAJA.COBRANZA;
					movimientoCaja.importeCobro = precisionRound(importeCobro,2);
					movimientoCaja.fechaCobro = getDateNow(true);
					movimientoCaja.observacion = movimientoCobranzaDto.observacion;
					movimientoCaja = await this.movimientoCajaService.add(movimientoCaja) as MovimientoCaja;

					let importeMediosPagos = 0;
					for (let m=0; m<movimientoCobranzaDto.mediosPagos.length; m++) {
						const medioPago = movimientoCobranzaDto.mediosPagos[m];
						medioPago.idMovimientoCaja = movimientoCaja.id;
						await this.movimientoMedioPagoService.add(medioPago);
						importeMediosPagos += medioPago.importeCobro;
					}
					if (importeMediosPagos !== importeCobro) {
						reject(new ValidationError('El monto cobrado difiere del monto de los recibos'));
						return;
					}

					for (let m=0; m<movimientosRecibos.length; m++) {
						const movimientoRecibo = movimientosRecibos[m];
						movimientoRecibo.idMovimientoCaja = movimientoCaja.id;
						await this.movimientoReciboPublicacionService.add(movimientoRecibo);
					}

					resolve({idMovimientoCaja: movimientoCaja.id});
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

	async modifyMovimientoRetiro(id: number, importe: number, observacion: string) {
		return new Promise( async (resolve, reject) => {
			try {
				if (!isValidInteger(id, true) ||
					!isValidFloat(importe, true) ||
					!isValidString(observacion, false)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				let caja = await this.findById(id) as Caja;
				if (!caja) {
					reject(new ReferenceError('No existe la caja'));
					return;
				}
				if (caja.idEstadoCaja !== ESTADOS_CAJA.ABIERTA) {
					reject(new ValidationError('La caja no está abierta'));
					return;
				}
				if (!caja.idCajaAsignacionActual) {
					reject(new ValidationError('La caja no tiene asignación abierta'));
					return;
				}

				let cajaAsignacionActual = await this.cajaAsignacionService.findById(caja.idCajaAsignacionActual) as CajaAsignacion;
				if (cajaAsignacionActual.fechaCierre) {
					reject(new ValidationError('La caja ya tiene un cierre'));
					return;
				}

				let movimientoCaja = new MovimientoCaja();
				movimientoCaja.idCaja = caja.id;
				movimientoCaja.idCajaAsignacion = cajaAsignacionActual.id;
				movimientoCaja.idTipoMovimientoCaja = TIPO_MOVIMIENTO_CAJA.RETIRO;
				movimientoCaja.importeCobro = importe;
				movimientoCaja.fechaCobro = getDateNow(true);
				movimientoCaja.observacion = observacion;
				movimientoCaja = await this.movimientoCajaService.add(movimientoCaja) as MovimientoCaja;

				resolve({idMovimientoCaja: movimientoCaja.id});
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async modifyMovimientoIngreso(id: number, importe: number, observacion: string) {
		return new Promise( async (resolve, reject) => {
			try {
				if (!isValidInteger(id, true) ||
					!isValidFloat(importe, true) ||
					!isValidString(observacion, false)
				) {
					reject(new ValidationError('Existen campos incompletos'));
					return;
				}

				let caja = await this.findById(id) as Caja;
				if (!caja) {
					reject(new ReferenceError('No existe la caja'));
					return;
				}
				if (caja.idEstadoCaja !== ESTADOS_CAJA.ABIERTA) {
					reject(new ValidationError('La caja no está abierta'));
					return;
				}
				if (!caja.idCajaAsignacionActual) {
					reject(new ValidationError('La caja no tiene asignación abierta'));
					return;
				}

				let cajaAsignacionActual = await this.cajaAsignacionService.findById(caja.idCajaAsignacionActual) as CajaAsignacion;
				if (cajaAsignacionActual.fechaCierre) {
					reject(new ValidationError('La caja ya tiene un cierre'));
					return;
				}

				let movimientoCaja = new MovimientoCaja();
				movimientoCaja.idCaja = caja.id;
				movimientoCaja.idCajaAsignacion = cajaAsignacionActual.id;
				movimientoCaja.idTipoMovimientoCaja = TIPO_MOVIMIENTO_CAJA.INGRESO;
				movimientoCaja.importeCobro = importe;
				movimientoCaja.fechaCobro = getDateNow(true);
				movimientoCaja.observacion = observacion;
				movimientoCaja = await this.movimientoCajaService.add(movimientoCaja) as MovimientoCaja;

				resolve({idMovimientoCaja: movimientoCaja.id});
			}
			catch(error) {
				reject(new ProcessError('Error procesando datos', error));
			}
		});
	}

	async removeMovimiento(idMovimientoCaja: number) {
		const resultTransaction = this.cajaRepository.onTransaction( async () => { 
			return new Promise( async (resolve, reject) => {
				try {
					if (!isValidInteger(idMovimientoCaja, true)) {
						reject(new ValidationError('Existen campos incompletos'));
						return;
					}

					const movimientoCaja = await this.movimientoCajaService.findById(idMovimientoCaja) as MovimientoCaja;

					let caja = await this.findById(movimientoCaja.idCaja) as Caja;
					if (!caja) {
						reject(new ReferenceError('No existe la caja'));
						return;
					}
					if (caja.idEstadoCaja !== ESTADOS_CAJA.ABIERTA) {
						reject(new ValidationError('La caja no está abierta'));
						return;
					}
					if (!caja.idCajaAsignacionActual) {
						reject(new ValidationError('La caja no tiene asignación abierta'));
						return;
					}

					let cajaAsignacionActual = await this.cajaAsignacionService.findById(caja.idCajaAsignacionActual) as CajaAsignacion;
					if (cajaAsignacionActual.fechaCierre) {
						reject(new ValidationError('La caja ya tiene un cierre'));
						return;
					}

					await this.movimientoCajaService.remove(idMovimientoCaja);

					resolve({idCajaAsignacion: cajaAsignacionActual.id});
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
				const asignaciones = await this.cajaAsignacionService.listByCaja(id) as CajaAsignacion[];
				if (asignaciones.length > 0) {
					reject(new ReferenceError('La caja ya tuvo una apertura. No podrá ser eliminada'));
					return;
				}

				const result = await this.cajaRepository.remove(id);
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
