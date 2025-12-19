import EmisionEjecucionDTO from '../../domain/dto/emision-ejecucion-dto';
import EmisionEjecucionFilter from '../../domain/dto/emision-ejecucion-filter';
import EmisionEjecucion from '../../domain/entities/emision-ejecucion';
import EmisionEjecucionService from '../../domain/services/emision-ejecucion-service';
import UnauthorizedError from '../../infraestructure/sdk/error/unauthorized-error';
import { getTokenFromRequest, verifyAccessToken } from '../authorization/token';

export default class EmisionEjecucionController {

	emisionEjecucionService: EmisionEjecucionService;

	constructor(emisionEjecucionService: EmisionEjecucionService) {
		this.emisionEjecucionService = emisionEjecucionService;
	}

	get = (req, res, next) => {
		this.emisionEjecucionService.list()
			.then(data => res.send(data))
			.catch(next)
	}

	getByFilter = (req, res, next) => {
		let emisionEjecucionFilter = new EmisionEjecucionFilter();
		emisionEjecucionFilter.idEmisionDefinicion = req.query.idEmisionDefinicion;
		emisionEjecucionFilter.idTipoTributo = req.query.idTipoTributo;
		emisionEjecucionFilter.numero = req.query.numero;
		emisionEjecucionFilter.descripcion = req.query.descripcion;
		emisionEjecucionFilter.periodo = req.query.periodo;
		emisionEjecucionFilter.etiqueta = req.query.etiqueta;
		
		this.emisionEjecucionService.listByFilter(emisionEjecucionFilter)
			.then(data => res.send(data))
			.catch(next)
	}

	getByEmisionDefinicion = (req, res, next) => {
		const idEmisionDefinicion = req.params.idEmisionDefinicion;
		this.emisionEjecucionService.listByEmisionDefinicion(idEmisionDefinicion)
			.then(data => res.send(data))
			.catch(next)
	}

	getById = (req, res, next) => {
		const id = req.params.id;
		this.emisionEjecucionService.findById(id)
			.then(row => res.send(row))
			.catch(next)
	}

	post = (req, res, next) => {
		const dataBody = {...req.body};
		const emisionEjecucion = new EmisionEjecucionDTO(); emisionEjecucion.setFromObject(dataBody);
		this.emisionEjecucionService.add(emisionEjecucion)
			.then(row => res.send(row))
			.catch(next)
	}

	postMostradorWeb = (req, res, next) => {
		const idCuenta = parseInt(req.params.idCuenta);
		const dataBody = {...req.body};
		const emisionEjecucion = new EmisionEjecucionDTO(); emisionEjecucion.setFromObject(dataBody);
		this.emisionEjecucionService.addMostradorWeb(idCuenta, emisionEjecucion)
			.then(row => res.send(row))
			.catch(next)
	}

	put = (req, res, next) => {
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

		const id = req.params.id;
		const dataBody = {...req.body};
		const emisionEjecucion = new EmisionEjecucionDTO(); emisionEjecucion.setFromObject(dataBody);
		this.emisionEjecucionService.modify(id, dataToken.idUsuario, emisionEjecucion)
			.then(row => res.send(row))
			.catch(next)
	}
	

	putExecute = (req, res, next) => {
		const id = req.params.id;
		this.emisionEjecucionService.modifyExecute(id)
			.then(row => res.send(row))
			.catch(next)
	}

	putStart = (req, res, next) => {
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

		const id = req.params.id;
		this.emisionEjecucionService.modifyStart(id, dataToken.idUsuario, false)
			.then(row => res.send(row))
			.catch(next)
	}

	putContinue = (req, res, next) => {
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

		const id = req.params.id;
		this.emisionEjecucionService.modifyStart(id, dataToken.idUsuario, true)
			.then(row => res.send(row))
			.catch(next)
	}

	putStop = (req, res, next) => {
		const id = req.params.id;
		this.emisionEjecucionService.modifyStop(id)
			.then(row => res.send(row))
			.catch(next)
	}

	putPause = (req, res, next) => {
		const id = req.params.id;
		this.emisionEjecucionService.modifyPause(id)
			.then(row => res.send(row))
			.catch(next)
	}
	

	delete = (req, res, next) => {
		const id = req.params.id;
		this.emisionEjecucionService.remove(id)
			.then(id => res.send(id))
			.catch(next)
	}

}
