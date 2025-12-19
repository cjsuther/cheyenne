import ExpedienteService from '../../domain/services/expediente-service';
import ParameterError from '../../infraestructure/sdk/error/parameter-error';
import { isValidNumber } from '../../infraestructure/sdk/utils/validator';
import { getTokenFromRequest } from '../authorization/token';


export default class ExpedienteController {

  expedienteService: ExpedienteService;

  constructor(expedienteService: ExpedienteService) {
    this.expedienteService = expedienteService;
  }

	getByFilter = (req, res, next) => {
		const token = getTokenFromRequest(req);
    let idTipoExpediente = req.query.idTipoExpediente;
		const expediente = req.query.expediente;
		const etiqueta = req.query.etiqueta;
		if (!token || !isValidNumber(idTipoExpediente, false)) {
		  next(new ParameterError('Error de parámetros'));
		  return;
		}
    idTipoExpediente = parseInt(idTipoExpediente);
	
		this.expedienteService.listByFilter(token, idTipoExpediente, expediente, etiqueta)
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
    
    this.expedienteService.findById(token, id)
      .then(row => res.send(row))
      .catch(next)
  }

}
