import PermisoService from '../../domain/services/permiso-service';
import ParameterError from '../../infraestructure/sdk/error/parameter-error';
import { getTokenFromRequest, verifyAccessToken } from '../authorization/token';


export default class PermisoController {

	permisoService: PermisoService;

	constructor(permisoService: PermisoService) {
		this.permisoService = permisoService;
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
