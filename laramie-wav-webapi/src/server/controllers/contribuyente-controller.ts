import CuentaService from '../../domain/services/cuenta-service';
import CuentaCorrienteItemService from '../../domain/services/cuenta-corriente-item-service';
import ParameterError from '../../infraestructure/sdk/error/parameter-error';
import { isEmpty, isValidArray, isValidNumber, isValidObject, isValidString } from '../../infraestructure/sdk/utils/validator';
import { getTokenFromRequest } from '../authorization/token';
import PlanPagoDefinicionService from '../../domain/services/plan-pago-definicion-service';
import PagoContadoDefinicionService from '../../domain/services/pago-contado-definicion-service';
import PlanPagoService from '../../domain/services/plan-pago-service';
import PagoContadoService from '../../domain/services/pago-contado-service';
import ReporteService from '../../domain/services/reporte-service';
import { getDateNow } from '../../infraestructure/sdk/utils/convert';
import CuentaPagoService from '../../domain/services/cuenta-pago-service';
import DeclaracionJuradaService from '../../domain/services/declaracion-jurada-service';
import PersonaService from '../../domain/services/persona-service';
import UnauthorizedError from '../../infraestructure/sdk/error/unauthorized-error';
import PersonaDTO from '../../domain/entities/persona-dto';
import { RECIBO_TYPE } from '../../infraestructure/sdk/consts/reciboType';
import RetencionService from '../../domain/services/retencion-service';

export default class ContribuyenteController {

	personaService: PersonaService;
	cuentaService: CuentaService;
	cuentaCorrienteItemService: CuentaCorrienteItemService;
	cuentaPagoService: CuentaPagoService;
	planPagoDefinicionService: PlanPagoDefinicionService;
	pagoContadoDefinicionService: PagoContadoDefinicionService;
	planPagoService: PlanPagoService;
	pagoContadoService: PagoContadoService;
	reporteService: ReporteService;
	declaracionJuradaService: DeclaracionJuradaService;
	retencionService: RetencionService;

	constructor(personaService: PersonaService,
				cuentaService: CuentaService,
				cuentaCorrienteItemService: CuentaCorrienteItemService,
				cuentaPagoService: CuentaPagoService,
				planPagoDefinicionService: PlanPagoDefinicionService,
				pagoContadoDefinicionService: PagoContadoDefinicionService,
				planPagoService: PlanPagoService,
				pagoContadoService: PagoContadoService,
				reporteService: ReporteService,
				declaracionJuradaService: DeclaracionJuradaService,
				retencionService: RetencionService
	) {
		this.personaService = personaService;
		this.cuentaService = cuentaService;
		this.cuentaCorrienteItemService = cuentaCorrienteItemService;
		this.cuentaPagoService = cuentaPagoService;
		this.planPagoDefinicionService = planPagoDefinicionService;
		this.pagoContadoDefinicionService = pagoContadoDefinicionService;
		this.planPagoService = planPagoService;
		this.pagoContadoService = pagoContadoService;
		this.reporteService = reporteService;
		this.declaracionJuradaService = declaracionJuradaService;
		this.retencionService = retencionService;
	}

	getByDocumento = (req, res, next) => {
		const token = getTokenFromRequest(req);
		const idTipoDocumento = req.params.idTipoDocumento;
		const numeroDocumento = req.params.numeroDocumento;
		if (!token || !isValidNumber(idTipoDocumento, false) || !isValidString(numeroDocumento, true)) {
		  next(new ParameterError('Error de parámetros'));
		  return;
		}
	
		this.personaService.listByDocumento(token, idTipoDocumento, numeroDocumento)
		  .then(data => res.send(data))
		  .catch(next)
	}

	getById = (req, res, next) => {
		const token = getTokenFromRequest(req);
		const idPersona = req.params.idPersona;
		if (!token || !isValidNumber(idPersona, false)) {
		  next(new ParameterError('Error de parámetros'));
		  return;
		}
	
		this.personaService.findById(token, idPersona)
		  .then(data => res.send(data))
		  .catch(next)
	}

	post = (req, res, next) => {
		const token = getTokenFromRequest(req);
		if (!token) {
			next(new UnauthorizedError('Token inválido'));
			return;
		}

		const dataBody = {...req.body};
		const persona = new PersonaDTO();
		try {
			persona.setFromObject(dataBody);
		}
		catch (error) {
			next(new ParameterError('Error de parámetros'));
			return;
		}

		this.personaService.add(token, persona)
			.then(row => res.send(row))
			.catch(next)
	}


