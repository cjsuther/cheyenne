import PermisoService from '../../domain/services/permiso-service';
import ParameterError from '../../infraestructure/sdk/error/parameter-error';
import { isValidNumber, isValidObject } from '../../infraestructure/sdk/utils/validator';
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

  getById = (req, res, next) => {
    const token = getTokenFromRequest(req);
    const id = req.params.id;
    if (!token || !isValidNumber(id, true)) {
      next(new ParameterError('Error de parámetros'));
      return;
    }
    
    this.permisoService.findById(token, id)
      .then(row => res.send(row))
      .catch(next)
  }

  getByPerfil = (req, res, next) => {
    const token = getTokenFromRequest(req);
    const idPerfil = req.params.idPerfil;
    if (!token || !isValidNumber(idPerfil, true)) {
      next(new ParameterError('Error de parámetros'));
      return;
    }

    this.permisoService.listByPerfil(token, idPerfil)
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