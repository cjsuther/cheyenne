import InmuebleService from '../../domain/services/inmueble-service';
import ParameterError from '../../infraestructure/sdk/error/parameter-error';
import { isValidNumber, isValidObject } from '../../infraestructure/sdk/utils/validator';
import { getTokenFromRequest } from '../authorization/token';


export default class InmuebleController {

  inmuebleService: InmuebleService;

  constructor(inmuebleService: InmuebleService) {
    this.inmuebleService = inmuebleService;
  }

  getByCuenta = (req, res, next) => {
    const token = getTokenFromRequest(req);
    const numeroCuenta = req.query.numeroCuenta;
    const numeroWeb = req.query.numeroWeb;
    const numeroDocumento = req.query.numeroDocumento;
    const idPersona = req.query.idPersona;
    const etiqueta = req.query.etiqueta;
    if (!token || !isValidNumber(idPersona, false)) {
      next(new ParameterError('Error de parámetros'));
      return;
    }

    this.inmuebleService.listByCuenta(token, numeroCuenta, numeroWeb, numeroDocumento, idPersona, etiqueta)
      .then(data => res.send(data))
      .catch(next)
  }

  getByUbicacion = (req, res, next) => {
    const token = getTokenFromRequest(req);
    const catastral = req.query.catastral;
    const direccion = req.query.direccion;
    if (!token) {
      next(new ParameterError('Error de parámetros'));
      return;
    }

    this.inmuebleService.listByUbicacion(token, catastral, direccion)
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
    
    this.inmuebleService.findById(token, id)
      .then(row => res.send(row))
      .catch(next)
  }

  post = (req, res, next) => {
    const token = getTokenFromRequest(req);
    const dataBody = {...req.body};
    if (!token || !isValidObject(dataBody) || !isValidObject(dataBody.inmueble) || !isValidObject(dataBody.cuenta)) {
      next(new ParameterError('Error de parámetros'));
      return;
    }

    this.inmuebleService.add(token, dataBody)
      .then(row => res.send(row))
      .catch(next)
  }

  put = (req, res, next) => {
    const token = getTokenFromRequest(req);
    const id = req.params.id;
    const dataBody = {...req.body};
    if (!token || !isValidNumber(id, true) || !isValidObject(dataBody) || !isValidObject(dataBody.inmueble) || !isValidObject(dataBody.cuenta)) {
      next(new ParameterError('Error de parámetros'));
      return;
    }

    this.inmuebleService.modify(token, id, dataBody)
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

    this.inmuebleService.remove(token, id)
      .then(id => res.send(id))
      .catch(next)
  }

}
