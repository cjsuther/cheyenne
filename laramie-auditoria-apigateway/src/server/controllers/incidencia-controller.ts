import IncidenciaService from '../../domain/services/incidencia-service';
import ParameterError from '../../infraestructure/sdk/error/parameter-error';
import { isValidNumber, isValidObject } from '../../infraestructure/sdk/utils/validator';
import { getTokenFromRequest } from '../authorization/token';


export default class IncidenciaController {

	incidenciaService: IncidenciaService;

	constructor(incidenciaService: IncidenciaService) {
		this.incidenciaService = incidenciaService;
	}

	getByFilter = (req, res, next) => {
		const token = getTokenFromRequest(req);
		const idTipoIncidencia = req.query.idTipoIncidencia??0;
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

		this.incidenciaService.listByFilter(token, idTipoIncidencia, idModulo, idUsuario, fechaDesde, fechaHasta, origen, mensaje)
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
		
		this.incidenciaService.findById(token, id)
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
		
		this.incidenciaService.findByBackId(token, id)
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
		
		this.incidenciaService.findByForwardId(token, id)
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

		this.incidenciaService.add(token, dataBody)
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

		this.incidenciaService.modify(token, id, dataBody)
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

		this.incidenciaService.remove(token, id)
			.then(id => res.send(id))
			.catch(next)
	}

}
