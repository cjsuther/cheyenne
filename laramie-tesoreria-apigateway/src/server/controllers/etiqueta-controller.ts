import EtiquetaService from '../../domain/services/etiqueta-service';
import ParameterError from '../../infraestructure/sdk/error/parameter-error';
import { isValidNumber, isValidObject, isValidString } from '../../infraestructure/sdk/utils/validator';
import { getTokenFromRequest } from '../authorization/token';


export default class EtiquetaController {

	etiquetaService: EtiquetaService;

	constructor(etiquetaService: EtiquetaService) {
		this.etiquetaService = etiquetaService;
	}

	post = (req, res, next) => {
		const token = getTokenFromRequest(req);
		const dataBody = {...req.body};
		if (!token || !isValidObject(dataBody)) {
			next(new ParameterError('Error de parámetros'));
			return;
		}

		this.etiquetaService.add(token, dataBody)
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

		this.etiquetaService.remove(token, id)
			.then(id => res.send(id))
			.catch(next)
	}

}
