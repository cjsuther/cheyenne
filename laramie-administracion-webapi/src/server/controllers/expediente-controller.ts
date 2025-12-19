import ExpedienteDTO from '../../domain/dto/expediente-dto';
import ExpedienteFilter from '../../domain/dto/expediente-filter';
import ExpedienteService from '../../domain/services/expediente-service';
import UnauthorizedError from '../../infraestructure/sdk/error/unauthorized-error';
import { getTokenFromRequest, verifyAccessToken } from '../authorization/token';

export default class ExpedienteController {

	expedienteService: ExpedienteService;

	constructor(expedienteService: ExpedienteService) {
		this.expedienteService = expedienteService;
	}

	get = (req, res, next) => {
		this.expedienteService.list()
			.then(data => res.send(data))
			.catch(next)
	}

	getByFilter = (req, res, next) => {
		let expedienteFilter = new ExpedienteFilter();
		expedienteFilter.idTipoExpediente = req.query.idTipoExpediente;
		expedienteFilter.expediente = req.query.expediente;
		expedienteFilter.etiqueta = req.query.etiqueta;
		
		this.expedienteService.listByFilter(expedienteFilter)
			.then(data => res.send(data))
			.catch(next)
	}

	getById = (req, res, next) => {
		const id = req.params.id;
		this.expedienteService.findById(id)
			.then(row => res.send(row))
			.catch(next)
	}

	post = (req, res, next) => {
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

		const dataBody = {...req.body};
		const expedienteDTO = new ExpedienteDTO(); expedienteDTO.setFromObject(dataBody);
		this.expedienteService.add(dataToken.idUsuario, expedienteDTO)
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
		const expedienteDTO = new ExpedienteDTO(); expedienteDTO.setFromObject(dataBody);
		this.expedienteService.modify(id, dataToken.idUsuario, expedienteDTO)
			.then(row => res.send(row))
			.catch(next)
	}

	delete = (req, res, next) => {
		const id = req.params.id;
		this.expedienteService.remove(id)
			.then(id => res.send(id))
			.catch(next)
	}

}
