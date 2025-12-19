import TipoActoProcesalService from '../../domain/services/tipo-acto-procesal-service';
import ParameterError from '../../infraestructure/sdk/error/parameter-error';
import { isValidArray, isValidNumber, isValidObject } from '../../infraestructure/sdk/utils/validator';
import { getTokenFromRequest } from '../authorization/token';


export default class TipoActoProcesalController {

	tipoActoProcesalService: TipoActoProcesalService;

	constructor(tipoActoProcesalService: TipoActoProcesalService) {
		this.tipoActoProcesalService = tipoActoProcesalService;
	}

	get = (req, res, next) => {
		const token = getTokenFromRequest(req);
		if (!token) {
			next(new ParameterError('Error de parámetros'));
			return;
		}

		this.tipoActoProcesalService.list(token)
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
		
		this.tipoActoProcesalService.findById(token, id)
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

		this.tipoActoProcesalService.add(token, dataBody)
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

		this.tipoActoProcesalService.modify(token, id, dataBody)
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

		this.tipoActoProcesalService.remove(token, id)
			.then(id => res.send(id))
			.catch(next)
	}

	putPlantillasDocumentos = (req, res, next) => {
		const token = getTokenFromRequest(req);
		const id = req.params.id;
		const dataBody = {...req.body};
		if (!token || !isValidNumber(id, true) || !isValidObject(dataBody) || !isValidArray(dataBody.plantillasDocumentos)) {
		  next(new ParameterError('Error de parámetros'));
		  return;
		}
	
		this.tipoActoProcesalService.modifyPlantillasDocumentos(token, id, dataBody)
		  .then(row => res.send(row))
		  .catch(next)
	}

}
