import PlanPagoDefinicionService from '../../domain/services/plan-pago-definicion-service';
import ParameterError from '../../infraestructure/sdk/error/parameter-error';
import { isValidNumber, isValidObject } from '../../infraestructure/sdk/utils/validator';
import { getTokenFromRequest } from '../authorization/token';


export default class PlanPagoDefinicionController {

	planPagoDefinicionService: PlanPagoDefinicionService;

	constructor(planPagoDefinicionService: PlanPagoDefinicionService) {
		this.planPagoDefinicionService = planPagoDefinicionService;
	}

	get = (req, res, next) => {
		const token = getTokenFromRequest(req);
		if (!token) {
			next(new ParameterError('Error de parámetros'));
			return;
		}

		this.planPagoDefinicionService.list(token)
			.then(data => res.send(data))
			.catch(next)
	}

	getByFilter = (req, res, next) => {
		const token = getTokenFromRequest(req);
		const idEstadoPlanPagoDefinicion = req.query.idEstadoPlanPagoDefinicion;
		const idTipoPlanPago = req.query.idTipoPlanPago;
		const idTipoTributo = req.query.idTipoTributo;
		const idTasaPlanPago = req.query.idTasaPlanPago;
		const idSubTasaPlanPago = req.query.idSubTasaPlanPago;
		const descripcion = req.query.descripcion;
		const fechaDesde = req.query.fechaDesde;
		const fechaHasta = req.query.fechaHasta;
		const etiqueta = req.query.etiqueta;
	
		this.planPagoDefinicionService.listByFilter(token, idEstadoPlanPagoDefinicion, idTipoPlanPago, idTipoTributo, idTasaPlanPago, idSubTasaPlanPago, descripcion, fechaDesde, fechaHasta, etiqueta)
		  .then(data => res.send(data))
		  .catch(next)
	}

	getByCuenta = (req, res, next) => {
		const token = getTokenFromRequest(req);
		const idCuenta = req.params.idCuenta;
		const dataBody = {...req.body};
		if (!token || !isValidNumber(idCuenta, true) || !isValidObject(dataBody)) {
			next(new ParameterError('Error de parámetros'));
			return;
		}

		this.planPagoDefinicionService.listByCuenta(token, idCuenta, dataBody)
			.then(data => res.send(data))
			.catch(next)
	}

	getByCuotas = (req, res, next) => {
		const token = getTokenFromRequest(req);
		const id = req.params.id;
		const dataBody = {...req.body};
		if (!token || !isValidNumber(id, true) || !isValidObject(dataBody)) {
			next(new ParameterError('Error de parámetros'));
			return;
		}

		this.planPagoDefinicionService.listByCuotas(token, id, dataBody)
			.then(data => res.send(data))
			.catch(next)
	}

	getById = (req, res, next) => {
		const token = getTokenFromRequest(req);
		const id = req.params.id;
		if (!token || !isValidNumber(id, true)) {
			next(new ParameterError('Error de parámetros'));
			return;
		}
		
		this.planPagoDefinicionService.findById(token, id)
			.then(row => res.send(row))
			.catch(next)
	}

	post = (req, res, next) => {
		const token = getTokenFromRequest(req);
		const dataBody = {...req.body};
		if (!token || !isValidObject(dataBody)) {
			next(new ParameterError('Error de parámetros'));
			return;
		}

		this.planPagoDefinicionService.add(token, dataBody)
			.then(row => res.send(row))
			.catch(next)
	}

	put = (req, res, next) => {
		const token = getTokenFromRequest(req);
		const id = req.params.id;
		const dataBody = {...req.body};
		if (!token || !isValidNumber(id, true) || !isValidObject(dataBody)) {
			next(new ParameterError('Error de parámetros'));
			return;
		}

		this.planPagoDefinicionService.modify(token, id, dataBody)
			.then(row => res.send(row))
			.catch(next)
	}

	delete = (req, res, next) => {
		const token = getTokenFromRequest(req);
		const id = req.params.id;
		if (!token || !isValidNumber(id, true)) {
			next(new ParameterError('Error de parámetros'));
			return;
		}

		this.planPagoDefinicionService.remove(token, id)
			.then(id => res.send(id))
			.catch(next)
	}

}
