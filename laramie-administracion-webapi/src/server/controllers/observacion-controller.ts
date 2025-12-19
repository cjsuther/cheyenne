import Observacion from '../../domain/entities/observacion';
import ObservacionService from '../../domain/services/observacion-service';
import UnauthorizedError from '../../infraestructure/sdk/error/unauthorized-error';
import { getTokenFromRequest, verifyAccessToken } from '../authorization/token';

export default class ObservacionController {

	observacionService: ObservacionService;

	constructor(observacionService: ObservacionService) {
		this.observacionService = observacionService;
	}

	get = (req, res, next) => {
		this.observacionService.list()
			.then(data => res.send(data))
			.catch(next)
	}

	getByEntidad = (req, res, next) => {
		const entidad = req.params.entidad;
		const idEntidad = req.params.idEntidad;
		this.observacionService.listByEntidad(entidad, idEntidad)
			.then(data => res.send(data))
			.catch(next)
	}

	getById = (req, res, next) => {
		const id = req.params.id;
		this.observacionService.findById(id)
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
		const observacion = new Observacion(); observacion.setFromObject(dataBody);
		this.observacionService.add(dataToken.idUsuario, observacion)
			.then(row => res.send(row))
			.catch(next)
	}

	put = (req, res, next) => {
		const id = req.params.id;
		const dataBody = {...req.body};
		const observacion = new Observacion(); observacion.setFromObject(dataBody);
		this.observacionService.modify(id, observacion)
			.then(row => res.send(row))
			.catch(next)
	}

	delete = (req, res, next) => {
		const id = req.params.id;
		this.observacionService.remove(id)
			.then(id => res.send(id))
			.catch(next)
	}

}
