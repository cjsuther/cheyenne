import PlanPagoAdd from '../../domain/dto/plan-pago-add';
import PlanPago from '../../domain/entities/plan-pago';
import PlanPagoService from '../../domain/services/plan-pago-service';
import UnauthorizedError from '../../infraestructure/sdk/error/unauthorized-error';
import { getTokenFromRequest, verifyAccessToken } from '../authorization/token';

export default class PlanPagoController {

	planPagoService: PlanPagoService;

	constructor(planPagoService: PlanPagoService) {
		this.planPagoService = planPagoService;
	}

	get = (req, res, next) => {
		this.planPagoService.list()
			.then(data => res.send(data))
			.catch(next)
	}

	getById = (req, res, next) => {
		const id = req.params.id;
		this.planPagoService.findById(id)
			.then(row => res.send(row))
			.catch(next)
	}

	getByCuenta = (req, res, next) => {
		const idCuenta = req.params.idCuenta;
		this.planPagoService.listByCuenta(idCuenta)
			.then(data => res.send(data))
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
		const planPago = new PlanPagoAdd(); planPago.setFromObject(dataBody);
		this.planPagoService.add(dataToken.idUsuario, planPago)
			.then(row => res.send(row))
			.catch(next)
	}

	put = (req, res, next) => {
		const id = req.params.id;
		const dataBody = {...req.body};
		const planPago = new PlanPago(); planPago.setFromObject(dataBody);
		this.planPagoService.modify(id, planPago)
			.then(row => res.send(row))
			.catch(next)
	}

	putCaducidad = (req, res, next) => {
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

		this.planPagoService.modifyCaducidad(dataToken.idUsuario)
			.then(row => res.send(row))
			.catch(next)
	}

	deleteCaducidad = (req, res, next) => {
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
		this.planPagoService.removeCaducidad(dataToken.idUsuario, id)
			.then(id => res.send(id))
			.catch(next)
	}

	delete = (req, res, next) => {
		const id = req.params.id;
		this.planPagoService.remove(id)
			.then(id => res.send(id))
			.catch(next)
	}

}
