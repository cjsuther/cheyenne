import CuentaService from '../../domain/services/cuenta-service';
import ParameterError from '../../infraestructure/sdk/error/parameter-error';
import { isValidNumber, isValidObject } from '../../infraestructure/sdk/utils/validator';
import { getTokenFromRequest } from '../authorization/token';


export default class CuentaController {

  cuentaService: CuentaService;

  constructor(cuentaService: CuentaService) {
    this.cuentaService = cuentaService;
  }

  get = (req, res, next) => {
    const token = getTokenFromRequest(req);
    if (!token) {
      next(new ParameterError('Error de parámetros'));
      return;
    }

    this.cuentaService.list(token)
      .then(data => res.send(data))
      .catch(next)
  }

  getByFilter = (req, res, next) => {
    const token = getTokenFromRequest(req);
    const idCuenta = req.query.idCuenta;
    const idTipoTributo = req.query.idTipoTributo;
    const numeroCuenta = req.query.numeroCuenta;
    const numeroWeb = req.query.numeroWeb;
    const idPersona = req.query.idPersona;
    const etiqueta = req.query.etiqueta;
    if (!token || !isValidNumber(idCuenta, false) || !isValidNumber(idTipoTributo, false) || !isValidNumber(idPersona, false)) {
      next(new ParameterError('Error de parámetros'));
      return;
    }

    this.cuentaService.listByFilter(token, idCuenta, idTipoTributo, numeroCuenta, numeroWeb, idPersona, etiqueta)
      .then(data => res.send(data))
      .catch(next)
  }

  getByPersona = (req, res, next) => {
    const token = getTokenFromRequest(req);
    const idPersona = req.params.idPersona;
    if (!token || !isValidNumber(idPersona, true)) {
      next(new ParameterError('Error de parámetros'));
      return;
    }

    this.cuentaService.listByPersona(token, idPersona)
      .then(data => res.send(data))
      .catch(next)
  }

  getByContribuyente = (req, res, next) => {
    const token = getTokenFromRequest(req);
    const idContribuyente = req.params.idContribuyente;
    if (!token || !isValidNumber(idContribuyente, true)) {
      next(new ParameterError('Error de parámetros'));
      return;
    }

    this.cuentaService.listByContribuyente(token, idContribuyente)
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
    
    this.cuentaService.findById(token, id)
      .then(row => res.send(row))
      .catch(next)
  }

  getDataById = (req, res, next) => {
    const token = getTokenFromRequest(req);
    const id = req.params.id;
    if (!token || !isValidNumber(id, true)) {
      next(new ParameterError('Error de parámetros'));
      return;
    }
    
    this.cuentaService.findDataById(token, id)
      .then(row => res.send(row))
      .catch(next)
  }

  putBajaById = (req, res, next) => {
    const token = getTokenFromRequest(req);
    const id = req.params.id;
    if (!token || !isValidNumber(id, true)) {
      next(new ParameterError('Error de parámetros'));
      return;
    }

    this.cuentaService.modifyBajaById(token, id)
      .then(row => res.send(row))
      .catch(next)
  }

}
