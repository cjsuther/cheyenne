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
      .then(row => res.send(row))
      .catch(next)
  }

  getChangePassword = async (req, res, next) => {
    this.usuarioService.getChangePassword(req.params.login)
      .then(row => res.send(row))
      .catch(next)
	}

  post = (req, res, next) => {
    const token = getTokenFromRequest(req);
    const dataBody = {...req.body};
    if (!token || !isValidObject(dataBody)) {
      next(new ParameterError('Error de parámetros'));
      return;
    }

    this.usuarioService.add(token, dataBody)
      .then(row => res.send(row))
      .catch(next)
  }

  put = (req, res, next) => {
    const token = getTokenFromRequest(req);
    const id = req.params.id;
    const dataBody = {...req.body};
    if (!token || !isValidNumber(id, true) || !isValidObject(dataBody)) {
      next(new ParameterError('Error de parámetros'));
      return;
    }

    this.usuarioService.modify(token, id, dataBody)
      .then(row => res.send(row))
      .catch(next)
  }

  putChangePassword = (req, res, next) => {
    const passwordToken = req.params.token
    const password = req.body.password

    this.usuarioService.putChangePassword(passwordToken, password)
      .then(data => res.send(data))
      .catch(next)
  }

  delete = (req, res, next) => {
    const token = getTokenFromRequest(req);
    const id = req.params.id;
    if (!token || !isValidNumber(id, true)) {
      next(new ParameterError('Error de parámetros'));
      return;
    }

    this.usuarioService.remove(token, id)
      .then(id => res.send(id))
      .catch(next)
  }


  putBindPerfiles = (req, res, next) => {
    const token = getTokenFromRequest(req);
    const id = req.params.id;
    const dataBody = {...req.body};
    if (!token || !isValidNumber(id, true) || !isValidObject(dataBody) || !isValidArray(dataBody.perfiles)) {
      next(new ParameterError('Error de parámetros'));
      return;
    }

    this.usuarioService.bindPerfiles(token, id, dataBody)
      .then(row => res.send(row))
      .catch(next)
  }

  putUnindPerfiles = (req, res, next) => {
    const token = getTokenFromRequest(req);
    const id = req.params.id;
    const dataBody = {...req.body};
    if (!token || !isValidNumber(id, true) || !isValidObject(dataBody) || !isValidArray(dataBody.perfiles)) {
      next(new ParameterError('Error de parámetros'));
      return;
    }

    this.usuarioService.unbindPerfiles(token, id, dataBody)
      .then(row => res.send(row))
      .catch(next)
  }

  putFindIds = (req, res, next) => {
    const token = getTokenFromRequest(req);
    const dataBody = {...req.body};
    if (!token || !isValidObject(dataBody) ) {
      next(new ParameterError('Error de parámetros'));
      return;
    }

    this.usuarioService.findByIds(token, dataBody)
      .then(row => res.send(row))
      .catch(next)
  }

}
