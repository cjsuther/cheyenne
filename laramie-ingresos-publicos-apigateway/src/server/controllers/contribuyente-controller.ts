import ContribuyenteService from '../../domain/services/contribuyente-service';
import ParameterError from '../../infraestructure/sdk/error/parameter-error';
import { isValidNumber, isValidObject } from '../../infraestructure/sdk/utils/validator';
import { getTokenFromRequest } from '../authorization/token';


export default class ContribuyenteController {

	contribuyenteService: ContribuyenteService;

	constructor(contribuyenteService: ContribuyenteService) {
		this.contribuyenteService = contribuyenteService;
	}

	get = (req, res, next) => {
		const token = getTokenFromRequest(req);
		if (!token) {
			next(new ParameterError('Error de parámetros'));
			return;
		}

		this.contribuyenteService.list(token)
			.then(data => res.send(data))
			.catch(next)
	}

	getByCuenta = (req, res, next) => {
		const token = getTokenFromRequest(req);
		const idCuenta = req.params.idCuenta;
		if (!token || !isValidNumber(idCuenta, true)) {
			next(new ParameterError('Error de parámetros'));
			return;
		}
		
		this.contribuyenteService.listByCuenta(token, idCuenta)
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
		
		this.contribuyenteService.findById(token, id)
			.then(row => res.send(row))
			.catch(next)
	}

	getByPersona = (req, res, next) => {
		const token = getTokenFromRequest(req);
		const idPersona = req.params.idPersona;
		if (!token || !isValidNumber(idPersona, true)) {
			next(new ParameterError('Error de parámetros'));
			return;
		}
		
		this.contribuyenteService.findByPersona(token, idPersona)
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

		this.contribuyenteService.add(token, dataBody)
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

		this.contribuyenteService.modify(token, id, dataBody)
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

		this.contribuyenteService.remove(token, id)
			.then(id => res.send(id))
			.catch(next)
	}

}
