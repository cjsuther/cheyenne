import PersonaService from '../../domain/services/persona-service';
import ParameterError from '../../infraestructure/sdk/error/parameter-error';
import { isValidNumber } from '../../infraestructure/sdk/utils/validator';
import { getTokenFromRequest } from '../authorization/token';


export default class PersonaController {

  personaService: PersonaService;

  constructor(personaService: PersonaService) {
    this.personaService = personaService;
  }

	getByFilter = (req, res, next) => {
		const token = getTokenFromRequest(req);
    let idTipoPersona = req.query.idTipoPersona;
		const numeroDocumento = req.query.numeroDocumento;
		const nombrePersona = req.query.nombrePersona;
		const etiqueta = req.query.etiqueta;
		if (!token || !isValidNumber(idTipoPersona, false)) {
		  next(new ParameterError('Error de parámetros'));
		  return;
		}
    idTipoPersona = parseInt(idTipoPersona);
	
		this.personaService.listByFilter(token, idTipoPersona, numeroDocumento, nombrePersona, etiqueta)
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
    
    this.personaService.findById(token, id)
      .then(row => res.send(row))
      .catch(next)
  }

}
