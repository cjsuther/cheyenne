import EmisionEjecucionService from '../../domain/services/emision-ejecucion-service';
import ParameterError from '../../infraestructure/sdk/error/parameter-error';
import { isValidNumber, isValidObject } from '../../infraestructure/sdk/utils/validator';
import { getTokenFromRequest } from '../authorization/token';


export default class EmisionEjecucionController {

	emisionEjecucionService: EmisionEjecucionService;

	constructor(emisionEjecucionService: EmisionEjecucionService) {
		this.emisionEjecucionService = emisionEjecucionService;
	}

	get = (req, res, next) => {
		const token = getTokenFromRequest(req);
		if (!token) {
			next(new ParameterError('Error de parámetros'));
			return;
		}

		this.emisionEjecucionService.list(token)
			.then(data => res.send(data))
			.catch(next)
	}

	getByFilter = (req, res, next) => {
		const token = getTokenFromRequest(req);
		const idEmisionDefinicion = req.query.idEmisionDefinicion;
		const idTipoTributo = req.query.idTipoTributo;
		const numero = req.query.numero;
		const descripcion = req.query.descripcion;
		const periodo = req.query.periodo;
		const etiqueta = req.query.etiqueta;
		if (!token) {
			next(new ParameterError('Error de parámetros'));
			return;
		}

		this.emisionEjecucionService.listByFilter(token, idEmisionDefinicion, idTipoTributo, numero, descripcion, periodo, etiqueta)
			.then(data => res.send(data))
			.catch(next)
	}

	getByEmisionDefinicion = (req, res, next) => {
		const token = getTokenFromRequest(req);
		const idEmisionDefinicion = req.params.idEmisionDefinicion;
		if (!token) {
			next(new ParameterError('Error de parámetros'));
			return;
		}

		this.emisionEjecucionService.listByEmisionDefinicion(token, idEmisionDefinicion)
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
		
		this.emisionEjecucionService.findById(token, id)
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

		this.emisionEjecucionService.add(token, dataBody)
			.then(row => res.send(row))
			.catch(next)
	}

	postMostradorWeb = (req, res, next) => {
		const token = getTokenFromRequest(req);
		const idCuenta = req.params.idCuenta;
		const dataBody = {...req.body};
		if (!token || !isValidObject(dataBody)) {
			next(new ParameterError('Error de parámetros'));
			return;
		}

		this.emisionEjecucionService.addMostradorWeb(token, idCuenta, dataBody)
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

		this.emisionEjecucionService.modify(token, id, dataBody)
			.then(row => res.send(row))
			.catch(next)
	}


	putStart = (req, res, next) => {
		const token = getTokenFromRequest(req);
		const id = req.params.id;
		if (!token || !isValidNumber(id, true)) {
			next(new ParameterError('Error de parámetros'));
			return;
		}

		this.emisionEjecucionService.modifyStart(token, id)
			.then(row => res.send(row))
			.catch(next)
	}

	putContinue = (req, res, next) => {
		const token = getTokenFromRequest(req);
		const id = req.params.id;
		if (!token || !isValidNumber(id, true)) {
			next(new ParameterError('Error de parámetros'));
			return;
		}

		this.emisionEjecucionService.modifyContinue(token, id)
			.then(row => res.send(row))
			.catch(next)
	}

	putStop = (req, res, next) => {
		const token = getTokenFromRequest(req);
		const id = req.params.id;
		if (!token || !isValidNumber(id, true)) {
			next(new ParameterError('Error de parámetros'));
			return;
		}

		this.emisionEjecucionService.modifyStop(token, id)
			.then(row => res.send(row))
			.catch(next)
	}

	putPause = (req, res, next) => {
		const token = getTokenFromRequest(req);
		const id = req.params.id;
		if (!token || !isValidNumber(id, true)) {
			next(new ParameterError('Error de parámetros'));
			return;
		}

		this.emisionEjecucionService.modifyPause(token, id)
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

		this.emisionEjecucionService.remove(token, id)
			.then(id => res.send(id))
			.catch(next)
	}

}
