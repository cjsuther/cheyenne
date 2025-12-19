import TasaService from '../../domain/services/tasa-service';
import ParameterError from '../../infraestructure/sdk/error/parameter-error';
import UnauthorizedError from '../../infraestructure/sdk/error/unauthorized-error';
import { isValidArray, isValidObject } from '../../infraestructure/sdk/utils/validator';
import { getTokenFromRequest } from '../authorization/token';


export default class TasaController {

  tasaService: TasaService;

  constructor(tasaService: TasaService) {
    this.tasaService = tasaService;
  }

  getTasa = (req, res, next) => {
    const token = getTokenFromRequest(req);
    if (!token) {
      next(new UnauthorizedError('Token inválido'));
      return;
    }

		this.tasaService.listTasa(token)
			.then(data => res.send(data))
			.catch(next)
	}

  getSubTasa = (req, res, next) => {
    const token = getTokenFromRequest(req);
    if (!token) {
      next(new UnauthorizedError('Token inválido'));
      return;
    }

		this.tasaService.listSubTasa(token)
			.then(data => res.send(data))
			.catch(next)
	}

  getSubTasaImputacion = (req, res, next) => {
    const token = getTokenFromRequest(req);
    const dataBody = {...req.body};
    if (!token || !isValidObject(dataBody) || !isValidArray(dataBody.codigoSubTasas)) {
      next(new ParameterError('Error de parámetros'));
      return;
    }

    this.tasaService.listSubTasaImputacion(token, dataBody.codigoSubTasas)
      .then(data => res.send(data))
      .catch(next)
  }

}
