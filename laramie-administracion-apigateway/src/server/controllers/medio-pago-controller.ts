import MedioPagoService from '../../domain/services/medio-pago-service';
import ParameterError from '../../infraestructure/sdk/error/parameter-error';
import { isValidNumber, isValidObject } from '../../infraestructure/sdk/utils/validator';
import { getTokenFromRequest } from '../authorization/token';


export default class MedioPagoController {

	medioPagoService: MedioPagoService;

	constructor(medioPagoService: MedioPagoService) {
		this.medioPagoService = medioPagoService;
	}

	get = (req, res, next) => {
		const token = getTokenFromRequest(req);
		if (!token) {
			next(new ParameterError('Error de parámetros'));
			return;
		}

		this.medioPagoService.list(token)
			.then(data => res.send(data))
			.catch(next)
	}

	getByPersona = (req, res, next) => {
		const token = getTokenFromRequest(req);
		const idTipoPersona = req.params.idTipoPersona;
		const idPersona = req.params.idPersona;
		if (!token || !isValidNumber(idTipoPersona, true) || !isValidNumber(idPersona, true)) {
		  next(new ParameterError('Error de parámetros'));
		  return;
		}
	
		this.medioPagoService.listByPersona(token, idTipoPersona, idPersona)
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
		
		this.medioPagoService.findById(token, id)
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

		this.medioPagoService.add(token, dataBody)
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

		this.medioPagoService.modify(token, id, dataBody)
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

		this.medioPagoService.remove(token, id)
			.then(id => res.send(id))
			.catch(next)
	}

}
