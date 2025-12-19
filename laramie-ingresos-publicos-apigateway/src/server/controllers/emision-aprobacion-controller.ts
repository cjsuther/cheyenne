import EmisionAprobacionService from '../../domain/services/emision-aprobacion-service';
import ParameterError from '../../infraestructure/sdk/error/parameter-error';
import { getDateNow, getDateSerialize } from '../../infraestructure/sdk/utils/convert';
import { isValidNumber, isValidObject, isValidString } from '../../infraestructure/sdk/utils/validator';
import { getTokenFromRequest } from '../authorization/token';


export default class EmisionAprobacionController {

	emisionAprobacionService: EmisionAprobacionService;

	constructor(emisionAprobacionService: EmisionAprobacionService) {
		this.emisionAprobacionService = emisionAprobacionService;
	}

	getByEmisionEjecucion = (req, res, next) => {
		const token = getTokenFromRequest(req);
		const idEmisionEjecucion = req.params.idEmisionEjecucion;
		if (!token || !isValidNumber(idEmisionEjecucion, true)) {
			next(new ParameterError('Error de parámetros'));
			return;
		}
		
		this.emisionAprobacionService.findByEmisionEjecucion(token, idEmisionEjecucion)
			.then(row => res.send(row))
			.catch(next)
	}

	getById = (req, res, next) => {
		const token = getTokenFromRequest(req);
		const id = req.params.id;
		if (!token || !isValidNumber(id, true)) {
			next(new ParameterError('Error de parámetros'));
			return;
		}
		
		this.emisionAprobacionService.findById(token, id)
			.then(row => res.send(row))
			.catch(next)
	}

	put = (req, res, next) => {
		const token = getTokenFromRequest(req);
		const id = req.params.id;
		const action = req.params.action;
		if (!token || !isValidNumber(id, true) || !isValidString(action, true)) {
			next(new ParameterError('Error de parámetros'));
			return;
		}

		this.emisionAprobacionService.modifyAction(token, id, action)
			.then(row => res.send(row))
			.catch(next)
	}

	putAsync = (req, res, next) => {
		const token = getTokenFromRequest(req);
		const id = req.params.id;
		const action = req.params.action;
		if (!token || !isValidNumber(id, true) || !isValidString(action, true)) {
			next(new ParameterError('Error de parámetros'));
			return;
		}
		const fechaProceso = (req.params.fechaProceso) ? req.params.fechaProceso : getDateSerialize(getDateNow(true));

		this.emisionAprobacionService.modifyActionAsync(token, id, action, fechaProceso)
			.then(row => res.send(row))
			.catch(next)
	}

}