	putBindContribuyente = (req, res, next) => {
		const token = getTokenFromRequest(req);
		const idPersona = req.params.idPersona;
		const idCuenta = req.params.idCuenta;
		if (!token || !isValidNumber(idPersona, true) || !isValidNumber(idCuenta, true)) {
			next(new ParameterError('Error de parámetros'));
			return;
		}

		const dataBodyOriginal = {...req.body};
    	const emailZonaEntrega = dataBodyOriginal.emailZonaEntrega??"";

		this.personaService.findById(token, idPersona)
		.then(async persona => {
			try {
				const dataBody = {
					persona:
					{
						id: persona["id"],
						idTipoPersona: persona["idTipoPersona"],
						nombrePersona: persona["nombrePersona"],
						idTipoDocumento: persona["idTipoDocumento"],
						numeroDocumento: persona["numeroDocumento"]
					},
					emailZonaEntrega: emailZonaEntrega
				};
				const data = await this.cuentaService.bindContribuyente(token, idCuenta, idPersona, dataBody);
				res.send(data);
			}
			catch(error) {
                next(error);
            }
		})
		.catch(next)
	}
	
	putUnbindContribuyente = (req, res, next) => {
		const token = getTokenFromRequest(req);
		const idPersona = req.params.idPersona;
		const idCuenta = req.params.idCuenta;
		if (!token || !isValidNumber(idCuenta, true) || !isValidNumber(idPersona, true)) {
			next(new ParameterError('Error de parámetros'));
			return;
		}

		const dataBodyOriginal = {...req.body};
    	const emailZonaEntrega = dataBodyOriginal.emailZonaEntrega??"";
	
		const dataBody = {
			emailZonaEntrega: emailZonaEntrega,
			predefinido: !isEmpty(emailZonaEntrega)
		};

		this.cuentaService.unbindContribuyente(token, idCuenta, idPersona, dataBody)
		  .then(data => res.send(data))
		  .catch(next)
	}

	getByDeudaVencimiento = (req, res, next) => {
		const token = getTokenFromRequest(req);
		const idPersona = req.params.idPersona;
		const idCuenta = req.params.idCuenta;
		if (!token || !isValidNumber(idCuenta, true)) {
			next(new ParameterError('Error de parámetros'));
			return;
		}
		
		this.cuentaCorrienteItemService.listByDeudaVencimiento(token, idCuenta)
			.then(data => res.send(data))
			.catch(next)
	}

	getByCredito = (req, res, next) => {
		const token = getTokenFromRequest(req);
		const idPersona = req.params.idPersona;
		const idCuenta = req.params.idCuenta;
		if (!token || !isValidNumber(idCuenta, true)) {
			next(new ParameterError('Error de parámetros'));
			return;
		}
		
		this.cuentaCorrienteItemService.listByCredito(token, idCuenta)
			.then(data => res.send(data))
			.catch(next)
	}


	getPlanPagoDefiniciones = (req, res, next) => {
		const token = getTokenFromRequest(req);
		const idPersona = req.params.idPersona;
		const idCuenta = req.params.idCuenta;
		const dataBody = {...req.body};
		if (!token || !isValidNumber(idPersona, true) || !isValidNumber(idCuenta, true) || !isValidObject(dataBody)) {
			next(new ParameterError('Error de parámetros'));
			return;
		}

		this.planPagoDefinicionService.listByCuenta(token, idPersona, idCuenta, dataBody)
			.then(data => res.send(data))
			.catch(next)
	}

	getPlanPagoDefinicionDetalle = (req, res, next) => {
		const token = getTokenFromRequest(req);
		const idPersona = req.params.idPersona;
		const idCuenta = req.params.idCuenta;
		const idPlanPagoDefinicion = req.params.idPlanPagoDefinicion;
		const dataBody = {...req.body};
		if (!token || !isValidNumber(idPersona, true) || !isValidNumber(idCuenta, true) || !isValidNumber(idPlanPagoDefinicion, true) || !isValidObject(dataBody)) {
			next(new ParameterError('Error de parámetros'));
			return;
		}
		const newDataBody = {...dataBody,
			idCuenta: parseInt(idCuenta)
		};

		this.planPagoDefinicionService.listByCuotas(token, idPlanPagoDefinicion, newDataBody)
			.then(data => res.send(data))
			.catch(next)
	}

