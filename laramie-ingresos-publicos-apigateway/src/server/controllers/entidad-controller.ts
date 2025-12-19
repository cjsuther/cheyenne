import EntidadService from '../../domain/services/entidad-service';
import ParameterError from '../../infraestructure/sdk/error/parameter-error';
import { isValidNumber, isValidObject, isValidString } from '../../infraestructure/sdk/utils/validator';
import { getTokenFromRequest } from '../authorization/token';


export default class EntidadController {

  entidadService: EntidadService;

  constructor(entidadService: EntidadService) {
    this.entidadService = entidadService;
  }

  getByDefinition = (req, res, next) => {
    const token = getTokenFromRequest(req);
    if (!token) {
      next(new ParameterError('Error de parámetros'));
      return;
    }

    this.entidadService.listByDefinicion(token)
      .then(data => res.send(data))
      .catch(next)
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

  getByTiposFilter = (req, res, next) => {
    const token = getTokenFromRequest(req);
    const tipos = req.params.tipos;
    const idFilter = req.query.idFilter;
    if (!token || !isValidString(tipos, true) || !isValidNumber(idFilter, false)) {
      next(new ParameterError('Error de parámetros'));
      return;
    }

    this.entidadService.listByTiposFilter(token, tipos, idFilter)
      .then(data => res.send(data))
      .catch(next)
  }

  getById = (req, res, next) => {
		const token = getTokenFromRequest(req);
    const tipo = req.params.tipo;
		const id = req.params.id;
		if (!token || !isValidString(tipo, true) || !isValidNumber(id, true)) {
			next(new ParameterError('Error de parámetros'));
			return;
		}
		
		this.entidadService.findById(token, tipo, id)
			.then(row => res.send(row))
			.catch(next)
	}

  post = (req, res, next) => {
		const token = getTokenFromRequest(req);
    const tipo = req.params.tipo;
		const dataBody = {...req.body};
		if (!token || !isValidString(tipo, true) || !isValidObject(dataBody)) {
			next(new ParameterError('Error de parámetros'));
			return;
		}

		this.entidadService.add(token, tipo, dataBody)
			.then(row => res.send(row))
			.catch(next)
	}

	put = (req, res, next) => {
		const token = getTokenFromRequest(req);
    const tipo = req.params.tipo;
		const id = req.params.id;
		const dataBody = {...req.body};
		if (!token || !isValidString(tipo, true) || !isValidNumber(id, true) || !isValidObject(dataBody)) {
			next(new ParameterError('Error de parámetros'));
			return;
		}

		this.entidadService.modify(token, tipo, id, dataBody)
			.then(row => res.send(row))
			.catch(next)
	}

	delete = (req, res, next) => {
		const token = getTokenFromRequest(req);
    const tipo = req.params.tipo;
		const id = req.params.id;
		if (!token || !isValidString(tipo, true) || !isValidNumber(id, true)) {
			next(new ParameterError('Error de parámetros'));
			return;
		}

		this.entidadService.remove(token, tipo, id)
			.then(id => res.send(id))
			.catch(next)
	}

}
