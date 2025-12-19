import UsuarioService from '../../domain/services/usuario-service';
import ParameterError from '../../infraestructure/sdk/error/parameter-error';
import { isValidNumber, isValidObject, isValidArray } from '../../infraestructure/sdk/utils/validator';
import { getTokenFromRequest } from '../authorization/token';


export default class UsuarioController {

  usuarioService: UsuarioService;

  constructor(usuarioService: UsuarioService) {
    this.usuarioService = usuarioService;
  }

  get = (req, res, next) => {
    const token = getTokenFromRequest(req);
    if (!token) {
      next(new ParameterError('Error de parámetros'));
      return;
    }

    this.usuarioService.list(token)
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
    
    this.usuarioService.findById(token, id)
      .then((usuario:any) => {
        usuario.identificadorFirmaDigital = "";
        usuario.imagenFirmaDigital = "";
        res.send(usuario)
      })
      .catch(next)
  }

}