	getPlanPagoConvenioPreview = (req, res, next) => {
		const token = getTokenFromRequest(req);
		const idPersona = req.params.idPersona;
		const idCuenta = req.params.idCuenta;
		const idPlanPagoDefinicion = req.params.idPlanPagoDefinicion;
		const dataBody = {...req.body};
		if (!token || !isValidNumber(idPersona, true) || !isValidNumber(idCuenta, true) || !isValidNumber(idPlanPagoDefinicion, true) || !isValidObject(dataBody)) {
			next(new ParameterError('Error de parámetros'));
			return;
		}

		this.planPagoService.generateReportConvenioPreview(token, parseInt(idPersona), parseInt(idCuenta), parseInt(idPlanPagoDefinicion), dataBody)
			.then(row => res.send(row))
			.catch(next)
	}

	postPlanPago = (req, res, next) => {
		const token = getTokenFromRequest(req);
		const idPersona = req.params.idPersona;
		const idCuenta = req.params.idCuenta;
		const idPlanPagoDefinicion = req.params.idPlanPagoDefinicion;
		const dataBody = {...req.body};
		if (!token || !isValidNumber(idPersona, true) || !isValidNumber(idCuenta, true) || !isValidNumber(idPlanPagoDefinicion, true) || !isValidObject(dataBody)) {
			next(new ParameterError('Error de parámetros'));
			return;
		}

		this.planPagoService.add(token, parseInt(idPersona), parseInt(idCuenta), parseInt(idPlanPagoDefinicion), dataBody)
			.then(row => res.send(row))
			.catch(next)
	}

	getPlanPagoDetalle = (req, res, next) => {
		const token = getTokenFromRequest(req);
		const idPersona = req.params.idPersona;
		const idCuenta = req.params.idCuenta;
		const idPlanPago = req.params.idPlanPago;
		if (!token || !isValidNumber(idPersona, true) || !isValidNumber(idCuenta, true) || !isValidNumber(idPlanPago, true)) {
			next(new ParameterError('Error de parámetros'));
			return;
		}

		this.planPagoService.findById(token, idPlanPago)
			.then(data => res.send(data))
			.catch(next)
	}

	getPlanPagoRecibo = (req, res, next) => {
		const token = getTokenFromRequest(req);
		const idPersona = req.params.idPersona;
		const idCuenta = req.params.idCuenta;
		const idPlanPago = req.params.idPlanPago;
		if (!token || !isValidNumber(idPersona, true) || !isValidNumber(idCuenta, true) || !isValidNumber(idPlanPago, true)) {
			next(new ParameterError('Error de parámetros'));
			return;
		}

		const dataBody = {
			idPlanPago: idPlanPago,
			planPagoCuota: []
		}

		this.reporteService.generateReport(token, 'PlanPagoRecibo', dataBody)
			.then(data => res.send(data))
			.catch(next)
	}

	getPlanPagoConvenio = (req, res, next) => {
		const token = getTokenFromRequest(req);
		const idPersona = req.params.idPersona;
		const idCuenta = req.params.idCuenta;
		const idPlanPago = req.params.idPlanPago;
		if (!token || !isValidNumber(idPersona, true) || !isValidNumber(idCuenta, true) || !isValidNumber(idPlanPago, true)) {
			next(new ParameterError('Error de parámetros'));
			return;
		}

		const dataBody = {
			idPlanPago: idPlanPago,
			planPagoCuota: []
		}

		this.reporteService.generateReport(token, 'PlanPagoConvenio', dataBody)
			.then(data => res.send(data))
			.catch(next)
	}


	getPagoContadoDefiniciones = (req, res, next) => {
		const token = getTokenFromRequest(req);
		const idPersona = req.params.idPersona;
		const idCuenta = req.params.idCuenta;
		const dataBody = {...req.body};
		if (!token || !isValidNumber(idPersona, true) || !isValidNumber(idCuenta, true) || !isValidObject(dataBody)) {
			next(new ParameterError('Error de parámetros'));
			return;
		}

		this.pagoContadoDefinicionService.listByCuenta(token, idPersona, idCuenta, dataBody)
			.then(data => res.send(data))
			.catch(next)
	}

	getPagoContadoDefinicionDetalle = (req, res, next) => {
		const token = getTokenFromRequest(req);
		const idPersona = req.params.idPersona;
		const idCuenta = req.params.idCuenta;
		const idPagoContadoDefinicion = req.params.idPagoContadoDefinicion;
		const dataBody = {...req.body};
		if (!token || !isValidNumber(idPersona, true) || !isValidNumber(idCuenta, true) || !isValidNumber(idPagoContadoDefinicion, true) || !isValidObject(dataBody)) {
			next(new ParameterError('Error de parámetros'));
			return;
		}
		const newDataBody = {...dataBody,
			idCuenta: parseInt(idCuenta)
		};

		this.pagoContadoDefinicionService.listByCuotas(token, idPagoContadoDefinicion, newDataBody)
			.then(data => res.send(data))
			.catch(next)
	}

