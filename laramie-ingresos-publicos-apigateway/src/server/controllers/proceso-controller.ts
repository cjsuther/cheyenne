import ProcesoService from '../../domain/services/proceso-service';
import ParameterError from '../../infraestructure/sdk/error/parameter-error';
import { isValidNumber, isValidObject, isValidString } from '../../infraestructure/sdk/utils/validator';
import { getTokenFromRequest } from '../authorization/token';


export default class ProcesoController {

	procesoService: ProcesoService;

	constructor(procesoService: ProcesoService) {
		this.procesoService = procesoService;
	}

	get = (req, res, next) => {
		const token = getTokenFromRequest(req);
		if (!token) {
			next(new ParameterError('Error de parámetros'));
			return;
		}

		this.procesoService.list(token)
			.then(data => res.send(data))
			.catch(next)
	}

	getByEmisionEjecucion = (req, res, next) => {
		const token = getTokenFromRequest(req);
		const idEmisionEjecucion = req.params.idEmisionEjecucion;
		if (!token || !isValidNumber(idEmisionEjecucion, true)) {
			next(new ParameterError('Error de parámetros'));
			return;
		}

		this.procesoService.listByEmisionEjecucion(token, idEmisionEjecucion)
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
		
		this.procesoService.findById(token, id)
			.then(row => res.send(row))
			.catch(next)
	}

	getByIdentificador = (req, res, next) => {
		const token = getTokenFromRequest(req);
		const identificador = req.params.identificador;
		if (!token || !isValidString(identificador, true)) {
			next(new ParameterError('Error de parámetros'));
			return;
		}
		
		this.procesoService.findByIdentificador(token, identificador)
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

		this.procesoService.add(token, dataBody)
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

		this.procesoService.modify(token, id, dataBody)
			.then(row => res.send(row))
			.catch(next)
	}

	putVerify = (req, res, next) => {
		const token = req.params.token;
		if (!token) {
			next(new ParameterError('Error de parámetros'));
			return;
		}

		this.procesoService.modifyVerify(token)
			.then(row => res.send(row))
			.catch(next)
	}

	putExecute = (req, res, next) => {
		const token = getTokenFromRequest(req);
		const identificador = req.params.identificador;
		if (!token || !isValidString(identificador, true)) {
			next(new ParameterError('Error de parámetros'));
			return;
		}

		this.procesoService.modifyExecute(token, identificador)
			.then(row => res.send(row))
			.catch(next)
	}

	putCancel = (req, res, next) => {
		const token = getTokenFromRequest(req);
		const identificador = req.params.identificador;
		if (!token || !isValidString(identificador, true)) {
			next(new ParameterError('Error de parámetros'));
			return;
		}

		this.procesoService.modifyCancel(token, identificador)
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

		this.procesoService.remove(token, id)
			.then(id => res.send(id))
			.catch(next)
	}

}
