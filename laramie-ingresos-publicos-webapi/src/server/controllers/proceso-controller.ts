import Proceso from '../../domain/entities/proceso';
import ProcesoService from '../../domain/services/proceso-service';
import ParameterError from '../../infraestructure/sdk/error/parameter-error';
import UnauthorizedError from '../../infraestructure/sdk/error/unauthorized-error';
import { getTokenFromRequest, verifyAccessToken } from '../authorization/token';

export default class ProcesoController {

	procesoService: ProcesoService;

	constructor(procesoService: ProcesoService) {
		this.procesoService = procesoService;
	}

	get = (req, res, next) => {
		this.procesoService.list()
			.then(data => res.send(data))
			.catch(next)
	}

	getByEmisionEjecucion = (req, res, next) => {
		const idEmisionEjecucion = req.params.idEmisionEjecucion;
		this.procesoService.listByEmisionEjecucion(idEmisionEjecucion)
			.then(data => res.send(data))
			.catch(next)
	}

	getById = (req, res, next) => {
		const id = req.params.id;
		this.procesoService.findById(id)
			.then(row => res.send(row))
			.catch(next)
	}

	getByIdentificador = (req, res, next) => {
		const identificador = req.params.identificador;
		this.procesoService.findByIdentificador(identificador)
			.then(row => res.send(row))
			.catch(next)
	}

	post = (req, res, next) => {
		const dataBody = {...req.body};
		const proceso = new Proceso(); proceso.setFromObject(dataBody);
		this.procesoService.add(proceso)
			.then(row => res.send(row))
			.catch(next)
	}

	put = (req, res, next) => {
		const id = req.params.id;
		const dataBody = {...req.body};
		const proceso = new Proceso(); proceso.setFromObject(dataBody);
		this.procesoService.modify(id, proceso)
			.then(row => res.send(row))
			.catch(next)
	}

	putVerify = (req, res, next) => {
		const token = getTokenFromRequest(req);
		if (!token) {
			next(new UnauthorizedError('Token inválido'));
			return;
		}
		const dataToken = verifyAccessToken(token);
		if (!dataToken) {
			next(new UnauthorizedError('No se pudo obtener información del Token'));
			return;
		}

		this.procesoService.modifyVerify(dataToken.idUsuario, token)
			.then(result => res.send(result))
			.catch(next)
	}
	
	putExecute = (req, res, next) => {
		const token = getTokenFromRequest(req);
		if (!token) {
			next(new ParameterError('Error de parámetros'));
			return;
		}

		const identificador = req.params.identificador;
		this.procesoService.modifyExecute(token, identificador)
			.then(result => res.send(result))
			.catch(next)
	}

	putCancel = (req, res, next) => {
		const token = getTokenFromRequest(req);
		if (!token) {
			next(new ParameterError('Error de parámetros'));
			return;
		}

		const identificador = req.params.identificador;
		this.procesoService.modifyCancel(token, identificador)
			.then(result => res.send(result))
			.catch(next)
	}

	delete = (req, res, next) => {
		const id = req.params.id;
		this.procesoService.remove(id)
			.then(id => res.send(id))
			.catch(next)
	}

}