	postPagoContado = (req, res, next) => {
		const token = getTokenFromRequest(req);
		const idPersona = req.params.idPersona;
		const idCuenta = req.params.idCuenta;
		const idPagoContadoDefinicion = req.params.idPagoContadoDefinicion;
		const dataBody = {...req.body};
		if (!token || !isValidNumber(idPersona, true) || !isValidNumber(idCuenta, true) || !isValidNumber(idPagoContadoDefinicion, true) || !isValidObject(dataBody)) {
			next(new ParameterError('Error de parámetros'));
			return;
		}
		const newDataBody = {...dataBody,
			idCuenta: parseInt(idCuenta),
			idPagoContadoDefinicion: parseInt(idPagoContadoDefinicion),
			idTipoRecibo: RECIBO_TYPE.RECIBO_WEB
		};

		this.pagoContadoService.add(token, newDataBody)
			.then(row => res.send(row))
			.catch(next)
	}

	getPagoContadoRecibo = (req, res, next) => {
		const token = getTokenFromRequest(req);
		const idPersona = req.params.idPersona;
		const idCuenta = req.params.idCuenta;
		const idCuentaPago = req.params.idCuentaPago;
		if (!token || !isValidNumber(idPersona, true) || !isValidNumber(idCuenta, true) || !isValidNumber(idCuentaPago, true)) {
			next(new ParameterError('Error de parámetros'));
			return;
		}

		const dataBody = {
			idCuentaPago: idCuentaPago,
			reciboResumido: false
		}

		this.reporteService.generateReport(token, 'CuentaCorrientePagoContado', dataBody)
			.then(data => res.send(data))
			.catch(next)
	}


	postReciboComun = (req, res, next) => {
		const token = getTokenFromRequest(req);
		const idPersona = req.params.idPersona;
		const idCuenta = req.params.idCuenta;
		const dataBody = {...req.body};
		if (!token || !isValidNumber(idPersona, true) || !isValidNumber(idCuenta, true) || !isValidObject(dataBody)) {
			next(new ParameterError('Error de parámetros'));
			return;
		}
		const newDataBody = {...dataBody,
			idCuenta: parseInt(idCuenta),
			fechaVencimiento: getDateNow(),
			reciboResumido: false,
			idTipoRecibo: RECIBO_TYPE.RECIBO_WEB
		};

		this.cuentaCorrienteItemService.addReciboComun(token, newDataBody)
			.then(row => res.send(row))
			.catch(next)
	}

	getReciboComunRecibo = (req, res, next) => {
		const token = getTokenFromRequest(req);
		const idPersona = req.params.idPersona;
		const idCuenta = req.params.idCuenta;
		const idCuentaPago = req.params.idCuentaPago;
		if (!token || !isValidNumber(idPersona, true) || !isValidNumber(idCuenta, true) || !isValidNumber(idCuentaPago, true)) {
			next(new ParameterError('Error de parámetros'));
			return;
		}

		const dataBody = {
			idCuentaPago: idCuentaPago,
			reciboResumido: false
		}

		this.reporteService.generateReport(token, 'CuentaCorrienteRecibo', dataBody)
			.then(data => res.send(data))
			.catch(next)
	}


	getReciboDetalle = (req, res, next) => {
		const token = getTokenFromRequest(req);
		const idPersona = req.params.idPersona;
		const idCuenta = req.params.idCuenta;
		const idCuentaPago = req.params.idCuentaPago;
		if (!token || !isValidNumber(idPersona, true) || !isValidNumber(idCuenta, true) || !isValidNumber(idCuentaPago, true)) {
			next(new ParameterError('Error de parámetros'));
			return;
		}

		this.cuentaPagoService.findById(token, idCuentaPago)
			.then(data => res.send(data))
			.catch(next)
	}


	getDeclaracionJuradaDefiniciones = (req, res, next) => {
		const token = getTokenFromRequest(req);
		const idPersona = req.params.idPersona;
		const idCuenta = req.params.idCuenta;
		if (!token || !isValidNumber(idPersona, true) || !isValidNumber(idCuenta, true)) {
			next(new ParameterError('Error de parámetros'));
			return;
		}

		this.declaracionJuradaService.list(token, idPersona, idCuenta)
			.then(data => res.send(data))
			.catch(next)
	}

