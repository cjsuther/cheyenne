import ListaService from '../../domain/services/lista-service';
import ParameterError from '../../infraestructure/sdk/error/parameter-error';
import { isValidString } from '../../infraestructure/sdk/utils/validator';
import { getTokenFromRequest } from '../authorization/token';


export default class ListaController {

  listaService: ListaService;

  constructor(listaService: ListaService) {
    this.listaService = listaService;
  }

  getByTipos = (req, res, next) => {
    const token = getTokenFromRequest(req);
    const tipos = req.params.tipos;
    if (!token || !isValidString(tipos, true)) {
      next(new ParameterError('Error de parámetros'));
      return;
    }

    this.listaService.listByTipos(token, tipos)
      .then(data => res.send(data))
      .catch(next)
  }

}
