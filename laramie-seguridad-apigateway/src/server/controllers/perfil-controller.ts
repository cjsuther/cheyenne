import PerfilService from '../../domain/services/perfil-service';
import ParameterError from '../../infraestructure/sdk/error/parameter-error';
import { isValidNumber, isValidObject, isValidArray } from '../../infraestructure/sdk/utils/validator';
import { getTokenFromRequest } from '../authorization/token';


export default class PerfilController {

  perfilService: PerfilService;

  constructor(perfilService: PerfilService) {
    this.perfilService = perfilService;
  }

  get = (req, res, next) => {
    const token = getTokenFromRequest(req);
    if (!token) {
      next(new ParameterError('Error de parámetros'));
      return;
    }

    this.perfilService.list(token)
      .then(data => res.send(data))
      .catch(next)
  }

  getByUsuario = (req, res, next) => {
    const token = getTokenFromRequest(req);
    const idUsuario = req.params.idUsuario;
    if (!token || !isValidNumber(idUsuario, true)) {
      next(new ParameterError('Error de parámetros'));
      return;
    }

    this.perfilService.listByUsuario(token, idUsuario)
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
    
    this.perfilService.findById(token, id)
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

    this.perfilService.add(token, dataBody)
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

    this.perfilService.modify(token, id, dataBody)
      .then(row => res.send(row))
      .catch(next)
  }

  delete = (req, res, next) => {
    const token = getTokenFromRequest(req);
    const id = req.params.id;
    if (!token || !isValidNumber(id, true)) {
      next(new ParameterError('Error de parámetros'));
      return;
    }

    this.perfilService.remove(token, id)
      .then(id => res.send(id))
      .catch(next)
  }

  putBindPermisos = (req, res, next) => {
    const token = getTokenFromRequest(req);
    const id = req.params.id;
    const dataBody = {...req.body};
    if (!token || !isValidNumber(id, true) || !isValidObject(dataBody) || !isValidArray(dataBody.permisos)) {
      next(new ParameterError('Error de parámetros'));
      return;
    }

    this.perfilService.bindPermisos(token, id, dataBody)
      .then(row => res.send(row))
      .catch(next)
  }

  putUnindPermisos = (req, res, next) => {
    const token = getTokenFromRequest(req);
    const id = req.params.id;
    const dataBody = {...req.body};
    if (!token || !isValidNumber(id, true) || !isValidObject(dataBody) || !isValidArray(dataBody.permisos)) {
      next(new ParameterError('Error de parámetros'));
      return;
    }

    this.perfilService.unbindPermisos(token, id, dataBody)
      .then(row => res.send(row))
      .catch(next)
  }

}
