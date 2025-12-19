import EmisionAprobacion from '../../domain/entities/emision-aprobacion';
import EmisionAprobacionService from '../../domain/services/emision-aprobacion-service';
import UnauthorizedError from '../../infraestructure/sdk/error/unauthorized-error';
import { getTokenFromRequest, verifyAccessToken } from '../authorization/token';

export default class EmisionAprobacionController {

	emisionAprobacionService: EmisionAprobacionService;

	constructor(emisionAprobacionService: EmisionAprobacionService) {
		this.emisionAprobacionService = emisionAprobacionService;
	}

	getByEmisionEjecucion = (req, res, next) => {
		const idEmisionEjecucion = req.params.idEmisionEjecucion;
		this.emisionAprobacionService.findByEmisionEjecucion(idEmisionEjecucion)
			.then(row => res.send(row))
			.catch(next)
	}

	getById = (req, res, next) => {
		const id = req.params.id;
		this.emisionAprobacionService.findById(id)
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
		const action = req.params.action;
		this.emisionAprobacionService.modifyAction(id, dataToken.idUsuario, action)
			.then(row => res.send(row))
			.catch(next)
	}

	putAsync = (req, res, next) => {
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
		const action = req.params.action;
		const fechaProceso = new Date(req.params.fechaProceso);
		this.emisionAprobacionService.modifyActionAsync(id, dataToken.idUsuario, action, fechaProceso)
			.then(row => res.send(row))
			.catch(next)
	}

}
