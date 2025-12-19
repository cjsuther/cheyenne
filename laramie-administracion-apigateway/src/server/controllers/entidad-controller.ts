import EntidadService from '../../domain/services/entidad-service';
import ParameterError from '../../infraestructure/sdk/error/parameter-error';
import { isValidString } from '../../infraestructure/sdk/utils/validator';
import { getTokenFromRequest } from '../authorization/token';


export default class EntidadController {

  entidadService: EntidadService;

  constructor(entidadService: EntidadService) {
    this.entidadService = entidadService;
  }

  getByTipos = (req, res, next) => {
    const token = getTokenFromRequest(req);
    const tipos = req.params.tipos;
    if (!token || !isValidString(tipos, true)) {
      next(new ParameterError('Error de parámetros'));
      return;
    }

    this.entidadService.listByTipos(token, tipos)
      .then(data => res.send(data))
      .catch(next)
  }

}
