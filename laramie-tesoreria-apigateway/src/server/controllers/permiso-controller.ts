import PermisoService from '../../domain/services/permiso-service';
import ParameterError from '../../infraestructure/sdk/error/parameter-error';
import { getTokenFromRequest, verifyAccessToken } from '../authorization/token';


export default class PermisoController {

	permisoService: PermisoService;

	constructor(permisoService: PermisoService) {
		this.permisoService = permisoService;
	}

	get = (req, res, next) => {
		const token = getTokenFromRequest(req);
		if (!token) {
		  next(new ParameterError('Error de parámetros'));
		  return;
		}
	
		this.permisoService.list(token)
		  .then(data => res.send(data))
		  .catch(next)
	}

	getByUsuario = (req, res, next) => {
		const token = getTokenFromRequest(req);
		if (!token) {
			next(new ParameterError('Error de parámetros'));
			return;
		}

		const dataToken = verifyAccessToken(token);
        const idUsuario = dataToken.idUsuario;
		
		this.permisoService.listByUsuario(token, idUsuario)
			.then(row => res.send(row))
			.catch(next)
	}

}
