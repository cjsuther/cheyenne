import ImportadorService from '../../domain/services/importador-service';
import ParameterError from '../../infraestructure/sdk/error/parameter-error';
import { isValidObject } from '../../infraestructure/sdk/utils/validator';
import { getTokenFromRequest } from '../authorization/token';

export default class ImportadorController {

	importadorService: ImportadorService;

	constructor(importadorService: ImportadorService) {
		this.importadorService = importadorService;
	}

	put = (req, res, next) => {
		const token = getTokenFromRequest(req);
		const tipo = req.params.tipo;
		const dataBody = {...req.body};
		if (!token || tipo.length === 0 || !isValidObject(dataBody)) {
			next(new ParameterError('Error de parámetros'));
			return;
		}

		this.importadorService.import(token, tipo, dataBody)
		.then(data => res.send(data))
		.catch(next)
	}

}
