import EventoService from '../../domain/services/evento-service';
import ParameterError from '../../infraestructure/sdk/error/parameter-error';
import { isValidNumber, isValidObject } from '../../infraestructure/sdk/utils/validator';
import { getTokenFromRequest } from '../authorization/token';


export default class EventoController {

	eventoService: EventoService;

	constructor(eventoService: EventoService) {
		this.eventoService = eventoService;
	}

	getByFilter = (req, res, next) => {
		const token = getTokenFromRequest(req);
		const idTipoEvento = req.query.idTipoEvento??0;
		const idModulo = req.query.idModulo??0;
		const idUsuario = req.query.idUsuario??0;
		const fechaDesde = req.query.fechaDesde??"";
		const fechaHasta = req.query.fechaHasta??"";
		const origen = req.query.origen??"";
		const mensaje = req.query.mensaje??"";
		if (!token) {
			next(new ParameterError('Error de parámetros'));
			return;
		}

		this.eventoService.listByFilter(token, idTipoEvento, idModulo, idUsuario, fechaDesde, fechaHasta, origen, mensaje)
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
		
		this.eventoService.findById(token, id)
			.then(row => res.send(row))
			.catch(next)
	}

	getByBackId = async (req, res, next) => {
		const token = getTokenFromRequest(req);
		const id = req.params.id;
		if (!token || !isValidNumber(id, true)) {
			next(new ParameterError('Error de parámetros'));
			return;
		}
		
		this.eventoService.findByBackId(token, id)
			.then(row => res.send(row))
			.catch(next)
	}

	getByForwardId = async (req, res, next) => {
		const token = getTokenFromRequest(req);
		const id = req.params.id;
		if (!token || !isValidNumber(id, true)) {
			next(new ParameterError('Error de parámetros'));
			return;
		}
		
		this.eventoService.findByForwardId(token, id)
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

		this.eventoService.add(token, dataBody)
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

		this.eventoService.modify(token, id, dataBody)
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

		this.eventoService.remove(token, id)
			.then(id => res.send(id))
			.catch(next)
	}

}
