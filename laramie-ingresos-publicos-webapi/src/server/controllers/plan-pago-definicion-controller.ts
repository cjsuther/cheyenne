import CuentaCorrienteItemRecibo from '../../domain/dto/cuenta-corriente-item-recibo';
import PlanPagoDefinicion from '../../domain/entities/plan-pago-definicion';
import PlanPagoDefinicionService from '../../domain/services/plan-pago-definicion-service';
import PlanPagoDefinicionFilter from '../../domain/dto/plan-pago-definicion-filter';
import UnauthorizedError from '../../infraestructure/sdk/error/unauthorized-error';
import { getTokenFromRequest, verifyAccessToken } from '../authorization/token';
import PlanPagoDefinicionDTO from '../../domain/dto/plan-pago-definicion-dto';

export default class PlanPagoDefinicionController {

	planPagoDefinicionService: PlanPagoDefinicionService;

	constructor(planPagoDefinicionService: PlanPagoDefinicionService) {
		this.planPagoDefinicionService = planPagoDefinicionService;
	}

	get = (req, res, next) => {
		this.planPagoDefinicionService.list()
			.then(data => res.send(data))
			.catch(next)
	}

	getByFilter = (req, res, next) => {
		let planPagoDefinicionFilter = new PlanPagoDefinicionFilter();
		planPagoDefinicionFilter.idEstadoPlanPagoDefinicion = parseInt(req.query.idEstadoPlanPagoDefinicion);
		planPagoDefinicionFilter.idTipoPlanPago = parseInt(req.query.idTipoPlanPago);
		planPagoDefinicionFilter.idTipoTributo = parseInt(req.query.idTipoTributo);
		planPagoDefinicionFilter.idTasaPlanPago = parseInt(req.query.idTasaPlanPago);
		planPagoDefinicionFilter.idSubTasaPlanPago = parseInt(req.query.idSubTasaPlanPago);
		planPagoDefinicionFilter.descripcion = req.query.descripcion;
		planPagoDefinicionFilter.fechaDesde = (req.query.fechaDesde.length > 0) ? new Date(req.query.fechaDesde) : null;
		planPagoDefinicionFilter.fechaHasta = (req.query.fechaHasta.length > 0) ? new Date(req.query.fechaHasta) : null;
		planPagoDefinicionFilter.etiqueta = req.query.etiqueta;
		
		this.planPagoDefinicionService.listByFilter(planPagoDefinicionFilter)
			.then(data => res.send(data))
			.catch(next)
	}

	getByCuenta = (req, res, next) => {
		const idCuenta = req.params.idCuenta;
		const dataBody = {...req.body};
		const items = dataBody.items.map(row => {
			const item = new CuentaCorrienteItemRecibo();
			item.setFromObject(row);
			return item;
		});
		this.planPagoDefinicionService.listByCuenta(idCuenta, items)
		  .then(row => res.send(row))
		  .catch(next)
	}

	getByCuotas = (req, res, next) => {
		const id = req.params.id;
		const dataBody = {...req.body};
		const idCuenta = dataBody.idCuenta;
		const items = dataBody.items.map(row => {
			const item = new CuentaCorrienteItemRecibo();
			item.setFromObject(row);
			return item;
		});
		this.planPagoDefinicionService.listByCuotas(id, idCuenta, items)
		  .then(row => res.send(row))
		  .catch(next)
	}

	getById = (req, res, next) => {
		const id = req.params.id;
		this.planPagoDefinicionService.findById(id)
			.then(row => res.send(row))
			.catch(next)
	}

	post = (req, res, next) => {
		const token = getTokenFromRequest(req);
		if (!token) {
			next(new UnauthorizedError('Token inválido'));
			return;
		}
		const dataToken = verifyAccessToken(token);
		if (!dataToken) {
			next(new UnauthorizedError('No se pudo obtener información del Token'));
			return;
		}

		const dataBody = {...req.body};
		const planPagoDefinicionDTO = new PlanPagoDefinicionDTO(); planPagoDefinicionDTO.setFromObject(dataBody);
		this.planPagoDefinicionService.add(dataToken.idUsuario, planPagoDefinicionDTO)
			.then(row => res.send(row))
			.catch(next)
	}

	put = (req, res, next) => {
		const token = getTokenFromRequest(req);
		if (!token) {
			next(new UnauthorizedError('Token inválido'));
			return;
		}
		const dataToken = verifyAccessToken(token);
		if (!dataToken) {
			next(new UnauthorizedError('No se pudo obtener información del Token'));
			return;
		}

		const id = req.params.id;
		const dataBody = {...req.body};
		const planPagoDefinicionDTO = new PlanPagoDefinicionDTO(); planPagoDefinicionDTO.setFromObject(dataBody);
		this.planPagoDefinicionService.modify(id, dataToken.idUsuario, planPagoDefinicionDTO)
			.then(row => res.send(row))
			.catch(next)
	}

	delete = (req, res, next) => {
		const id = req.params.id;
		this.planPagoDefinicionService.remove(id)
			.then(id => res.send(id))
			.catch(next)
	}

}
