import CuentaPruebaService from '../../domain/services/cuenta-prueba-service';
import ParameterError from '../../infraestructure/sdk/error/parameter-error';
import { isValidNumber, isValidObject } from '../../infraestructure/sdk/utils/validator';
import { getTokenFromRequest } from '../authorization/token';


export default class CuentaPruebaController {

	cuentaPruebaService: CuentaPruebaService;

	constructor(cuentaPruebaService: CuentaPruebaService) {
		this.cuentaPruebaService = cuentaPruebaService;
	}

	get = async (req, res, next) => {
		const token = getTokenFromRequest(req);
		if (!token) {
			next(new ParameterError('Error de parámetros'));
			return;
		}

		this.cuentaPruebaService.list(token)
			.then(data => res.send(data))
			.catch(next)
	}

	getById = async (req, res, next) => {
		const token = getTokenFromRequest(req);
		const id = req.params.id;
		if (!token || !isValidNumber(id, true)) {
			next(new ParameterError('Error de parámetros'));
			return;
		}
		
		this.cuentaPruebaService.findById(token, id)
			.then(row => res.send(row))
			.catch(next)
	}

	post = async (req, res, next) => {
		const token = getTokenFromRequest(req);
		const dataBody = {...req.body};
		if (!token || !isValidObject(dataBody)) {
			next(new ParameterError('Error de parámetros'));
			return;
		}

		this.cuentaPruebaService.add(token, dataBody)
			.then(row => res.send(row))
			.catch(next)
	}

	put = async (req, res, next) => {
		const token = getTokenFromRequest(req);
		const id = req.params.id;
		const dataBody = {...req.body};
		if (!token || !isValidNumber(id, true) || !isValidObject(dataBody)) {
			next(new ParameterError('Error de parámetros'));
			return;
		}

		this.cuentaPruebaService.modify(token, id, dataBody)
			.then(row => res.send(row))
			.catch(next)
	}

	delete = async (req, res, next) => {
		const token = getTokenFromRequest(req);
		const id = req.params.id;
		if (!token || !isValidNumber(id, true)) {
			next(new ParameterError('Error de parámetros'));
			return;
		}

		this.cuentaPruebaService.remove(token, id)
			.then(id => res.send(id))
			.catch(next)
	}

}
