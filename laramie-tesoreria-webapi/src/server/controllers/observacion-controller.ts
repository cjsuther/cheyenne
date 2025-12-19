import ProcessError from '../../infraestructure/sdk/error/process-error';
import Observacion from '../../domain/entities/observacion';
import ObservacionService from '../../domain/services/observacion-service';
import UnauthorizedError from '../../infraestructure/sdk/error/unauthorized-error';
import { getTokenFromRequest, verifyAccessToken } from '../authorization/token';

export default class ObservacionController {

	observacionService: ObservacionService;

	constructor(observacionService: ObservacionService) {
		this.observacionService = observacionService;
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
		const observacion = new Observacion();
		try {
			observacion.setFromObject(dataBody);
		}
		catch (error) {
			next(new ProcessError('Error procesando parámetros', error));
			return;
		}
		this.observacionService.add(dataToken.idUsuario, observacion)
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
