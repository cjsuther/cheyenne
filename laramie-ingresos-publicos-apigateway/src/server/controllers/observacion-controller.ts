import ObservacionService from '../../domain/services/observacion-service';
import ParameterError from '../../infraestructure/sdk/error/parameter-error';
import { isValidNumber, isValidObject, isValidString } from '../../infraestructure/sdk/utils/validator';
import { getTokenFromRequest } from '../authorization/token';


export default class ObservacionController {

	observacionService: ObservacionService;

	constructor(observacionService: ObservacionService) {
		this.observacionService = observacionService;
	}

	get = (req, res, next) => {
		const token = getTokenFromRequest(req);
		if (!token) {
			next(new ParameterError('Error de parámetros'));
			return;
		}

		this.observacionService.list(token)
			.then(data => res.send(data))
			.catch(next)
	}

	getByEntidad = (req, res, next) => {
		const token = getTokenFromRequest(req);
		const entidad = req.params.entidad;
		const idEntidad = req.params.idEntidad;
		if (!token || !isValidString(entidad, true) || !isValidNumber(idEntidad, true)) {
			next(new ParameterError('Error de parámetros'));
			return;
		}

		this.observacionService.listByEntidad(token, entidad, idEntidad)
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
		
		this.observacionService.findById(token, id)
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

		this.observacionService.add(token, dataBody)
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

		this.observacionService.remove(token, id)
			.then(id => res.send(id))
			.catch(next)
	}

}
