import ReciboPublicacionLoteService from '../../domain/services/recibo-publicacion-lote-service';
import ParameterError from '../../infraestructure/sdk/error/parameter-error';
import { isValidNumber, isValidObject, isValidString } from '../../infraestructure/sdk/utils/validator';
import { getTokenFromRequest } from '../authorization/token';


export default class ReciboPublicacionLoteController {

	reciboPublicacionLoteService: ReciboPublicacionLoteService;

	constructor(reciboPublicacionLoteService: ReciboPublicacionLoteService) {
		this.reciboPublicacionLoteService = reciboPublicacionLoteService;
	}

	get = async (req, res, next) => {
		const token = getTokenFromRequest(req);
		if (!token) {
			next(new ParameterError('Error de parámetros'));
			return;
		}

		this.reciboPublicacionLoteService.list(token)
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
		
		this.reciboPublicacionLoteService.findById(token, id)
			.then(row => res.send(row))
			.catch(next)
	}

	getReciboByNumero = async (req, res, next) => {
		const token = getTokenFromRequest(req);
		const codigoDelegacion = req.params.codigoDelegacion;
		const numeroRecibo = req.params.numeroRecibo;
		if (!token || !isValidString(codigoDelegacion, true) || !isValidNumber(numeroRecibo, true)) {
			next(new ParameterError('Error de parámetros'));
			return;
		}
		
		this.reciboPublicacionLoteService.findReciboByNumero(token, codigoDelegacion, numeroRecibo)
			.then(row => res.send(row))
			.catch(next)
	}

	getReciboByCodigoBarrasCliente = async (req, res, next) => {
		const token = getTokenFromRequest(req);
		const codigoBarrasCliente = req.params.codigoBarrasCliente;
		if (!token || !isValidString(codigoBarrasCliente, true)) {
			next(new ParameterError('Error de parámetros'));
			return;
		}
		
		this.reciboPublicacionLoteService.findReciboByCodigoBarrasCliente(token, codigoBarrasCliente)
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

		this.reciboPublicacionLoteService.add(token, dataBody)
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

		this.reciboPublicacionLoteService.modify(token, id, dataBody)
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

		this.reciboPublicacionLoteService.remove(token, id)
			.then(id => res.send(id))
			.catch(next)
	}

}
