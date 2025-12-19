import FondeaderoService from '../../domain/services/fondeadero-service';
import ParameterError from '../../infraestructure/sdk/error/parameter-error';
import { isValidNumber, isValidObject } from '../../infraestructure/sdk/utils/validator';
import { getTokenFromRequest } from '../authorization/token';


export default class FondeaderoController {

  fondeaderoService: FondeaderoService;

  constructor(fondeaderoService: FondeaderoService) {
    this.fondeaderoService = fondeaderoService;
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

    this.fondeaderoService.listByCuenta(token, numeroCuenta, numeroWeb, numeroDocumento, idPersona, etiqueta)
      .then(data => res.send(data))
      .catch(next)
  }

  getByDatos = (req, res, next) => {
    const token = getTokenFromRequest(req);
    const idTasa = req.query.idTasa;
    const idSubTasa = req.query.idSubTasa;
    const embarcacion = req.query.embarcacion;
    if (!token) {
      next(new ParameterError('Error de parámetros'));
      return;
    }

    this.fondeaderoService.listByDatos(token, idTasa, idSubTasa, embarcacion)
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
    
    this.fondeaderoService.findById(token, id)
      .then(row => res.send(row))
      .catch(next)
  }

  post = (req, res, next) => {
    const token = getTokenFromRequest(req);
    const dataBody = {...req.body};
    if (!token || !isValidObject(dataBody) || !isValidObject(dataBody.fondeadero) || !isValidObject(dataBody.cuenta)) {
      next(new ParameterError('Error de parámetros'));
      return;
    }

    this.fondeaderoService.add(token, dataBody)
      .then(row => res.send(row))
      .catch(next)
  }

  put = (req, res, next) => {
    const token = getTokenFromRequest(req);
    const id = req.params.id;
    const dataBody = {...req.body};
    if (!token || !isValidNumber(id, true) || !isValidObject(dataBody) || !isValidObject(dataBody.fondeadero) || !isValidObject(dataBody.cuenta)) {
      next(new ParameterError('Error de parámetros'));
      return;
    }

    this.fondeaderoService.modify(token, id, dataBody)
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

    this.fondeaderoService.remove(token, id)
      .then(id => res.send(id))
      .catch(next)
  }

}