	getDeclaracionJuradaDefinicionDetalle = (req, res, next) => {
		const token = getTokenFromRequest(req);
		const idPersona = req.params.idPersona;
		const idCuenta = req.params.idCuenta;
		const idModeloDeclaracionJurada = req.params.idModeloDeclaracionJurada;
		if (!token || !isValidNumber(idPersona, true) || !isValidNumber(idCuenta, true) || !isValidNumber(idModeloDeclaracionJurada, true)) {
			next(new ParameterError('Error de parámetros'));
			return;
		}

		this.declaracionJuradaService.findByCuenta(token, idModeloDeclaracionJurada, idCuenta)
			.then(data => res.send(data))
			.catch(next)
	}

	getDeclaracionJuradaPresentadas = (req, res, next) => {
		const token = getTokenFromRequest(req);
		const idPersona = req.params.idPersona;
		const idCuenta = req.params.idCuenta;
		if (!token || !isValidNumber(idPersona, true) || !isValidNumber(idCuenta, true)) {
			next(new ParameterError('Error de parámetros'));
			return;
		}

		this.declaracionJuradaService.listPresentadas(token, idPersona, idCuenta)
			.then(data => res.send(data))
			.catch(next)
	}

	getDeclaracionJuradaPresentadaDetalle = (req, res, next) => {
		const token = getTokenFromRequest(req);
		const idPersona = req.params.idPersona;
		const idCuenta = req.params.idCuenta;
		const idDeclaracionJurada = req.params.idDeclaracionJurada;
		if (!token || !isValidNumber(idPersona, true) || !isValidNumber(idCuenta, true) || !isValidNumber(idDeclaracionJurada, true)) {
			next(new ParameterError('Error de parámetros'));
			return;
		}

		this.declaracionJuradaService.findById(token, idPersona, idCuenta, idDeclaracionJurada)
			.then(data => res.send(data))
			.catch(next)
	}

	postDeclaracionJurada = (req, res, next) => {
		const token = getTokenFromRequest(req);
		const idPersona = req.params.idPersona;
		const idCuenta = req.params.idCuenta;
		const idModeloDeclaracionJurada = req.params.idModeloDeclaracionJurada;
		const dataBody = {...req.body};
		if (!token || !isValidNumber(idPersona, true) || !isValidNumber(idCuenta, true) || !isValidNumber(idModeloDeclaracionJurada, true) ||
					  !isValidObject(dataBody) || !isValidObject(dataBody.declaracionJurada)) {
			next(new ParameterError('Error de parámetros'));
			return;
		}

		dataBody.aplicaCreditos ??= false;
		dataBody.declaracionJurada.idCuenta = parseInt(idCuenta);
		dataBody.declaracionJurada.idModeloDeclaracionJurada = parseInt(idModeloDeclaracionJurada);

		this.declaracionJuradaService.addByWeb(token, dataBody)
			.then(row => res.send(row))
			.catch(next)
	}

	postDeclaracionJuradaPreview = (req, res, next) => {
		const token = getTokenFromRequest(req);
		const idPersona = req.params.idPersona;
		const idCuenta = req.params.idCuenta;
		const idModeloDeclaracionJurada = req.params.idModeloDeclaracionJurada;
		const dataBody = {...req.body};
		if (!token || !isValidNumber(idPersona, true) || !isValidNumber(idCuenta, true) || !isValidNumber(idModeloDeclaracionJurada, true) ||
					  !isValidObject(dataBody) || !isValidObject(dataBody.declaracionJurada)) {
			next(new ParameterError('Error de parámetros'));
			return;
		}

		dataBody.aplicaCreditos ??= false;
		dataBody.declaracionJurada.idCuenta = parseInt(idCuenta);
		dataBody.declaracionJurada.idModeloDeclaracionJurada = parseInt(idModeloDeclaracionJurada);

		this.declaracionJuradaService.addByWebPreview(token, dataBody)
			.then(row => res.send(row))
			.catch(next)
	}

	postRetencion = (req, res, next) => {
		const token = getTokenFromRequest(req);
		const idPersona = req.params.idPersona;
		const idCuenta = req.params.idCuenta;
		const dataBody = {...req.body};
		if (!token || !isValidNumber(idPersona, true) || !isValidNumber(idCuenta, true) ||
					  !isValidObject(dataBody) || !isValidObject(dataBody.retencion) || !isValidArray(dataBody.retencionItems)) {
			next(new ParameterError('Error de parámetros'));
			return;
		}

		this.retencionService.add(token, parseInt(idCuenta), dataBody)
			.then(row => res.send(row))
			.catch(next)
	}

}
